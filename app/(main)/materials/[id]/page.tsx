import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import type { Id } from "@/convex/_generated/dataModel"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Engagement from "@/components/Engagement"
import { CalendarDays, Download, FileAxis3d, FolderOpen, User2 } from "lucide-react"
import DownloadButton from "@/components/DownloadButton"
import { Button } from "@/components/ui/button"
import Back from "@/components/ui/back"

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
    <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_24%),linear-gradient(180deg,_rgba(248,250,252,0.9),_rgba(255,255,255,1))] py-10 sm:py-12 lg:py-14">
      <div className="mx-6 flex w-auto flex-col gap-6 sm:mx-10 lg:mx-20 xl:mx-32 2xl:mx-40">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" className="w-fit rounded-full px-4 text-slate-600 hover:bg-white/80">
            <Back/>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <Card className="border border-white/70 bg-white/80 shadow-xl shadow-cyan-100/50 backdrop-blur-sm">
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex w-fit items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-cyan-700 uppercase">
                    Study Material
                  </div>
                  <CardTitle className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    {material.title}
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-base leading-7 text-slate-600">
                    A ready-to-download resource for <span className="font-semibold text-slate-900">{material.courseCode}</span>. Review the details below, track engagement, and grab the file when you are ready.
                  </CardDescription>
                </div>
                <CardAction className="col-start-auto row-auto self-start justify-self-start lg:justify-self-end">
                  <div className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 text-cyan-700 shadow-inner">
                    <FileAxis3d className="h-12 w-12" />
                  </div>
                </CardAction>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">Course</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{material.courseCode}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                    <User2 className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">Uploaded By</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{material.uploaderName}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">Published</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{material.date}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-slate-700">Community engagement</p>
                <Engagement material={material} />
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-200/70 pt-6">
              <p className="text-sm text-slate-500">
                Category: <span className="font-semibold text-slate-800">{material.category}</span>
              </p>
            </CardFooter>
          </Card>

          <Card className="border border-slate-200/80 bg-slate-950 text-slate-50 shadow-xl shadow-slate-300/30">
            <CardHeader className="gap-3">
              <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
                Download Center
              </div>
              <CardTitle className="text-2xl font-black text-white">
                Take this material offline
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-300">
                Save the file to your device and keep it handy for revision, lecture prep, or quick last-minute review.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DownloadButton
                href={fileUrl ?? "#"}
                material={material}
                className="block"
              >
                <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400 to-blue-500 p-[1px] shadow-lg shadow-cyan-950/30">
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-[calc(var(--radius-3xl)-1px)] bg-slate-950 px-6 text-center">
                    <div className="mb-4 inline-flex h-18 w-18 items-center justify-center rounded-3xl bg-white/8 text-cyan-300">
                      <Download className="h-9 w-9" />
                    </div>
                    <p className="text-xl font-bold text-white">Download file</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">
                      One click starts the download and updates the material stats automatically.
                    </p>
                  </div>
                </div>
              </DownloadButton>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Quick note</p>
                <p className="mt-2 leading-6">
                  If the file is still processing or temporarily unavailable, the button stays safely disabled until a valid download URL is ready.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
