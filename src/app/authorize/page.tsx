"use client"
import { getCookie } from 'cookies-next'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
  const searchParams = useSearchParams()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token_superuser = getCookie("token")

  useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      sendCode(code)
    }
  }, [])

  async function sendCode(code:string){
    let windowObj:any = window
    try {
      const dataResp = await fetch(`${baseUrl}/hook_docusign/oauth?code=${code}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()
      windowObj?.setWindowState(result)
      windowObj.close()
    }
    catch (err: any) {
      windowObj?.setWindowState(err)
    }
  }

  return (
    <div>

    </div>
  )
}

export default page