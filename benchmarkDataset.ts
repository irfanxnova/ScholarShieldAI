import type { BenchmarkSample } from '../types';

/**
 * ScholarShield AI - Ground-Truth Benchmark Dataset (v1.0.0)
 * Curated collection of diverse, realistic, and non-trivial scholarship, internship,
 * and academic communications for reproducible evaluation.
 *
 * Provenance: Synthetically generated and curated based on university cybersecurity advisories,
 * FTC student scam reports, and authentic collegiate aid circulars.
 * All domains use reserved documentation namespaces (*.example.edu, *.example.org, *.example.com).
 */
export const BENCHMARK_DATASET: BenchmarkSample[] = [
  // ==========================================
  // LEGITIMATE / BENIGN MESSAGES (40 Samples)
  // ==========================================
  {
    id: 'bench-legit-001',
    text: 'From: Financial Aid Office <finaid-notifications@merit.stateuniv.example.edu>\nSubject: 2026-2027 Academic Excellence Undergraduate Scholarship Window Open\nDear Student, The Office of Student Financial Assistance is pleased to announce the opening of the 2026-2027 Academic Excellence Merit Scholarship. Applications must be submitted through your authenticated campus single sign-on (SSO) at https://finaid.portal.stateuniv.example.edu/merit-awards. There is NO application fee or processing fee at any stage. Deadline is November 15, 2026.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_scholarship_announcement',
    tags: ['official_portal', 'no_fee', 'merit_award'],
    annotationRationale: 'Authentic university notification with registered .edu subdomain, explicitly disclaiming fees and using authenticated campus portal.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-merit-univ-01'
  },
  {
    id: 'bench-legit-002',
    text: 'Financial Aid Circular: State University Honors Program Scholarship renewal is now active. Cumulative GPA of 3.6 required. Complete your renewal questionnaire via your Student Center dashboard before December 1st. No payment or bank account details are ever requested.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_scholarship_announcement',
    tags: ['renewal', 'no_fee', 'academic_advisory'],
    annotationRationale: 'Official honors program scholarship renewal through student center with negative credential guard.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-merit-univ-01'
  },
  {
    id: 'bench-legit-003',
    text: 'Subject: Summer 2027 Business Systems Analyst Internship Invitation\nHi there, We reviewed your resume from the Metro Collegiate Career Fair and invite you to apply for our Summer Analyst Cohort at Apex Dynamics Labs. Compensation is $24.00 - $28.00 per hour. Hiring includes resume review, 30-min logic exercise on HackerRank, and virtual team interview. Portal: https://careers.apexdynamicslabs.example.com/jobs/intern-summer-2027. We never request fees or passwords.',
    groundTruth: 'legitimate',
    scenarioCategory: 'corporate_internship_invitation',
    tags: ['career_fair_followup', 'realistic_wage', 'multi_stage'],
    annotationRationale: 'Realistic corporate recruiting invitation with structured multi-stage interview and realistic intern compensation.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-corp-recruitment-01'
  },
  {
    id: 'bench-legit-004',
    text: 'Department of Computer Science: Undergraduate Research Assistantship in Robotics for Spring 2027. $18.50/hour, 12 hours/week. Interested students should submit CV and transcript to prof.hastings@cs.stateuniv.example.edu by October 30. Interviews will be held in Hall 210.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_research_assistantship',
    tags: ['research_assistant', 'faculty_lab', 'on_campus'],
    annotationRationale: 'Standard university research assistant vacancy listing verified campus email and in-person lab location.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-campus-ra-01'
  },
  {
    id: 'bench-legit-005',
    text: 'University Library Services: Federal Work-Study Student Assistant positions open for circulation desk. Apply via campus Work-Study portal: https://workstudy.stateuniv.example.edu/jobs. Open to students with active FAFSA FWS authorization.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_work_study',
    tags: ['work_study', 'fws', 'library'],
    annotationRationale: 'Federal Work-Study student employment posting linked through official university domain.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-workstudy-01'
  },
  {
    id: 'bench-legit-006',
    text: 'Office of the Bursar: Reminder that 1098-T tax statements for 2026 will be available electronically on your Student Account Center starting January 24. Please ensure your mailing address is updated in your profile.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['tax_forms', 'bursar', 'routine_notice'],
    annotationRationale: 'Standard administrative tax notice without urgency, payment demands, or credential requests.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-bursar-admin-01'
  },
  {
    id: 'bench-legit-007',
    text: 'National Science Foundation REU Site: Summer Undergraduate Research in Climate Analytics. $6,000 stipend plus campus housing. Application is completely free to apply at https://climate-reu.nsf-consortium.example.org/apply. Deadline: February 1, 2027.',
    groundTruth: 'legitimate',
    scenarioCategory: 'research_fellowship',
    tags: ['nsf_reu', 'free_application', 'stipend'],
    annotationRationale: 'Authentic-style NSF Research Experience for Undergraduates with standard fellowship stipend and free application.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-nsf-reu-01'
  },
  {
    id: 'bench-legit-008',
    text: 'Career Development Center: Fall Engineering Career Fair registration is open. Over 80 employers attending. Download the fair guide and book employer 1-on-1s on Handshake: https://stateuniv.joinhandshake.example.com. Business casual attire recommended.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_career_services',
    tags: ['career_fair', 'handshake', 'student_services'],
    annotationRationale: 'Standard campus career center event notification pointing to university Handshake instance.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-career-fair-01'
  },
  {
    id: 'bench-legit-009',
    text: 'From: Graduate School Admissions <grad-admissions@stateuniv.example.edu>\nSubject: Information Session: Accelerated 4+1 Master of Science in Data Science\nJoin us on Wednesday at 4:00 PM in Science Center Room 102 or via Zoom for an overview of admissions requirements and curriculum. Free pizza provided.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_advising',
    tags: ['info_session', 'graduate_school', 'on_campus'],
    annotationRationale: 'Routine departmental information session announcement with no high-risk markers.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-academic-info-01'
  },
  {
    id: 'bench-legit-010',
    text: 'Global Education Office: Study Abroad Travel Grant applications for Summer 2027 are open. Up to $2,500 awarded to eligible full-time undergraduates. Submit your statement of purpose and faculty recommendation via https://studyabroad.stateuniv.example.edu/grants.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_scholarship_announcement',
    tags: ['study_abroad', 'travel_grant', 'official_portal'],
    annotationRationale: 'Institutional study abroad grant circular routed through official institutional portal.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-study-abroad-01'
  },
  {
    id: 'bench-legit-011',
    text: 'Department of Mathematics: Peer Tutoring positions available for Calculus I & II for the upcoming semester. Pay is $17.00/hr. Inquire at Math Learning Center in Keller Hall Room 304 or email math-tutoring@stateuniv.example.edu.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_work_study',
    tags: ['peer_tutor', 'math_dept', 'campus_job'],
    annotationRationale: 'Legitimate peer tutoring student employment opportunity with physical office location.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-tutoring-01'
  },
  {
    id: 'bench-legit-012',
    text: 'Dean of Engineering: Congratulations on achieving Dean\'s Honor List recognition for the Spring 2026 term. Certificates can be downloaded from your student portal. No action required.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['deans_list', 'academic_honor', 'no_action'],
    annotationRationale: 'Legitimate academic honor notification with no demands or external links.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-deans-list-01'
  },
  {
    id: 'bench-legit-013',
    text: 'Metro Tech Partners: Software Quality Assurance Co-op (Winter/Spring 2027). Requirements: Familiarity with Python and git. Pay rate $22/hr. Competitive review process includes take-home exercise and pair programming round. Apply: https://metrotech.example.com/coop',
    groundTruth: 'legitimate',
    scenarioCategory: 'corporate_internship_invitation',
    tags: ['co_op', 'competitive_interview', 'reasonable_wage'],
    annotationRationale: 'Authentic co-op posting with technical hiring stages and market-rate student hourly compensation.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-corp-recruitment-02'
  },
  {
    id: 'bench-legit-014',
    text: 'Financial Aid Reminder: FAFSA priority submission deadline is March 1. Submit your federal renewal at https://studentaid.gov. Never pay anyone to fill out your FAFSA; federal application is completely free.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_scholarship_announcement',
    tags: ['fafsa', 'studentaid_gov', 'free_application'],
    annotationRationale: 'Standard university FAFSA advisory linking to official government portal with explicit anti-fee guidance.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-fafsa-01'
  },
  {
    id: 'bench-legit-015',
    text: 'Student Affairs: Campus food pantry volunteer shifts available for Friday afternoon. Sign up on the volunteer portal: https://service.stateuniv.example.edu/pantry. Thank you for supporting fellow students.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['volunteer', 'student_affairs', 'on_campus'],
    annotationRationale: 'Benign student community service announcement.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-volunteer-01'
  },
  {
    id: 'bench-legit-016',
    text: 'College of Arts & Sciences: Undergraduate Conference Travel Award provides up to $600 to present research at national symposia. Submit conference acceptance email and budget estimate to cas-awards@stateuniv.example.edu.',
    groundTruth: 'legitimate',
    scenarioCategory: 'research_fellowship',
    tags: ['travel_award', 'conference', 'budget_reimbursement'],
    annotationRationale: 'Routine departmental travel grant circular with standard institutional reimbursement.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-travel-grant-01'
  },
  {
    id: 'bench-legit-017',
    text: 'Campus Recreation Center: Hiring student intramural referees and lifeguards for Spring semester. CPR training provided free of cost. Information session Tuesday 7:00 PM in Rec Center Room 12.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_work_study',
    tags: ['rec_center', 'student_job', 'free_training'],
    annotationRationale: 'Student job circular explicitly confirming training is provided without charge.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-rec-jobs-01'
  },
  {
    id: 'bench-legit-018',
    text: 'University Writing Center: Peer Writing Consultant applications open. Minimum 3.3 GPA. Required: 5-page analytical writing sample and one faculty reference. Review details at https://writingcenter.stateuniv.example.edu/join.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_work_study',
    tags: ['writing_consultant', 'writing_sample', 'faculty_ref'],
    annotationRationale: 'Legitimate writing consultant role requiring authentic academic vetting.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-writing-center-01'
  },
  {
    id: 'bench-legit-019',
    text: 'Health Sciences Fellowship Committee: 2027 Pre-Med Clinical Shadowing Stipend application window closes December 10. Direct questions to clinical-stipends@stateuniv.example.edu.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_scholarship_announcement',
    tags: ['pre_med', 'clinical_shadowing', 'departmental'],
    annotationRationale: 'Standard pre-med circular with official departmental email contact.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-premed-01'
  },
  {
    id: 'bench-legit-020',
    text: 'Student Life: Campus Blood Drive with American Red Cross on Thursday, November 12 in the Student Union Ballroom from 10:00 AM to 3:00 PM. Schedule your appointment at redcrossblood.example.org.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['blood_drive', 'red_cross', 'public_health'],
    annotationRationale: 'Standard campus blood drive notification.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-blood-drive-01'
  },
  {
    id: 'bench-legit-021',
    text: 'School of Engineering: IEEE Student Branch Hackathon registration is live! 24-hour collaborative challenge. Free admission for university students. Register at https://hackathon.stateuniv.example.edu. Mentors from local tech companies available.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['hackathon', 'ieee', 'free_event'],
    annotationRationale: 'Free collegiate hackathon event registration hosted on verified campus domain.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-hackathon-01'
  },
  {
    id: 'bench-legit-022',
    text: 'Civic Leadership Fellowship: $3,000 summer stipend for community organizing internship with regional non-profit consortium. Requirements: 2.8+ GPA, resume, and 500-word essay. Apply: https://civicleaders.example.org/apply. No application fees.',
    groundTruth: 'legitimate',
    scenarioCategory: 'research_fellowship',
    tags: ['non_profit', 'fellowship', 'no_fee'],
    annotationRationale: 'Authentic non-profit leadership grant with reasonable stipend and no fees.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-civic-01'
  },
  {
    id: 'bench-legit-023',
    text: 'Registrar Alert: Spring semester priority class registration begins Monday at 7:00 AM for graduating seniors. Check your registration time ticket in your student portal. Clear any outstanding library holds.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['registration', 'registrar', 'time_ticket'],
    annotationRationale: 'Routine registration timetable reminder from university registrar.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-registrar-01'
  },
  {
    id: 'bench-legit-024',
    text: 'IT Services Maintenance Notice: Campus Wi-Fi and Single Sign-On services will undergo scheduled security patching this Sunday from 2:00 AM to 5:00 AM. Authenticated sessions will be briefly disconnected.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['maintenance', 'it_security', 'scheduled_downtime'],
    annotationRationale: 'Routine campus IT infrastructure maintenance circular with no requests for user action.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-it-notice-01'
  },
  {
    id: 'bench-legit-025',
    text: 'Undergraduate Biology Symposium: Abstract submissions for poster presentations are open until January 15. Submit your 250-word abstract to bio-symposium@stateuniv.example.edu. Outstanding presentations will receive book vouchers.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_advising',
    tags: ['biology', 'abstract', 'poster_session'],
    annotationRationale: 'Academic symposium call for abstracts with conventional submission guidelines.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-symposium-01'
  },
  {
    id: 'bench-legit-026',
    text: 'Aerospace Systems Labs: Junior Avionics Co-op (Summer 2027). Position pays $26.50/hr in Wichita facility. Candidates must be enrolled in Aerospace or Mechanical Engineering and pass technical phone screen. Portal: https://aerospacesystems.example.com/careers',
    groundTruth: 'legitimate',
    scenarioCategory: 'corporate_internship_invitation',
    tags: ['avionics', 'co_op', 'standard_screen'],
    annotationRationale: 'Realistic aerospace industry internship with technical screening requirements.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-corp-recruitment-03'
  },
  {
    id: 'bench-legit-027',
    text: 'Student Legal Clinic: Free confidential legal advising sessions available for off-campus housing lease reviews. Make an appointment with clinic staff: https://legalclinic.stateuniv.example.edu/appointments.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['legal_clinic', 'lease_review', 'free_service'],
    annotationRationale: 'Free campus student legal services circular.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-legal-clinic-01'
  },
  {
    id: 'bench-legit-028',
    text: 'Women in Tech Scholarship Fund: $2,500 tuition award for female undergraduates in computing. Funded by alumni endowment. Submit transcript and faculty letter at https://wit-endowment.stateuniv.example.edu by April 1. Free to apply.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_scholarship_announcement',
    tags: ['endowment', 'women_in_tech', 'tuition_grant'],
    annotationRationale: 'Alumni-endowed collegiate scholarship announcement hosted on university domain.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-endowment-01'
  },
  {
    id: 'bench-legit-029',
    text: 'Environmental Studies Dept: Urban Garden Coordinator work-study position for Spring. $16.50/hr, 10 hrs/week. Duties: greenhouse management, composting, community workshops. Inquire at Agriculture Hall 104.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_work_study',
    tags: ['urban_garden', 'environmental', 'hourly_job'],
    annotationRationale: 'Campus student agricultural position with physical on-campus reporting location.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-garden-job-01'
  },
  {
    id: 'bench-legit-030',
    text: 'Housing & Residence Life: Resident Assistant (RA) recruitment for the 2027-2028 academic year. Compensation includes room waiver and campus dining allocation. Required group interview in February. Apply: https://reslife.stateuniv.example.edu/ra.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_work_study',
    tags: ['resident_assistant', 'reslife', 'room_board'],
    annotationRationale: 'Standard campus Resident Assistant position with structured institutional selection.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-reslife-01'
  },
  {
    id: 'bench-legit-031',
    text: 'Center for Global Engagement: Fulbright U.S. Student Program workshop on campus. Learn about fully funded international graduate study and research grants. Session held in International Center Lounge, Nov 18, 3 PM.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_advising',
    tags: ['fulbright', 'global_engagement', 'fellowship_prep'],
    annotationRationale: 'Campus prep workshop for prestigious external fellowship with no fees or credential demands.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-fulbright-01'
  },
  {
    id: 'bench-legit-032',
    text: 'University Bookstore: Textbook buyback days begin next week at the main concourse desk. Bring your student ID and course materials to receive cash or store credit.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['bookstore', 'textbook_buyback', 'routine_notice'],
    annotationRationale: 'Routine commercial university bookstore announcement.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-bookstore-01'
  },
  {
    id: 'bench-legit-033',
    text: 'Economics Dept Seminar: Professor Elena Rostova (Harvard University) will present "Algorithmic Pricing in Credit Markets" on Friday at 3:30 PM in Economics Building Auditorium. Reception to follow.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_advising',
    tags: ['guest_lecture', 'economics', 'seminar'],
    annotationRationale: 'Distinguished academic guest lecture invitation.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-seminar-01'
  },
  {
    id: 'bench-legit-034',
    text: 'Alumni Association: Mentorship Match program pairs sophomore and junior students with alumni working in finance, software, and healthcare. Informational intake form: https://alumni.stateuniv.example.edu/mentorship. Deadline Dec 5.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_career_services',
    tags: ['alumni_mentorship', 'career_prep', 'intake_form'],
    annotationRationale: 'Alumni career mentoring circular hosted on verified educational subdomain.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-alumni-mentor-01'
  },
  {
    id: 'bench-legit-035',
    text: 'Campus Counseling Center: Stress Less During Finals week activities! Therapy dog visits, mindfulness drop-in sessions, and free chamomile tea in Student Wellness Center Room 201.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['wellness', 'therapy_dogs', 'student_support'],
    annotationRationale: 'Campus health and wellness event notice.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-wellness-01'
  },
  {
    id: 'bench-legit-036',
    text: 'Chemistry Dept: Lab glassware cleanup and stockroom assistant needed. 8 hrs/week, $16.00/hr. Safety goggles and lab coat provided by department. See stockroom manager in Chemistry Hall Room 112.',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_work_study',
    tags: ['stockroom', 'chemistry', 'hourly_job'],
    annotationRationale: 'Authentic student lab job with departmentally provided safety equipment.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-chem-stock-01'
  },
  {
    id: 'bench-legit-037',
    text: 'Office of Sustainability: Green Campus Innovation Mini-Grants. Up to $1,000 for student-led sustainability campus projects. Review grant guidelines and submit proposals: https://sustainability.stateuniv.example.edu/mini-grants.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_scholarship_announcement',
    tags: ['sustainability', 'mini_grants', 'student_projects'],
    annotationRationale: 'Legitimate student project grant notice on verified university domain.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-sustain-01'
  },
  {
    id: 'bench-legit-038',
    text: 'Career Services Alert: Beware of job scams targeting students! Legitimate employers will never ask you to wire money, purchase training kits, or disclose your student password. Read our defensive guide: https://careercenter.stateuniv.example.edu/safety',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_career_services',
    tags: ['scam_warning', 'career_center', 'defensive_guidance'],
    annotationRationale: 'Defensive advisory notice containing fraud keywords in an explicit educational negative-guard context.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-scam-advisory-01'
  },
  {
    id: 'bench-legit-039',
    text: 'Student Government Association: Spring campus elections voting opens Tuesday morning. Cast your ballot for SGA President and Senators through the secure portal at https://elections.stateuniv.example.edu. Every vote counts!',
    groundTruth: 'legitimate',
    scenarioCategory: 'campus_administrative',
    tags: ['sga', 'elections', 'voting'],
    annotationRationale: 'Student governance election notice hosted on campus server.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-sga-01'
  },
  {
    id: 'bench-legit-040',
    text: 'Physics Colloquium: "Quantum Sensing and Cryogenic Nanodevices" with Dr. Marcus Vance, Physics Department Colloquium series. Refreshments at 3:45 PM in Physics Commons.',
    groundTruth: 'legitimate',
    scenarioCategory: 'academic_advising',
    tags: ['colloquium', 'physics', 'departmental'],
    annotationRationale: 'Benign departmental lecture invitation with faculty speaker.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-physics-01'
  },

  // ==========================================
  // SUSPICIOUS / FRAUDULENT MESSAGES (40 Samples)
  // ==========================================
  {
    id: 'bench-scam-001',
    text: 'CONGRATULATIONS!! You were selected from the national student collegiate database for the 2026 Apex Global Fellowship ($12,000 Disbursement)! To secure your grant before funds are reallocated, mandates a one-time refundable verification fee of $185.00 USD paid via Zelle to compliance-desk@apex.example.com within 24 hours to avoid permanent forfeiture.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['advance_fee', 'zelle', 'urgency', 'unsolicited'],
    annotationRationale: 'Classic advance-fee scholarship fraud demanding refundable fee via P2P rail under arbitrary 24-hour urgency.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-002',
    text: 'Dear Awardee, You have been chosen for the International Future Scholars Grant ($8,500). To release your escrow disbursement packet, our committee requires a refundable registration clearance fee of $120. Pay your verification clearance now to avoid permanent forfeiture.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['advance_fee', 'clearance_fee', 'escrow_demand'],
    annotationRationale: 'Demands upfront registration clearance deposit to release promised grant.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-003',
    text: 'URGENT HIRING: Remote Artificial Intelligence Research Intern ($65.00/hour). NexGen Global Systems is hiring immediately. 100% guaranteed selection upon onboarding! All applicants must acquire the proprietary "NexGen Neural Developer Workstation Suite" from our certified vendor kit link ($249.00). Company will reimburse this on your first pay stub! Telegram: @NexGen_Recruiter_Official',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['guaranteed_internship', 'equipment_purchase', 'telegram', 'implausible_wage'],
    annotationRationale: 'Guaranteed remote placement scam mandating $249 equipment purchase from vendor link with Telegram routing.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-004',
    text: 'Work From Home Student Software Trainee ($70/hr). Guaranteed hiring upon onboarding! To begin setup, all interns must purchase proprietary developer workstation software dongle from vendor kit link. Send receipt to our hiring desk on Telegram.',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['equipment_scam', 'guaranteed_hiring', 'telegram'],
    annotationRationale: 'Guaranteed hiring hook with mandatory trainee software dongle purchase.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-005',
    text: 'Urgent Student Work-Study from Dr. Robert Vance (Department Chair). I need an assistant to help with research document indexing. I am manually registering your student employee profile into the Workday portal right now. Reply immediately with your campus student portal username and password, and when the DUO Mobile 2-Factor push notification appears, reply back with the 6-digit code immediately.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['faculty_impersonation', 'portal_password', 'duo_push', 'otp_theft'],
    annotationRationale: 'Faculty impersonation harvesting campus username, password, and active 2FA DUO authentication code.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-006',
    text: 'Academic Payroll Alert: Due to a payroll server error, your student stipend direct deposit is pending. Please reply with your student portal username and password, and forward your 6-digit SMS verification code to verify your direct deposit.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['payroll_pretext', 'portal_password', 'sms_otp'],
    annotationRationale: 'Direct deposit pretext seeking student single-sign-on credentials and SMS OTP.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-007',
    text: 'National Merit Trust Notification: Congratulations, your profile was selected from the national student collegiate database for an unapplied grant of $15,000. Funds will be reallocated to alternate candidates within 24 hours. Pay verification clearance fee of $95 via Cash App to $MeritClearance.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['unsolicited_selection', 'cash_app', 'urgency', 'forfeiture'],
    annotationRationale: 'Unsolicited grant from generic database demanding Cash App clearance fee under short deadline.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-008',
    text: 'Remote Junior Data Entry Assistant ($55/hour). No interview required, 100% guaranteed selection upon onboarding! To set up direct deposit, reply immediately with your online banking password and debit card PIN.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['bank_credentials', 'guaranteed_placement', 'debit_pin'],
    annotationRationale: 'Guaranteed remote job asking directly for online banking passwords and debit PINs.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-bank-phish'
  },
  {
    id: 'bench-scam-009',
    text: 'University Scholarship Clearinghouse: We have reserved an unclaimed disbursement packet of $7,500 in your name. To release your escrow disbursement packet, pay a refundable processing fee of $150 via Western Union or instant bank wire.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['escrow_release', 'western_union', 'wire_transfer'],
    annotationRationale: 'Advance fee demand disguised as escrow disbursement release using non-traceable wire rails.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-010',
    text: 'Hiring Notice: Executive Virtual Assistant to Department Dean. We will send a cashier check for $3,500 to purchase home office setup. You must deposit the check and wire the surplus funds back to our vendor immediately.',
    groundTruth: 'suspicious',
    scenarioCategory: 'check_overpayment_scam',
    tags: ['counterfeit_check', 'wire_surplus', 'home_office'],
    annotationRationale: 'Classic counterfeit check overpayment scheme instructing student to wire back surplus money.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-check-overpay'
  },
  {
    id: 'bench-scam-011',
    text: 'Immediate hiring: Remote Content Reviewer ($68/hr). 100% guaranteed selection! All communication is handled via Telegram. Message our hiring manager now: Telegram: @ApexHiringTeam. Link: http://apex-recruitment.biz.example.com',
    groundTruth: 'suspicious',
    scenarioCategory: 'suspicious_channel_routing',
    tags: ['telegram', 'biz_tld', 'unencrypted_http', 'guaranteed'],
    annotationRationale: 'Guaranteed hiring directed to Telegram with an unencrypted HTTP link on a disposable .biz TLD.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-telegram-biz'
  },
  {
    id: 'bench-scam-012',
    text: 'URGENT: Campus Student Work-Study spot will be given to the next candidate unless you reply within 24 hours. Closing the semester payroll database today at 5:00 PM. Reply with your student portal username and password.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['urgency', 'forfeiture', 'portal_password'],
    annotationRationale: 'Aggressive psychological urgency combined with student portal password theft.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-013',
    text: 'Collegiate Grant Escrow: An educational grant of $11,000 has been approved. To release your grant disbursement, pay your verification clearance now of $190 in Bitcoin or crypto voucher to wallet 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['crypto_voucher', 'bitcoin', 'advance_fee'],
    annotationRationale: 'Advance fee demand specifying cryptocurrency voucher/bitcoin payment.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-crypto-grant'
  },
  {
    id: 'bench-scam-014',
    text: 'Undergraduate Coding Internship: $65.00/hour flexible schedule. Guaranteed selection upon onboarding test completion! Vendor kit link: http://192.168.1.85/setup to order proprietary workstation kit ($199).',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['raw_ip', 'equipment_kit', 'guaranteed_placement'],
    annotationRationale: 'Kit purchase scam connecting directly to a raw numeric IP address over HTTP.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-015',
    text: 'From: Dr. Alan Turing (Dean of Science). I need an assistant immediately for grading. Reply immediately with your campus portal password and your DUO push verification code so I can approve your hiring before 5:00 PM.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['dean_impersonation', 'duo_push', 'portal_password'],
    annotationRationale: 'Faculty impersonation harvesting both university SSO credentials and DUO 2FA push token.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-016',
    text: 'State Collegiate Fellowship: You have won $9,000. Mandates a one-time refundable verification fee of $160 via Zelle to avoid permanent forfeiture. Complete verification within 24 hours.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['advance_fee', 'zelle', 'forfeiture'],
    annotationRationale: 'Advance fee scholarship fraud coupled with Zelle demand and forfeiture threat.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-017',
    text: 'Student Remote Internship: $60/hr. No interview needed! To formalize your appointment, buy the required proprietary developer workstation suite from vendor kit link: http://bit.ly/intern-kit-order. Reimbursed on first check.',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['shortened_link', 'equipment_fee', 'guaranteed_selection'],
    annotationRationale: 'Candidate kit purchase scam masked with a shortened bit.ly URL and unverified reimbursement promise.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-018',
    text: 'Academic Financial Aid Alert: Unclaimed scholarship funds reference #APX-49102. Pay your registration clearance now to avoid permanent forfeiture: http://stateuniv-financial-aid.temporary-pay.example.org/checkout?id=49102',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['lookalike_domain', 'advance_fee', 'forfeiture'],
    annotationRationale: 'Homograph/lookalike domain attempting to spoof state university financial aid checkout.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-lookalike-phish'
  },
  {
    id: 'bench-scam-019',
    text: 'Research Assistant Position: $40/hr. Send your student account password and username so Professor Miller can set up your campus access badge right now.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['student_password', 'professor_impersonation'],
    annotationRationale: 'Blatant credential harvesting asking for student account password for badge setup.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-020',
    text: 'Collegiate Leadership Award ($14,000). Selected from national student collegiate database. Requires registration fee of $175 via Western Union to compliance desk. Funds are reallocated to alternate candidates within 24 hours.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['advance_fee', 'western_union', 'national_database'],
    annotationRationale: 'Advance fee fraud demanding Western Union transfer to claim an unsolicited award.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-021',
    text: 'Campus Career Job Placement: $65/hr remote coding assistant. 100% guaranteed selection upon onboarding test completion! Contact our hiring team via Telegram: @CampusTechJobs_Recruiter.',
    groundTruth: 'suspicious',
    scenarioCategory: 'unrealistic_guarantee',
    tags: ['telegram', 'implausible_wage', 'guaranteed_selection'],
    annotationRationale: 'Guaranteed hiring hook redirecting student to Telegram for unvetted employment.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-telegram-biz'
  },
  {
    id: 'bench-scam-022',
    text: 'Financial Aid Emergency Disbursement: We have an emergency grant of $2,000 pending. Reply back with the 6-digit code immediately when you receive the DUO Mobile 2-Factor push notification to release funds.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['duo_push', 'otp_theft', 'emergency_grant'],
    annotationRationale: 'Exploits emergency financial assistance pretext to steal DUO push token.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-023',
    text: 'Student Work Opportunity: Earn $500 weekly for 3 hours of errands. We are sending you a cashier check of $2,500. Deduct your $500 pay and send back the remaining $2,000 via Zelle to our supplier.',
    groundTruth: 'suspicious',
    scenarioCategory: 'check_overpayment_scam',
    tags: ['check_scam', 'zelle', 'errands_pretext'],
    annotationRationale: 'Classic student secret shopper / personal assistant check bouncing scam.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-check-overpay'
  },
  {
    id: 'bench-scam-024',
    text: 'Global Fellows Grant Allocation #GF-9941. Your award allocation ($10,000) will be forfeited unless you pay refundable verification fee of $135 to release escrow disbursement packet. Pay via Venmo to @Fellowship-Verification.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['venmo', 'advance_fee', 'escrow_packet'],
    annotationRationale: 'Advance fee scam demanding Venmo transfer to release escrow packet.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-025',
    text: 'Remote Junior Machine Learning Intern ($75.00/hour). Guaranteed selection! Must acquire proprietary developer workstation kit ($280) from vendor kit link: http://nexgen-hardware-dongle.xyz.example.com. Telegram: @ML_Hiring.',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['xyz_tld', 'equipment_fee', 'telegram', 'implausible_wage'],
    annotationRationale: 'Internship kit scam using disposable .xyz TLD, unencrypted HTTP, and Telegram contact.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-026',
    text: 'Campus Administrative Notice: Your student portal account has been flagged for suspension. Reply immediately with your campus portal username & password to prevent immediate cancellation of your enrollment.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['suspension_threat', 'portal_password', 'phishing'],
    annotationRationale: 'Account suspension scare tactic designed to harvest student single sign-on credentials.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-027',
    text: 'Presidential Student Honors Fellowship: You are awarded $13,500. Mandates a one-time refundable verification clearance fee of $175 via instant bank wire within 24 hours to avoid permanent forfeiture.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['bank_wire', 'advance_fee', 'urgency'],
    annotationRationale: 'Advance fee fraud demanding wire transfer within 24 hours under forfeiture threat.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-028',
    text: 'Work Study Placement Alert: Closing the semester payroll database today at 5:00 PM. I am manually registering your student employee profile right now. Reply back with the 6-digit code immediately when DUO notification appears.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['duo_push', 'payroll_pretext', 'urgency'],
    annotationRationale: 'Urgent payroll closing deadline used to trick student into authorizing 2FA push.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-029',
    text: 'Virtual Intern Onboarding: 100% guaranteed selection upon onboarding test completion! Candidate must purchase the proprietary workstation kit from vendor kit link ($225). Payment accepted via gift card or Zelle.',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['gift_card', 'zelle', 'equipment_kit', 'guaranteed'],
    annotationRationale: 'Mandates equipment kit purchase payable via non-refundable gift card or Zelle.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-030',
    text: 'Fellowship Escrow Clearance: Allocation reference #88219 for $12,500. Complete enrollment verification within 24 hours. Pay your verification clearance now of $150 via crypto voucher to avoid permanent forfeiture.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['crypto_voucher', 'advance_fee', 'countdown'],
    annotationRationale: 'Crypto voucher advance fee extraction with artificial 24-hour countdown urgency.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-crypto-grant'
  },
  {
    id: 'bench-scam-031',
    text: 'Urgent Student Employment: Assistant to Department Chair. Reply immediately with your campus student portal username and password so I can log in and submit your direct deposit form.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['portal_password', 'faculty_impersonation', 'direct_deposit'],
    annotationRationale: 'Faculty pretext asking directly for student password to "log in and submit direct deposit".',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-032',
    text: 'Remote Junior Web Assistant ($65/hour). No prior experience required, 100% guaranteed selection! Message recruiter on Telegram: @FastTrack_Recruiting to receive vendor kit link for mandatory software license ($180).',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['telegram', 'software_fee', 'implausible_wage', 'guaranteed'],
    annotationRationale: 'Combination of $65/hr wage hook, Telegram routing, and mandatory software fee.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-033',
    text: 'National Collegiate Grant Council: You have $8,000 waiting in escrow. Release your escrow disbursement packet by paying refundable processing fee of $110 via Western Union. Spot will be given to the next candidate if not paid today.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['western_union', 'advance_fee', 'forfeiture'],
    annotationRationale: 'Escrow release fee scam with Western Union transfer demand.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-034',
    text: 'Campus Bursar Security Alert: Unauthorized access detected on your direct deposit account. Reply back with your online banking password and DUO Mobile 2-Factor push approval immediately to protect your funds.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['banking_password', 'duo_push', 'security_pretext'],
    annotationRationale: 'Bursar security scare pretext attempting to steal bank login and 2FA token.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-bank-phish'
  },
  {
    id: 'bench-scam-035',
    text: 'Remote Systems Intern: Pay is $65.00/hour. Guaranteed selection upon onboarding! Acquire the proprietary "NexGen Neural Developer Workstation Suite" from vendor kit link: http://nexgen-hardware-dongle.biz.example.com. Reimbursed on first pay stub.',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['equipment_kit', 'biz_tld', 'implausible_wage'],
    annotationRationale: 'Workstation suite purchase scam on unencrypted .biz host.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-036',
    text: 'Apex Global Fellows Disbursement: Selected from the national student collegiate database for $12,000. Mandates a one-time refundable verification fee of $185 paid via Zelle to avoid permanent forfeiture within 24 hours.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['advance_fee', 'zelle', 'national_database'],
    annotationRationale: 'Advance fee scam demanding Zelle payment under 24-hour deadline.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-advfee-wire'
  },
  {
    id: 'bench-scam-037',
    text: 'Dean Vance Research Project: I need an assistant today. Closing the semester payroll database today at 5:00 PM. Reply with your student portal username and password, and share your 6-digit SMS code immediately.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['faculty_impersonation', 'portal_password', 'sms_otp'],
    annotationRationale: 'Faculty impersonation with payroll deadline stealing username, password, and SMS OTP.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  },
  {
    id: 'bench-scam-038',
    text: 'Student Grant Escrow Release #9182. To release your grant disbursement of $10,500, pay your verification clearance now of $145 in cryptocurrency vouchers to avoid permanent forfeiture.',
    groundTruth: 'suspicious',
    scenarioCategory: 'scholarship_advance_fee',
    tags: ['crypto_voucher', 'advance_fee', 'forfeiture'],
    annotationRationale: 'Crypto voucher advance fee extraction for fictitious grant escrow release.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-crypto-grant'
  },
  {
    id: 'bench-scam-039',
    text: 'Hiring Remote AI Interns ($65.00/hour). 100% guaranteed selection upon onboarding! All applicants must acquire the proprietary workstation kit from vendor kit link. Chat on WhatsApp: +1-555-019-2831.',
    groundTruth: 'suspicious',
    scenarioCategory: 'internship_equipment_kit',
    tags: ['whatsapp', 'equipment_kit', 'guaranteed_placement'],
    annotationRationale: 'Equipment purchase scam diverting communication to WhatsApp with unrealistically high wage.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-kit-hardware'
  },
  {
    id: 'bench-scam-040',
    text: 'Department Chair Urgent Request: I am manually registering your student employee profile. Reply immediately with your campus student portal username and password, and when the DUO Mobile 2-Factor push notification appears, authorize it immediately.',
    groundTruth: 'suspicious',
    scenarioCategory: 'credential_harvesting',
    tags: ['duo_push', 'portal_password', 'chair_impersonation'],
    annotationRationale: 'Department chair pretext demanding both credentials and immediate DUO push approval.',
    provenance: 'curated_synthetic_collegiate_benchmark',
    splitGroup: 'group-duo-phish'
  }
];

export const BENCHMARK_METADATA = {
  version: '1.0.0',
  totalSamples: BENCHMARK_DATASET.length,
  legitimateCount: BENCHMARK_DATASET.filter((s) => s.groundTruth === 'legitimate').length,
  suspiciousCount: BENCHMARK_DATASET.filter((s) => s.groundTruth === 'suspicious').length,
  provenance: 'Curated synthetic academic cybersecurity benchmark. Fictional entities and reserved domains only.',
  splitStrategy: 'Group-aware deterministic split (prevents template leakage between development and held-out test sets).'
};
