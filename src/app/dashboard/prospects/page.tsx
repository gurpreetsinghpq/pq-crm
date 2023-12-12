"use client"
import { TIMEZONE } from '@/components/custom/commonFunctions'
import Leads from '@/components/custom/leads'
import MainSidebar from '@/components/custom/main-sidebar'
import Prospects from '@/components/custom/prospects'
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook'
import { usePermissionStore } from '@/store/store'
import React from 'react'

function page() {
  const {ProspectForm} =useFormSchemaHook()
  const {permissions} = usePermissionStore()
  return (
    <div className='w-full flex flex-col flex-1'>
        <Prospects form={ProspectForm} permissions={permissions["Prospects"]}/>
    </div>
  )
}

export default page