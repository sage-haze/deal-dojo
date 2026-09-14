import {
  error,
  generateClientReply,
  getConversation,
  getMessages,
  json,
  nowIso,
  readJson,
  requireTrainingConfig,
  type Env,
} from '../../_lib';

type Body = { content?: string };

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const id = String(context.params.id || '');
    const body = await readJson<Body>(context.request);
    const content = body.content?.trim();
    if (!content) return error('Message content is required.');
    if (content.length > 8000) return error('Message is too long (maximum 8,000 characters).');

    const conversation = await getConversation(context.env.AI_ROLEPLAY_DB, id);
    if (!conversation) return error('Conversation not found.', 404);

    const { scenario, persona } = requireTrainingConfig(conversation);
    const existing = await getMessages(context.env.AI_ROLEPLAY_DB, id);
    const history = [
      ...existing.map((message) => ({ role: message.role, content: message.content })),
      { role: 'user' as const, content },
    ];

    const clientReply = await generateClientReply(
      context.env,
      scenario,
      persona,
      conversation.difficulty,
      history,
    );

    const nextSeq = existing.length ? existing[existing.length - 1].seq + 1 : 1;
    const now = nowIso();

    await context.env.AI_ROLEPLAY_DB.batch([
      context.env.AI_ROLEPLAY_DB.prepare(
        `INSERT INTO messages (conversation_id, seq, role, content, created_at)
         VALUES (?, ?, 'user', ?, ?)`,
      ).bind(id, nextSeq, content, now),
      context.env.AI_ROLEPLAY_DB.prepare(
        `INSERT INTO messages (conversation_id, seq, role, content, created_at)
         VALUES (?, ?, 'assistant', ?, ?)`,
      ).bind(id, nextSeq + 1, clientReply, now),
      context.env.AI_ROLEPLAY_DB.prepare(
        `UPDATE conversations SET status = 'active', updated_at = ? WHERE id = ?`,
      ).bind(now, id),
      context.env.AI_ROLEPLAY_DB.prepare(
        `INSERT INTO audit_events (conversation_id, event_type, event_json, created_at)
         VALUES (?, 'turn_completed', ?, ?)`,
      ).bind(id, JSON.stringify({ userSeq: nextSeq, assistantSeq: nextSeq + 1 }), now),
    ]);

    return json({
      userMessage: { seq: nextSeq, role: 'user', content, createdAt: now },
      assistantMessage: {
        seq: nextSeq + 1,
        role: 'assistant',
        content: clientReply,
        createdAt: now,
      },
      updatedAt: now,
    });
  } catch (cause) {
    console.error(cause);
    const message = cause instanceof Error ? cause.message : 'Unable to send message.';
    const status = message.includes('OpenAI') || message.includes('API') ? 502 : 500;
    return error(message, status);
  }
};
