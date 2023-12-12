"use client"
import Settings from '@/components/custom/settings'
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook'
import { usePermissionStore, useSettingStore } from '@/store/store'
import React from 'react'

function page() {
    const {UsersForm,ProfilesForm,TeamsForm}= useFormSchemaHook()
    const {isSettingsClicked, setSettingsClicked}= useSettingStore()
    const {permissions} = usePermissionStore()
  return (
    <div className='w-full flex flex-col flex-1'>
        <Settings clicked={isSettingsClicked} usersForm={UsersForm} teamsForm={TeamsForm} profilesForm={ProfilesForm} permissions={permissions["User Management"]}/>
    </div>
  )
}

export default page