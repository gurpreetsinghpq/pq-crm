"use client"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

import { useEffect, useState } from "react"
import { DropdownMenuCheckboxItemProps, RadioGroup } from "@radix-ui/react-dropdown-menu"
import DataTable from "./table/datatable"
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import AddLeadDialog from "./addLeadDialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronDownIcon, Loader2, Search } from "lucide-react"
import { UseFormReturn, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "../ui/use-toast"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses, ALL_PROSPECT_STATUSES, PROSPECT_STATUSES, EMPTY_FILTER_QUERY, REGIONS, SOURCES } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconArchive, IconArchive2, IconArrowSquareRight, IconCross, IconInbox, IconLeads, IconProspects, Unverified } from "../icons/svgIcons"
import { DateRangePicker, getThisMonth } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { FilterQuery, IValueLabel, Permission, ProspectsGetResponse, User } from "@/app/interfaces/interface"
// import { getData } from "@/app/dummy/dummydata"
import Loader from "./loader"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { columnsProspects } from "./table/columns-prospect"
import SideSheetProspects from "./sideSheetProspects"
import { arrayToCsvString, csvStringToArray, fetchUserDataList, fetchUserDataListForDrodpdown, getToken, removeUndefinedFromArray, setDateHours } from "./commonFunctions"
import useCreateQueryString from "@/hooks/useCreateQueryString"
import { useCreateFilterQueryString } from "@/hooks/useCreateFilterQueryString"
import { labelToValueArray, valueToLabelArray } from "./sideSheet"
import { useDebounce } from "@/hooks/useDebounce"
import DataTableServer from "./table/datatable-server"

type Checked = DropdownMenuCheckboxItemProps["checked"]



// let tableLeadLength = 0

export interface IChildData {
    row: any
}
let dataFromApi: ProspectsGetResponse[] = []
let totalPageCount: number

const Prospects = ({ form, permissions }: {
    form: UseFormReturn<{
        owners: string[];
        creators: string[];
        regions: string[];
        sources: string[];
        statuses: string[];
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>,
    permissions: Permission
}) => {
    const { toast } = useToast()

    const router = useRouter();
    const watch = form.watch()

    const [data, setLeadData] = useState<ProspectsGetResponse[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true)
    const [isMultiSelectOn, setIsMultiSelectOn] = useState<boolean>(false)
    
    const [isNetworkError, setIsNetworkError] = useState<boolean>(false)
    const [tableLeadLength, setTableLength] = useState<any>()
    const [selectedRowIds, setSelectedRowIds] = useState<[]>()
    const [userList, setUserList] = useState<IValueLabel[]>()
    const [childData, setChildData] = useState<IChildData>()


    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pg = searchParams?.get("page") ?? "1"
    const pageAsNumber = Number(pg)
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
    const per_page = searchParams?.get("limit") ?? "10"
    const perPageAsNumber = Number(per_page)
    const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
    const isArchived = searchParams?.get("archived") ?? "False"
    const createdBy = searchParams?.get("created_by") ?? null
    const searchString = searchParams?.get("lead__title") ?? null
    const createdAtFrom = searchParams?.get("created_at_from") ?? setDateHours(watch.dateRange.range.from, false)
    const createdAtTo = searchParams?.get("created_at_to") ?? setDateHours(watch.dateRange.range.to, true)
    const createdAtSort = searchParams?.get("created_at") ?? null
    // const roleRegion = searchParams?.get("lead__role__region") ?? null
    const owner = searchParams?.get("owner") ?? null
    const status = searchParams?.get("status") ?? null
    const source = searchParams?.get("lead__source") ?? null

    const [isInbox, setIsInbox] = useState<boolean>(true)

    // create param string
    const createQueryString = useCreateQueryString()
    const createFilterQueryString = useCreateFilterQueryString()


    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            fetchProspectData()
        }
    }


    useEffect(() => {
        
    }, [childData?.row])
    function setTableLeadRow(data: any) {
        const selectedRows = data.rows.filter((val: any) => val.getIsSelected())
        setIsMultiSelectOn(selectedRows.length !== 0)
        const ids = selectedRows.map((val: any) => val.original.id)
        setSelectedRowIds(ids)
        setTableLength(data.rows.length)
    }



    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()
    async function fetchProspectData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const createdByQueryParam = createdBy ? `&created_by=${encodeURIComponent(createdBy)}` : '';
            const nameQueryParam = searchString ? `&lead__title=${encodeURIComponent(searchString)}` : '';
            const createdAtFromQueryParam = `&created_at_from=${setDateHours(watch.dateRange.range.from, false)}`;
            const createdAtToQueryParam = `&created_at_to=${setDateHours(watch.dateRange.range.to, true)}`;
            const createdAtSortQueryParam = createdAtSort ? `&created_at=${encodeURIComponent(createdAtSort)}` : '';
            const isArchivedQueryParam = isArchived ? `&archived=${encodeURIComponent(isArchived)}` : '';
            // const roleRegionQueryParam = roleRegion ? `&lead__role__region=${encodeURIComponent(roleRegion)}` : '';
            const ownerQueryParam = owner ? `&owner=${encodeURIComponent(owner)}` : '';
            const statusQueryParam = status ? `&status=${encodeURIComponent(status)}` : '';
            const sourceQueryParam = source ? `&lead__source=${encodeURIComponent(source)}` : '';
           
            const dataResp = await fetch(`${baseUrl}/v1/api/prospect/?page=${pageAsNumber}&limit=${perPageAsNumber}${isArchivedQueryParam}${createdByQueryParam}${nameQueryParam}${createdAtFromQueryParam}${createdAtToQueryParam}${createdAtSortQueryParam}${ownerQueryParam}${statusQueryParam}${sourceQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: ProspectsGetResponse[] = structuredClone(result.data)
           
            dataFromApi = data
            setLeadData(dataFromApi)
            totalPageCount = result.total_pages
            setIsLoading(false)
            if (dataFromApi.length == 0) {
                setTableLength(0)
                setIsMultiSelectOn(false)
                setSelectedRowIds([])
            }
            setIsNetworkError(false)
        }
        catch (err) {
            setIsLoading(false)
            setIsNetworkError(true)
            console.log("error", err)
        }
        
    }
    useEffect(() => {
        setProspectFilter()
    }, [watch.regions, watch.sources, watch.creators, watch.statuses, watch.owners, JSON.stringify(watch.dateRange), ])

    useEffect(() => {
        fetchProspectData()
    }, [pageAsNumber, per_page, isArchived, status, source, owner, createdBy, searchString, createdAtFrom, createdAtTo, createdAtSort])

    useEffect(() => {
        createFilterQueryString([{ filterFieldName: "archived", value: !isInbox ? "True" : "False" }])
    }, [isInbox])


    function setProspectFilter() {
        let regionsQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let sourcesQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let statusesQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let ownerQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdByQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdAtFromQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdAtToQueryParam: FilterQuery = EMPTY_FILTER_QUERY

        if (watch.regions && watch.regions.includes("allRegions")) {
            regionsQueryParam = {
                filterFieldName: "lead__role__region",
                value: null
            }
        }
        else {
            const regionsFilter = valueToLabelArray(watch.regions, REGIONS)
            if (regionsFilter) {
                regionsQueryParam = {
                    filterFieldName: "lead__role__region",
                    value: arrayToCsvString(regionsFilter)
                }
            }
        }

        if (watch.sources && watch.sources.includes("allSources")) {
            sourcesQueryParam = {
                filterFieldName: "lead__source",
                value: null
            }
        }
        else {
            const sourcesFilter = valueToLabelArray(watch.sources, SOURCES)
            if (sourcesFilter) {
                sourcesQueryParam = {
                    filterFieldName: "lead__source",
                    value: arrayToCsvString(sourcesFilter)
                }
            }
        }

        if (watch.statuses && watch.statuses.includes("allStatuses")) {
            statusesQueryParam = {
                filterFieldName: "status",
                value: null
            }
        }
        else {
            const statusesFilter = valueToLabelArray(watch.statuses, ALL_PROSPECT_STATUSES)
            if (statusesFilter) {
                statusesQueryParam = {
                    filterFieldName: "status",
                    value: arrayToCsvString(statusesFilter)
                }
            }
        }


        if (watch.owners && watch.owners.includes("allOwners")) {
            ownerQueryParam = {
                filterFieldName: "owner",
                value: null
            }

        }
        else {
            const ownerFilter = watch.owners
            if (ownerFilter) {
                ownerQueryParam = {
                    filterFieldName: "owner",
                    value: arrayToCsvString(ownerFilter)
                }
            }
        }

        if (watch.creators && watch.creators.includes("allCreators")) {
            createdByQueryParam = {
                filterFieldName: "created_by",
                value: null
            }

        }
        else {
            const creatorFilter = watch.creators
            if (creatorFilter) {
                createdByQueryParam = {
                    filterFieldName: "created_by",
                    value: arrayToCsvString(creatorFilter)
                }
            }
        }

        if (watch.dateRange) {
            createdAtFromQueryParam = {
                filterFieldName: "created_at_from",
                value: setDateHours(watch.dateRange.range.from, false)
            }
            createdAtToQueryParam = {
                filterFieldName: "created_at_to",
                value: setDateHours(watch.dateRange.range.to, true)
            }
        }

        // // table.getColumn("id")?.setFilterValue(filterObj.ids)
        // table.getColumn("title")?.setFilterValue(filterObj.search)
        // table.getColumn("created_at")?.setFilterValue(filterObj.dateRange)
        let leadFilteredData = [regionsQueryParam, sourcesQueryParam, statusesQueryParam, ownerQueryParam, createdByQueryParam, createdAtFromQueryParam, createdAtToQueryParam]
        createFilterQueryString(leadFilteredData)
    }

    const debouncedSearchableFilters = useDebounce(watch.search, 500)

    useEffect(() => {
        const data: FilterQuery[] = [{ filterFieldName: "lead__title", value: debouncedSearchableFilters || null }]
        createFilterQueryString(data)
    }, [debouncedSearchableFilters])

    useEffect(() => {
        // if (searchString) {
        //     form.setValue("search", searchString)
        // }
        // if (roleRegion) {
        //     const data = labelToValueArray(csvStringToArray(roleRegion), REGIONS)
        //     if (data.length > 0) {
        //         form.setValue("regions", removeUndefinedFromArray(data))
        //     }
        // }
        // if (source) {
        //     const data = labelToValueArray(csvStringToArray(source), SOURCES)
        //     if (data.length > 0) {
        //         form.setValue("sources", removeUndefinedFromArray(data))
        //     }
        // }
        // if (status) {
        //     const data = labelToValueArray(csvStringToArray(status), ALL_PROSPECT_STATUSES)
        //     if (data.length > 0) {
        //         form.setValue("statuses", removeUndefinedFromArray(data))
        //     }
        // }
        
        // if (owner) {
        //     const data = csvStringToArray(owner)
        //     if (data.length > 0) {
        //         form.setValue("owners", removeUndefinedFromArray(data))
        //     }
        // }
        // if (createdBy) {
        //     const data = csvStringToArray(createdBy)
        //     if (data.length > 0) {
        //         form.setValue("creators", removeUndefinedFromArray(data))
        //     }
        // }
        
        getUserList()
    }, [])

    const watcher = form.watch()

    async function getUserList() {
        setIsUserDataLoading(true)
        try {
            const userList: any = await fetchUserDataListForDrodpdown()
            setIsUserDataLoading(false)
            setUserList(userList)
        } catch (err) {
            setIsUserDataLoading(false)
            console.error("user fetch error", err)
        }

    }

    useEffect(() => {
        
    }, [watcher])

  


    async function patchArchiveProspectData(ids: number[]) {

        const url = `${baseUrl}/v1/api/prospect/bulk_archive/`;

        try {
            const dataResp = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({ prospects: ids, archive: isInbox }),
                headers: {
                    "Authorization": `Token ${token_superuser}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            const result = await dataResp.json();

            if (result.message === "success") {
                fetchProspectData()
                toast({
                    title: `${ids.length} ${ids.length > 1 ? "Prospects" : "Prospect"} moved to ${isInbox ? "Archive" : "Inbox"} Succesfully!`,
                    variant: "dark"
                })
                return result;
            } else {
                throw new Error("Failed to patch prospect data");
            }
        } catch (err) {
            console.error("Error during patching:", err);
            throw err;
        }
    }

    function archiveApi() {
        
        if (!selectedRowIds) {
            // Handle the case where selectedRowIds is undefined or empty
            console.log("No rows selected for archiving.");
            return;
        }

        const promisePatch = patchArchiveProspectData(selectedRowIds)

        promisePatch
            .then((resp) => {
                // All patching operations are complete
                // You can run your code here
                console.log("All patching operations are done");
                fetchProspectData()

            })
            .catch((error) => {
                console.log("Error during patching:", error);

            });
    }



    return <div className="flex flex-col flex-1">
        <div className="bottom flex-1 flex flex-col">
            <Form {...form}>
                <form>
                    <div className="flex flex-row place-content-between top px-6 py-5 border-b-2 border-gray-100">
                        <div className="w-1/2 flex flex-row gap-4 items-center">
                            <FormField
                                control={form.control}
                                name="search"
                                render={({ field }) => (
                                    <FormItem className="w-2/3">
                                        <FormControl>
                                            <Input placeholder="Search" className="text-md border" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {!form.getValues("queryParamString") && <div className="flex flex-row border border-[1px] border-gray-300 rounded-[8px]">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="button" variant={isInbox ? "default" : "ghost"} className={`rounded-r-none ${isInbox && "bg-purple-600"}`} onClick={() => setIsInbox(true)}>
                                                <IconInbox size={20} color={isInbox ? "white" : "#667085"} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={"bottom"} sideOffset={5}>
                                            Inbox
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="h-[full] w-[1px] bg-gray-300"></div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="button" variant={!isInbox ? "default" : "ghost"} className={`rounded-l-none ${!isInbox && "bg-purple-600"}`} onClick={() => setIsInbox(false)}>
                                                <IconArchive size={20} color={!isInbox ? "white" : "#667085"} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={"bottom"} sideOffset={5} >
                                            Archive
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>}
                        </div>

                    </div>
                    <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                        <div className=" flex items-center flex-row gap-2">
                            <span className="text-sm ">{isLoading ? "Loading..." : data?.length === 0 ? "No Prospects" : isMultiSelectOn ? <span>Selected {selectedRowIds?.length} out of {tableLeadLength} {tableLeadLength > 1 ? "Prospects" : "Prospect"}</span> : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Prospects" : "Prospect"}` : "No Prospects"}</span>
                            {/* {form.getValues("queryParamString") && <div
                                onClick={() => {
                                    window.history.replaceState(null, '', '/dashboard')
                                    location.reload()
                                }}
                                className="rounded-[16px] bg-gray-50 border-[1px] border-gray-200 mix-blend-multiply text-sm px-[12px] py-[4px] flex flex-row gap-[6px] items-center hover:shadow-lg hover:cursor-pointer">
                                {form.getValues("queryParamString")}
                                <IconCross size={14} color={"#98A2B3"} />
                            </div>} */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={"google"} className="p-[8px]" type="button" onClick={() => {
                                            fetchProspectData()

                                        }}>
                                            <Image width={20} height={20} alt="Refresh" src={"/images/refresh.svg"} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" sideOffset={5}>
                                        Refresh
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex-1 flex flex-row gap-3 justify-end">
                            {isMultiSelectOn && !form.getValues("queryParamString") ? <div className="multi-selected flex flex-row gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button disabled={!permissions?.change} variant={"google"} className="flex flex-row gap-2" type="button" >
                                            <IconArchive size={20} color="#344054" />
                                            {isInbox ? "Archive" : "Inbox"}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                                        <div className='w-fit'>
                                            <div className='flex flex-col gap-[32px] min-w-[380px] '>
                                                <div className='flex flex-col gap-[5px]'>
                                                    <div className='text-gray-900 text-lg'>Are you sure you want to continue?</div>
                                                    <div className='text-gray-600 font-normal font text-sm'> <span className="font-bold">{selectedRowIds?.length} {selectedRowIds && selectedRowIds?.length > 1 ? "Prospects" : "Prospect"} </span> will be {isInbox ? "Archived" : "moved to Inbox"}</div>
                                                </div>
                                                <div className='flex flex-row gap-[12px] w-full'>
                                                    <DialogClose asChild>
                                                        <Button type="button" className='text-sm flex-1 font-semibold  px-[38px] py-[10px]' variant={'google'}>Cancel</Button>
                                                    </DialogClose>
                                                    <Button type="button" onClick={archiveApi} className='flex-1 text-sm font-semibold px-[38px] py-[10px]'>{isInbox ? "Archive" : "Confirm"} </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                {/* <Button variant={'default'} className='flex flex-row gap-2' type='button' onClick={() => promoteToProspect()}>Promote to Prospect <IconArrowSquareRight size={20} /></Button> */}
                            </div> :
                                <>
                                    <div>
                                        {/* <DropdownMenu > */}
                                        {/* <DropdownMenuTrigger asChild>
                                        <Button variant="google" className="flex flex-row gap-2 items-center">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="calendar">
                                                    <path id="Icon" d="M17.5 8.33342H2.5M13.3333 1.66675V5.00008M6.66667 1.66675V5.00008M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4388 17.2275 16.9684C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33342C17.5 5.93328 17.5 5.23322 17.2275 4.69844C16.9878 4.22803 16.6054 3.84558 16.135 3.6059C15.6002 3.33341 14.9001 3.33341 13.5 3.33341H6.5C5.09987 3.33341 4.3998 3.33341 3.86502 3.6059C3.39462 3.84558 3.01217 4.22803 2.77248 4.69844C2.5 5.23322 2.5 5.93328 2.5 7.33341V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9684C3.01217 17.4388 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                            </svg>
                                            Last 7 Days
                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                        </Button>
                                    </DropdownMenuTrigger> */}
                                        {/* <DropdownMenuContent className="w-56"> */}
                                        <DateRangePicker
                                            onUpdate={(values) => form.setValue("dateRange", values)}
                                            initialDateFrom={form.getValues("dateRange").range.from}
                                            initialDateTo={form.getValues("dateRange").range.to}
                                            queryParamString={form.getValues("queryParamString")}
                                            align="start"
                                            locale="en-GB"
                                            showCompare={false}
                                        />

                                        {/* </DropdownMenuContent>
                                </DropdownMenu> */}
                                    </div>
                                    {/* <div className="">
                                        <FormField
                                            control={form.control}
                                            name="regions"
                                            render={({ field }) => {

                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Regions', regions)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[160px]">
                                                        {
                                                            regions.map((region) => {
                                                                return <DropdownMenuCheckboxItem
                                                                    key={region.value}
                                                                    checked={region.isDefault && field.value.length === 0 ? true : field.value?.includes(region.value)}
                                                                    onCheckedChange={(checked) => {
                                                                        if ((!checked && field.value.length === 1) || region.value === 'allRegions') {
                                                                            return field.onChange(['allRegions'])
                                                                        } else if (checked && field.value.includes('allRegions') && region.value !== 'allRegions') {
                                                                            return field.onChange([...field.value?.filter((value) => value != 'allRegions'), region.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, region.value]) : field.onChange(field.value?.filter((value) => value != region.value))
                                                                    }}
                                                                >
                                                                    {region.label}
                                                                </DropdownMenuCheckboxItem>
                                                            })
                                                        }
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            }}
                                        />
                                    </div> */}
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="sources"
                                            render={({ field }) => {
                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Sources', sources)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[200px]">
                                                        {
                                                            sources.map((source) => {
                                                                return <DropdownMenuCheckboxItem
                                                                    key={source.value}
                                                                    checked={source.isDefault && field.value.length === 0 ? true : field.value?.includes(source.value)}
                                                                    onCheckedChange={(checked) => {
                                                                        if ((!checked && field.value.length === 1) || source.value === 'allSources') {
                                                                            return field.onChange(['allSources'])
                                                                        } else if (checked && field.value.includes('allSources') && source.value !== 'allSources') {
                                                                            return field.onChange([...field.value?.filter((value) => value != 'allSources'), source.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, source.value]) : field.onChange(field.value?.filter((value) => value != source.value))
                                                                    }}
                                                                >
                                                                    {source.label}
                                                                </DropdownMenuCheckboxItem>
                                                            })
                                                        }
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            }}
                                        />
                                    </div>

                                    <div className="text-md font-medium">
                                        <FormField
                                            control={form.control}
                                            name="statuses"
                                            render={({ field }) => {
                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Statuses', ALL_PROSPECT_STATUSES)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[180px]">
                                                        {
                                                            ALL_PROSPECT_STATUSES.map((status) => {
                                                                return <DropdownMenuCheckboxItem
                                                                    key={status.value}
                                                                    checked={status.isDefault && field.value.length === 0 ? true : field.value?.includes(status.value)}
                                                                    onCheckedChange={(checked) => {
                                                                        if ((!checked && field.value.length === 1) || status.value === 'allStatuses') {
                                                                            return field.onChange(['allStatuses'])
                                                                        } else if (checked && field.value.includes('allStatuses') && status.value !== 'allStatuses') {
                                                                            return field.onChange([...field.value?.filter((value) => value != 'allStatuses'), status.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, status.value]) : field.onChange(field.value?.filter((value) => value != status.value))
                                                                    }}
                                                                >
                                                                    <div className="">
                                                                        <div className={`flex flex-row gap-2 items-center  ${!status.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status.class}`}>
                                                                            {status.icon && <status.icon />}
                                                                            {status.label}
                                                                        </div>
                                                                    </div>
                                                                </DropdownMenuCheckboxItem>
                                                            })
                                                        }
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            }}
                                        />

                                    </div>
                                    <div className='flex flex-col  '>
                                        {/* <FormField
                                    control={form.control}
                                    name="owners"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"google"} className="flex flex-row gap-2">
                                                            {
                                                                field.value ? owners.find((owner) => owner.value === field.value)?.label : "Select Owner"
                                                            }
                                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search owner..." />
                                                        <CommandEmpty>No owners found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {owners.map((owner) => (
                                                                <CommandItem
                                                                    value={owner.label}
                                                                    key={owner.value}
                                                                    onSelect={() => {
                                                                        form.setValue("owners", owner.value)
                                                                    }}
                                                                >
                                                                    <div className="flex flex-row items-center justify-between w-full">
                                                                        {owner.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4 text-purple-600",
                                                                                owner.value === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                /> */}

                                        <FormField
                                            control={form.control}
                                            name="owners"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover modal={true}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                    {isUserDataLoading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />  </> : userList && userList?.length > 0 && formatData(field.value, 'Owners', [{ value: "allOwners", label: "All Owners" }, ...userList])}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="p-0 !w-[230px]">
                                                            <Command>
                                                                <CommandInput placeholder="Search Owner" />
                                                                <CommandEmpty>No Owner found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {userList && userList?.length > 0 && [{ value: "allOwners", label: "All Owners" }, ...userList].map((owner) => (
                                                                            <CommandItem
                                                                                value={owner.label}
                                                                                key={owner.value}
                                                                                onSelect={() => {
                                                                                    if (field.value.length > 0 && field.value.includes("allOwners") && owner.value !== 'allOwners') {
                                                                                        form.setValue("owners", [...field.value.filter((value: string) => value !== 'allOwners'), owner.value])
                                                                                    }
                                                                                    else if ((field.value?.length === 1 && field.value?.includes(owner.value) || owner.value == 'allOwners')) {
                                                                                        form.setValue("owners", ["allOwners"])

                                                                                    }
                                                                                    else if (field.value?.includes(owner.value)) {
                                                                                        form.setValue("owners", field.value?.filter((val: string) => val !== owner.value))
                                                                                    } else {
                                                                                        form.setValue("owners", [...field.value, owner.value])
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {owner.label}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value?.includes(owner.value)
                                                                                                ? "opacity-100"
                                                                                                : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                            </CommandItem>
                                                                        ))}
                                                                    </div>
                                                                </CommandGroup>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormItem>
                                            )}
                                        />

                                    </div>


                                    <div className='flex flex-col  '>
                                        <FormField
                                            control={form.control}
                                            name="creators"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover modal={true}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                    {isUserDataLoading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />  </> : userList && formatData(field.value, 'Creators', [{ value: "allCreators", label: "All Creators" }, ...userList])}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="p-0 !w-[230px]">
                                                            <Command>
                                                                <CommandInput placeholder="Search Creator" />
                                                                <CommandEmpty>No Creator found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {userList && [{ value: "allCreators", label: "All Creators" }, ...userList].map((creator) => (
                                                                            <CommandItem
                                                                                value={creator.label}
                                                                                key={creator.value}
                                                                                onSelect={() => {
                                                                                    if (field.value.length > 0 && field.value.includes("allCreators") && creator.value !== 'allCreators') {
                                                                                        form.setValue("creators", [...field.value.filter((value: string) => value !== 'allCreators'), creator.value])
                                                                                    }
                                                                                    else if ((field.value?.length === 1 && field.value?.includes(creator.value) || creator.value == 'allCreators')) {
                                                                                        form.setValue("creators", ["allCreators"])

                                                                                    }
                                                                                    else if (field.value?.includes(creator.value)) {
                                                                                        form.setValue("creators", field.value?.filter((val: string) => val !== creator.value))
                                                                                    } else {
                                                                                        form.setValue("creators", [...field.value, creator.value])
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {creator.label}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value?.includes(creator.value)
                                                                                                ? "opacity-100"
                                                                                                : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                            </CommandItem>
                                                                        ))}
                                                                    </div>
                                                                </CommandGroup>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                </>}
                        </div>
                    </div>
                </form>
            </Form>
            {
                isLoading ? (<div className="flex flex-row h-[60vh] justify-center items-center">
                    <Loader />
                </div>) : data?.length > 0 ? <div className="tbl w-full flex flex-1 flex-col">
                    {/* <TableContext.Provider value={{ tableLeadLength, setTableLeadRow }}> */}
                    <DataTableServer columns={columnsProspects(setChildDataHandler, patchArchiveProspectData, isInbox, permissions)} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} pageName={"Prospects"} pageCount={totalPageCount}/>
                    {/* </TableContext.Provider> */}
                </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                    {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3  text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                        <IconProspects size="20" />
                    </div>
                        <div>
                            <p className="text-md text-gray-900 font-semibold">{isInbox ? "No Prospects" : "No Archived Prospects"}</p>

                        </div>
                    </>}
                </div>)
            }
            {childData?.row && <SideSheetProspects parentData={{ childData, setChildDataHandler }} permissions={permissions}/>}
        </div>


    </div>
}


function filterInboxOrArchive(data: ProspectsGetResponse[], isInbox: boolean) {
    return data.filter((val) => val.archived !== isInbox)
}

export function formatData(data: any[], plural: string, childOf: IValueLabel[]) {
    const finalString = data.length > 1 ? `${data.length} ${plural}` : childOf.find((item) => item.value === data[0])?.label
    return finalString
}



export default Prospects