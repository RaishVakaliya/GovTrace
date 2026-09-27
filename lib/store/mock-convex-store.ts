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

// No dummy applications: real state starts clean and handles empty states gracefully
export const INITIAL_APPLICATIONS: Application[] = [];

export const INITIAL_STATUS_LOGS: StatusLog[] = [];
