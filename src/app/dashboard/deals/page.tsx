"use client"
import { TIMEZONE } from '@/components/custom/commonFunctions'
import Deals from '@/components/custom/deals'
import Leads from '@/components/custom/leads'
import MainSidebar from '@/components/custom/main-sidebar'
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook'
import { usePermissionStore } from '@/store/store'
import React from 'react'

function page() {
  const {DealsForm} =useFormSchemaHook()
  const {permissions} = usePermissionStore()
  return (
    <div className='w-full flex flex-col flex-1'>
        <Deals form={DealsForm} permissions={permissions["Deals"]}/>
    </div>
  )
}

export default page