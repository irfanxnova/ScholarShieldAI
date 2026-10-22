import { describe, it, expect } from 'vitest';
import {
  normalizeDetectionText,
  validateInputText,
  MAX_ANALYSIS_INPUT_LENGTH
} from '../textNormalization';

describe('Text & Unicode Normalization', () => {
  it('normalizes full-width Latin characters via NFKC compatibility', () => {
    // Fullwidth 'Zelle' (\uFF3A\uFF45\uFF4C\uFF4C\uFF45)
    const obfuscated = '\uFF3A\uFF45\uFF4C\uFF4C\uFF45';
    const result = normalizeDetectionText(obfuscated);

    expect(result.normalizedForDetection).toBe('Zelle');
    expect(result.hasObfuscationMarkers).toBe(true);
    expect(result.transformationsApplied).toContain('nfkc_compatibility_normalized');
  });

  it('strips zero-width evasion characters inserted inside scam keywords', () => {
    // "p\u200Ba\u200Bs\u200Bs\u200Bw\u200Bo\u200Br\u200Bd"
    const zeroWidthPassword = 'p\u200Ba\u200Bs\u200Bs\u200Bw\u200Bo\u200Br\u200Bd';
    const result = normalizeDetectionText(zeroWidthPassword);

    expect(result.normalizedForDetection).toBe('password');
    expect(result.hasObfuscationMarkers).toBe(true);
    expect(result.transformationsApplied).toContain('zero_width_characters_removed');
  });

  it('strips soft hyphens and word joiners (\u00AD, \u2060, \uFEFF)', () => {
    const evasiveText = 'wire\u00ADtransfer\u2060fee\uFEFF';
    const result = normalizeDetectionText(evasiveText);

    expect(result.normalizedForDetection).toBe('wiretransferfee');
    expect(result.hasObfuscationMarkers).toBe(true);
  });

  it('normalizes non-breaking spaces and unusual unicode whitespace into standard ASCII space', () => {
    // Non-breaking space \u00A0 and em space \u2003
    const textWithStrangeSpaces = 'pay\u00A0registration\u2003fee';
    const result = normalizeDetectionText(textWithStrangeSpaces);

    expect(result.normalizedForDetection).toBe('pay registration fee');
    expect(result.hasObfuscationMarkers).toBe(true);
    expect(result.transformationsApplied).toContain('non_standard_whitespace_normalized');
  });

  it('normalizes common Cyrillic confusable homoglyphs', () => {
    // Cyrillic small 'а' (\u0430) and 'е' (\u0435) inside "Z\u0435ll\u0435"
    const mixedScriptZelle = 'Z\u0435ll\u0435';
    const result = normalizeDetectionText(mixedScriptZelle);

    expect(result.normalizedForDetection).toBe('Zelle');
    expect(result.hasObfuscationMarkers).toBe(true);
    expect(result.transformationsApplied).toContain('confusable_homoglyphs_mapped');
  });

  it('leaves standard benign English text unaltered with no transformations', () => {
    const benign = 'Welcome to the university honors scholarship application portal.';
    const result = normalizeDetectionText(benign);

    expect(result.normalizedForDetection).toBe(benign);
    expect(result.hasObfuscationMarkers).toBe(false);
    expect(result.transformationsApplied).toHaveLength(0);
  });

  it('handles empty, null, or undefined gracefully without throwing', () => {
    expect(normalizeDetectionText('').normalizedForDetection).toBe('');
    expect(normalizeDetectionText('   ').normalizedForDetection).toBe('   ');
    // @ts-expect-error test invalid type
    expect(normalizeDetectionText(null).normalizedForDetection).toBe('');
  });
});

describe('Input Validation & Safe Bounds', () => {
  it('validates normal input length correctly', () => {
    const input = 'This is a normal email offering a scholarship.';
    const validation = validateInputText(input);

    expect(validation.isValid).toBe(true);
    expect(validation.sanitized).toBe(input);
    expect(validation.isTruncated).toBe(false);
    expect(validation.originalLength).toBe(input.length);
  });

  it('rejects empty or whitespace-only input', () => {
    const emptyResult = validateInputText('');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errorMessage).toContain('empty');

    const spaceResult = validateInputText('   \n\t  ');
    expect(spaceResult.isValid).toBe(false);
    expect(spaceResult.errorMessage).toContain('empty');
  });

  it('rejects non-string input safely', () => {
    const validation = validateInputText(12345);
    expect(validation.isValid).toBe(false);
  });

  it('safely truncates inputs exceeding MAX_ANALYSIS_INPUT_LENGTH (10,000 characters)', () => {
    const hugeInput = 'A'.repeat(MAX_ANALYSIS_INPUT_LENGTH + 500);
    const validation = validateInputText(hugeInput);

    expect(validation.isValid).toBe(true);
    expect(validation.isTruncated).toBe(true);
    expect(validation.sanitized.length).toBe(MAX_ANALYSIS_INPUT_LENGTH);
    expect(validation.originalLength).toBe(MAX_ANALYSIS_INPUT_LENGTH + 500);
    expect(validation.errorMessage).toContain('truncated');
  });
});
