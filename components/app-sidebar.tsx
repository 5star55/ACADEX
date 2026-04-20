"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from 'next/link'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import SignOut from "./signOut"

export function AppSidebar() {
  const { isMobile, toggleSidebar } = useSidebar()

  return (
    <Sidebar>
      <SidebarContent className="pt-4 md:pt-20">
        {isMobile && (
          <div className="flex justify-end px-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}
        <SidebarMenu className="gap-8 px-2">
        <Link href='/' className="w-fit mx-auto"><Image alt='logo' width={130} height={130} src='/logo.png'/></Link>

        <SidebarMenuItem>
          <SidebarMenuButton asChild className="justify-center text-center">
              <Link href='/materials'>Materials</Link>
           </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
            <SidebarMenuButton asChild className="justify-center text-center">
              <Link href='/courses'>Courses</Link>
            </SidebarMenuButton>
        </SidebarMenuItem>

           <SidebarMenuItem>
            <SidebarMenuButton asChild className="justify-center text-center">
              <Link href='/profile'>Profile</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        
          <SignOut/>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
    </Sidebar>
  )
}
