"use client"
import Accounts from '@/components/custom/accounts'
import { TIMEZONE } from '@/components/custom/commonFunctions'
import Deals from '@/components/custom/deals'
import Leads from '@/components/custom/leads'
import MainSidebar from '@/components/custom/main-sidebar'
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook'
import { usePermissionStore } from '@/store/store'
import React from 'react'

function page() {
  const {AccountsForm} =useFormSchemaHook()
  const {permissions} = usePermissionStore()
  return (
    <div className='w-full flex flex-col flex-1'>
        <Accounts form={AccountsForm} permissions={permissions["Accounts"]}/>
    </div>
  )
}

export default page