import { v } from "convex/values";
import { mutation,query } from "./_generated/server";
export const createUser = mutation({
  args: {
    authUserId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});

export const getUserByAuthUserId = query({
  args: {
    authUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .unique();
  },
});
