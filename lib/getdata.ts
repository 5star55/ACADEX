import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs"
import type { CourseSearchProps } from "@/lib/data"


export default async function getdata(){
  const materials = await fetchQuery(api.materials.listMaterials)
  return materials;
}

export async function getCourses(): Promise<CourseSearchProps["courses"]> {
  const [courses, materials] = await Promise.all([
    fetchQuery(api.materials.listCourses),
    fetchQuery(api.materials.listMaterials),
  ])

  const materialById = new Map(materials.map((m) => [m._id, m]))

  return courses.map((course) => ({
    _id: course._id,
    courseCode: course.courseCode,
    count: course.count,
    latestTitle:
      materialById.get(course.latestMaterialId)?.title ?? "Untitled material",
  }))
}
