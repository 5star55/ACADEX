'use client'
import React from 'react'
import { useRouter } from 'next/navigation'


export default function Router({children}:{children:React.ReactNode}) {
  const router=useRouter()
  return (
    <button
      type="button"
      onClick={()=>router.back()}
      className="inline-flex items-center gap-2"
    >
      {children}
    </button>
  )
}
