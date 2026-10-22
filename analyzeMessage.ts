import type {
  AnalysisResult,
  WarningSignal,
  VerificationStep,
  RiskLevel
} from '../types';
import { extractUrlsFromText } from './urlUtils';
import {
  DETECTION_RULES,
  RISK_THRESHOLDS,
  CATEGORY_SCORE_CAPS
} from './detectionRules';
import { validateInputText, normalizeDetectionText } from './textNormalization';

/**
 * Tailors actionable verification steps according to the specific threat categories detected.
 */
function buildVerificationChecklist(
  matchedCategories: Set<string>,
  riskLevel: RiskLevel
): VerificationStep[] {
  const steps: VerificationStep[] = [];

  if (matchedCategories.has('credential_theft')) {
    steps.push({
      id: 'step-protect-credentials',
      title: 'Never Disclose Passwords or 2FA Push Tokens',
      instruction:
        'Immediately cease communication. University IT and department chairs will NEVER ask for your password, DUO push approval, or SMS one-time passcode.',
      priority: 'essential',
      category: 'identity_protection',
      rationale:
        'Credential harvesting allows adversaries to access campus email, divert payroll, and alter enrollment records.'
    });
    steps.push({
      id: 'step-change-password-alert',
      title: 'Reset Campus Credentials If Disclosed',
      instruction:
        'If you already entered your login details or shared an OTP, navigate directly to your university account security portal and change your password immediately, then notify campus IT security.',
      priority: 'essential',
      category: 'identity_protection',
      rationale:
        'Rapid password revocation neutralizes unauthorized active sessions before financial transfers occur.'
    });
  }

  if (matchedCategories.has('financial_fee')) {
    steps.push({
      id: 'step-refuse-advance-payment',
      title: 'Refuse Upfront Processing or Registration Fees',
      instruction:
        'Do not send money via Zelle, Venmo, wire transfer, or gift cards. Legitimate scholarships and accredited grants never charge fees to award money.',
      priority: 'essential',
      category: 'financial_safety',
      rationale:
        'Peer-to-peer and cryptocurrency payments offer zero fraud protection and cannot be recalled once sent.'
    });
    steps.push({
      id: 'step-contact-financial-aid',
      title: 'Contact University Financial Aid Office',
      instruction:
        'Forward the email headers and body to your campus Financial Aid office to verify whether the scholarship exists on accredited national registers.',
      priority: 'essential',
      category: 'academic_office',
      rationale:
        'All legitimate institutional and state aid programs maintain formal clearinghouse records.'
    });
  }

  if (matchedCategories.has('guaranteed_placement')) {
    steps.push({
      id: 'step-career-center-verify',
      title: 'Verify Employer on Campus Career Platform',
      instruction:
        'Search for the employer on Handshake, Symplicity, or your university career portal. If not found, contact career services to check employer accreditation.',
      priority: 'essential',
      category: 'academic_office',
      rationale:
        'Campus career centers conduct compliance vetting on hiring organizations.'
    });
    steps.push({
      id: 'step-refuse-equipment-buy',
      title: 'Refuse Candidate-Financed Vendor Purchases',
      instruction:
        'Legitimate employers supply necessary hardware and software at company expense; never purchase developer kits from links provided in an email.',
      priority: 'essential',
      category: 'financial_safety',
      rationale:
        'Equipment kit portals are operated by fraudsters as an advance-fee extraction mechanism.'
    });
  }

  if (matchedCategories.has('suspicious_channel') || matchedCategories.has('unverifiable_sender')) {
    steps.push({
      id: 'step-official-directory-lookup',
      title: 'Conduct Out-of-Band Directory Verification',
      instruction:
        'Look up the organization or faculty sender in an independent official directory (e.g. campus faculty roster or corporate corporate site). Do not reply to the message sender directly.',
      priority: 'recommended',
      category: 'official_channel',
      rationale:
        'Verifying through an independently obtained channel prevents attacker-in-the-middle impersonation.'
    });
  }

  // Baseline verification for low risk or general inquiry
  if (steps.length === 0 || riskLevel === 'LOW') {
    steps.push({
      id: 'step-bookmark-navigation',
      title: 'Navigate Through Official Bookmarks',
      instruction:
        'Rather than clicking links inside emails, open your browser and navigate to your university student portal or financial aid page directly via your saved bookmarks.',
      priority: 'recommended',
      category: 'official_channel',
      rationale:
        'Direct URL entry protects against sophisticated lookalike domains and email spoofing.'
    });
    steps.push({
      id: 'step-academic-calendar-check',
      title: 'Cross-Check Stated Deadlines',
      instruction:
        'Verify scholarship application windows against the published registrar or fellowship calendar.',
      priority: 'optional',
      category: 'academic_office',
      rationale:
        'Validates institutional scheduling consistency.'
    });
  }

  return steps;
}

/**
 * Synthesizes an evidence-based executive summary tailored to the analysis results.
 */
function buildExecutiveSummary(
  warningSignals: WarningSignal[],
  riskLevel: RiskLevel,
  overallScore: number
): string {
  if (warningSignals.length === 0 || overallScore === 0) {
    return 'No elevated warning signals detected among the evaluated threat patterns. The message uses conventional academic or professional wording without advance fee demands, credential harvesting, or coercion. Note that absence of detected warning signals does not guarantee authenticity; always practice safe verification.';
  }

  const categoryCounts: Record<string, number> = {};
  for (const s of warningSignals) {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  }

  const parts: string[] = [];

  if (categoryCounts['credential_theft']) {
    parts.push('severe credential or multi-factor authentication (OTP) harvesting attempts');
  }
  if (categoryCounts['financial_fee']) {
    parts.push('advance fee or equipment purchase demands');
  }
  if (categoryCounts['urgency_coercion']) {
    parts.push('artificial short-fuse countdown urgency');
  }
  if (categoryCounts['guaranteed_placement']) {
    parts.push('unrealistic guaranteed placement promises');
  }
  if (categoryCounts['suspicious_channel']) {
    parts.push('off-platform communications or irreversible payment rails');
  }
  if (categoryCounts['unverifiable_sender']) {
    parts.push('unverifiable entity patterns or unencrypted web links');
  }
  if (categoryCounts['inconsistent_branding']) {
    parts.push('deceptive lookalike or masked link patterns');
  }

  const threatDescription = parts.join(', ');

  if (riskLevel === 'HIGH') {
    return `Elevated threat level (${overallScore}/100). The analysis identified ${warningSignals.length} critical warning signal${
      warningSignals.length === 1 ? '' : 's'
    }, notably ${threatDescription}. These patterns strongly indicate fraudulent solicitation designed to extract money or student credentials. Cease communication immediately.`;
  }

  if (riskLevel === 'MEDIUM') {
    return `Moderate caution advised (${overallScore}/100). The analysis identified ${warningSignals.length} warning signal${
      warningSignals.length === 1 ? '' : 's'
    }, including ${threatDescription}. These signals warrant caution and independent institutional verification before taking action.`;
  }

  return `Low immediate risk (${overallScore}/100). The message contains ${warningSignals.length} minor advisory signal${
    warningSignals.length === 1 ? '' : 's'
  } (${threatDescription}). No severe fraud or credential theft markers were observed. Standard vigilance is recommended.`;
}

/**
 * Pure, deterministic analysis engine for student scholarship and internship communications.
 * Evaluates lexical threat patterns, credential theft, and quarantined URL structures.
 */
export function analyzeMessage(rawInput: string): AnalysisResult {
  const timestamp = new Date().toISOString();
  const totalRulesCount = DETECTION_RULES.length;

  // Input validation and bounds checking
  const validation = validateInputText(rawInput);
  if (!validation.isValid) {
    return {
      id: `analysis-${Date.now()}`,
      analyzedAt: timestamp,
      overallScore: 0,
      riskLevel: 'LOW',
      evaluatedRuleCount: totalRulesCount,
      matchedRuleCount: 0,
      summary:
        validation.errorMessage ||
        'No message text provided for analysis. Paste an email body, offer circular, or recruitment message to evaluate scam indicators.',
      warningSignals: [],
      extractedUrls: [],
      verificationChecklist: buildVerificationChecklist(new Set(), 'LOW'),
      limitations: [
        'Analysis requires text input to detect lexical markers and URL structures.',
        'Empty submissions produce a default zero-risk assessment.'
      ],
      isMockPreview: false
    };
  }

  const rawText = validation.sanitized;

  // 1. Quarantined Static URL extraction from raw input
  const extractedUrls = extractUrlsFromText(rawText);

  // 2. Normalized text strictly for heuristic matching (raw text preserved untouched)
  const normalized = normalizeDetectionText(rawText);
  const detectionText = normalized.normalizedForDetection;

  // 3. Rule Evaluation
  interface RawMatch {
    rule: (typeof DETECTION_RULES)[0];
    evidence: string;
  }

  const rawMatches: RawMatch[] = [];

  for (const rule of DETECTION_RULES) {
    try {
      // Evaluate against detectionText; fallback to rawText if needed
      let result = rule.evaluate(detectionText, extractedUrls);
      if ((!result || !result.matched) && detectionText !== rawText) {
        result = rule.evaluate(rawText, extractedUrls);
      }

      if (result && result.matched && result.evidence) {
        rawMatches.push({
          rule,
          evidence: result.evidence
        });
      }
    } catch {
      // In case of malformed input, fail gracefully without throwing
    }
  }

  // 3. Category-Capped Scoring & Deduplication
  const matchedCategories = new Set<string>();
  const categoryRawScores: Record<string, number> = {};
  const categoryMatches: Record<string, RawMatch[]> = {};

  for (const match of rawMatches) {
    const cat = match.rule.category;
    matchedCategories.add(cat);
    categoryRawScores[cat] = (categoryRawScores[cat] || 0) + match.rule.weight;
    if (!categoryMatches[cat]) categoryMatches[cat] = [];
    categoryMatches[cat].push(match);
  }

  // Calculate scaled / capped warning signal contributions
  const warningSignals: WarningSignal[] = [];
  let baseScore = 0;

  for (const cat of Object.keys(categoryMatches)) {
    const matches = categoryMatches[cat];
    const rawTotal = categoryRawScores[cat];
    const cap = CATEGORY_SCORE_CAPS[cat] ?? 35;
    const effectiveCategoryScore = Math.min(rawTotal, cap);
    baseScore += effectiveCategoryScore;

    // Distribute the category's effective score across its signals
    const scaleFactor = effectiveCategoryScore / rawTotal;

    for (const m of matches) {
      const scaledContribution = Math.round(m.rule.weight * scaleFactor);
      warningSignals.push({
        id: m.rule.id,
        title: m.rule.title,
        category: m.rule.category,
        severity: m.rule.severity,
        explanation: m.rule.explanation,
        evidence: m.evidence,
        scoreContribution: scaledContribution,
        recommendedAction: m.rule.recommendedAction
      });
    }
  }

  // 4. Compound Contextual Threat Bonuses
  let compoundBonus = 0;
  if (matchedCategories.has('financial_fee') && matchedCategories.has('urgency_coercion')) {
    compoundBonus += 8; // Classic advance fee fraud combination
  }
  if (matchedCategories.has('financial_fee') && matchedCategories.has('suspicious_channel')) {
    compoundBonus += 10; // Advance fee via irreversible/P2P channel (Zelle, crypto, wire)
  }
  if (matchedCategories.has('credential_theft') && matchedCategories.has('urgency_coercion')) {
    compoundBonus += 10; // High-pressure credential harvesting
  }
  if (matchedCategories.has('guaranteed_placement') && matchedCategories.has('financial_fee')) {
    compoundBonus += 12; // Fake internship equipment kit scheme
  }


  // Total Bounded Score (0 - 100)
  const overallScore = Math.min(100, Math.max(0, baseScore + compoundBonus));

  // 5. Risk Level Classification
  let riskLevel: RiskLevel = 'LOW';
  if (overallScore >= RISK_THRESHOLDS.HIGH_MIN) {
    riskLevel = 'HIGH';
  } else if (overallScore > RISK_THRESHOLDS.LOW_MAX) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  // 6. Verification Protocol & Executive Summary
  const verificationChecklist = buildVerificationChecklist(matchedCategories, riskLevel);
  const summary = buildExecutiveSummary(warningSignals, riskLevel, overallScore);

  // 7. Transparent Limitations Documentation
  const limitations = [
    'Static rule heuristics evaluate observable textual patterns and URL syntax, not network reputation or DNS authority.',
    'Risk score represents an explainable evidentiary warning level, not a statistical likelihood or judicial confirmation of fraud.',
    'Sophisticated adversarial attackers may rephrase solicitations to bypass specific keyword triggers.',
    'Independent verification through official campus or corporate channels remains mandatory.'
  ];

  if (validation.isTruncated) {
    limitations.push('Message exceeded the 10,000 character security limit and was safely truncated for evaluation.');
  }
  if (normalized.hasObfuscationMarkers) {
    limitations.push(
      `Text normalization detected evasion artifacts (${normalized.transformationsApplied.join(', ')}) and standardized them for heuristic matching.`
    );
  }

  return {
    id: `analysis-${Date.now()}`,
    analyzedAt: timestamp,
    overallScore,
    riskLevel,
    evaluatedRuleCount: totalRulesCount,
    matchedRuleCount: warningSignals.length,
    summary,
    warningSignals,
    extractedUrls,
    verificationChecklist,
    limitations,
    isMockPreview: false
  };
}
