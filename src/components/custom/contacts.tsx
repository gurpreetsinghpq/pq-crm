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
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses, INDUSTRIES, ALL_DOMAINS, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_LAST_FUNDING_STAGE, DESIGNATION, ALL_DESIGNATIONS, ALL_TYPES, EMPTY_FILTER_QUERY, TYPE } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconArchive, IconArchive2, IconArrowSquareRight, IconContacts, IconCross, IconInbox, Unverified } from "../icons/svgIcons"
import { DateRangePicker, getThisMonth } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { ClientGetResponse, ContactsGetResponse, FilterQuery, IValueLabel, LeadInterface, PatchLead, Permission, User } from "@/app/interfaces/interface"
// import { getData } from "@/app/dummy/dummydata"
import Loader from "./loader"
import { TableContext } from "@/app/helper/context"
import SideSheet, { labelToValueArray, valueToLabelArray } from "./sideSheet"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Router } from "next/router"
import { RowModel } from "@tanstack/react-table"
import { columnsClient } from "./table/columns-client"
import { columnsContacts } from "./table/columns-contact"
import SideSheetContacts from "./sideSheetContacts"
import { arrayToCsvString, csvStringToArray, fetchUserDataList, getToken, removeUndefinedFromArray, setDateHours } from "./commonFunctions"
import useCreateQueryString from "@/hooks/useCreateQueryString"
import { useCreateFilterQueryString } from "@/hooks/useCreateFilterQueryString"
import { useDebounce } from "@/hooks/useDebounce"
import DataTableServer from "./table/datatable-server"

type Checked = DropdownMenuCheckboxItemProps["checked"]




// let tableLeadLength = 0

export interface IChildData {
    row: any
}
let dataFromApi: LeadInterface[] = []
let totalPageCount: number

const Contacts = ({ form, permissions }: {
    form: UseFormReturn<{
        designations: string[];
        accounts: string[];
        types: string[];
        creators: string[];
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>,
    permissions: Permission
}) => {
    const { toast } = useToast()

    const router = useRouter();
    const watch = form.watch()

    const [data, setContactData] = useState<ContactsGetResponse[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isMultiSelectOn, setIsMultiSelectOn] = useState<boolean>(false)
    const [isInbox, setIsInbox] = useState<boolean>(true)
    const [isNetworkError, setIsNetworkError] = useState<boolean>(false)
    const [tableLeadLength, setTableLength] = useState<any>()
    const [selectedRowIds, setSelectedRowIds] = useState<[]>()
    const [childData, setChildData] = useState<IChildData>()
    const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true)
    const [userList, setUserList] = useState<IValueLabel[]>()
    const [accountList, setAccountList] = useState<IValueLabel[]>()

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pg = searchParams?.get("page") ?? "1"
    const pageAsNumber = Number(pg)
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
    const per_page = searchParams?.get("limit") ?? "10"
    const perPageAsNumber = Number(per_page)
    const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
    const searchString = searchParams?.get("name") ?? null
    const createdAtFrom = searchParams?.get("created_at_from") ?? null
    const createdAtTo = searchParams?.get("created_at_to") ?? null
    const createdAtSort = searchParams?.get("created_at") ?? null
    const designation = searchParams?.get("designation") ?? null
    const type = searchParams?.get("type") ?? null
    const createdBy = searchParams?.get("created_by") ?? null

    // create param string
    const createQueryString = useCreateQueryString()
    const createFilterQueryString = useCreateFilterQueryString()





    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            fetchLeadData()
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
    const token_superuser = getToken()
    async function fetchLeadData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            
            const nameQueryParam = searchString ? `&name=${encodeURIComponent(searchString)}` : '';
            const typeQueryParam = type ? `&type=${encodeURIComponent(type)}` : '';
            const designationQueryParam = designation ? `&designation=${encodeURIComponent(designation)}` : '';
            const createdAtFromQueryParam = `&created_at_from=${setDateHours(watch.dateRange.range.from, false)}`;
            const createdAtToQueryParam = `&created_at_to=${setDateHours(watch.dateRange.range.to, true)}`;
            const createdAtSortQueryParam = createdAtSort ? `&created_at=${encodeURIComponent(createdAtSort)}` : '';
            const createdByQueryParam = createdBy ? `&created_by=${encodeURIComponent(createdBy)}` : '';
            
            const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/?page=${pageAsNumber}&limit=${perPageAsNumber}${designationQueryParam}${typeQueryParam}${nameQueryParam}${createdAtFromQueryParam}${createdAtToQueryParam}${createdAtSortQueryParam}${createdByQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: ContactsGetResponse[] = structuredClone(result.data)
            let dataFromApi = data
            setContactData(dataFromApi)
            setIsLoading(false)
            const accountData: IValueLabel[] = data.map((val) => ({
                value: val.organisation.id.toString(),
                label: val.organisation.name,
            }));

            // Create a Set to keep track of unique IDs
            const uniqueIds = new Set();
            totalPageCount = result.total_pages
            // Use filter to get unique entries based on the 'value' property
            const uniqueAccountData = accountData.filter((entry) => {
                if (!uniqueIds.has(entry.value)) {
                    uniqueIds.add(entry.value);
                    return true;
                }
                return false;
            });

            setAccountList(uniqueAccountData);

            setIsNetworkError(false)

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
            const userList: any = await fetchUserDataList()
            setIsUserDataLoading(false)
            setUserList(userList)
        } catch (err) {
            setIsUserDataLoading(false)
            console.error("user fetch error", err)
        }

    }

    useEffect(() => {
        fetchLeadData()
    }, [pageAsNumber, per_page,  searchString, createdAtFrom, createdAtTo, createdAtSort, type, designation, createdBy])

    useEffect(() => {
        setDealFilter()
    }, [ watch.designations,  watch.types, watch.creators, JSON.stringify(watch.dateRange) ])

    function setDealFilter() {
        let desigationQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let typeQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdAtFromQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdAtToQueryParam: FilterQuery = EMPTY_FILTER_QUERY
        let createdByQueryParam: FilterQuery = EMPTY_FILTER_QUERY

        

        if (watch.designations && watch.designations.includes("allDesignations")) {
            desigationQueryParam = {
                filterFieldName: "designation",
                value: null
            }
        }
        else {
            const designationFilter = valueToLabelArray(watch.designations, DESIGNATION)
            if (designationFilter) {
                desigationQueryParam = {
                    filterFieldName: "designation",
                    value: arrayToCsvString(designationFilter)
                }
            }
        }

        if (watch.types && watch.types.includes("allStatuses")) {
            typeQueryParam = {
                filterFieldName: "type",
                value: null
            }
        }
        else {
            const typeFilter = valueToLabelArray(watch.types, TYPE)
            if (typeFilter) {
                typeQueryParam = {
                    filterFieldName: "type",
                    value: arrayToCsvString(typeFilter)
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
        let leadFilteredData = [ desigationQueryParam, typeQueryParam, createdAtFromQueryParam, createdAtToQueryParam, createdByQueryParam]
        createFilterQueryString(leadFilteredData)
    }

    const debouncedSearchableFilters = useDebounce(watch.search, 500)

    useEffect(() => {
        const data: FilterQuery[] = [{ filterFieldName: "name", value: debouncedSearchableFilters || null }]
        createFilterQueryString(data)
    }, [debouncedSearchableFilters])

    useEffect(() => {
        // if (searchString) {
        //     form.setValue("search", searchString)
        // }
        
        // if (type) {
        //     const data = labelToValueArray(csvStringToArray(type),TYPE)
        //     if (data.length > 0) {
        //         form.setValue("types", removeUndefinedFromArray(data))
        //     }
        // }
        // if (designation) {
        //     const data = labelToValueArray(csvStringToArray(designation), DESIGNATION)
        //     if (data.length > 0) {
        //         form.setValue("designations", removeUndefinedFromArray(data))
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

    async function patchArchiveLeadData(ids: number[]) {

        const url = `${baseUrl}/v1/api/lead/bulk_archive/`;

        try {
            const dataResp = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({ leads: ids, archive: isInbox }),
                headers: {
                    "Authorization": `Token ${token_superuser}`,
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
                fetchLeadData()

            })
            .catch((error) => {
                console.log("Error during patching:", error);

            });
    }

    const addAccountDialogButton = () => <AddLeadDialog page={"contacts"} fetchLeadData={fetchLeadData} >
        <Button disabled={!permissions.add} className="flex flex-row gap-2">
            <Image src="/images/plus.svg" alt="plus lead" height={20} width={20} />
            Add Contact
        </Button>
    </AddLeadDialog>

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
                            <span className="text-sm ">{isLoading ? "Loading..." : isMultiSelectOn ? <span>Selected {selectedRowIds?.length} out of {tableLeadLength} {tableLeadLength > 1 ? "Contacts" : "Contact"}</span> : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Contacts" : "Contact"}` : "No Contacts"}</span>
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
                                        <Button variant={"google"} className="p-[8px]" type="button" onClick={() => fetchLeadData()}>
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
                                {/* <div>
                                    <FormField
                                        control={form.control}
                                        name="accounts"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"google"} className="flex flex-row gap-2">
                                                                {formatData(field.value, 'Accounts', [{ label: 'All Accounts', value: 'allAccounts' }].concat(Array.from(new Set(data.map(val => (val.organisation.name)))).map(val => ({ label: val, value: val })))
                                                                )}
                                                                <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[230px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search Account" />
                                                            <CommandEmpty>No Account found.</CommandEmpty>
                                                            <CommandGroup className="flex flex-col h-[250px] overflow-y-scroll">
                                                                {
                                                                    [{ label: 'All Accounts', value: 'allAccounts' }].concat(Array.from(new Set(data.map(val => (val.organisation.name)))).map(val => ({ label: val, value: val })))
                                                                        .map((account) => (
                                                                            <CommandItem
                                                                                value={account.label}
                                                                                key={account.value}
                                                                                onSelect={() => {
                                                                                    if (field.value.length > 0 && field.value.includes("allAccounts") && account.value !== 'allAccounts') {
                                                                                        form.setValue("accounts", [...field.value.filter((value) => value !== 'allAccounts'), account.value])
                                                                                    }
                                                                                    else if ((field.value?.length === 1 && field.value?.includes(account.value) || account.value == 'allAccounts')) {
                                                                                        form.setValue("accounts", ["allAccounts"])

                                                                                    }
                                                                                    else if (field.value?.includes(account.value)) {
                                                                                        form.setValue("accounts", field.value?.filter((val) => val !== account.value))
                                                                                    } else {
                                                                                        form.setValue("accounts", [...field.value, account.value])
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {account.label}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value?.includes(account.value)
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
                                </div> */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="designations"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"google"} className="flex flex-row gap-2">
                                                                {formatData(field.value, 'Designations', ALL_DESIGNATIONS)}
                                                                <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[230px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search Designation" />
                                                            <CommandEmpty>No Designation found.</CommandEmpty>
                                                            <CommandGroup className="flex flex-col h-[250px] overflow-y-scroll">
                                                                {ALL_DESIGNATIONS.map((designation) => (
                                                                    <CommandItem
                                                                        value={designation.label}
                                                                        key={designation.value}
                                                                        onSelect={() => {
                                                                            if (field.value.length > 0 && field.value.includes("allDesignations") && designation.value !== 'allDesignations') {
                                                                                form.setValue("designations", [...field.value.filter((value) => value !== 'allDesignations'), designation.value])
                                                                            }
                                                                            else if ((field.value?.length === 1 && field.value?.includes(designation.value) || designation.value == 'allDesignations')) {
                                                                                form.setValue("designations", ["allDesignations"])

                                                                            }
                                                                            else if (field.value?.includes(designation.value)) {
                                                                                form.setValue("designations", field.value?.filter((val) => val !== designation.value))
                                                                            } else {
                                                                                form.setValue("designations", [...field.value, designation.value])
                                                                            }
                                                                        }}
                                                                    >
                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                            {designation.label}
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                    field.value?.includes(designation.value)
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
                                        name="types"
                                        render={({ field }) => {
                                            return <DropdownMenu >
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Types', ALL_TYPES)}
                                                        <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[200px]">
                                                    {
                                                        ALL_TYPES.map((type) => {
                                                            return <DropdownMenuCheckboxItem
                                                                key={type.value}
                                                                checked={type.isDefault && field.value.length === 0 ? true : field.value?.includes(type.value)}
                                                                onCheckedChange={(checked) => {
                                                                    if ((!checked && field.value.length === 1) || type.value === 'allTypes') {
                                                                        return field.onChange(['allTypes'])
                                                                    } else if (checked && field.value.includes('allTypes') && type.value !== 'allTypes') {
                                                                        return field.onChange([...field.value?.filter((value) => value != 'allTypes'), type.value])
                                                                    }
                                                                    return checked ? field.onChange([...field.value, type.value]) : field.onChange(field.value?.filter((value) => value != type.value))
                                                                }}
                                                            >
                                                                <div className="">
                                                                    <div className={`flex flex-row gap-2 items-center ${!type.isDefault && 'border border-[1.5px] rounded-[8px]'} ${type.class}`}>
                                                                        {type.icon && <type.icon />}
                                                                        {type.label}
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


                                {/* <div className="">
                                        <FormField
                                            control={form.control}
                                            name="sizes"
                                            render={({ field }) => {
                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Sizes', ALL_SIZE_OF_COMPANY)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[160px]">
                                                        {
                                                            ALL_SIZE_OF_COMPANY.map((size) => {
                                                                return <DropdownMenuCheckboxItem
                                                                    key={size.value}
                                                                    checked={size.isDefault && field.value.length === 0 ? true : field.value?.includes(size.value)}
                                                                    onCheckedChange={(checked) => {
                                                                        if ((!checked && field.value.length === 1) || size.value === 'allSizes') {
                                                                            return field.onChange(['allSizes'])
                                                                        } else if (checked && field.value.includes('allSizes') && size.value !== 'allSizes') {
                                                                            return field.onChange([...field.value?.filter((value) => value != 'allSizes'), size.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, size.value]) : field.onChange(field.value?.filter((value) => value != size.value))
                                                                    }}
                                                                >
                                                                    {size.label}
                                                                </DropdownMenuCheckboxItem>
                                                            })
                                                        }
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            }}
                                        />
                                    </div> */}
                                <div className='flex flex-col  '>
                                    <FormField
                                        control={form.control}
                                        name="creators"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Popover>
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
                                                    <PopoverContent className="w-[230px] p-0">
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
                    <DataTableServer columns={columnsContacts(setChildDataHandler)} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} pageName={"Contacts"} pageCount={totalPageCount} />
                </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                    {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3 hover:bg-black-900 hover:fill-current text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                        <IconContacts size="20" color="#667085" />
                    </div>
                        <div>
                            <p className="text-md text-gray-900 font-semibold">{isInbox ? "No Contacts" : "No Archive Contacts"}</p>

                        </div>
                        {isInbox && addAccountDialogButton()}</>}
                </div>)
            }
            {childData?.row && <SideSheetContacts parentData={{ childData, setChildDataHandler }} permissions={permissions} accountList={accountList} />}
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



export default Contacts