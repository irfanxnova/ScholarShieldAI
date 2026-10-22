import { describe, it, expect } from 'vitest';
import { analyzeMessage } from '../analyzeMessage';
import { RISK_THRESHOLDS } from '../detectionRules';

import { EXAMPLE_MESSAGES } from '../../data/examples';

describe('ScholarShield AI - Message Detection Engine', () => {
  // Test 1: Empty and whitespace-only input
  it('handles empty and whitespace-only input gracefully with zero score', () => {
    const emptyResult = analyzeMessage('');
    expect(emptyResult.overallScore).toBe(0);
    expect(emptyResult.riskLevel).toBe('LOW');
    expect(emptyResult.warningSignals).toHaveLength(0);
    expect(emptyResult.matchedRuleCount).toBe(0);

    const whitespaceResult = analyzeMessage('   \n\t  \r\n   ');
    expect(whitespaceResult.overallScore).toBe(0);
    expect(whitespaceResult.riskLevel).toBe('LOW');
    expect(whitespaceResult.warningSignals).toHaveLength(0);
  });

  // Test 2: Explicit advance-fee scam
  it('classifies explicit advance-fee scholarship scams as HIGH risk', () => {
    const message = `
      Congratulations! You have been granted the National Apex Fellowship of $10,000.
      Our compliance desk mandates a one-time refundable verification fee of $150.00
      paid via Zelle to release your escrow disbursement packet.
    `;
    const result = analyzeMessage(message);

    expect(result.overallScore).toBeGreaterThanOrEqual(RISK_THRESHOLDS.HIGH_MIN);
    expect(result.riskLevel).toBe('HIGH');

    const hasAdvanceFee = result.warningSignals.some((s) => s.id === 'sig-advance-fee');
    const hasP2PPayment = result.warningSignals.some((s) => s.id === 'sig-untraceable-payment');

    expect(hasAdvanceFee).toBe(true);
    expect(hasP2PPayment).toBe(true);
  });

  // Test 3: Guaranteed placement conditional on payment (equipment kit scam)
  it('detects guaranteed placement conditioned on mandatory equipment or kit purchase', () => {
    const message = `
      Hiring immediately: Remote AI Developer Intern ($65.00/hour).
      100% guaranteed selection upon onboarding test completion! No experience needed.
      All applicants must acquire the proprietary "NexGen Neural Developer Workstation Suite"
      from our certified vendor kit link ($250). Company will reimburse this on first pay stub.
    `;
    const result = analyzeMessage(message);

    expect(result.overallScore).toBeGreaterThanOrEqual(RISK_THRESHOLDS.HIGH_MIN);
    expect(result.riskLevel).toBe('HIGH');

    const hasGuaranteed = result.warningSignals.some((s) => s.id === 'sig-guaranteed-placement');
    const hasKitFee = result.warningSignals.some((s) => s.id === 'sig-training-kit-fee');

    expect(hasGuaranteed).toBe(true);
    expect(hasKitFee).toBe(true);
  });

  // Test 4: OTP and student portal password theft
  it('identifies student portal credentials and 2FA OTP harvesting as critical threats', () => {
    const message = `
      Urgent Student Work-Study from Dr. Vance.
      Please reply immediately with your student portal username and password.
      When the DUO Mobile 2-Factor push notification appears on your phone, reply back with the 6-digit code immediately.
    `;
    const result = analyzeMessage(message);

    expect(result.overallScore).toBeGreaterThanOrEqual(RISK_THRESHOLDS.HIGH_MIN);
    expect(result.riskLevel).toBe('HIGH');

    const hasPasswordHarvest = result.warningSignals.some((s) => s.id === 'sig-portal-password');
    const hasOtpHarvest = result.warningSignals.some((s) => s.id === 'sig-otp-harvest');

    expect(hasPasswordHarvest).toBe(true);
    expect(hasOtpHarvest).toBe(true);
  });

  // Test 5: Artificial urgency combined with payment demand (compound bonus)
  it('calculates compound threat bonus when urgency is coupled with payment demands', () => {
    const paymentOnly = `
      Please pay your verification fee of $120 to release disbursement.
    `;
    const paymentAndUrgency = `
      Please pay your verification fee of $120 to release disbursement within 24 hours to avoid permanent forfeiture.
    `;

    const res1 = analyzeMessage(paymentOnly);
    const res2 = analyzeMessage(paymentAndUrgency);

    expect(res2.overallScore).toBeGreaterThan(res1.overallScore);
    expect(res2.warningSignals.some((s) => s.category === 'urgency_coercion')).toBe(true);
  });

  // Test 6: Legitimate scholarship announcement with standard deadline
  it('does NOT falsely flag a legitimate scholarship with normal deadline and negative fee context', () => {
    const message = `
      From: Financial Aid Office <finaid@stateuniv.example.edu>
      Subject: 2026 Academic Excellence Merit Scholarship
      Dear Student,
      The application window for the 2026 Merit Scholarship is open until November 15, 2026.
      There is NO application fee or processing fee at any stage.
      Submit through your authenticated student portal: https://finaid.portal.stateuniv.example.edu/merit
      Do not send bank statements or identity credentials over email.
    `;
    const result = analyzeMessage(message);

    expect(result.overallScore).toBeLessThan(RISK_THRESHOLDS.LOW_MAX);
    expect(result.riskLevel).toBe('LOW');

    // Negative context guard check: "NO application fee" must not trigger advance fee fraud!
    const falselyTriggeredFee = result.warningSignals.some((s) => s.id === 'sig-advance-fee');
    expect(falselyTriggeredFee).toBe(false);
  });

  // Test 7: Plausible internship with no strong suspicious indicators
  it('classifies a plausible corporate recruitment notice as LOW risk', () => {
    const message = `
      Subject: Summer Analyst Internship Opportunity
      Hi Alex,
      We reviewed your resume from the campus career fair and invite you to apply for our Summer Analyst Cohort.
      Pay is $24.00 per hour with standard 10-week curriculum.
      Hiring process involves online review, asynchronous logic test, and engineering interview.
      Portal: https://careers.apexdynamicslabs.example.com/interns
    `;
    const result = analyzeMessage(message);

    expect(result.overallScore).toBeLessThan(RISK_THRESHOLDS.LOW_MAX);
    expect(result.riskLevel).toBe('LOW');
  });

  // Test 8: Unfamiliar URL without other suspicious indicators
  it('does NOT classify an unfamiliar domain alone as high risk or fraud', () => {
    const message = `
      Please review the conference schedule for the undergraduate robotics workshop:
      https://midwest-robotics-summit-registration.org/schedule
      Let us know if you will attend the poster session.
    `;
    const result = analyzeMessage(message);

    expect(result.overallScore).toBeLessThan(RISK_THRESHOLDS.LOW_MAX);
    expect(result.riskLevel).toBe('LOW');
  });

  // Test 9: Plain HTTP and URL shorteners
  it('flags unencrypted HTTP and obfuscated shortened URLs without claiming standalone fraud', () => {
    const message = `
      Please review the details at: http://bit.ly/student-notice-info
    `;
    const result = analyzeMessage(message);

    const hasHttp = result.warningSignals.some((s) => s.id === 'sig-url-insecure-http');
    const hasShortener = result.warningSignals.some((s) => s.id === 'sig-url-shortened');

    expect(hasHttp).toBe(true);
    expect(hasShortener).toBe(true);
    // Even with both URL indicators, it shouldn't jump directly to HIGH without severe content threats
    expect(result.overallScore).toBeLessThan(RISK_THRESHOLDS.HIGH_MIN);
  });

  // Test 10: Malformed URLs and raw IP addresses
  it('safely parses malformed URLs and detects raw numeric IP addresses', () => {
    const message = `
      Connect to the test bench at http://192.168.1.100/checkout and check invalid links like http:///broken
    `;
    const result = analyzeMessage(message);

    const hasRawIp = result.warningSignals.some((s) => s.id === 'sig-url-raw-ip');
    expect(hasRawIp).toBe(true);
    expect(result.extractedUrls.length).toBeGreaterThanOrEqual(1);
  });

  // Test 11: Repeated overlapping warning signals and category score capping
  it('caps category contributions to prevent score inflation from repetitive phrasing', () => {
    const message = `
      Mandates a one-time refundable verification fee of $150.
      Also requires a registration fee of $100.
      Pay your clearance fee of $80.
      Release your escrow disbursement fee of $200.
    `;
    const result = analyzeMessage(message);

    // Sum of signals in financial_fee should be capped at CATEGORY_SCORE_CAPS.financial_fee (45 pts)
    const financialSignals = result.warningSignals.filter((s) => s.category === 'financial_fee');
    const financialScore = financialSignals.reduce((acc, s) => acc + s.scoreContribution, 0);

    expect(financialScore).toBeLessThanOrEqual(45);
  });

  // Test 12: Score bounds (0 <= score <= 100)
  it('guarantees overall score is strictly bounded between 0 and 100', () => {
    const extremeThreat = `
      CONGRATULATIONS!! You were selected from the national student collegiate database for $50,000!
      You must complete enrollment verification within 24 hours to avoid permanent forfeiture!
      Mandates a one-time refundable verification fee of $250 via Zelle to compliance@apex.example.com.
      Reply with your student portal username and password, and share your DUO Mobile 2-Factor push code immediately!
      100% guaranteed selection upon onboarding! Must acquire the proprietary workstation kit from vendor kit link.
      Telegram: @Scam_Recruiter_Official
      Link: http://192.168.1.50/pay.xyz
    `;
    const result = analyzeMessage(extremeThreat);

    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.riskLevel).toBe('HIGH');
  });

  // Test 13: Threshold boundaries (29 vs 30, 69 vs 70)
  it('respects exact threshold boundaries between LOW, MEDIUM, and HIGH', () => {
    expect(RISK_THRESHOLDS.LOW_MAX).toBe(29);
    expect(RISK_THRESHOLDS.MEDIUM_MAX).toBe(69);
    expect(RISK_THRESHOLDS.HIGH_MIN).toBe(70);

    const lowMsg = analyzeMessage('General notice about campus library study rooms.');
    expect(lowMsg.overallScore).toBeLessThanOrEqual(29);
    expect(lowMsg.riskLevel).toBe('LOW');
  });

  // Test 14: Evidence excerpts grounded in actual user input
  it('ensures all generated evidence snippets are exact substrings of the submitted input', () => {
    const message = `
      URGENT: Your profile was selected from the national student collegiate database.
      You must pay your verification clearance now to avoid permanent forfeiture.
      Reply back with the 6-digit code immediately.
    `;
    const result = analyzeMessage(message);

    expect(result.warningSignals.length).toBeGreaterThan(0);
    for (const signal of result.warningSignals) {
      // Stripping ellipsis if present
      const cleanSnippet = signal.evidence.replace(/^\.\.\./, '').replace(/\.\.\.$/, '');
      expect(message).toContain(cleanSnippet);
    }
  });

  // Test 15: Deterministic results for identical input
  it('produces identical deterministic scores and signals for identical inputs', () => {
    const message = `
      Remote AI Research Intern ($65.00/hour). 100% guaranteed selection upon onboarding!
      Must acquire proprietary developer workstation kit from vendor kit link.
      Telegram: @TechRecruiter
    `;
    const resA = analyzeMessage(message);
    const resB = analyzeMessage(message);

    expect(resA.overallScore).toBe(resB.overallScore);
    expect(resA.riskLevel).toBe(resB.riskLevel);
    expect(resA.warningSignals.length).toBe(resB.warningSignals.length);
    expect(resA.warningSignals.map((s) => s.id)).toEqual(resB.warningSignals.map((s) => s.id));
  });

  // Test 16: Long input and unusual unicode characters
  it('handles long input and unusual unicode characters without crashing', () => {
    const longText = 'Campus career update announcement: '.repeat(500) + ' ⚡🔒✨ http://example.org/test?id=49823489';
    const result = analyzeMessage(longText);

    expect(result).toBeDefined();
    expect(typeof result.overallScore).toBe('number');
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(result.riskLevel);
  });

  // Test 17: No false claim that a message is verified or guaranteed safe
  it('never falsely claims absence of signals constitutes proof of legitimacy', () => {
    const safeText = 'Hello students, welcome to the fall semester.';
    const result = analyzeMessage(safeText);

    expect(result.summary).not.toContain('verified legitimate');
    expect(result.summary).not.toContain('guaranteed safe');
    expect(result.summary.toLowerCase()).toContain('does not guarantee authenticity');
  });

  // Test 18: Live execution on all 5 demonstration benchmark examples
  it('accurately evaluates all 5 fictional demonstration scenarios', () => {
    for (const example of EXAMPLE_MESSAGES) {
      const result = analyzeMessage(example.content);

      expect(result).toBeDefined();
      expect(typeof result.overallScore).toBe('number');
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);

      // Verify alignment with expected risk tier
      if (example.expectedRisk === 'HIGH') {
        expect(result.overallScore).toBeGreaterThanOrEqual(RISK_THRESHOLDS.HIGH_MIN);
        expect(result.riskLevel).toBe('HIGH');
      } else if (example.expectedRisk === 'LOW') {
        expect(result.overallScore).toBeLessThanOrEqual(RISK_THRESHOLDS.LOW_MAX);
        expect(result.riskLevel).toBe('LOW');
      }
    }
  });
});
