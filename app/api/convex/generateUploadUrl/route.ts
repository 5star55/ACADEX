import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  // Call the Convex mutation to get the upload URL
  const url = await fetchMutation(api.materials.generateUploadUrl, {});
  return NextResponse.json({ url });
}
