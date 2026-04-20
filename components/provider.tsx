import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import ConvexClientProvider from "@/components/convex-provider"
import { auth } from "@/lib/auth"
import { useState} from "react"


export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="fixed top-3 left-3 z-50" />
        <ConvexClientProvider>
          <div className="pt-12">{children}</div>
        </ConvexClientProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}


