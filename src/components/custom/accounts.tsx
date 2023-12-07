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

import { useCallback, useEffect, useState } from "react"
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
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses, INDUSTRIES, ALL_DOMAINS, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_LAST_FUNDING_STAGE, EMPTY_FILTER_QUERY, DOMAINS, SEGMENT, SIZE_OF_COMPANY, LAST_FUNDING_STAGE, CREATORS } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconAccounts2, IconArchive, IconArchive2, IconArrowSquareRight, IconCross, IconInbox, IconLeads, Unverified } from "../icons/svgIcons"
import { DateRangePicker, getThisMonth } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { ClientGetResponse, FilterQuery, IValueLabel, LeadInterface, PatchLead, Permission, User } from "@/app/interfaces/interface"
// import { getData } from "@/app/dummy/dummydata"
import Loader from "./loader"
import { TableContext } from "@/app/helper/context"
import SideSheet, { labelToValueArray, valueToLabel, valueToLabelArray } from "./sideSheet"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Router } from "next/router"
import { RowModel } from "@tanstack/react-table"
import { columnsClient } from "./table/columns-client"
import SideSheetAccounts from "./sideSheetAccounts"
import { arrayToCsvString, csvStringToArray, fetchUserDataList, fetchUserDataListForDrodpdown, getToken, removeUndefinedFromArray, setDateHours } from "./commonFunctions"
import { useDebounce } from "@/hooks/useDebounce"
import DataTableServer from "./table/datatable-server"
import useCreateQueryString from "@/hooks/useCreateQueryString"
import { useCreateFilterQueryString } from "@/hooks/useCreateFilterQueryString"

type Checked = DropdownMenuCheckboxItemProps["checked"]





// let tableLeadLength = 0

export interface IChildData {
    row: any
}
let dataFromApi: LeadInterface[] = []
let totalPageCount: number

const Accounts = ({ form, permissions }: {
    form: UseFormReturn<{
        search: string;
        creators: string[];
        queryParamString: string;
        industries: string[];
        accounts: string[];
        domains: string[];
        segments: string[];
        sizes: string[];
        fundingStages: string[];
        dateRange?: any;
    }, any, undefined>,
    permissions: Permission
}) => {
    const { toast } = useToast()

    const router = useRouter();

    const [data, setClientData] = useState<ClientGetResponse[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isMultiSelectOn, setIsMultiSelectOn] = useState<boolean>(false)
    const [isInbox, setIsInbox] = useState<boolean>(true)
    const [isNetworkError, setIsNetworkError] = useState<boolean>(false)
    const [tableLeadLength, setTableLength] = useState<any>()
    const [selectedRowIds, setSelectedRowIds] = useState<[]>()

    const [childData, setChildData] = useState<IChildData>()
    const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true)
    const [userList, setUserList] = useState<IValueLabel[]>()
    const watch = form.watch()


    // server side data fetching
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pg = searchParams?.get("page") ?? "1"
    const pageAsNumber = Number(pg)
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
    const per_page = searchParams?.get("limit") ?? "10"
    const perPageAsNumber = Number(per_page)
    const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
    const industry = searchParams?.get("industry") ?? null
    const segment = searchParams?.get("segment") ?? null
    const fundingStage = searchParams?.get("last_funding_stage") ?? null
    const createdBy = searchParams?.get("created_by") ?? null
    const searchString = searchParams?.get("name") ?? null
    const createdAtFrom = searchParams?.get("created_at_from") ?? null
    const createdAtTo = searchParams?.get("created_at_to") ?? null
    const createdAtSort = searchParams?.get("created_at") ?? null


    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            fetchData()
        }
    }


    function setTableLeadRow(data: any) {
        const selectedRows = data.rows.filter((val: any) => val.getIsSelected())
        setIsMultiSelectOn(selectedRows.length !== 0)
        const ids = selectedRows.map((val: any) => val.original.id)
        setSelectedRowIds(ids)
        setTableLength(data.rows.length)
    }








    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    async function fetchData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const industryQueryParam = industry ? `&industry=${encodeURIComponent(industry)}` : '';
            const segmentQueryParam = segment ? `&segment=${encodeURIComponent(segment)}` : '';
            const createdByQueryParam = createdBy ? `&created_by=${encodeURIComponent(createdBy)}` : '';
            const lastFundingStageQueryParam = fundingStage ? `&last_funding_stage=${encodeURIComponent(fundingStage)}` : '';
            const nameQueryParam = searchString ? `&name=${encodeURIComponent(searchString)}` : '';
            const createdAtFromQueryParam =  `&created_at_from=${setDateHours(watch.dateRange.range.from, false)}`;
            const createdAtToQueryParam =  `&created_at_to=${setDateHours(watch.dateRange.range.to, true)}`;
            const createdAtSortQueryParam = createdAtSort ? `&created_at=${encodeURIComponent(createdAtSort)}` : '';
            const dataResp = await fetch(`${baseUrl}/v1/api/client/?page=${pageAsNumber}&limit=${perPageAsNumber}${industryQueryParam}${segmentQueryParam}${createdByQueryParam}${nameQueryParam}${lastFundingStageQueryParam}${createdAtFromQueryParam}${createdAtToQueryParam}${createdAtSortQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${getToken()}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: ClientGetResponse[] = structuredClone(result.data)
            let dataFromApi = data
            totalPageCount = result.total_pages
            setClientData(dataFromApi)
            setIsLoading(false)
            if (dataFromApi.length == 0) {
                setTableLength(0)
                setIsMultiSelectOn(false)
                setSelectedRowIds([])
            }
        }
        catch (err) {
            setIsLoading(false)
            setIsNetworkError(true)
            console.log("error", err)
        }
    }

    async function getUserList() {
        setIsUserDataLoading(true)
        try {
            // const userList: any = await fetchUserDataListForDrodpdown()
            const userList: any = await fetchUserDataList()
            setIsUserDataLoading(false)
            setUserList(userList)
        } catch (err) {
            setIsUserDataLoading(false)
            console.error("user fetch error", err)
        }

    }

    useEffect(() => {
        fetchData()
    }, [pageAsNumber, per_page, industry, segment, fundingStage, createdBy, searchString, createdAtFrom, createdAtTo, createdAtSort])


    const createQueryString = useCreateQueryString()
    const createFilterQueryString = useCreateFilterQueryString()
    

    useEffect(() => {
        getUserList()
        // if (searchString) {
        //     form.setValue("search", searchString)
        // }
        // if (industry) {
        //     const data = labelToValueArray(csvStringToArray(industry), INDUSTRIES)
        //     if (data.length > 0) {
        //         form.setValue("industries", removeUndefinedFromArray(data))
        //     }
        // }
        // if (segment) {
        //     const data = labelToValueArray(csvStringToArray(segment), SEGMENT)
        //     if (data.length > 0) {
        //         form.setValue("segments", removeUndefinedFromArray(data))
        //     }
        // }
        // if (fundingStage) {
        //     const data = labelToValueArray(csvStringToArray(fundingStage), LAST_FUNDING_STAGE)
        //     if (data.length > 0) {
        //         form.setValue("fundingStages", removeUndefinedFromArray(data))
        //     }
        // }
        // if (createdBy) {
        //     const data = csvStringToArray(createdBy)
        //     if (data.length > 0) {
        //         form.setValue("creators", removeUndefinedFromArray(data))
        //     }
        // }

        // createFilterQueryString([{filterFieldName:"tab",value:"Organisation"}, { filterFieldName: "created_at_from", value: null }, { filterFieldName: "created_at_to", value: null }])
        
    }, [])



    useEffect(() => {
        setAccountFilter()
    }, [watch.industries, watch.segments, watch.creators, watch.domains, watch.sizes, watch.fundingStages, JSON.stringify(watch.dateRange)])

    function setAccountFilter() {
        let industryQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let segmentQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let domainQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let sizeQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let fundingStageQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdByQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdAtFromQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdAtToQueryParam: FilterQuery = EMPTY_FILTER_QUERY

        if (watch.industries && watch.industries.includes("allIndustries")) {
            industryQueryParam = {
                filterFieldName: "industry",
                value: null
            }
        }
        else {
            const industryFilter = valueToLabelArray(watch.industries, INDUSTRIES)
            if (industryFilter) {
                industryQueryParam = {
                    filterFieldName: "industry",
                    value: arrayToCsvString(industryFilter)
                }
            }
        }

        if (watch.domains && watch.domains.includes("allDomains")) {
            domainQueryParam = {
                filterFieldName: "domain",
                value: null
            }
        }
        else {
            const domainsFilter = valueToLabelArray(watch.domains, DOMAINS)
            if (domainsFilter) {
                domainQueryParam = {
                    filterFieldName: "domain",
                    value: arrayToCsvString(domainsFilter)
                }
            }
        }

        if (watch.segments && watch.segments.includes("allSegments")) {
            segmentQueryParam = {
                filterFieldName: "segment",
                value: null
            }
        }
        else {
            const segmentFilter = valueToLabelArray(watch.segments, SEGMENT)
            if (segmentFilter) {
                segmentQueryParam = {
                    filterFieldName: "segment",
                    value: arrayToCsvString(segmentFilter)
                }
            }
        }

        if (watch.sizes && watch.sizes.includes("allSizes")) {
            sizeQueryParam = {
                filterFieldName: "size",
                value: null
            }

        }
        else {
            const sizeFilter = valueToLabelArray(watch.sizes, SIZE_OF_COMPANY)
            if (sizeFilter) {
                sizeQueryParam = {
                    filterFieldName: "size",
                    value: arrayToCsvString(sizeFilter)
                }
            }
        }

        if (watch.fundingStages && watch.fundingStages.includes("allFundingStages")) {
            fundingStageQueryParam = {
                filterFieldName: "last_funding_stage",
                value: null
            }
        }
        else {
            const fundingStageFilter = valueToLabelArray(watch.fundingStages, LAST_FUNDING_STAGE)
            if (fundingStageFilter) {
                fundingStageQueryParam = {
                    filterFieldName: "last_funding_stage",
                    value: arrayToCsvString(fundingStageFilter)
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


        // table.getColumn("id")?.setFilterValue(filterObj.ids)

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

        let accountFilteredData = [industryQueryParam, segmentQueryParam, domainQueryParam, sizeQueryParam, fundingStageQueryParam, createdByQueryParam, createdAtFromQueryParam, createdAtToQueryParam]
        createFilterQueryString(accountFilteredData)
    }



    const debouncedSearchableFilters = useDebounce(watch.search, 500)

    useEffect(() => {
        const data: FilterQuery[] = [{ filterFieldName: "name", value: debouncedSearchableFilters || null }]
        createFilterQueryString(data)
    }, [debouncedSearchableFilters])


    // useEffect(() => {

    // }, [form.watch])

    // useEffect(() => {
    //     setClientData(filterInboxOrArchive(dataFromApi, isInbox))
    // }, [isInbox])
    // console.log(tableLeadLength)

    async function promoteToProspect() {
        try {
            // const dataResp = await fetch(`${baseUrl}/v1/api/lead/${data.id}/promote/`, { method: "PATCH", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            // const result = await dataResp.json()
            // if (result.message === "success") {
            //     closeSideSheet()
            // }
        }
        catch (err) {
            console.log("error", err)
        }
    }


    async function patchArchiveLeadData(ids: number[]) {

        const url = `${baseUrl}/v1/api/lead/bulk_archive/`;

        try {
            const dataResp = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({ leads: ids, archive: isInbox }),
                headers: {
                    "Authorization": `Token ${getToken()}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            const result = await dataResp.json();

            if (result.message === "success") {
                return result; // Return the result or any data you need
            } else {
                throw new Error("Failed to patch lead data"); // Throw an error for non-success responses
            }
        } catch (err) {
            console.error("Error during patching:", err);
            throw err; // Re-throw the error to be caught by Promise.all
        }
    }

    function archiveApi() {
        console.log(selectedRowIds)
        if (!selectedRowIds) {
            // Handle the case where selectedRowIds is undefined or empty
            console.log("No rows selected for archiving.");
            return;
        }

        const promisePatch = patchArchiveLeadData(selectedRowIds)

        promisePatch
            .then((resp) => {
                // All patching operations are complete
                // You can run your code here
                console.log("All patching operations are done");
                fetchData()

            })
            .catch((error) => {
                console.log("Error during patching:", error);

            });
    }

    const addAccountDialogButton = () => <AddLeadDialog page={"accounts"} fetchLeadData={fetchData} >
        <Button disabled={!permissions?.add} className="flex flex-row gap-2">
            <Image src="/images/plus.svg" alt="plus lead" height={20} width={20} />
            Add Account
        </Button>
    </AddLeadDialog>

    return <div className="flex flex-col flex-1">
        <div className="bottom flex-1 flex flex-col">
            <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-row place-content-between top px-6 py-5 border-b-2 border-gray-100">
                        <div className="w-1/2 flex flex-row gap-4 items-center">
                            <FormField
                                control={form.control}
                                name="search"
                                render={({ field }) => (
                                    <FormItem className="w-2/3">
                                        <FormControl>
                                            <Input onKeyDown={(event) => { return (event.keyCode != 13) }} placeholder="Search" className="text-md border" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {/* to be removed */}
                            {/* {!form.getValues("queryParamString") && <div className="flex flex-row border border-[1px] border-gray-300 rounded-[8px]">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="button" variant={"ghost"} className={`rounded-r-none ${isInbox && "bg-gray-100"}`} onClick={() => setIsInbox(true)}>
                                                <IconInbox size={20} />
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
                                            <Button type="button" variant={"ghost"} className={`rounded-l-none ${!isInbox && "bg-gray-100"}`} onClick={() => setIsInbox(false)}>
                                                <IconArchive size={20} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={"bottom"} sideOffset={5} >
                                            Archive
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>} */}
                        </div>
                        <div className="right flex flex-row gap-4 ">
                            {!form.getValues("queryParamString") && addAccountDialogButton()}

                        </div>
                    </div>
                    <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                        <div className=" flex items-center flex-row gap-2">
                            <span className="text-sm ">{isLoading ? "Loading..." : isMultiSelectOn ? <span>Selected {selectedRowIds?.length} out of {tableLeadLength} {tableLeadLength > 1 ? "Accounts" : "Account"}</span> : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Accounts" : "Account"}` : "No Accounts"}</span>
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
                                        <Button variant={"google"} className="p-[8px]" type="button" onClick={() => fetchData()}>
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
                            <>
                                <div>
                                    <DateRangePicker
                                        onUpdate={(values) => form.setValue("dateRange", values)}
                                        initialDateFrom={form.getValues("dateRange").range.from}
                                        initialDateTo={form.getValues("dateRange").range.to}
                                        queryParamString={form.getValues("queryParamString")}
                                        align="start"
                                        locale="en-GB"
                                        showCompare={false}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="industries"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"google"} className="flex flex-row gap-2">
                                                                {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                {formatData(field.value, 'Industries', INDUSTRIES)}
                                                                <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search Industry" />
                                                            <CommandEmpty>No Industry found.</CommandEmpty>
                                                            <CommandGroup className="flex flex-col h-[250px] overflow-y-scroll">
                                                                {INDUSTRIES.map((industry) => (
                                                                    <CommandItem
                                                                        value={industry.label}
                                                                        key={industry.value}
                                                                        onSelect={() => {
                                                                            if (field.value.length > 0 && field.value.includes("allIndustries") && industry.value !== 'allIndustries') {
                                                                                form.setValue("industries", [...field.value.filter((value) => value !== 'allIndustries'), industry.value])
                                                                            }
                                                                            else if ((field.value?.length === 1 && field.value?.includes(industry.value) || industry.value == 'allIndustries')) {
                                                                                form.setValue("industries", ["allIndustries"])

                                                                            }
                                                                            else if (field.value?.includes(industry.value)) {
                                                                                form.setValue("industries", field.value?.filter((val) => val !== industry.value))
                                                                            } else {
                                                                                form.setValue("industries", [...field.value, industry.value])
                                                                            }
                                                                        }}
                                                                    >
                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                            {industry.label}
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                    field.value?.includes(industry.value)
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
                                    />
                                </div>


                                <div className="text-md font-medium">
                                    <FormField
                                        control={form.control}
                                        name="segments"
                                        render={({ field }) => {
                                            return <DropdownMenu >
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Segments', ALL_SEGMENTS)}
                                                        <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[160px]">
                                                    {
                                                        ALL_SEGMENTS.map((segment) => {
                                                            return <DropdownMenuCheckboxItem
                                                                key={segment.value}
                                                                checked={segment.isDefault && field.value.length === 0 ? true : field.value?.includes(segment.value)}
                                                                onCheckedChange={(checked) => {
                                                                    if ((!checked && field.value.length === 1) || segment.value === 'allSegments') {
                                                                        return field.onChange(['allSegments'])
                                                                    } else if (checked && field.value.includes('allSegments') && segment.value !== 'allSegments') {
                                                                        return field.onChange([...field.value?.filter((value) => value != 'allSegments'), segment.value])
                                                                    }
                                                                    return checked ? field.onChange([...field.value, segment.value]) : field.onChange(field.value?.filter((value) => value != segment.value))
                                                                }}
                                                            >
                                                                <div className="">
                                                                    <div className={`flex flex-row gap-2 items-center ${!segment.isDefault && 'border border-[1.5px] rounded-[16px]'} ${segment.class}`}>
                                                                        {segment.label}
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
                                    <FormField
                                        control={form.control}
                                        name="fundingStages"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"google"} className="flex flex-row gap-2">
                                                                {formatData(field.value, 'Funding Stages', ALL_LAST_FUNDING_STAGE)}
                                                                <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-0 mr-[24px]" >
                                                        <Command>
                                                            <CommandInput placeholder="Search Funding Stage" />
                                                            <CommandEmpty>No Funding Stage found.</CommandEmpty>
                                                            <CommandGroup className=" h-[250px] overflow-y-scroll">
                                                                {ALL_LAST_FUNDING_STAGE.map((fundingStage) => (
                                                                    <CommandItem
                                                                        value={fundingStage.label}
                                                                        key={fundingStage.value}
                                                                        onSelect={() => {
                                                                            if (field.value.length > 0 && field.value.includes("allFundingStages") && fundingStage.value !== 'allFundingStages') {
                                                                                form.setValue("fundingStages", [...field.value.filter((value) => value !== 'allFundingStages'), fundingStage.value])
                                                                            }
                                                                            else if ((field.value?.length === 1 && field.value?.includes(fundingStage.value)) || fundingStage.value == 'allFundingStages') {
                                                                                form.setValue("fundingStages", ["allFundingStages"])
                                                                            }
                                                                            else if (field.value?.includes(fundingStage.value)) {
                                                                                form.setValue("fundingStages", field.value?.filter((val) => val !== fundingStage.value))
                                                                            } else {
                                                                                form.setValue("fundingStages", [...field.value, fundingStage.value])
                                                                            }
                                                                        }}
                                                                    >
                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                            {fundingStage.label}
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                    field.value?.includes(fundingStage.value)
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
                                                    <PopoverContent className="p-0">
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
                            </>
                        </div>
                    </div>
                </form>
            </Form>
            {
                isLoading ? (<div className="flex flex-row h-[60vh] justify-center items-center">
                    <Loader />
                </div>) : data?.length > 0 ? <div className="tbl w-full flex flex-1 flex-col">
                    <DataTableServer columns={columnsClient(setChildDataHandler)} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} pageName={"Accounts"} pageCount={totalPageCount} />
                </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                    {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3 hover:bg-black-900 hover:fill-current text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                        <IconAccounts2 size="24" />
                    </div>
                        <div>
                            <p className="text-md text-gray-900 font-semibold">{isInbox ? "No Accounts" : "No Archive Accounts"}</p>

                        </div>
                        {isInbox && addAccountDialogButton()}</>}
                </div>)
            }
            {childData?.row && <SideSheetAccounts parentData={{ childData, setChildDataHandler }} permissions={permissions} />}
        </div>


    </div>
}

function filterInboxOrArchive(data: LeadInterface[], isInbox: boolean) {
    return data.filter((val) => val.archived !== isInbox)
}

export function formatData(data: any[], plural: string, childOf: IValueLabel[]) {
    const finalString = data.length > 1 ? `${data.length} ${plural}` : childOf.find((item) => item.value === data[0])?.label
    return finalString
}



export default Accounts