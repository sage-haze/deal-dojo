import { error, json, type Env } from './_lib';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const dbCheck = await context.env.AI_ROLEPLAY_DB.prepare('SELECT 1 AS ok').first<{ ok: number }>();
    return json({
      ok: dbCheck?.ok === 1,
      database: dbCheck?.ok === 1 ? 'connected' : 'unknown',
      openAIKeyConfigured: Boolean(context.env.OPENAI_API_KEY),
      model: context.env.OPENAI_MODEL || 'gpt-5-mini',
      auditKeyConfigured: Boolean(context.env.AUDIT_API_KEY),
    });
  } catch (cause) {
    console.error(cause);
    return error('Health check failed. Check the D1 binding AI_ROLEPLAY_DB.', 500);
  }
};
