"use client"
import { TIMEZONE } from '@/components/custom/commonFunctions'
import Leads from '@/components/custom/leads'
import MainSidebar from '@/components/custom/main-sidebar'
import MyAccount from '@/components/custom/my-account'
import { TITLES } from '@/components/dashboard'
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook'
import { useMyProfileStore, usePermissionStore } from '@/store/store'
import React from 'react'

function page() {
  
  return (
    <div className='w-full flex flex-col flex-1'>
        <MyAccount />
    </div>
  )
}

export default page