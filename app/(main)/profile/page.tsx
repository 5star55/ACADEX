'use client'

import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"
import { useQuery } from "convex/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { User } from "lucide-react"
import SignOut from '@/components/signOut'
export default function Page() {
  const { data: sessionData, isPending } = authClient.useSession()
  const userEmail = sessionData?.user.email?.trim() ?? ""
  const userMaterials = useQuery(
    api.materials.listMaterialsByUploaderEmail,
    userEmail ? { uploaderEmail: userEmail } : "skip"
  )
  const materialCount = useQuery(
    api.materials.countMaterialsByUploaderEmail,
    userEmail ? { uploaderEmail: userEmail } : "skip"
  )

  if (isPending) {
    return <div className="mt-10 text-center">Loading profile...</div>
  }

  if (!sessionData) {
    return (
      <div className="mx-auto mt-20 w-full max-w-2xl px-6 text-center">
        <p>You need to log in to view your profile.</p>
        <Link href="/login" className="text-cyan-600 underline underline-offset-4">
          Go to login
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-6 px-6 mb-10">
      <Card>
        <CardHeader>
          <Avatar className="size-8 rounded-full">
  <AvatarImage src="" alt="@shadcn" className="grayscale" />
  <AvatarFallback>{getInitials(sessionData?.user.name)}</AvatarFallback>
</Avatar>

        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{sessionData.user.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{sessionData.user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Uploaded Materials</p>
            <p className="font-medium">{materialCount ?? 0}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {!userMaterials ? (
            <p className="text-sm text-muted-foreground">Loading your uploads...</p>
          ) : userMaterials.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven&apos;t uploaded any materials yet.
            </p>
          ) : (
            <div className="space-y-3">
              {userMaterials.map((material) => (
                <Link
                  key={material._id}
                  href={`/materials/${material._id}`}
                  className="block rounded-lg border p-4 transition hover:border-cyan-500"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{material.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {material.courseCode} | {material.category}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{material.upvotes} upvotes</p>
                      <p>{material.downloads} downloads</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      <div>
        <SignOut/>
      </div>
    </div>
  )
}
