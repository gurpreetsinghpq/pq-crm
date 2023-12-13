"use client"
import MainSidebar from "@/components/custom/main-sidebar"
import { NotificationGetResponse, PermissionResponse, UserProfile } from "../interfaces/interface";
import { TIMEZONE, clearAllNotification, clearNotification, extractName, fetchMyDetails, fetchNotifications, fetchProfileDetailsById, fetchTimeZone, patchNotification, setToken, timeSince } from "@/components/custom/commonFunctions";
import { useCurrentTabStore, useMyProfileStore, usePermissionStore } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TITLES, TITLE_MAP_W_PERMISSION_KEY, TITLE_MAP_W_ROUTE, setInitialParentTitle } from "@/components/dashboard";
import { useFormSchemaHook } from "@/hooks/useFormSchemaHook";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconLogout, IconNotification, IconSettings, IconUser } from "@/components/icons/svgIcons";
import { disabledSidebarItem, profileCircleClasses } from "../constants/classes";
import { toast } from "@/components/ui/use-toast";
import { valueToAcronym } from "@/components/custom/sideSheet";
import { getContacts } from "@/components/custom/sideSheetTabs/custom-stepper";
import { REMINDER } from "../constants/constants";
import { multiLineStyle2 } from "@/components/custom/table/columns";

let INITIAL_PARENT_TITLE = ''


function removeFirstPath(path: string): string {
    // Split the URL path by "/"
    const pathSegments = path.split('/');

    const newPath = pathSegments.slice(2).join("/")

    return newPath;
}

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const { permissions, setPermissions } = usePermissionStore()
    const pathname = usePathname()

    const searchParams = useSearchParams()
    const { setTab } = useFormSchemaHook()
    const { myDetails, setMyDetails } = useMyProfileStore()
    const { currentTab, setCurrentTab } = useCurrentTabStore()
    const [notificationData, setNotificationData] = useState<NotificationGetResponse[] | undefined>()
    const [notifiactionOpen, setNotificationOpen] = useState<boolean>(false)
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [tabChanging, setTabChanging] = useState<boolean>(false)
    const [tokenDashboard, setTokenForDashboard] = useState<string>("")
    async function getUserPermissions(id: string) {
        const userPermissions: PermissionResponse[] = await fetchProfileDetailsById(id)

        const permissions = userPermissions && userPermissions?.map((val) => ({
            access_category: val.access_category.name,
            access: val.access,
            view: val.view,
            add: val.add,
            change: val.change
        }))

        const permissionsObject: { [key: string]: { access: boolean, view: boolean, add: boolean, change: boolean } } = {};

        if (userPermissions) {
            permissions.forEach((val) => {
                const { access_category, access, view, add, change } = val;
                permissionsObject[access_category] = { access, view, add, change };
            });
        }
        setPermissions(permissionsObject)
        const path = removeFirstPath(pathname)
        const pathMapped = TITLE_MAP_W_ROUTE.get(path) ?? ""
        const tabNameAsPerPermissionObject = TITLE_MAP_W_PERMISSION_KEY.get(pathMapped)
        console.log("replacepath",path,  pathMapped)
        if ((tabNameAsPerPermissionObject && permissionsObject[tabNameAsPerPermissionObject]?.access && permissionsObject[tabNameAsPerPermissionObject]?.view) || (pathMapped === TITLES.MY_ACCOUNT) || (pathMapped === TITLES.ACTIVITIES)) {
            INITIAL_PARENT_TITLE = pathMapped
            setTab(pathMapped, true)
        }
        else {
            if (permissionsObject["Lead"].access && permissionsObject["Lead"].view) {
                INITIAL_PARENT_TITLE = TITLES.LEADS
                setTab(TITLES.LEADS, true)
            } else if (permissionsObject["Prospect"].access && permissionsObject["Prospect"].view) {
                INITIAL_PARENT_TITLE = TITLES.PROSPECTS
                setTab(TITLES.PROSPECTS, true)
            } else if (permissionsObject["Organisation"].access && permissionsObject["Organisation"].view) {
                INITIAL_PARENT_TITLE = TITLES.ACCOUNTS
                setTab(TITLES.ACCOUNTS, true)
            } else if (permissionsObject["Contact"].access && permissionsObject["Contact"].view) {
                INITIAL_PARENT_TITLE = TITLES.CONTACTS
                setTab(TITLES.CONTACTS, true)
            } else if (permissionsObject["User Management"].access && permissionsObject["User Management"].view) {
                INITIAL_PARENT_TITLE = TITLES.USER_MANAGEMENT
                setTab(TITLES.USER_MANAGEMENT, true)
            }
        }

    }
    async function getMyDetails() {
        const data: UserProfile | undefined = await fetchMyDetails()
        if (data) {
            const profileId: string = data.profile.id.toString()
            getUserPermissions(profileId)
            setMyDetails(data)
        }
    }

    useEffect(() => {
        const token = getCookie("token")
        const tokenAsString = String(token)
        setToken(tokenAsString)
        setTokenForDashboard(tokenAsString)
        getMyDetails()
        getTimeZone()
    }, [])

    useEffect(() => {
        getTimeZone()
    }, [])
    async function getTimeZone() {
        const data = await fetchTimeZone()
        if (data) {
            getNotifications()
        }
    }
    async function getNotifications() {
        const notificationData = await fetchNotifications()
        if (notificationData) {
            setNotificationData(notificationData)
        }
    }

    useEffect(() => {
        const intervalId = setInterval(getNotifications, 600000);

        return () => clearInterval(intervalId);
    }, []);

    function getInitials(first_name: string | undefined, last_name: string | undefined) {
        if (first_name && last_name) {
            return `${first_name[0].toUpperCase()}${last_name[0].toUpperCase()} `
        }
        return ""
    }

    function logOut() {
        localStorage.removeItem("user")
        deleteCookie("token")
        router.replace("/signin")
        toast({
            title: "Logged out!",
            variant: "dark"
        })
    }

    async function patchSpecificNotification(id: number, isViewed: boolean) {
        await patchNotification(id, isViewed)
        await getNotifications()
    }
    async function clearSpecificNotification(id: number) {
        await clearNotification(id)
        await getNotifications()
    }

    async function clearAllNotificationLocal() {
        await clearAllNotification()
        await getNotifications()
    }

    return (
        <>
            {tokenDashboard && TIMEZONE  ?
                <div className="flex flex-row h-full w-full">
                    <div className="h-full flex flex-col">
                        <MainSidebar />
                    </div>
                    <div className="flex flex-1 right flex-col">
                        {(currentTab !== TITLES.MY_ACCOUNT && currentTab !== TITLES.USER_MANAGEMENT) ? <div className={`top w-full flex flex-row justify-between items-center px-6 py-5 ${currentTab !== TITLES.USER_MANAGEMENT ? "border-b-2 border-gray-100 " : "pb-2"}`} >
                            <div className="text-xl   ">
                                {currentTab}
                            </div>
                            <div className="flex flex-row ">
                                <div className="flex flex-row items-center gap-6">
                                    <div className="">
                                        <DropdownMenu onOpenChange={setNotificationOpen} open={notifiactionOpen}>
                                            <DropdownMenuTrigger asChild >
                                                <div className="relative cursor-pointer p-[10px] rounded-[6px] bg-gray-100">
                                                    <IconNotification />
                                                    {!notifiactionOpen && notificationData &&
                                                        <div className="absolute w-[25px] h-[25px] flex flex-row justify-center items-center translate-x-[35%] translate-y-[-35%] top-0 right-0 rounded-[15px] bg-[#0085FF] text-white-900 text-[11px]">{notificationData && notificationData.length}</div>
                                                    }
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="min-w-[479px] mr-[30px] p-0" side="bottom" >
                                                {/* <DropdownMenuItem className="p-0 border-b-[1px] border-gray-200 hover:bg-white-900"> */}
                                                <div>
                                                    <div className="inset-shadow  px-[24px] py-[16px] w-full flex flex-col">
                                                        <div className="flex flex-row items-center justify-between w-full">
                                                            <div className="flex flex-row gap-[6px] items-center ">
                                                                <div className="text-header-100 text-md font-medium">
                                                                    Notifications
                                                                </div>
                                                                <div className="bg-[#0085FF] rounded-[15px] h-[30px] w-[30px] flex flex-row justify-center items-center text-white-900 text-sm font-medium p-[4px]">
                                                                    {notificationData && notificationData?.length}
                                                                </div>
                                                            </div>
                                                            <div className={`cursor-pointer rounded-[5px] bg-purple-50 text-purple-500 hover:bg-purple-100 text-[12px] font-medium px-[6px] py-[4px] ${notificationData && notificationData.length === 0 ? disabledSidebarItem : ""}`} onClick={clearAllNotificationLocal}>
                                                                Clear all notification
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="md:max-h-[300px] lg:max-h-[350px] xl:max-h-[400px] 2xl:max-h-[600px] overflow-y-auto w-full">
                                                        {(notificationData && notificationData.length > 0) ? notificationData.map((val, index) => {
                                                            return <div key={val.id} className={`p-[16px] ${index !== notificationData.length - 1 && "border-b-[1px] border-[#DCDEE4]"} hover:bg-gray-50`} >
                                                                <div className="flex flex-row gap-[20px] items-baseline" onClick={() => patchSpecificNotification(val.id, !val.is_viewed)}>
                                                                    <div>
                                                                        {val.is_viewed ?
                                                                            <div className="cursor-pointer" >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                                    <circle cx="5" cy="5" r="5" fill="#D9D9D9" />
                                                                                </svg>
                                                                            </div>
                                                                            :
                                                                            <div className="cursor-pointer" >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                                    <circle cx="5" cy="5" r="5" fill="#7F56D9" />
                                                                                </svg>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col gap-[10px]">
                                                                        <div className="text-sm font-medium text-purple-600">
                                                                            {val.model_name.toLowerCase() === "prospect" ? (typeof val?.data?.lead === "object" ? val?.data?.lead?.organisation?.name : "") : val?.data?.organisation?.name}
                                                                        </div>
                                                                        {val.type.toLowerCase() === "activity reminder" &&
                                                                            <>
                                                                                <div className="text-sm font-medium text-[#696F8C]">
                                                                                    The activity <span className="bg-gray-100 text-gray-600 rounded-[7px] border border-[1px] border-gray-300 px-[6px] py-[5px]"> {val.data.title}</span> scheduled with
                                                                                    <span className="block mt-[5px]">
                                                                                        <span>{getContacts(val.data.contacts.map(val => val.name), true)}</span> <span className="text-sm font-medium text-[#696F8C]"> is due in </span>
                                                                                        <span className="text-gray-700 font-semibold ">{valueToAcronym(val.data.reminder.toString(), REMINDER)}</span>
                                                                                    </span>
                                                                                </div>
                                                                                <div className="text-xs text-[#696F8C] font-medium">
                                                                                    {timeSince(val.created_at)}
                                                                                </div>
                                                                            </>
                                                                        }
                                                                        {
                                                                            val.type.toLowerCase() === "activity assigned" &&
                                                                            <>
                                                                                <div className="text-sm font-medium text-[#696F8C]">
                                                                                    <span className="text-gray-600 font-semibold">{val.data.created_by.name}</span> assigned <span className="bg-gray-100 text-gray-600 rounded-[7px] border border-[1px] border-gray-300 px-[6px] py-[5px]"> {val.data.title}</span> activity to
                                                                                    <span className="block mt-[5px]">
                                                                                        <span className="text-gray-600 font-semibold">{val.data.assigned_to.name}</span> <span className="text-sm font-medium text-[#696F8C]"> scheduled on </span>
                                                                                        <span className="text-gray-700 font-semibold">{multiLineStyle2(val.data.due_date, true)}</span> with <span className="text-gray-600 font-semibold">{getContacts(val.data.contacts.map(val => val.name), true)}</span>
                                                                                    </span>
                                                                                </div>
                                                                                <div className="text-xs text-[#696F8C] font-medium">
                                                                                    {timeSince(val.data.created_at)}
                                                                                </div>
                                                                            </>
                                                                        }
                                                                        {
                                                                            val.type.toLowerCase().includes("owner assigned") &&
                                                                            <>
                                                                                <div className="text-sm font-medium text-[#696F8C]">
                                                                                    <span className="text-gray-600 font-semibold">{extractName(val.description)}</span> assigned ownership for {val.model_name} <span className="bg-gray-100 text-gray-600 rounded-[7px] border border-[1px] border-gray-300 px-[6px] py-[5px]">
                                                                                        {val.model_name.toLowerCase() === "prospect" ? typeof val.data.lead === "object" && val?.data?.lead?.title : val?.data?.title}
                                                                                    </span>
                                                                                    <span className="block mt-[5px]">
                                                                                        to <span className="text-gray-600 font-semibold">{val.data.owner?.name}</span> on <span className="text-gray-700 font-semibold">{multiLineStyle2(val.created_at, true)}</span>

                                                                                    </span>
                                                                                </div>
                                                                                <div className="text-xs text-[#696F8C] font-medium">
                                                                                    {timeSince(val.created_at)}
                                                                                </div>
                                                                            </>
                                                                        }
                                                                        <div>

                                                                        </div>
                                                                    </div>
                                                                    <div onClick={() => clearSpecificNotification(val.id)} className="text-xs text-purple-500 font-medium cursor-pointer">
                                                                        Clear
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }) : <div className="p-[16px] min-h-[400px] bg-purple-50 flex flex-row justify-center">
                                                            <div className="flex flex-col gap-[22px] items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                                    <path d="M38.376 48.0398C39.5195 52.3075 36.9868 56.6942 32.7191 57.8377C28.4514 58.9813 24.0647 56.4486 22.9212 52.1809M29.0441 15.3093C29.8553 13.8498 30.1225 12.0858 29.6562 10.3455C28.7033 6.7891 25.0477 4.67855 21.4912 5.6315C17.9348 6.58444 15.8242 10.24 16.7772 13.7965C17.2435 15.5367 18.3569 16.9308 19.7892 17.7891M43.2957 25.1878C42.3439 21.6354 39.8028 18.6648 36.2314 16.9296C32.66 15.1943 28.3508 14.8364 24.252 15.9347C20.1531 17.033 16.6002 19.4975 14.3749 22.786C12.1497 26.0745 11.4343 29.9176 12.3861 33.47C13.961 39.3475 13.6552 44.0365 12.6606 47.5995C11.5271 51.6605 10.9604 53.6909 11.1135 54.0986C11.2887 54.5651 11.4154 54.6932 11.88 54.8732C12.2861 55.0305 13.9922 54.5734 17.4043 53.6591L49.0445 45.1812C52.4566 44.2669 54.1626 43.8097 54.4356 43.4704C54.748 43.0822 54.7937 42.908 54.7122 42.4164C54.6409 41.9868 53.1349 40.5117 50.1228 37.5616C47.4799 34.9731 44.8706 31.0652 43.2957 25.1878Z" stroke="#7F56D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg>
                                                                <div className="text-[24px] text-gray-700 font-medium">
                                                                    No notification yet!
                                                                </div>
                                                            </div>
                                                        </div>}

                                                    </div>
                                                </div>
                                                {/* </DropdownMenuItem> */}
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </div>
                                    <DropdownMenu onOpenChange={setMenuOpen} open={menuOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <div className={`${profileCircleClasses} ${menuOpen && "outline outline-[4px] outline-gray-200"}`}>
                                                {getInitials(myDetails?.first_name, myDetails?.last_name)}
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="min-w-[300px] mr-[20px] p-0" side="bottom" >
                                            <DropdownMenuItem className="p-0 border-b-[1px] border-gray-200">
                                                <div className="flex flex-row gap-[12px] items-center px-[16px] py-[12px] ">
                                                    <div className={`${profileCircleClasses}`}>
                                                        {getInitials(myDetails?.first_name, myDetails?.last_name)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-700">
                                                            {`${myDetails?.first_name} ${myDetails?.last_name}`}
                                                        </div>
                                                        <div className="text-gray-600 font-normal text-sm">
                                                            {myDetails?.email}
                                                        </div>
                                                        <div className="text-purple-600 font-medium text-sm">
                                                            {myDetails?.profile.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTab(TITLES.MY_ACCOUNT,true)} className="border-b-[1px] border-gray-200">
                                                <div className="flex flex-row gap-[8px] items-center px-[16px] py-[8px] ">
                                                    <IconUser />
                                                    Profile
                                                </div>
                                            </DropdownMenuItem>
                                            {(permissions["User Management"]?.access && permissions["User Management"]?.view) && <DropdownMenuItem onClick={() => setTab(TITLES.USER_MANAGEMENT, true)} className="border-b-[1px] border-gray-200">
                                                <div className="flex flex-row gap-[8px] items-center px-[16px] py-[8px] ">
                                                    <IconSettings color="#344054" />
                                                    Settings
                                                </div>
                                            </DropdownMenuItem>}
                                            <DropdownMenuItem onClick={logOut} >
                                                <div className="flex flex-row gap-[8px] items-center px-[16px] py-[8px]">
                                                    <IconLogout size="16" />
                                                    Logout
                                                </div>
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div> :
                            <div>

                            </div>
                        }
                        {children}
                    </div>
                </div> : <div>Loading...</div>}
        </>
    )
}