"use client"
import Activities from '@/components/custom/activities'
import { TIMEZONE } from '@/components/custom/commonFunctions'
import Deals from '@/components/custom/deals'
import Leads from '@/components/custom/leads'
import MainSidebar from '@/components/custom/main-sidebar'
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook'
import { usePermissionStore } from '@/store/store'
import React from 'react'

function page() {
  const {ActivitiesForm} =useFormSchemaHook()
  const {permissions} = usePermissionStore()
  return (
    <div className='w-full flex flex-col flex-1'>
        <Activities form={ActivitiesForm} />
    </div>
  )
}

export default page