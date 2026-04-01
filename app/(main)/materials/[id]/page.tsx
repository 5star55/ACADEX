import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import type { Id } from "@/convex/_generated/dataModel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Engagement from "@/components/Engagement"
import { FileAxis3d } from "lucide-react"
import DownloadButton from "@/components/DownloadButton"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const material = await fetchQuery(api.materials.getMaterialById, {
    id: id as Id<"materials">,
  })

  if (!material) {
    return (
      <div>
        <p>Material not found.</p>
      </div>
    )
  }

  const fileUrl = await fetchQuery(api.materials.getFileUrl, {
    storageId: material.fileId,
  })

  return (
    <div className="mx-15">
      <Card>
        <CardHeader>
          <CardTitle>{material.title}</CardTitle>
          <CardDescription>
            {material.uploaderName} . {material.date}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Engagement material={material} />
          <DownloadButton href={fileUrl ?? "#"} material={material}>
            <div className="flex flex-col items-center justify-center">
              <FileAxis3d size={72} />
              <p>Click to Download file</p>
            </div>
          </DownloadButton>
        </CardContent>
        <CardFooter>
          <p>{material.courseCode}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
