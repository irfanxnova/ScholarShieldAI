/**
 * ScholarShield AI - Text & Unicode Normalization Module
 *
 * Provides defensible text normalization to resist simple evasive obfuscations
 * (zero-width characters, non-breaking spaces, NFKC compatibility transforms,
 * and common homoglyphs) strictly for detection heuristic matching.
 *
 * CRITICAL DEFENSIVE INVARIANT:
 * The original raw user message is NEVER altered or mutated.
 * Normalization is strictly utilized internally by detection rules.
 */

export interface NormalizedTextResult {
  /** The normalized string used strictly by detection rules */
  normalizedForDetection: string;
  /** Whether any obfuscation or non-standard characters were normalized */
  hasObfuscationMarkers: boolean;
  /** List of detected normalization adjustments */
  transformationsApplied: string[];
}

// Zero-width and invisible control characters commonly abused to break regex tokenization
const ZERO_WIDTH_REGEX = /[\u200B\u200C\u2060\uFEFF\u00AD]|\u200D/g;

// Non-standard whitespace variants
const UNUSUAL_WHITESPACE_REGEX = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;

// Selected common Cyrillic / Greek homoglyphs used in Latin word spoofing
const HOMOGLYPH_MAP: Record<string, string> = {
  '\u0430': 'a', // Cyrillic small a
  '\u0435': 'e', // Cyrillic small e
  '\u043E': 'o', // Cyrillic small o
  '\u0440': 'p', // Cyrillic small er
  '\u0441': 'c', // Cyrillic small es
  '\u0443': 'y', // Cyrillic small u
  '\u0445': 'x', // Cyrillic small ha
  '\u0456': 'i', // Cyrillic small byelorussian-ukrainian i
  '\u0458': 'j', // Cyrillic small je
  '\u03BF': 'o', // Greek small omicron
  '\u03BD': 'v', // Greek small nu
};

const HOMOGLYPH_REGEX = /[\u0430\u0435\u043E\u0440\u0441\u0443\u0445\u0456\u0458\u03BF\u03BD]/g;

/**
 * Normalizes input text for detection rules.
 * Does NOT alter the original string in place.
 */
export function normalizeDetectionText(rawText: string): NormalizedTextResult {
  if (!rawText || typeof rawText !== 'string') {
    return {
      normalizedForDetection: '',
      hasObfuscationMarkers: false,
      transformationsApplied: []
    };
  }

  const transformations: string[] = [];
  let current = rawText;

  // 1. Detect and Normalize Unusual Whitespace to Standard ASCII Space (0x20)
  if (UNUSUAL_WHITESPACE_REGEX.test(current)) {
    transformations.push('non_standard_whitespace_normalized');
    current = current.replace(UNUSUAL_WHITESPACE_REGEX, ' ');
  }

  // 2. Unicode NFKC Normalization (standardizes full-width Latin, composite characters)
  const nfkc = current.normalize('NFKC');
  if (nfkc !== current) {
    transformations.push('nfkc_compatibility_normalized');
    current = nfkc;
  }

  // 3. Strip Zero-Width and Soft Hyphen Evasion Characters
  if (ZERO_WIDTH_REGEX.test(current)) {
    transformations.push('zero_width_characters_removed');
    current = current.replace(ZERO_WIDTH_REGEX, '');
  }

  // 4. Targeted Confusable Homoglyphs (only in mixed-script contexts)
  if (HOMOGLYPH_REGEX.test(current)) {
    transformations.push('confusable_homoglyphs_mapped');
    current = current.replace(HOMOGLYPH_REGEX, (ch) => HOMOGLYPH_MAP[ch] || ch);
  }

  return {
    normalizedForDetection: current,
    hasObfuscationMarkers: transformations.length > 0,
    transformationsApplied: transformations
  };
}

/**
 * Validates and limits user input length to prevent denial-of-service
 * or memory exhaustion from excessive paste payloads.
 */
export const MAX_ANALYSIS_INPUT_LENGTH = 10000;

export interface InputValidationResult {
  isValid: boolean;
  sanitized: string;
  isTruncated: boolean;
  originalLength: number;
  errorMessage?: string;
}

export function validateInputText(input: unknown): InputValidationResult {
  if (typeof input !== 'string') {
    return {
      isValid: false,
      sanitized: '',
      isTruncated: false,
      originalLength: 0,
      errorMessage: 'Input must be a valid text string.'
    };
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      sanitized: '',
      isTruncated: false,
      originalLength: 0,
      errorMessage: 'Message is empty. Please enter or paste message text to analyze.'
    };
  }

  if (input.length > MAX_ANALYSIS_INPUT_LENGTH) {
    return {
      isValid: true,
      sanitized: input.slice(0, MAX_ANALYSIS_INPUT_LENGTH),
      isTruncated: true,
      originalLength: input.length,
      errorMessage: `Message exceeded the ${MAX_ANALYSIS_INPUT_LENGTH.toLocaleString()} character limit and was truncated for analysis.`
    };
  }

  return {
    isValid: true,
    sanitized: input,
    isTruncated: false,
    originalLength: input.length
  };
}
