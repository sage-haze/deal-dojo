export type Difficulty = 'easy' | 'medium' | 'hard';

export type Scenario = {
  id: string;
  title: string;
  salespersonGoal: string;
  publicBrief: string;
  clientRole: string;
  company: string;
  hiddenClientContext: string;
};

export type Persona = {
  id: string;
  name: string;
  emoji: string;
  shortDescription: string;
  behavior: string[];
};

export type RubricCriterion = {
  id: string;
  label: string;
  weight: number;
  description: string;
};

export const scenarios: Scenario[] = [
  {
    id: 'new-prospect',
    title: 'New prospect discovery',
    salespersonGoal: 'Discover the business problem and secure agreement for a product demonstration.',
    publicBrief:
      'You are meeting an Operations Director at a mid-sized logistics company for the first time. They currently use spreadsheets and several disconnected tools.',
    clientRole: 'Operations Director',
    company: 'Northstar Logistics',
    hiddenClientContext:
      'Reporting takes roughly 10 staff-hours each week. The team misses handoffs because data is spread across tools. The client has budget, but only if a clear operational payoff is established. They have also heard about a cheaper competitor.',
  },
  {
    id: 'price-objection',
    title: 'Price objection',
    salespersonGoal: 'Understand the objection, defend value without immediately discounting, and agree a next step.',
    publicBrief:
      'An existing prospect likes the proposed solution but says the price is significantly higher than expected.',
    clientRole: 'Head of Finance',
    company: 'Pioneer Services',
    hiddenClientContext:
      'The stated price concern is real, but the deeper concern is uncertainty about adoption. The buyer could approve the price if the salesperson links value to measurable outcomes and reduces implementation risk.',
  },
  {
    id: 'angry-customer',
    title: 'Angry customer recovery',
    salespersonGoal: 'De-escalate, understand the issue, rebuild trust, and agree a concrete recovery action.',
    publicBrief:
      'A customer requested a call after a delayed implementation milestone. They are frustrated and questioning the relationship.',
    clientRole: 'Customer Success Sponsor',
    company: 'Summit Retail Group',
    hiddenClientContext:
      'The customer is most upset because they were not proactively informed about the delay. They will calm down if the salesperson acknowledges impact, takes ownership, and proposes a specific communication and recovery plan.',
  },
  {
    id: 'competitor-comparison',
    title: 'Competitor comparison',
    salespersonGoal: 'Uncover decision criteria and differentiate based on customer priorities rather than attacking the competitor.',
    publicBrief:
      'A prospect is evaluating your solution alongside a lower-cost competitor and asks why they should choose you.',
    clientRole: 'IT Director',
    company: 'Atlas Manufacturing',
    hiddenClientContext:
      'Integration reliability and implementation support matter more than price, but the client has not said this yet. A prior vendor caused a difficult migration.',
  },
  {
    id: 'renewal-risk',
    title: 'Renewal at risk',
    salespersonGoal: 'Identify renewal risk, reconnect value to outcomes, and secure a path to renewal.',
    publicBrief:
      'A long-term client is approaching renewal and has become less engaged over the last quarter.',
    clientRole: 'Commercial Director',
    company: 'Evergreen Distribution',
    hiddenClientContext:
      'Usage dropped after an internal reorganisation. The client is not actively unhappy, but questions whether the subscription is still necessary. They would renew if a practical adoption plan is proposed.',
  },
  {
    id: 'upsell',
    title: 'Expansion / upsell',
    salespersonGoal: 'Discover a legitimate expansion need and recommend an upgrade only if it fits.',
    publicBrief:
      'An existing customer is using the basic plan successfully. You believe an advanced plan could support their growing team.',
    clientRole: 'Sales Operations Manager',
    company: 'BluePeak Technology',
    hiddenClientContext:
      'The customer is hiring rapidly and has reporting and permission-management problems. They dislike being sold unnecessary features, so a premature pitch will reduce trust.',
  },
];

export const personas: Persona[] = [
  {
    id: 'friendly',
    name: 'Friendly',
    emoji: '😊',
    shortDescription: 'Warm, cooperative and willing to elaborate.',
    behavior: [
      'Respond warmly when the salesperson is personable.',
      'Share useful detail when asked good questions.',
      'Do not volunteer every important fact without discovery.',
    ],
  },
  {
    id: 'chatty',
    name: 'Chatty',
    emoji: '💬',
    shortDescription: 'Talkative, tangential and easy to let drift off topic.',
    behavior: [
      'Give longer answers and occasionally introduce irrelevant details.',
      'Reward polite conversation control and concise summaries.',
      'If the salesperson never redirects, continue to wander off topic.',
    ],
  },
  {
    id: 'annoyed',
    name: 'Annoyed',
    emoji: '😠',
    shortDescription: 'Frustrated and initially low on trust.',
    behavior: [
      'Begin noticeably frustrated without becoming abusive.',
      'Become calmer if the salesperson acknowledges impact and listens well.',
      'Become more frustrated if interrupted, dismissed or given generic answers.',
    ],
  },
  {
    id: 'impatient',
    name: 'Impatient',
    emoji: '⏱️',
    shortDescription: 'Time-poor and intolerant of long explanations.',
    behavior: [
      'Signal that time is limited.',
      'Prefer short, relevant questions and answers.',
      'Interrupt or push back when the salesperson becomes overly verbose.',
    ],
  },
  {
    id: 'skeptical',
    name: 'Skeptical',
    emoji: '🤨',
    shortDescription: 'Polite but unconvinced and evidence-oriented.',
    behavior: [
      'Question unsupported claims and vague benefits.',
      'Reveal concerns gradually rather than all at once.',
      'Become more receptive when answers are specific and tied to your situation.',
    ],
  },
  {
    id: 'price-sensitive',
    name: 'Price-sensitive',
    emoji: '💰',
    shortDescription: 'Focused on cost and wary of paying for unnecessary extras.',
    behavior: [
      'Raise cost concerns naturally.',
      'Do not accept generic ROI claims.',
      'Become more open when value is quantified and linked to relevant outcomes.',
    ],
  },
];

export const rubric: RubricCriterion[] = [
  {
    id: 'opening',
    label: 'Opening & rapport',
    weight: 10,
    description: 'Sets an appropriate tone, establishes purpose and creates a productive conversation.',
  },
  {
    id: 'discovery',
    label: 'Discovery',
    weight: 20,
    description: 'Uses relevant questions to uncover situation, problems, priorities, impact and decision context.',
  },
  {
    id: 'listening',
    label: 'Active listening',
    weight: 20,
    description: 'Responds to what the client actually says, clarifies, summarizes and avoids unnecessary interruption.',
  },
  {
    id: 'value',
    label: 'Value articulation',
    weight: 15,
    description: 'Connects the proposed solution to the client’s stated needs rather than giving a generic feature pitch.',
  },
  {
    id: 'objections',
    label: 'Objection handling',
    weight: 20,
    description: 'Acknowledges and explores concerns before responding with a relevant, credible answer.',
  },
  {
    id: 'closing',
    label: 'Closing / next step',
    weight: 15,
    description: 'Checks alignment and agrees a clear, appropriate next action.',
  },
];

export function getScenario(id: string) {
  return scenarios.find((item) => item.id === id);
}

export function getPersona(id: string) {
  return personas.find((item) => item.id === id);
}
