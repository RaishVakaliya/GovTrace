"use client";

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { Application, ApplicationStatus, Department, StatusLog } from "@/types";
import { realtimeStore } from "@/lib/store/realtime-store";

interface ConvexContextType {
  isLiveConvex: boolean;
  departments: Department[];
  getByTrackingId: (trackingId: string) => (Application & { department?: Department; statusLogs?: StatusLog[] }) | null;
  getUserApplications: (userId: string) => Application[];
  getDepartmentApplications: (departmentId?: string, status?: string) => Application[];
  createApplication: (data: {
    userId: string;
    applicantName: string;
    applicantEmail: string;
    applicantIdNumber?: string;
    departmentId: string;
    documentType: string;
    remarks?: string;
  }) => { appId: string; trackingId: string };
  updateStatus: (data: {
    applicationId: string;
    status: ApplicationStatus;
    officerId: string;
    officerName?: string;
    comment?: string;
  }) => { success: boolean };
  resetData: () => void;
}

const ConvexContext = createContext<ConvexContextType | null>(null);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const isLiveConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

  // Subscribe to realtime store changes
  const storeVersion = useSyncExternalStore(
    (onStoreChange) => realtimeStore.subscribe(onStoreChange),
    () => realtimeStore.getApplications().length + "_" + realtimeStore.getStatusLogs().length,
    () => "server"
  );

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    setDepartments(realtimeStore.getDepartments());
  }, [storeVersion]);

  const value: ConvexContextType = {
    isLiveConvex,
    departments,
    getByTrackingId: (trackingId: string) => realtimeStore.getByTrackingId(trackingId),
    getUserApplications: (userId: string) => realtimeStore.getUserApplications(userId),
    getDepartmentApplications: (deptId?: string, st?: string) =>
      realtimeStore.getDepartmentApplications(deptId, st),
    createApplication: (data) => realtimeStore.createApplication(data),
    updateStatus: (data) => realtimeStore.updateApplicationStatus(data),
    resetData: () => realtimeStore.resetToDefaults(),
  };

  return <ConvexContext.Provider value={value}>{children}</ConvexContext.Provider>;
}

export function useGovStore() {
  const ctx = useContext(ConvexContext);
  if (!ctx) {
    throw new Error("useGovStore must be used within ConvexClientProvider");
  }
  return ctx;
}
