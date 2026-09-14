import { getPersona, getScenario, type Difficulty } from '../../../shared/training';
import { error, json, nowIso, readJson, recordAudit, type Env } from '../_lib';

type CreateBody = {
  scenarioId?: string;
  personaId?: string;
  difficulty?: Difficulty;
  salespersonName?: string;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await readJson<CreateBody>(context.request);
    const scenario = body.scenarioId ? getScenario(body.scenarioId) : undefined;
    const persona = body.personaId ? getPersona(body.personaId) : undefined;
    const difficulty = body.difficulty;

    if (!scenario) return error('Invalid scenarioId.');
    if (!persona) return error('Invalid personaId.');
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return error('difficulty must be easy, medium or hard.');
    }

    const id = crypto.randomUUID();
    const now = nowIso();
    const salespersonName = body.salespersonName?.trim().slice(0, 100) || null;

    await context.env.AI_ROLEPLAY_DB.prepare(
      `INSERT INTO conversations
       (id, scenario_id, persona_id, difficulty, salesperson_name, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`,
    )
      .bind(id, scenario.id, persona.id, difficulty, salespersonName, now, now)
      .run();

    await recordAudit(context.env.AI_ROLEPLAY_DB, id, 'conversation_created', {
      scenarioId: scenario.id,
      personaId: persona.id,
      difficulty,
      salespersonName,
    });

    return json(
      {
        id,
        scenarioId: scenario.id,
        personaId: persona.id,
        difficulty,
        salespersonName,
        status: 'active',
        createdAt: now,
        updatedAt: now,
        messages: [],
        latestAssessment: null,
      },
      { status: 201 },
    );
  } catch (cause) {
    console.error(cause);
    return error(cause instanceof Error ? cause.message : 'Unable to create conversation.', 500);
  }
};
