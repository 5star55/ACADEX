import React from 'react'
import {ThumbsUp} from 'lucide-react'
import { Download } from 'lucide-react'
import DownloadButton from "@/components/DownloadButton"
import Link from 'next/link'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Doc } from "@/convex/_generated/dataModel"
import { Button } from './ui/button'
import Engagement from './Engagement'

export default function MaterialCard({ material }: { material: Doc<"materials"> }) {
  return (
    <div>
    <Card>
  <CardHeader>
    <CardTitle>{material.title}</CardTitle>
    <CardDescription>{material.uploaderName} . {material.date}</CardDescription>
    <CardAction>
      <Button asChild>
        <Link href={`/materials/${material._id}`}>Open</Link>
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
   <Engagement material={material}/>

  </CardContent>
  <CardFooter>
    <p>{material.courseCode}</p>
  </CardFooter>
</Card>
    </div>
  )
}
