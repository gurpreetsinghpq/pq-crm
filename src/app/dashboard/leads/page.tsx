"use client"
import { TIMEZONE } from '@/components/custom/commonFunctions'
import Leads from '@/components/custom/leads'
import MainSidebar from '@/components/custom/main-sidebar'
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook'
import { usePermissionStore } from '@/store/store'
import React from 'react'

function page() {
  const {LeadForm} =useFormSchemaHook()
  const {permissions} = usePermissionStore()
  return (
    <div className='w-full flex flex-col flex-1'>
        <Leads form={LeadForm} permissions={permissions["Lead"]}/>
    </div>
  )
}

export default page