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

import * as React from "react"
import { DropdownMenuCheckboxItemProps, RadioGroup } from "@radix-ui/react-dropdown-menu"
import DataTable from "./table/datatable"
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import AddLeadDialog from "./addLeadDialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronDownIcon, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "../ui/use-toast"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses, INDUSTRIES, ALL_DOMAINS, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_LAST_FUNDING_STAGE, DESIGNATION, ALL_DESIGNATIONS, ALL_TYPES, ALL_FUNCTIONS, ALL_PROFILES } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconArchive, IconArchive2, IconArrowSquareRight, IconContacts, IconCross, IconInbox, IconUserCheck, IconUserCross, IconUsers, Unverified } from "../icons/svgIcons"
import { DateRangePicker, getLastWeek } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { ClientGetResponse, ContactsGetResponse, IValueLabel, LeadInterface, PatchLead, User } from "@/app/interfaces/interface"
// import { getData } from "@/app/dummy/dummydata"
import Loader from "./loader"
import { TableContext } from "@/app/helper/context"
import SideSheet from "./sideSheet"
import { useRouter, useSearchParams } from "next/navigation"

import { Router } from "next/router"
import { RowModel } from "@tanstack/react-table"
import { columnsClient } from "./table/columns-client"
import { columnsContacts } from "./table/columns-contact"
import SideSheetContacts from "./sideSheetContacts"

type Checked = DropdownMenuCheckboxItemProps["checked"]



const FormSchema = z.object({
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
    // owners: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one Owner.",
    // }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

// let tableLeadLength = 0

export interface IChildData {
    row: any
}
let dataFromApi: LeadInterface[] = []

const COMMON_TAB_CLASSES = "text-md font-semibold py-[8px] px-[12px] cursor-pointer"
const SELECTED_TAB_CLASSES = "bg-purple-100 rounded-[6px] text-purple-700 "
const TABS = {
    USERS: "Users",
    TEAMS: "Teams",
    PROFILES: "Profiles"
}

const UserManagement = () => {
    const { toast } = useToast()

    const router = useRouter();

    const [data, setContactData] = React.useState<ContactsGetResponse[]>([])
    const [currentTab, setCurrentTab] = React.useState<string>(TABS.USERS)

    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [isMultiSelectOn, setIsMultiSelectOn] = React.useState<boolean>(false)
    const [isInbox, setIsInbox] = React.useState<boolean>(true)
    const [isNetworkError, setIsNetworkError] = React.useState<boolean>(false)
    const [tableLeadLength, setTableLength] = React.useState<any>()
    const [selectedRowIds, setSelectedRowIds] = React.useState<[]>()

    const [childData, setChildData] = React.useState<IChildData>()



    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            fetchLeadData()
        }
    }


    React.useEffect(() => {
        console.log(childData)
    }, [childData?.row])
    function setTableLeadRow(data: any) {
        const selectedRows = data.rows.filter((val: any) => val.getIsSelected())
        setIsMultiSelectOn(selectedRows.length !== 0)
        const ids = selectedRows.map((val: any) => val.original.id)
        setSelectedRowIds(ids)
        setTableLength(data.rows.length)
    }
    const searchParams = useSearchParams()

    const { from, to } = getLastWeek()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            functions: ["allFunctions"],
            profiles: ["allProfiles"],
            regions: ["allRegions"],
            statuses: ["allStatuses"],
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

    async function checkQueryParam() {
        const queryParamIds = searchParams.get("ids")
        if (queryParamIds && queryParamIds?.length > 0) {
            form.setValue("search", queryParamIds)
            form.setValue("queryParamString", queryParamIds)

            const { from, to } = getLastWeek(queryParamIds)
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


    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }


    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    getToken()
    const token_superuser = getToken()
    async function fetchLeadData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: ContactsGetResponse[] = structuredClone(result.data)
            let dataFromApi = data
            setContactData(dataFromApi)
            setIsLoading(false)
            // if (filteredData.length == 0) {
            //     setTableLength(0)
            //     setIsMultiSelectOn(false)
            //     setSelectedRowIds([])
            // }
        }
        catch (err) {
            setIsLoading(false)
            setIsNetworkError(true)
            console.log("error", err)
        }
    }

    React.useEffect(() => {
        (async () => {
            await checkQueryParam()
        })()
    }, [])

    const watcher = form.watch()


    React.useEffect(() => {
        console.log(watcher)
    }, [watcher])

    // React.useEffect(() => {
    //     setContactData(filterInboxOrArchive(dataFromApi, isInbox))
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
        <Button className="flex flex-row gap-2">
            <Image src="/plus.svg" alt="plus lead" height={20} width={20} />
            Add User
        </Button>
    </AddLeadDialog>

    return <div className="flex flex-col flex-1">
        <div className="flex flex-row px-6 py-3 border-b-2 border-gray-100">
            <div onClick={() => setCurrentTab(TABS.USERS)} className={`${COMMON_TAB_CLASSES} ${currentTab === TABS.USERS && SELECTED_TAB_CLASSES}`}>{TABS.USERS}</div>
            <div onClick={() => setCurrentTab(TABS.TEAMS)} className={`${COMMON_TAB_CLASSES} ${currentTab === TABS.TEAMS && SELECTED_TAB_CLASSES}`}>{TABS.TEAMS}</div>
            <div onClick={() => setCurrentTab(TABS.PROFILES)} className={`${COMMON_TAB_CLASSES} ${currentTab === TABS.PROFILES && SELECTED_TAB_CLASSES}`}>{TABS.PROFILES}</div>
        </div>
        <div className="bottom flex-1 flex flex-col  ">
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
                            {!form.getValues("queryParamString") && <div className="flex flex-row border border-[1px] border-gray-300 rounded-[8px]">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="button" variant={"ghost"} className={`rounded-r-none ${isInbox && "bg-gray-100"}`} onClick={() => setIsInbox(true)}>
                                                <IconUserCheck size={20} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={"bottom"} sideOffset={5}>
                                            Activated
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="h-[full] w-[1px] bg-gray-300"></div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="button" variant={"ghost"} className={`rounded-l-none ${!isInbox && "bg-gray-100"}`} onClick={() => setIsInbox(false)}>
                                                <IconUserCross size={20} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={"bottom"} sideOffset={5} >
                                            Deactivated
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>}
                        </div>
                        <div className="right flex flex-row gap-4 ">
                            {!form.getValues("queryParamString") && addAccountDialogButton()}

                        </div>
                    </div>
                    <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                        <div className=" flex items-center flex-row gap-2">
                            <span className="text-sm ">{isLoading ? "Loading..." : isMultiSelectOn ? <span>Selected {selectedRowIds?.length} out of {tableLeadLength} {tableLeadLength > 1 ? "Users" : "User"}</span> : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Users" : "User"}` : "No Users found"}</span>
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
                                            <Image width={20} height={20} alt="Refresh" src={"/refresh.svg"} />
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
                                        <Button variant={"google"} className="flex flex-row gap-2" type="button" >
                                            <IconArchive size={20} color="#344054" />
                                            {isInbox ? "Archive" : "Inbox"}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                                        <div className='w-fit'>
                                            <DialogHeader>
                                                <div className=' rounded-full w-fit'>
                                                    <IconArchive2 size={62} />
                                                </div>
                                            </DialogHeader>
                                            <div className='flex flex-col gap-[32px] mt-[16px] min-w-[380px] '>
                                                <div className='flex flex-col gap-[5px]'>
                                                    <div className='text-gray-900 text-lg'>Are you sure you want to continue?</div>
                                                    <div className='text-gray-600 font-normal font text-sm'> <span className="font-bold">{selectedRowIds?.length} {selectedRowIds && selectedRowIds?.length > 1 ? "Leads" : "Lead"} </span> will be {isInbox ? "Archived" : "moved to Inbox"}</div>
                                                </div>
                                                <div className='flex flex-row gap-[12px] w-full'>
                                                    <DialogClose asChild>
                                                        <Button className='text-md flex-1 font-semibold  px-[38px] py-[10px]' variant={'google'}>Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={archiveApi} className='flex-1 text-md font-semibold px-[38px] py-[10px]'>{isInbox ? "Archive" : "Confirm"} </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                {/* <Button variant={'default'} className='flex flex-row gap-2' type='button' onClick={() => promoteToProspect()}>Promote to Prospect <IconArrowSquareRight size={20} /></Button> */}
                            </div> :
                                <>
                                    <div>
                                        <DateRangePicker
                                            onUpdate={(values) => form.setValue("dateRange", values)}
                                            // initialDateFrom="2023-01-01"
                                            // initialDateTo="2023-12-31"
                                            queryParamString={form.getValues("queryParamString")}
                                            align="start"
                                            locale="en-GB"
                                            showCompare={false}
                                        />
                                    </div> <div className="">
                                        <FormField
                                            control={form.control}
                                            name="regions"
                                            render={({ field }) => {

                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Regions', regions)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
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
                                    </div>
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="functions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {formatData(field.value, 'Functions', ALL_FUNCTIONS)}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[230px] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Search Function" />
                                                                <CommandEmpty>No Function found.</CommandEmpty>
                                                                <CommandGroup className="flex flex-col h-[250px] overflow-y-scroll">
                                                                    {ALL_FUNCTIONS.map((func) => (
                                                                        <CommandItem
                                                                            value={func.label}
                                                                            key={func.value}
                                                                            onSelect={() => {
                                                                                if (field.value.length > 0 && field.value.includes("allFunctions") && func.value !== 'allFunctions') {
                                                                                    form.setValue("functions", [...field.value.filter((value) => value !== 'allFunctions'), func.value])
                                                                                }
                                                                                else if ((field.value?.length === 1 && field.value?.includes(func.value) || func.value == 'allFunctions')) {
                                                                                    form.setValue("functions", ["allfunctions"])

                                                                                }
                                                                                else if (field.value?.includes(func.value)) {
                                                                                    form.setValue("functions", field.value?.filter((val) => val !== func.value))
                                                                                } else {
                                                                                    form.setValue("functions", [...field.value, func.value])
                                                                                }
                                                                            }}
                                                                        >
                                                                            <div className="flex flex-row items-center justify-between w-full">
                                                                                {func.label}
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4 text-purple-600",
                                                                                        field.value?.includes(func.value)
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

                                    <div className="">
                                        <FormField
                                            control={form.control}
                                            name="profiles"
                                            render={({ field }) => {

                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Porfiles', ALL_PROFILES)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[160px]">
                                                        {
                                                            ALL_PROFILES.map((profile) => {
                                                                return <DropdownMenuCheckboxItem
                                                                    key={profile.value}
                                                                    checked={profile.isDefault && field.value.length === 0 ? true : field.value?.includes(profile.value)}
                                                                    onCheckedChange={(checked) => {
                                                                        if ((!checked && field.value.length === 1) || profile.value === 'allprofiles') {
                                                                            return field.onChange(['allprofiles'])
                                                                        } else if (checked && field.value.includes('allprofiles') && profile.value !== 'allprofiles') {
                                                                            return field.onChange([...field.value?.filter((value) => value != 'allprofiles'), profile.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, profile.value]) : field.onChange(field.value?.filter((value) => value != profile.value))
                                                                    }}
                                                                >
                                                                    {profile.label}
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
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
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
                                    <div className="text-md font-medium">
                                        <FormField
                                            control={form.control}
                                            name="statuses"
                                            render={({ field }) => {
                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Statuses', statuses)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
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
                                                                            return field.onChange([...field.value?.filter((value) => value != 'allStatuses'), status.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, status.value]) : field.onChange(field.value?.filter((value) => value != status.value))
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
                                </>}
                        </div>
                    </div>
                </form>
            </Form>
            {
                isLoading ? (<div className="flex flex-row h-[60vh] justify-center items-center">
                    <Loader />
                </div>) : data?.length > 0 ? <div className="tbl w-full flex flex-1 flex-col">
                    <DataTable columns={columnsContacts} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"contacts"} />
                </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                    {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3 hover:bg-black-900 hover:fill-current text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                        <IconUsers size="20" />
                    </div>
                        <div>
                            <p className="text-md text-gray-900 font-semibold">{isInbox ? "No Users" : "No Archive Users"}</p>

                        </div>
                        {isInbox && addAccountDialogButton()}</>}
                </div>)
            }
            {childData?.row && <SideSheetContacts parentData={{ childData, setChildDataHandler }} />}
        </div>


    </div>
}

export function getToken() {
    const userFromLocalstorage: User | undefined = JSON.parse(localStorage.getItem("user") || "")
    const token = userFromLocalstorage?.token
    return token
}

function filterInboxOrArchive(data: LeadInterface[], isInbox: boolean) {
    return data.filter((val) => val.archived !== isInbox)
}

export function formatData(data: any[], plural: string, childOf: IValueLabel[]) {
    const finalString = data.length > 1 ? `${data.length} ${plural}` : childOf.find((item) => item.value === data[0])?.label
    return finalString
}



export default UserManagement