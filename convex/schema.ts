import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("citizen"), v.literal("official")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  departments: defineTable({
    name: v.string(),
    code: v.string(),
    description: v.string(),
  }).index("by_code", ["code"]),

  applications: defineTable({
    trackingId: v.string(),
    userId: v.string(),
    applicantName: v.optional(v.string()),
    applicantEmail: v.optional(v.string()),
    departmentId: v.string(),
    documentType: v.string(),
    status: v.union(
      v.literal("Submitted"),
      v.literal("Accepted"),
      v.literal("Under Review"),
      v.literal("Approved/Printing"),
      v.literal("Ready for Collection")
    ),
    remarks: v.optional(v.string()),
    updatedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_trackingId", ["trackingId"])
    .index("by_userId", ["userId"])
    .index("by_departmentId", ["departmentId"])
    .index("by_status", ["status"]),

  statusLogs: defineTable({
    applicationId: v.string(),
    status: v.union(
      v.literal("Submitted"),
      v.literal("Accepted"),
      v.literal("Under Review"),
      v.literal("Approved/Printing"),
      v.literal("Ready for Collection")
    ),
    updatedBy: v.string(),
    timestamp: v.number(),
    comment: v.optional(v.string()),
  }).index("by_applicationId", ["applicationId"]),
});
