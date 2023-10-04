"use client"
import Prospects from "@/components/custom/prospects"
import { IconAccounts, IconAccounts2, IconContacts, IconDashboard, IconDealsHome, IconHome, IconLeads, IconLineChart, IconPq, IconProspects, IconUserManagement } from "@/components/icons/svgIcons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useRef, useState } from "react"
import Leads from "../../components/custom/leads"
import { Permission, PermissionResponse, User } from "@/app/interfaces/interface"
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
import { ArrowDown, ArrowUp } from "lucide-react"
import { fetchMyDetails, fetchProfileDetailsById, setToken } from "../custom/commonFunctions"
import { disabledSidebarItem } from "@/app/constants/classes"
import { deleteCookie, getCookie } from "cookies-next"


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
    USER_MANAGEMENT: "User Management"
}

export default function DashboardComponent() {
    const [currentTab, setCurrentTab] = useState("")
    // const [currentTab, setCurrentTab] = useState(TITLES.PROSPECTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.ACCOUNTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.CONTACTS)
    // const [currentTab, setCurrentTab] = useState(TITLES.USER_MANAGEMENT)
    const [user, setUser] = useState<User>()
    const [tokenDashboard, setTokenForDashboard] = useState<string>("")
    const [isScrollDown, setScrollDown] = useState<boolean>(true)
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(true);
    const [permissions, setPermissions] = useState<{ [key: string]: { access: boolean, view: boolean, add: boolean, change: boolean } }>({});
    const [noPermissionAllowed, setNoPermissionAllowed] = useState<boolean>(false)

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

    useEffect(()=>{
        const token = getCookie("token")
        const tokenAsString =String(token) 
        setToken(tokenAsString )
        setTokenForDashboard(tokenAsString )

    },[])

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
        if(permissionsObject["Lead"].access && permissionsObject["Lead"].view){
            setCurrentTab(TITLES.LEADS)
        }else if(permissionsObject["Prospect"].access && permissionsObject["Prospect"].view){
            setCurrentTab(TITLES.PROSPECTS)
        }else if(permissionsObject["Organisation"].access && permissionsObject["Organisation"].view){
            setCurrentTab(TITLES.ACCOUNTS)
        }else if(permissionsObject["Contact"].access && permissionsObject["Contact"].view){
            setCurrentTab(TITLES.CONTACTS)
        }else if(permissionsObject["User Management"].access && permissionsObject["User Management"].view){
            setCurrentTab(TITLES.USER_MANAGEMENT)
        }else{
            setNoPermissionAllowed(true)
        }

        console.log("userPermissions fac", permissionsObject["User Management"])
    }
    async function getMyDetails(){
        console.log("inside mydetails")
        const data = await fetchMyDetails()
        if(data){
            const profileId: string = data.profile.id.toString()
            getUserPermissions(profileId)
        }
    }
    useEffect(() => {
        const userFromLocalstorage = JSON.parse(localStorage.getItem("user") || "")

        getMyDetails()
        setUser(userFromLocalstorage)
    }, [])

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
            setScrollDown(false)
        };
    }
    function scrollUp() {
        if (sidebarRef.current) {
            sidebarRef.current.scrollTop = 0;
            setScrollDown(true)
        }
    }

    const handleScroll = () => {
        if (sidebarRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;

            // Show the "Scroll to Bottom" button when not at the bottom
            setShowScrollButton(scrollTop + clientHeight < scrollHeight - 1);
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
    }, []);

    return  <>{tokenDashboard ? <div className="flex flex-row h-full ">
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
                            <div onClick={() => setCurrentTab(TITLES.LEADS)} className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.LEADS && 'bg-purple-600'} ${!(permissions["Lead"]?.access && permissions["Lead"]?.view) && disabledSidebarItem }`}>
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
                            <div onClick={() => setCurrentTab(TITLES.PROSPECTS)} className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.PROSPECTS && 'bg-purple-600'} ${!(permissions["Prospect"]?.access && permissions["Prospect"]?.view) && disabledSidebarItem }`}>
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
                            <div onClick={() => setCurrentTab(TITLES.PROSPECTS)} className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.DEALS && 'bg-purple-600'} ${ disabledSidebarItem }`}>
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
                            <div onClick={() => setCurrentTab(TITLES.ACCOUNTS)} className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.ACCOUNTS && 'bg-purple-600'} ${!(permissions["Organisation"]?.access && permissions["Organisation"]?.view) && disabledSidebarItem }`}>
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
                            <div onClick={() => setCurrentTab(TITLES.CONTACTS)} className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.CONTACTS && 'bg-purple-600'} ${!(permissions["Contact"]?.access && permissions["Contact"]?.view) && disabledSidebarItem }`}>
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
                            <div onClick={() => setCurrentTab(TITLES.USER_MANAGEMENT)} className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.USER_MANAGEMENT && 'bg-purple-600'} ${!(permissions["User Management"]?.access && permissions["User Management"]?.view) && disabledSidebarItem }`}>
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
            <div className={`top w-full flex flex-row justify-between items-center px-6 py-5 ${currentTab !== TITLES.USER_MANAGEMENT ? "border-b-2 border-gray-100 " : "pb-2"}`} >
                <div className="text-xl   ">
                    {currentTab}
                </div>
                <div className="flex flex-row ">
                    <div className="flex flex-row items-center gap-6">
                        <div className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g id="bell-01">
                                    <path id="Icon" d="M7.79514 17.5001C8.38275 18.0187 9.15462 18.3334 10 18.3334C10.8454 18.3334 11.6172 18.0187 12.2048 17.5001M15 6.66675C15 5.34067 14.4732 4.0689 13.5355 3.13121C12.5978 2.19353 11.3261 1.66675 10 1.66675C8.67391 1.66675 7.40214 2.19353 6.46446 3.13121C5.52678 4.0689 5 5.34067 5 6.66675C5 9.2419 4.35039 11.005 3.62472 12.1713C3.0126 13.155 2.70654 13.6468 2.71777 13.784C2.73019 13.936 2.76238 13.9939 2.88481 14.0847C2.99538 14.1667 3.49382 14.1667 4.49071 14.1667H15.5093C16.5062 14.1667 17.0046 14.1667 17.1152 14.0847C17.2376 13.9939 17.2698 13.936 17.2822 13.784C17.2934 13.6468 16.9874 13.155 16.3753 12.1713C15.6496 11.005 15 9.2419 15 6.66675Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </svg>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>

                                <div className="w-[40px] h-[40px] p-2 font-semibold cursor-pointer flex flex-row rounded-full justify-center items-center border border-gray-300 bg-gray-100  text-gray-600 text-md">
                                    {getInitials(user?.first_name, user?.last_name)}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem onClick={logOut}>
                                    Logout
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <div className="bottom flex flex-col flex-1">
                {currentTab === TITLES.LEADS && <Leads form={LeadForm} permissions={permissions["Lead"]}/>}
                {currentTab === TITLES.PROSPECTS && <Prospects form={ProspectForm} permissions={permissions["Prospect"]}/>}
                {currentTab === TITLES.ACCOUNTS && <Accounts form={AccountsForm} permissions={permissions["Organisation"]}/>}
                {currentTab === TITLES.CONTACTS && <Contacts form={ContactsForm} permissions={permissions["Contact"]}/>}
                {currentTab === TITLES.USER_MANAGEMENT && <UserManagement usersForm={UsersForm} teamsForm={TeamsForm} profilesForm={ProfilesForm} permissions={permissions["User Management"]}/>}


            </div>
        </div>
    </div>:<div>Loading...</div>}</>
}
