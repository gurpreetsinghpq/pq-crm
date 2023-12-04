"use client"
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      console.log(code, window)
      let windowObj:any = window

      windowObj?.setWindowState("connected")
    }
  }, [])

  async function sendCode(){
    
  }

  return (
    <div>

    </div>
  )
}

export default page