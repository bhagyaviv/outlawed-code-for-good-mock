// =========================================================================
// OUTLAWED INDIA LEGAL-AID PLATFORM - CENTRALIZED MOCK DATASET
// 
// Realistic and clearly marked fictional demo case files and resources.
// Case Status System: 
// 1. Active
// 2. AI Assistance
// 3. Expert Requested
// 4. Awaiting Coordinator Review
// 5. Expert Access Enabled
// 6. Under Expert Review
// 7. Guidance Provided
// 8. Pending Follow-up
// 9. Resolved
// =========================================================================

export const mockCases = [
  {
    id: '1056',
    title: 'Land Inheritance Dispute',
    issueType: 'Land / Property',
    district: 'Mandya',
    location: 'K R Pet, Mandya District',
    language: 'Kannada',
    status: 'Awaiting Coordinator Review', // Mapping to status list
    priority: 'Important',
    mitraId: 'm1',
    mitraName: 'Ananya Rao',
    clientName: 'Gowramma Kempegowda',
    clientPhone: '+91 94480 12345',
    clientAge: 61,
    clientDetails: 'Dispute regarding division of 3.2 acres of dry agricultural land between family siblings following the intestate death of the primary titleholder.',
    situation: 'A family is facing a dispute regarding inheritance of agricultural land after the death of a family member.',
    documents: [
      { id: 'd1', name: 'RTC_Records_1056.pdf', size: '1.8 MB', type: 'PDF', uploadDate: '2026-08-25' },
      { id: 'd2', name: 'Family_Tree_Affidavit.jpg', size: '2.3 MB', type: 'Image', uploadDate: '2026-08-26' }
    ],
    timeline: [
      { date: '2026-08-25', title: 'Case Filed', description: 'Intake form logged by Nyaaya Mitra in Mandya district.', user: 'Ananya Rao' },
      { date: '2026-08-26', title: 'AI Assistant Searched', description: 'Attempted searching legal knowledge repository using natural query.', user: 'Ananya Rao' },
      { date: '2026-08-28', title: 'Expert Requested', description: 'AI guidance evaluated and found insufficient. Sent request to Coordinator.', user: 'Ananya Rao' }
    ],
    notes: [
      { id: 'n1', date: '2026-08-25', author: 'Ananya Rao', text: 'Siblings are disputing a partition verbal agreement done five years ago.' }
    ],
    tasks: [
      { id: 't1', title: 'Obtain certified RTC index from taluk office', done: false, date: '2026-09-02' }
    ],
    guidance: {
      requested: true,
      requestDate: '2026-08-28',
      question: 'Cousins are claiming ownership under a notarized partition sheet. How should we challenge the notary deed since property exceeds Rs 100 in valuation?',
      triedSummary: 'Asked AI, reviewed Case #1021 and Case #987, and checked Inheritance Documentation Guide.',
      unresolvedSummary: 'Need specific guidance on court caveat petitions for notarized partition sheets.',
      priority: 'Important',
      status: 'Awaiting Coordinator Review', // Awaiting Coordinator Review | Expert Access Enabled | Guidance Provided
      expertComments: '',
      expertName: '',
      answerDate: ''
    },
    similarCases: [
      { id: '1021', title: 'Land Inheritance Dispute', similarity: '92%', location: 'Mandya', status: 'Resolved' },
      { id: '987', title: 'Property Dispute', similarity: '87%', location: 'Mysuru', status: 'Resolved' }
    ]
  },
  {
    id: '1042',
    title: 'Domestic Violence Support Request',
    issueType: 'Domestic Violence',
    district: 'Mysuru',
    location: 'Nanjangud Taluk, Mysuru District',
    language: 'Kannada',
    status: 'Under Expert Review', // 'Expert Access Enabled' -> transitioning to 'Under Expert Review'
    priority: 'Urgent',
    mitraId: 'm2',
    mitraName: 'Meena Kumar',
    clientName: 'Sujatha M.',
    clientPhone: '+91 99002 98765',
    clientAge: 32,
    clientDetails: 'Seeking immediate shelter options and protection orders under domestic violence rules. Physical abuse escalated over the past week.',
    situation: 'A person is seeking support related to domestic violence and available assistance resources.',
    documents: [
      { id: 'd3', name: 'Emergency_Medical_Certificate.pdf', size: '1.2 MB', type: 'PDF', uploadDate: '2026-08-24' }
    ],
    timeline: [
      { date: '2026-08-24', title: 'Case Filed', description: 'Intake and medical report recorded.', user: 'Meena Kumar' },
      { date: '2026-08-25', title: 'AI Assistant Searched', description: 'Searched protection officer database and local shelter contacts.', user: 'Meena Kumar' },
      { date: '2026-08-26', title: 'Expert Requested', description: 'Requested expert review on filing interim ex-parte residence orders.', user: 'Meena Kumar' },
      { date: '2026-08-27', title: 'Expert Access Enabled', description: 'Coordinator Vikram Sen approved escalation and assigned Dr. Priya Sharma.', user: 'Vikram Sen' }
    ],
    notes: [
      { id: 'n2', date: '2026-08-24', author: 'Meena Kumar', text: 'Client has been moved to a temporary shelter. Police NCR registered.' }
    ],
    tasks: [
      { id: 't2', title: 'Accompany client to Protection Officer appointment', done: true, date: '2026-08-27' },
      { id: 't3', title: 'Draft petition for interim maintenance support', done: false, date: '2026-09-01' }
    ],
    guidance: {
      requested: true,
      requestDate: '2026-08-26',
      question: 'How do we obtain an emergency shelter allocation under Section 19 of the DV Act immediately before the formal magistrate hearing?',
      triedSummary: 'AI Assistant provided general information and DV handbook.',
      unresolvedSummary: 'Need immediate templates for local protection officer escalation in Mysuru district.',
      priority: 'Urgent',
      status: 'Expert Access Enabled',
      expertComments: '',
      expertName: 'Dr. Priya Sharma',
      answerDate: ''
    },
    similarCases: []
  },
  {
    id: '1038',
    title: 'Government Scheme Documentation',
    issueType: 'Government Scheme',
    district: 'Tumakuru',
    location: 'Kunigal Taluk, Tumakuru District',
    language: 'Hindi',
    status: 'Resolved',
    priority: 'Normal',
    mitraId: 'm3',
    mitraName: 'Rahul Verma',
    clientName: 'Devappa Ramappa',
    clientPhone: '+91 81234 56789',
    clientAge: 69,
    clientDetails: 'Sandhya Suraksha pension registration query. Name spelled differently on family card vs Aadhaar card causing verification failure.',
    situation: 'A community member needs help understanding required documentation for a government welfare scheme.',
    documents: [],
    timeline: [
      { date: '2026-08-18', title: 'Case Intake', description: 'Rahul Verma recorded client mismatch in pension file.', user: 'Rahul Verma' },
      { date: '2026-08-19', title: 'AI Assistant Used', description: 'Searched for spelling mismatch directives. AI recommended revenue affidavit template.', user: 'Rahul Verma' },
      { date: '2026-08-21', title: 'Affidavit Filed', description: 'Affidavit approved by local Tehsildar. Pension application resolved.', user: 'Rahul Verma' }
    ],
    notes: [
      { id: 'n3', date: '2026-08-19', author: 'Rahul Verma', text: 'AI query recommended submitting GP certificate, which Tehsildar accepted.' }
    ],
    tasks: [],
    guidance: {
      requested: false,
      question: '',
      priority: 'Normal',
      status: 'Case Continued',
      expertComments: '',
      expertName: '',
      answerDate: ''
    },
    similarCases: []
  },
  {
    id: '1071',
    title: 'Employment Documentation Dispute',
    issueType: 'Employment',
    district: 'Bengaluru',
    location: 'Peenya Industrial Area, Bengaluru District',
    language: 'English',
    status: 'Pending Follow-up',
    priority: 'Normal',
    mitraId: 'm4',
    mitraName: 'Kiran Das',
    clientName: 'Manjunath Swamy',
    clientPhone: '+91 70191 23456',
    clientAge: 40,
    clientDetails: 'Unpaid salary for three months at local fabrication unit. Employer withholding original trade certificates as penalty for leaving service.',
    situation: 'A worker requires support related to employment documentation.',
    documents: [],
    timeline: [
      { date: '2026-08-27', title: 'Intake Registered', description: 'Kiran Das documented wages ledger and withheld certificate facts.', user: 'Kiran Das' },
      { date: '2026-08-28', title: 'AI Assistant Searched', description: 'AI recommended demand notice layout under Payment of Wages Act.', user: 'Kiran Das' }
    ],
    notes: [],
    tasks: [
      { id: 't4', title: 'Serve formal letter of wage demand to fabricator manager', done: false, date: '2026-09-03' }
    ],
    guidance: {
      requested: false,
      question: '',
      priority: 'Normal',
      status: 'AI Assistance',
      expertComments: '',
      expertName: '',
      answerDate: ''
    },
    similarCases: []
  }
];

export const mockNyaayaMitras = [
  {
    id: 'm1',
    name: 'Ananya Rao',
    email: 'ananya.rao@outlawed.org',
    district: 'Mandya',
    activeCases: 1,
    completedCases: 19,
    pendingFollowUps: 1,
    overdueCases: 0,
    status: 'Active',
    joinedDate: '2025-01-10'
  },
  {
    id: 'm2',
    name: 'Meena Kumar',
    email: 'meena.kumar@outlawed.org',
    district: 'Mysuru',
    activeCases: 1,
    completedCases: 12,
    pendingFollowUps: 1,
    overdueCases: 0,
    status: 'Active',
    joinedDate: '2025-04-15'
  },
  {
    id: 'm3',
    name: 'Rahul Verma',
    email: 'rahul.verma@outlawed.org',
    district: 'Tumakuru',
    activeCases: 0,
    completedCases: 28,
    pendingFollowUps: 0,
    overdueCases: 0,
    status: 'Active',
    joinedDate: '2024-08-20'
  },
  {
    id: 'm4',
    name: 'Kiran Das',
    email: 'kiran.das@outlawed.org',
    district: 'Bengaluru',
    activeCases: 1,
    completedCases: 15,
    pendingFollowUps: 1,
    overdueCases: 0,
    status: 'Active',
    joinedDate: '2025-05-18'
  }
];

export const mockKnowledgeResults = [
  {
    id: 'k1021',
    title: 'Compulsory Registration of Partition Deeds',
    category: 'Land / Property',
    similarity: '92%',
    summary: 'A partition deed concerning agricultural land exceeding Rs. 100 in value must be registered under Section 17 of the Registration Act, 1908. Notarized division papers have zero legal title standing in partitions.',
    citation: 'Section 17, Registration Act, 1908; Supreme Court of India in Suraj Lamp & Industries case.',
    resourceType: 'Statute / Case Reference',
    district: 'Mandya'
  },
  {
    id: 'k987',
    title: 'Title Suit Caveat Petitions in Property Disputes',
    category: 'Land / Property',
    similarity: '87%',
    summary: 'How to block siblings from claiming unilateral ex-parte partition decree under Section 148A of the Code of Civil Procedure.',
    citation: 'Section 148A, Code of Civil Procedure, 1908.',
    resourceType: 'Legal Guide',
    district: 'Mysuru'
  },
  {
    id: 'k_guide',
    title: 'Inheritance Documentation Guide',
    category: 'Land / Property',
    similarity: 'High',
    summary: 'Checklist of necessary documents to establish title: registered deeds, municipal taxes, survival certificates, and sub-registrar verification protocols.',
    citation: 'Organizational Legal-Aid Handbooks, 2025.',
    resourceType: 'Suggested Resource',
    district: 'All Districts'
  }
];

export const mockInsights = {
  issueDistributions: [
    { name: 'Land / Property', count: 42 },
    { name: 'Domestic Violence', count: 28 },
    { name: 'Employment', count: 21 },
    { name: 'Documentation', count: 18 },
    { name: 'Family', count: 14 }
  ],
  trends: [
    { district: 'Mandya', cases: 42, alert: 'Land-related cases have increased in Mandya over the last 4 weeks.' },
    { district: 'Mysuru', cases: 28, alert: 'Increase in domestic violence counseling reporting in rural Mysore taluks.' },
    { district: 'Tumakuru', cases: 18, alert: 'Successful resolution of pension verification schemes in Kunigal.' },
    { district: 'Bengaluru', cases: 21, alert: 'Wages withholding issues tracked in industrial sectors.' }
  ]
};

export const mockActivities = [
  { id: 'act1', action: 'Created case #1056 "Land Inheritance Dispute"', user: 'Ananya Rao', role: 'Nyaaya Mitra', time: '10 mins ago', district: 'Mandya' },
  { id: 'act2', action: 'Searched AI Assistant for Case #1056', user: 'Ananya Rao', role: 'Nyaaya Mitra', time: '20 mins ago', district: 'Mandya' },
  { id: 'act3', action: 'Escalated Case #1056 to Coordinator review', user: 'Ananya Rao', role: 'Nyaaya Mitra', time: '25 mins ago', district: 'Mandya' },
  { id: 'act4', action: 'Enabled Legal Expert access for Case #1042', user: 'Vikram Sen', role: 'Coordinator', time: '1 hour ago', district: 'Mysuru' },
  { id: 'act5', action: 'Resolved Case #1038 using AI template', user: 'Rahul Verma', role: 'Nyaaya Mitra', time: '1 day ago', district: 'Tumakuru' }
];
