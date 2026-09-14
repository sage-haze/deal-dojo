import { error, json, type Env } from '../_lib';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const configured = context.env.AUDIT_API_KEY;
    if (!configured) {
      return error('AUDIT_API_KEY is not configured on the server.', 503);
    }

    const supplied = context.request.headers.get('x-audit-key');
    if (!supplied || supplied !== configured) {
      return error('Unauthorized.', 401);
    }

    const url = new URL(context.request.url);
    const requestedLimit = Number(url.searchParams.get('limit') || 50);
    const limit = Math.max(1, Math.min(Number.isFinite(requestedLimit) ? requestedLimit : 50, 100));

    const result = await context.env.AI_ROLEPLAY_DB.prepare(
      `SELECT
         c.id,
         c.scenario_id,
         c.persona_id,
         c.difficulty,
         c.salesperson_name,
         c.status,
         c.created_at,
         c.updated_at,
         (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) AS message_count,
         (SELECT ar.total_score
            FROM assessment_runs ar
           WHERE ar.conversation_id = c.id
           ORDER BY ar.created_at DESC
           LIMIT 1) AS latest_score
       FROM conversations c
       ORDER BY c.updated_at DESC
       LIMIT ?`,
    )
      .bind(limit)
      .all();

    return json({ conversations: result.results });
  } catch (cause) {
    console.error(cause);
    return error(cause instanceof Error ? cause.message : 'Unable to load audit log.', 500);
  }
};
