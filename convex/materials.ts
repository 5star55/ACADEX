import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { normalizeCourseCode } from "./utils";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createMaterial = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    courseCode: v.string(),
    uploaderName: v.string(),
    date: v.string(),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const normalizedCourseCode = normalizeCourseCode(args.courseCode);
    const materialId = await ctx.db.insert("materials", {
      ...args,
      courseCode: normalizedCourseCode,
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      upvotes: 0,
    });

    const allCourses = await ctx.db.query("courses").collect();
    const matchingCourses = allCourses.filter(
      (course) => normalizeCourseCode(course.courseCode) === normalizedCourseCode
    );

    if (matchingCourses.length === 0) {
      await ctx.db.insert("courses", {
        courseCode: normalizedCourseCode,
        count: 1,
        latestMaterialId: materialId,
      });
      return materialId;
    }

    const [primaryCourse, ...duplicates] = matchingCourses;
    const totalCount = matchingCourses.reduce(
      (sum, course) => sum + course.count,
      0
    );

    for (const duplicate of duplicates) {
      await ctx.db.delete(duplicate._id);
    }

    await ctx.db.patch(primaryCourse._id, {
      courseCode: normalizedCourseCode,
      count: totalCount + 1,
      latestMaterialId: materialId,
    });

    return materialId;
  },
});

export const listCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});
export const listMaterials = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("materials").collect();
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const coursebyId = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const getCourseById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getMaterialById = query({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const likeMaterial = mutation({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    const material = await ctx.db.get(args.id);
    if (!material) {
      throw new Error("Material not found");
    }

    await ctx.db.patch(args.id, {
      upvotes: material.upvotes + 1,
    });
  },
});

export const addDownload = mutation({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    const material = await ctx.db.get(args.id);
    if (!material) {
      throw new Error("Material not found");
    }

    await ctx.db.patch(args.id, {
      downloads: material.downloads + 1,
    });
  },
});

export const unlikeMaterial = mutation({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    const material = await ctx.db.get(args.id);
    if (!material) {
      throw new Error("Material not found");
    }

    const nextUpvotes = Math.max(0, material.upvotes - 1);
    await ctx.db.patch(args.id, {
      upvotes: nextUpvotes,
    });
  },
});

export const listMaterialsByCourse = query({
  args: {courseCode: v.string()},
  handler: async (ctx,args) => {
  const materials = ctx.db.query("materials").collect();
      const normalizedCourseCode = normalizeCourseCode(args.courseCode)
  return (await materials).filter((mat)=>
  normalizeCourseCode(mat.courseCode)===normalizedCourseCode)
  },
});


