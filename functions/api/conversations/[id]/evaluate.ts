import {
  error,
  evaluateConversation,
  getConversation,
  getMessages,
  json,
  modelName,
  nowIso,
  requireTrainingConfig,
  type Env,
} from '../../_lib';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const id = String(context.params.id || '');
    const conversation = await getConversation(context.env.AI_ROLEPLAY_DB, id);
    if (!conversation) return error('Conversation not found.', 404);

    const messages = await getMessages(context.env.AI_ROLEPLAY_DB, id);
    const salespersonTurns = messages.filter((message) => message.role === 'user').length;
    if (salespersonTurns < 2) {
      return error('Have at least two salesperson turns before requesting an assessment.');
    }

    const { scenario, persona } = requireTrainingConfig(conversation);
    const result = await evaluateConversation(
      context.env,
      scenario,
      persona,
      conversation.difficulty,
      messages,
    );

    const assessmentId = crypto.randomUUID();
    const now = nowIso();
    const model = modelName(context.env);

    await context.env.AI_ROLEPLAY_DB.batch([
      context.env.AI_ROLEPLAY_DB.prepare(
        `INSERT INTO assessment_runs
         (id, conversation_id, model, total_score, result_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).bind(assessmentId, id, model, result.totalScore, JSON.stringify(result), now),
      context.env.AI_ROLEPLAY_DB.prepare(
        `UPDATE conversations SET status = 'evaluated', updated_at = ? WHERE id = ?`,
      ).bind(now, id),
      context.env.AI_ROLEPLAY_DB.prepare(
        `INSERT INTO audit_events (conversation_id, event_type, event_json, created_at)
         VALUES (?, 'assessment_completed', ?, ?)`,
      ).bind(id, JSON.stringify({ assessmentId, totalScore: result.totalScore, model }), now),
    ]);

    return json({
      id: assessmentId,
      conversationId: id,
      model,
      createdAt: now,
      ...result,
    });
  } catch (cause) {
    console.error(cause);
    const message = cause instanceof Error ? cause.message : 'Unable to evaluate conversation.';
    const status = message.includes('OpenAI') || message.includes('API') ? 502 : 500;
    return error(message, status);
  }
};
