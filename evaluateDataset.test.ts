import { describe, it, expect } from 'vitest';
import type { BenchmarkSample } from '../../types';
import {
  calculateMetricsFromCounts,
  validateBenchmarkDataset,
  splitDataset,
  mapRiskToPrediction,
  evaluateDataset
} from '../evaluateDataset';
import { BENCHMARK_DATASET } from '../../data/benchmarkDataset';

describe('Statistical Metrics Calculation & Zero-Denominator Safety', () => {
  it('correctly calculates the mandatory hand-calculated 10-item benchmark', () => {
    // Ground truth: 3 TP, 2 FP, 4 TN, 1 FN
    // Total = 10
    // Precision = 3 / (3 + 2) = 0.6
    // Recall = 3 / (3 + 1) = 0.75
    // F1 = 2 * (0.6 * 0.75) / (0.6 + 0.75) = 0.9 / 1.35 = 2/3 ≈ 0.666667
    // FPR = 2 / (2 + 4) = 2/6 = 1/3 ≈ 0.333333
    // Accuracy = (3 + 4) / 10 = 0.7
    const result = calculateMetricsFromCounts(3, 2, 4, 1);

    expect(result.precision).toBeCloseTo(0.6, 4);
    expect(result.recall).toBeCloseTo(0.75, 4);
    expect(result.f1Score).toBeCloseTo(0.6667, 4);
    expect(result.falsePositiveRate).toBeCloseTo(0.3333, 4);
    expect(result.accuracy).toBeCloseTo(0.7, 4);
  });

  it('handles zero-positive predictions without NaN or Infinity (TP=0, FP=0)', () => {
    const result = calculateMetricsFromCounts(0, 0, 5, 5);
    expect(result.precision).toBe(0);
    expect(Number.isNaN(result.precision)).toBe(false);
    expect(Number.isFinite(result.precision)).toBe(true);

    expect(result.recall).toBe(0);
    expect(result.f1Score).toBe(0);
    expect(result.falsePositiveRate).toBe(0);
    expect(result.accuracy).toBe(0.5);
  });

  it('handles zero actual positive examples (TP=0, FN=0)', () => {
    // Only negative samples exist
    const result = calculateMetricsFromCounts(0, 2, 8, 0);
    expect(result.recall).toBe(0);
    expect(result.precision).toBe(0);
    expect(result.f1Score).toBe(0);
    expect(result.falsePositiveRate).toBeCloseTo(0.2, 4);
    expect(result.accuracy).toBeCloseTo(0.8, 4);
  });

  it('handles zero actual negative examples (TN=0, FP=0)', () => {
    // Only positive samples exist
    const result = calculateMetricsFromCounts(7, 0, 0, 3);
    expect(result.precision).toBe(1.0);
    expect(result.recall).toBeCloseTo(0.7, 4);
    expect(result.falsePositiveRate).toBe(0);
    expect(result.accuracy).toBeCloseTo(0.7, 4);
  });

  it('handles perfect classifier (100% all predictions correct)', () => {
    const result = calculateMetricsFromCounts(20, 0, 20, 0);
    expect(result.precision).toBe(1.0);
    expect(result.recall).toBe(1.0);
    expect(result.f1Score).toBe(1.0);
    expect(result.falsePositiveRate).toBe(0);
    expect(result.accuracy).toBe(1.0);
  });

  it('handles total failure classifier (0% all predictions incorrect)', () => {
    const result = calculateMetricsFromCounts(0, 20, 0, 20);
    expect(result.precision).toBe(0);
    expect(result.recall).toBe(0);
    expect(result.f1Score).toBe(0);
    expect(result.falsePositiveRate).toBe(1.0);
    expect(result.accuracy).toBe(0);
  });

  it('handles empty evaluation counts (all zeros)', () => {
    const result = calculateMetricsFromCounts(0, 0, 0, 0);
    expect(result.precision).toBe(0);
    expect(result.recall).toBe(0);
    expect(result.f1Score).toBe(0);
    expect(result.falsePositiveRate).toBe(0);
    expect(result.accuracy).toBe(0);
  });
});

describe('Dataset Validation & Integrity Gates', () => {
  it('validates the official benchmark dataset successfully', () => {
    const validation = validateBenchmarkDataset(BENCHMARK_DATASET);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
    expect(validation.totalSamples).toBe(80);
    expect(validation.legitimateCount).toBe(40);
    expect(validation.suspiciousCount).toBe(40);
    expect(validation.duplicateIds).toHaveLength(0);
    expect(validation.groupCount).toBeGreaterThan(10);
  });

  it('rejects non-array or empty datasets', () => {
    expect(validateBenchmarkDataset(null).isValid).toBe(false);
    expect(validateBenchmarkDataset('invalid').isValid).toBe(false);
    const emptyResult = validateBenchmarkDataset([]);
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errors[0]).toContain('empty');
  });

  it('detects duplicate sample IDs', () => {
    const invalidData: BenchmarkSample[] = [
      {
        id: 'dup-01',
        text: 'Message one',
        groundTruth: 'legitimate',
        scenarioCategory: 'academic',
        tags: [],
        annotationRationale: 'Rationale one',
        provenance: 'test',
        splitGroup: 'g1'
      },
      {
        id: 'dup-01', // duplicate ID
        text: 'Message two',
        groundTruth: 'suspicious',
        scenarioCategory: 'scam',
        tags: [],
        annotationRationale: 'Rationale two',
        provenance: 'test',
        splitGroup: 'g2'
      }
    ];

    const validation = validateBenchmarkDataset(invalidData);
    expect(validation.isValid).toBe(false);
    expect(validation.duplicateIds).toContain('dup-01');
    expect(validation.errors.some((e) => e.includes('Duplicate ID'))).toBe(true);
  });

  it('detects invalid ground-truth labels and missing fields', () => {
    const malformed = [
      {
        id: 'bad-01',
        text: '', // empty text
        groundTruth: 'unknown_label' as unknown, // invalid label
        scenarioCategory: '', // missing category
        splitGroup: '' // missing split group
      }
    ];

    const validation = validateBenchmarkDataset(malformed);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some((e) => e.includes('empty or non-string message text'))).toBe(true);
    expect(validation.errors.some((e) => e.includes('invalid ground-truth label'))).toBe(true);
    expect(validation.errors.some((e) => e.includes('missing scenarioCategory'))).toBe(true);
    expect(validation.errors.some((e) => e.includes('missing splitGroup'))).toBe(true);
  });
});

describe('Leakage Prevention & Group-Aware Deterministic Splitting', () => {
  it('strictly ensures samples with the same splitGroup never cross split boundaries', () => {
    const splits = splitDataset(BENCHMARK_DATASET, 0.5, 42);

    expect(splits.development.length).toBeGreaterThan(0);
    expect(splits.test.length).toBeGreaterThan(0);
    expect(splits.development.length + splits.test.length).toBe(BENCHMARK_DATASET.length);

    // Verify disjoint groups
    const devGroupSet = new Set(splits.devGroups);
    const testGroupSet = new Set(splits.testGroups);

    for (const group of devGroupSet) {
      expect(testGroupSet.has(group)).toBe(false);
    }

    // Verify every sample in development has group in devGroupSet
    for (const s of splits.development) {
      expect(devGroupSet.has(s.splitGroup)).toBe(true);
      expect(testGroupSet.has(s.splitGroup)).toBe(false);
    }

    // Verify every sample in test has group in testGroupSet
    for (const s of splits.test) {
      expect(testGroupSet.has(s.splitGroup)).toBe(true);
      expect(devGroupSet.has(s.splitGroup)).toBe(false);
    }
  });

  it('produces identical reproducible splits with the same seed', () => {
    const splitA = splitDataset(BENCHMARK_DATASET, 0.5, 1234);
    const splitB = splitDataset(BENCHMARK_DATASET, 0.5, 1234);

    expect(splitA.development.map((s) => s.id)).toEqual(splitB.development.map((s) => s.id));
    expect(splitA.test.map((s) => s.id)).toEqual(splitB.test.map((s) => s.id));
  });

  it('produces different splits when given a different seed', () => {
    const splitA = splitDataset(BENCHMARK_DATASET, 0.5, 1234);
    const splitB = splitDataset(BENCHMARK_DATASET, 0.5, 9999);

    // IDs in development should not be 100% identical
    const idsA = splitA.development.map((s) => s.id).join(',');
    const idsB = splitB.development.map((s) => s.id).join(',');
    expect(idsA).not.toBe(idsB);
  });
});

describe('Binary Prediction Mapping', () => {
  it('maps correctly under standard medium_or_high mapping', () => {
    expect(mapRiskToPrediction('HIGH', 'medium_or_high')).toBe('suspicious');
    expect(mapRiskToPrediction('MEDIUM', 'medium_or_high')).toBe('suspicious');
    expect(mapRiskToPrediction('LOW', 'medium_or_high')).toBe('legitimate');
  });

  it('maps correctly under strict high_only mapping', () => {
    expect(mapRiskToPrediction('HIGH', 'high_only')).toBe('suspicious');
    expect(mapRiskToPrediction('MEDIUM', 'high_only')).toBe('legitimate');
    expect(mapRiskToPrediction('LOW', 'high_only')).toBe('legitimate');
  });
});

describe('End-to-End Evaluation Harness on Actual Dataset', () => {
  it('evaluates the held-out test split and computes genuine non-fabricated metrics', () => {
    const report = evaluateDataset(BENCHMARK_DATASET, { split: 'test', splitRatio: 0.5, seed: 42 });

    expect(report.status).toBe('available');
    expect(report.split).toBe('test');
    expect(report.evaluatedCount).toBeGreaterThan(0);

    // Matrix counts must reconcile with evaluated count
    const { truePositives, falsePositives, trueNegatives, falseNegatives } = report.confusionMatrix;
    const totalMatrixCount = truePositives + falsePositives + trueNegatives + falseNegatives;
    expect(totalMatrixCount).toBe(report.evaluatedCount);
    expect(report.legitimateCount + report.suspiciousCount).toBe(report.evaluatedCount);

    // Exact verified benchmark counts on the held-out partition
    expect(report.confusionMatrix).toEqual({
      truePositives: 20,
      falsePositives: 0,
      trueNegatives: 17,
      falseNegatives: 3
    });
    expect(report.precision).toBeCloseTo(1.0, 4);
    expect(report.recall).toBeCloseTo(20 / 23, 4);
    expect(report.f1Score).toBeCloseTo(40 / 43, 4);
    expect(report.falsePositiveRate).toBeCloseTo(0.0, 4);

    // Verify mathematical bounds
    expect(report.precision).toBeGreaterThanOrEqual(0);
    expect(report.precision).toBeLessThanOrEqual(1);
    expect(report.recall).toBeGreaterThanOrEqual(0);
    expect(report.recall).toBeLessThanOrEqual(1);
    expect(report.f1Score).toBeGreaterThanOrEqual(0);
    expect(report.f1Score).toBeLessThanOrEqual(1);
    expect(report.falsePositiveRate).toBeGreaterThanOrEqual(0);
    expect(report.falsePositiveRate).toBeLessThanOrEqual(1);

    // Error samples must match FP + FN
    expect(report.errorSamples.length).toBe(falsePositives + falseNegatives);

    // Each error sample must have a non-empty misclassificationRationale
    for (const err of report.errorSamples) {
      expect(err.misclassificationRationale).toBeDefined();
      expect(err.misclassificationRationale!.length).toBeGreaterThan(10);
    }
  });

  it('evaluates the full dataset when split is "all"', () => {
    const report = evaluateDataset(BENCHMARK_DATASET, { split: 'all' });
    expect(report.evaluatedCount).toBe(80);
    expect(report.legitimateCount).toBe(40);
    expect(report.suspiciousCount).toBe(40);
    expect(report.confusionMatrix.truePositives + report.confusionMatrix.falsePositives + report.confusionMatrix.trueNegatives + report.confusionMatrix.falseNegatives).toBe(80);
  });
});
