import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import ConvexClientProvider from "@/components/convex-provider"
import LightRays from "@/components/LightRays"
import { auth } from "@/lib/auth"


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
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#8be9ff"
          raysSpeed={1.15}
          lightSpread={0.9}
          rayLength={5}
          followMouse={true}
          mouseInfluence={0.18}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={true}
          fadeDistance={1.8}
          saturation={1.15}
        />
      </div>
      <div className="relative z-10">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-transparent">
            <SidebarTrigger className="fixed top-3 left-3 z-50" />
            <ConvexClientProvider>
              <div className="min-h-svh bg-background/55 pt-12 backdrop-blur-[2px]">
                {children}
              </div>
            </ConvexClientProvider>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
