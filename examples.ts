import type { ExampleMessage } from '../types';

export const EXAMPLE_MESSAGES: ExampleMessage[] = [
  {
    id: 'example-1-legitimate-link',
    title: 'University Dean Merit Award Announcement',
    categoryBadge: 'Legitimate Notice',
    expectedRisk: 'LOW',
    scenarioType: 'legitimate_official',
    description: 'A genuine-style academic scholarship circular with an official portal link for students to review requirements.',
    primarySignalsHighlight: [
      'Official institutional tone',
      'No upfront financial fees required',
      'Requires institutional student portal sign-in',
      'Standard application window'
    ],
    content: `From: Financial Aid Office <finaid-notifications@merit.stateuniv.example.edu>
Subject: 2026-2027 Academic Excellence Undergraduate Scholarship Window Open

Dear Student,

The Office of Student Financial Assistance is pleased to announce the opening of the 2026-2027 Academic Excellence Merit Scholarship. Full-time undergraduate students enrolled in STEM or humanities disciplines with a cumulative GPA of 3.5 or above are eligible to apply.

Key Details:
- Grant Amount: Up to $4,500 per semester
- Application Deadline: November 15, 2026 at 11:59 PM EST
- Submission Portal: https://finaid.portal.stateuniv.example.edu/merit-awards

Important Guidance:
- There is NO application fee or processing fee at any stage.
- Applications must be submitted through your authenticated campus single sign-on (SSO).
- Official transcripts will be fetched automatically via the registrar; do NOT send bank statements or identity credentials over email.

For questions, visit the Financial Aid desk in Hall 3B or email finaid-inquiry@stateuniv.example.edu.`
  },
  {
    id: 'example-2-scholarship-fee',
    title: 'Global Scholars Grant — Upfront Processing Fee Scam',
    categoryBadge: 'High Risk Scam',
    expectedRisk: 'HIGH',
    scenarioType: 'scholarship_fee',
    description: 'Unsolicited congratulatory notification claiming an award has been reserved, demanding an urgent "refundable registration fee".',
    primarySignalsHighlight: [
      'Advance fee fraud pattern ($185 fee to unlock award)',
      'Artificial countdown urgency (24-hour forfeiture)',
      'Unsolicited selection without prior application',
      'Payment demanded via non-retraceable wallet or gift card'
    ],
    content: `CONGRATULATIONS!! You have been selected for the 2026 Global Apex Future Leader Fellowship ($12,000 Disbursement)!

Your profile was selected from the national student collegiate database. To secure your allocation before funds are reallocated to alternate candidates, you must complete enrollment verification within 24 HOURS.

DISBURSEMENT BREAKDOWN:
- Award Sum: $12,000 USD (Tax-Exempt Direct Wire)
- Allocation Reference: #APX-98214-US

To release your escrow disbursement packet, our compliance committee mandates a one-time refundable verification and registration clearance fee of $185.00 USD.

Pay your verification clearance now to avoid permanent forfeiture:
👉 https://apex-global-funds-clearance.temporary-pay.example.org/checkout?ref=98214

Accepted: Instant Bank Wire, Zelle to compliance-desk@apex-pay.example.com, or Crypto voucher. Upon verification, the $185 will be refunded along with your $12,000 grant.`
  },
  {
    id: 'example-3-guaranteed-internship',
    title: 'Guaranteed Remote AI Internship with Mandatory "Training Kit" Purchase',
    categoryBadge: 'High Risk Offer',
    expectedRisk: 'HIGH',
    scenarioType: 'guaranteed_internship',
    description: 'A job posting promising guaranteed placement and unrealistically high stipend, conditioned upon buying a mandatory training software kit.',
    primarySignalsHighlight: [
      'Guaranteed hiring without technical interview',
      'Unusually high entry-level compensation ($65/hr)',
      'Mandatory candidate-funded equipment/software purchase',
      'Telegram/WhatsApp interview routing'
    ],
    content: `URGENT HIRING: Remote Artificial Intelligence Research Intern ($65/hour)

NexGen Global Systems Inc. is hiring 10 college students immediately. NO prior experience required. 100% GUARANTEED selection upon onboarding test completion!

Perks:
- $65.00/hour flexible schedule (15-20 hrs/week)
- $1,500 monthly housing and technology stipend
- Return offer guaranteed for summer 2027

To formalize your immediate appointment, all applicants must acquire the proprietary "NexGen Neural Developer Workstation Suite & Security Dongle" from our certified vendor portal ($249.00 student discount rate). The company will reimburse this on your first pay stub!

Complete order & send receipt to our recruitment manager:
Telegram: @NexGen_Recruiter_Official
Vendor Kit Link: http://nexgen-hardware-dispatch.biz.example.com/checkout?id=8831`
  },
  {
    id: 'example-4-credential-otp',
    title: 'Urgent Campus Job Placement — OTP & Student Portal Credential Request',
    categoryBadge: 'Critical Scam',
    expectedRisk: 'HIGH',
    scenarioType: 'credential_otp',
    description: 'Impersonates an academic supervisor requesting the student’s portal password and 2FA authentication code to "setup direct deposit".',
    primarySignalsHighlight: [
      'Active credential harvesting (login + 2FA token)',
      'Impersonation of department chair/supervisor',
      'High-pressure timeline to bypass cognitive checks',
      'Requests private phone number and OTP over SMS'
    ],
    content: `Urgent Student Work-Study Notification from Dr. Robert Vance (Department Chair)

I need an assistant to help with research document indexing starting tomorrow morning. Pay is $28.50/hr paid weekly via university payroll.

Because HR is closing the semester payroll database today at 5:00 PM, I am manually registering your student employee profile into the Workday portal right now.

Reply immediately to this message with:
1. Your Campus Student Portal Username & Password
2. Your personal mobile number
3. When the DUO Mobile 2-Factor push notification or 6-digit SMS OTP appears on your phone, reply back with the 6-digit code IMMEDIATELY so I can authorize your payroll direct deposit.

Do not delay or your spot will be given to the next candidate on the waitlist.`
  },
  {
    id: 'example-5-plausible-internship',
    title: 'Regional Tech Incubator — Summer Analyst Application Invitation',
    categoryBadge: 'Plausible / Low Risk',
    expectedRisk: 'LOW',
    scenarioType: 'plausible_internship',
    description: 'A genuine-sounding recruitment invitation with realistic expectations, multi-stage interviews, and verifiable corporate domain.',
    primarySignalsHighlight: [
      'Standard competitive multi-stage interview process',
      'No upfront financial demands or equipment purchase',
      'Realistic compensation expectations ($22-26/hr)',
      'Standard corporate careers link without credential requests'
    ],
    content: `Subject: Invitation to Apply: Summer 2027 Business Systems & Software Analyst Internship

Hi there,

We recently reviewed candidate profiles from the Metro Collegiate Career Fair and would like to invite you to apply for our Summer 2027 Analyst Cohort at Apex Dynamics Labs.

Position Overview:
- Role: Junior Software / Systems Analyst Intern (Hybrid - Metro Hub)
- Compensation: $24.00 - $28.00 per hour, 40 hours/week, 10-week summer program
- Requirements: Current enrollment in Computer Science, Information Systems, or related degree

Hiring Process:
1. Online application and resume review
2. 30-minute asynchronous technical logic exercise (via HackerRank)
3. Virtual interview with our engineering team
4. Final decisions released by mid-February 2027

To view the complete job specification and submit your resume, please visit our verified careers portal:
https://careers.apexdynamicslabs.example.com/jobs/intern-summer-2027

Apex Dynamics Labs never requests application fees, banking passwords, or personal credentials during our recruitment cycle.

Best regards,
University Relations Team | Apex Dynamics Labs`
  }
];
