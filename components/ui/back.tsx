'use client'

import { useRouter } from "next/navigation"
import {ArrowLeft} from 'lucide-react'

import React from 'react'

export default function Back() {
    const router=useRouter();
  return (
    <div className="mx-5 flex">
        <button onClick={()=>router.back()}><ArrowLeft/></button><button onClick={()=>router.back()}> Go back</button>
    </div>
  )
}


