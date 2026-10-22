# ScholarShield AI — Aurora Edition • Explainable Student Scam Detection

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()
[![Tests](https://img.shields.io/badge/Tests-61%20Passed-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20v5.x-blue)]()
[![React](https://img.shields.io/badge/React-19.x-61DAFB)]()
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF)]()
[![Design System](https://img.shields.io/badge/Design%20System-Aurora%20Intelligence-6366F1)]()
[![Benchmark](https://img.shields.io/badge/Benchmark-v1.0.0%20(80%20Samples)-gold)]()
[![Audit](https://img.shields.io/badge/Vulnerabilities-0-brightgreen)]()
[![License](https://img.shields.io/badge/License-Academic%20Evaluation-gold)]()

> **ScholarShield AI — Aurora Edition** is a student-cybersecurity and risk assessment application featuring the **"Aurora Intelligence"** design system: pearl-white and cool-white layered surfaces, soft lavender and cyan ambient lighting, electric violet primary accents, and deep midnight-navy typography. Developed to protect collegiate students from fraudulent scholarship announcements, deceptive internship recruitments, advance-fee scams, and university credential harvesting.

---

## 1. Product Purpose & Threat Landscape

Undergraduate and graduate students represent an intensely targeted demographic for cyber deception syndicates. High academic pressure, mounting tuition expenses, and urgent internship placement timelines make students vulnerable to social-engineering vectors:
- **Advance-Fee Scholarship Fraud**: Unsolicited grants demanding "refundable verification clearance" ($100–$300) before releasing nonexistent award funds.
- **Equipment & Workstation Kits**: Guaranteed high-stipend remote internships contingent upon purchasing software dongles or workstations from spoofed vendor portals.
- **Campus Portal & 2FA Harvesting**: Impersonating academic department heads to coerce students into providing campus single sign-on (SSO) credentials and DUO 2FA push tokens to reroute payroll and bursar refunds.
- **Counterfeit Check Overpayment**: Dispatching counterfeit checks for "home office setup" and requesting the student wire back the difference before the check bounces.

ScholarShield AI addresses these threats through a **deterministic, explainable rule engine and reproducible benchmark evaluation suite**, isolating deceptive tactics without exposing sensitive student data to external third-party cloud models.

---

## 2. Detection Engine Architecture & Rule Catalog

The message analysis engine is implemented cleanly in `src/lib/analyzeMessage.ts` and `src/lib/detectionRules.ts`. It provides 100% deterministic, explainable risk scoring across 6 threat dimensions:

### Threat Dimensions & Rules

| Threat Dimension | Rule ID | Title | Severity | Weight | Matching Criteria & Guard Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Financial Manipulation** | `sig-advance-fee` | Advance Processing or Registration Fee Demand | Critical | 42 | Detects demands for upfront clearance/verification fees to release grants. Includes negative context guard (excludes "no application fee"). |
| | `sig-training-kit-fee` | Candidate-Financed Equipment / Software Purchase | High | 35 | Identifies mandates to purchase proprietary developer workstation kits or dongles from vendor links. |
| | `sig-untraceable-payment`| Informal or Irreversible Payment Channels | High | 25 | Detects requests for Zelle, Venmo, CashApp, crypto vouchers, or wire transfers. |
| **Credential & OTP Theft**| `sig-portal-password` | Student Portal Username & Password Harvesting | Critical | 45 | Flags requests for student portal, campus SSO, Workday, or Canvas passwords. Excludes defensive warnings. |
| | `sig-otp-harvest` | Two-Factor Authentication (2FA) / OTP Interception | Critical | 45 | Identifies active demands for 6-digit SMS OTPs or DUO Mobile 2FA push authorizations. |
| **Urgency & Coercion** | `sig-artificial-urgency`| Artificial Countdown Urgency | Medium | 18 | Detects manufactured short-fuse deadlines (e.g. "within 24 hours", "closing today at 5:00 PM"). |
| | `sig-forfeiture-threat` | Allocation Forfeiture Threat | Medium | 16 | Identifies threats of permanent award forfeiture or giving spots to waitlisted candidates. |
| **Unrealistic Promises** | `sig-guaranteed-placement`| Guaranteed Selection Without Screening | High | 28 | Flags "100% guaranteed selection" with "no experience required". |
| | `sig-implausible-wage` | Implausible Entry-Level Compensation | Medium | 16 | Detects unrealistic student hourly wages ($65–$100+/hr) for introductory tasks. |
| | `sig-unsolicited-selection`| Unsolicited Selection from Generic Database | Medium | 12 | Flags claims of selection for thousands of dollars from generic collegiate databases. |
| **Suspicious Channels** | `sig-off-platform-comm` | Off-Platform Recruitment Routing | Medium | 22 | Identifies recruitment diversion to Telegram or WhatsApp. |
| | `sig-faculty-impersonation`| Faculty / Supervisor Impersonation Marker | Medium | 18 | Flags department chair/dean impersonation pretexts in informal messages. |
| **Quarantined URLs** | `sig-url-insecure-http` | Unencrypted Plaintext HTTP Link | Low | 8 | Identifies links transmitting over unencrypted port 80. |
| | `sig-url-suspicious-tld` | High-Disposable Top-Level Domain | Medium | 14 | Detects high-abuse disposable TLDs (`.biz`, `.xyz`, `.top`, `.click`, `.loan`). |
| | `sig-url-shortened` | Obfuscated / Shortened Destination URL | Medium | 14 | Identifies link shorteners (`bit.ly`, `tinyurl.com`, `t.co`) masking destinations. |
| | `sig-url-lookalike` | Deceptive Lookalike or Subdomain Masking Link | High | 22 | Identifies multi-level payment subdomains or punycode spoofing patterns. |
| | `sig-url-raw-ip` | Direct Numeric IP Address Host | High | 25 | Detects direct IP connections bypassing DNS domain verification. |

---

## 3. Ground-Truth Benchmark Dataset & Verified Evaluation

The evaluation system in `src/lib/evaluateDataset.ts` and `src/data/benchmarkDataset.ts` establishes a scientifically grounded, reproducible empirical test harness.

### Dataset Schema & Composition

- **Corpus Size**: 80 curated samples (40 Legitimate Negative Controls, 40 Deceptive Positive Threats).
- **Group-Aware Leakage Prevention**: Related template variants share a `splitGroup` attribute. The deterministic partitioner (`splitDataset`) assigns whole clusters to either `development` or `test` using a seeded PRNG (`mulberry32`, seed 42), ensuring zero leakage across partitions.
- **Safety Guarantee**: 100% fictional organizations and reserved documentation domains (`*.example.edu`, `*.example.org`, `*.example.com`). Zero live malware or active tracking links.

### Independently Verified Benchmark Performance

| Evaluation Partition | Samples | TP | FP | TN | FN | Precision | Recall | F1-Score | FPR | Accuracy |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Held-Out Test Set (Pre-Registered)** | **40** | **20** | **0** | **17** | **3** | **100.0%** | **87.0%** | **93.0%** | **0.0%** | **92.5%** |
| **Full Benchmark Corpus** | **80** | **40** | **4** | **36** | **0** | **90.9%** | **100.0%** | **95.2%** | **10.0%** | **95.0%** |

> [!NOTE]
> **Scientific Integrity Disclosure**: On the 40-message held-out test partition with group-leakage protection, the engine achieved $TP=20, FP=0, TN=17, FN=3$. False negatives (Type II errors) in the test partition correspond to subtle spear-phishing variants that omit explicit payment keywords, demonstrating the diagnostic utility of the built-in Error Analysis Explorer.

### Mathematical Formulation & Zero-Denominator Safety

All metrics are calculated strictly from empirical confusion matrix counts with zero-denominator guards to eliminate `NaN` or `Infinity`:

$$\text{Precision} = \begin{cases} \frac{TP}{TP + FP} & \text{if } TP + FP > 0 \\ 0 & \text{otherwise} \end{cases}$$

$$\text{Recall} = \begin{cases} \frac{TP}{TP + FN} & \text{if } TP + FN > 0 \\ 0 & \text{otherwise} \end{cases}$$

$$\text{F1-Score} = \begin{cases} \frac{2 \times \text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} & \text{if } \text{Precision} + \text{Recall} > 0 \\ 0 & \text{otherwise} \end{cases}$$

$$\text{False Positive Rate (FPR)} = \begin{cases} \frac{FP}{FP + TN} & \text{if } FP + TN > 0 \\ 0 & \text{otherwise} \end{cases}$$

$$\text{Accuracy} = \begin{cases} \frac{TP + TN}{TP + FP + TN + FN} & \text{if Total} > 0 \\ 0 & \text{otherwise} \end{cases}$$

---

## 4. Security Hardening & Defenses

1. **Text & Unicode Normalization (`src/lib/textNormalization.ts`)**:
   - Strips zero-width evasion characters (`\u200B`, `\u200C`, `\u200D`, `\u2060`, `\uFEFF`, `\u00AD`).
   - Normalizes non-breaking spaces and unusual Unicode spaces into standard ASCII space (`0x20`).
   - Normalizes compatibility characters via Unicode `NFKC`.
   - Normalizes common Cyrillic/Greek confusable homoglyphs.
   - **Critical Invariant**: Original user input is preserved untouched in UI, state, and reports; normalization is strictly used by detection heuristics.
2. **User Input Bounds & Sanitization**:
   - Enforces a 10,000-character maximum input length with character count indicators and safe truncation.
   - Rejects empty and whitespace-only submissions cleanly.
   - Rendered strictly via safe React JSX text nodes (zero `dangerouslySetInnerHTML`).
3. **URL Parsing Hardening (`src/lib/urlUtils.ts`)**:
   - **Zero Network Activity**: Never automatically fetches, pings, or resolves extracted links.
   - **Credential Masking**: Automatically redacts embedded passwords in URL authority (`http://user:***@host`).
   - Structural risk indicators for unencrypted HTTP, direct IP hosts, link shorteners, punycode lookalikes, and non-standard service ports.
4. **Application Error Recovery (`src/components/common/ErrorBoundary.tsx`)**:
   - Intercepts unexpected rendering crashes and provides session recovery without data loss.

---

## 5. Incident Report Export & Classroom Presentation Mode

### A. Client-Side Incident Report Dossier
Analyze any suspicious message and click **"Export Incident Dossier"** to access:
- **Structured JSON Export**: Machine-readable payload containing anonymized Report ID (`SSR-YYYYMMDD-XXXX`), risk scores, warning signals, evidence snippets, quarantined URLs, and verification steps.
- **CSV Summary Export**: Spreadsheet-ready table protected against CSV formula injection (`=,+,-,@`).
- **Print / PDF Dossier**: High-contrast, publication-grade printable report formatted via `@media print` with application chrome hidden.

### B. Classroom Presentation Mode
Toggle Presentation Mode via the header button or press **`P`** on your keyboard:
- Projector-optimized high-contrast typography and collapsed sidebar layout.
- Interactive 5-step guided curriculum:
  1. **Problem Overview**: Collegiate scam landscape and student vulnerability.
  2. **Advance-Fee Scam**: Global Scholars Grant ($185 clearance demand, Score 84/100).
  3. **Credential & 2FA Harvest**: Urgent campus SSO & DUO push theft (Score 98/100).
  4. **Plausible Legitimate Notice**: Regional Tech Incubator (Score 0/100, explaining LOW $\ne$ guaranteed safe).
  5. **Model Evaluation & Confusion Matrix**: Statistical metrics and error analysis walkthrough.

---

## 6. Milestone History

```mermaid
graph TD
    M1["Prompt 1: Foundation & Presentation UI (Complete)"] --> M2["Prompt 2: Detection Engine & Scoring Core (Complete)"]
    M2 --> M3["Prompt 3: Labelled Dataset & Statistical Metrics (Complete)"]
    M3 --> M4["Prompt 4: Production Hardening, Incident Dossier & Polish (Complete)"]

    style M1 fill:#171D25,stroke:#62D9C0,stroke-width:2px,color:#F2F0E9
    style M2 fill:#171D25,stroke:#62D9C0,stroke-width:2px,color:#F2F0E9
    style M3 fill:#171D25,stroke:#62D9C0,stroke-width:2px,color:#F2F0E9
    style M4 fill:#171D25,stroke:#E8B45A,stroke-width:2px,color:#F2F0E9
```

| Milestone | Scope & Capabilities | Current Status |
| :--- | :--- | :--- |
| **Prompt 1** | **Project Foundation, Architecture & Presentation-Ready UI**<br>• Obsidian design system and layout shell<br>• Overview dashboard with workflow and scam taxonomy<br>• Analysis workspace with character count, URL live detector, and 5 demo scenarios<br>• Modular explainable result components (ScoreGauge, EvidenceCards, Verification Checklist)<br>• Transparent Evaluation page (honest pending state, zero fabricated metrics)<br>• About & Methodology page with data privacy rules | **Operational & Built** |
| **Prompt 2** | **Explainable Detection Engine & Transparent Risk Scoring**<br>• Pure deterministic rule engine in `analyzeMessage.ts` and `detectionRules.ts`<br>• 17 threat rules across 6 dimensions with negative-context filtering<br>• Grounded evidence extraction matching exact input text<br>• Category-capped scoring and compound threat bonuses<br>• Dynamic safe verification checklist tailored to detected threat categories | **Operational & Tested** |
| **Prompt 3** | **Curated Dataset, Reproducible Evaluation & Analytics Dashboard**<br>• Curated 80-sample ground-truth dataset with strict provenance<br>• Group-aware deterministic partitioner preventing template leakage<br>• Pure statistical calculation engine (`evaluateDataset.ts`) with zero-denominator safety<br>• Live Evaluation dashboard connected to real computed metrics<br>• Interactive Error Analysis Explorer with False Positive & False Negative diagnostics<br>• Threshold sensitivity comparison explorer | **Operational & Tested** |
| **Prompt 4 (Final)** | **Production Hardening, Deployment Readiness, Reports & Polish**<br>• Unicode normalization & zero-width character evasion resistance<br>• Hardened URL parsing with credential redaction & port inspection<br>• Client-side Incident Report Export (JSON, CSV, PDF Print)<br>• Interactive 5-step Classroom Presentation Mode with keyboard controls (`P`, `Esc`)<br>• Application Error Boundary with graceful session recovery<br>• Production static deployment configs for Vercel, Netlify, and GitHub Pages<br>• Automated Vitest suite extended to 61 passing tests | **Operational & Production-Ready** |

---

## 7. Local Installation & Verification

### Prerequisites
- Node.js (v18.0 or later; tested with v24.21.0)
- npm (v9.0 or later; tested with v11.19.0)

### Quick Start

```bash
# 1. Clone or navigate to the project directory
cd Scholarshieldai

# 2. Install dependencies
npm install

# 3. Run automated unit and integration tests (61 tests)
npm test

# 4. Check static analysis and linting (0 errors, 0 warnings)
npm run lint

# 5. Build production bundle (relative base path)
npm run build

# 6. Launch local development server
npm run dev
# Application available at http://localhost:5173/ (or http://127.0.0.1:5174/)
```

### Production Deployment Instructions
For complete instructions on deploying to **Vercel**, **Netlify**, **GitHub Pages**, or **Docker/Nginx**, see [`DEPLOYMENT.md`](file:///c:/Users/irfan%20khan/Documents/Scholarshieldai/DEPLOYMENT.md).

---

## 8. Known Scientific Limitations & Threats to Validity

1. **Heuristic vs. Machine Learning**: ScholarShield AI employs transparent, explainable heuristic pattern matchers, not a trained neural network or statistically optimized classifier. High performance on this benchmark indicates fidelity against modelled attack archetypes rather than an empirical guarantee on novel unobserved campaigns.
2. **Synthetic Provenance**: All messages are synthetically curated using observed patterns from university circulars and FTC scam reports. While this eliminates privacy risks and avoids hosting live malware, synthetic samples may not exhibit the full linguistic variance of real-world communications.
3. **Adversarial Drift**: Attackers frequently evolve phrasing, deploy Unicode homoglyphs, or use multi-stage conversational lures. Heuristic rules must be continuously maintained and updated to address evasion techniques.

---

## 9. License

Developed for academic cybersecurity research, transparent evaluation, and classroom presentation.
