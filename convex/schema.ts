import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  materials: defineTable({
    title: v.string(),
    category: v.string(),
    courseCode: v.string(),
    uploaderName: v.string(),
    date: v.string(),
    downloads: v.number(),
    upvotes: v.number(),
    fileId: v.id("_storage"),
  }),
  courses: defineTable({
    courseCode: v.string(),
    count: v.number(),
    latestMaterialId: v.id("materials"),
  }),
  users: defineTable({
  authUserId: v.string(),
  email: v.string(),
  name: v.string(),
})
  .index("by_auth_user_id", ["authUserId"])
  .index("by_email", ["email"]),


});
