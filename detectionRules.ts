import type { DetectionRule, ExtractedUrl } from '../types';

/**
 * Extracts a concise substring around the first regex match to provide grounded, genuine evidence.
 * Guarantees that the returned snippet exists in the user's input.
 */
export function extractEvidenceSnippet(text: string, regex: RegExp, maxLen: number = 140): string | null {
  const match = regex.exec(text);
  if (!match) return null;

  const matchStart = match.index;
  const matchLength = match[0].length;
  const matchEnd = matchStart + matchLength;

  // Calculate a contextual window around the match
  const start = Math.max(0, matchStart - 20);
  const end = Math.min(text.length, matchEnd + 35);

  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = `...${snippet}`;
  if (end < text.length) snippet = `${snippet}...`;

  return snippet.slice(0, maxLen);
}

/**
 * Checks if a matched financial phrase is in an explicit negative context
 * (e.g. "NO application fee", "never pay a fee", "free to apply", "no processing charges").
 */
function isNegativeFinancialContext(text: string): boolean {
  const negativePatterns = [
    /\b(?:no|never|not\s*any|without\s*any|zero)\s*(?:application|processing|registration|upfront)?\s*(?:fee|charge|cost|deposit)s?\b/i,
    /\bthere\s*is\s*no\s*(?:application|processing)?\s*fee\b/i,
    /\bnever\s*requests?\s*(?:application\s*fees?|banking\s*passwords?|personal\s*credentials?)\b/i,
    /\bdo\s*not\s*send\s*(?:money|bank\s*statements|identity\s*credentials)\b/i,
    /\bfree\s*of\s*charge\b/i,
    /\bcompletely\s*free\s*to\s*apply\b/i
  ];

  return negativePatterns.some((pattern) => pattern.test(text));
}

/**
 * Checks if credential mention is an explicit warning or standard guidance
 * (e.g. "never send passwords", "do NOT send credentials").
 */
function isNegativeCredentialContext(text: string): boolean {
  const negativePatterns = [
    /\bdo\s*not\s*send\s*(?:bank\s*statements|identity\s*credentials|passwords?)\b/i,
    /\bnever\s*requests?\s*(?:banking\s*passwords?|passwords?|personal\s*credentials?)\b/i,
    /\bnever\s*disclose\s*(?:your\s*)?(?:passwords?|otps?)\b/i
  ];

  return negativePatterns.some((pattern) => pattern.test(text));
}

/**
 * Centralized, explainable detection rules catalog for student scam intelligence.
 * Covers financial manipulation, urgency coercion, credential theft, unrealistic promises,
 * off-platform routing, and observable URL anomalies.
 */
export const DETECTION_RULES: DetectionRule[] = [
  // --- 1. FINANCIAL MANIPULATION ---
  {
    id: 'sig-advance-fee',
    title: 'Advance Processing or Registration Fee Demand',
    category: 'financial_fee',
    severity: 'critical',
    weight: 42,
    explanation:
      'Legitimate scholarships, fellowships, and university grants never require applicants to pay an upfront "clearance fee", "processing charge", or "refundable registration deposit" to release funds.',
    recommendedAction:
      'Never send funds via wire transfer, P2P payment apps, or gift cards to receive a scholarship. Authentic aid is credited directly through bursar accounts.',
    evaluate: (text: string) => {
      if (isNegativeFinancialContext(text)) return null;

      const feePatterns = [
        /(?:mandates?|requires?|demands?)\s*(?:a\s*)?(?:one-time\s*)?(?:refundable\s*)?(?:verification|registration|clearance|processing)\s*(?:fee|charge|deposit)/i,
        /(?:pay|wire|send)\s*(?:a\s*)?(?:refundable\s*)?(?:verification|registration|clearance|processing)\s*(?:fee|clearance)\s*(?:of\s*)?\$?\d+/i,
        /(?:refundable\s*)?(?:verification|registration|clearance)\s*fee\s*of\s*\$?\d+/i,
        /pay\s*your\s*verification\s*clearance\s*now/i,
        /release\s*(?:your\s*)?(?:escrow|disbursement|grant|award).*?(?:fee|charge|deposit)\s*(?:of\s*)?\$?\d+/i
      ];

      for (const pattern of feePatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },
  {
    id: 'sig-training-kit-fee',
    title: 'Candidate-Financed Equipment or Training Software Purchase',
    category: 'financial_fee',
    severity: 'high',
    weight: 35,
    explanation:
      'Fraudulent employers frequently promise lucrative remote internships on the condition that candidates purchase proprietary software licenses, workstation suites, or security dongles from unverified vendors.',
    recommendedAction:
      'Legitimate organizations supply company hardware and software licenses directly; refuse offers requiring candidate-funded vendor purchases.',
    evaluate: (text: string) => {
      if (isNegativeFinancialContext(text)) return null;

      const kitPatterns = [
        /(?:must\s*acquire|purchase|buy|order)\s*(?:the\s*)?(?:proprietary|certified|mandatory)?\s*["']?[^"'\n]{0,60}?(?:workstation|developer suite|training kit|security dongle|onboarding kit)["']?/i,
        /proprietary\s*["'][^"'\n]{0,60}?(?:workstation|suite|dongle|kit)["']/i,
        /vendor\s*kit\s*link/i,
        /(?:reimburse\s*this|reimbursed)\s*(?:on|with)\s*(?:your\s*)?first\s*pay\s*stub/i
      ];

      for (const pattern of kitPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },
  {
    id: 'sig-untraceable-payment',
    title: 'Informal or Irreversible Payment Channels',
    category: 'suspicious_channel',
    severity: 'high',
    weight: 25,
    explanation:
      'Requesting payments or fee disbursements via peer-to-peer rails (Zelle, Venmo, CashApp), Western Union, or cryptocurrency vouchers removes consumer fraud protections and makes funds unrecoverable.',
    recommendedAction:
      'University bursar offices and reputable companies transact only through authorized institutional bank accounts or accredited corporate portals.',
    evaluate: (text: string) => {
      const p2pPatterns = [
        /\bzelle\s*(?:to\s*)?[\w.-]+@[\w.-]+/i,
        /\b(?:zelle|venmo|cash\s*app|crypto\s*voucher|bitcoin|ethereum|western\s*union|moneygram|gift\s*card)\b/i,
        /\binstant\s*bank\s*wire\b/i
      ];

      for (const pattern of p2pPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },

  // --- 2. SENSITIVE CREDENTIAL & OTP THEFT ---
  {
    id: 'sig-portal-password',
    title: 'Student Portal Username & Password Harvesting',
    category: 'credential_theft',
    severity: 'critical',
    weight: 45,
    explanation:
      'Requesting student portal credentials, campus SSO passwords, or direct email logins enables unauthorized account access, identity theft, and diversion of bursar direct deposits.',
    recommendedAction:
      'Never disclose your university username, password, or student portal access credentials over email or chat. Campus IT will never ask for your password.',
    evaluate: (text: string) => {
      if (isNegativeCredentialContext(text)) return null;

      const credentialPatterns = [
        /(?:reply|send|provide).*?\b(?:student\s*portal|campus\s*(?:portal|sso)|workday|blackboard|canvas)?\s*username\s*(?:&|and)\s*password\b/i,
        /\b(?:campus\s*)?student\s*portal\s*username\s*(?:&|and)\s*password\b/i,
        /\b(?:your\s*)?(?:student\s*)?(?:account\s*)?password\s*(?:and|&)\s*username\b/i,
        /\benter\s*your\s*portal\s*password\b/i
      ];

      for (const pattern of credentialPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },
  {
    id: 'sig-otp-harvest',
    title: 'Two-Factor Authentication (2FA) / OTP Interception',
    category: 'credential_theft',
    severity: 'critical',
    weight: 45,
    explanation:
      'Demanding a 6-digit one-time password (OTP) or DUO Mobile 2FA push approval is an active session hijacking attack designed to bypass multi-factor authentication.',
    recommendedAction:
      '2FA push authorizations and SMS OTP codes are strictly confidential. Do not forward or read authentication codes to any caller or supervisor.',
    evaluate: (text: string) => {
      const otpPatterns = [
        /\bduo\s*mobile\s*2-factor\s*push\b/i,
        /\b(?:duo\s*mobile|duo\s*push|6-digit\s*(?:sms\s*)?otp|one-time\s*password)\b/i,
        /\b6-digit\s*(?:sms\s*)?code\s*immediately\b/i,
        /\breply\s*back\s*with\s*(?:the\s*)?(?:6-digit|six-digit|otp|code)\b/i
      ];

      for (const pattern of otpPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },

  // --- 3. URGENCY & PSYCHOLOGICAL COERCION ---
  {
    id: 'sig-artificial-urgency',
    title: 'Artificial Countdown Urgency',
    category: 'urgency_coercion',
    severity: 'medium',
    weight: 18,
    explanation:
      'Imposing an arbitrary short-fuse deadline (such as "within 24 hours" or "closing today at 5:00 PM") is a psychological coercion tactic designed to rush victims past critical verification.',
    recommendedAction:
      'Do not allow manufactured time pressure to rush your judgment. Consult your university financial aid or placement office before responding.',
    evaluate: (text: string) => {
      const urgencyPatterns = [
        /\bwithin\s*24\s*hours\b/i,
        /\bclosing\s*(?:the\s*)?(?:semester\s*)?payroll\s*(?:database\s*)?today\s*at\s*5:00\s*pm\b/i,
        /\bdo\s*not\s*delay\s*or\s*your\s*spot\s*will\s*be\s*given\b/i,
        /\bact\s*immediately\s*or\s*(?:lose|forfeit)\b/i,
        /\bcomplete\s*(?:enrollment\s*)?verification\s*within\s*\d+\s*hours\b/i
      ];

      for (const pattern of urgencyPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },
  {
    id: 'sig-forfeiture-threat',
    title: 'Allocation Forfeiture Threat',
    category: 'urgency_coercion',
    severity: 'medium',
    weight: 16,
    explanation:
      'Threatening that a student fellowship, grant allocation, or job offer will be permanently revoked or reallocated unless immediate compliance is given.',
    recommendedAction:
      'Legitimate awards grant formal written notice with documented dispute and extension procedures. Verify deadlines on official portals.',
    evaluate: (text: string) => {
      const forfeitPatterns = [
        /\bavoid\s*permanent\s*forfeiture\b/i,
        /\bfunds\s*are\s*reallocated\s*to\s*alternate\s*candidates\b/i,
        /\bspot\s*will\s*be\s*given\s*to\s*the\s*next\s*candidate\b/i,
        /\bforfeit\s*(?:your\s*)?(?:allocation|grant|scholarship|offer)\b/i
      ];

      for (const pattern of forfeitPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },

  // --- 4. UNREALISTIC PROMISES & GUARANTEES ---
  {
    id: 'sig-guaranteed-placement',
    title: 'Guaranteed Selection Without Competitive Screening',
    category: 'guaranteed_placement',
    severity: 'high',
    weight: 28,
    explanation:
      'Promising "100% guaranteed selection" or hiring with no technical review, portfolio assessment, or interview process contradicts authentic academic and corporate employment.',
    recommendedAction:
      'Research the employer independently. Legitimate internships require competitive review and structured interviews before extending an offer.',
    evaluate: (text: string) => {
      const guaranteePatterns = [
        /\b100%\s*guaranteed\s*selection\b/i,
        /\bno\s*prior\s*experience\s*required[.,!\s]+100%\s*guaranteed\b/i,
        /\bguaranteed\s*(?:selection|internship|hiring|placement)\s*upon\s*onboarding\b/i,
        /\breturn\s*offer\s*guaranteed\s*for\b/i
      ];

      for (const pattern of guaranteePatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },
  {
    id: 'sig-implausible-wage',
    title: 'Implausible Entry-Level Compensation',
    category: 'guaranteed_placement',
    severity: 'medium',
    weight: 16,
    explanation:
      'Promising an unrealistically high hourly wage ($65+/hr) for an entry-level student position with no prior qualifications is a typical hook deployed by deceptive recruiters.',
    recommendedAction:
      'Compare advertised compensation with student hourly averages published by your university career center or the Bureau of Labor Statistics.',
    evaluate: (text: string) => {
      const wagePatterns = [
        /\$(?:6[5-9]|[7-9]\d|1\d{2,})\.?\d{0,2}\s*(?:\/|\s*per\s*)(?:hr|hour)\b/i,
        /\b\$65\.00\/hour\b/i
      ];

      for (const pattern of wagePatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },
  {
    id: 'sig-unsolicited-selection',
    title: 'Unsolicited Selection from Generic Database',
    category: 'unverifiable_sender',
    severity: 'medium',
    weight: 12,
    explanation:
      'Claims that a student was selected for a large monetary allocation ($10,000+) from a "national database" without having submitted an application is a standard grant fraud pattern.',
    recommendedAction:
      'Verify whether you personally submitted an application for this program. Authentic scholarships do not award unapplied allocations.',
    evaluate: (text: string) => {
      const selectionPatterns = [
        /\bselected\s*from\s*(?:the\s*)?(?:national\s*student\s*collegiate|unclaimed\s*funds)\s*database\b/i,
        /\byour\s*profile\s*was\s*selected\s*from\s*the\s*national\b/i,
        /\ballocation\s*reference:\s*#\w+/i
      ];

      for (const pattern of selectionPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },

  // --- 5. SUSPICIOUS RECRUITMENT CHANNELS & IMPERSONATION ---
  {
    id: 'sig-off-platform-comm',
    title: 'Off-Platform Recruitment Channel Routing',
    category: 'suspicious_channel',
    severity: 'medium',
    weight: 22,
    explanation:
      'Diverting candidate communications to Telegram or WhatsApp removes institutional compliance logging, facilitates anonymity, and shields fraudulent recruiters from enterprise oversight.',
    recommendedAction:
      'Insist on conducting all recruiting communications via verified corporate email addresses (@company.com) or official university career networks.',
    evaluate: (text: string) => {
      const offPlatformPatterns = [
        /\btelegram:\s*@[\w_]+/i,
        /\bcontact\s*(?:our\s*)?recruitment\s*manager:\s*telegram/i,
        /\b(?:chat|message)\s*(?:on|via)\s*(?:whatsapp|telegram|signal)\b/i
      ];

      for (const pattern of offPlatformPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },
  {
    id: 'sig-faculty-impersonation',
    title: 'Faculty / Supervisor Impersonation Marker',
    category: 'unverifiable_sender',
    severity: 'medium',
    weight: 18,
    explanation:
      'Invoking the name of an academic department chair or faculty supervisor in an unsolicited direct message to demand urgent student assistance is a common campus phishing pretext.',
    recommendedAction:
      'Verify the faculty member in your university directory and reach out directly using their published campus email or office phone.',
    evaluate: (text: string) => {
      const impersonationPatterns = [
        /\bfrom\s*dr\.\s+[a-z]+(?:\s+[a-z]+)?\s*\((?:department\s*chair|dean)\)/i,
        /\bi\s*am\s*manually\s*registering\s*your\s*student\s*employee\s*profile\b/i,
        /\bi\s*need\s*an\s*assistant\s*to\s*help\s*with\s*research\s*document\s*indexing\b/i
      ];

      for (const pattern of impersonationPatterns) {
        const snippet = extractEvidenceSnippet(text, pattern);
        if (snippet) return { matched: true, evidence: snippet };
      }
      return null;
    }
  },

  // --- 6. QUARANTINED URL INDICATORS ---
  {
    id: 'sig-url-insecure-http',
    title: 'Unencrypted Plaintext HTTP Link',
    category: 'unverifiable_sender',
    severity: 'low',
    weight: 8,
    explanation:
      'The message references a destination link transmitting over unencrypted HTTP (port 80) rather than modern TLS-encrypted HTTPS, exposing transmitted data to eavesdropping.',
    recommendedAction:
      'Do not enter credentials or personal data into websites lacking valid HTTPS encryption.',
    evaluate: (_text: string, urls: ExtractedUrl[]) => {
      const insecureUrl = urls.find((u) => u.protocol === 'http');
      if (insecureUrl) {
        return {
          matched: true,
          evidence: insecureUrl.url
        };
      }
      return null;
    }
  },
  {
    id: 'sig-url-suspicious-tld',
    title: 'High-Disposable Top-Level Domain in URL',
    category: 'unverifiable_sender',
    severity: 'medium',
    weight: 14,
    explanation:
      'The link points to a disposable or high-abuse top-level domain (.biz, .xyz, .top, .click) that is rarely associated with legitimate universities or accredited employers.',
    recommendedAction:
      'Check whether the company maintains a standard primary domain (.com, .org, or country-code TLD) before visiting any link.',
    evaluate: (_text: string, urls: ExtractedUrl[]) => {
      const suspiciousTldUrl = urls.find((u) => u.hasSuspiciousTld);
      if (suspiciousTldUrl) {
        return {
          matched: true,
          evidence: suspiciousTldUrl.url
        };
      }
      return null;
    }
  },
  {
    id: 'sig-url-shortened',
    title: 'Obfuscated / Shortened Destination URL',
    category: 'suspicious_channel',
    severity: 'medium',
    weight: 14,
    explanation:
      'The link uses an obfuscated URL shortener (e.g. bit.ly, tinyurl.com) that hides the true destination host from preview inspection.',
    recommendedAction:
      'Do not click shortened links in unrequested emails. Seek the direct corporate or university URL independently.',
    evaluate: (_text: string, urls: ExtractedUrl[]) => {
      const shortenedUrl = urls.find((u) => u.isShortened);
      if (shortenedUrl) {
        return {
          matched: true,
          evidence: shortenedUrl.url
        };
      }
      return null;
    }
  },
  {
    id: 'sig-url-lookalike',
    title: 'Deceptive Lookalike or Subdomain Masking Link',
    category: 'inconsistent_branding',
    severity: 'high',
    weight: 22,
    explanation:
      'The URL contains consecutive hyphens or multi-level payment subdomains designed to mimic legitimate financial or escrow institutions.',
    recommendedAction:
      'Inspect the root domain carefully. A domain like "apex-global-funds.example.org" is NOT the same as an official university domain.',
    evaluate: (_text: string, urls: ExtractedUrl[]) => {
      const lookalikeUrl = urls.find((u) => u.usesPunycodeOrLookalike);
      if (lookalikeUrl) {
        return {
          matched: true,
          evidence: lookalikeUrl.url
        };
      }
      return null;
    }
  },
  {
    id: 'sig-url-raw-ip',
    title: 'Direct Numeric IP Address Host',
    category: 'unverifiable_sender',
    severity: 'high',
    weight: 25,
    explanation:
      'The URL connects directly to a numeric IP address rather than a registered, authenticated DNS domain name, a hallmark of malicious temporary servers.',
    recommendedAction:
      'Never visit links containing raw numeric IP addresses.',
    evaluate: (_text: string, urls: ExtractedUrl[]) => {
      const ipUrl = urls.find((u) => u.isIpAddress);
      if (ipUrl) {
        return {
          matched: true,
          evidence: ipUrl.url
        };
      }
      return null;
    }
  }
];

/**
 * Centralized risk scoring threshold definitions.
 */
export const RISK_THRESHOLDS = {
  LOW_MAX: 29,
  MEDIUM_MAX: 69,
  HIGH_MIN: 70
} as const;

/**
 * Maximum point contribution allowed from any individual category to prevent double-counting.
 */
export const CATEGORY_SCORE_CAPS: Record<string, number> = {
  credential_theft: 80,
  financial_fee: 55,
  guaranteed_placement: 40,
  suspicious_channel: 30,
  urgency_coercion: 25,
  unverifiable_sender: 25,
  inconsistent_branding: 25
};

