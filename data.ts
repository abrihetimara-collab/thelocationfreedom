// src/lib/skillAudit/data.ts
//
// Structured data for the Location Freedom Skill Audit — per the master prompt's
// Part 12 requirement: "Define the questionnaire as structured data, not hardcoded
// scattered logic." Nothing in this file does any scoring; see scoring.ts.

export type DimensionId =
  | "expertise-recognition"
  | "customer-problem-clarity"
  | "service-offer-development"
  | "business-readiness"
  | "market-visibility"
  | "sales-confidence";

export interface Dimension {
  id: DimensionId;
  order: number; // fixed methodology order, used for all tie-breaking
  name: string;
  purpose: string;
  recommendedAction: string;
}

// Fixed methodology order (Part 6) — index = order - 1
export const DIMENSIONS: Dimension[] = [
  {
    id: "expertise-recognition",
    order: 1,
    name: "Expertise Recognition",
    purpose: "Can I recognize and communicate the value of what I already know?",
    recommendedAction:
      "Complete an Expertise Inventory and translate three previous responsibilities into possible service outcomes.",
  },
  {
    id: "customer-problem-clarity",
    order: 2,
    name: "Customer & Problem Clarity",
    purpose: "Do I understand who might need my expertise and why?",
    recommendedAction:
      "Develop a Customer Persona & Validation Profile and investigate one specific customer problem.",
  },
  {
    id: "service-offer-development",
    order: 3,
    name: "Service & Offer Development",
    purpose: "Can I translate my capabilities into something people could purchase?",
    recommendedAction:
      "Develop one clear service offer that includes the customer, problem, deliverables, outcome, scope, and proposed price.",
  },
  {
    id: "business-readiness",
    order: 4,
    name: "Business Readiness",
    purpose: "Am I prepared to deliver a service professionally?",
    recommendedAction:
      "Create a Minimum Viable Client Experience covering inquiry, agreement, payment, onboarding, delivery, and follow-up.",
  },
  {
    id: "market-visibility",
    order: 5,
    name: "Market Visibility & Customer Acquisition",
    purpose: "Do I know how to find and connect with potential customers?",
    recommendedAction:
      "Identify one suitable acquisition channel and begin building a First 25 Customer Opportunity List.",
  },
  {
    id: "sales-confidence",
    order: 6,
    name: "Sales Confidence & Activation",
    purpose: "Am I prepared to discuss my offer, invite purchases, and follow up?",
    recommendedAction:
      "Practice the Location Freedom Sales Conversation Framework: Listen → Understand → Clarify → Explain → Discuss → Invite. Then prepare one real, appropriate buying invitation.",
  },
];

export interface ScoredQuestion {
  id: string; // Q1..Q24
  dimensionId: DimensionId;
  text: string;
  order: number;
}

export const QUESTIONS: ScoredQuestion[] = [
  // Dimension 1 — Expertise Recognition
  { id: "Q1", dimensionId: "expertise-recognition", order: 1, text: "I can identify specific skills I have developed through employment, business ownership, education, volunteering, or lived experience." },
  { id: "Q2", dimensionId: "expertise-recognition", order: 2, text: "I can describe problems I have successfully solved or outcomes I have helped others achieve." },
  { id: "Q3", dimensionId: "expertise-recognition", order: 3, text: "I recognize that skills I consider ordinary may be valuable to someone who needs them." },
  { id: "Q4", dimensionId: "expertise-recognition", order: 4, text: "I can explain my professional strengths without relying entirely on my job title or credentials." },
  // Dimension 2 — Customer & Problem Clarity
  { id: "Q5", dimensionId: "customer-problem-clarity", order: 1, text: "I can identify a specific type of person or business that could benefit from my expertise." },
  { id: "Q6", dimensionId: "customer-problem-clarity", order: 2, text: "I understand at least one meaningful problem that this potential customer experiences." },
  { id: "Q7", dimensionId: "customer-problem-clarity", order: 3, text: "I can describe the result or improvement that my potential customer would want." },
  { id: "Q8", dimensionId: "customer-problem-clarity", order: 4, text: "I have spoken with potential customers, observed credible evidence of their needs, or otherwise researched whether the problem matters to them." },
  // Dimension 3 — Service & Offer Development
  { id: "Q9", dimensionId: "service-offer-development", order: 1, text: "I can describe a specific service I could provide using skills I already possess." },
  { id: "Q10", dimensionId: "service-offer-development", order: 2, text: "I can explain what a customer would receive when purchasing that service." },
  { id: "Q11", dimensionId: "service-offer-development", order: 3, text: "I understand how my service could help solve a customer problem or produce a desired outcome." },
  { id: "Q12", dimensionId: "service-offer-development", order: 4, text: "I have considered an appropriate price, service scope, or package for what I would offer." },
  // Dimension 4 — Business Readiness
  { id: "Q13", dimensionId: "business-readiness", order: 1, text: "I understand the basic steps required to deliver my service from the first inquiry through completion." },
  { id: "Q14", dimensionId: "business-readiness", order: 2, text: "I know how a potential customer could contact me, schedule a conversation, or request my service." },
  { id: "Q15", dimensionId: "business-readiness", order: 3, text: "I have identified a suitable way to accept payment and confirm a customer purchase." },
  { id: "Q16", dimensionId: "business-readiness", order: 4, text: "I understand the importance of communicating service expectations, boundaries, and responsibilities clearly." },
  // Dimension 5 — Market Visibility & Customer Acquisition
  { id: "Q17", dimensionId: "market-visibility", order: 1, text: "I know at least one realistic place or channel where I could find people who need my service." },
  { id: "Q18", dimensionId: "market-visibility", order: 2, text: "I feel capable of starting a professional conversation with someone who may benefit from my expertise." },
  { id: "Q19", dimensionId: "market-visibility", order: 3, text: "I understand how useful content, referrals, networking, or partnerships can help potential customers discover my services." },
  { id: "Q20", dimensionId: "market-visibility", order: 4, text: "I have a way to organize potential customer opportunities and keep track of next steps." },
  // Dimension 6 — Sales Confidence & Activation
  { id: "Q21", dimensionId: "sales-confidence", order: 1, text: "I feel capable of explaining the value of my service to a potential customer." },
  { id: "Q22", dimensionId: "sales-confidence", order: 2, text: "I feel prepared to discuss pricing or payment with someone interested in my service." },
  { id: "Q23", dimensionId: "sales-confidence", order: 3, text: "I understand how to invite a qualified customer to take the next step toward purchasing." },
  { id: "Q24", dimensionId: "sales-confidence", order: 4, text: "I feel capable of following up professionally when someone expresses interest but has not yet made a decision." },
];

export const RESPONSE_SCALE = [
  { value: 1, label: "Not yet true for me" },
  { value: 2, label: "Just beginning" },
  { value: 3, label: "Somewhat true" },
  { value: 4, label: "Mostly true" },
  { value: 5, label: "Consistently true" },
] as const;

// --- Personalization (unscored) ---

export const BACKGROUND_OPTIONS = [
  "Administration and executive support",
  "Talent acquisition and human resources",
  "Education, training, and tutoring",
  "Customer service and client experience",
  "Business operations and project management",
  "Sales and business development",
  "Marketing, communications, and content",
  "Finance, bookkeeping, and administrative accounting",
  "Technology and digital systems",
  "Healthcare or human services",
  "Creative services",
  "Hospitality and event services",
  "Entrepreneurship or business ownership",
  "Other",
  "Still exploring",
] as const;

export type CustomerPreference = "B2B" | "B2C" | "Both" | "Unsure";

export const CUSTOMER_PREFERENCE_OPTIONS: { value: CustomerPreference; label: string }[] = [
  { value: "B2B", label: "Businesses and organizations (B2B)" },
  { value: "B2C", label: "Individuals and families (B2C)" },
  { value: "Both", label: "Both" },
  { value: "Unsure", label: "I'm not sure yet" },
];

export const BUSINESS_STAGE_OPTIONS = [
  "I have skills but no business idea.",
  "I have several ideas but haven't chosen one.",
  "I know what service I want to offer.",
  "I have an offer but haven't found paying customers.",
  "I have started offering services and want more consistent customers.",
  "I already have paying customers and want to improve my sales process.",
] as const;

export const PRIMARY_GOAL_OPTIONS = [
  "Identify my marketable skills.",
  "Choose a service-business idea.",
  "Identify my ideal customer.",
  "Create and price my service.",
  "Set up my business to accept customers.",
  "Find potential customers.",
  "Make my first sale.",
  "Develop a repeatable sales process.",
] as const;

export interface PersonalizationAnswers {
  background: string[]; // P1, multi-select
  backgroundOther?: string;
  customerPreference: CustomerPreference | null; // P2
  businessStage: (typeof BUSINESS_STAGE_OPTIONS)[number] | null; // P3
  primaryGoal: (typeof PRIMARY_GOAL_OPTIONS)[number] | null; // P4
}

// --- Result bands (Part 5.D) ---

export interface ResultBand {
  min: number; // inclusive, normalized percentage
  max: number; // exclusive, except the top band which is inclusive of 100
  label: string;
  message: string;
}

export const RESULT_BANDS: ResultBand[] = [
  {
    min: 0,
    max: 25,
    label: "Discovering Your Foundation",
    message:
      "You may have more valuable expertise than you currently recognize. Your next step is to identify your strengths, explore customer needs, and discover where your experience could create value.",
  },
  {
    min: 25,
    max: 50,
    label: "Connecting the Possibilities",
    message:
      "You're beginning to connect your experience with possible service opportunities. The next step is to bring greater clarity to your customer, the problem you solve, and the service you could offer.",
  },
  {
    min: 50,
    max: 75,
    label: "Building Your Business Path",
    message:
      "You have several important pieces of your service-business foundation in place. Your next opportunity is to strengthen the areas that will help you reach customers, communicate value, and create buying opportunities.",
  },
  {
    min: 75,
    max: 100.0001, // inclusive of 100
    label: "Ready to Activate Your Next Step",
    message:
      "Your responses suggest that you have developed meaningful clarity and readiness across several business-building areas. The next step is to test your offer with real potential customers and learn from the results.",
  },
];

// --- Service-opportunity library (Part 7) ---
// A starter, curated library — not exhaustive. Each entry is tagged to the P1
// background categories it applies to and the customer preferences it fits.
// Extend this array as you validate more directions; the selection logic in
// scoring.ts just filters/scores this list, so no code changes are needed to add more.

export interface Opportunity {
  id: string;
  direction: string;
  relevantBackgrounds: string[]; // must match BACKGROUND_OPTIONS values
  fitsPreference: CustomerPreference[]; // which P2 answers this suits
  relevantExperience: string;
  potentialCustomer: string;
  problem: string;
  possibleService: string;
  exampleDeliverable: string;
  firstValidationStep: string;
}

export const OPPORTUNITY_LIBRARY: Opportunity[] = [
  {
    id: "recruiting-process-support",
    direction: "Recruiting Process Support",
    relevantBackgrounds: ["Talent acquisition and human resources"],
    fitsPreference: ["B2B", "Both"],
    relevantExperience: "Talent acquisition and human resources experience",
    potentialCustomer: "Small businesses that need help organizing hiring processes",
    problem: "Hiring workflows may be inconsistent or time-consuming",
    possibleService: "Recruiting Process Support",
    exampleDeliverable: "Candidate screening workflow, interview scheduling process, or recruiting operations review",
    firstValidationStep: "Speak with small-business decision-makers about their current hiring challenges",
  },
  {
    id: "virtual-operations-support",
    direction: "Virtual Operations Support",
    relevantBackgrounds: ["Administration and executive support", "Business operations and project management"],
    fitsPreference: ["B2B", "Both"],
    relevantExperience: "Administrative or operations experience",
    potentialCustomer: "Small service-based businesses",
    problem: "Administrative tasks may take time away from revenue-generating work",
    possibleService: "Virtual Operations Support",
    exampleDeliverable: "Inbox organization, scheduling systems, customer inquiry management, or SOP documentation",
    firstValidationStep: "Interview business owners about recurring administrative bottlenecks",
  },
  {
    id: "personalized-learning-support",
    direction: "Personalized Learning Support",
    relevantBackgrounds: ["Education, training, and tutoring"],
    fitsPreference: ["B2C", "Both"],
    relevantExperience: "Teaching or training experience",
    potentialCustomer: "Individuals or families",
    problem: "Learners may need targeted support in a specific subject or skill",
    possibleService: "Personalized Learning Support",
    exampleDeliverable: "Tutoring sessions, study plans, or educational workshops",
    firstValidationStep: "Identify a specific learner need and speak with prospective customers",
  },
  {
    id: "client-experience-consulting",
    direction: "Client Experience Consulting",
    relevantBackgrounds: ["Customer service and client experience"],
    fitsPreference: ["B2B", "Both"],
    relevantExperience: "Customer service and client experience background",
    potentialCustomer: "Small businesses whose customers interact with support or service staff",
    problem: "Inconsistent or slow customer response may be costing repeat business",
    possibleService: "Client Experience Review & Process Design",
    exampleDeliverable: "Response-time audit, a client communication playbook, or a complaint-handling workflow",
    firstValidationStep: "Ask three small-business owners how they currently handle customer complaints",
  },
  {
    id: "sales-pipeline-support",
    direction: "Sales Pipeline Support",
    relevantBackgrounds: ["Sales and business development"],
    fitsPreference: ["B2B", "Both"],
    relevantExperience: "Sales and business development experience",
    potentialCustomer: "Small businesses without a dedicated sales process",
    problem: "Leads may be falling through the cracks without a defined follow-up system",
    possibleService: "Sales Pipeline & Follow-Up System Design",
    exampleDeliverable: "A simple CRM setup, a follow-up email sequence, or a lead-qualification checklist",
    firstValidationStep: "Ask small-business owners how they currently track and follow up with leads",
  },
  {
    id: "content-marketing-support",
    direction: "Content & Marketing Support",
    relevantBackgrounds: ["Marketing, communications, and content"],
    fitsPreference: ["B2B", "B2C", "Both"],
    relevantExperience: "Marketing and content experience",
    potentialCustomer: "Small businesses or individual professionals who need consistent content",
    problem: "Marketing may be inconsistent due to lack of time or a clear content plan",
    possibleService: "Content Planning & Creation Support",
    exampleDeliverable: "A monthly content calendar, email newsletter templates, or social media posts",
    firstValidationStep: "Ask potential customers what's stopping them from posting or emailing consistently today",
  },
  {
    id: "bookkeeping-support",
    direction: "Bookkeeping & Financial Organization Support",
    relevantBackgrounds: ["Finance, bookkeeping, and administrative accounting"],
    fitsPreference: ["B2B", "Both"],
    relevantExperience: "Finance and bookkeeping experience",
    potentialCustomer: "Small businesses or solo entrepreneurs without a dedicated bookkeeper",
    problem: "Financial records may be disorganized, making tax time and decisions harder",
    possibleService: "Monthly Bookkeeping & Financial Organization",
    exampleDeliverable: "A cleaned-up chart of accounts, monthly reconciliation, or a simple expense-tracking system",
    firstValidationStep: "Ask small-business owners how they currently track income and expenses",
  },
  {
    id: "digital-systems-setup",
    direction: "Digital Systems Setup",
    relevantBackgrounds: ["Technology and digital systems"],
    fitsPreference: ["B2B", "B2C", "Both"],
    relevantExperience: "Technology and digital systems experience",
    potentialCustomer: "Small businesses or professionals using manual or outdated processes",
    problem: "Day-to-day tools may be disconnected, causing wasted time and errors",
    possibleService: "Digital Systems Setup & Automation",
    exampleDeliverable: "A connected scheduling/invoicing/CRM setup, or a documented standard operating procedure",
    firstValidationStep: "Ask potential customers which repetitive task they wish were automated",
  },
  {
    id: "wellness-support-services",
    direction: "Wellness & Care Support Services",
    relevantBackgrounds: ["Healthcare or human services"],
    fitsPreference: ["B2C", "B2B", "Both"],
    relevantExperience: "Healthcare or human services background",
    potentialCustomer: "Individuals, families, or small practices needing non-clinical support",
    problem: "People may need practical, non-clinical help navigating care, routines, or logistics",
    possibleService: "Non-Clinical Wellness & Care Coordination Support",
    exampleDeliverable: "A care-coordination checklist, appointment and resource organization, or a family support plan",
    firstValidationStep: "Speak with a few families or practices about where logistics become overwhelming (note: acknowledge licensing/scope-of-practice limits for any clinical-adjacent service)",
  },
  {
    id: "creative-services",
    direction: "Creative Services",
    relevantBackgrounds: ["Creative services"],
    fitsPreference: ["B2B", "B2C", "Both"],
    relevantExperience: "Creative or design experience",
    potentialCustomer: "Small businesses or individuals needing visual or creative work",
    problem: "Brand or creative materials may look inconsistent or outdated",
    possibleService: "Brand & Creative Support",
    exampleDeliverable: "A simple brand kit, a set of templates, or a one-off design project",
    firstValidationStep: "Show your portfolio to a few potential customers and ask what they'd want made first",
  },
  {
    id: "event-hospitality-support",
    direction: "Event & Hospitality Support",
    relevantBackgrounds: ["Hospitality and event services"],
    fitsPreference: ["B2B", "B2C", "Both"],
    relevantExperience: "Hospitality and event experience",
    potentialCustomer: "Individuals or small businesses planning events",
    problem: "Event logistics can be overwhelming to coordinate alone",
    possibleService: "Event Planning & Coordination Support",
    exampleDeliverable: "A vendor-coordination checklist, a day-of timeline, or partial planning support",
    firstValidationStep: "Ask recent hosts what part of planning their event was hardest",
  },
  {
    id: "small-business-advisory",
    direction: "Small Business Advisory",
    relevantBackgrounds: ["Entrepreneurship or business ownership"],
    fitsPreference: ["B2B", "Both"],
    relevantExperience: "Experience building or running a business",
    potentialCustomer: "New or early-stage business owners",
    problem: "New owners often don't know what to prioritize first",
    possibleService: "Early-Stage Business Advisory",
    exampleDeliverable: "A prioritized first-90-days plan, or a review of their current setup",
    firstValidationStep: "Offer a short advisory conversation to a few early-stage owners and ask what they're stuck on",
  },
  {
    id: "project-coordination-support",
    direction: "Project Coordination Support",
    relevantBackgrounds: ["Business operations and project management"],
    fitsPreference: ["B2B", "Both"],
    relevantExperience: "Project management experience",
    potentialCustomer: "Small businesses or teams juggling multiple projects without a coordinator",
    problem: "Projects may stall or miss deadlines without dedicated coordination",
    possibleService: "Fractional Project Coordination",
    exampleDeliverable: "A project tracker, a weekly status process, or a single project brought to completion",
    firstValidationStep: "Ask a few small teams how they currently track project status and deadlines",
  },
  // Generic fallbacks — used when background is "Other," "Still exploring," or has no close match
  {
    id: "general-done-for-you-support",
    direction: "Done-For-You Support in Your Area of Experience",
    relevantBackgrounds: ["Other", "Still exploring"],
    fitsPreference: ["B2B", "B2C", "Both", "Unsure"],
    relevantExperience: "Your stated professional or life experience",
    potentialCustomer: "People or businesses facing the problems you know best",
    problem: "A task or decision they find time-consuming, confusing, or stressful",
    possibleService: "A clearly scoped version of something you already know how to do",
    exampleDeliverable: "A single, well-defined deliverable based on one task you're confident doing for someone else",
    firstValidationStep: "List three tasks people have asked for your help with, then ask one of those people if they'd pay for it done for them",
  },
];
