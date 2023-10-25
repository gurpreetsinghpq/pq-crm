"use client"
import Prospects from "@/components/custom/prospects"
import { IconAccounts, IconAccounts2, IconContacts, IconDashboard, IconDealsHome, IconHome, IconLeads, IconLineChart, IconLogout, IconNotification, IconPq, IconProfile, IconProspects, IconUser, IconUserManagement } from "@/components/icons/svgIcons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useRef, useState } from "react"
import Leads from "../../components/custom/leads"
import { MyDetailsGetResponse, NotificationGetResponse, Permission, PermissionResponse, User, UserProfile } from "@/app/interfaces/interface"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import Accounts from "../custom/accounts"
import Contacts from "../custom/contacts"
import UserManagement from "../custom/userManagement"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { getAllTime, getLast7Days, getThisMonth } from "../ui/date-range-picker"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "../ui/use-toast"
import { ArrowDown, ArrowUp, User2, UserIcon } from "lucide-react"
import { clearAllNotification, clearNotification, fetchMyDetails, fetchNotifications, fetchProfileDetailsById, fetchTimeZone, patchNotification, setToken, timeSince } from "../custom/commonFunctions"
import { disabledSidebarItem, profileCircleClasses } from "@/app/constants/classes"
import { deleteCookie, getCookie } from "cookies-next"
import MyAccount from "../custom/my-account"
import { multiLineStyle2 } from "../custom/table/columns"
import { getContacts } from "../custom/sideSheetTabs/custom-stepper"
import { valueToAcronym, valueToLabel } from "../custom/sideSheet"
import { REMINDER } from "@/app/constants/constants"


const LeadFormSchema = z.object({
    owners: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Owner.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one region.",
    }),
    sources: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one source.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})



const ProspectFormSchema = z.object({
    owners: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Owner.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one region.",
    }),
    sources: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one source.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})


const AccountFormSchema = z.object({
    industries: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    accounts: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    domains: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    segments: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    sizes: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    fundingStages: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    // owners: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one Owner.",
    // }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})


const ContactsFormSchema = z.object({
    designations: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    accounts: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    types: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

const UsersFormSchema = z.object({
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    functions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    profiles: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})


const TeamsFormSchema = z.object({
    teamLeaders: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

const ProfilesFormSchema = z.object({
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

const TITLES = {
    LEADS: "Leads",
    PROSPECTS: "Prospects",
    DEALS: "Deals",
    ACCOUNTS: "Accounts",
    CONTACTS: "Contacts",
    USER_MANAGEMENT: "User Management",
    MY_ACCOUNT: "My Account",
}

let INITIAL_PARENT_TITLE = ''

const DUMMY_NOTIFICATION = [
    {
        title: "Ola Cabs",
        activity_name: "Inbound Lead Verification 2",
        contacts: [
            {
                id: 1,
                name: "Raj"
            },
            {
                id: 2,
                name: "Suganth"
            },
        ],
        dueDate: new Date().setMinutes(new Date().getMinutes() + 10),
        createdAt: new Date()

    },
    {
        title: "CRED",
        activity_name: "Inbound Lead Verification 2",
        contacts: [
            {
                id: 1,
                name: "Raj"
            },
            {
                id: 2,
                name: "Suganth"
            },
        ],
        dueDate: new Date().setMinutes(new Date().getMinutes() + 10),
        createdAt: new Date()

    }
]

export default function DashboardComponent() {
    const [currentTab, setCurrentTab] = useState("")
    // const [currentTab, setCurrentTab] = useState(TITLES.PROSPECTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.ACCOUNTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.CONTACTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.USER_MANAGEMENT)

    const [tokenDashboard, setTokenForDashboard] = useState<string>("")
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(true);
    const [permissions, setPermissions] = useState<{ [key: string]: { access: boolean, view: boolean, add: boolean, change: boolean } }>({});
    const [noPermissionAllowed, setNoPermissionAllowed] = useState<boolean>(false)
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [notifiactionOpen, setNotificationOpen] = useState<boolean>(false)
    const [notificationData, setNotificationData] = useState<NotificationGetResponse[] | undefined>()
    const [myDetails, setMyDetails] = useState<UserProfile>()

    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= 1300 : false
    )


    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 1280)
        }

        window.addEventListener('resize', handleResize)

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        const token = getCookie("token")
        const tokenAsString = String(token)
        setToken(tokenAsString)
        setTokenForDashboard(tokenAsString)

    }, [])

    const router = useRouter();
    const { from, to } = getLast7Days()
    const { fromAllTime, toAllTime } = getAllTime()
    const LeadForm = useForm<z.infer<typeof LeadFormSchema>>({
        resolver: zodResolver(LeadFormSchema),
        defaultValues: {
            regions: ["allRegions"],
            sources: ["allSources"],
            statuses: ["allStatuses"],
            owners: ['allOwners'],
            creators: ['allCreators'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": from,
                    "to": to
                },
                rangeCompare: undefined
            }
        }
    })

    const ProspectForm = useForm<z.infer<typeof ProspectFormSchema>>({
        resolver: zodResolver(ProspectFormSchema),
        defaultValues: {
            regions: ["allRegions"],
            sources: ["allSources"],
            statuses: ["allStatuses"],
            owners: ['allOwners'],
            creators: ['allCreators'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": from,
                    "to": to
                },
                rangeCompare: undefined
            }
        }
    })

    const AccountsForm = useForm<z.infer<typeof AccountFormSchema>>({
        resolver: zodResolver(AccountFormSchema),
        defaultValues: {
            industries: ["allIndustries"],
            accounts: ["allAccounts"],
            domains: ["allDomains"],
            segments: ["allSegments"],
            sizes: ['allSizes'],
            fundingStages: ['allFundingStages'],
            creators: ['allCreators'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": from,
                    "to": to
                },
                rangeCompare: undefined
            }
        }
    })


    const ContactsForm = useForm<z.infer<typeof ContactsFormSchema>>({
        resolver: zodResolver(ContactsFormSchema),
        defaultValues: {
            designations: ["allDesignations"],
            types: ["allTypes"],
            accounts: ["allAccounts"],
            creators: ['allCreators'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": from,
                    "to": to
                },
                rangeCompare: undefined
            }
        }
    })

    const UsersForm = useForm<z.infer<typeof UsersFormSchema>>({
        resolver: zodResolver(UsersFormSchema),
        defaultValues: {
            functions: ["allFunctions"],
            profiles: ["allProfiles"],
            regions: ["allRegions"],
            statuses: ["allStatuses"],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

    const TeamsForm = useForm<z.infer<typeof TeamsFormSchema>>({
        resolver: zodResolver(TeamsFormSchema),
        defaultValues: {
            teamLeaders: ["allTeamLeaders"],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

    const ProfilesForm = useForm<z.infer<typeof ProfilesFormSchema>>({
        resolver: zodResolver(ProfilesFormSchema),
        defaultValues: {
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

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
        if (permissionsObject["Lead"].access && permissionsObject["Lead"].view) {
            INITIAL_PARENT_TITLE = TITLES.LEADS
            setCurrentTab(TITLES.LEADS)
        } else if (permissionsObject["Prospect"].access && permissionsObject["Prospect"].view) {
            INITIAL_PARENT_TITLE = TITLES.PROSPECTS
            setCurrentTab(TITLES.PROSPECTS)
        } else if (permissionsObject["Organisation"].access && permissionsObject["Organisation"].view) {
            INITIAL_PARENT_TITLE = TITLES.ACCOUNTS
            setCurrentTab(TITLES.ACCOUNTS)
        } else if (permissionsObject["Contact"].access && permissionsObject["Contact"].view) {
            INITIAL_PARENT_TITLE = TITLES.CONTACTS
            setCurrentTab(TITLES.CONTACTS)
        } else if (permissionsObject["User Management"].access && permissionsObject["User Management"].view) {
            INITIAL_PARENT_TITLE = TITLES.USER_MANAGEMENT
            setCurrentTab(TITLES.USER_MANAGEMENT)
        } else {
            setNoPermissionAllowed(true)
        }

        console.log("userPermissions fac", permissionsObject["User Management"])
    }
    async function getMyDetails() {
        console.log("inside mydetails")
        const data: UserProfile | undefined = await fetchMyDetails()
        if (data) {
            const profileId: string = data.profile.id.toString()
            getUserPermissions(profileId)
            setMyDetails(data)
        }
    }
    useEffect(() => {
        const userFromLocalstorage = JSON.parse(localStorage.getItem("user") || "")

        getMyDetails()
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

    function scrollDown() {
        if (sidebarRef.current) {
            sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
            setShowScrollButton(false)
        };
    }
    function scrollUp() {
        if (sidebarRef.current) {
            sidebarRef.current.scrollTop = 0;
            setShowScrollButton(true)
        }
    }

    const handleScroll = () => {
        if (sidebarRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;

            // Show the "Scroll to Bottom" button when not at the bottom
            console.log("scrollTop + clientHeight", scrollTop + clientHeight, "scrollHeight", scrollHeight - 20)
            setShowScrollButton(scrollTop + clientHeight < scrollHeight - 20);
        }
    };

    const handleHover = (isHovering: boolean) => {
        if (sidebarRef.current) {
            //   Show/hide the scrollbars on hover/unhover
            sidebarRef.current.style.overflow = isHovering ? 'auto' : 'hidden';
        }
    };

    useEffect(() => {
        if (sidebarRef.current) {
            sidebarRef.current.addEventListener('scroll', handleScroll);

            // Cleanup the event listener on unmount
            return () => {
                sidebarRef?.current?.removeEventListener('scroll', handleScroll);
            };
        }
    }, [sidebarRef.current]);

    function updateParentTitle(title: string, refreshDashboard: boolean = false) {
        if (refreshDashboard) {
            getMyDetails()
            fetchTimeZone()
        }
        setCurrentTab(title)
    }

    // to be reomved just for testing user account
    // useEffect(() => {
    //     setInterval(() => {
    //         setCurrentTab(TITLES.MY_ACCOUNT)
    //     }, 1000)
    // }, [])

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

    return <>{tokenDashboard ? <div className="flex flex-row h-full ">
        <div className="sticky top-0 left-0 left z-[1] flex flex-col px-1  xl:w-20 2xl:w-24  items-center py-6 border-r-2  border-gray-100 border-solid bg-purple-900">
            <div className="h-10 w-10  flex flex-row justify-center  xl:px-1 2xl:px-[0px]">
                <IconPq size={32} />
            </div>
            <div className="flex flex-col overflow-y-auto  pq-sidebar  items-center  xl:px-1 2xl:px-[0px]" ref={sidebarRef} onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={`h-12 w-12 hover:cursor-pointer mt-10 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${disabledSidebarItem}`}>
                                <IconLineChart size={24} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Insights
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={`h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${disabledSidebarItem}`}>
                                <IconDashboard size={24} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Dashboard
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="h-1 w-2/3 my-[24px] border-t-2 border-purple-800"></div>

                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div onClick={() => setCurrentTab(TITLES.LEADS)} className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.LEADS && 'bg-purple-600'} ${!(permissions["Lead"]?.access && permissions["Lead"]?.view) && disabledSidebarItem}`}>
                                <IconLeads size={24} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Leads
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}

                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div onClick={() => setCurrentTab(TITLES.PROSPECTS)} className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.PROSPECTS && 'bg-purple-600'} ${!(permissions["Prospect"]?.access && permissions["Prospect"]?.view) && disabledSidebarItem}`}>
                                <IconProspects size={24} />
                            </div>
                        </TooltipTrigger>
                        <div className="overflow-visible">
                            <TooltipContent side="right" sideOffset={5}>
                                <div >
                                    Prospects
                                </div>
                            </TooltipContent>
                        </div>
                    </Tooltip>
                </TooltipProvider>}
                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div onClick={() => setCurrentTab(TITLES.PROSPECTS)} className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.DEALS && 'bg-purple-600'} ${disabledSidebarItem}`}>
                                <IconDealsHome size={24} />
                            </div>
                        </TooltipTrigger>
                        <div className="overflow-visible">
                            <TooltipContent side="right" sideOffset={5}>
                                <div >
                                    Deal
                                </div>
                            </TooltipContent>
                        </div>
                    </Tooltip>
                </TooltipProvider>}
                <div className="h-1 w-2/3 my-[24px] border-t-2 border-purple-800"></div>
                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div onClick={() => setCurrentTab(TITLES.ACCOUNTS)} className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.ACCOUNTS && 'bg-purple-600'} ${!(permissions["Organisation"]?.access && permissions["Organisation"]?.view) && disabledSidebarItem}`}>
                                <IconAccounts2 size={24} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Accounts
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div onClick={() => setCurrentTab(TITLES.CONTACTS)} className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.CONTACTS && 'bg-purple-600'} ${!(permissions["Contact"]?.access && permissions["Contact"]?.view) && disabledSidebarItem}`}>
                                <IconContacts />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Contacts
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
                <div className="h-1 w-2/3 my-[24px] border-t-2 border-purple-800"></div>

                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div onClick={() => setCurrentTab(TITLES.USER_MANAGEMENT)} className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.USER_MANAGEMENT && 'bg-purple-600'} ${!(permissions["User Management"]?.access && permissions["User Management"]?.view) && disabledSidebarItem}`}>
                                {/* <IconUserManagement /> */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 25 24" fill="none">
                                    <g id="users-02">
                                        <path id="Icon" d="M16.5 3.46776C17.9817 4.20411 19 5.73314 19 7.5C19 9.26686 17.9817 10.7959 16.5 11.5322M18.5 16.7664C20.0115 17.4503 21.3725 18.565 22.5 20M2.5 20C4.44649 17.5226 7.08918 16 10 16C12.9108 16 15.5535 17.5226 17.5 20M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>

                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            User Management
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
                {isSmallScreen && <div className="sticky bottom-0 rounded-full h-[40px] w-[40px] bg-purple-700 flex-row justify-center w-full">
                    {showScrollButton && <div onClick={() => scrollDown()} className="cursor-pointer flex flex-row justify-center"><ArrowDown size={20} color="white" /></div>}
                    {!showScrollButton && <div onClick={() => scrollUp()} className="cursor-pointer flex flex-row justify-center"><ArrowUp size={20} color="white" /></div>}
                </div>}
            </div>

        </div>
        <div className="text-teal-700 bg-teal-50 border-teal-600"></div>
        <div className="right flex flex-col w-full h-full">
            {currentTab !== TITLES.MY_ACCOUNT ? <div className={`top w-full flex flex-row justify-between items-center px-6 py-5 ${currentTab !== TITLES.USER_MANAGEMENT ? "border-b-2 border-gray-100 " : "pb-2"}`} >
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
                                            <div className="absolute w-[25px] h-[25px] flex flex-row justify-center items-center translate-x-[35%] translate-y-[-35%] top-0 right-0 rounded-[15px] bg-[#0085FF] text-white-900">{notificationData && notificationData.length}</div>
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
                                                <div className={`cursor-pointer rounded-[5px] bg-purple-50 text-purple-500 hover:bg-purple-100 text-[12px] font-medium px-[6px] py-[4px] ${notificationData && notificationData.length===0 ? disabledSidebarItem : ""}`} onClick={clearAllNotificationLocal}>
                                                    Clear all notification
                                                </div>
                                            </div>
                                        </div>
                                        <div className="max-h-[600px] overflow-y-auto w-full">
                                            {(notificationData && notificationData.length > 0) ? notificationData.map((val, index) => {
                                                return <div key={val.id} className={`p-[16px] ${index !== notificationData.length - 1 && "border-b-[1px] border-[#DCDEE4]"} hover:bg-gray-50`} >
                                                    <div className="flex flex-row gap-[20px] items-baseline">
                                                        <div>
                                                            {val.is_viewed ?
                                                                <div className="cursor-pointer" onClick={() => patchSpecificNotification(val.id, false)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                        <circle cx="5" cy="5" r="5" fill="#D9D9D9" />
                                                                    </svg>
                                                                </div>
                                                                :
                                                                <div className="cursor-pointer" onClick={() => patchSpecificNotification(val.id, true)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                        <circle cx="5" cy="5" r="5" fill="#7F56D9" />
                                                                    </svg>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="flex-1 flex flex-col gap-[10px]">
                                                            <div className="text-sm font-medium text-purple-600">
                                                                {val.data.organisation.name}
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
                                                                    <div className="text-sm text-[#696F8C] font-medium">
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
                                                                    <div className="text-sm text-[#696F8C] font-medium">
                                                                        {timeSince(val.data.created_at)}
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
                                            }) : <div className="p-[16px] flex flex-row justify-center">No data</div>}

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
                                <DropdownMenuItem onClick={() => setCurrentTab(TITLES.MY_ACCOUNT)} className="border-b-[1px] border-gray-200">
                                    <div className="flex flex-row gap-[8px] items-center px-[16px] py-[8px] ">
                                        <IconUser />
                                        Profile
                                    </div>
                                </DropdownMenuItem>
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
            <div className="bottom flex flex-col flex-1">
                {currentTab === TITLES.LEADS && <Leads form={LeadForm} permissions={permissions["Lead"]} />}
                {currentTab === TITLES.PROSPECTS && <Prospects form={ProspectForm} permissions={permissions["Prospect"]} />}
                {currentTab === TITLES.ACCOUNTS && <Accounts form={AccountsForm} permissions={permissions["Organisation"]} />}
                {currentTab === TITLES.CONTACTS && <Contacts form={ContactsForm} permissions={permissions["Contact"]} />}
                {currentTab === TITLES.USER_MANAGEMENT && <UserManagement usersForm={UsersForm} teamsForm={TeamsForm} profilesForm={ProfilesForm} permissions={permissions["User Management"]} />}
                {currentTab === TITLES.MY_ACCOUNT && <MyAccount myDetails={myDetails} parentTitles={TITLES} setCurrentParentTab={updateParentTitle} initialParentTitle={INITIAL_PARENT_TITLE} />}

            </div>
        </div>
    </div> : <div>Loading...</div>}</>
}
