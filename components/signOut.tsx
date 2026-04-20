'use client'
import { authClient } from '@/lib/auth-client'
import {LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React from 'react'

export default function SignOut() {
    const router=useRouter()
return (
    <div className='flex justify-center mt-4'>
    <button
      type="button"
      onClick={() =>{
        authClient.signOut()
        router.push('/login')
      } }
      className="inline-flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span>Sign out</span>
    </button>
    </div>
  )
}