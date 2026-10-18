// src/lib/skillAudit/scoring.ts
//
// Scoring and recommendation engine for the Location Freedom Skill Audit.
// Implements Parts 5, 6, 7, and 8 of the master prompt exactly as specified:
// formulas, tie-breaking by fixed methodology order, dependency-aware action
// plans, and a deterministic (non-AI) opportunity selector.

import {
  DIMENSIONS,
  QUESTIONS,
  OPPORTUNITY_LIBRARY,
  RESULT_BANDS,
  type DimensionId,
  type Opportunity,
  type PersonalizationAnswers,
  type CustomerPreference,
} from "./data";

export type Score = 1 | 2 | 3 | 4 | 5;
export type Answer = Score | null; // null = unanswered or "Not sure"

export type Answers = Record<string, Answer>; // keyed by question id, e.g. "Q1"

// ---------------------------------------------------------------------------
// A. Dimension scores (Part 5.A)
// ---------------------------------------------------------------------------

export interface DimensionResult {
  dimensionId: DimensionId;
  complete: boolean;
  raw: number | null; // 4-20
  percentage: number | null; // 0-100, full precision
}

export function calculateDimensionScore(
  dimensionId: DimensionId,
  answers: Answers
): DimensionResult {
  const qIds = QUESTIONS.filter((q) => q.dimensionId === dimensionId).map((q) => q.id);
  const values = qIds.map((id) => answers[id] ?? null);

  if (values.length !== 4 || values.some((v) => v === null)) {
    return { dimensionId, complete: false, raw: null, percentage: null };
  }

  const raw = (values as Score[]).reduce((sum, v) => sum + v, 0);
  const percentage = ((raw - 4) / 16) * 100;

  return { dimensionId, complete: true, raw, percentage };
}

export function calculateAllDimensionScores(answers: Answers): DimensionResult[] {
  return DIMENSIONS.map((d) => calculateDimensionScore(d.id, answers));
}

// ---------------------------------------------------------------------------
// B. Overall score (Part 5.B)
// ---------------------------------------------------------------------------

export interface OverallResult {
  complete: boolean;
  raw: number | null; // 24-120
  percentage: number | null; // 0-100, full precision
  category: string | null;
  unansweredIds: string[];
}

export function calculateOverallScore(answers: Answers): OverallResult {
  const unansweredIds = QUESTIONS.filter((q) => (answers[q.id] ?? null) === null).map((q) => q.id);

  if (unansweredIds.length > 0) {
    return { complete: false, raw: null, percentage: null, category: null, unansweredIds };
  }

  const raw = QUESTIONS.reduce((sum, q) => sum + (answers[q.id] as Score), 0);
  const percentage = ((raw - 24) / 96) * 100;
  const category = resultBandFor(percentage).label;

  return { complete: true, raw, percentage, category, unansweredIds: [] };
}

export function resultBandFor(percentage: number) {
  // Bands are defined [min, max) except the top band, which is inclusive of 100.
  return (
    RESULT_BANDS.find((b) => percentage >= b.min && percentage < b.max) ??
    RESULT_BANDS[RESULT_BANDS.length - 1]
  );
}

// ---------------------------------------------------------------------------
// Validation (Part 5.C / Part 12)
// ---------------------------------------------------------------------------

export function isValidScore(value: unknown): value is Score {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

// ---------------------------------------------------------------------------
// Strengths & priorities (Part 6)
// ---------------------------------------------------------------------------
// Methodology order (DIMENSIONS[i].order, 1-6) breaks all ties, for BOTH the
// strengths sort (descending) and the priorities sort (ascending) — a tie is
// resolved by whichever dimension comes first in the fixed 1-6 order.

function methodologyOrder(id: DimensionId): number {
  return DIMENSIONS.find((d) => d.id === id)!.order;
}

export function rankStrengths(results: DimensionResult[], count = 2): DimensionResult[] {
  const complete = results.filter((r) => r.complete);
  return [...complete]
    .sort((a, b) => {
      if (b.percentage! !== a.percentage!) return b.percentage! - a.percentage!;
      return methodologyOrder(a.dimensionId) - methodologyOrder(b.dimensionId);
    })
    .slice(0, count);
}

export function rankPriorities(results: DimensionResult[], count = 2): DimensionResult[] {
  const complete = results.filter((r) => r.complete);
  return [...complete]
    .sort((a, b) => {
      if (a.percentage! !== b.percentage!) return a.percentage! - b.percentage!;
      return methodologyOrder(a.dimensionId) - methodologyOrder(b.dimensionId);
    })
    .slice(0, count);
}

// ---------------------------------------------------------------------------
// Service-business opportunity selection (Part 7)
// ---------------------------------------------------------------------------
// Deterministic, no external AI call. Scores each library entry by how many
// selected backgrounds it matches and whether it fits the stated customer
// preference, then returns the top 3. Falls back to the generic entries if
// fewer than 3 specific matches exist.

const GENERIC_FALLBACK_IDS = new Set(["general-done-for-you-support"]);

export function selectOpportunities(
  personalization: PersonalizationAnswers,
  count = 3
): Opportunity[] {
  const backgrounds = personalization.background ?? [];
  const preference: CustomerPreference = personalization.customerPreference ?? "Unsure";
  const userWantsGeneric = backgrounds.includes("Other") || backgrounds.includes("Still exploring") || backgrounds.length === 0;

  const scored = OPPORTUNITY_LIBRARY.filter((opp) => !GENERIC_FALLBACK_IDS.has(opp.id)).map((opp) => {
    const backgroundMatches = opp.relevantBackgrounds.filter((b) => backgrounds.includes(b)).length;
    const preferenceFits = opp.fitsPreference.includes(preference) || preference === "Unsure";
    let score = backgroundMatches * 10;
    if (preferenceFits) score += 1;
    return { opp, score, backgroundMatches };
  });

  // Real signal first: any opportunity that matches at least one selected
  // background, ranked by match strength then preference fit.
  const specific = scored
    .filter((s) => s.backgroundMatches > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.opp);

  // Generic fallback entries are only pulled in when the user genuinely gave
  // no specific signal (chose Other/Still exploring, or skipped P1) — never
  // ranked ahead of a real, if imperfect, background match.
  const genericPool = userWantsGeneric
    ? OPPORTUNITY_LIBRARY.filter((o) => GENERIC_FALLBACK_IDS.has(o.id))
    : [];

  // Remaining padding, in case specific + generic together are still short
  // of `count`: every other library entry, preference-fit ones first.
  const padding = scored
    .filter((s) => s.backgroundMatches === 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.opp);

  const seen = new Set<string>();
  const result: Opportunity[] = [];
  for (const opp of [...specific, ...genericPool, ...padding]) {
    if (result.length >= count) break;
    if (seen.has(opp.id)) continue;
    seen.add(opp.id);
    result.push(opp);
  }

  return result.slice(0, count);
}

// ---------------------------------------------------------------------------
// Three-step action plan (Part 8)
// ---------------------------------------------------------------------------
// Built from the lowest and second-lowest dimensions (via rankPriorities),
// plus business stage and primary goal. Templated and deterministic — no AI
// call, per Part 12's requirement that the core assessment work without one.

export interface ActionPlan {
  step1: string;
  step2: string;
  step3: string;
}

export function buildActionPlan(
  results: DimensionResult[],
  personalization: PersonalizationAnswers
): ActionPlan {
  const priorities = rankPriorities(results, 2);
  const lowest = priorities[0]
    ? DIMENSIONS.find((d) => d.id === priorities[0].dimensionId)!
    : DIMENSIONS[0];
  const second = priorities[1]
    ? DIMENSIONS.find((d) => d.id === priorities[1].dimensionId)!
    : DIMENSIONS[1];

  const stage = personalization.businessStage;
  const goal = personalization.primaryGoal;

  // Step 1: the lowest-scoring foundational dimension's own recommended action.
  const step1 = lowest.recommendedAction;

  // Step 2: a practical, customer-facing application that builds on Step 1,
  // informed by the second-lowest dimension so it doesn't just repeat Step 1.
  const step2 = buildStepTwo(lowest.id, second.id, stage);

  // Step 3: move toward the market — tied to the stated goal where possible,
  // but never instructs an unready participant to take payment or launch
  // before Steps 1-2 are addressed (Part 8's explicit rule).
  const step3 = buildStepThree(lowest.id, goal, stage);

  return { step1, step2, step3 };
}

function buildStepTwo(lowestId: DimensionId, secondId: DimensionId, stage: string | null): string {
  const templates: Record<DimensionId, string> = {
    "expertise-recognition":
      "Share your translated service outcomes with two or three people you trust and ask which ones sound most valuable to them.",
    "customer-problem-clarity":
      "Speak with three potential customers to understand their needs and test your assumptions about the problem you'd solve.",
    "service-offer-development":
      "Write a one-paragraph description of your offer — the customer, the problem, what they get, and the price — and read it out loud to check it's clear.",
    "business-readiness":
      "Map out, step by step, what happens from the moment someone says 'yes' to the moment they've received what they paid for.",
    "market-visibility":
      "Pick one channel from your audit and spend 30 minutes a day for a week actively using it to find potential customers.",
    "sales-confidence":
      "Practice explaining your offer and its price out loud until it feels natural, then say it to one real person.",
  };
  // Blend in the second-lowest dimension's focus when it differs meaningfully
  const secondNote: Partial<Record<DimensionId, string>> = {
    "customer-problem-clarity": " Pay attention to the specific problem they describe in their own words.",
    "market-visibility": " Note where they'd expect to find someone like you.",
    "sales-confidence": " Notice how it feels to talk about price, and keep practicing that part specifically.",
  };
  return templates[lowestId] + (secondId !== lowestId ? secondNote[secondId] ?? "" : "");
}

function buildStepThree(
  lowestId: DimensionId,
  goal: string | null,
  stage: string | null
): string {
  // Early-stage participants (no offer yet, or expertise/clarity is the gap)
  // get a validation-oriented Step 3, never "take payment" or "launch now."
  const earlyStageGaps: DimensionId[] = ["expertise-recognition", "customer-problem-clarity", "service-offer-development"];

  if (earlyStageGaps.includes(lowestId)) {
    return "Once your offer feels clear, identify one realistic channel for reaching a handful of potential customers — you're validating interest here, not launching a full sales push yet.";
  }

  if (lowestId === "business-readiness") {
    return "Before you take on a paying client, confirm you have a simple, working way to accept payment and deliver what you promised — then you're ready to say yes when someone asks.";
  }

  if (lowestId === "market-visibility") {
    return "Prepare a clear offer description and identify one realistic channel for reaching additional potential customers this week.";
  }

  // sales-confidence
  return "Identify one qualified potential customer you've already connected with, and prepare — and deliver — one real, appropriate invitation to take the next step.";
}

// ---------------------------------------------------------------------------
// Next Location Freedom resource (Part 10)
// ---------------------------------------------------------------------------
// Based on stage/goal/priorities, never on score alone.

export interface NextResource {
  product: "academy" | "cohort" | "fast-track";
  cta: string;
  supportingText: string;
}

export function recommendNextResource(
  personalization: PersonalizationAnswers,
  priorities: DimensionResult[]
): NextResource {
  const stage = personalization.businessStage ?? "";
  const wantsLiveSupport =
    stage.includes("started offering services") || stage.includes("already have paying customers");

  if (wantsLiveSupport) {
    return {
      product: "cohort",
      cta: "Explore the Live Location Freedom Cohort",
      supportingText:
        "Build your service business with live instruction, hands-on implementation, and a First Sale Activation Lab.",
    };
  }

  return {
    product: "academy",
    cta: "Explore the Location Freedom Academy",
    supportingText:
      "Turn your assessment insights into a practical service-business plan with structured lessons, tools, and implementation exercises.",
  };
}

export const FAST_TRACK_RESOURCE: NextResource = {
  product: "fast-track",
  cta: "Explore Founder Fast-Track",
  supportingText:
    "For those who want more individualized strategic guidance as they build — always shown as an option, never pushed based on a low score.",
};
