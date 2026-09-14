import {
  error,
  getConversation,
  getLatestAssessment,
  getMessages,
  json,
  recordAudit,
  type Env,
} from '../_lib';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const id = String(context.params.id || '');
    const conversation = await getConversation(context.env.AI_ROLEPLAY_DB, id);
    if (!conversation) return error('Conversation not found.', 404);

    const [messages, latestAssessment] = await Promise.all([
      getMessages(context.env.AI_ROLEPLAY_DB, id),
      getLatestAssessment(context.env.AI_ROLEPLAY_DB, id),
    ]);

    await recordAudit(context.env.AI_ROLEPLAY_DB, id, 'conversation_loaded');

    return json({
      id: conversation.id,
      scenarioId: conversation.scenario_id,
      personaId: conversation.persona_id,
      difficulty: conversation.difficulty,
      salespersonName: conversation.salesperson_name,
      status: conversation.status,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
      messages: messages.map((message) => ({
        id: message.id,
        seq: message.seq,
        role: message.role,
        content: message.content,
        createdAt: message.created_at,
      })),
      latestAssessment,
    });
  } catch (cause) {
    console.error(cause);
    return error(cause instanceof Error ? cause.message : 'Unable to load conversation.', 500);
  }
};
