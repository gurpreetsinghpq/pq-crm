"use client"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from "@/components/ui/command"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

import { REGIONS as regions, SOURCES as sources, STATUSES as statuses } from "@/app/constants/constants"
import { IValueLabel, LeadInterface, Permission } from "@/app/interfaces/interface"
import { cn } from "@/lib/utils"
import { DialogClose } from "@radix-ui/react-dialog"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Check, Loader2 } from "lucide-react"
import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import { IconArchive, IconArchive2, IconInbox, IconLeads } from "../icons/svgIcons"
import { DateRangePicker, getThisMonth } from "../ui/date-range-picker"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useToast } from "../ui/use-toast"
import AddLeadDialog from "./addLeadDialog"
import DataTable from "./table/datatable"
// import { getData } from "@/app/dummy/dummydata"
import { getCookie } from "cookies-next"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchUserDataList } from "./commonFunctions"
import Loader from "./loader"
import SideSheet from "./sideSheet"
import { columns } from "./table/columns"

type Checked = DropdownMenuCheckboxItemProps["checked"]

// let tableLeadLength = 0

export interface IChildData {
    row: any
}
let dataFromApi: LeadInterface[] = []

const Leads = ({ form, permissions }: {
    form: UseFormReturn<{
        search: string;
        queryParamString: string;
        regions: string[];
        sources: string[];
        statuses: string[];
        owners: string[];
        creators: string[];
        dateRange?: any;
    }, any, undefined>,
    permissions: Permission
}) => {
    const { toast } = useToast()

    const router = useRouter();

    const [data, setLeadData] = React.useState<LeadInterface[]>([])

    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [isUserDataLoading, setIsUserDataLoading] = React.useState<boolean>(true)
    const [isMultiSelectOn, setIsMultiSelectOn] = React.useState<boolean>(false)
    const [isInbox, setIsInbox] = React.useState<boolean>(true)
    const [isNetworkError, setIsNetworkError] = React.useState<boolean>(false)
    const [tableLeadLength, setTableLength] = React.useState<any>()
    const [selectedRowIds, setSelectedRowIds] = React.useState<[]>()
    const [userList, setUserList] = React.useState<IValueLabel[]>()
    const [childData, setChildData] = React.useState<IChildData>()



    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            fetchLeadData()
        }
    }


    // React.useEffect(() => {
    //     console.log(childData)
    // }, [childData?.row])

    const watcher = form.watch()
    React.useEffect(() => {
        // console.log(form.getValues("dateRange"))
    }, [])

    function setTableLeadRow(data: any) {
        const selectedRows = data.rows.filter((val: any) => val.getIsSelected())
        setIsMultiSelectOn(selectedRows.length !== 0)
        const ids = selectedRows.map((val: any) => val.original.id)
        setSelectedRowIds(ids)
        setTableLength(data.rows.length)
    }
    const searchParams = useSearchParams()



    async function checkQueryParam() {
        const queryParamIds = searchParams.get("ids")
        if (queryParamIds && queryParamIds?.length > 0) {
            form.setValue("search", queryParamIds)
            form.setValue("queryParamString", queryParamIds)

            const { from, to } = getThisMonth(queryParamIds)
            form.setValue("dateRange", {
                "range": {
                    "from": from,
                    "to": to
                },
                rangeCompare: undefined
            })
            await fetchLeadData(true)
        } else {
            fetchLeadData()
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getCookie("token")
    async function fetchLeadData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/lead/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: LeadInterface[] = structuredClone(result.data)
            let fdata = data.map(val => {
                val.title = val.title === null ? "" : val.title
                return val
            })
            dataFromApi = fdata
            const filteredData = noArchiveFilter ? dataFromApi : filterInboxOrArchive(dataFromApi, isInbox)
            setLeadData(filteredData)
            setIsLoading(false)
            if (filteredData.length == 0) {
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
        getUserList()
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

    React.useEffect(() => {
        (async () => {
            await checkQueryParam()
        })()
    }, [])

    React.useEffect(() => {
        setLeadData(filterInboxOrArchive(dataFromApi, isInbox))
    }, [isInbox])


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
                fetchLeadData()
                toast({
                    title: `${ids.length} ${ids.length > 1 ? "Leads" : "Lead"} moved to ${isInbox ? "Archive" : "Inbox"} Succesfully!`,
                    variant: "dark"
                })
                return result;
            } else {
                throw new Error("Failed to patch lead data");
            }
        } catch (err) {
            console.error("Error during patching:", err);
            throw err;
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

                console.log("All patching operations are done");

            })
            .catch((error) => {
                console.log("Error during patching:", error);

            });
    }

    const addLeadDialogButton = () => <AddLeadDialog fetchLeadData={fetchLeadData} page={"leads"}>
        <Button disabled={!permissions?.add} className="flex flex-row gap-2">
            <Image src="/images/plus.svg" alt="plus lead" height={20} width={20} />
            Add Lead
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
                        <div className="right flex flex-row gap-4 ">
                            {!form.getValues("queryParamString") && addLeadDialogButton()}

                        </div>
                    </div>
                    <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                        <div className=" flex items-center flex-row gap-2">
                            <span className="text-sm ">{isLoading ? "Loading..." : data?.length === 0 ? "No Leads" : isMultiSelectOn ? <span>Selected {selectedRowIds?.length} out of {tableLeadLength} {tableLeadLength > 1 ? "Leads" : "Lead"}</span> : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Leads" : "Lead"}` : "No Leads"}</span>
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
                                            fetchLeadData()
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
                                            <div className='flex flex-col gap-[32px]  min-w-[380px] '>
                                                <div className='flex flex-col gap-[5px]'>
                                                    <div className='text-gray-900 text-lg'>Are you sure you want to continue?</div>
                                                    <div className='text-gray-600 font-normal font text-sm'> <span className="font-bold">{selectedRowIds?.length} {selectedRowIds && selectedRowIds?.length > 1 ? "Leads" : "Lead"} </span> will be {isInbox ? "Archived" : "moved to Inbox"}</div>
                                                </div>
                                                <div className='flex flex-row gap-[12px] w-full'>
                                                    <DialogClose asChild>
                                                        <Button className='text-sm flex-1 font-semibold  px-[38px] py-[10px]' variant={'google'}>Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={archiveApi} className='flex-1 text-sm font-semibold px-[38px] py-[10px]'>{isInbox ? "Archive" : "Confirm"} </Button>
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
                                    <div className="">
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
                                                                            return field.onChange([...field.value?.filter((value: string) => value != 'allRegions'), region.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, region.value]) : field.onChange(field.value?.filter((value: string) => value != region.value))
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
                                    </div>
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
                                                                            return field.onChange([...field.value?.filter((value: string) => value != 'allSources'), source.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, source.value]) : field.onChange(field.value?.filter((value: string) => value != source.value))
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
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Statuses', statuses)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[160px]">
                                                        {
                                                            statuses.map((status) => {
                                                                return <DropdownMenuCheckboxItem
                                                                    key={status.value}
                                                                    checked={status.isDefault && field.value.length === 0 ? true : field.value?.includes(status.value)}
                                                                    onCheckedChange={(checked) => {
                                                                        if ((!checked && field.value.length === 1) || status.value === 'allStatuses') {
                                                                            return field.onChange(['allStatuses'])
                                                                        } else if (checked && field.value.includes('allStatuses') && status.value !== 'allStatuses') {
                                                                            return field.onChange([...field.value?.filter((value: string) => value != 'allStatuses'), status.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, status.value]) : field.onChange(field.value?.filter((value: string) => value != status.value))
                                                                    }}
                                                                >
                                                                    <div className="">
                                                                        <div className={`flex flex-row gap-2 items-center ${!status.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status.class}`}>
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
                                                    <Popover>
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
                                                        <PopoverContent className="w-[230px] p-0">
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
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                    {isUserDataLoading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />  </> : userList && userList?.length > 0 && formatData(field.value, 'Creators', [{ value: "allCreators", label: "All Creators" }, ...userList])}
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
                                                                        {userList &&  userList?.length > 0 && [{ value: "allCreators", label: "All Creators" }, ...userList].map((creator) => (
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
                    <DataTable columns={columns(setChildDataHandler, patchArchiveLeadData, isInbox, permissions)} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"leads"} />
                    {/* </TableContext.Provider> */}
                </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                    {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3  text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                        <IconLeads size="20" />
                    </div>
                        <div>
                            <p className="text-md text-gray-900 font-semibold">{isInbox ? "No Leads" : "No Archived Leads"}</p>

                        </div>
                        {isInbox && addLeadDialogButton()}</>}
                </div>)
            }
            {childData?.row && <SideSheet parentData={{ childData, setChildDataHandler }} permissions={permissions} />}
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



export default Leads