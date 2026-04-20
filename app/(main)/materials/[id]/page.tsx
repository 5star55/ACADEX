import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import type { Id } from "@/convex/_generated/dataModel"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Engagement from "@/components/Engagement"
import { ArrowLeft, CalendarDays, Download, FolderOpen, User2 } from "lucide-react"
import DownloadButton from "@/components/DownloadButton"
import Router from "@/components/router"

const detailItems = [
  {
    label: "Course",
    icon: FolderOpen,
    key: "courseCode",
  },
  {
    label: "Uploaded by",
    icon: User2,
    key: "uploaderName",
  },
  {
    label: "Published",
    icon: CalendarDays,
    key: "date",
  },
] as const

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
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl items-center justify-center px-6">
        <div className="rounded-xl border border-border bg-card px-6 py-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-foreground">Material not found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This item may have been removed or the link may be invalid.
          </p>
        </div>
      </div>
    )
  }

  const fileUrl = await fetchQuery(api.materials.getFileUrl, {
    storageId: material.fileId,
  })

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 mx-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className='inline-flex gap-2'>
          <Router><ArrowLeft/> Go Back</Router>
        </div>

        <div className="grid w-fit mx-auto gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="gap-3 border-b border-border">
              <p className="text-sm font-medium text-muted-foreground">
                {material.category}
              </p>
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {material.title}
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6">
                Material details and engagement in one place.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {detailItems.map(({ label, icon: Icon, key }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </div>
                    <p className="text-base font-semibold text-foreground">
                      {material[key]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-medium text-foreground">Engagement</h2>
                <Engagement material={material} />
              </div>
            </CardContent>

            <CardFooter className="border-t border-border text-sm text-muted-foreground">
              Download, like, and revisit this material anytime.
            </CardFooter>
          </Card>

          <Card className="h-fit border-border bg-card shadow-sm">
            <CardHeader className="gap-2 border-b border-border">
              <CardTitle className="text-lg font-semibold text-foreground">
                Download
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Save this material for offline reading and revision.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <DownloadButton
                href={fileUrl ?? "#"}
                material={material}
              >
                <div className="flex items-center justify-center gap-3 rounded-lg bg-primary text-md font-medium text-primary-foreground transition hover:opacity-90 px-4 py-3">
                  <Download className="h-4 w-4" />
                  <span>Download file</span>
                </div>
              </DownloadButton>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
