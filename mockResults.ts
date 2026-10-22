import type { AnalysisResult } from '../types';
import { extractUrlsFromText } from '../lib/urlUtils';

export const SAMPLE_HIGH_RISK_RESULT: AnalysisResult = {
  id: 'result-demo-high-risk',
  analyzedAt: new Date().toISOString(),
  overallScore: 84,
  riskLevel: 'HIGH',
  confidenceScore: 0.92,
  evaluatedRuleCount: 18,
  matchedRuleCount: 4,
  summary:

    'Multiple high-severity fraudulent indicators detected, including an upfront payment demand disguised as a refundable verification fee, extreme artificial time pressure, and an unverified external payment link.',
  warningSignals: [
    {
      id: 'sig-advance-fee',
      title: 'Advance Processing Fee Demand',
      category: 'financial_fee',
      severity: 'critical',
      scoreContribution: 38,
      explanation:
        'Legitimate scholarships, fellowships, and university grants never require applicants or recipients to pay an upfront "clearance", "processing", or "insurance" fee to release funds.',
      evidence: 'mandates a one-time refundable verification and registration clearance fee of $185.00 USD',
      recommendedAction:
        'Never send funds via wire transfer, peer-to-peer apps, or gift cards to receive a scholarship.'
    },
    {
      id: 'sig-urgency-coercion',
      title: 'Artificial Countdown Urgency',
      category: 'urgency_coercion',
      severity: 'high',
      scoreContribution: 22,
      explanation:
        'Imposing an arbitrary 24-hour forfeiture deadline is a high-pressure psychological tactic designed to bypass deliberate critical evaluation.',
      evidence: 'must complete enrollment verification within 24 HOURS... avoid permanent forfeiture',
      recommendedAction:
        'Pause and consult your campus Financial Aid office before responding to strict short-fuse deadlines.'
    },
    {
      id: 'sig-untraceable-payment',
      title: 'Informal / Irreversible Payment Channels',
      category: 'suspicious_channel',
      severity: 'high',
      scoreContribution: 16,
      explanation:
        'Requesting Zelle, direct wire, or crypto vouchers eliminates consumer fraud protection and chargeback recourse.',
      evidence: 'Instant Bank Wire, Zelle to compliance-desk@..., or Crypto voucher',
      recommendedAction:
        'Reputable institutions only transact through registered university bursar accounts or accredited escrow.'
    },
    {
      id: 'sig-unsolicited-award',
      title: 'Unsolicited Selection Without Application',
      category: 'unverifiable_sender',
      severity: 'medium',
      scoreContribution: 8,
      explanation:
        'Receiving notification of an unsolicited award from an organization you never applied to is a primary hallmark of sweepstakes and grant fraud.',
      evidence: 'Your profile was selected from the national student collegiate database',
      recommendedAction:
        'Verify if you personally applied to this program; legitimate awards require a submitted application.'
    }
  ],
  extractedUrls: [
    {
      id: 'url-demo-1',
      url: 'https://apex-global-funds-clearance.temporary-pay.example.org/checkout?ref=98214',
      domain: 'apex-global-funds-clearance.temporary-pay.example.org',
      protocol: 'https',
      isIpAddress: false,
      isShortened: false,
      hasSuspiciousTld: false,
      usesPunycodeOrLookalike: true,
      observableNotes: [
        'Multi-level subdomains masking payment provider identity.',
        'Consecutive hyphenated keywords mimicking official escrow services.'
      ],
      riskWeight: 'high'
    }
  ],
  verificationChecklist: [
    {
      id: 'step-1',
      title: 'Contact University Financial Aid Office',
      instruction:
        'Forward the email headers and body to your campus Financial Aid or Dean of Students office for verification against known aid registers.',
      priority: 'essential',
      category: 'academic_office',
      rationale:
        'All legitimate campus and national accredited fellowships are logged within university financial aid clearinghouses.'
    },
    {
      id: 'step-2',
      title: 'Do Not Transfer Any Upfront Funds',
      instruction:
        'Under no circumstances send money via Zelle, Venmo, Wire, or gift vouchers. Legitimate scholarships deduct costs from award disbursements.',
      priority: 'essential',
      category: 'financial_safety',
      rationale:
        'Once funds are transmitted through P2P rails, recovery is near impossible.'
    },
    {
      id: 'step-3',
      title: 'Inspect Sender Domain MX Records',
      instruction:
        'Verify that the sender email address matches the official public domain of the organization rather than a disposable webmail or lookalike domain.',
      priority: 'recommended',
      category: 'official_channel',
      rationale:
        'Scammers frequently purchase domains with minor spelling variations of established non-profits.'
    }
  ],
  limitations: [
    'Static lexical risk indicators provide probabilistic assessment, not judicial certainty.',
    'Scammers continuously adapt terminology and phrasing to evade heuristic filters.',
    'Independent manual verification with accredited offices remains mandatory.'
  ],
  isMockPreview: true
};

export const SAMPLE_LOW_RISK_RESULT: AnalysisResult = {
  id: 'result-demo-low-risk',
  analyzedAt: new Date().toISOString(),
  overallScore: 12,
  riskLevel: 'LOW',
  confidenceScore: 0.88,
  evaluatedRuleCount: 18,
  matchedRuleCount: 1,
  summary:
    'No critical warning signals detected. The message uses formal academic terminology, directs the student to an authenticated institutional domain (.edu), and explicitly disclaims application fees.',
  warningSignals: [
    {
      id: 'sig-unverified-link',
      title: 'Unverified External Portal Link',
      category: 'unverifiable_sender',
      severity: 'low',
      scoreContribution: 12,
      explanation:
        'While the link points to a .edu structure, always verify links through official campus bookmarks rather than direct clicks in messages.',
      evidence: 'https://finaid.portal.stateuniv.example.edu/merit-awards',
      recommendedAction:
        'Navigate directly to your university portal via your bookmarked browser link.'
    }
  ],
  extractedUrls: [
    {
      id: 'url-demo-edu',
      url: 'https://finaid.portal.stateuniv.example.edu/merit-awards',
      domain: 'finaid.portal.stateuniv.example.edu',
      protocol: 'https',
      isIpAddress: false,
      isShortened: false,
      hasSuspiciousTld: false,
      usesPunycodeOrLookalike: false,
      observableNotes: [
        'Domain structure matches registered higher education (.edu) namespace.',
        'Encrypted TLS protocol active.'
      ],
      riskWeight: 'minimal'
    }
  ],
  verificationChecklist: [
    {
      id: 'step-edu-1',
      title: 'Login Via Verified Campus Single Sign-On',
      instruction:
        'Instead of clicking direct email links, navigate to your institutional student portal homepage and find the Financial Aid tab.',
      priority: 'recommended',
      category: 'academic_office',
      rationale:
        'Prevents potential credential interception from sophisticated homograph links.'
    },
    {
      id: 'step-edu-2',
      title: 'Confirm Deadline in Campus Academic Calendar',
      instruction:
        'Cross-check the stated submission deadline with the published registrar calendar.',
      priority: 'optional',
      category: 'official_channel',
      rationale:
        'Validates institutional scheduling consistency.'
    }
  ],
  limitations: [
    'Low risk does not guarantee 100% authenticity; compromised genuine accounts can occasionally dispatch spam.',
    'Always protect your student login credentials.'
  ],
  isMockPreview: true
};

export const SAMPLE_MEDIUM_RISK_RESULT: AnalysisResult = {
  id: 'result-demo-medium-risk',
  analyzedAt: new Date().toISOString(),
  overallScore: 48,
  riskLevel: 'MEDIUM',
  confidenceScore: 0.79,
  evaluatedRuleCount: 18,
  matchedRuleCount: 2,
  summary:

    'Moderate warning indicators detected. The offer presents exaggerated benefits and off-platform messaging channels (Telegram), but does not immediately request private passwords.',
  warningSignals: [
    {
      id: 'sig-off-platform-comm',
      title: 'Off-Platform Recruitment Channel',
      category: 'suspicious_channel',
      severity: 'medium',
      scoreContribution: 24,
      explanation:
        'Diverting applicants to Telegram or WhatsApp removes corporate compliance oversight and protects anonymous fraudulent recruiters.',
      evidence: 'Telegram: @NexGen_Recruiter_Official',
      recommendedAction:
        'Insist on conducting formal communications via verifiable enterprise email or ATS platforms.'
    },
    {
      id: 'sig-guaranteed-placement',
      title: 'Guaranteed Selection Without Competitive Screening',
      category: 'guaranteed_placement',
      severity: 'medium',
      scoreContribution: 24,
      explanation:
        'Legitimate tech and research internships require technical vetting and portfolio review; guaranteed instant placement is unrealistic.',
      evidence: '100% GUARANTEED selection upon onboarding test completion',
      recommendedAction:
        'Ask for a formal written offer letter and check the company status on national corporate registries.'
    }
  ],
  extractedUrls: [
    {
      id: 'url-demo-biz',
      url: 'http://nexgen-hardware-dispatch.biz.example.com/checkout?id=8831',
      domain: 'nexgen-hardware-dispatch.biz.example.com',
      protocol: 'http',
      isIpAddress: false,
      isShortened: false,
      hasSuspiciousTld: true,
      usesPunycodeOrLookalike: false,
      observableNotes: [
        'Transmits over unencrypted HTTP.',
        'Uses generic business subdomain (.biz) registered separately from corporate website.'
      ],
      riskWeight: 'elevated'
    }
  ],
  verificationChecklist: [
    {
      id: 'step-med-1',
      title: 'Verify Employer on Campus Career Network (Handshake/Symplicity)',
      instruction:
        'Search for the employer name in your university approved career center portal to confirm accredited recruiting status.',
      priority: 'essential',
      category: 'academic_office',
      rationale:
        'Campus career centers vet employers for liability and insurance compliance.'
    },
    {
      id: 'step-med-2',
      title: 'Refuse Candidate-Financed Equipment Purchases',
      instruction:
        'Legitimate employers ship company hardware directly or provide pre-funded procurement accounts; they never ask interns to purchase kits from arbitrary web stores.',
      priority: 'essential',
      category: 'financial_safety',
      rationale:
        'Fake equipment vendors are owned by the scam syndicates.'
    }
  ],
  limitations: [
    'Medium risk indicates ambiguous signals requiring proactive student vigilance before proceeding.',
    'Scrutinize business registration and avoid off-channel messaging.'
  ],
  isMockPreview: true
};

/**
 * Generates an architectural preview or preliminary analysis result based on input text.
 * When real heuristic engine is added in Prompt 2, this cleanly plugs into it.
 */
export function generateAnalysisPreview(inputText: string, exampleId?: string): AnalysisResult {
  const extractedUrls = extractUrlsFromText(inputText);
  const lower = inputText.toLowerCase();

  // If matching specific demo example or strong heuristic markers
  if (
    exampleId === 'example-2-scholarship-fee' ||
    exampleId === 'example-4-credential-otp' ||
    lower.includes('processing fee') ||
    lower.includes('refundable verification') ||
    lower.includes('password') ||
    lower.includes('otp') ||
    lower.includes('zelle')
  ) {
    const base = { ...SAMPLE_HIGH_RISK_RESULT };
    base.id = `result-${Date.now()}`;
    base.analyzedAt = new Date().toISOString();
    base.extractedUrls = extractedUrls.length > 0 ? extractedUrls : base.extractedUrls;
    return base;
  }

  if (
    exampleId === 'example-3-guaranteed-internship' ||
    lower.includes('guaranteed') ||
    lower.includes('telegram') ||
    lower.includes('whatsapp')
  ) {
    const base = { ...SAMPLE_MEDIUM_RISK_RESULT };
    base.id = `result-${Date.now()}`;
    base.analyzedAt = new Date().toISOString();
    base.extractedUrls = extractedUrls.length > 0 ? extractedUrls : base.extractedUrls;
    return base;
  }

  // Default to low or contextual low risk
  const base = { ...SAMPLE_LOW_RISK_RESULT };
  base.id = `result-${Date.now()}`;
  base.analyzedAt = new Date().toISOString();
  base.extractedUrls = extractedUrls.length > 0 ? extractedUrls : base.extractedUrls;
  return base;
}
