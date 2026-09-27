import { Application, ApplicationStatus, Department, StatusLog } from "@/types";
import {
  INITIAL_APPLICATIONS,
  INITIAL_DEPARTMENTS,
  INITIAL_STATUS_LOGS,
} from "./mock-convex-store";

const APPS_KEY = "govtrace_registry_apps_v2";
const DEPTS_KEY = "govtrace_registry_depts_v2";
const LOGS_KEY = "govtrace_registry_logs_v2";

type Listener = () => void;

class RealtimeGovStore {
  private listeners: Set<Listener> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initStorage();
      try {
        this.channel = new BroadcastChannel("govtrace_realtime_bus");
        this.channel.onmessage = (event) => {
          if (event.data?.type === "SYNC") {
            this.notify();
          }
        };
      } catch {
        // BroadcastChannel fallback
      }

      window.addEventListener("storage", () => {
        this.notify();
      });
    }
  }

  private initStorage() {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(DEPTS_KEY)) {
      localStorage.setItem(DEPTS_KEY, JSON.stringify(INITIAL_DEPARTMENTS));
    }
    if (!localStorage.getItem(APPS_KEY)) {
      localStorage.setItem(APPS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem(LOGS_KEY)) {
      localStorage.setItem(LOGS_KEY, JSON.stringify(INITIAL_STATUS_LOGS));
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("Listener error:", e);
      }
    });
  }

  private broadcast() {
    this.notify();
    if (this.channel) {
      try {
        this.channel.postMessage({ type: "SYNC", timestamp: Date.now() });
      } catch (e) {
        console.error("Broadcast error:", e);
      }
    }
  }

  public getDepartments(): Department[] {
    if (typeof window === "undefined") return INITIAL_DEPARTMENTS;
    const raw = localStorage.getItem(DEPTS_KEY);
    if (!raw) return INITIAL_DEPARTMENTS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  }

  public getApplications(): Application[] {
    if (typeof window === "undefined") return INITIAL_APPLICATIONS;
    const raw = localStorage.getItem(APPS_KEY);
    if (!raw) return INITIAL_APPLICATIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_APPLICATIONS;
    }
  }

  public getStatusLogs(): StatusLog[] {
    if (typeof window === "undefined") return INITIAL_STATUS_LOGS;
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return INITIAL_STATUS_LOGS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STATUS_LOGS;
    }
  }

  public getByTrackingId(trackingId: string) {
    if (!trackingId) return null;
    const clean = trackingId.trim().toUpperCase();
    const apps = this.getApplications();
    const app = apps.find((a) => a.trackingId.toUpperCase() === clean);
    if (!app) return null;

    const depts = this.getDepartments();
    const department = depts.find((d) => d._id === app.departmentId);

    const logs = this.getStatusLogs().filter((l) => l.applicationId === app._id);
    logs.sort((a, b) => a.timestamp - b.timestamp);

    return {
      ...app,
      department,
      statusLogs: logs,
    };
  }

  public getUserApplications(userId?: string, userEmail?: string) {
    const apps = this.getApplications();
    // Return applications filed by the user or all if no user specified
    const filtered = apps.filter((a) => {
      if (!userId && !userEmail) return true;
      if (userId && a.userId === userId) return true;
      if (userEmail && a.applicantEmail?.toLowerCase() === userEmail.toLowerCase()) return true;
      return false;
    });

    const depts = this.getDepartments();
    const deptMap = new Map(depts.map((d) => [d._id, d]));

    filtered.sort((a, b) => b.createdAt - a.createdAt);

    return filtered.map((app) => ({
      ...app,
      department: deptMap.get(app.departmentId),
    }));
  }

  public getDepartmentApplications(departmentId?: string, status?: string) {
    let apps = this.getApplications();

    if (departmentId && departmentId !== "ALL") {
      apps = apps.filter((a) => a.departmentId === departmentId);
    }

    if (status && status !== "ALL") {
      apps = apps.filter((a) => a.status === status);
    }

    apps.sort((a, b) => b.updatedAt - a.updatedAt);

    const depts = this.getDepartments();
    const deptMap = new Map(depts.map((d) => [d._id, d]));

    return apps.map((app) => ({
      ...app,
      department: deptMap.get(app.departmentId),
    }));
  }

  public createApplication(data: {
    userId: string;
    applicantName: string;
    applicantEmail: string;
    applicantIdNumber?: string;
    departmentId: string;
    documentType: string;
    remarks?: string;
  }) {
    const apps = this.getApplications();
    const logs = this.getStatusLogs();
    const depts = this.getDepartments();

    const dept = depts.find((d) => d._id === data.departmentId);
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const trackingId = `GT-${new Date().getFullYear()}-${randomHex}`;
    const appId = `app-${Date.now()}`;
    const now = Date.now();

    const newApp: Application = {
      _id: appId,
      trackingId,
      userId: data.userId,
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      applicantIdNumber: data.applicantIdNumber || "NAT-VERIFIED",
      departmentId: data.departmentId,
      departmentName: dept?.name || "Government Department",
      departmentCode: dept?.code || "GOV",
      documentType: data.documentType,
      status: "Submitted",
      remarks: data.remarks || "Application lodged via official portal.",
      createdAt: now,
      updatedAt: now,
    };

    const newLog: StatusLog = {
      _id: `log-${Date.now()}`,
      applicationId: appId,
      status: "Submitted",
      updatedBy: data.applicantName,
      timestamp: now,
      comment: "Document request successfully lodged into GovTrace registry.",
    };

    apps.unshift(newApp);
    logs.push(newLog);

    if (typeof window !== "undefined") {
      localStorage.setItem(APPS_KEY, JSON.stringify(apps));
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    }

    this.broadcast();

    return { appId, trackingId };
  }

  public updateApplicationStatus(data: {
    applicationId: string;
    status: ApplicationStatus;
    officerId: string;
    officerName?: string;
    comment?: string;
  }) {
    const apps = this.getApplications();
    const logs = this.getStatusLogs();
    const appIndex = apps.findIndex((a) => a._id === data.applicationId);

    if (appIndex === -1) {
      throw new Error("Application not found");
    }

    const now = Date.now();
    const updatedApp = {
      ...apps[appIndex],
      status: data.status,
      remarks: data.comment || apps[appIndex].remarks,
      updatedAt: now,
    };

    apps[appIndex] = updatedApp;

    const newLog: StatusLog = {
      _id: `log-${Date.now()}`,
      applicationId: data.applicationId,
      status: data.status,
      updatedBy: data.officerName || data.officerId,
      officerName: data.officerName || "Official Verification Bureau",
      timestamp: now,
      comment: data.comment || `Application status updated to ${data.status}`,
    };

    logs.push(newLog);

    if (typeof window !== "undefined") {
      localStorage.setItem(APPS_KEY, JSON.stringify(apps));
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    }

    this.broadcast();

    return { success: true };
  }

  public clearAll() {
    if (typeof window === "undefined") return;
    localStorage.setItem(APPS_KEY, JSON.stringify([]));
    localStorage.setItem(LOGS_KEY, JSON.stringify([]));
    this.broadcast();
  }
}

export const realtimeStore = new RealtimeGovStore();
