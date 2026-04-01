"use client"

import React from "react"
import { Download, ThumbsUp } from "lucide-react"
import { CourseMaterial } from "@/lib/data"
import { useState } from "react"
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Engagement({ material }: { material: CourseMaterial }) {
  const [liked, setLiked] = useState(false)
  const [localUpvotes, setLocalUpvotes] = useState(material.upvotes)
  const addLike = useMutation(api.materials.likeMaterial)
  const removeLike = useMutation(api.materials.unlikeMaterial)
  const liveMaterial = useQuery(api.materials.getMaterialById, { id: material._id })
  const downloads = liveMaterial?.downloads ?? material.downloads

  
  return (
    <div className="flex gap-4">
      <button
        className="inline-flex items-center gap-1"
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

      <button
        className="inline-flex items-center gap-1"      >
        <Download
          size={32}
          className="h-8 w-8"
        />
        {downloads}
      </button>
    </div>
  )
}
