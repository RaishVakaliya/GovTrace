export type UserRole = "citizen" | "official";

export type ApplicationStatus =
  | "Submitted"
  | "Accepted"
  | "Under Review"
  | "Approved/Printing"
  | "Ready for Collection";

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  "Submitted",
  "Accepted",
  "Under Review",
  "Approved/Printing",
  "Ready for Collection",
];

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: number;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
}

export interface Application {
  _id: string;
  trackingId: string;
  userId: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantIdNumber?: string;
  departmentId: string;
  departmentName?: string;
  departmentCode?: string;
  documentType: string;
  status: ApplicationStatus;
  remarks?: string;
  createdAt: number;
  updatedAt: number;
}

export interface StatusLog {
  _id: string;
  applicationId: string;
  status: ApplicationStatus;
  updatedBy: string; // Officer ID or Name
  officerName?: string;
  timestamp: number;
  comment?: string;
}

export interface ApplicationWithDetails extends Application {
  department?: Department;
  statusLogs?: StatusLog[];
  user?: User;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}
