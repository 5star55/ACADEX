"use client"

import React from "react"
import { api } from "@/convex/_generated/api"
import { CourseMaterial } from "@/lib/data"
import { useMutation } from "convex/react"
import { useState } from "react"

type DownloadButtonProps = {
  children: React.ReactNode
  href: string
  material: CourseMaterial
}

export default function DownloadButton({
  children,
  href,
  material,
}: DownloadButtonProps) {
  const addDownload = useMutation(api.materials.addDownload)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    if (!href || href === "#" || isDownloading) {
      return
    }

    setIsDownloading(true)

    try {
      await addDownload({ id: material._id })

      const link = document.createElement("a")
      link.href = href
      link.download = ""
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      link.remove()
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <a
      href={href}
      download
      onClick={(event) => {
        void handleDownload(event)
      }}
      aria-disabled={isDownloading}
    >
      {children}
    </a>
  )
}
