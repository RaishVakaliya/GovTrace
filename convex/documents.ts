import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDepartments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

export const getByTrackingId = query({
  args: { trackingId: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.trackingId.trim().toUpperCase();
    const application = await ctx.db
      .query("applications")
      .withIndex("by_trackingId", (q) => q.eq("trackingId", cleanId))
      .first();

    if (!application) {
      return null;
    }

    // Fetch department
    const departments = await ctx.db.query("departments").collect();
    const department = departments.find(
      (d) => d._id.toString() === application.departmentId
    );

    // Fetch status logs
    const logs = await ctx.db
      .query("statusLogs")
      .withIndex("by_applicationId", (q) =>
        q.eq("applicationId", application._id.toString())
      )
      .collect();

    logs.sort((a, b) => a.timestamp - b.timestamp);

    return {
      ...application,
      department,
      statusLogs: logs,
    };
  },
});

export const getUserApplications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    apps.sort((a, b) => b.createdAt - a.createdAt);

    const departments = await ctx.db.query("departments").collect();
    const deptMap = new Map(departments.map((d) => [d._id.toString(), d]));

    return apps.map((app) => ({
      ...app,
      department: deptMap.get(app.departmentId),
    }));
  },
});

export const getDepartmentApplications = query({
  args: {
    departmentId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let apps = await ctx.db.query("applications").collect();

    if (args.departmentId && args.departmentId !== "ALL") {
      apps = apps.filter((a) => a.departmentId === args.departmentId);
    }

    if (args.status && args.status !== "ALL") {
      apps = apps.filter((a) => a.status === args.status);
    }

    apps.sort((a, b) => b.updatedAt - a.updatedAt);

    const departments = await ctx.db.query("departments").collect();
    const deptMap = new Map(departments.map((d) => [d._id.toString(), d]));

    return apps.map((app) => ({
      ...app,
      department: deptMap.get(app.departmentId),
    }));
  },
});

export const createApplication = mutation({
  args: {
    userId: v.string(),
    applicantName: v.string(),
    applicantEmail: v.string(),
    departmentId: v.string(),
    documentType: v.string(),
    remarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const trackingId = `GT-${new Date().getFullYear()}-${randomHex}`;
    const now = Date.now();

    const appId = await ctx.db.insert("applications", {
      trackingId,
      userId: args.userId,
      applicantName: args.applicantName,
      applicantEmail: args.applicantEmail,
      departmentId: args.departmentId,
      documentType: args.documentType,
      status: "Submitted",
      remarks: args.remarks || "Application submitted online.",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("statusLogs", {
      applicationId: appId.toString(),
      status: "Submitted",
      updatedBy: "System / Applicant",
      timestamp: now,
      comment: "Document request successfully lodged into the GovTrace system.",
    });

    return { appId, trackingId };
  },
});

export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.string(),
    status: v.union(
      v.literal("Submitted"),
      v.literal("Accepted"),
      v.literal("Under Review"),
      v.literal("Approved/Printing"),
      v.literal("Ready for Collection")
    ),
    officerId: v.string(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apps = await ctx.db.query("applications").collect();
    const app = apps.find((a) => a._id.toString() === args.applicationId);

    if (!app) {
      throw new Error("Application not found");
    }

    const now = Date.now();

    await ctx.db.patch(app._id, {
      status: args.status,
      remarks: args.comment || app.remarks,
      updatedAt: now,
    });

    await ctx.db.insert("statusLogs", {
      applicationId: app._id.toString(),
      status: args.status,
      updatedBy: args.officerId,
      timestamp: now,
      comment: args.comment || `Status progressed to ${args.status}`,
    });

    return { success: true };
  },
});

export const seedInitialData = mutation({
  args: {},
  handler: async (ctx) => {
    const existingDepts = await ctx.db.query("departments").collect();
    if (existingDepts.length > 0) {
      return { message: "Data already seeded" };
    }

    // Seed departments
    const d1 = await ctx.db.insert("departments", {
      name: "Department of State & Civil Registry",
      code: "DSCR",
      description: "Handles birth certificates, national identity, passports, and civil records.",
    });

    const d2 = await ctx.db.insert("departments", {
      name: "Federal Transport & Licensing Authority",
      code: "FTLA",
      description: "Oversees commercial and private driving licenses, vehicle titles, and permits.",
    });

    const d3 = await ctx.db.insert("departments", {
      name: "Bureau of Land Management & Revenue",
      code: "BLMR",
      description: "Administers deed registrations, title transfers, and land valuation records.",
    });

    const d4 = await ctx.db.insert("departments", {
      name: "Directorate of Trade & Commercial Affairs",
      code: "DTCA",
      description: "Manages corporate incorporations, municipal trading licenses, and compliance.",
    });

    // Seed demo applications
    const now = Date.now();
    const day = 86400000;

    // Sample 1: Ready for Collection
    const app1 = await ctx.db.insert("applications", {
      trackingId: "GT-2026-A891K",
      userId: "demo-citizen-1",
      applicantName: "Elena Rostova",
      applicantEmail: "elena.rostova@example.gov",
      departmentId: d1.toString(),
      documentType: "Biometric Passport Renewal (10-Year)",
      status: "Ready for Collection",
      remarks: "Counter 4, National Passport Center. Bring original National ID.",
      createdAt: now - 5 * day,
      updatedAt: now - 2 * 3600000,
    });

    await ctx.db.insert("statusLogs", {
      applicationId: app1.toString(),
      status: "Submitted",
      updatedBy: "Elena Rostova",
      timestamp: now - 5 * day,
      comment: "Online application and document scans lodged.",
    });
    await ctx.db.insert("statusLogs", {
      applicationId: app1.toString(),
      status: "Accepted",
      updatedBy: "Officer Marcus Wright (DSCR)",
      timestamp: now - 4 * day,
      comment: "Identity documents verified against federal database.",
    });
    await ctx.db.insert("statusLogs", {
      applicationId: app1.toString(),
      status: "Under Review",
      updatedBy: "Senior Inspector Vance",
      timestamp: now - 3 * day,
      comment: "Biometric fingerprint cross-check cleared.",
    });
    await ctx.db.insert("statusLogs", {
      applicationId: app1.toString(),
      status: "Approved/Printing",
      updatedBy: "Secure Print Division",
      timestamp: now - 1 * day,
      comment: "Document dispatched to High-Security Laser Printing Unit.",
    });
    await ctx.db.insert("statusLogs", {
      applicationId: app1.toString(),
      status: "Ready for Collection",
      updatedBy: "Station Manager Davis",
      timestamp: now - 2 * 3600000,
      comment: "Passport securely locked in vault Counter 4. Ready for pickup.",
    });

    // Sample 2: Under Review
    const app2 = await ctx.db.insert("applications", {
      trackingId: "GT-2026-X419B",
      userId: "demo-citizen-1",
      applicantName: "Elena Rostova",
      applicantEmail: "elena.rostova@example.gov",
      departmentId: d2.toString(),
      documentType: "Commercial Driver License Class A",
      status: "Under Review",
      remarks: "Medical examination report pending final physician signature.",
      createdAt: now - 2 * day,
      updatedAt: now - 4 * 3600000,
    });

    await ctx.db.insert("statusLogs", {
      applicationId: app2.toString(),
      status: "Submitted",
      updatedBy: "Elena Rostova",
      timestamp: now - 2 * day,
      comment: "Lodged with road test endorsement.",
    });
    await ctx.db.insert("statusLogs", {
      applicationId: app2.toString(),
      status: "Accepted",
      updatedBy: "Officer Chen",
      timestamp: now - 1 * day,
      comment: "Prerequisite driving history vetted.",
    });
    await ctx.db.insert("statusLogs", {
      applicationId: app2.toString(),
      status: "Under Review",
      updatedBy: "Medical Examiner Board",
      timestamp: now - 4 * 3600000,
      comment: "Reviewing ophthalmology and heavy vehicle certification.",
    });

    // Sample 3: Accepted
    const app3 = await ctx.db.insert("applications", {
      trackingId: "GT-2026-M723T",
      userId: "demo-citizen-2",
      applicantName: "Carlos Mendez",
      applicantEmail: "carlos.m@example.gov",
      departmentId: d3.toString(),
      documentType: "Residential Title Deed Transfer",
      status: "Accepted",
      remarks: "Application intake complete. Forwarded to cadastral surveying team.",
      createdAt: now - 18 * 3600000,
      updatedAt: now - 6 * 3600000,
    });

    await ctx.db.insert("statusLogs", {
      applicationId: app3.toString(),
      status: "Submitted",
      updatedBy: "Carlos Mendez",
      timestamp: now - 18 * 3600000,
      comment: "Deed submission lodged.",
    });
    await ctx.db.insert("statusLogs", {
      applicationId: app3.toString(),
      status: "Accepted",
      updatedBy: "Officer Sarah Vance",
      timestamp: now - 6 * 3600000,
      comment: "Title registry intake validation passed. Awaiting surveyor review.",
    });

    return { message: "Initial GovTrace seed completed successfully" };
  },
});
