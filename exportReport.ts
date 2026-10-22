import type { AnalysisResult, RiskLevel } from '../types';

export interface IncidentReportDocument {
  schemaVersion: '1.0.0';
  product: 'ScholarShield AI';
  reportId: string;
  generatedAt: string;
  assessment: {
    overallScore: number;
    riskLevel: RiskLevel;
    ruleCountEvaluated: number;
    signalsMatchedCount: number;
    summary: string;
  };
  analyzedInput: {
    characterLength: number;
    sanitizedMessage: string;
  };
  warningSignals: Array<{
    ruleId: string;
    title: string;
    category: string;
    severity: string;
    scoreContribution: number;
    evidence: string;
    explanation: string;
    recommendedAction: string;
  }>;
  quarantinedUrls: Array<{
    url: string;
    domain: string;
    protocol: string;
    riskWeight: string;
    structuralObservations: string[];
  }>;
  verificationChecklist: Array<{
    priority: string;
    title: string;
    instruction: string;
    rationale: string;
  }>;
  disclaimers: {
    academicResearchNotice: string;
    fraudConfirmationNotice: string;
    limitations: string[];
  };
}

/**
 * Generates an anonymized, collision-resistant report identifier.
 * Format: SSR-YYYYMMDD-XXXX (e.g. SSR-20261021-A7F2)
 * Contains zero personal identifying information or user telemetry.
 */
export function generateIncidentReportId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // Generate 4 cryptographically sound or pseudo-random hex characters
  const randChars = '0123456789ABCDEF';
  let randSuffix = '';
  for (let i = 0; i < 4; i++) {
    randSuffix += randChars[Math.floor(Math.random() * randChars.length)];
  }

  return `SSR-${year}${month}${day}-${randSuffix}`;
}

/**
 * Constructs a structured, validatable incident report document from an AnalysisResult.
 */
export function createIncidentReportData(
  analysis: AnalysisResult,
  rawMessage: string
): IncidentReportDocument {
  const reportId = generateIncidentReportId();

  return {
    schemaVersion: '1.0.0',
    product: 'ScholarShield AI',
    reportId,
    generatedAt: new Date().toISOString(),
    assessment: {
      overallScore: analysis.overallScore,
      riskLevel: analysis.riskLevel,
      ruleCountEvaluated: analysis.evaluatedRuleCount,
      signalsMatchedCount: analysis.matchedRuleCount,
      summary: analysis.summary
    },
    analyzedInput: {
      characterLength: rawMessage.length,
      sanitizedMessage: rawMessage
    },
    warningSignals: analysis.warningSignals.map((sig) => ({
      ruleId: sig.id,
      title: sig.title,
      category: sig.category,
      severity: sig.severity,
      scoreContribution: sig.scoreContribution,
      evidence: sig.evidence,
      explanation: sig.explanation,
      recommendedAction: sig.recommendedAction
    })),
    quarantinedUrls: analysis.extractedUrls.map((u) => ({
      url: u.url,
      domain: u.domain,
      protocol: u.protocol,
      riskWeight: u.riskWeight,
      structuralObservations: u.observableNotes
    })),
    verificationChecklist: analysis.verificationChecklist.map((step) => ({
      priority: step.priority,
      title: step.title,
      instruction: step.instruction,
      rationale: step.rationale
    })),
    disclaimers: {
      academicResearchNotice:
        'This dossier was generated locally by ScholarShield AI for academic cybersecurity risk assessment.',
      fraudConfirmationNotice:
        'IMPORTANT LEGAL DISCLAIMER: This heuristic assessment indicates observable threat patterns and warning indicators. It does NOT constitute definitive judicial proof of fraud, criminal misconduct, or legitimate sender identity.',
      limitations: analysis.limitations
    }
  };
}

/**
 * Downloads a structured JSON incident report to the client machine.
 */
export function downloadIncidentReportJson(reportData: IncidentReportDocument): void {
  const jsonString = JSON.stringify(reportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `scholarshield-report-${reportData.reportId.toLowerCase()}.json`;
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

/**
 * Helper to escape CSV cell values against CSV injection attacks (=, +, -, @).
 */
function escapeCsvCell(value: string | number): string {
  const str = String(value ?? '');
  // Prevent formula injection in spreadsheet applications (Excel, Calc)
  const safeStr = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  return `"${safeStr.replace(/"/g, '""')}"`;
}

/**
 * Downloads a summary CSV incident report to the client machine.
 */
export function downloadIncidentReportCsv(reportData: IncidentReportDocument): void {
  const rows: string[][] = [
    ['ScholarShield AI - Security Incident Dossier Summary'],
    ['Report ID', reportData.reportId],
    ['Generated At', reportData.generatedAt],
    ['Risk Classification', reportData.assessment.riskLevel],
    ['Threat Score (0-100)', String(reportData.assessment.overallScore)],
    ['Rules Evaluated', String(reportData.assessment.ruleCountEvaluated)],
    ['Signals Triggered', String(reportData.assessment.signalsMatchedCount)],
    ['Executive Summary', reportData.assessment.summary],
    [],
    ['TRIGGERED WARNING SIGNALS'],
    ['Rule ID', 'Title', 'Severity', 'Category', 'Score Impact', 'Evidence Match', 'Explanation']
  ];

  for (const sig of reportData.warningSignals) {
    rows.push([
      sig.ruleId,
      sig.title,
      sig.severity,
      sig.category,
      String(sig.scoreContribution),
      sig.evidence,
      sig.explanation
    ]);
  }

  rows.push([]);
  rows.push(['QUARANTINED URLS']);
  rows.push(['Domain', 'Protocol', 'Risk Weight', 'Observations']);
  for (const url of reportData.quarantinedUrls) {
    rows.push([
      url.domain,
      url.protocol,
      url.riskWeight,
      url.structuralObservations.join('; ')
    ]);
  }

  rows.push([]);
  rows.push(['DISCLAIMER', reportData.disclaimers.fraudConfirmationNotice]);

  const csvContent = rows.map((r) => r.map(escapeCsvCell).join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `scholarshield-report-${reportData.reportId.toLowerCase()}.csv`;
  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}
