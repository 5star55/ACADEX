"use server"
import type { Id } from "@/convex/_generated/dataModel"
import { fetchMutation } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

type ActionState = {
  ok: boolean
  errors?: Record<string, string>
  message?: string
}

export async function createMaterialAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim()
  const courseCode = String(formData.get("courseCode") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const uploaderName = String(formData.get("uploaderName") ?? "").trim()
  const uploaderEmail = String(formData.get("uploaderEmail") ?? "").trim()
  const date = new Date().toISOString()
  const fileId = String(formData.get("fileId") ?? "").trim() as Id<"_storage">

  const errors: Record<string, string> = {}
  if (!title) errors.title = "Title is required."
  if (!courseCode) errors.courseCode = "Course code is required."
  if (!category) errors.category = "Category is required."
  if (!uploaderName) errors.uploaderName = "You need to be signed in to upload."
  if (!uploaderEmail) errors.uploaderEmail = "We couldn't identify your account."
  if (!fileId) errors.fileId = "Please upload a file."

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  await fetchMutation(api.materials.createMaterial, {
    title,
    courseCode,
    category,
    uploaderName,
    uploaderEmail,
    date,
    fileId,
  })

  return { ok: true, message: "Material submitted." }
}
