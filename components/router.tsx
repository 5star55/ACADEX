'use client'
import React from 'react'
import { useRouter } from 'next/navigation'


export default function Router({children}:{children:React.ReactNode}) {
  const router=useRouter()
  return (
    <button onClick={()=>router.back()}>{children}</button>
  )
}
