import { paginationOptsValidator } from "convex/server";
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
    uploaderEmail: v.string(),
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

export const listMaterialCategories = query({
  args: {},
  handler: async (ctx) => {
    const materials = await ctx.db.query("materials").collect();

    return [...new Set(materials.map((material) => material.category))].sort();
  },
});

export const listMaterialsPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
    category: v.optional(v.string()),
    courseCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const searchQuery = args.searchQuery?.trim().toLowerCase() ?? "";
    const category = args.category?.trim() ?? "";
    const normalizedCourseCode = args.courseCode
      ? normalizeCourseCode(args.courseCode)
      : "";

    const result = await ctx.db.query("materials").order("asc").paginate(args.paginationOpts);

    const page = result.page.filter((material) => {
      const matchesSearch =
        searchQuery.length === 0 ||
        [
          material.title,
          material.courseCode,
          material.category,
          material.uploaderName,
        ].some((value) => value.toLowerCase().includes(searchQuery));

      const matchesCategory = category.length === 0 || material.category === category;
      const matchesCourse =
        normalizedCourseCode.length === 0 ||
        normalizeCourseCode(material.courseCode) === normalizedCourseCode;

      return matchesSearch && matchesCategory && matchesCourse;
    });

    return {
      ...result,
      page,
    };
  },
});

export const listMaterialsPage = query({
  args: {
    page: v.number(),
    pageSize: v.number(),
    searchQuery: v.optional(v.string()),
    category: v.optional(v.string()),
    courseCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const searchQuery = args.searchQuery?.trim().toLowerCase() ?? "";
    const category = args.category?.trim() ?? "";
    const normalizedCourseCode = args.courseCode
      ? normalizeCourseCode(args.courseCode)
      : "";

    const allMaterials = await ctx.db.query("materials").collect();
    const categories = [...new Set(allMaterials.map((material) => material.category))].sort();
    const courses = [...new Set(allMaterials.map((material) => material.courseCode))].sort();

    const filteredMaterials = allMaterials
      .filter((material) => {
        const matchesSearch =
          searchQuery.length === 0 ||
          [
            material.title,
            material.courseCode,
            material.category,
            material.uploaderName,
          ].some((value) => value.toLowerCase().includes(searchQuery));

        const matchesCategory = category.length === 0 || material.category === category;
        const matchesCourse =
          normalizedCourseCode.length === 0 ||
          normalizeCourseCode(material.courseCode) === normalizedCourseCode;

        return matchesSearch && matchesCategory && matchesCourse;
      })
      .sort((a, b) => {
        const timeDifference =
          new Date(b.date).getTime() - new Date(a.date).getTime();

        if (timeDifference !== 0) {
          return timeDifference;
        }

        return b._creationTime - a._creationTime;
      });

    const totalItems = filteredMaterials.length;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / args.pageSize);
    const safePage =
      totalPages === 0 ? 1 : Math.min(Math.max(1, Math.floor(args.page)), totalPages);
    const startIndex = (safePage - 1) * args.pageSize;
    const page = filteredMaterials.slice(startIndex, startIndex + args.pageSize);

    return {
      page,
      totalItems,
      totalPages,
      currentPage: safePage,
      categories,
      courses,
    };
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

export const listMaterialsByUploaderName = query({
  args: { uploaderName: v.string() },
  handler: async (ctx, args) => {
    const normalizedName = args.uploaderName.trim().toLowerCase();
    const materials = await ctx.db.query("materials").collect();

    return materials
      .filter((material) => material.uploaderName.trim().toLowerCase() === normalizedName)
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const countMaterialsByUploaderName = query({
  args: { uploaderName: v.string() },
  handler: async (ctx, args) => {
    const normalizedName = args.uploaderName.trim().toLowerCase();
    const materials = await ctx.db.query("materials").collect();

    return materials.filter(
      (material) => material.uploaderName.trim().toLowerCase() === normalizedName
    ).length;
  },
});

export const listMaterialsByUploaderEmail = query({
  args: { uploaderEmail: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.uploaderEmail.trim().toLowerCase();
    const materials = await ctx.db.query("materials").collect();

    return materials
      .filter(
        (material) =>
          material.uploaderEmail?.trim().toLowerCase() === normalizedEmail
      )
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const countMaterialsByUploaderEmail = query({
  args: { uploaderEmail: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.uploaderEmail.trim().toLowerCase();
    const materials = await ctx.db.query("materials").collect();

    return materials.filter(
      (material) => material.uploaderEmail?.trim().toLowerCase() === normalizedEmail
    ).length;
  },
});
