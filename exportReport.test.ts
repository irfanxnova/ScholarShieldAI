import { describe, it, expect } from 'vitest';
import {
  generateIncidentReportId,
  createIncidentReportData
} from '../exportReport';
import { analyzeMessage } from '../analyzeMessage';

describe('Incident Report Export & Serialization', () => {
  it('generates a valid, anonymized report ID conforming to SSR-YYYYMMDD-XXXX format', () => {
    const id = generateIncidentReportId();
    expect(id).toMatch(/^SSR-\d{8}-[0-9A-F]{4}$/);
  });

  it('generates a structured, schema-compliant incident report document from high-risk analysis', () => {
    const scamText =
      'Our compliance committee mandates a one-time refundable verification and registration clearance fee of $185.00 USD to release your award. Pay your verification clearance now to avoid permanent forfeiture. Please contact our advisor on Telegram: @ScholarshipDisbursementDesk.';
    const analysis = analyzeMessage(scamText);
    const report = createIncidentReportData(analysis, scamText);

    expect(report.schemaVersion).toBe('1.0.0');
    expect(report.product).toBe('ScholarShield AI');
    expect(report.reportId).toMatch(/^SSR-\d{8}-[0-9A-F]{4}$/);
    expect(report.generatedAt).toBeDefined();

    // Assessment check
    expect(report.assessment.overallScore).toBe(analysis.overallScore);
    expect(report.assessment.riskLevel).toBe(analysis.riskLevel);
    expect(report.assessment.riskLevel).toBe('HIGH');
    expect(report.assessment.summary).toBe(analysis.summary);

    // Warning Signals check
    expect(report.warningSignals.length).toBeGreaterThan(0);
    for (const sig of report.warningSignals) {
      expect(sig.ruleId).toBeDefined();
      expect(sig.title).toBeDefined();
      expect(sig.severity).toBeDefined();
      expect(sig.scoreContribution).toBeGreaterThanOrEqual(0);
      expect(sig.evidence).toBeDefined();
    }

    // Input safety
    expect(report.analyzedInput.characterLength).toBe(scamText.length);
    expect(report.analyzedInput.sanitizedMessage).toBe(scamText);

    // Disclaimers
    expect(report.disclaimers.fraudConfirmationNotice).toContain('IMPORTANT LEGAL DISCLAIMER');
    expect(report.disclaimers.limitations.length).toBeGreaterThan(0);
  });

  it('generates an accurate report for legitimate low-risk communications with zero signals', () => {
    const legitText = 'Undergraduate research symposium proposals due by next Friday. No fees required.';
    const analysis = analyzeMessage(legitText);
    const report = createIncidentReportData(analysis, legitText);

    expect(report.assessment.overallScore).toBe(0);
    expect(report.assessment.riskLevel).toBe('LOW');
    expect(report.warningSignals).toHaveLength(0);
    expect(report.assessment.signalsMatchedCount).toBe(0);
  });

  it('preserves untrusted characters, quotes, and punctuation safely without corruption', () => {
    const weirdText = 'Special test: <script>alert("xss")</script> & "quotes" \'single\' / slash \\ backslash';
    const analysis = analyzeMessage(weirdText);
    const report = createIncidentReportData(analysis, weirdText);

    expect(report.analyzedInput.sanitizedMessage).toBe(weirdText);
    // JSON serializability check
    const serialized = JSON.stringify(report);
    const parsed = JSON.parse(serialized);
    expect(parsed.analyzedInput.sanitizedMessage).toBe(weirdText);
  });
});
