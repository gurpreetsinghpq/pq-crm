"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function VerifyTokenComonent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const searchParams = useSearchParams()

  useEffect(() => {
    const queryParamUid = searchParams.get("uid")
    const queryParamToken = searchParams.get("token")
    console.log(queryParamUid, queryParamToken)
    if(queryParamToken && queryParamUid){
      verifyTokenApi(queryParamToken,queryParamUid);
    }else{
      console.log("no query param token or uid provided")
    }

  }, [])
  
  async function verifyTokenApi(queryParamToken:string, queryParamUid:string ) {
    try {
      const dataResp = await fetch(`${baseUrl}/v1/api/users/verify_token/`, { method: "POST", body: JSON.stringify({uid:queryParamUid, token:queryParamToken}), headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Token e08e9b0a4c7f0e9e64b14259b40e0a0874a7587b` } });
      const result = await dataResp.json();
      console.log(result);
      setIsLoading(false);
      if(result.status==1){
        router.replace(`/setpassword?uid=${queryParamUid}`);
      }
    }
    catch (err) {
      setIsLoading(false);
      console.log("error", err);
    }
  }
  return (
    <div>

    </div>
  )
}

export default VerifyTokenComonent