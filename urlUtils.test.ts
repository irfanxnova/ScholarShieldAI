import { describe, it, expect } from 'vitest';
import { extractUrlsFromText } from '../urlUtils';

describe('URL Safety & Structural Parsing', () => {
  it('extracts standard institutional .edu domains correctly', () => {
    const text = 'Submit applications at https://finaid.portal.stateuniv.example.edu/merit-awards before Nov 15.';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    expect(urls[0].domain).toBe('finaid.portal.stateuniv.example.edu');
    expect(urls[0].protocol).toBe('https');
    expect(urls[0].isIpAddress).toBe(false);
    expect(urls[0].riskWeight).toBe('minimal');
    expect(urls[0].observableNotes.some((n) => n.includes('educational institution'))).toBe(true);
  });

  it('detects unencrypted plaintext HTTP protocol', () => {
    const text = 'Login at http://insecure-student-portal.example.com/apply';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    expect(urls[0].protocol).toBe('http');
    expect(urls[0].riskWeight).toBe('moderate');
    expect(urls[0].observableNotes.some((n) => n.includes('unencrypted plaintext HTTP'))).toBe(true);
  });

  it('detects and flags direct numeric IP addresses', () => {
    const text = 'Access the award disbursement form at http://198.51.100.24/student-claim';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    expect(urls[0].isIpAddress).toBe(true);
    expect(urls[0].riskWeight).toBe('high');
    expect(urls[0].observableNotes.some((n) => n.includes('Direct raw IP address target'))).toBe(true);
  });

  it('detects shortened or obfuscated URL redirection services', () => {
    const text = 'Confirm your grant allocation now: https://bit.ly/scholarship-claim-2026';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    expect(urls[0].isShortened).toBe(true);
    expect(urls[0].riskWeight).toBe('elevated');
  });

  it('detects high-risk disposable top-level domains (.xyz, .click, .loan)', () => {
    const text = 'Claim funds at https://fast-student-relief.xyz/portal';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    expect(urls[0].hasSuspiciousTld).toBe(true);
    expect(urls[0].riskWeight).toBe('elevated');
  });

  it('detects punycode and lookalike hyphenated domain masking', () => {
    const text = 'Check status at https://stateuniv--admissions-auth.com/login';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    expect(urls[0].usesPunycodeOrLookalike).toBe(true);
    expect(urls[0].riskWeight).toBe('high');
  });

  it('masks sensitive embedded passwords in URL authority components', () => {
    const text = 'Authenticate via https://student_id:SuperSecretPass123@portal-auth.example.com/login';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    // Password must be redacted to ***, never exposed in raw stored URL
    expect(urls[0].url).toContain('***');
    expect(urls[0].url).not.toContain('SuperSecretPass123');
    expect(urls[0].observableNotes.some((n) => n.includes('embedded credentials'))).toBe(true);
    expect(urls[0].riskWeight).toBe('high');
  });

  it('identifies non-standard service ports', () => {
    const text = 'Access the remote portal at http://student-host.example.org:8443/dashboard';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    expect(urls[0].observableNotes.some((n) => n.includes(':8443'))).toBe(true);
  });

  it('strips trailing punctuation without breaking domain parsing', () => {
    const text = 'Visit https://stateuniv.example.edu/jobs, and apply before Monday.';
    const urls = extractUrlsFromText(text);

    expect(urls).toHaveLength(1);
    expect(urls[0].url).toBe('https://stateuniv.example.edu/jobs');
  });

  it('handles empty text, malformed strings, or null without throwing', () => {
    expect(extractUrlsFromText('')).toEqual([]);
    expect(extractUrlsFromText('No URLs in this message.')).toEqual([]);
    // @ts-expect-error test invalid type
    expect(extractUrlsFromText(null)).toEqual([]);
  });
});
