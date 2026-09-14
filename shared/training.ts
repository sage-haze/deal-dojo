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
    id: 'importer-new-supplier',
    title: 'New overseas supplier / import risk',
    salespersonGoal:
      'Understand the client’s trade flow, risk concerns and cash-flow priorities; identify a suitable trade-finance approach and agree the right next step without over-promising approval, pricing or limits.',
    publicBrief:
      'You are meeting the Finance Manager of a growing electronics importer. The company is onboarding a new overseas supplier and wants to discuss how the bank may support the transaction.',
    clientRole: 'Finance Manager',
    company: 'Apex Components Pte. Ltd.',
    hiddenClientContext:
      'Apex imports electronic components from a new supplier in Vietnam. The supplier initially asked for 30% advance payment and 70% before shipment. Apex is uncomfortable paying so much before receiving goods and would prefer to preserve working capital. The first shipment is approximately USD 750,000 and could become monthly if successful. The client has heard of letters of credit but does not understand the operational requirements. Their current banking relationship has unused facilities, but any new trade line or sub-limit may still require internal bank review. The client will respond well if the RM explores shipment terms, payment terms, counterparties, transaction frequency, documents and cash conversion cycle before suggesting a structure.',
  },
  {
    id: 'exporter-working-capital',
    title: 'Exporter with working-capital pressure',
    salespersonGoal:
      'Diagnose where cash is tied up in the export cycle, understand buyer/payment risk, and discuss appropriate post-shipment or receivables-finance options while setting realistic expectations.',
    publicBrief:
      'A mid-sized manufacturer has won several new export orders, but its CFO says growth is putting pressure on working capital. You have been asked to discuss possible bank support.',
    clientRole: 'Chief Financial Officer',
    company: 'Meridian Industrial Systems',
    hiddenClientContext:
      'Meridian exports industrial equipment to established buyers in Australia and Europe. Sales are growing quickly, but buyers typically pay 60 to 90 days after shipment. The company pays suppliers much earlier and has begun drawing more heavily on its overdraft. The CFO is open to receivables or export financing but is concerned about pricing, recourse, documentation and whether financing will affect customer relationships. The largest buyer is investment grade, while two smaller buyers are less well known. The RM should distinguish between strong and weaker receivables rather than treating every invoice identically.',
  },
  {
    id: 'performance-guarantee',
    title: 'Performance guarantee for a new contract',
    salespersonGoal:
      'Clarify the guarantee requirement, timing, wording, amount and underlying contract; identify internal dependencies and secure a practical path to issuance without making commitments outside the RM’s authority.',
    publicBrief:
      'A construction client has just been awarded a significant infrastructure contract and urgently needs to discuss a performance guarantee required by the project owner.',
    clientRole: 'Managing Director',
    company: 'Harbour Engineering Group',
    hiddenClientContext:
      'The client has won a SGD 24 million project. The beneficiary requires a performance guarantee equal to 10% of contract value, valid for 18 months plus a short claims period. The client wants the guarantee issued within five business days and assumes the existing banking relationship makes this automatic. Their current non-fund-based limit may not be sufficient for the full amount. They are also pushing for beneficiary wording that the bank may need to review. The managing director values speed and certainty and may become frustrated by process. A strong RM should acknowledge urgency, gather the required facts, avoid promising issuance, and coordinate early with trade product, credit and operations/legal as appropriate.',
  },
  {
    id: 'supplier-finance',
    title: 'Large buyer considering supplier finance',
    salespersonGoal:
      'Understand the buyer’s objectives, supplier pain points, payment process and implementation constraints; determine whether a supplier-finance discussion is appropriate and win agreement for a deeper solution workshop.',
    publicBrief:
      'You are meeting the Group Treasurer of a large regional retailer that is reviewing payment terms and supplier relationships as part of a working-capital initiative.',
    clientRole: 'Group Treasurer',
    company: 'Orchard Retail Holdings',
    hiddenClientContext:
      'Orchard wants to extend standard supplier terms from 60 to 90 days, but several strategic suppliers have warned that longer terms will strain their cash flow. Treasury wants to improve working capital without damaging the supply chain. The company has more than 500 suppliers, but only around 60 account for most procurement spend. The treasurer is concerned about implementation effort, supplier onboarding, ERP integration and whether suppliers will accept bank financing. They do not want a generic product pitch. The best conversation focuses first on objectives, supplier segmentation, process and economics, then proposes a specialist workshop or feasibility analysis.',
  },
  {
    id: 'trade-pricing-objection',
    title: 'Trade pricing challenged by a competitor',
    salespersonGoal:
      'Explore the true drivers behind the pricing objection, defend value credibly, avoid reflexive discounting, and agree what information is needed for a commercial review.',
    publicBrief:
      'An existing trading company tells you that another bank has offered lower fees on its trade-finance business and is considering moving more of its wallet.',
    clientRole: 'Finance Director',
    company: 'Straits Commodities Trading',
    hiddenClientContext:
      'The client has been quoted materially lower issuance and processing fees by a competitor. However, price is not the only concern: the client has also experienced slow turnaround on amendments and occasional difficulty reaching operations teams during urgent shipments. They value limit availability and execution reliability because missed shipment windows can be costly. The client will push for a quick fee reduction if the RM does not investigate the broader issue. A strong RM should understand volumes, product mix, service pain points and wallet potential before committing to a pricing discussion.',
  },
  {
    id: 'win-trade-wallet',
    title: 'Win a larger share of the client’s trade wallet',
    salespersonGoal:
      'Understand how the client currently allocates trade business across banks, identify a credible area where your bank can add value, and secure a focused follow-up rather than pushing for an immediate switch.',
    publicBrief:
      'A regional corporate already uses your bank for cash management but places most of its letters of credit and guarantees with two competitor banks. You have a relationship review with the Assistant Treasurer.',
    clientRole: 'Assistant Treasurer',
    company: 'Nova Consumer Products Group',
    hiddenClientContext:
      'Nova uses several banks deliberately. One competitor has the largest trade limits; another is preferred for fast documentary processing. Your bank is viewed positively for relationship coverage and digital cash-management capabilities but has not demonstrated a strong trade proposition. Nova has growing import volumes in Southeast Asia and periodically needs guarantees for distributors and commercial contracts. The client is open to giving the bank a trial flow if the RM can identify a specific pain point and build confidence around execution. A broad request to move trade wallet simply because of the existing relationship will be poorly received.',
  },
];

export const personas: Persona[] = [
  {
    id: 'friendly',
    name: 'Friendly',
    emoji: '😊',
    shortDescription: 'Constructive and approachable, but still expects the RM to understand the business.',
    behavior: [
      'Be warm and cooperative, especially when the RM asks thoughtful business questions.',
      'Share useful detail when prompted, but do not volunteer every material fact at the outset.',
      'Do not agree to a product merely because the conversation is pleasant.',
    ],
  },
  {
    id: 'chatty',
    name: 'Chatty',
    emoji: '💬',
    shortDescription: 'Talkative and willing to share context, but prone to tangents.',
    behavior: [
      'Give relatively long answers and occasionally drift into operational anecdotes or unrelated business updates.',
      'Reward concise summarising and polite conversation control.',
      'If the RM fails to structure the discussion, continue to wander and make it harder to identify the core need.',
    ],
  },
  {
    id: 'impatient',
    name: 'Impatient',
    emoji: '⏱️',
    shortDescription: 'Time-poor and focused on practical answers, timelines and execution.',
    behavior: [
      'Signal early that time is limited.',
      'Prefer concise questions that clearly relate to the transaction or business objective.',
      'Push back on lengthy product explanations, generic bank credentials or repeated questions.',
    ],
  },
  {
    id: 'skeptical',
    name: 'Skeptical',
    emoji: '🤨',
    shortDescription: 'Experienced with banks and unconvinced by vague claims.',
    behavior: [
      'Challenge unsupported claims about speed, pricing, limits, risk reduction or ease of implementation.',
      'Ask practical questions about how the proposed solution would work.',
      'Become more receptive when the RM is precise, transparent about dependencies and willing to involve specialists.',
    ],
  },
  {
    id: 'fee-sensitive',
    name: 'Fee-sensitive',
    emoji: '💰',
    shortDescription: 'Commercially demanding and quick to compare banks on pricing.',
    behavior: [
      'Raise fees, margins or competitor pricing naturally when relevant.',
      'Do not accept generic statements such as “we provide better service” without evidence or relevance.',
      'Become more open when the RM understands volumes, wallet potential, operational value and total relationship economics before discussing price.',
    ],
  },
  {
    id: 'guarded',
    name: 'Guarded',
    emoji: '🔒',
    shortDescription: 'Professional but reluctant to reveal banking arrangements or internal issues too quickly.',
    behavior: [
      'Give high-level answers initially and make the RM earn deeper information through relevant questioning.',
      'Avoid disclosing exact competitor terms, limits or sensitive internal information unless there is a good reason.',
      'Respond positively when the RM explains why a question matters and demonstrates knowledge of the client’s business.',
    ],
  },
];

export const rubric: RubricCriterion[] = [
  {
    id: 'opening',
    label: 'Relationship framing & agenda',
    weight: 10,
    description:
      'Sets a professional tone, establishes the purpose of the discussion, uses available relationship context and creates a clear but natural agenda.',
  },
  {
    id: 'discovery',
    label: 'Trade-flow discovery',
    weight: 20,
    description:
      'Asks relevant questions about the underlying trade, counterparties, countries, shipment/payment terms, transaction size and frequency, cash-conversion cycle, existing banking arrangements, pain points and decision priorities.',
  },
  {
    id: 'solution',
    label: 'Product suitability & structuring',
    weight: 20,
    description:
      'Connects the client need to an appropriate trade-finance concept, explains it at the right level, considers important structural choices, and avoids forcing a product before enough discovery has been completed.',
  },
  {
    id: 'commercial',
    label: 'Commercial acumen & value articulation',
    weight: 15,
    description:
      'Explains value in terms relevant to the client such as working capital, risk mitigation, supplier/buyer relationships, execution certainty, liquidity, operational efficiency or wallet economics rather than relying on generic bank claims.',
  },
  {
    id: 'credibility',
    label: 'Risk, compliance & credibility',
    weight: 15,
    description:
      'Shows appropriate awareness that facilities, pricing, documentation, credit approval, KYC/compliance, sanctions considerations and operational feasibility may require review. Does not promise approvals, limits, turnaround times or legal conclusions outside the RM’s authority.',
  },
  {
    id: 'listening',
    label: 'Listening & objection handling',
    weight: 10,
    description:
      'Listens to what the client actually says, follows up intelligently, clarifies concerns and responds to objections without becoming defensive, overly technical or immediately conceding on price.',
  },
  {
    id: 'closing',
    label: 'Next steps & internal coordination',
    weight: 10,
    description:
      'Summarises the client need accurately and agrees a specific next step, including the right information, documents, stakeholders or internal bank specialists required to progress the opportunity.',
  },
];

export function getScenario(id: string) {
  return scenarios.find((item) => item.id === id);
}

export function getPersona(id: string) {
  return personas.find((item) => item.id === id);
}
