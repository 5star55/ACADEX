"use client"

import React from "react"
import { Download, ThumbsUp } from "lucide-react"
import { CourseMaterial } from "@/lib/data"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import DownloadButton from "./DownloadButton"
import { Id } from "@/convex/_generated/dataModel"

export default function Engagement({ material }: { material: CourseMaterial }) {
  const [liked, setLiked] = useState(false)
  const [localUpvotes, setLocalUpvotes] = useState(material.upvotes)
  const addLike = useMutation(api.materials.likeMaterial)
  const removeLike = useMutation(api.materials.unlikeMaterial)
  const liveMaterial = useQuery(api.materials.getMaterialById, { id: material._id })
  const downloadCount = liveMaterial?.downloads ?? material.downloads

  const fileUrl = useQuery(api.materials.getFileUrl, {
    storageId: material.fileId as Id<"_storage">,
  })

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="inline-flex items-center gap-2 rounded-full bg-cyan-50/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-100/80 hover:text-cyan-700 hover:shadow-md"
        onClick={() => {
          if (liked) {
            setLiked(false)
            setLocalUpvotes((n) => Math.max(0, n - 1))
            removeLike({ id: material._id })
            return
          }
          setLiked(true)
          setLocalUpvotes((n) => n + 1)
          addLike({ id: material._id })
        }}
      >
        <ThumbsUp
          size={32}
          className={`h-8 w-8 ${liked ? "oklch(0.45 0.085 224.283)" : ""}`}
          fill={liked ? "oklch(0.52 0.105 223.128)" : "none"}
          stroke={liked ? "currentColor" : "currentColor"}
          strokeWidth={liked ? 0 : 2}
        />
        {localUpvotes}
      </button>

      <DownloadButton
        href={fileUrl ?? "#"}
        material={material}
        className="inline-flex"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-md">
          <Download
          size={32}
          className="h-5 w-5"
          />
          {downloadCount}
        </span>
      </DownloadButton>
    </div>
  )
}
