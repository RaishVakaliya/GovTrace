import { Application, Department, StatusLog } from "@/types";

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    _id: "dept-1",
    name: "Department of State & Civil Registry",
    code: "DSCR",
    description: "Handles birth certificates, national identity, passports, and civil records.",
  },
  {
    _id: "dept-2",
    name: "Federal Transport & Licensing Authority",
    code: "FTLA",
    description: "Oversees commercial and private driving licenses, vehicle titles, and permits.",
  },
  {
    _id: "dept-3",
    name: "Bureau of Land Management & Revenue",
    code: "BLMR",
    description: "Administers deed registrations, title transfers, and land valuation records.",
  },
  {
    _id: "dept-4",
    name: "Directorate of Trade & Commercial Affairs",
    code: "DTCA",
    description: "Manages corporate incorporations, municipal trading licenses, and compliance.",
  },
];

const now = Date.now();
const day = 86400000;

export const INITIAL_APPLICATIONS: Application[] = [
  {
    _id: "app-1",
    trackingId: "GT-2026-A891K",
    userId: "demo-citizen-1",
    applicantName: "Elena Rostova",
    applicantEmail: "elena.rostova@example.gov",
    applicantIdNumber: "NAT-77492-X",
    departmentId: "dept-1",
    departmentName: "Department of State & Civil Registry",
    departmentCode: "DSCR",
    documentType: "Biometric Passport Renewal (10-Year)",
    status: "Ready for Collection",
    remarks: "Counter 4, National Passport Center. Bring original National ID.",
    createdAt: now - 5 * day,
    updatedAt: now - 2 * 3600000,
  },
  {
    _id: "app-2",
    trackingId: "GT-2026-X419B",
    userId: "demo-citizen-1",
    applicantName: "Elena Rostova",
    applicantEmail: "elena.rostova@example.gov",
    applicantIdNumber: "NAT-77492-X",
    departmentId: "dept-2",
    departmentName: "Federal Transport & Licensing Authority",
    departmentCode: "FTLA",
    documentType: "Commercial Driver License Class A",
    status: "Under Review",
    remarks: "Medical examination report pending final physician signature.",
    createdAt: now - 2 * day,
    updatedAt: now - 4 * 3600000,
  },
  {
    _id: "app-3",
    trackingId: "GT-2026-M723T",
    userId: "demo-citizen-2",
    applicantName: "Carlos Mendez",
    applicantEmail: "carlos.m@example.gov",
    applicantIdNumber: "NAT-51209-C",
    departmentId: "dept-3",
    departmentName: "Bureau of Land Management & Revenue",
    departmentCode: "BLMR",
    documentType: "Residential Title Deed Transfer",
    status: "Accepted",
    remarks: "Application intake complete. Forwarded to cadastral surveying team.",
    createdAt: now - 18 * 3600000,
    updatedAt: now - 6 * 3600000,
  },
  {
    _id: "app-4",
    trackingId: "GT-2026-W904Z",
    userId: "demo-citizen-1",
    applicantName: "Elena Rostova",
    applicantEmail: "elena.rostova@example.gov",
    applicantIdNumber: "NAT-77492-X",
    departmentId: "dept-4",
    departmentName: "Directorate of Trade & Commercial Affairs",
    departmentCode: "DTCA",
    documentType: "Municipal Commercial Trading Permit",
    status: "Submitted",
    remarks: "Lodge submitted online. Awaiting document validation officer.",
    createdAt: now - 2 * 3600000,
    updatedAt: now - 2 * 3600000,
  },
];

export const INITIAL_STATUS_LOGS: StatusLog[] = [
  // Logs for app-1
  {
    _id: "log-1",
    applicationId: "app-1",
    status: "Submitted",
    updatedBy: "Elena Rostova",
    timestamp: now - 5 * day,
    comment: "Online application and document scans lodged.",
  },
  {
    _id: "log-2",
    applicationId: "app-1",
    status: "Accepted",
    updatedBy: "Officer Marcus Wright (DSCR)",
    timestamp: now - 4 * day,
    comment: "Identity documents verified against federal database.",
  },
  {
    _id: "log-3",
    applicationId: "app-1",
    status: "Under Review",
    updatedBy: "Senior Inspector Vance",
    timestamp: now - 3 * day,
    comment: "Biometric fingerprint cross-check cleared.",
  },
  {
    _id: "log-4",
    applicationId: "app-1",
    status: "Approved/Printing",
    updatedBy: "Secure Print Division",
    timestamp: now - 1 * day,
    comment: "Document dispatched to High-Security Laser Printing Unit.",
  },
  {
    _id: "log-5",
    applicationId: "app-1",
    status: "Ready for Collection",
    updatedBy: "Station Manager Davis",
    timestamp: now - 2 * 3600000,
    comment: "Passport securely locked in vault Counter 4. Ready for pickup.",
  },

  // Logs for app-2
  {
    _id: "log-6",
    applicationId: "app-2",
    status: "Submitted",
    updatedBy: "Elena Rostova",
    timestamp: now - 2 * day,
    comment: "Lodged with road test endorsement.",
  },
  {
    _id: "log-7",
    applicationId: "app-2",
    status: "Accepted",
    updatedBy: "Officer Chen (FTLA)",
    timestamp: now - 1 * day,
    comment: "Prerequisite driving history vetted.",
  },
  {
    _id: "log-8",
    applicationId: "app-2",
    status: "Under Review",
    updatedBy: "Medical Examiner Board",
    timestamp: now - 4 * 3600000,
    comment: "Reviewing ophthalmology and heavy vehicle certification.",
  },

  // Logs for app-3
  {
    _id: "log-9",
    applicationId: "app-3",
    status: "Submitted",
    updatedBy: "Carlos Mendez",
    timestamp: now - 18 * 3600000,
    comment: "Deed submission lodged.",
  },
  {
    _id: "log-10",
    applicationId: "app-3",
    status: "Accepted",
    updatedBy: "Officer Sarah Vance (BLMR)",
    timestamp: now - 6 * 3600000,
    comment: "Title registry intake validation passed. Awaiting surveyor review.",
  },

  // Logs for app-4
  {
    _id: "log-11",
    applicationId: "app-4",
    status: "Submitted",
    updatedBy: "Elena Rostova",
    timestamp: now - 2 * 3600000,
    comment: "Initial registration fee paid and articles of incorporation attached.",
  },
];
