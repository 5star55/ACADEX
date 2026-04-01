import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import ConvexClientProvider from "@/components/convex-provider"


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
