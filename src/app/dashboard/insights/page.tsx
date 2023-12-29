"use client"
import { activeTabSideSheetClasses, commonFontClasses, commonTabListClasses, commonTabTriggerClasses } from '@/app/constants/classes';
import { LEAD_PROSPECT_STATUS, SET_VALUE_CONFIG } from '@/app/constants/constants';
import { DashboardLeads, DashboardProspect, IValueLabel, InsightLeads, InsightProspects, InsightSidebarLead, InsightSidebarProspect, InsightUserDropdown } from '@/app/interfaces/interface';
import { calculatePercentageChange, fetchUserDataList, fetchUserDataListForDrodpdown, replaceHyphenWithEmDash, timeSince } from '@/components/custom/commonFunctions';
import MainSidebar from '@/components/custom/main-sidebar'
import { IconCalendar, IconCircle, IconHourGlass, IconLeads, IconPercent2, IconProspects, IconStopWatch } from '@/components/icons/svgIcons';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { getDateDetails } from '@/components/ui/date-range-picker';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectIcon } from '@radix-ui/react-select';
import { getCookie } from 'cookies-next';
import { Check, ChevronDown, ClipboardSignature, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Tooltip as TooltipRe, Cell } from 'recharts';
import { z } from 'zod';

const TABS = {
    LEADS: "Leads",
    PROSPECTS: "Prospects"
}

function getClassOfStatus(statusName: string) {
    const status = LEAD_PROSPECT_STATUS.find((status) => status.label === statusName)
    const render = <div className={`flex flex-row gap-2 items-center w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status?.class} pl-[8px] pr-[10px] py-[1px]`}>
        {status?.icon && <status.icon />}
        {status?.label}
    </div>
    return render
}

const tabs: IValueLabel[] = [
    { value: "Leads", label: TABS.LEADS },
    { value: "Prospects", label: TABS.PROSPECTS },
];


function aggregateStatusData(status: string, data: any): number[] {
    const result: any[] = data.map((item: any) => ({ [status]: item[status] }));
    console.log("result", result)
    return result;
}


const DateRange: IValueLabel[] = [
    {
        value: "weekly",
        label: `This Week: ${getDateDetails("thisWeek")} `,
        acronym: "from last week"
    },
    {
        value: "monthly",
        label: `This Month: ${getDateDetails("thisMonth")} `,
        acronym: "from last month"
    },
    {
        value: "quarterly",
        label: `This Quarter: ${getDateDetails("thisQuarter")} `,
        acronym: "from last quarter"
    },
    {
        value: "yearly",
        label: `This Year: ${getDateDetails("thisFiscalYear")} `,
        acronym: "from last year"
    }
]

const CustomizedDot = (props: any) => {
    const { cx, cy, stroke, payload, value } = props;

    return <>
        <svg x={cx - 4} y={cy - 4} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="0.75" y="0.75" width="6" height="6" rx="5" fill="white" />
            <rect x="0.75" y="0.75" width="6" height="6" rx="5" stroke="#475467" stroke-width="1.5" />
        </svg>
    </>
};

const ChartCard = ({ title, numberOfEntity, percentage, data, fromCompare }: { title: string, numberOfEntity: number, percentage: string, data: any[], fromCompare: string }) => {
    const dataForChart = data.slice(1).map((val) => ({ [title]: val })).reverse()
    console.log(title, dataForChart)
    const compare = DateRange.find((val) => val.value === fromCompare)?.acronym
    const isDataForChartEmpty = dataForChart.every((val) => val[title] === 0)
    return (
        <div className='w-[300px] xl:w-[330px] px-[24px] py-[20px] flex flex-col  gap-[8px] border-[1px] border-gray-300 rounded-[16px] min-h-[214px]'>
            <div className='text-sm text-gray-600 font-medium'>{title}</div>
            <div className='text-2xl text-black-100'>{numberOfEntity}</div>
            <div className='flex flex-row text-xs font-normal gap-[5px]'>
                <div className='text-black-100'>{percentage}</div>
                <div className='text-gray-500'>{compare}</div>
            </div>
            <ResponsiveContainer width="100%" height="100%" className={`py-[10px]`}>
                <LineChart width={300} height={100} data={dataForChart}>
                    <Line type="monotone" dataKey={title} stroke="#475467" strokeWidth={2} strokeDasharray={isDataForChartEmpty ? "5 5" : "0"} dot={<CustomizedDot />} />
                    {/* <TooltipRe /> */}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

const SideBarCard = ({ icon, title, value = "", subtitle }: { icon: any, title: string, value: string | undefined, subtitle?: string }) => {
    return <div className='py-[16px] px-[24px] border-[1px] border-gray-300 rounded-[16px]'>
        <div className='flex flex-row gap-[12px] '>
            <div className='flex flex-row justify-center items-center rounded-full bg-gray-200 p-[4px] w-[35px] h-[35px] shrink-0'>
                {icon}
            </div>
            <div className='flex flex-col'>
                <div className='text-sm font-medium'>
                    {title}
                </div>
                <div className='flex flex-row items-baseline gap-[5px]'>
                    <div className='text-[24px] text-black-100 font-semibold'>
                        {value === "-" ? "—" : value}
                    </div>
                    {subtitle && <div className='text-gray-500 text-xs font-normal'>
                        {subtitle === "-" ? "—" : subtitle}
                    </div>}
                </div>
            </div>
        </div>
    </div>
}

const renderColorfulLegendText = (value: string, entry: any) => {
    return (
        <span style={{ padding: "6px", }} className='text-sm font-normal text-black-100'>
            <span className='w-[80px] xl:w-[100px] inline-block break-words'>
                {value}
            </span>
            <span className='ml-auto'>
                {`${parseInt(`${entry.payload.percent * 100}`)}%`}
            </span>
        </span>
    );
};




const FormSchema = z.object({
    user: z.string(),
    dateRange: z.string()
})

type PieChartCustom = {
    name: string,
    value: number,
    fill: any
}


function doesPiechartContainsDataToViz(pieChartData: PieChartCustom[]) {
    pieChartData.some((val) => { val.value !== 0 })
    return pieChartData.some((val) => val.value != 0)
}


function page() {

    const [currentTab, setCurrentTab] = useState<string>(TABS.LEADS)

    const [sidebarLeads, setSidebarLeads] = useState<InsightSidebarLead>()
    const [sidebarProspects, setSidebarProspects] = useState<InsightSidebarProspect>()
    const [insightLeads, setInsightLeads] = useState<InsightLeads>()
    const [insightProspects, setInsightProspects] = useState<InsightProspects>()
    const [piechartLead, setPieChartLead] = useState<PieChartCustom[]>()
    const [pieChartInboundLead, setPieChartInboundLead] = useState<PieChartCustom[]>()
    const [pieChartOutboundLead, setPieChartOutboundLead] = useState<PieChartCustom[]>()
    const [pbLead, setPbLead] = useState<FlattenedObject[]>([])
    const [pbProspect, setPbProspect] = useState<FlattenedObject[]>([])
    const [piechartProspect, setPieChartProspect] = useState<PieChartCustom[]>()
    const [leadLoading, setLeadLoading] = useState<boolean>(false)
    const [prospectLoading, setProspectLoading] = useState<boolean>(false)
    const [sidebarLeadLoading, setSidebarLeadLoading] = useState<boolean>(false)
    const [sidebarProspectLoading, setSidebarProspectLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            user: "-1",
            dateRange: DateRange[0].value
        }
    })
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getCookie("token")

    const watch = form.watch()


    useEffect(() => {
        fetchDashboardLeads(watch.dateRange)
        fetchDashboardProspects(watch.dateRange)
    }, [watch.dateRange, watch.user])

    const unverifiedColor = { start: "#FF7A00", end: "#FFD439" }
    const verifiedColor = { start: "#F49062", end: "#FD371F" }
    const junkColor = { start: "#4B73FF", end: "#7CF7FF" }
    const deferredColor = { start: "#6A11CB", end: "#2575FC" }
    const lostColor = { start: "#C7EAFD", end: "#E8198B" }

    const COLORS = {
        Unverified: unverifiedColor,
        Disqualified: unverifiedColor,
        Verified: verifiedColor,
        Qualified: verifiedColor,
        Junk: junkColor,
        Deferred: deferredColor,
        Lost: lostColor,
    }



    function getFillColor(status: string) {
        switch (status) {
            case "Verified":
            case "Qualified":
            case "RA/BDA":
                return "#079455"
                break;
            case "Unverified":
            case "Disqualified":
            case "VC/PE":
                return "#475467"
                break;
            case "Junk":
                return "#7F56D9"
                break;
            case "Lost":
                return "#D92D20"
                break;
            case "Deferred":
                return "#DC6803"
                break;
            case "Referral":
            case "Lead Gen Partner":
                return "#FFB224"
            case "Social Media":
                return "#FB5133"
            case "LinkedIn":
                return "#434CE8"
            case "Email Campaign":
                return "#BA24D5"
            case "Hoardings/Billboards":
                return "#FB4E30"
            case "Events":
                return "#60AAFF"

            default:
                return ""
        }
    }

    interface FlattenedObject {
        [key: string]: any;
    }

    const MAP_KEY_WITH_NEW_NAME: { [key: string]: { newName: string, formatValue: boolean } } = {
        avt: {
            newName: "Avg. Lead Verification Time",
            formatValue: false
        },
        act: {
            newName: "Avg. Lead Closure Time",
            formatValue: false
        },
        lpcr: { newName: "Prospect Conversion Rate", formatValue: false },
        Lost: { newName: "Lost (%)", formatValue: true },
        Deferred: { newName: "Deferred (%)", formatValue: true },
        Junk: { newName: "Junk (%)", formatValue: true },
        Verified: { newName: "Verified (%)", formatValue: true },
        Qualified: { newName: "Qualified (%)", formatValue: true },
        Disqualified: { newName: "Disqualified (%)", formatValue: true },
        pdcr: { newName: "Deal Conversion Rate", formatValue: true },
        Unverified: { newName: "Unverified (%)", formatValue: true },

    }

    function flattenObj(obj: Record<string, any>, parent: string = '', res: FlattenedObject = {}): FlattenedObject {
        for (let key in obj) {
            let propName = parent ? `${parent}_${key}` : key;
            if (typeof obj[key] === 'object') {
                flattenObj(obj[key], propName, res);
            } else {
                const objDetails = MAP_KEY_WITH_NEW_NAME[key as keyof typeof MAP_KEY_WITH_NEW_NAME] || key
                const newNameOfKey = objDetails?.newName
                const value = objDetails?.formatValue ? `${replaceHyphenWithEmDash(obj[key])}%` : replaceHyphenWithEmDash(obj[key])
                console.log("newNameOfKey", newNameOfKey, value)
                res[propName] = {
                    keyName: newNameOfKey || key,
                    value: value
                };
            }
        }
        return res;
    }

    async function fetchDashboardLeads(dateRange: string) {
        const userQueryParam = watch.user != "-1" ? `&user=${encodeURIComponent(watch.user)}` : '';
        setLeadLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/insight/lead/insight_lead/?date_filter=${dateRange}${userQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: InsightLeads = structuredClone(result.data)
            setInsightLeads(data)
            setLeadLoading(false)
            const pieChartData: PieChartCustom[] = createPieChartData(data.status)
            const pieChartInboundData: PieChartCustom[] = createPieChartData(data.inbound_source)
            const pieChartOutboundData: PieChartCustom[] = createPieChartData(data.outbound_source)
            const pbLead = data.pb.map((table) => {
                return flattenObj(table)
            })
            setPbLead(pbLead)
            setPieChartLead(pieChartData)
            setPieChartInboundLead(pieChartInboundData)
            setPieChartOutboundLead(pieChartOutboundData)
            console.log("pieChartData lead", pieChartData)
            console.log("dashboard leads", data)
        }
        catch (err) {
            setLeadLoading(false)
            console.log("error", err)
            return err
        }
    }
    function createPieChartData(data: any[]): PieChartCustom[] {
        return Object.keys(data[0]).map((k) => {
            const d = data[0];
            const fillColor = getFillColor(k);
            const dx = {
                name: k,
                value: Number(d[k as keyof typeof data[0]]),
                fill: fillColor
            };
            return dx;
        });
    }

    async function fetchDashboardProspects(dateRange: string) {
        const userQueryParam = watch.user != "-1" ? `&user=${encodeURIComponent(watch.user)}` : '';
        setProspectLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/insight/prospect/insight_prospect/?date_filter=${dateRange}${userQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: InsightProspects = structuredClone(result.data)
            setInsightProspects(data)
            setProspectLoading(false)
            const pieChartData: PieChartCustom[] = createPieChartData(data.status)
            const pbProspect = data.pb.map((table) => {
                return flattenObj(table)
            })
            setPbProspect(pbProspect)
            setPieChartProspect(pieChartData)
            console.log("pieChartData PROSPECTS", pieChartData)
            console.log("dashboard prospects", data)
        }
        catch (err) {
            setProspectLoading(false)
            console.log("error", err)
            return err
        }
    }

    async function fetchDashboardSidebarLeads() {
        console.log("user", watch.user)
        const userQueryParam = watch.user != "-1" ? `user=${encodeURIComponent(watch.user)}` : '';
        setSidebarLeadLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/insight/lead/summary_with_recent_leads/?${userQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: InsightSidebarLead = structuredClone(result.data)
            setSidebarLeads(data)
            setSidebarLeadLoading(false)
        }
        catch (err) {
            console.log("error", err)
            setSidebarLeadLoading(false)
            return err
        }
    }


    async function fetchDashboardSidebarProspects() {
        const userQueryParam = watch.user != "-1" ? `user=${encodeURIComponent(watch.user)}` : '';
        setSidebarProspectLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/insight/prospect/summary_with_recent_prospects/?${userQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: InsightSidebarProspect = structuredClone(result.data)
            setSidebarProspects(data)
            setSidebarProspectLoading(false)
        }
        catch (err) {
            console.log("error", err)
            setSidebarProspectLoading(false)
            return err
        }
    }


    async function getSidebarData() {
        fetchDashboardSidebarLeads()
        fetchDashboardSidebarProspects()
    }

    useEffect(() => {
        getUserList()
    }, [])
    useEffect(() => {
        getSidebarData()
    }, [watch.user])

    // + {{number}} , - {{number}} when showing comparision
    // daterange picker
    // roundoff to to one decimal point


    const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true)
    const [userList, setUserList] = useState<InsightUserDropdown[]>([])
    const [userListAggAccToProfile, setUserListAggAccToProfile] = useState<{
        [key: string]: InsightUserDropdown[]
    }>({})

    async function getUserList() {
        setIsUserDataLoading(true)
        try {
            const userList: any = await fetchUserDataList()
            setIsUserDataLoading(false)
            const OrgProfile: InsightUserDropdown = {
                value: "-1",
                label: "Purple Quarter",
                function: "NA",
                profile: {
                    id: -1,
                    name: "NA"
                }
            }
            console.log("userList", userList)
            const finalObj: {
                [key: string]: InsightUserDropdown[]
            } = {}
            userList.map((user: InsightUserDropdown) => {
                const profileName = user.profile.name
                if (profileName in finalObj) {
                    finalObj[profileName] = [...finalObj[profileName], user]
                } else {
                    finalObj[profileName] = [user]
                }
            })
            finalObj["Organisation"] = [OrgProfile];
            setUserList([OrgProfile, ...userList]);

            const keyMappings: Record<string, string> = {
                "Team Leader": "Team Lead",
                "Team Member": "Member",
            };

            const keysToKeep = ["Organisation", "Team Leader", "Team Member"];
            const filteredObj: Record<string, any> = {};

            // Add "Organisation" key
            if (keysToKeep.includes("Organisation")) {
                filteredObj["Organisation"] = finalObj["Organisation"];
            }

            // Add "Team Lead" key
            if (keysToKeep.includes("Team Leader")) {
                const teamLeadKey = keyMappings["Team Leader"] || "Team Leader";
                filteredObj[teamLeadKey] = finalObj["Team Leader"];
            }

            // Add "Member" key
            if (keysToKeep.includes("Team Member")) {
                const memberKey = keyMappings["Team Member"] || "Team Member";
                filteredObj[memberKey] = finalObj["Team Member"];
            }

            setUserListAggAccToProfile(filteredObj);

        } catch (err) {
            setIsUserDataLoading(false)
            console.error("user fetch error", err)
        }

    }

    useEffect(() => {
        console.log("currentTab", currentTab)
    }, [currentTab])

    function sumValues(arr: any[]): number {
        let totalSum = 0;

        for (const obj of arr) {
            if (typeof obj === 'object' && obj !== null) {
                for (const value of Object.values(obj) as number[]) {
                    totalSum += value;
                }
            } else {
                console.warn('Skipping non-object value:', obj);
            }
        }

        return totalSum;
    }

    return (
        <>
            <div className='flex flex-row w-full flex-1 min-h-[100vh] '>
                <div className='flex flex-col left flex-1 p-[24px] mb-[40px] overflow-auto '>
                    <Tabs onValueChange={(val) => setCurrentTab(val)} defaultValue={TABS.LEADS} className="flex flex-col w-fit  ">
                        <TabsList className={`${commonTabListClasses} overflow-hidden w-fit`}>
                            {tabs.map((tab) => {
                                return <TabsTrigger className={commonTabTriggerClasses} key={tab.value} value={tab.value} ><div >{tab.label}</div></TabsTrigger>
                            })}
                        </TabsList>
                        <Form {...form}>
                            <form className='flex flex-col gap-[16px] mt-[20px]'>
                                <div className='px-[8px] text-black-100 font-semibold text-sm'>Overview</div>
                                <div className='flex flex-row gap-[10px]'>
                                    <div className='flex flex-col min-w-[200px] '>
                                        <FormField
                                            control={form.control}
                                            name="user"
                                            render={({ field }) => (
                                                <FormItem className='w-full '>
                                                    <Popover modal={true}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {userList.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>User List</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className=" p-0 ">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search" />
                                                                <CommandEmpty>User not found.</CommandEmpty>
                                                                <div className='flex flex-col max-h-[200px] overflow-y-auto '>
                                                                    {Object.keys(userListAggAccToProfile).map((profileOfUser) => {
                                                                        const userDetails = userListAggAccToProfile[profileOfUser]
                                                                        return <div className='flex flex-col gap-[5px] pb-[4px] border-b-[1px] border-gray-300'>
                                                                            <CommandGroup key={profileOfUser} heading={profileOfUser}>
                                                                                {userDetails.map((userInfo) => (
                                                                                    <CommandItem
                                                                                        key={userInfo.value}
                                                                                        value={userInfo.label}
                                                                                        onSelect={() => {
                                                                                            form.setValue("user", userInfo.value, SET_VALUE_CONFIG)
                                                                                        }}
                                                                                        className="text-sm"
                                                                                    >
                                                                                        <div className={`flex flex-row items-center justify-between w-full`}>
                                                                                            <span className={`${profileOfUser === "Organisation" ? "text-md font-medium" : ""} ${(field.value === userInfo.value && profileOfUser === "Organisation") ? "text-purple-800 " : ""}`}>
                                                                                                {userInfo.label}
                                                                                            </span>
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                                    field.value === userInfo.value
                                                                                                        ? "opacity-100"
                                                                                                        : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                        </div>
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </div>
                                                                    })}
                                                                </div>

                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='flex flex-col'>
                                        <FormField
                                            control={form.control}
                                            name="dateRange"
                                            render={({ field }) => (
                                                <FormItem className='w-fit min-w-[200px]'>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClasses} `}>
                                                                <SelectValue placeholder={"Date Range"} />

                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                DateRange?.map((dateRange, index) => {
                                                                    return <SelectItem key={index} value={dateRange.value}>
                                                                        {dateRange.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )} />
                                    </div>
                                </div>
                            </form>
                        </Form>
                        <TabsContent value={TABS.LEADS} className="flex flex-col w-full py-[20px] gap-[20px]">
                            <div className='flex flex-row flex-1 gap-[24px]'>
                                {insightLeads?.total_leads && <ChartCard title='Leads Created or Owned' numberOfEntity={insightLeads?.total_leads[0]} percentage={calculatePercentageChange(insightLeads?.total_leads)} data={insightLeads.total_leads} fromCompare={watch.dateRange} />}
                                {insightLeads?.lptp && <ChartCard title='Leads Promoted to Prospect' numberOfEntity={insightLeads?.lptp[0]} percentage={calculatePercentageChange(insightLeads?.lptp)} data={insightLeads.lptp} fromCompare={watch.dateRange} />}
                            </div>
                            <div className='flex flex-row flex-1 gap-[24px]'>
                                <div className='w-[330px] xl:w-[360px] px-[24px] py-[20px] shrink-0 flex flex-col gap-[8px] border-[1px] border-gray-300 rounded-[16px] '>
                                    <div className='text-black-100 font-semibold'>Leads State Breakdown</div>
                                    <div className='flex flex-col gap-[24px] py-[10px]'>
                                        {
                                            insightLeads?.status && Object.keys(insightLeads.status[0]).map((key: any) => {
                                                const data = insightLeads.status[0]
                                                const dataForChart = aggregateStatusData(key, insightLeads.status.slice(1).reverse())
                                                const isDataForChartEmpty = dataForChart.every((val: any) => val[key] === 0)
                                                return <>
                                                    <div className='flex flex-row justify-between items-center'>
                                                        <div>
                                                            {getClassOfStatus(key)}
                                                        </div>
                                                        <div className='flex flex-row gap-[20px]'>
                                                            <div className='text-[24px] font-medium'>
                                                                {data[key as keyof typeof data]}
                                                            </div>
                                                            <div className='min-w-[100px]'>
                                                                <ResponsiveContainer width="100%" height="100%" >
                                                                    <LineChart width={300} height={100} data={dataForChart}>
                                                                        <Line type="monotone" dataKey={key} stroke="#475467" strokeWidth={2} strokeDasharray={isDataForChartEmpty ? "5 5" : "0"} dot={<CustomizedDot />} />
                                                                    </LineChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='min-w-[420px] xl:min-w-[448px] px-[24px] py-[20px] flex flex-col flex-1 gap-[8px] border-[1px] border-gray-300 rounded-[16px] flex-1'>
                                    <div className='text-black-100 font-semibold'>Leads State Distribution</div>
                                    <div className='w-full h-full'>
                                        {(piechartLead && doesPiechartContainsDataToViz(piechartLead)) ? <div className='w-full h-full'>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart >
                                                    <Pie
                                                        dataKey="value"
                                                        data={piechartLead}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                    />
                                                    <Legend
                                                        iconType="circle"
                                                        layout="vertical"
                                                        verticalAlign='middle'
                                                        align='right'
                                                        iconSize={6}
                                                        formatter={renderColorfulLegendText}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div> : <div className='text-gray-900 text-md font-semibold h-full w-full flex flex-col justify-center items-center'>No Data to Viz.</div>}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row flex-1 gap-[24px]'>
                                <div className='w-[330px] xl:w-[360px] px-[24px] py-[20px] shrink-0 flex flex-col gap-[8px] border-[1px] border-gray-300 rounded-[16px] '>
                                    <div className='flex flex-row justify-between'>
                                        <div className='text-black-100 font-semibold'>Inbound Leads Source Breakdown</div>
                                        <div className='flex flex-row gap-[4px] items-center bg-purple-200 px-[14px] py-[5px] rounded-[10px]'>
                                            <div className='text-sm font-medium w-fit shrink-0 text-gray-700'>Total </div><div className='text-black-900 text-[20px] font-semibold'>{insightLeads?.inbound_source && sumValues(insightLeads.inbound_source)}</div>
                                        </div>
                                    </div>
                                    <div className='w-full h-[1px] bg-gray-400 my-[12px]'>
                                    </div>
                                    <div className='flex flex-col gap-[24px] py-[10px] flex-1 justify-center'>
                                        {
                                            insightLeads?.inbound_source && Object.keys(insightLeads.inbound_source[0]).map((key: any) => {
                                                const data = insightLeads.inbound_source[0]
                                                const dataForChart = aggregateStatusData(key, insightLeads.inbound_source.slice(1).reverse())
                                                const isDataForChartEmpty = dataForChart.every((val: any) => val[key] === 0)
                                                return <>
                                                    <div className='flex flex-row justify-between items-center'>
                                                        <div className='flex flex-row gap-[5px] items-center'>
                                                            <IconCircle size="8" color={getFillColor(key)} /> <span className="text-gray-700 font-medium text-sm"> {key}</span>
                                                        </div>
                                                        <div className='flex flex-row gap-[20px]'>
                                                            <div className='text-[24px] font-medium'>
                                                                {data[key as keyof typeof data]}
                                                            </div>
                                                            <div className='min-w-[100px]'>
                                                                <ResponsiveContainer width="100%" height="100%" >
                                                                    <LineChart width={300} height={100} data={dataForChart}>
                                                                        <Line type="monotone" dataKey={key} stroke="#475467" strokeWidth={2} strokeDasharray={isDataForChartEmpty ? "5 5" : "0"} dot={<CustomizedDot />} />
                                                                    </LineChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='min-w-[420px] xl:min-w-[448px] px-[24px] py-[20px] flex flex-col flex-1 gap-[8px] border-[1px] border-gray-300 rounded-[16px] flex-1 min-h-[320px]'>
                                    <div className='text-black-100 font-semibold'>Inbound Leads Source Distribution</div>
                                    <div className='w-full h-full'>
                                        {(pieChartInboundLead && doesPiechartContainsDataToViz(pieChartInboundLead)) ? <div className='w-full h-full'>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart >
                                                    <Pie
                                                        dataKey="value"
                                                        data={pieChartInboundLead}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                    />
                                                    <Legend
                                                        iconType="circle"
                                                        layout="vertical"
                                                        verticalAlign='middle'
                                                        align='right'
                                                        iconSize={6}
                                                        formatter={renderColorfulLegendText}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div> : <div className='text-gray-900 text-md font-semibold h-full w-full flex flex-col justify-center items-center'>No Data to Viz.</div>}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row flex-1 gap-[24px]'>
                                <div className='w-[330px] xl:w-[360px] px-[24px] py-[20px] shrink-0 flex flex-col gap-[8px] border-[1px] border-gray-300 rounded-[16px] '>
                                    <div className='flex flex-row justify-between'>
                                        <div className='text-black-100 font-semibold'>Outbound Leads Source Breakdown</div>
                                        <div className='flex flex-row gap-[4px] items-center bg-purple-200 px-[14px] py-[5px] rounded-[10px]'>
                                            <div className='text-sm font-medium w-fit shrink-0 text-gray-700'>Total </div><div className='text-black-900 text-[20px] font-semibold'>{insightLeads?.inbound_source && sumValues(insightLeads.inbound_source)}</div>
                                        </div>
                                    </div>
                                    <div className='w-full h-[1px] bg-gray-400 my-[12px]'>
                                    </div>
                                    <div className='flex flex-col gap-[24px] py-[10px] flex-1 justify-center'>
                                        {
                                            insightLeads?.outbound_source && Object.keys(insightLeads.outbound_source[0]).map((key: any) => {
                                                const data = insightLeads.outbound_source[0]
                                                const dataForChart = aggregateStatusData(key, insightLeads.outbound_source.slice(1).reverse())
                                                const isDataForChartEmpty = dataForChart.every((val: any) => val[key] === 0)
                                                return <>
                                                    <div className='flex flex-row justify-between items-center'>
                                                        <div className='flex flex-row gap-[5px] items-center'>
                                                            <IconCircle size="8" color={getFillColor(key)} /> <span className="text-gray-700 font-medium text-sm"> {key}</span>
                                                        </div>
                                                        <div className='flex flex-row gap-[20px]'>
                                                            <div className='text-[24px] font-medium'>
                                                                {data[key as keyof typeof data]}
                                                            </div>
                                                            <div className='min-w-[100px]'>
                                                                <ResponsiveContainer width="100%" height="100%" >
                                                                    <LineChart width={300} height={100} data={dataForChart}>
                                                                        <Line type="monotone" dataKey={key} stroke="#475467" strokeWidth={2} strokeDasharray={isDataForChartEmpty ? "5 5" : "0"} dot={<CustomizedDot />} />
                                                                    </LineChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='min-w-[420px] xl:min-w-[448px] px-[24px] py-[20px] flex flex-col flex-1 gap-[8px] border-[1px] border-gray-300 rounded-[16px] flex-1 min-h-[320px]'>
                                    <div className='text-black-100 font-semibold'>Outbound Leads Source Distribution</div>
                                    <div className='w-full h-full'>
                                        {(pieChartOutboundLead && doesPiechartContainsDataToViz(pieChartOutboundLead)) ? <div className='w-full h-full'>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart >
                                                    <Pie
                                                        dataKey="value"
                                                        data={pieChartOutboundLead}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                    />
                                                    <Legend
                                                        iconType="circle"
                                                        layout="vertical"
                                                        verticalAlign='middle'
                                                        align='right'
                                                        iconSize={6}
                                                        formatter={renderColorfulLegendText}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div> : <div className='text-gray-900 text-md font-semibold h-full w-full flex flex-col justify-center items-center'>No Data to Viz.</div>}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col rounded-[16px] overflow-hidden'>
                                <div className='flex flex-col gap-[5px] top  bg-gradient-to-r from-purple-700 to-purple-600 p-[24px] pb-[8px]'>
                                    <div className='text-white-900 font-semibold text-[17px]'>Performance Benchmarking</div>
                                    <div className='h-[1px] bg-white-900'>
                                    </div>
                                    <div className='flex flex-row justify-between text-sm text-white-900'>
                                        <div className='flex-1'></div>
                                        {
                                            pbLead.map((table) => {
                                                const tableHeading = table.user_name
                                                return <>
                                                    <div className='flex-1 text-center'>{tableHeading.value}</div>
                                                </>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='flex flex-row bottom p-[24px] pt-[10px] bottom-insights-table-bg'>

                                    {
                                        <div className='flex flex-col flex-1 gap-[10px]'>
                                            {pbLead[0] && Object.keys(pbLead[0]).filter((heading) => heading !== "user_name").map((heading => {
                                                const data = pbLead[0][heading]
                                                return <>
                                                    <div className=' text-black-900 text-sm font-medium'>
                                                        {data.keyName}
                                                    </div>
                                                </>
                                            }))}
                                        </div>
                                    }
                                    {
                                        <div className='flex flex-col flex-1 gap-[10px] text-center'>
                                            {pbLead[0] && Object.keys(pbLead[0]).filter((heading) => heading !== "user_name").map((heading => {
                                                const data = pbLead[0][heading]
                                                return <>
                                                    <div className=' text-black-900 text-sm font-medium'>
                                                        {data.value}
                                                    </div>
                                                </>
                                            }))}
                                        </div>
                                    }
                                    {
                                        <div className='flex flex-col flex-1 gap-[10px] text-center'>
                                            {pbLead[1] && Object.keys(pbLead[1]).filter((heading) => heading !== "user_name").map((heading => {
                                                const data = pbLead[1][heading]
                                                return <>
                                                    <div className=' text-black-900 text-sm font-medium'>
                                                        {data.value}
                                                    </div>
                                                </>
                                            }))}
                                        </div>
                                    }

                                </div>

                            </div>

                        </TabsContent>
                        <TabsContent value={TABS.PROSPECTS} className="flex flex-col flex-1 py-[20px] gap-[20px]">
                            <div className='flex flex-row flex-1 gap-[24px]'>
                                {insightProspects?.total_prospects && <ChartCard title='Prospects Created or Owned' numberOfEntity={insightProspects?.total_prospects[0]} percentage={calculatePercentageChange(insightProspects?.total_prospects)} data={insightProspects.total_prospects} fromCompare={watch.dateRange} />}
                                {insightProspects?.pptd && <ChartCard title='Prospect Promoted to Deal' numberOfEntity={insightProspects?.pptd[0]} percentage={calculatePercentageChange(insightProspects?.pptd)} data={insightProspects.pptd} fromCompare={watch.dateRange} />}
                            </div>
                            <div className='flex flex-row flex-1 gap-[24px]'>
                                <div className='w-[330px] xl:w-[360px] px-[24px] py-[20px] shrink-0 flex flex-col gap-[8px] border-[1px] border-gray-300 rounded-[16px] '>
                                    <div className='text-black-100 font-semibold'>Prospects State Breakdown</div>
                                    <div className='flex flex-col gap-[24px] py-[10px]'>
                                        {
                                            insightProspects?.status && Object.keys(insightProspects.status[0]).map((key: any) => {
                                                const data = insightProspects.status[0]
                                                const dataForChart = aggregateStatusData(key, insightProspects.status.slice(1).reverse())
                                                const isDataForChartEmpty = dataForChart.every((val: any) => val[key] === 0)
                                                return <>
                                                    <div className='flex flex-row justify-between items-center'>
                                                        <div>
                                                            {getClassOfStatus(key)}
                                                        </div>
                                                        <div className='flex flex-row gap-[20px]'>
                                                            <div className='text-[24px] font-medium'>
                                                                {data[key as keyof typeof data]}
                                                            </div>
                                                            <div className='min-w-[100px]'>
                                                                <ResponsiveContainer width="100%" height="100%" >
                                                                    <LineChart width={300} height={100} data={dataForChart}>
                                                                        <Line type="monotone" dataKey={key} stroke="#475467" strokeWidth={2} strokeDasharray={isDataForChartEmpty ? "5 5" : "0"} dot={<CustomizedDot />} />
                                                                    </LineChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            })
                                        }
                                    </div>

                                </div>
                                <div className='min-w-[420px] xl:min-w-[448px] px-[24px] py-[20px] flex flex-col flex-1 gap-[8px] border-[1px] border-gray-300 rounded-[16px] flex-1'>
                                    <div className='text-black-100 font-semibold'>Prospects State Distribution</div>
                                    {(piechartProspect && doesPiechartContainsDataToViz(piechartProspect)) ? <div className='w-full h-full'>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart >
                                                <Pie
                                                    dataKey="value"
                                                    data={piechartLead}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                />
                                                <Legend
                                                    iconType="circle"
                                                    layout="vertical"
                                                    verticalAlign='middle'
                                                    align='right'
                                                    iconSize={6}
                                                    formatter={renderColorfulLegendText}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div> : <div className='text-gray-900 text-md font-semibold h-full w-full flex flex-col justify-center items-center'>No Data to Viz.</div>}
                                </div>
                            </div>
                            <div className='flex flex-col rounded-[16px] overflow-hidden'>
                                <div className='flex flex-col gap-[5px] top  bg-gradient-to-r from-purple-700 to-purple-600 p-[24px] pb-[8px]'>
                                    <div className='text-white-900 font-semibold text-[17px]'>Performance Benchmarking</div>
                                    <div className='h-[1px] bg-white-900'>
                                    </div>
                                    <div className='flex flex-row justify-between text-sm text-white-900'>
                                        <div className='flex-1'></div>
                                        {
                                            pbProspect.map((table) => {
                                                const tableHeading = table.user_name
                                                return <>
                                                    <div className='flex-1 text-center'>{tableHeading.value}</div>
                                                </>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='flex flex-row bottom p-[24px] pt-[10px] bottom-insights-table-bg'>

                                    {
                                        <div className='flex flex-col flex-1 gap-[10px]'>
                                            {pbProspect[0] && Object.keys(pbProspect[0]).filter((heading) => heading !== "user_name").map((heading => {
                                                const data = pbProspect[0][heading]
                                                return <>
                                                    <div className=' text-black-900 text-sm font-medium'>
                                                        {data.keyName}
                                                    </div>
                                                </>
                                            }))}
                                        </div>
                                    }
                                    {
                                        <div className='flex flex-col flex-1 gap-[10px] text-center'>
                                            {pbProspect[0] && Object.keys(pbProspect[0]).filter((heading) => heading !== "user_name").map((heading => {
                                                const data = pbProspect[0][heading]
                                                return <>
                                                    <div className=' text-black-900 text-sm font-medium'>
                                                        {data.value}
                                                    </div>
                                                </>
                                            }))}
                                        </div>
                                    }
                                    {
                                        <div className='flex flex-col flex-1 gap-[10px] text-center'>
                                            {pbProspect[1] && Object.keys(pbProspect[1]).filter((heading) => heading !== "user_name").map((heading => {
                                                const data = pbProspect[1][heading]
                                                return <>
                                                    <div className=' text-black-900 text-sm font-medium'>
                                                        {data.value}
                                                    </div>
                                                </>
                                            }))}
                                        </div>
                                    }

                                </div>

                            </div>

                        </TabsContent>
                    </Tabs>
                </div>
                <div className='w-[1px] h-full bg-gray-200'>

                </div>
                <div className='flex flex-col right xl:w-[330px] 2xl:w-[400px] p-[24px] mb-[60px] overflow-y-auto'>
                    {currentTab === TABS.LEADS && <>
                        <div className='flex flex-col gap-[16px]'>
                            {
                                <>
                                    <SideBarCard icon={<IconStopWatch />} title='Avg. Lead Verification Time' value={sidebarLeads?.avt} subtitle='Days/Lead' />
                                    <SideBarCard icon={<IconHourGlass />} title='Avg. Lead Closure Time' value={sidebarLeads?.act} subtitle='Days/Lead' />
                                    <SideBarCard icon={<IconPercent2 size="16" color="#667085" />} title='Prospect Conversion Rate' value={`${replaceHyphenWithEmDash(sidebarLeads?.lpcr)}%`} />
                                </>
                            }
                        </div>
                        <div className='mt-[24px] flex flex-col gap-[16px]'>
                            <div className='text-sm font-semibold'>
                                Recent Leads
                            </div>
                            <div className='px-[16px] py-[24px] border-[1px] border-gray-300 rounded-[16px] flex flex-col gap-[20px] '>
                                {(sidebarLeads?.recent_leads && sidebarLeads?.recent_leads.length > 0) ? sidebarLeads?.recent_leads.map((recentLead) => {
                                    return <div className='flex flex-row justify-between text-xs text-black-100 font-medium'>
                                        <div className='flex flex-col gap-[6px]'>
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='w-[140px] 2xl:w-[180px] truncate text-ellipsis overflow-hidden'>
                                                                {recentLead.title}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {recentLead.title}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div>
                                                {getClassOfStatus(recentLead.status)}
                                            </div>
                                        </div>
                                        <div>
                                            {timeSince(recentLead.created_at)}
                                        </div>
                                    </div>
                                }) : <div className='flex flex-col justify-center items-center gap-[10px] text-gray-900 text-md font-semibold'>
                                    <div className="h-12 w-12 mt-4 p-3  text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                                        <IconLeads size="20" />
                                    </div>
                                    No Leads
                                </div>}
                            </div>
                        </div>
                    </>}
                    {currentTab === TABS.PROSPECTS && <>
                        <div className='flex flex-col gap-[16px]'>
                            {
                                <>
                                    <SideBarCard icon={<IconHourGlass />} title='Avg. Prospect Closure Time' value={sidebarProspects?.act} subtitle='Days/Prospect' />
                                    <SideBarCard icon={<IconPercent2 size="16" color="#667085" />} title='Deal Conversion Rate' value={`${replaceHyphenWithEmDash(sidebarProspects?.pdcr)}%`} />
                                </>
                            }
                        </div>
                        <div className='mt-[24px] flex flex-col gap-[16px]'>
                            <div className='text-sm font-semibold'>
                                Recent Prospects
                            </div>
                            <div className='px-[16px] py-[24px] border-[1px] border-gray-300 rounded-[16px] flex flex-col gap-[20px]'>
                                {(sidebarProspects?.recent_prospects && sidebarProspects?.recent_prospects.length > 0) ? sidebarProspects.recent_prospects.map((recentProspect) => {
                                    return <div className='flex flex-row justify-between text-xs text-black-100 font-medium'>
                                        <div className='flex flex-col gap-[6px]'>
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='w-[180px] truncate text-ellipsis overflow-hidden'>
                                                                {recentProspect.title}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {recentProspect.title}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className='text-xs font-medium text-black-100'>
                                                <div>
                                                    {getClassOfStatus(recentProspect.status)}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {timeSince(recentProspect.created_at)}
                                        </div>
                                    </div>
                                }) : <div className='flex flex-col justify-center items-center gap-[10px] text-gray-900 text-md font-semibold'>
                                    <div className="h-12 w-12 mt-4 p-3  text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                                        <IconProspects size="20" />
                                    </div>
                                    No Prospects
                                </div>}
                            </div>
                        </div>
                    </>}
                </div>
            </div>
            {(leadLoading || prospectLoading || sidebarLeadLoading || sidebarProspectLoading) && <div className='absolute top-0 left-0 w-full h-full flex flex-row justify-center items-center'>
                <Loader2 className="mr-2 h-20 w-20 animate-spin" color='#7F56D9' />
            </div>}
        </>
    )
}

export default page
