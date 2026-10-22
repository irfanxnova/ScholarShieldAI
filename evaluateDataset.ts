import type {
  BenchmarkSample,
  GroundTruthLabel,
  EvaluationOutcome,
  EvaluationSampleResult,
  EvaluationReport,
  ConfusionMatrix,
  ClassDistribution
} from '../types';
import { analyzeMessage } from './analyzeMessage';
import { BENCHMARK_DATASET, BENCHMARK_METADATA } from '../data/benchmarkDataset';

export type PredictionMapping = 'medium_or_high' | 'high_only';

export interface EvaluationOptions {
  split?: 'test' | 'development' | 'all';
  splitRatio?: number;
  seed?: number;
  predictionMapping?: PredictionMapping;
}

export interface DatasetValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalSamples: number;
  legitimateCount: number;
  suspiciousCount: number;
  duplicateIds: string[];
  duplicateTexts: string[];
  groupCount: number;
}

export interface DatasetSplits {
  development: BenchmarkSample[];
  test: BenchmarkSample[];
  devGroups: string[];
  testGroups: string[];
}

/**
 * Validates a benchmark dataset to ensure schema compliance, unique identifiers,
 * valid binary labels, non-empty text, and integrity before running evaluations.
 */
export function validateBenchmarkDataset(dataset: unknown): DatasetValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(dataset)) {
    return {
      isValid: false,
      errors: ['Dataset is not an array.'],
      warnings: [],
      totalSamples: 0,
      legitimateCount: 0,
      suspiciousCount: 0,
      duplicateIds: [],
      duplicateTexts: [],
      groupCount: 0
    };
  }

  if (dataset.length === 0) {
    return {
      isValid: false,
      errors: ['Dataset is empty (0 samples).'],
      warnings: [],
      totalSamples: 0,
      legitimateCount: 0,
      suspiciousCount: 0,
      duplicateIds: [],
      duplicateTexts: [],
      groupCount: 0
    };
  }

  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();
  const seenTexts = new Set<string>();
  const duplicateTexts = new Set<string>();
  const uniqueGroups = new Set<string>();

  let legitimateCount = 0;
  let suspiciousCount = 0;

  for (let idx = 0; idx < dataset.length; idx++) {
    const item = dataset[idx] as Partial<BenchmarkSample>;
    const recordNum = idx + 1;

    // Check ID
    if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
      errors.push(`Record #${recordNum} is missing a non-empty string ID.`);
    } else {
      if (seenIds.has(item.id)) {
        duplicateIds.add(item.id);
        errors.push(`Duplicate ID detected: "${item.id}" on record #${recordNum}.`);
      }
      seenIds.add(item.id);
    }

    // Check Text
    if (!item.text || typeof item.text !== 'string' || item.text.trim() === '') {
      errors.push(`Record #${recordNum} (${item.id || 'unknown ID'}) has empty or non-string message text.`);
    } else {
      const normalizedText = item.text.trim().toLowerCase();
      if (seenTexts.has(normalizedText)) {
        duplicateTexts.add(item.id || `record-${recordNum}`);
        warnings.push(`Duplicate message text detected in record ${item.id || recordNum}.`);
      }
      seenTexts.add(normalizedText);
    }

    // Check Ground Truth Label
    if (item.groundTruth !== 'legitimate' && item.groundTruth !== 'suspicious') {
      errors.push(
        `Record #${recordNum} (${item.id || 'unknown ID'}) has invalid ground-truth label: "${item.groundTruth}". Must be "legitimate" or "suspicious".`
      );
    } else {
      if (item.groundTruth === 'legitimate') {
        legitimateCount++;
      } else {
        suspiciousCount++;
      }
    }

    // Check Scenario Category
    if (!item.scenarioCategory || typeof item.scenarioCategory !== 'string' || item.scenarioCategory.trim() === '') {
      errors.push(`Record #${recordNum} (${item.id || 'unknown ID'}) is missing scenarioCategory.`);
    }

    // Check Split Group
    if (!item.splitGroup || typeof item.splitGroup !== 'string' || item.splitGroup.trim() === '') {
      errors.push(`Record #${recordNum} (${item.id || 'unknown ID'}) is missing splitGroup for leakage prevention.`);
    } else {
      uniqueGroups.add(item.splitGroup);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalSamples: dataset.length,
    legitimateCount,
    suspiciousCount,
    duplicateIds: Array.from(duplicateIds),
    duplicateTexts: Array.from(duplicateTexts),
    groupCount: uniqueGroups.size
  };
}

/**
 * Mulberry32 seeded pseudo-random number generator.
 * Produces deterministic, reproducible results across platforms and runs.
 */
function createSeededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Performs a deterministic, group-aware split of the benchmark dataset.
 *
 * CRITICAL LEAKAGE PREVENTION:
 * Samples sharing the same `splitGroup` (e.g., related template variants or variations)
 * are ALWAYS assigned in entirety to either development or test. They NEVER cross the split boundary.
 */
export function splitDataset(
  dataset: BenchmarkSample[],
  splitRatio: number = 0.5,
  seed: number = 42
): DatasetSplits {
  // Group samples by splitGroup
  const groupMap = new Map<string, BenchmarkSample[]>();
  for (const sample of dataset) {
    const group = sample.splitGroup || `singleton-${sample.id}`;
    if (!groupMap.has(group)) {
      groupMap.set(group, []);
    }
    groupMap.get(group)!.push(sample);
  }

  // Sort group keys alphabetically for stable baseline order
  const sortedGroupKeys = Array.from(groupMap.keys()).sort();

  // Deterministically shuffle using seeded PRNG
  const rng = createSeededRng(seed);
  const shuffledKeys = [...sortedGroupKeys];
  for (let i = shuffledKeys.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = shuffledKeys[i];
    shuffledKeys[i] = shuffledKeys[j];
    shuffledKeys[j] = temp;
  }

  const targetDevCount = Math.round(dataset.length * splitRatio);
  const development: BenchmarkSample[] = [];
  const test: BenchmarkSample[] = [];
  const devGroups: string[] = [];
  const testGroups: string[] = [];

  for (const groupKey of shuffledKeys) {
    const groupSamples = groupMap.get(groupKey)!;
    // Assign to development until target count is approached, else assign to test
    if (development.length + groupSamples.length <= targetDevCount || development.length === 0) {
      development.push(...groupSamples);
      devGroups.push(groupKey);
    } else {
      test.push(...groupSamples);
      testGroups.push(groupKey);
    }
  }

  // If all ended up in one set due to small dataset or large groups, ensure non-empty if possible
  if (test.length === 0 && development.length > 1 && devGroups.length > 1) {
    const movedGroup = devGroups.pop()!;
    testGroups.push(movedGroup);
    const movedSamples = groupMap.get(movedGroup)!;
    // Remove movedSamples from development
    const remainingDev = development.filter((s) => s.splitGroup !== movedGroup);
    development.length = 0;
    development.push(...remainingDev);
    test.push(...movedSamples);
  }

  return {
    development,
    test,
    devGroups,
    testGroups
  };
}

/**
 * Pure mathematical calculation of classification metrics with explicit zero-denominator safety.
 * Zero denominators return 0 and avoid any NaN or Infinity values.
 */
export function calculateMetricsFromCounts(
  truePositives: number,
  falsePositives: number,
  trueNegatives: number,
  falseNegatives: number
): {
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  accuracy: number;
} {
  const tp = Math.max(0, truePositives);
  const fp = Math.max(0, falsePositives);
  const tn = Math.max(0, trueNegatives);
  const fn = Math.max(0, falseNegatives);

  const total = tp + fp + tn + fn;

  // Precision = TP / (TP + FP)
  const precisionDenominator = tp + fp;
  const precision = precisionDenominator > 0 ? tp / precisionDenominator : 0;

  // Recall = TP / (TP + FN)
  const recallDenominator = tp + fn;
  const recall = recallDenominator > 0 ? tp / recallDenominator : 0;

  // F1-score = 2 * (P * R) / (P + R)
  const f1Denominator = precision + recall;
  const f1Score = f1Denominator > 0 ? (2 * precision * recall) / f1Denominator : 0;

  // False Positive Rate = FP / (FP + TN)
  const fprDenominator = fp + tn;
  const falsePositiveRate = fprDenominator > 0 ? fp / fprDenominator : 0;

  // Accuracy = (TP + TN) / Total
  const accuracy = total > 0 ? (tp + tn) / total : 0;

  return {
    precision,
    recall,
    f1Score,
    falsePositiveRate,
    accuracy
  };
}

/**
 * Maps a continuous risk score and categorical RiskLevel to a binary evaluation label.
 *
 * Mapping Convention:
 * - 'medium_or_high' (Standard / Default):
 *   MEDIUM (30-69) and HIGH (70-100) -> 'suspicious'
 *   LOW (0-29) -> 'legitimate'
 *
 * - 'high_only' (Conservative / High Threshold):
 *   HIGH (70-100) -> 'suspicious'
 *   MEDIUM (30-69) and LOW (0-29) -> 'legitimate'
 */
export function mapRiskToPrediction(
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
  mapping: PredictionMapping = 'medium_or_high'
): GroundTruthLabel {
  if (mapping === 'high_only') {
    return riskLevel === 'HIGH' ? 'suspicious' : 'legitimate';
  }
  // Standard default: Medium or High flags as suspicious positive
  return riskLevel === 'HIGH' || riskLevel === 'MEDIUM' ? 'suspicious' : 'legitimate';
}

/**
 * Runs the deterministic ScholarShield AI detection engine on each labelled message in the chosen split.
 * Computes genuine confusion matrix counts, precision, recall, F1, FPR, accuracy,
 * class distribution breakdowns, and error analysis records.
 */
export function evaluateDataset(
  dataset: BenchmarkSample[] = BENCHMARK_DATASET,
  options: EvaluationOptions = {}
): EvaluationReport {
  const {
    split = 'test',
    splitRatio = 0.5,
    seed = 42,
    predictionMapping = 'medium_or_high'
  } = options;

  // 1. Validate dataset
  const validation = validateBenchmarkDataset(dataset);
  if (!validation.isValid) {
    throw new Error(
      `Dataset validation failed with ${validation.errors.length} error(s): ${validation.errors.join('; ')}`
    );
  }

  // 2. Resolve active evaluation subset
  let activeSamples: BenchmarkSample[];
  if (split === 'all') {
    activeSamples = [...dataset];
  } else {
    const splits = splitDataset(dataset, splitRatio, seed);
    activeSamples = split === 'test' ? splits.test : splits.development;
  }

  if (activeSamples.length === 0) {
    throw new Error(`Evaluation split "${split}" yielded 0 samples.`);
  }

  // 3. Run detection engine on each sample
  const sampleResults: EvaluationSampleResult[] = [];
  const errorSamples: EvaluationSampleResult[] = [];

  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  let legitimateCount = 0;
  let suspiciousCount = 0;
  let predictedPositiveCount = 0;
  let predictedNegativeCount = 0;

  for (const sample of activeSamples) {
    if (sample.groundTruth === 'legitimate') {
      legitimateCount++;
    } else {
      suspiciousCount++;
    }

    // Run actual analysis engine
    const analysis = analyzeMessage(sample.text);
    const prediction = mapRiskToPrediction(analysis.riskLevel, predictionMapping);

    if (prediction === 'suspicious') {
      predictedPositiveCount++;
    } else {
      predictedNegativeCount++;
    }

    let outcome: EvaluationOutcome;
    let isCorrect = false;

    if (sample.groundTruth === 'suspicious' && prediction === 'suspicious') {
      outcome = 'TP';
      isCorrect = true;
      tp++;
    } else if (sample.groundTruth === 'legitimate' && prediction === 'suspicious') {
      outcome = 'FP';
      isCorrect = false;
      fp++;
    } else if (sample.groundTruth === 'legitimate' && prediction === 'legitimate') {
      outcome = 'TN';
      isCorrect = true;
      tn++;
    } else {
      outcome = 'FN';
      isCorrect = false;
      fn++;
    }

    // Build explanatory misclassification rationale for error analysis
    let misclassificationRationale: string | undefined;
    if (!isCorrect) {
      const signalSummary =
        analysis.warningSignals.length > 0
          ? analysis.warningSignals.map((s) => s.title).join(', ')
          : 'no warning signals triggered';

      if (outcome === 'FP') {
        misclassificationRationale = `False Alarm: Legitimate communication was flagged as suspicious (Score: ${analysis.overallScore}/100, Predicted: ${analysis.riskLevel}). Evidentiary signals triggered: [${signalSummary}]. Sample annotation: "${sample.annotationRationale}".`;
      } else {
        misclassificationRationale = `Missed Threat: Fraudulent communication was classified as legitimate (Score: ${analysis.overallScore}/100, Predicted: ${analysis.riskLevel}). Signals detected: [${signalSummary}]. Sample annotation: "${sample.annotationRationale}".`;
      }
    }

    const sampleResult: EvaluationSampleResult = {
      sample,
      prediction,
      riskLevel: analysis.riskLevel,
      overallScore: analysis.overallScore,
      warningSignals: analysis.warningSignals,
      isCorrect,
      outcome,
      misclassificationRationale
    };

    sampleResults.push(sampleResult);
    if (!isCorrect) {
      errorSamples.push(sampleResult);
    }
  }

  // 4. Compute metrics
  const matrix: ConfusionMatrix = {
    truePositives: tp,
    falsePositives: fp,
    trueNegatives: tn,
    falseNegatives: fn
  };

  const metrics = calculateMetricsFromCounts(tp, fp, tn, fn);

  // 5. Compute scenario category distribution
  const categoryCounts = new Map<string, number>();
  for (const s of activeSamples) {
    const cat = s.scenarioCategory || 'general';
    categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
  }

  const classDistribution: ClassDistribution[] = [
    {
      category: 'Negative Controls (Legitimate Announcements)',
      count: legitimateCount,
      percentage: Math.round((legitimateCount / activeSamples.length) * 100)
    },
    {
      category: 'Positive Threats (Scams / Phishing / Fraud)',
      count: suspiciousCount,
      percentage: Math.round((suspiciousCount / activeSamples.length) * 100)
    }
  ];

  const mappingDescription =
    predictionMapping === 'medium_or_high'
      ? 'Standard Rule Mapping: Risk Level MEDIUM (score ≥ 30) or HIGH (score ≥ 70) = Suspicious; LOW (score < 30) = Legitimate.'
      : 'Strict High-Only Mapping: Risk Level HIGH (score ≥ 70) = Suspicious; MEDIUM/LOW (score < 70) = Legitimate.';

  return {
    status: 'available',
    split,
    evaluatedCount: activeSamples.length,
    legitimateCount,
    suspiciousCount,
    predictedPositiveCount,
    predictedNegativeCount,
    confusionMatrix: matrix,
    precision: metrics.precision,
    recall: metrics.recall,
    f1Score: metrics.f1Score,
    falsePositiveRate: metrics.falsePositiveRate,
    accuracy: metrics.accuracy,
    classDistribution,
    sampleResults,
    errorSamples,
    evaluatedAt: new Date().toISOString(),
    benchmarkVersion: BENCHMARK_METADATA.version,
    predictionMapping: mappingDescription,
    evaluationNote: `Evaluated ${activeSamples.length} samples (${legitimateCount} legitimate, ${suspiciousCount} suspicious) using ${split} split with group-aware leakage protection.`
  };
}
