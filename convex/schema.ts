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
});
