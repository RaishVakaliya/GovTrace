import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getUserById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // Convex ids can be normalized or queried
    const all = await ctx.db.query("users").collect();
    return all.find((u) => u._id.toString() === args.id) || null;
  },
});

export const upsertUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("citizen"), v.literal("official")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        image: args.image,
        role: args.role,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      image: args.image,
      role: args.role,
      createdAt: Date.now(),
    });
  },
});
