export interface PresentationStepDef {
  number: number;
  title: string;
  subtitle: string;
  targetTab: 'overview' | 'analyze' | 'evaluation' | 'about';
  exampleId?: string;
  talkingPoints: string[];
}

export const PRESENTATION_STEPS: PresentationStepDef[] = [
  {
    number: 1,
    title: 'Threat Landscape & Problem Framing',
    subtitle: 'The Collegiate Cyber Deception Epidemic',
    targetTab: 'overview',
    talkingPoints: [
      'Students face intense academic pressure, tuition debt, and strict internship deadlines, making them prime social-engineering targets.',
      'Four dominant threat vectors: Advance-fee grant fraud, candidate-paid equipment kits, DUO 2FA harvesting, and fake check overpayment.',
      'ScholarShield AI provides 100% client-side, explainable heuristic detection without third-party cloud data exposure.'
    ]
  },
  {
    number: 2,
    title: 'Live Threat 1: Advance-Fee Scholarship Scam',
    subtitle: 'Global Scholars Grant — $185 Clearance Demand',
    targetTab: 'analyze',
    exampleId: 'example-2-scholarship-fee',
    talkingPoints: [
      'Scenario: Congratulatory notification claiming a $12,000 grant reserved from a "generic database".',
      'Mandates a $185 "refundable verification and registration clearance fee" under an artificial 24-hour countdown.',
      'Detection Engine Output: HIGH RISK (Score 84/100) — Flags Advance Fee Demand (+42), Artificial Urgency (+18), and Compound Bonus (+8).'
    ]
  },
  {
    number: 3,
    title: 'Live Threat 2: Credential & 2FA Push Harvesting',
    subtitle: 'Urgent Campus Placement — Department Head Pretext',
    targetTab: 'analyze',
    exampleId: 'example-4-urgent-placement-otp',
    talkingPoints: [
      'Scenario: Attacker impersonates the department chair demanding campus single sign-on (SSO) login and immediate approval of DUO Mobile 2FA push.',
      'Cutoff time (5:00 PM today) induces panic to bypass student caution.',
      'Detection Engine Output: HIGH RISK (Score 98/100) — Intercepts both Password Theft (+45) and DUO Push Harvest (+45) with urgent coercion bonus.'
    ]
  },
  {
    number: 4,
    title: 'Negative Control: Plausible Legitimate Notice',
    subtitle: 'Regional Tech Incubator — Multi-Stage Screening',
    targetTab: 'analyze',
    exampleId: 'example-5-legitimate-incubator',
    talkingPoints: [
      'Scenario: Follow-up from a campus career fair for a Summer Analyst cohort with realistic wages ($24–$28/hr) and multi-stage screening.',
      'Engine Output: LOW RISK (Score 0/100) — Zero malicious markers triggered.',
      'CRITICAL SCIENTIFIC DISTINCTION: Emphasize to the class that LOW Risk does NOT equal "guaranteed safe". Heuristics only check observable patterns; independent campus verification remains mandatory.'
    ]
  },
  {
    number: 5,
    title: 'Empirical Evaluation & Confusion Matrix',
    subtitle: 'Scientific Metrics on Held-Out Benchmark Partition',
    targetTab: 'evaluation',
    talkingPoints: [
      'Curated 80-sample benchmark dataset (40 legitimate, 40 scam) with group-aware leakage protection.',
      'Walk through the Confusion Matrix: True Positives (20), False Positives (0), True Negatives (17), False Negatives (3).',
      'Explain Precision (100.0%) and Recall (87.0%) trade-offs and demonstrate the Error Analysis Explorer showing why edge cases occurred.'
    ]
  }
];
