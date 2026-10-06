import {
  CompanyInfo,
  SecurityService,
  User,
  JobVacancy,
  JobApplication,
  QuoteRequest,
  Appointment,
  Inquiry,
  LeaveRequest,
  Testimonial,
  NewsUpdate,
  AuditLog,
  Notification,
  UserActivity,
  FormalQuotation,
  FormalInvoice,
  QuotationBrandingSettings,
  QuotationNumberingConfig,
  InvoiceNumberingConfig,
  UploadedDocument
} from '../types';

export const INITIAL_COMPANY_INFO: CompanyInfo = {
  name: "SUMICH SOLUTIONS LIMITED",
  tagline: "Your Security, Our Commitment.",
  phones: ["0117 230 136", "0735 229 229"],
  emergencyHotline: "0735 229 229",
  email: "info@sumichsecurity.com",
  physicalAddress: "Vision Plaza, 3rd Floor, Office No. 17B, Mombasa Road",
  postalAddress: "P.O. Box 59140 - 00200, Nairobi, Kenya",
  psraLicenseNumber: "PSRA/REG/KEN/2023/0488",
  registrationNumber: "CPR/2023/108422",
  kraPin: "P051928471Z",
  vatNumber: "051928471-V",
  website: "www.sumichsecurity.com",
  workingHours: "24/7 Operations Command & 8:00 AM - 5:00 PM Office Hours",
  socials: {
    facebook: "https://facebook.com/sumichsecurity",
    twitter: "https://twitter.com/sumichsecurity",
    linkedin: "https://linkedin.com/company/sumich-solutions-limited"
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: "usr-admin-01",
    name: "Kennedy Omondi",
    email: "admin@sumichsecurity.com",
    role: "admin",
    subRole: "super_admin",
    status: "active",
    phone: "0735 229 229",
    idNumber: "24890123",
    location: "Nairobi Headquarters",
    createdAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "usr-admin-02",
    name: "Beatrice Chebet",
    email: "recruitment@sumichsecurity.com",
    role: "admin",
    subRole: "recruitment_officer",
    status: "active",
    phone: "0117 230 136",
    idNumber: "28912304",
    location: "Mombasa Road Operations",
    createdAt: "2026-02-01T09:30:00Z"
  },
  {
    id: "usr-admin-03",
    name: "Major (Rtd) Daniel Kiprono",
    email: "operations@sumichsecurity.com",
    role: "admin",
    subRole: "operations_officer",
    status: "active",
    phone: "0722 456 789",
    idNumber: "18944512",
    location: "Command Center, Vision Plaza",
    createdAt: "2026-02-10T10:00:00Z"
  },
  {
    id: "usr-client-01",
    name: "James Mwangi",
    email: "james.mwangi@kenyaenterprises.co.ke",
    role: "client",
    status: "active",
    phone: "0711 987 654",
    company: "Apex Commercial Logistics Kenya",
    location: "Industrial Area, Nairobi",
    createdAt: "2026-03-01T11:00:00Z"
  },
  {
    id: "usr-seeker-01",
    name: "Faith Wanjiku",
    email: "faith.wanjiku@gmail.com",
    role: "jobseeker",
    status: "active",
    phone: "0790 321 654",
    idNumber: "32145678",
    location: "Embakasi, Nairobi",
    createdAt: "2026-03-10T14:20:00Z"
  },
  {
    id: "usr-guard-01",
    name: "Cpl. Peter Otieno",
    email: "guard.otieno@sumichsecurity.com",
    role: "guard",
    status: "active",
    phone: "0745 112 233",
    idNumber: "29871144",
    serviceNumber: "SUM-GD-1042",
    deploymentSite: "Vision Plaza Commercial Complex - Main Gate & Barrier",
    location: "Mombasa Road, Nairobi",
    createdAt: "2026-01-20T07:00:00Z"
  }
];

export const INITIAL_SERVICES: SecurityService[] = [
  {
    id: "srv-01",
    title: "Security Guarding Services",
    category: "Physical Guarding",
    shortDescription: "Licensed, disciplined and alert security personnel delivering dependable protection for premises across Kenya.",
    fullDescription: "Sumich Solutions provides vetted and rigorously trained guarding personnel to protect your people, assets, and operational environments. Every guard is registered with the Private Security Regulatory Authority (PSRA) and trained in emergency preparedness.",
    features: [
      "PSRA compliant and certified personnel",
      "Rigorous background checks & Certificate of Good Conduct",
      "24/7 Field Supervisory patrol check-ins",
      "Regular physical fitness and customer service drills"
    ],
    idealFor: "Commercial establishments, residential estates, retail parks and corporate buildings.",
    icon: "Shield",
    active: true
  },
  {
    id: "srv-02",
    title: "Corporate Security",
    category: "Specialized Protection",
    shortDescription: "Tailored corporate defense, executive reception protocol, and corporate asset safeguarding.",
    fullDescription: "Our corporate security officers are specifically trained in modern executive front-office etiquette, discreet threat mitigation, access credentialing, and confidentiality for multinational headquarters and financial institutions.",
    features: [
      "Polished corporate attire and courteous demeanour",
      "Electronic visitor badge check-in systems",
      "Discreet floor patrols and server room access management",
      "Confidentiality & NDA compliance"
    ],
    idealFor: "Bank headquarters, diplomatic missions, NGO offices, and corporate headquarters.",
    icon: "Building2",
    active: true
  },
  {
    id: "srv-03",
    title: "Residential Security",
    category: "Physical Guarding",
    shortDescription: "Peace of mind for families, gated communities, private villas, and apartment complexes.",
    fullDescription: "Complete residential security solutions ranging from perimeter fence monitoring, visitor screening, and alarm response to dedicated gate barrier wardens. We safeguard families and property 24 hours a day.",
    features: [
      "Visitor pre-clearance and vehicle inspection",
      "Perimeter fence electronic sensor checks",
      "Quiet night patrols and canine deployment options",
      "Immediate panic-alarm escalation"
    ],
    idealFor: "Gated communities, private homes in Karen, Runda, Lavington, Kilimani, and housing cooperatives.",
    icon: "Home",
    active: true
  },
  {
    id: "srv-04",
    title: "Commercial & Industrial Security",
    category: "Physical Guarding",
    shortDescription: "High-vigilance asset protection for manufacturing plants, warehouses, and logistics hubs.",
    fullDescription: "Industrial theft and pilferage require tactical gate controls, weighbridge audits, delivery vehicle searches, and perimeter watchmen. Sumich guards prevent shrinkages and safeguard raw materials around the clock.",
    features: [
      "Weighbridge and cargo manifest verification",
      "Worker bag search and biometric turnstile monitoring",
      "Hazardous area containment and fire marshal wardens",
      "Internal theft deterrence protocols"
    ],
    idealFor: "Warehouses along Mombasa Road, Industrial Area factories, import logistics depots.",
    icon: "Factory",
    active: true
  },
  {
    id: "srv-05",
    title: "Manned Guarding",
    category: "Physical Guarding",
    shortDescription: "Disciplined uniform guard deployment with active electronic patrol wand verification.",
    fullDescription: "Our manned guarding deployment includes real-time guard tour wand systems (RFID checkpoints), ensuring your guards actively patrol perimeter routes at scheduled intervals without sleep lapses.",
    features: [
      "Real-time RFID patrol wand logging",
      "Supervisor inspection teams with mobile vehicles",
      "Incident logging book & digital daily situation reports (SITREPs)",
      "Strict zero-tolerance alcohol/substance policy"
    ],
    idealFor: "Construction sites, logistics yards, educational institutions and retail malls.",
    icon: "UserCheck",
    active: true
  },
  {
    id: "srv-06",
    title: "Event Security",
    category: "Specialized Protection",
    shortDescription: "Crowd management, perimeter fencing control, and VIP handling for high-attendance functions.",
    fullDescription: "Comprehensive safety planning for corporate AGMs, sports fixtures, exhibitions, concerts, and private functions. We manage access points, de-escalate disturbances, and ensure emergency evacuation compliance.",
    features: [
      "Handheld metal detector and walkthrough scanner arches",
      "Crowd control barriers & bag search lanes",
      "VIP backstage escorting & stage cordon",
      "Liaison with National Police Service (NPS)"
    ],
    idealFor: "KICC events, corporate summits, product launches, festivals and sports tournaments.",
    icon: "CalendarCheck",
    active: true
  },
  {
    id: "srv-07",
    title: "Access Control",
    category: "Electronic Security",
    shortDescription: "Physical and electronic management of authorized personnel and vehicle ingress.",
    fullDescription: "Prevent unauthorized entry with integrated access solutions, including biometric scanners, boom barriers, spike barriers, turnstiles, and RFID card issuance.",
    features: [
      "Vehicle undercarriage inspection mirrors and scanners",
      "Automatic boom barriers & spike barriers",
      "Digital visitor log tablet integration",
      "Intercom and smart gate automation"
    ],
    idealFor: "Office parks, embassy compounds, logistics terminals, and multi-tenant high-rises.",
    icon: "KeyRound",
    active: true
  },
  {
    id: "srv-08",
    title: "Reception Security",
    category: "Specialized Protection",
    shortDescription: "Concierge-level hospitality combined with professional front-line threat screening.",
    fullDescription: "First impressions matter. Our reception security personnel balance a warm, hospitable welcome for legitimate guests with sharp, vigilant verification of identity and baggage.",
    features: [
      "Professional front-desk customer relations",
      "Package and courier delivery logging and x-ray screening",
      "CCTV desk monitor observation",
      "Emergency panic button at reception console"
    ],
    idealFor: "Legal firms, multinational offices, medical complexes, and luxury hotel lobbies.",
    icon: "Briefcase",
    active: true
  },
  {
    id: "srv-09",
    title: "Patrol Services",
    category: "Physical Guarding",
    shortDescription: "Mobile motorized surveillance units providing intermittent checks and deterrent presence.",
    fullDescription: "For clients not requiring permanent 24-hour guards, our motorized patrol cars and motorcycle units make random, randomized high-visibility checks, inspect locks, and respond to trigger events.",
    features: [
      "Marked patrol vehicles equipped with GPS tracking",
      "Scheduled and random site visits day and night",
      "Premises exterior physical lock and window verification",
      "Sign-in proof left at designated client key-box"
    ],
    idealFor: "Retail strips, closed warehouses after-hours, construction sites, and remote utilities.",
    icon: "Car",
    active: true
  },
  {
    id: "srv-10",
    title: "CCTV Monitoring & Surveillance",
    category: "Electronic Security",
    shortDescription: "24/7 video command center surveillance with AI motion tracking and incident escalation.",
    fullDescription: "We design, install, maintain, and remotely monitor IP cameras and digital video recorders. Our central command center in Vision Plaza continuously tracks feeds and dispatches ground teams upon suspicious motion.",
    features: [
      "High-definition night vision IP camera arrays",
      "Continuous live command center video wall observation",
      "Off-site encrypted cloud recording and evidence retrieval",
      "Immediate mobile patrol dispatch upon perimeter breach"
    ],
    idealFor: "Jewelry stores, fuel stations, banks, distribution hubs, and high-value compounds.",
    icon: "Camera",
    active: true
  },
  {
    id: "srv-11",
    title: "Security Risk Assessment",
    category: "Consultancy",
    shortDescription: "In-depth threat audits, vulnerability assessments, and security compliance roadmaps.",
    fullDescription: "Our senior security consultants conduct comprehensive site surveys to identify vulnerabilities, assess physical architectural risks, evaluate existing protocols, and supply actionable mitigation plans.",
    features: [
      "Complete site security survey & vulnerability matrix",
      "Emergency evacuation and disaster recovery planning",
      "PSRA statutory compliance auditing",
      "Cost-benefit electronic vs physical security recommendations"
    ],
    idealFor: "New property acquisitions, industrial expansions, insurance compliance, and NGOs.",
    icon: "FileSearch",
    active: true
  },
  {
    id: "srv-12",
    title: "Parking & Traffic Control",
    category: "Physical Guarding",
    shortDescription: "Orderly vehicle flow, parking bay management, and anti-vandalism vehicle protection.",
    fullDescription: "Smooth traffic flow prevents congestion and minimizes vehicular theft. Our parking wardens direct vehicles, enforce reserved spaces, prevent fender-benders, and protect customer cars from break-ins.",
    features: [
      "Ticketing and automated parking management",
      "Clear direction marshals with high-vis reflective gear",
      "Continuous vehicle bay anti-tampering patrols",
      "Clearance of fire escape routes and loading zones"
    ],
    idealFor: "Shopping malls, hospitals, entertainment venues, and corporate towers.",
    icon: "Navigation",
    active: true
  },
  {
    id: "srv-13",
    title: "Alarm Response",
    category: "Electronic Security",
    shortDescription: "Rapid tactical intervention upon electronic intrusion, panic, or fire alarm activation.",
    fullDescription: "Seconds count during a burglary or hold-up. When your alarm triggers, our 24/7 control center dispatches the nearest armed backup and tactical rapid response vehicle to secure the scene.",
    features: [
      "Sub-10 minute average response time within Nairobi coverage zones",
      "Trained tactical officers equipped with defensive gear",
      "Radio telecommunication link with police command",
      "Post-incident property securing and investigation report"
    ],
    idealFor: "Commercial premises, residential homes, pharmacies, and high-risk facilities.",
    icon: "BellRing",
    active: true
  },
  {
    id: "srv-14",
    title: "Executive / VIP Personal Protection",
    category: "Specialized Protection",
    shortDescription: "Close protection officers (CPOs) and armored transport for dignitaries and high-net-worth individuals.",
    fullDescription: "Discreet, highly trained bodyguards with advanced tactical driving, evasive maneuvering, threat anticipation, and medical first-responder skills for dignitaries, diplomats, and visiting executives.",
    features: [
      "Ex-military / National Police special unit close protection experts",
      "Route reconnaissance and safe-house contingency plans",
      "Discreet plain-clothes or formal diplomatic escort",
      "JKIA airport tarmac VIP pick-up and escort services"
    ],
    idealFor: "Visiting delegations, corporate executives, foreign investors, and high-profile individuals.",
    icon: "Award",
    active: true
  }
];

export const INITIAL_VACANCIES: JobVacancy[] = [
  {
    id: "vac-01",
    title: "Professional Security Guard",
    department: "Guarding Operations",
    location: "Nairobi / Mombasa Road Corridor",
    jobType: "Shift-Based",
    salaryRange: "KES 22,000 - KES 28,000 + Benefits",
    summary: "Seeking disciplined, honest and physically fit male and female security officers for corporate and commercial deployment along Mombasa Road and Nairobi environs.",
    responsibilities: [
      "Conduct access control, visitor screening, and vehicle searches at designated gates",
      "Patrol compound perimeters using RFID tour guard wand systems",
      "Report irregularities, incidents, and maintenance faults to the Field Supervisor",
      "Maintain legible visitor and vehicle entry logbooks",
      "Act as first responder during fire alarms or medical emergencies"
    ],
    requirements: [
      "Valid National ID Card (Kenya Citizen aged 22 - 40 years)",
      "Valid Certificate of Good Conduct (not older than 6 months)",
      "KCSE Certificate with minimum grade D+ and above",
      "Height: Male 5ft 8in+, Female 5ft 5in+",
      "PSRA Guard Force Number or willingness to register with PSRA",
      "Prior NYS or security experience is a distinct advantage"
    ],
    status: "published",
    deadline: "2026-10-31",
    vacanciesCount: 15,
    createdAt: "2026-03-01T08:00:00Z"
  },
  {
    id: "vac-02",
    title: "Corporate Front-Desk Security Officer",
    department: "Corporate Division",
    location: "Westlands / Upper Hill, Nairobi",
    jobType: "Full-Time",
    salaryRange: "KES 28,000 - KES 35,000",
    summary: "Sumich Solutions requires eloquent, well-groomed corporate security officers for tier-1 office towers and embassies.",
    responsibilities: [
      "Welcome visitors with polished corporate hospitality and professional demeanor",
      "Screen visitor credentials and manage biometric access badge printing",
      "Monitor lobby CCTV screens and elevator access permissions",
      "Enforce facility visitor rules and manage courier parcel intakes"
    ],
    requirements: [
      "Diploma or Certificate in Criminology, Hospitality, or Security Management",
      "Fluent spoken and written English and Kiswahili",
      "Minimum 2 years experience in corporate reception or 5-star hotel security",
      "Computer literacy (MS Office, visitor management software)",
      "Valid Certificate of Good Conduct"
    ],
    status: "published",
    deadline: "2026-10-25",
    vacanciesCount: 4,
    createdAt: "2026-03-05T09:00:00Z"
  },
  {
    id: "vac-03",
    title: "CCTV Control Room Operator",
    department: "Electronic Surveillance",
    location: "Vision Plaza Command Center, Mombasa Road",
    jobType: "Shift-Based",
    salaryRange: "KES 32,000 - KES 42,000",
    summary: "Stationed in our central 24/7 command room to actively monitor camera feeds, dispatch mobile response units, and prepare incident reports.",
    responsibilities: [
      "Monitor multi-screen video wall for security breaches, fire, or suspicious loitering",
      "Coordinate mobile patrol vehicle dispatch via VHF two-way radio",
      "Back up critical video evidence and compile daily operations SITREPs",
      "Conduct daily video camera health checks and ping status verification"
    ],
    requirements: [
      "Certificate or Diploma in IT, Telecommunications, or CCTV Operations",
      "Demonstrated experience with Milestone, Hikvision, or Dahua VMS",
      "Sharp observation, multitasking, and radio voice protocol skills",
      "Willingness to work night and weekend rotational shifts"
    ],
    status: "published",
    deadline: "2026-10-15",
    vacanciesCount: 2,
    createdAt: "2026-03-10T11:00:00Z"
  },
  {
    id: "vac-04",
    title: "Mobile Patrol Driver / Response Officer",
    department: "Tactical Response",
    location: "Nairobi Industrial Area & Mombasa Road",
    jobType: "Shift-Based",
    salaryRange: "KES 30,000 - KES 38,000",
    summary: "Operate emergency patrol vehicles, respond to client alarm activations, and conduct supervisor audits across guarding posts.",
    responsibilities: [
      "Drive patrol response vehicle swiftly and safely under emergency protocols",
      "Conduct spot checks on guards on duty and inspect premises boundaries",
      "Respond immediately to alarm signals within allotted response times",
      "Liaise with National Police officers during severe security incidents"
    ],
    requirements: [
      "Clean Kenyan Driving License (Class B, C, or BCE) with at least 4 years experience",
      "Valid Defensive Driving Certificate from AA Kenya or equivalent",
      "Prior experience in armed or tactical security response",
      "Valid Certificate of Good Conduct"
    ],
    status: "published",
    deadline: "2026-11-05",
    vacanciesCount: 3,
    createdAt: "2026-03-12T13:00:00Z"
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-01",
    vacancyId: "vac-01",
    vacancyTitle: "Professional Security Guard",
    userId: "usr-seeker-01",
    fullName: "Faith Wanjiku",
    email: "faith.wanjiku@gmail.com",
    phone: "0790 321 654",
    idNumber: "32145678",
    location: "Embakasi, Nairobi",
    education: "KCSE Grade C- (2020), Embakasi Secondary School",
    professionalQualifications: "NYS Basic Training Certificate (2022), St. John Ambulance First Aid Level 1",
    workExperience: "2 years as security officer at Gateway Mall Nairobi. Gate screening and customer escorting.",
    positionAppliedFor: "Professional Security Guard",
    cvFileName: "Faith_Wanjiku_CV_2026.pdf",
    supportingDocName: "Certificate_Good_Conduct_2026.pdf",
    status: "under_review",
    adminNotes: "Good background with NYS discipline certificate. Shortlisted for physical drills.",
    interviewDate: "2026-10-10T10:00:00Z",
    createdAt: "2026-03-15T09:45:00Z"
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "lev-01",
    guardId: "usr-guard-01",
    guardName: "Cpl. Peter Otieno",
    guardServiceNumber: "SUM-GD-1042",
    deploymentSite: "Vision Plaza Commercial Complex - Main Gate",
    leaveType: "Annual Leave",
    startDate: "2026-10-15",
    endDate: "2026-10-22",
    daysCount: 7,
    reason: "Scheduled family annual leave travel to Kisumu county.",
    reliefGuard: "Guard Samuel Kiptoo (SUM-GD-1088)",
    status: "pending",
    createdAt: "2026-09-25T14:30:00Z"
  },
  {
    id: "lev-02",
    guardId: "usr-guard-01",
    guardName: "Cpl. Peter Otieno",
    guardServiceNumber: "SUM-GD-1042",
    deploymentSite: "Vision Plaza Commercial Complex - Main Gate",
    leaveType: "Off-Duty Rotation",
    startDate: "2026-09-10",
    endDate: "2026-09-12",
    daysCount: 2,
    reason: "Compensatory rest off-duty after 14-day night shift marathon.",
    reliefGuard: "Guard Dennis Muthomi",
    status: "approved",
    approvedBy: "Major Daniel Kiprono (Operations)",
    adminNotes: "Approved. Relief guard verified and briefed.",
    createdAt: "2026-09-08T09:15:00Z"
  },
  {
    id: "lev-03",
    guardId: "usr-guard-01",
    guardName: "Cpl. Peter Otieno",
    guardServiceNumber: "SUM-GD-1042",
    deploymentSite: "Vision Plaza Commercial Complex - Main Gate",
    leaveType: "Emergency Leave",
    startDate: "2026-08-01",
    endDate: "2026-08-03",
    daysCount: 2,
    reason: "Urgent medical checkup at Kenyatta National Hospital.",
    reliefGuard: "Guard Moses Korir",
    status: "approved",
    approvedBy: "Major Daniel Kiprono (Operations)",
    adminNotes: "Approved with medical certificate attached.",
    createdAt: "2026-07-30T16:00:00Z"
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: "quot-01",
    userId: "usr-client-01",
    name: "James Mwangi",
    company: "Apex Commercial Logistics Kenya",
    email: "james.mwangi@kenyaenterprises.co.ke",
    phone: "0711 987 654",
    serviceType: "Commercial & Industrial Security",
    location: "Mombasa Road, Godown No. 14, Nairobi",
    preferredDate: "2026-10-15",
    securityRequirements: "Need 6 day guards, 4 night guards, and 1 supervisor with RFID tour wands for our 2-acre container transit depot.",
    message: "Immediate handover preferred as our existing security contract expires mid next month.",
    estimatedBudget: "KES 240,000 / month",
    status: "under_review",
    adminNotes: "Survey completed by Major Kiprono. Proposal draft sent for 10-guard package.",
    createdAt: "2026-03-12T11:20:00Z"
  },
  {
    id: "quot-02",
    name: "Sarah Kimani",
    company: "Greenfield Residential Estate HOA",
    email: "sarah.k@greenfieldestate.or.ke",
    phone: "0720 555 444",
    serviceType: "Residential Security",
    location: "Syokimau, Machakos County",
    preferredDate: "2026-11-01",
    securityRequirements: "Gated estate with 84 homes. Requires barrier entrance manned security, visitor log tablets, and night mobile patrol backup.",
    estimatedBudget: "KES 180,000 / month",
    status: "pending",
    adminNotes: "Site risk assessment booking pending phone confirmation.",
    createdAt: "2026-03-20T15:00:00Z"
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-01",
    userId: "usr-client-01",
    name: "James Mwangi",
    email: "james.mwangi@kenyaenterprises.co.ke",
    phone: "0711 987 654",
    preferredDate: "2026-10-05",
    preferredTime: "10:30 AM",
    purpose: "Contract Signing & Operational SLA Review",
    message: "Meeting with Sumich Operations Director at Vision Plaza office.",
    meetingLocation: "Sumich HQ, Vision Plaza, 3rd Floor, Suite 17B, Mombasa Road",
    status: "scheduled",
    adminNotes: "Conference room reserved. Major Kiprono and Kennedy Omondi to attend.",
    createdAt: "2026-03-18T10:00:00Z"
  },
  {
    id: "apt-02",
    name: "Dr. Evans Ombati",
    email: "e.ombati@nairobihospitalgroup.org",
    phone: "0733 888 999",
    preferredDate: "2026-10-12",
    preferredTime: "02:00 PM",
    purpose: "Security Risk Assessment Consultation",
    message: "Need consultation on upgrading hospital branch access control and CCTV integration.",
    meetingLocation: "Client Facility (Nairobi West Clinic)",
    status: "pending",
    createdAt: "2026-03-22T14:15:00Z"
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq-01",
    userId: "usr-client-01",
    name: "James Mwangi",
    email: "james.mwangi@kenyaenterprises.co.ke",
    phone: "0711 987 654",
    subject: "Dog Handler Services for Container Depot",
    message: "Can we bundle 2 trained German Shepherd dogs and a handler for night perimeter patrols in our Mombasa Road depot?",
    status: "resolved",
    response: "Yes Mr. Mwangi, our canine unit is certified and we have updated your quotation to include trained patrol dogs and handlers.",
    createdAt: "2026-03-14T09:00:00Z"
  },
  {
    id: "inq-02",
    name: "Mercy Mutua",
    email: "mercy.m@lifestylemall.co.ke",
    phone: "0715 000 111",
    subject: "Parking Marshals for Upcoming Easter Weekend Expo",
    message: "We need 8 trained parking marshals with handheld communication radios for a 3-day shopping festival.",
    status: "under_review",
    createdAt: "2026-03-24T16:40:00Z"
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "tst-01",
    name: "Arch. Patrick Gichuru",
    role: "Managing Director",
    company: "Savannah Logistics Towers, Mombasa Road",
    location: "Nairobi",
    comment: "Sumich Solutions has managed our commercial multi-tenant property along Mombasa Road for over 3 years. Their manned guards are always alert, uniform standards are impeccable, and their supervisory night checks are thorough. Zero security incidents reported.",
    rating: 5,
    active: true
  },
  {
    id: "tst-02",
    name: "CPA Hellen Auma",
    role: "Chairperson, Security Committee",
    company: "Amani Gardens Resident Association",
    location: "Syokimau / Athi River",
    comment: "Transitioning to Sumich was the best decision our residents' committee made. Their gate barrier access control system eliminated trespassers, and the guards are respectful and courteous to families while strictly vetting strangers.",
    rating: 5,
    active: true
  },
  {
    id: "tst-03",
    name: "Eng. Victor Kibet",
    role: "Head of Operations",
    company: "Continental Agro-Processors Ltd",
    location: "Industrial Area, Nairobi",
    comment: "The weighbridge and cargo manifest inspection by Sumich Solutions cut internal product pilferage by 95% within the first six months. Their CCTV remote monitoring integration provides unmatched accountability.",
    rating: 5,
    active: true
  }
];

export const INITIAL_NEWS: NewsUpdate[] = [
  {
    id: "nws-01",
    title: "Sumich Solutions Renews PSRA Compliance Certification for 2026",
    category: "Compliance",
    summary: "Reaffirming full alignment with the Private Security Regulatory Authority statutory standards, wage requirements, and officer training frameworks.",
    content: "Sumich Solutions Limited has completed all regulatory renewals with the Private Security Regulatory Authority (PSRA) in Kenya. All active guard staff hold valid registration numbers and undergo regular refresher drills in human rights, conflict de-escalation, and tactical defense.",
    author: "Compliance Directorate",
    publishedDate: "2026-02-20",
    status: "published"
  },
  {
    id: "nws-02",
    title: "Commissioning Our New 24/7 Digital Operations Center at Vision Plaza",
    category: "Company News",
    summary: "Expanding our high-definition CCTV surveillance, GPS guard tracking, and rapid response coordination along the Mombasa Road economic corridor.",
    content: "We have upgraded our central security control room at Vision Plaza, 3rd Floor, Suite 17B. The facility integrates real-time RFID patrol wands, remote alarm telemetry, and automated vehicle dispatch, serving Nairobi, Machakos, and surrounding industrial hubs.",
    author: "Major Daniel Kiprono",
    publishedDate: "2026-03-05",
    status: "published"
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-01",
    actorId: "usr-admin-01",
    actorName: "Kennedy Omondi",
    action: "System Initialization",
    category: "System" as any,
    details: "Sumich Solutions Security Management Portal initialized with core operational schemas.",
    timestamp: "2026-03-01T08:00:00Z"
  },
  {
    id: "log-02",
    actorId: "usr-admin-03",
    actorName: "Major (Rtd) Daniel Kiprono",
    action: "Leave Approved",
    category: "Leave",
    details: "Approved Off-Duty Rotation request for Cpl. Peter Otieno (SUM-GD-1042).",
    timestamp: "2026-09-08T09:15:00Z"
  },
  {
    id: "log-03",
    actorId: "usr-admin-02",
    actorName: "Beatrice Chebet",
    action: "Application Status Update",
    category: "Application",
    details: "Moved application for Faith Wanjiku to Under Review with interview recommendation.",
    timestamp: "2026-03-16T11:00:00Z"
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-01",
    userId: "usr-guard-01",
    title: "Leave Status Update",
    message: "Your Off-Duty Rotation request for Sep 10-12 was APPROVED by Operations Directorate.",
    type: "leave",
    isRead: false,
    createdAt: "2026-09-08T09:20:00Z"
  },
  {
    id: "notif-02",
    userId: "usr-client-01",
    title: "Quotation Under Review",
    message: "Our security engineering team has conducted site appraisal and updated your commercial quote.",
    type: "quote",
    isRead: false,
    createdAt: "2026-03-13T10:00:00Z"
  },
  {
    id: "notif-03",
    userId: "usr-seeker-01",
    title: "Application Received",
    message: "Your application for Professional Security Guard is currently under review by our recruitment team.",
    type: "application",
    isRead: true,
    createdAt: "2026-03-15T10:00:00Z"
  }
];

export const INITIAL_USER_ACTIVITIES: UserActivity[] = [
  // --- Client: James Mwangi (usr-client-01) ---
  {
    id: "act-cl-01",
    userId: "usr-client-01",
    action: "Quotation Request Submitted",
    category: "quote",
    title: "Quotation Requested: Commercial & Industrial Security",
    description: "Submitted quotation request for 10 security guards and RFID tour wands at Mombasa Road Godown depot.",
    status: "pending",
    timestamp: "2026-03-12T11:20:00Z",
    metadata: {
      quoteId: "quot-01",
      serviceType: "Commercial & Industrial Security",
      location: "Mombasa Road, Godown No. 14, Nairobi",
      budget: "KES 240,000 / month"
    }
  },
  {
    id: "act-cl-02",
    userId: "usr-client-01",
    action: "Quotation Status Updated",
    category: "quote",
    title: "Quotation Under Technical Review",
    description: "Site survey conducted by Major (Rtd) Daniel Kiprono. 10-guard commercial SLA draft prepared.",
    status: "under_review",
    timestamp: "2026-03-13T10:00:00Z",
    metadata: {
      quoteId: "quot-01",
      reviewNotes: "Survey completed. Proposal draft sent for 10-guard package."
    }
  },
  {
    id: "act-cl-03",
    userId: "usr-client-01",
    action: "Inquiry Submitted",
    category: "inquiry",
    title: "Inquiry Sent: Dog Handler Services for Container Depot",
    description: "Requested technical information regarding trained K-9 patrol dog handler integration for night perimeter rounds.",
    status: "pending",
    timestamp: "2026-03-14T09:00:00Z",
    metadata: {
      inquiryId: "inq-01",
      subject: "Dog Handler Services for Container Depot"
    }
  },
  {
    id: "act-cl-04",
    userId: "usr-client-01",
    action: "Inquiry Response Received",
    category: "inquiry",
    title: "Inquiry Resolved by Operations Directorate",
    description: "Sumich Operations confirmed canine unit availability and updated the quotation specification.",
    status: "resolved",
    timestamp: "2026-03-14T14:30:00Z",
    metadata: {
      inquiryId: "inq-01",
      responseExcerpt: "Canine unit certified and updated in quotation package."
    }
  },
  {
    id: "act-cl-05",
    userId: "usr-client-01",
    action: "Appointment Scheduled",
    category: "appointment",
    title: "Consultation Booked: Contract Signing & Operational SLA Review",
    description: "Scheduled consultation meeting with Operations Leadership at Sumich HQ, Vision Plaza, 3rd Floor, Suite 17B.",
    status: "scheduled",
    timestamp: "2026-03-18T10:00:00Z",
    metadata: {
      appointmentId: "apt-01",
      preferredDate: "2026-10-05",
      preferredTime: "10:30 AM",
      venue: "Sumich HQ, Vision Plaza, Mombasa Road"
    }
  },
  {
    id: "act-cl-06",
    userId: "usr-client-01",
    action: "Profile Information Synchronized",
    category: "profile",
    title: "Corporate Account Details Updated",
    description: "Synchronized registered corporate profile for Apex Commercial Logistics Kenya.",
    status: "completed",
    timestamp: "2026-03-20T08:30:00Z"
  },

  // --- Job Seeker: Faith Wanjiku (usr-seeker-01) ---
  {
    id: "act-js-01",
    userId: "usr-seeker-01",
    action: "Job Application Submitted",
    category: "application",
    title: "Application Submitted: Professional Security Guard",
    description: "Submitted online dossier for Professional Security Guard vacancy (Ref: vac-01) with NYS credentials.",
    status: "pending",
    timestamp: "2026-03-15T09:45:00Z",
    metadata: {
      applicationId: "app-01",
      position: "Professional Security Guard",
      vacancyId: "vac-01"
    }
  },
  {
    id: "act-js-02",
    userId: "usr-seeker-01",
    action: "Credentials Uploaded",
    category: "document",
    title: "Uploaded Verified Documents: CV & Certificate of Good Conduct",
    description: "Uploaded Faith_Wanjiku_CV_2026.pdf and verified Certificate of Good Conduct.",
    status: "verified",
    timestamp: "2026-03-15T09:50:00Z",
    metadata: {
      fileName: "Faith_Wanjiku_CV_2026.pdf",
      supportingDoc: "Certificate_Good_Conduct_2026.pdf"
    }
  },
  {
    id: "act-js-03",
    userId: "usr-seeker-01",
    action: "Application Status Updated",
    category: "application",
    title: "Application Status: Shortlisted (Under Review)",
    description: "Recruitment Officer Beatrice Chebet reviewed credentials and moved application to shortlist for physical drills.",
    status: "under_review",
    timestamp: "2026-03-16T11:00:00Z",
    metadata: {
      applicationId: "app-01",
      reviewerNotes: "Good background with NYS discipline certificate. Shortlisted for physical drills."
    }
  },
  {
    id: "act-js-04",
    userId: "usr-seeker-01",
    action: "Interview Scheduled",
    category: "application",
    title: "Interview Scheduled: Physical Assessment & Verification",
    description: "Sumich Recruitment scheduled formal interview and physical evaluation for 10th October 2026 at 10:00 AM.",
    status: "approved",
    timestamp: "2026-03-17T09:00:00Z",
    metadata: {
      applicationId: "app-01",
      interviewDate: "2026-10-10T10:00:00Z",
      venue: "Sumich Operations Field Ground, Vision Plaza"
    }
  },

  // --- Staff / Guard: Cpl. Peter Otieno (usr-guard-01) ---
  {
    id: "act-gd-01",
    userId: "usr-guard-01",
    action: "Leave Request Submitted",
    category: "leave",
    title: "Emergency Leave Request Submitted (2 Days)",
    description: "Submitted emergency medical clearance request for Kenyatta National Hospital medical checkup.",
    status: "approved",
    timestamp: "2026-07-30T16:00:00Z",
    metadata: {
      leaveId: "lev-03",
      leaveType: "Emergency Leave",
      period: "2026-08-01 to 2026-08-03"
    }
  },
  {
    id: "act-gd-02",
    userId: "usr-guard-01",
    action: "Leave Clearance Approved",
    category: "leave",
    title: "Emergency Leave Approved by Command",
    description: "Authorized by Major Daniel Kiprono. Relief Guard Moses Korir assigned to Vision Plaza post.",
    status: "approved",
    timestamp: "2026-07-31T08:30:00Z",
    metadata: {
      leaveId: "lev-03",
      approvedBy: "Major Daniel Kiprono (Operations)"
    }
  },
  {
    id: "act-gd-03",
    userId: "usr-guard-01",
    action: "Off-Duty Request Submitted",
    category: "leave",
    title: "Off-Duty Rotation Request Submitted (2 Days)",
    description: "Compensatory rest off-duty after 14-day night shift marathon. Relief: Guard Dennis Muthomi.",
    status: "approved",
    timestamp: "2026-09-08T08:00:00Z",
    metadata: {
      leaveId: "lev-02",
      leaveType: "Off-Duty Rotation",
      period: "2026-09-10 to 2026-09-12"
    }
  },
  {
    id: "act-gd-04",
    userId: "usr-guard-01",
    action: "Leave Clearance Approved",
    category: "leave",
    title: "Off-Duty Rotation Approved",
    description: "Operations Directorate approved 2-day off-duty rotation. Clearance certificate generated.",
    status: "approved",
    timestamp: "2026-09-08T09:15:00Z",
    metadata: {
      leaveId: "lev-02",
      approvedBy: "Major Daniel Kiprono (Operations)"
    }
  },
  {
    id: "act-gd-05",
    userId: "usr-guard-01",
    action: "Shift SITREP Logged",
    category: "system",
    title: "Shift Incident & Patrol SITREP Logged",
    description: "Logged routine vehicle barrier RFID scanner inspection and visitor traffic tally at Vision Plaza Main Gate.",
    status: "completed",
    timestamp: "2026-09-18T18:00:00Z",
    metadata: {
      post: "Vision Plaza Main Gate",
      sitrepType: "Routine Shift Log"
    }
  },
  {
    id: "act-gd-06",
    userId: "usr-guard-01",
    action: "Leave Request Submitted",
    category: "leave",
    title: "Annual Leave Application Submitted (7 Days)",
    description: "Applied for 7 calendar days annual leave (2026-10-15 to 2026-10-22). Relief: Guard Samuel Kiptoo (SUM-GD-1088).",
    status: "pending",
    timestamp: "2026-09-25T14:30:00Z",
    metadata: {
      leaveId: "lev-01",
      leaveType: "Annual Leave",
      period: "2026-10-15 to 2026-10-22",
      reliefGuard: "Guard Samuel Kiptoo (SUM-GD-1088)"
    }
  }
];

export const INITIAL_QUOTATION_BRANDING: QuotationBrandingSettings = {
  companyName: "SUMICH SOLUTIONS LIMITED",
  tagline: "Your Security, Our Commitment.",
  registrationNumber: "CPR/2023/108422",
  kraPin: "P051928471Z",
  vatNumber: "051928471-V",
  physicalAddress: "Vision Plaza, 3rd Floor, Office No. 17B, Mombasa Road, Nairobi",
  postalAddress: "P.O. Box 59140 - 00200, Nairobi, Kenya",
  telephone: "+254 117 230 136 / +254 735 229 229",
  emergencyHotline: "+254 735 229 229 (24/7 Control Room)",
  email: "quotations@sumichsecurity.com",
  website: "www.sumichsecurity.com",
  logoPosition: "left",
  logoWidthPx: 160,
  useLetterhead: true,
  letterheadMode: "first_page",
  letterheadBackgroundFit: "contain",
  accentColor: "#d97706",
  fontFamily: "Inter, sans-serif",
  tableStyle: "modern",
  pageMargins: "normal",
  footerText: "SUMICH SOLUTIONS LIMITED is licensed & certified by the Private Security Regulatory Authority (PSRA/REG/KEN/2023/0488). All rights reserved.",
  defaultTerms: "1. Quotation is valid for 30 calendar days from the date of issuance.\n2. Payment terms: 30 days net from invoice date via Bank Transfer or M-Pesa Corporate Paybill.\n3. All security personnel are vetted with DCI Police Clearance certificates and registered with PSRA.\n4. Provision includes supervisory checks, RFID electronic tour wand reports, and 24/7 radio liaison.",
  defaultPaymentTerms: "Net 30 Days from date of invoice. M-Pesa Paybill: 400200, Account: SUMICH-SEC.",
  defaultSpecialConditions: "Mobilization takes 48 hours upon contract execution and issuance of an official Local Purchase Order (LPO).",
  authorizedSignatoryName: "Kennedy Omondi",
  authorizedSignatoryTitle: "Managing Director & CEO",
  signatorySignatureUrl: "",
  companyStampUrl: ""
};

export const INITIAL_QUOTATION_NUMBERING: QuotationNumberingConfig = {
  prefix: "SUMICH/QTN",
  yearFormat: "YYYY",
  digits: 4,
  nextNumber: 4,
  autoIncrement: true
};

export const INITIAL_INVOICE_NUMBERING: InvoiceNumberingConfig = {
  prefix: "SUMICH/INV",
  yearFormat: "YYYY",
  digits: 4,
  nextNumber: 2,
  autoIncrement: true
};

export const INITIAL_FORMAL_QUOTATIONS: FormalQuotation[] = [
  {
    id: "qtn-0001",
    quotationNumber: "SUMICH/QTN/2026/0001",
    clientId: "usr-client-01",
    clientName: "James Mwangi",
    companyName: "Apex Logistics Hub",
    contactPerson: "James Mwangi, Facilities Director",
    email: "james.mwangi@apexlogistics.co.ke",
    phone: "0722 000 111",
    physicalAddress: "Mombasa Road Logistics Park, Godown 14, Nairobi",
    postalAddress: "P.O. Box 48900 - 00100, Nairobi",
    quotationDate: "2026-03-12",
    expiryDate: "2026-04-12",
    projectTitle: "Manned Guarding & Electronic Perimeter Patrol SLA (Annual Contract)",
    serviceDescription: "Deployment of 4 licensed security officers (2 Day Shift, 2 Night Shift) equipped with RFID tour patrol wands, VHF 2-way dispatch radios, reflective tactical vests, and 24/7 command room monitoring.",
    templateType: "security_guarding",
    items: [
      {
        id: "item-1",
        description: "Day Shift Security Guards (06:00 - 18:00 hrs) - PSRA Licensed & Vetted",
        quantity: 2,
        unit: "Guards/Month",
        unitPrice: 38000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 76000
      },
      {
        id: "item-2",
        description: "Night Shift Security Guards (18:00 - 06:00 hrs) - With Canine Handlers Support",
        quantity: 2,
        unit: "Guards/Month",
        unitPrice: 42000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 84000
      },
      {
        id: "item-3",
        description: "Electronic RFID Tour Patrol Wand System with Real-Time Online SITREP Reports",
        quantity: 1,
        unit: "Station/Month",
        unitPrice: 15000,
        discountPercent: 10,
        taxPercent: 16,
        lineTotal: 13500
      },
      {
        id: "item-4",
        description: "Sub-10 Min Rapid Mobile Intercept Response Standby (Vision Plaza Hub)",
        quantity: 1,
        unit: "Site SLA",
        unitPrice: 20000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 20000
      }
    ],
    subtotal: 193500,
    discountTotal: 1500,
    taxTotal: 30960,
    grandTotal: 224460,
    currency: "KES",
    amountInWords: "Two Hundred and Twenty-Four Thousand, Four Hundred and Sixty Kenya Shillings Only",
    paymentTerms: "Net 30 Days upon presentation of monthly certified muster roll & tax invoice.",
    deliveryTerms: "Guard mobilization within 48 hours of contract execution.",
    specialConditions: "Sumich Solutions provides full uniform, batons, whistle, occurrence book (OB), hand-held metal detectors, and torch equipment.",
    notes: "Site risk assessment conducted on 2026-03-10 by Operations Directorate.",
    status: "approved",
    approvalDetails: {
      approvedBy: "Kennedy Omondi",
      approverRole: "Managing Director & CEO",
      approvedAt: "2026-03-14T11:30:00Z",
      comments: "Approved under corporate tariff rate. Complies with PSRA gazetted wage guidelines.",
      signatureType: "digital_seal"
    },
    auditTrail: [
      {
        id: "aud-01",
        action: "Quotation Created",
        actorName: "Sarah Wambui",
        actorRole: "Sales & Operations Officer",
        timestamp: "2026-03-12T09:15:00Z",
        details: "Draft quotation created following site survey request."
      },
      {
        id: "aud-02",
        action: "Quotation Approved",
        actorName: "Kennedy Omondi",
        actorRole: "Managing Director & CEO",
        timestamp: "2026-03-14T11:30:00Z",
        details: "Executive review completed and formal approval granted.",
        previousStatus: "pending_approval",
        newStatus: "approved"
      }
    ],
    createdAt: "2026-03-12T09:15:00Z",
    updatedAt: "2026-03-14T11:30:00Z"
  },
  {
    id: "qtn-0002",
    quotationNumber: "SUMICH/QTN/2026/0002",
    clientId: "usr-client-01",
    clientName: "Grace Muthoni",
    companyName: "Kilimani Heights Residency",
    contactPerson: "Grace Muthoni, Estate Committee Chair",
    email: "management@kilimaniheights.co.ke",
    phone: "0733 999 888",
    physicalAddress: "Wood Avenue, Kilimani, Nairobi",
    postalAddress: "P.O. Box 71200 - 00100, Nairobi",
    quotationDate: "2026-03-18",
    expiryDate: "2026-04-18",
    projectTitle: "Access Barrier Control & Visitor Screening System",
    serviceDescription: "Supply, installation, and commissioning of automatic boom barrier, biometric access controller, and 6 HD CCTV dome surveillance units for resident gatehouse.",
    templateType: "maintenance",
    items: [
      {
        id: "item-201",
        description: "Heavy Duty Automatic Boom Barrier (6m Arm with Anti-Crush Sensor)",
        quantity: 1,
        unit: "Complete Set",
        unitPrice: 185000,
        discountPercent: 5,
        taxPercent: 16,
        lineTotal: 175750
      },
      {
        id: "item-202",
        description: "5MP Full Color Smart IP CCTV Surveillance Cameras (Night Color + Audio)",
        quantity: 6,
        unit: "Units",
        unitPrice: 14500,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 87000
      },
      {
        id: "item-203",
        description: "8-Channel PoE Network Video Recorder (NVR) with 4TB Surveillance Hard Drive",
        quantity: 1,
        unit: "Unit",
        unitPrice: 48000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 48000
      },
      {
        id: "item-204",
        description: "Installation, Cabling, Cat6 Conduit Runs, Configuration & Commissioning",
        quantity: 1,
        unit: "Job",
        unitPrice: 35000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 35000
      }
    ],
    subtotal: 345750,
    discountTotal: 9250,
    taxTotal: 55320,
    grandTotal: 401070,
    currency: "KES",
    amountInWords: "Four Hundred and One Thousand, and Seventy Kenya Shillings Only",
    paymentTerms: "60% Mobilization Deposit upon order, 40% upon satisfactory commissioning and testing.",
    deliveryTerms: "Installation duration: 5 working days from receipt of mobilization deposit.",
    specialConditions: "Includes 12 months comprehensive hardware warranty and free quarterly routine maintenance.",
    notes: "Site measurements finalized on 2026-03-17 by Technical Systems Engineer.",
    status: "sent",
    approvalDetails: {
      approvedBy: "Kennedy Omondi",
      approverRole: "Managing Director & CEO",
      approvedAt: "2026-03-19T14:10:00Z",
      comments: "Technical proposal verified and signed off.",
      signatureType: "digital_seal"
    },
    sentHistory: [
      {
        sentAt: "2026-03-19T15:00:00Z",
        sentTo: "management@kilimaniheights.co.ke",
        subject: "SUMICH SOLUTIONS LIMITED - Formal Quotation SUMICH/QTN/2026/0002",
        message: "Dear Ms. Muthoni, Please find attached the formal quotation for Kilimani Heights Access Barrier & CCTV Systems. We look forward to your favorable response."
      }
    ],
    auditTrail: [
      {
        id: "aud-201",
        action: "Quotation Created",
        actorName: "Sarah Wambui",
        actorRole: "Sales & Operations Officer",
        timestamp: "2026-03-18T10:00:00Z",
        details: "Technical quote created."
      },
      {
        id: "aud-202",
        action: "Quotation Sent to Client",
        actorName: "Sarah Wambui",
        actorRole: "Sales & Operations Officer",
        timestamp: "2026-03-19T15:00:00Z",
        details: "Quotation emailed to client at management@kilimaniheights.co.ke"
      }
    ],
    createdAt: "2026-03-18T10:00:00Z",
    updatedAt: "2026-03-19T15:00:00Z"
  },
  {
    id: "qtn-0003",
    quotationNumber: "SUMICH/QTN/2026/0003",
    clientId: "usr-client-01",
    clientName: "David Kipkorir",
    companyName: "Safari Commercial Towers",
    contactPerson: "David Kipkorir, Property General Manager",
    email: "dkipkorir@safaritowers.co.ke",
    phone: "0711 555 444",
    physicalAddress: "Upper Hill Road, Nairobi",
    postalAddress: "P.O. Box 30122 - 00100, Nairobi",
    quotationDate: "2026-03-24",
    expiryDate: "2026-04-24",
    projectTitle: "Executive Corporate Facility Protection & VIP Concierge Guarding",
    serviceDescription: "Comprehensive manned security service for 14-storey commercial office complex, including main lobby access control, basement parking management, and biometric loading dock verification.",
    templateType: "corporate",
    items: [
      {
        id: "item-301",
        description: "Senior Concierge Reception Security Officers (Suit & Tie Uniform)",
        quantity: 3,
        unit: "Officers/Mo",
        unitPrice: 48000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 144000
      },
      {
        id: "item-302",
        description: "Standard Manned Guarding Personnel (Day/Night Perimeter Patrol)",
        quantity: 6,
        unit: "Guards/Mo",
        unitPrice: 38000,
        discountPercent: 5,
        taxPercent: 16,
        lineTotal: 216600
      },
      {
        id: "item-303",
        description: "Resident Security Supervisor (Class A PSRA Certified)",
        quantity: 1,
        unit: "Supervisor/Mo",
        unitPrice: 55000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 55000
      }
    ],
    subtotal: 415600,
    discountTotal: 11400,
    taxTotal: 66496,
    grandTotal: 482096,
    currency: "KES",
    amountInWords: "Four Hundred and Eighty-Two Thousand, and Ninety-Six Kenya Shillings Only",
    paymentTerms: "Monthly in arrears, 30 days from billing date.",
    deliveryTerms: "Staff takeover and deployment within 7 calendar days of contract signing.",
    specialConditions: "Officers undergo customized building fire-safety and emergency evacuation protocol training.",
    notes: "Commercial SLA contract template attached.",
    status: "draft",
    auditTrail: [
      {
        id: "aud-301",
        action: "Quotation Created as Draft",
        actorName: "Sarah Wambui",
        actorRole: "Sales & Operations Officer",
        timestamp: "2026-03-24T16:20:00Z",
        details: "Draft quotation compiled awaiting site muster assessment."
      }
    ],
    createdAt: "2026-03-24T16:20:00Z",
    updatedAt: "2026-03-24T16:20:00Z"
  }
];

export const INITIAL_FORMAL_INVOICES: FormalInvoice[] = [
  {
    id: "inv-0001",
    invoiceNumber: "SUMICH/INV/2026/0001",
    quotationId: "qtn-0001",
    quotationNumber: "SUMICH/QTN/2026/0001",
    clientId: "usr-client-01",
    clientName: "James Mwangi",
    companyName: "Apex Logistics Hub",
    contactPerson: "James Mwangi, Facilities Director",
    email: "james.mwangi@apexlogistics.co.ke",
    phone: "0722 000 111",
    physicalAddress: "Mombasa Road Logistics Park, Godown 14, Nairobi",
    postalAddress: "P.O. Box 48900 - 00100, Nairobi",
    issueDate: "2026-03-15",
    dueDate: "2026-04-14",
    projectTitle: "Manned Guarding & Electronic Perimeter Patrol SLA - Month 1 (March 2026)",
    items: [
      {
        id: "inv-item-1",
        description: "Day Shift Security Guards (06:00 - 18:00 hrs) - PSRA Licensed & Vetted",
        quantity: 2,
        unit: "Guards/Month",
        unitPrice: 38000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 76000
      },
      {
        id: "inv-item-2",
        description: "Night Shift Security Guards (18:00 - 06:00 hrs) - With Canine Handlers Support",
        quantity: 2,
        unit: "Guards/Month",
        unitPrice: 42000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 84000
      },
      {
        id: "inv-item-3",
        description: "Electronic RFID Tour Patrol Wand System with Real-Time Online SITREP Reports",
        quantity: 1,
        unit: "Station/Month",
        unitPrice: 15000,
        discountPercent: 10,
        taxPercent: 16,
        lineTotal: 13500
      },
      {
        id: "inv-item-4",
        description: "Sub-10 Min Rapid Mobile Intercept Response Standby (Vision Plaza Hub)",
        quantity: 1,
        unit: "Site SLA",
        unitPrice: 20000,
        discountPercent: 0,
        taxPercent: 16,
        lineTotal: 20000
      }
    ],
    subtotal: 193500,
    discountTotal: 1500,
    taxTotal: 30960,
    grandTotal: 224460,
    amountPaid: 100000,
    balanceDue: 124460,
    currency: "KES",
    amountInWords: "Two Hundred and Twenty-Four Thousand, Four Hundred and Sixty Kenya Shillings Only",
    paymentStatus: "partially_paid",
    paymentTerms: "Net 30 Days. Bank: KCB Bank Kenya Ltd | M-Pesa Paybill: 400200",
    notes: "First month mobilization billing. Certified by Operations Officer.",
    kraPin: "P051928471Z",
    vatNumber: "051928471-V",
    payments: [
      {
        id: "pay-01",
        paymentDate: "2026-03-20",
        amount: 100000,
        paymentMethod: "Bank Wire (RTGS/EFT)",
        transactionReference: "KCB-RTGS-8910248",
        recordedBy: "Accounts Department",
        notes: "Advance installment received.",
        createdAt: "2026-03-20T10:00:00Z"
      }
    ],
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-03-20T10:00:00Z"
  }
];

export const INITIAL_UPLOADED_DOCUMENTS: UploadedDocument[] = [
  {
    id: "doc-01",
    name: "Curriculum Vitae - Faith Wanjiku",
    fileName: "Faith_Wanjiku_CV_2026.pdf",
    category: "cv",
    fileType: "application/pdf",
    fileSize: "1.4 MB",
    uploadedAt: "2026-03-15T09:45:00Z",
    uploadedBy: "Faith Wanjiku (Job Seeker)",
    uploaderRole: "jobseeker",
    relatedEntityId: "app-01",
    description: "Verified candidate curriculum vitae for Professional Security Guard role.",
    tags: ["CV", "Recruitment", "Guard", "Faith Wanjiku"],
    contentTranscript: `CURRICULUM VITAE
FAITH WANJIKU
P.O. Box 42100 - 00100, Nairobi | Tel: +254 790 321 654 | Email: faith.wanjiku@gmail.com
National ID: 32145678 | Nationality: Kenyan | Residence: Embakasi, Nairobi

PROFESSIONAL SUMMARY:
Disciplined, physically fit and vigilant security professional with 2+ years of hands-on experience in access control, customer protection, perimeter patrol and emergency incident response. Formally trained by the National Youth Service (NYS) Paramilitary Discipline Course with certified St. John Ambulance First Aid skills.

EDUCATION & ACADEMIC CREDENTIALS:
- Kenya Certificate of Secondary Education (KCSE) - Grade C- (2020)
  Embakasi Secondary School, Nairobi
- Kenya Certificate of Primary Education (KCPE) - 312 Marks (2016)

PROFESSIONAL TRAININGS & CERTIFICATIONS:
- National Youth Service (NYS) Basic Paramilitary & Discipline Certificate (2022)
  Drills, physical defense, surveillance, radio telephony, perimeter security.
- St. John Ambulance Kenya - Level 1 First Aid & CPR Certification (2023)
- Fire Safety & Emergency Evacuation Protocol (Osh Association Kenya - 2024)

WORK EXPERIENCE:
1. Security Screening Officer | Gateway Mall, Nairobi (March 2024 - Present)
   - Conducted pedestrian metal detector screening and vehicular under-carriage mirror checks.
   - Maintained visitor vehicle access logs and monitored public area CCTV blind spots.
   - Handled customer lost-and-found escort and assisted emergency medical first aid.
2. Perimeter Guard | Modern Residential Court, Embakasi (January 2023 - February 2024)
   - Executed 12-hour rotating night and day gatekeeper watch with hourly guard tour clock-ins.
   - Repelled unauthorized loiterers and maintained perimeter fence integrity.

REFEREES:
1. Insp. (Rtd) Joseph Kamau, Head of Security, Gateway Mall Nairobi (+254 722 112 233)
2. NYS Company Commander Captain M. Ochieng, Gilgil Training College (+254 733 445 566)`
  },
  {
    id: "doc-02",
    name: "Police Clearance Certificate (Good Conduct)",
    fileName: "Certificate_Good_Conduct_2026.pdf",
    category: "credential",
    fileType: "application/pdf",
    fileSize: "840 KB",
    uploadedAt: "2026-03-15T09:46:00Z",
    uploadedBy: "Faith Wanjiku (Job Seeker)",
    uploaderRole: "jobseeker",
    relatedEntityId: "app-01",
    description: "Directorate of Criminal Investigations (DCI) Police Clearance Certificate.",
    tags: ["Police Clearance", "Good Conduct", "DCI", "Vetting", "Faith Wanjiku"],
    contentTranscript: `REPUBLIC OF KENYA
DIRECTORATE OF CRIMINAL INVESTIGATIONS
CRIMINAL INVESTIGATION DEPARTMENT HEADQUARTERS
P.O. BOX 30036 - 00100, NAIROBI, KENYA

POLICE CLEARANCE CERTIFICATE (CERTIFICATE OF GOOD CONDUCT)
SERIAL NUMBER: PCC-2026-KNY-0891427
DATE OF ISSUE: 14th February 2026

TO WHOM IT MAY CONCERN:
This is to certify that the fingerprints of the holder below have been searched in the Criminal Records Repository of the Directorate of Criminal Investigations Kenya.

APPLICANT DETAILS:
FULL NAME: FAITH WANJIKU
NATIONAL IDENTITY CARD NO: 32145678
DATE OF BIRTH: 12th August 2002
PLACE OF ISSUE: NAIROBI CENTRAL
GENDER: FEMALE

FINGERPRINT CLASSIFICATION & RESULT:
Primary Fingerprint Formula: 17/23 W/W 14/19
CRIMINAL RECORD SEARCH RESULT: NEGATIVE (NO CRIMINAL RECORD FOUND)

This candidate has NO PREVIOUS CRIMINAL CONVICTIONS recorded in the Republic of Kenya as of 14/02/2026.
Validity Period: Valid for official employment & security vetting purposes.

ISSUING OFFICER:
Senior Superintendent of Police (SSP) - Fingerprint Identification Bureau
Directorate of Criminal Investigations, Kiambu Road, Nairobi
Official Seal: [DCI L.S. EMBOSSED]`
  },
  {
    id: "doc-03",
    name: "NYS Security & Discipline Certificate",
    fileName: "NYS_Discipline_Cert_2022.pdf",
    category: "credential",
    fileType: "application/pdf",
    fileSize: "1.1 MB",
    uploadedAt: "2026-03-15T09:47:00Z",
    uploadedBy: "Faith Wanjiku (Job Seeker)",
    uploaderRole: "jobseeker",
    relatedEntityId: "app-01",
    description: "National Youth Service Paramilitary Basic Training Certificate of Merit.",
    tags: ["NYS", "Discipline", "Security Drills", "Certificate"],
    contentTranscript: `REPUBLIC OF KENYA
MINISTRY OF PUBLIC SERVICE, YOUTH AND GENDER AFFAIRS
NATIONAL YOUTH SERVICE (NYS)
PARAMILITARY TRAINING ACADEMY - GILGIL

CERTIFICATE OF DISCIPLINE & DRILLS COMPLETION
REGISTRATION NO: NYS/2022/COHORT-4/88192

THIS IS TO CERTIFY THAT
FAITH WANJIKU (ID: 32145678)

Successfully underwent and completed the mandatory 6-Month Intensive Paramilitary, Physical Fitness, Security Drills, Disaster Preparedness, and National Values Course.

ASSESSMENT GRADES:
- Physical Readiness & Guard Drills: DISTINCTION (A)
- Surveillance & Radio Communication: PASS (B+)
- Firefighting, Disaster Control & First Aid: DISTINCTION (A)
- Disciplinary Record: CLEAN / EXCELLENT

AWARDED AT GILGIL ACADEMY ON 30TH NOVEMBER 2022
DIRECTOR GENERAL, NATIONAL YOUTH SERVICE
COMMANDANT, NYS PARAMILITARY COLLEGE`
  },
  {
    id: "doc-04",
    name: "Sumich Solutions Corporate Logo Crest (Vector Master)",
    fileName: "Sumich_Corporate_Vector_Logo.svg",
    category: "branding",
    fileType: "image/svg+xml",
    fileSize: "48 KB",
    uploadedAt: "2026-01-15T08:00:00Z",
    uploadedBy: "Corporate Administration",
    uploaderRole: "super_admin",
    description: "Official heraldic master vector security crest of Sumich Solutions Limited.",
    tags: ["Logo", "Branding", "Vector", "Crest", "Corporate Identity"],
    contentTranscript: `SUMICH SOLUTIONS LIMITED - CORPORATE LOGO MASTER ASSET
============================================================
Brand: Sumich Solutions Limited
Primary Colors: Amber Gold (#F59E0B), Navy Slate (#0F172A), Pure White (#FFFFFF)
Typography: Plus Jakarta Sans / Cabinet Grotesk
Symbolism: Heraldic Security Shield (Defense), Soaring Eagle (24/7 Vigilance), Sculpted "S" (Sumich Leadership), Triple Stars (Excellence, Integrity, Compliance).
Authorized Usage: Website Navbar, Quotation Headers, Uniform Badges, Vehicle Fleet Graphics, Letterheads, Tax Invoices.`
  },
  {
    id: "doc-05",
    name: "Official Corporate Letterhead Banner",
    fileName: "Sumich_Official_Letterhead_A4.png",
    category: "branding",
    fileType: "image/png",
    fileSize: "520 KB",
    uploadedAt: "2026-02-01T10:00:00Z",
    uploadedBy: "Corporate Administration",
    uploaderRole: "super_admin",
    description: "Official pre-printed header and footer artwork for company correspondence and tender submissions.",
    tags: ["Letterhead", "Branding", "Formal Stationery", "Tenders"],
    contentTranscript: `SUMICH SOLUTIONS LIMITED - OFFICIAL A4 LETTERHEAD STATIONERY
============================================================
Header Details:
- Legal Entity: SUMICH SOLUTIONS LIMITED
- Tagline: "Your Security, Our Commitment."
- Location: Vision Plaza, 3rd Floor, Mombasa Road, Nairobi, Kenya
- Regulatory ID: PSRA/REG/KEN/2023/0488 | Reg: CPR/2023/108422
- Contact Hotlines: +254 117 230 136 / +254 735 229 229
- Official Email: info@sumichsecurity.com`
  },
  {
    id: "doc-06",
    name: "PSRA Corporate Operating License 2026",
    fileName: "PSRA_Operating_License_2026.pdf",
    category: "compliance",
    fileType: "application/pdf",
    fileSize: "1.8 MB",
    uploadedAt: "2026-01-02T08:30:00Z",
    uploadedBy: "Legal & Regulatory Compliance Directorate",
    uploaderRole: "super_admin",
    description: "Private Security Regulatory Authority (PSRA) annual corporate license to operate guarding & patrol services in Kenya.",
    tags: ["PSRA", "License", "Regulatory", "Legal Compliance", "Kenya Government"],
    contentTranscript: `REPUBLIC OF KENYA
MINISTRY OF INTERIOR AND NATIONAL ADMINISTRATION
PRIVATE SECURITY REGULATORY AUTHORITY (PSRA)

CORPORATE LICENSE TO OPERATE AS A PRIVATE SECURITY SERVICE PROVIDER
LICENSE NUMBER: PSRA/REG/KEN/2023/0488
GAZETTED NOTICE NO: 14892 / 2023
EXPIRY DATE: 31ST DECEMBER 2026

ISSUED TO:
COMPANY NAME: SUMICH SOLUTIONS LIMITED
COMPANY REGISTRATION: CPR/2023/108422
PHYSICAL HEADQUARTERS: VISION PLAZA, MOMBASA ROAD, NAIROBI
POSTAL ADDRESS: P.O. BOX 59140 - 00200, NAIROBI

AUTHORIZED SERVICES:
1. Static Guarding & Physical Security Personnel Provision
2. Mobile K9 Patrol Units & Alarm Rapid Response
3. CCTV, Biometrics & Electronic Access Control Installation
4. Executive Close Protection & Risk Consultation

CONDITIONS OF LICENSE:
- Full adherence to the Private Security Regulation Act No. 13 of 2016.
- Strict compliance with the gazetted minimum guard remuneration wage order.
- Continuous biometric vetting and registration of all guarding personnel with valid Guard Force Numbers (GFN).

SIGNED & SEALED BY:
DIRECTOR GENERAL & CHIEF EXECUTIVE OFFICER
PRIVATE SECURITY REGULATORY AUTHORITY, NAIROBI KENYA`
  },
  {
    id: "doc-07",
    name: "Leave Clearance Pass - Cpl. Peter Otieno",
    fileName: "Leave_Pass_SUM-GD-1042.pdf",
    category: "operations",
    fileType: "application/pdf",
    fileSize: "320 KB",
    uploadedAt: "2026-09-25T14:30:00Z",
    uploadedBy: "Major (Rtd) Daniel Kiprono (Operations Officer)",
    uploaderRole: "operations_officer",
    relatedEntityId: "lev-01",
    description: "Authorized operational leave pass and shift relief handover record.",
    tags: ["Leave Pass", "Operations", "Guard Clearance", "Peter Otieno"],
    contentTranscript: `SUMICH SOLUTIONS LIMITED - OPERATIONS COMMAND
OFFICIAL LEAVE CLEARANCE SLIP & RELIEF HANDOVER
PASS NUMBER: LEV-2026-1042-01
DATE: 25th September 2026

GUARD OFFICER DETAILS:
NAME: Cpl. Peter Otieno
SERVICE NUMBER: SUM-GD-1042
CURRENT POST: Vision Plaza Commercial Complex - Main Gate
LEAVE TYPE: Annual Leave (7 Days)
DURATION: 15/10/2026 to 22/10/2026
HANDOVER RELIEF OFFICER: Guard Samuel Kiptoo (SUM-GD-1088)

EQUIPMENT HANDOVER CHECKLIST:
- Uniform (2 Pairs + Cap + Lanyard): Accounted for
- VHF Communication Two-Way Radio: Handed to Shift Commander
- Handheld Metal Detector Wand: Checked & Handed Over
- Duty Occurrence Book (OB) Entry Made: OB Ref #419/09/2026

STATUS: APPROVED & LOGGED IN CENTRAL OPERATIONS ROSTER
AUTHORIZED BY: Major (Rtd) Daniel Kiprono, Operations Officer
STAMP: SUMICH OPERATIONS COMMAND CENTER VISION PLAZA`
  },
  {
    id: "doc-08",
    name: "Master Security Services Agreement (SLA Template)",
    fileName: "Sumich_Master_Service_Agreement.pdf",
    category: "financial",
    fileType: "application/pdf",
    fileSize: "2.2 MB",
    uploadedAt: "2026-02-15T11:00:00Z",
    uploadedBy: "Corporate Administration",
    uploaderRole: "super_admin",
    description: "Standard Master Security Service Agreement containing terms of engagement, liability, SLA response times, and billing schedules.",
    tags: ["Contract", "SLA", "Agreement", "Terms of Service", "Tenders"],
    contentTranscript: `SUMICH SOLUTIONS LIMITED
MASTER SECURITY SERVICES AGREEMENT & GENERAL CONDITIONS OF ENGAGEMENT
REF: SUM-MSA-REV4-2026

1. PARTIES & ENGAGEMENT:
This Agreement governs the provision of professional private security guarding, technical surveillance, mobile patrol, and rapid alarm response services by SUMICH SOLUTIONS LIMITED ("The Contractor") to designated clients ("The Client").

2. SERVICE STANDARDS & SERVICE LEVEL AGREEMENT (SLA):
- 24/7/365 Armed Mobile Backup within an 8-minute radius in Nairobi metropolis.
- 100% Vetted Guards holding valid PSRA Guard Force Numbers (GFN) and Police Clearance Certificates.
- Continuous electronic guard tour monitoring with hourly GPS checkpoints.
- Strict occurrence reporting with digital incident logging within 30 minutes of any security breach.

3. UNIFORM & EQUIPMENT SPECIFICATIONS:
Guards are issued official Sumich branded uniforms, high-visibility tactical vests, whistles, lanyards, batons, communication radios, and search wands.

4. BILLING, TAXATION & PAYMENT TERMS:
All billings are rendered monthly in advance or net 30 days pursuant to official Value Added Tax (VAT 16%) Tax Invoices. Payment via RTGS wire or M-Pesa Corporate Paybill.`
  }
];


