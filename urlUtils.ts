import type { ExtractedUrl } from '../types';

/**
 * Safely extracts URLs and observable structural patterns from raw message text.
 *
 * DEFENSIVE SECURITY INVARIANTS:
 * 1. ZERO NETWORK ACTIVITY: Never navigates, pings, fetches, or executes extracted links.
 * 2. SAFE PARSING: Handles malformed strings, IPv4/IPv6, punycode, non-standard ports, and embedded credentials.
 * 3. CREDENTIAL MASKING: Redacts passwords embedded in URL authority (e.g., http://user:pass@host -> http://user:***@host).
 * 4. INERT DISPLAY: Links are extracted as inert metadata, never rendered as auto-clickable links by default.
 */
export function extractUrlsFromText(text: string): ExtractedUrl[] {
  if (!text || typeof text !== 'string') return [];

  // Match http, https, and standalone domain-like tokens, excluding javascript: or data:
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`[\]]+/gi;
  const matches = text.match(urlRegex) || [];

  const uniqueUrls = Array.from(new Set(matches));

  return uniqueUrls.map((rawUrl, index) => {
    // Strip trailing sentence punctuation
    let cleanUrl = rawUrl.replace(/[.,;:!?]+$/, '');

    let domain = '';
    let protocol = 'unknown';
    let port = '';
    let hasEmbeddedCredentials = false;

    try {
      const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `http://${cleanUrl}`);
      domain = parsed.hostname.toLowerCase();
      protocol = parsed.protocol.replace(':', '').toLowerCase();
      port = parsed.port;

      if (parsed.username || parsed.password) {
        hasEmbeddedCredentials = true;
        // Redact password from the stored URL representation for security
        if (parsed.password) {
          parsed.password = '***';
          cleanUrl = parsed.toString();
        }
      }
    } catch {
      // Fallback extraction if standard URL constructor fails on malformed input
      const withoutProto = cleanUrl.replace(/^https?:\/\//i, '');
      domain = withoutProto.split('/')[0].split('?')[0].split('#')[0].toLowerCase();
      protocol = cleanUrl.toLowerCase().startsWith('https') ? 'https' : 'http';
    }

    // Structural heuristic checks
    const isIpAddress = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(domain) || domain.startsWith('[') || domain.includes(':');
    const isShortened = /^(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|cutt\.ly|rebrand\.ly)$/i.test(domain);
    const hasSuspiciousTld = /\.(?:biz|xyz|top|work|click|loan|gq|cf|tk|ml|stream|date|racing|bid)$/i.test(domain);
    const usesPunycodeOrLookalike = domain.includes('xn--') || /[-_]{2,}/.test(domain);

    const observableNotes: string[] = [];
    let riskWeight: ExtractedUrl['riskWeight'] = 'minimal';

    if (protocol === 'http') {
      observableNotes.push('Transmits unencrypted plaintext HTTP (lacks modern TLS/HTTPS).');
      riskWeight = 'moderate';
    }

    if (hasEmbeddedCredentials) {
      observableNotes.push('Contains embedded credentials in URL authority component (frequently used in phishing).');
      riskWeight = 'high';
    }

    if (isIpAddress) {
      observableNotes.push('Direct raw IP address target used instead of verified DNS hostname.');
      riskWeight = 'high';
    }

    if (isShortened) {
      observableNotes.push('Shortened or obfuscated link hides destination server identity.');
      riskWeight = 'elevated';
    }

    if (hasSuspiciousTld) {
      observableNotes.push(`Uses high-disposable top-level domain (.${domain.split('.').pop()}).`);
      riskWeight = 'elevated';
    }

    if (usesPunycodeOrLookalike) {
      observableNotes.push('Contains punycode (xn--) or delimiter hyphens common in brand lookalike spoofing.');
      riskWeight = 'high';
    }

    if (port && port !== '80' && port !== '443') {
      observableNotes.push(`Connects to non-standard service port (:${port}).`);
      if (riskWeight === 'minimal') riskWeight = 'moderate';
    }

    if (domain.includes('example.edu') || domain.endsWith('.edu')) {
      observableNotes.push('Domain structure matches educational institution hierarchy.');
    } else if (domain.includes('.gov')) {
      observableNotes.push('Registered governmental institution top-level domain.');
    }

    if (observableNotes.length === 0) {
      observableNotes.push('Standard commercial/organizational domain structure observed.');
    }

    return {
      id: `url-${index + 1}-${domain.replace(/[^a-z0-9]/gi, '_')}`,
      url: cleanUrl,
      domain,
      protocol,
      isIpAddress,
      isShortened,
      hasSuspiciousTld,
      usesPunycodeOrLookalike,
      observableNotes,
      riskWeight
    };
  });
}
