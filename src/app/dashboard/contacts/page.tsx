"use client"
import { TIMEZONE } from '@/components/custom/commonFunctions'
import Contacts from '@/components/custom/contacts'
import Leads from '@/components/custom/leads'
import MainSidebar from '@/components/custom/main-sidebar'
import Prospects from '@/components/custom/prospects'
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook'
import { usePermissionStore } from '@/store/store'
import React from 'react'

function page() {
  const {ContactsForm} =useFormSchemaHook()
  const {permissions} = usePermissionStore()
  return (
    <div className='w-full flex flex-col flex-1'>
        <Contacts form={ContactsForm} permissions={permissions["Contact"]}/>
    </div>
  )
}

export default page