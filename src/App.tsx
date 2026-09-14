import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  getPersona,
  getScenario,
  personas,
  rubric,
  scenarios,
  type Difficulty,
} from '../shared/training';

type Message = {
  id?: number;
  seq: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type CriterionResult = {
  id: string;
  label: string;
  weight: number;
  description: string;
  rating: number;
  weightedScore: number;
  evidence: string;
  feedback: string;
};

type Assessment = {
  id: string;
  conversationId: string;
  model: string;
  createdAt: string;
  totalScore: number;
  criteria: CriterionResult[];
  summary: string;
  strengths: string[];
  improvements: string[];
  nextFocus: string;
  outcome: 'not_achieved' | 'partially_achieved' | 'achieved';
};

type Conversation = {
  id: string;
  scenarioId: string;
  personaId: string;
  difficulty: Difficulty;
  salespersonName: string | null;
  status: 'active' | 'evaluated';
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  latestAssessment: Assessment | null;
};

type AuditItem = {
  id: string;
  scenario_id: string;
  persona_id: string;
  difficulty: Difficulty;
  salesperson_name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  latest_score: number | null;
};

type ApiError = { error?: string };

const RECENT_KEY = 'sales-roleplay-recent-ids';

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const body = (await response.json().catch(() => ({}))) as T & ApiError;
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status}).`);
  return body;
}

function rememberConversation(id: string) {
  try {
    const current = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as string[];
    const next = [id, ...current.filter((item) => item !== id)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Local convenience only; D1 remains the source of truth.
  }
}

function getRecentIds() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as string[];
  } catch {
    return [];
  }
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Developing';
  return 'Needs practice';
}

export default function App() {
  const [view, setView] = useState<'home' | 'roleplay' | 'results' | 'audit'>('home');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [personaId, setPersonaId] = useState(personas[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [salespersonName, setSalespersonName] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentIds());
  const [auditKey, setAuditKey] = useState('');
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scenario = useMemo(
    () => (conversation ? getScenario(conversation.scenarioId) : getScenario(scenarioId)),
    [conversation, scenarioId],
  );
  const persona = useMemo(
    () => (conversation ? getPersona(conversation.personaId) : getPersona(personaId)),
    [conversation, personaId],
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length, busy]);

  function clearError() {
    setErrorMessage('');
  }

  async function startConversation() {
    clearError();
    setBusy(true);
    try {
      const created = await api<Conversation>('/api/conversations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ scenarioId, personaId, difficulty, salespersonName }),
      });
      setConversation(created);
      setAssessment(null);
      rememberConversation(created.id);
      setRecentIds(getRecentIds());
      setView('roleplay');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to start role play.');
    } finally {
      setBusy(false);
    }
  }

  async function loadConversation(id = resumeId) {
    const cleanId = id.trim();
    if (!cleanId) return;
    clearError();
    setBusy(true);
    try {
      const loaded = await api<Conversation>(`/api/conversations/${encodeURIComponent(cleanId)}`);
      setConversation(loaded);
      setAssessment(loaded.latestAssessment);
      rememberConversation(loaded.id);
      setRecentIds(getRecentIds());
      setResumeId(loaded.id);
      setView('roleplay');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load conversation.');
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!conversation || !draft.trim() || busy) return;

    const content = draft.trim();
    setDraft('');
    clearError();
    setBusy(true);
    try {
      const result = await api<{
        userMessage: Message;
        assistantMessage: Message;
        updatedAt: string;
      }>(`/api/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      setConversation((current) =>
        current
          ? {
              ...current,
              status: 'active',
              updatedAt: result.updatedAt,
              messages: [...current.messages, result.userMessage, result.assistantMessage],
            }
          : current,
      );
    } catch (error) {
      setDraft(content);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to send message.');
    } finally {
      setBusy(false);
    }
  }

  async function evaluate() {
    if (!conversation || busy) return;
    clearError();
    setBusy(true);
    try {
      const result = await api<Assessment>(`/api/conversations/${conversation.id}/evaluate`, {
        method: 'POST',
      });
      setAssessment(result);
      setConversation((current) =>
        current ? { ...current, status: 'evaluated', latestAssessment: result } : current,
      );
      setView('results');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to evaluate conversation.');
    } finally {
      setBusy(false);
    }
  }

  async function loadAudit() {
    clearError();
    setBusy(true);
    try {
      const result = await api<{ conversations: AuditItem[] }>('/api/audit?limit=100', {
        headers: { 'x-audit-key': auditKey },
      });
      setAuditItems(result.conversations);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load audit log.');
    } finally {
      setBusy(false);
    }
  }

  function newRoleplay() {
    setConversation(null);
    setAssessment(null);
    setDraft('');
    setView('home');
    clearError();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={newRoleplay}>
          <span className="brand-mark">AI</span>
          <span>
            <strong>Sales Role Play</strong>
            <small>Training simulator</small>
          </span>
        </button>
        <nav>
          <button className="nav-button" onClick={() => setView('home')}>New</button>
          <button className="nav-button" onClick={() => setView('audit')}>Audit</button>
        </nav>
      </header>

      <main>
        {errorMessage && (
          <div className="error-banner" role="alert">
            <strong>Something needs attention.</strong>
            <span>{errorMessage}</span>
            <button onClick={clearError} aria-label="Dismiss">×</button>
          </div>
        )}

        {view === 'home' && (
          <section className="page-grid">
            <div className="hero panel">
              <p className="eyebrow">AI CLIENT SIMULATION</p>
              <h1>Practice the conversation before it matters.</h1>
              <p className="hero-copy">
                Choose a selling situation and client personality. The AI stays in character, then assesses the completed conversation against a weighted rubric.
              </p>
              <div className="feature-row">
                <span>✓ Persistent transcript</span>
                <span>✓ Resume by ID</span>
                <span>✓ Rubric scoring</span>
                <span>✓ D1 audit trail</span>
              </div>
            </div>

            <div className="panel setup-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">NEW SESSION</p>
                  <h2>Configure role play</h2>
                </div>
              </div>

              <label className="field">
                <span>Salesperson name <em>optional</em></span>
                <input
                  value={salespersonName}
                  onChange={(event) => setSalespersonName(event.target.value)}
                  placeholder="e.g. Alex"
                  maxLength={100}
                />
              </label>

              <label className="field">
                <span>Scenario</span>
                <select value={scenarioId} onChange={(event) => setScenarioId(event.target.value)}>
                  {scenarios.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </label>
              {scenario && <div className="brief-box"><strong>Your brief</strong><p>{scenario.publicBrief}</p><small>Goal: {scenario.salespersonGoal}</small></div>}

              <div className="field">
                <span>Client persona</span>
                <div className="persona-grid">
                  {personas.map((item) => (
                    <button
                      key={item.id}
                      className={`persona-card ${personaId === item.id ? 'selected' : ''}`}
                      onClick={() => setPersonaId(item.id)}
                      type="button"
                    >
                      <span className="persona-emoji">{item.emoji}</span>
                      <strong>{item.name}</strong>
                      <small>{item.shortDescription}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <span>Difficulty</span>
                <div className="segmented">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                    <button
                      type="button"
                      key={level}
                      className={difficulty === level ? 'active' : ''}
                      onClick={() => setDifficulty(level)}
                    >
                      {level[0].toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button className="primary-button large" onClick={startConversation} disabled={busy}>
                {busy ? 'Creating…' : 'Start role play'}
              </button>
            </div>

            <div className="panel resume-panel">
              <p className="eyebrow">CONTINUE</p>
              <h2>Resume a conversation</h2>
              <p>Enter the UUID shown inside a previous session. The complete transcript is loaded from D1.</p>
              <div className="inline-form">
                <input value={resumeId} onChange={(event) => setResumeId(event.target.value)} placeholder="Conversation ID" />
                <button className="secondary-button" onClick={() => loadConversation()} disabled={busy || !resumeId.trim()}>Load</button>
              </div>
              {recentIds.length > 0 && (
                <div className="recent-list">
                  <strong>Recent on this device</strong>
                  {recentIds.slice(0, 4).map((id) => (
                    <button key={id} onClick={() => loadConversation(id)}>{id}</button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {view === 'roleplay' && conversation && scenario && persona && (
          <section className="roleplay-layout">
            <aside className="panel session-sidebar">
              <p className="eyebrow">SESSION</p>
              <h2>{scenario.title}</h2>
              <dl>
                <div><dt>Client</dt><dd>{scenario.clientRole}</dd></div>
                <div><dt>Company</dt><dd>{scenario.company}</dd></div>
                <div><dt>Persona</dt><dd>{persona.emoji} {persona.name}</dd></div>
                <div><dt>Difficulty</dt><dd className="capitalize">{conversation.difficulty}</dd></div>
              </dl>
              <div className="goal-card">
                <span>Your objective</span>
                <p>{scenario.salespersonGoal}</p>
              </div>
              <div className="id-card">
                <span>Conversation ID</span>
                <code>{conversation.id}</code>
                <button
                  onClick={() => navigator.clipboard?.writeText(conversation.id)}
                  className="text-button"
                >Copy ID</button>
              </div>
              {conversation.latestAssessment && (
                <button className="secondary-button full" onClick={() => { setAssessment(conversation.latestAssessment); setView('results'); }}>
                  View latest score · {conversation.latestAssessment.totalScore}
                </button>
              )}
              <button
                className="primary-button full"
                onClick={evaluate}
                disabled={busy || conversation.messages.filter((message) => message.role === 'user').length < 2}
              >
                {busy ? 'Working…' : 'End & assess role play'}
              </button>
              <small className="muted">Assessment becomes available after two salesperson turns. You can resume the session after assessment.</small>
            </aside>

            <div className="panel chat-panel">
              <div className="chat-header">
                <div>
                  <span className="status-dot" /> AI client is in role
                </div>
                <span>{conversation.messages.length} messages saved</span>
              </div>
              <div className="chat-scroll">
                {conversation.messages.length === 0 && (
                  <div className="empty-chat">
                    <span className="persona-emoji big">{persona.emoji}</span>
                    <h3>You have the floor.</h3>
                    <p>Open the sales conversation. The AI client will respond in character using the hidden scenario context.</p>
                  </div>
                )}
                {conversation.messages.map((message) => (
                  <div key={`${message.seq}-${message.role}`} className={`message-row ${message.role}`}>
                    <div className="message-meta">{message.role === 'user' ? 'You' : scenario.clientRole}</div>
                    <div className="message-bubble">{message.content}</div>
                  </div>
                ))}
                {busy && <div className="typing"><span /><span /><span /></div>}
                <div ref={chatEndRef} />
              </div>
              <form className="composer" onSubmit={sendMessage}>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder="Type your response…"
                  rows={2}
                  maxLength={8000}
                  disabled={busy}
                />
                <button className="primary-button" type="submit" disabled={busy || !draft.trim()}>Send</button>
              </form>
            </div>
          </section>
        )}

        {view === 'results' && assessment && conversation && scenario && (
          <section className="results-layout">
            <div className="panel score-hero">
              <div>
                <p className="eyebrow">ASSESSMENT</p>
                <h1>{assessment.totalScore}<span>/100</span></h1>
                <strong>{scoreLabel(assessment.totalScore)}</strong>
              </div>
              <div className="score-summary">
                <h2>{scenario.title}</h2>
                <p>{assessment.summary}</p>
                <div className={`outcome ${assessment.outcome}`}>{assessment.outcome.replaceAll('_', ' ')}</div>
              </div>
            </div>

            <div className="panel">
              <div className="section-heading"><div><p className="eyebrow">RUBRIC</p><h2>Performance breakdown</h2></div></div>
              <div className="criteria-list">
                {assessment.criteria.map((criterion) => (
                  <article className="criterion" key={criterion.id}>
                    <div className="criterion-top">
                      <div><strong>{criterion.label}</strong><small>{criterion.weight}% weighting</small></div>
                      <div className="criterion-score">{criterion.weightedScore}<span>/{criterion.weight}</span></div>
                    </div>
                    <div className="rating-bar"><span style={{ width: `${criterion.rating * 20}%` }} /></div>
                    <p><strong>Evidence:</strong> {criterion.evidence}</p>
                    <p><strong>Coach:</strong> {criterion.feedback}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="two-column">
              <div className="panel coaching-panel">
                <p className="eyebrow">STRENGTHS</p>
                <ul>{assessment.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="panel coaching-panel">
                <p className="eyebrow">IMPROVE NEXT</p>
                <ul>{assessment.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="panel next-focus">
              <div><p className="eyebrow">NEXT PRACTICE FOCUS</p><h2>{assessment.nextFocus}</h2></div>
              <div className="result-actions">
                <button className="secondary-button" onClick={() => setView('roleplay')}>Continue this conversation</button>
                <button className="primary-button" onClick={newRoleplay}>Start another</button>
              </div>
            </div>
          </section>
        )}

        {view === 'audit' && (
          <section className="audit-layout">
            <div className="panel audit-header">
              <div>
                <p className="eyebrow">ADMIN / POC</p>
                <h1>Conversation audit log</h1>
                <p>The list endpoint is protected by the server-side <code>AUDIT_API_KEY</code>. Individual conversation UUIDs remain resumable.</p>
              </div>
              <div className="inline-form audit-key-form">
                <input type="password" value={auditKey} onChange={(event) => setAuditKey(event.target.value)} placeholder="Audit API key" />
                <button className="primary-button" onClick={loadAudit} disabled={busy || !auditKey}>Load audit log</button>
              </div>
            </div>

            <div className="panel table-wrap">
              {auditItems.length === 0 ? (
                <div className="empty-audit">Enter the audit key to view up to 100 recently updated conversations.</div>
              ) : (
                <table>
                  <thead><tr><th>Salesperson</th><th>Scenario</th><th>Persona</th><th>Updated</th><th>Messages</th><th>Score</th><th /></tr></thead>
                  <tbody>
                    {auditItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.salesperson_name || '—'}</td>
                        <td>{getScenario(item.scenario_id)?.title || item.scenario_id}</td>
                        <td>{getPersona(item.persona_id)?.name || item.persona_id}</td>
                        <td>{new Date(item.updated_at).toLocaleString()}</td>
                        <td>{item.message_count}</td>
                        <td>{item.latest_score ?? '—'}</td>
                        <td><button className="text-button" onClick={() => loadConversation(item.id)}>Open</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>

      <footer>
        <span>POC · OpenAI + Cloudflare Pages Functions + D1</span>
        <span>{rubric.length} assessment criteria · weights total {rubric.reduce((sum, item) => sum + item.weight, 0)}%</span>
      </footer>
    </div>
  );
}
