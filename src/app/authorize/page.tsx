"use client"
import { getCookie } from 'cookies-next'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
  const searchParams = useSearchParams()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token_superuser = getCookie("token")
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      sendCode(code)
    }
  }, [])

  async function sendCode(code:string){
    let windowObj:any = window
    setLoading(true)
    try {
      const dataResp = await fetch(`${baseUrl}/hook_docusign/oauth?code=${code}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()
      console.log("windowobj", windowObj)
      setLoading(false)
      if(windowObj.setWindowState){
        windowObj?.setWindowState(result)
      }
      window.opener?.postMessage(result, process.env.NEXT_PUBLIC_DOCUSIGN_URL)
      windowObj.close()
    }
    catch (err: any) {
      setLoading(false)
      window.opener?.postMessage(err, process.env.NEXT_PUBLIC_DOCUSIGN_URL)
      if(windowObj.setWindowState){
        windowObj?.setWindowState(err)
      }
    }
  }

  return (
    <div className='flex flex-row w-full h-full justify-center items-center'>
      {isLoading && <Loader2 className="mr-2 h-10 w-10 animate-spin" />}
    </div>
  )
}

export default page