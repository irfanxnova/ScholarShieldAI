/**
 * ScholarShield AI - Core Type Definitions
 * Shared contracts for risk assessment, warning signals, URL analysis, and model evaluation.
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type SignalSeverity = 'low' | 'medium' | 'high' | 'critical';

export type SignalCategory =
  | 'financial_fee'
  | 'urgency_coercion'
  | 'credential_theft'
  | 'unverifiable_sender'
  | 'guaranteed_placement'
  | 'suspicious_channel'
  | 'inconsistent_branding';

export interface WarningSignal {
  id: string;
  title: string;
  category: SignalCategory;
  severity: SignalSeverity;
  explanation: string;
  evidence: string;
  scoreContribution: number;
  recommendedAction: string;
}

export interface ExtractedUrl {
  id: string;
  url: string;
  domain: string;
  protocol: string;
  isIpAddress: boolean;
  isShortened: boolean;
  hasSuspiciousTld: boolean;
  usesPunycodeOrLookalike: boolean;
  observableNotes: string[];
  riskWeight: 'minimal' | 'moderate' | 'elevated' | 'high';
}

export interface VerificationStep {
  id: string;
  title: string;
  instruction: string;
  priority: 'essential' | 'recommended' | 'optional';
  rationale: string;
  category: 'official_channel' | 'academic_office' | 'financial_safety' | 'identity_protection';
}

export interface AnalysisResult {
  id: string;
  analyzedAt: string;
  overallScore: number; // 0 - 100 scale (0 = safe, 100 = critical threat)
  riskLevel: RiskLevel;
  confidenceScore?: number; // Optional backwards-compatible field
  evaluatedRuleCount: number; // Total number of threat patterns evaluated
  matchedRuleCount: number; // Number of distinct warning signals triggered
  summary: string;
  warningSignals: WarningSignal[];
  extractedUrls: ExtractedUrl[];
  verificationChecklist: VerificationStep[];
  limitations: string[];
  isMockPreview?: boolean;
}

export interface DetectionRule {
  id: string;
  title: string;
  category: SignalCategory;
  severity: SignalSeverity;
  weight: number;
  explanation: string;
  recommendedAction: string;
  evaluate: (text: string, urls: ExtractedUrl[]) => { matched: boolean; evidence?: string } | null;
}


export type ScenarioType =
  | 'scholarship_fee'
  | 'guaranteed_internship'
  | 'credential_otp'
  | 'legitimate_official'
  | 'plausible_internship';

export interface ExampleMessage {
  id: string;
  title: string;
  categoryBadge: string;
  expectedRisk: RiskLevel;
  description: string;
  content: string;
  scenarioType: ScenarioType;
  primarySignalsHighlight: string[];
}

export interface ConfusionMatrix {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export interface ClassDistribution {
  category: string;
  count: number;
  percentage: number;
}

export type GroundTruthLabel = 'legitimate' | 'suspicious';

export type EvaluationOutcome = 'TP' | 'FP' | 'TN' | 'FN';

export interface BenchmarkSample {
  id: string;
  text: string;
  groundTruth: GroundTruthLabel;
  scenarioCategory: string;
  tags: string[];
  annotationRationale: string;
  provenance: string;
  splitGroup: string;
}

export interface EvaluationSampleResult {
  sample: BenchmarkSample;
  prediction: GroundTruthLabel;
  riskLevel: RiskLevel;
  overallScore: number;
  warningSignals: WarningSignal[];
  isCorrect: boolean;
  outcome: EvaluationOutcome;
  misclassificationRationale?: string;
}

export interface EvaluationReport {
  status: 'available';
  split: 'test' | 'development' | 'all';
  evaluatedCount: number;
  legitimateCount: number;
  suspiciousCount: number;
  predictedPositiveCount: number;
  predictedNegativeCount: number;
  confusionMatrix: ConfusionMatrix;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  accuracy: number;
  classDistribution: ClassDistribution[];
  sampleResults: EvaluationSampleResult[];
  errorSamples: EvaluationSampleResult[];
  evaluatedAt: string;
  benchmarkVersion: string;
  predictionMapping: string;
  evaluationNote?: string;
}

export interface EvaluationMetrics {
  status: 'pending_integration' | 'available';
  evaluatedCount?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  falsePositiveRate?: number;
  accuracy?: number;
  classDistribution?: ClassDistribution[];
  confusionMatrix?: ConfusionMatrix;
  benchmarkVersion?: string;
  evaluationNote?: string;
  report?: EvaluationReport;
}

export type ActiveTab = 'overview' | 'analyze' | 'evaluation' | 'about';

