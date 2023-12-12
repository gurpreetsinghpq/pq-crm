import { UserProfile } from '@/app/interfaces/interface'
import { create } from 'zustand'

export interface SidebarState {
  currentTab: string,
  setCurrentTab: (val: string) => void
}

export interface UserProfileState {
  myDetails: UserProfile,
  setMyDetails: (val: UserProfile) => void
}

export interface SettingState {
  isSettingsClicked: number,
  setSettingsClicked: (val: number) => void
}

type PERMISSIONS_OBJECT = { [key: string]: { access: boolean, view: boolean, add: boolean, change: boolean } }

const permissionsObject: PERMISSIONS_OBJECT = {};

const myDetailsDefault: any = {}

export interface PermissionState {
  permissions: PERMISSIONS_OBJECT,
  setPermissions: (val: PERMISSIONS_OBJECT) => void
}

export const useCurrentTabStore = create<SidebarState>((set) => ({
  currentTab: '',
  setCurrentTab: (val: string) => set((state) => ({ currentTab: val })),
}))

export const useMyProfileStore = create<UserProfileState>((set) => ({
  myDetails: myDetailsDefault,
  setMyDetails(val) {
    set(()=>({myDetails:val}))
  },
}))


export const useSettingStore = create<SettingState>((set) => ({
  isSettingsClicked: 0,
  setSettingsClicked(val: number) {
    set((state) => ({ isSettingsClicked: val }))
  },
}))

export const usePermissionStore = create<PermissionState>((set) => ({
  permissions: permissionsObject,
  setPermissions: (val) => {
    set((state) => ({ permissions: val }))
  },
}))


