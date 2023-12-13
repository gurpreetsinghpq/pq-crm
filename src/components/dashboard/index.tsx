"use client"
import Prospects from "@/components/custom/prospects"
import { IconAccounts, IconAccounts2, IconContacts, IconDashboard, IconDealsHome, IconHome, IconLeads, IconLineChart, IconLogout, IconNotification, IconPq, IconProfile, IconProspects, IconSettings, IconUser, IconUserManagement } from "@/components/icons/svgIcons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useRef, useState } from "react"
import Leads from "../../components/custom/leads"
import { MyDetailsGetResponse, NotificationGetResponse, Permission, PermissionResponse, User, UserProfile } from "@/app/interfaces/interface"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Accounts from "../custom/accounts"
import Contacts from "../custom/contacts"
import UserManagement from "../custom/userManagement"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { getAllTime, getLast7Days, getThisMonth } from "../ui/date-range-picker"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "../ui/use-toast"
import { ArrowDown, ArrowUp, User2, UserIcon } from "lucide-react"
import { TIMEZONE, clearAllNotification, clearNotification, extractName, fetchMyDetails, fetchNotifications, fetchProfileDetailsById, fetchTimeZone, patchNotification, setToken, timeSince } from "../custom/commonFunctions"
import { disabledSidebarItem, profileCircleClasses } from "@/app/constants/classes"
import { deleteCookie, getCookie } from "cookies-next"
import MyAccount from "../custom/my-account"
import { multiLineStyle2 } from "../custom/table/columns"
import { getContacts } from "../custom/sideSheetTabs/custom-stepper"
import { valueToAcronym, valueToLabel } from "../custom/sideSheet"
import { REMINDER } from "@/app/constants/constants"
import Deals from "../custom/deals"
import { useCreateFilterQueryString } from "@/hooks/useCreateFilterQueryString"
import Settings from "../custom/settings"
import { useCurrentTabStore, useMyProfileStore, usePermissionStore, useSettingStore } from "@/store/store"
import MainSidebar from "../custom/main-sidebar"
import { useFormSchemaHook } from "@/hooks/useFormSchemaHook"




export const TITLES = {
    LEADS: "Leads",
    PROSPECTS: "Prospects",
    DEALS: "Deals",
    ACCOUNTS: "Accounts",
    CONTACTS: "Contacts",
    USER_MANAGEMENT: "User Management",
    MY_ACCOUNT: "My Account",
    My_DASHBOARD: "My Dashboard",
    ACTIVITIES: "Activities"
}

export const TITLE_MAP_W_PERMISSION_KEY = new Map([
    [TITLES.LEADS, "Lead"],
    [TITLES.PROSPECTS, "Prospect"],
    [TITLES.DEALS, "Deal"],
    [TITLES.ACCOUNTS, "Organisation"],
    [TITLES.CONTACTS, "Contact"],
    [TITLES.USER_MANAGEMENT, "User Management"],
])

export const TITLE_MAP_W_ROUTE = new Map([
    ["leads", TITLES.LEADS],
    ["prospects", TITLES.PROSPECTS],
    ["deals", TITLES.DEALS],
    ["accounts", TITLES.ACCOUNTS],
    ["contacts", TITLES.CONTACTS],
    ["settings" ,TITLES.USER_MANAGEMENT],
    ["my-account" ,TITLES.MY_ACCOUNT],
    ["activity" ,TITLES.ACTIVITIES],
])

let INITIAL_PARENT_TITLE = ''

export function setInitialParentTitle(title:string){
    INITIAL_PARENT_TITLE = title
}

// to be removed
// const DUMMY_NOTIFICATION = [
//     {
//         title: "Ola Cabs",
//         activity_name: "Inbound Lead Verification 2",
//         contacts: [
//             {
//                 id: 1,
//                 name: "Raj"
//             },
//             {
//                 id: 2,
//                 name: "Suganth"
//             },
//         ],
//         dueDate: new Date().setMinutes(new Date().getMinutes() + 10),
//         createdAt: new Date()

//     },
//     {
//         title: "CRED",
//         activity_name: "Inbound Lead Verification 2",
//         contacts: [
//             {
//                 id: 1,
//                 name: "Raj"
//             },
//             {
//                 id: 2,
//                 name: "Suganth"
//             },
//         ],
//         dueDate: new Date().setMinutes(new Date().getMinutes() + 10),
//         createdAt: new Date()

//     }
// ]

export default function DashboardComponent() {
    const {currentTab, setCurrentTab} = useCurrentTabStore()
    // const [currentTab, setCurrentTab] = useState(TITLES.PROSPECTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.ACCOUNTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.CONTACTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.USER_MANAGEMENT)
    
    const {permissions, setPermissions} = usePermissionStore()
    const [tokenDashboard, setTokenForDashboard] = useState<string>("")
    const {myDetails, setMyDetails} = useMyProfileStore()
    
    
    const router = useRouter();
    const {isSettingsClicked, setSettingsClicked} = useSettingStore()

    const {LeadForm, ProspectForm, DealsForm, AccountsForm, ContactsForm, ProfilesForm, TeamsForm,UsersForm, setTab } = useFormSchemaHook()

    useEffect(() => {
        const token = getCookie("token")
        const tokenAsString = String(token)
        setToken(tokenAsString)
        setTokenForDashboard(tokenAsString)
    }, [])
    

    

    
    

    function updateParentTitle(title: string, refreshDashboard: boolean = false) {
        if (refreshDashboard) {
            fetchTimeZone()
        }
        setTab(title)
    }

    // to be reomved just for testing user account
    // useEffect(() => {
    //     setInterval(() => {
    //         setTab(TITLES.MY_ACCOUNT)
    //     }, 1000)
    // }, [])

    

    useEffect(()=>{
        // window.history.replaceState(null, '', 'dashboard')
        // router.replace(`dashboard`, undefined)
        
    },[currentTab])
    return <>{tokenDashboard && TIMEZONE ? <div className="flex flex-row h-full w-full">
        <div className="text-teal-700 bg-teal-50 border-teal-600"></div>
        <div className="right flex flex-col w-full h-full">
           
            <div className="bottom flex flex-col flex-1">
                {/* {currentTab === TITLES.LEADS && <Leads form={LeadForm} permissions={permissions["Lead"]} />}
                {currentTab === TITLES.PROSPECTS && <Prospects form={ProspectForm} permissions={permissions["Prospect"]} />}
                {currentTab === TITLES.DEALS && <Deals form={DealsForm} permissions={permissions["Deal"]} />}
                {currentTab === TITLES.ACCOUNTS && <Accounts form={AccountsForm} permissions={permissions["Organisation"]} />}
                {currentTab === TITLES.CONTACTS && <Contacts form={ContactsForm} permissions={permissions["Contact"]} />}
                {currentTab === TITLES.USER_MANAGEMENT && <Settings clicked={isSettingsClicked} usersForm={UsersForm} teamsForm={TeamsForm} profilesForm={ProfilesForm} permissions={permissions["User Management"]}  />}
                {currentTab === TITLES.MY_ACCOUNT && <MyAccount myDetails={myDetails} parentTitles={TITLES} setCurrentParentTab={updateParentTitle} initialParentTitle={INITIAL_PARENT_TITLE} />} */}
            </div>
        </div>
    </div> : <div>Loading...</div>}</>
}
