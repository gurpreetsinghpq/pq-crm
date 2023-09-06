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
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses, INDUSTRIES, ALL_DOMAINS, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_LAST_FUNDING_STAGE } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconAccounts2, IconArchive, IconArchive2, IconArrowSquareRight, IconCross, IconInbox, IconLeads, Unverified } from "../icons/svgIcons"
import { DateRangePicker, getLastWeek } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { ClientGetResponse, IValueLabel, LeadInterface, PatchLead, User } from "@/app/interfaces/interface"
// import { getData } from "@/app/dummy/dummydata"
import Loader from "./loader"
import { TableContext } from "@/app/helper/context"
import SideSheet from "./sideSheet"
import { useRouter, useSearchParams } from "next/navigation"

import { Router } from "next/router"
import { RowModel } from "@tanstack/react-table"
import { columnsClient } from "./table/columns-client"
import SideSheetAccounts from "./sideSheetAccounts"

type Checked = DropdownMenuCheckboxItemProps["checked"]



const FormSchema = z.object({
    industries: z.array(z.string()).refine((value) => value.some((item) => item), {
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

// let tableLeadLength = 0

export interface IChildData {
    row: any
}
let dataFromApi: LeadInterface[] = []

const Accounts = () => {
    const { toast } = useToast()

    const router = useRouter();

    const [data, setClientData] = React.useState<ClientGetResponse[]>([])

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
            industries: ["allIndustries"],
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
            const dataResp = await fetch(`${baseUrl}/v1/api/client/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: ClientGetResponse[] = structuredClone(result.data)
            let dataFromApi = data
            setClientData(dataFromApi)
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

    const addAccountDialogButton = () => <AddLeadDialog page={"accounts"} fetchLeadData={fetchLeadData} >
    <Button className="flex flex-row gap-2">
        <Image src="/plus.svg" alt="plus lead" height={20} width={20} />
        Add Account
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
                                        {/* <DropdownMenu > */}
                                        {/* <DropdownMenuTrigger asChild>
                                        <Button variant="google" className="flex flex-row gap-2 items-center">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="calendar">
                                                    <path id="Icon" d="M17.5 8.33342H2.5M13.3333 1.66675V5.00008M6.66667 1.66675V5.00008M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4388 17.2275 16.9684C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33342C17.5 5.93328 17.5 5.23322 17.2275 4.69844C16.9878 4.22803 16.6054 3.84558 16.135 3.6059C15.6002 3.33341 14.9001 3.33341 13.5 3.33341H6.5C5.09987 3.33341 4.3998 3.33341 3.86502 3.6059C3.39462 3.84558 3.01217 4.22803 2.77248 4.69844C2.5 5.23322 2.5 5.93328 2.5 7.33341V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9684C3.01217 17.4388 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                            </svg>
                                            Last 7 Days
                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                        </Button>
                                    </DropdownMenuTrigger> */}
                                        {/* <DropdownMenuContent className="w-56"> */}
                                        <DateRangePicker
                                            onUpdate={(values) => form.setValue("dateRange", values)}
                                            // initialDateFrom="2023-01-01"
                                            // initialDateTo="2023-12-31"
                                            queryParamString={form.getValues("queryParamString")}
                                            align="start"
                                            locale="en-GB"
                                            showCompare={false}
                                        />

                                        {/* </DropdownMenuContent>
                                </DropdownMenu> */}
                                    </div>
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="industries"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                    {formatData(field.value, 'Industries', INDUSTRIES)}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[230px] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Search Industry..." />
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
                                    {/* <div>
                                        <FormField
                                            control={form.control}
                                            name="domains"
                                            render={({ field }) => {
                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Domains', ALL_DOMAINS)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[200px]">
                                                        {
                                                            ALL_DOMAINS.map((domain) => {
                                                                return <DropdownMenuCheckboxItem
                                                                    key={domain.value}
                                                                    checked={domain.isDefault && field.value.length === 0 ? true : field.value?.includes(domain.value)}
                                                                    onCheckedChange={(checked) => {
                                                                        if ((!checked && field.value.length === 1) || domain.value === 'allDomains') {
                                                                            return field.onChange(['allDomains'])
                                                                        } else if (checked && field.value.includes('allDomains') && domain.value !== 'allDomains') {
                                                                            return field.onChange([...field.value?.filter((value) => value != 'allDomains'), domain.value])
                                                                        }
                                                                        return checked ? field.onChange([...field.value, domain.value]) : field.onChange(field.value?.filter((value) => value != domain.value))
                                                                    }}
                                                                >
                                                                    {domain.label}
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
                                            name="segments"
                                            render={({ field }) => {
                                                return <DropdownMenu >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Segments', ALL_SEGMENTS)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
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
                                                                        <div className={`flex flex-row gap-2 items-center   py-1`}>
                                                                            {segment.icon ? <segment.icon />: segment.label}
                                                                            
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
                                    <div className='flex flex-col  '>
                                        <FormField
                                            control={form.control}
                                            name="fundingStages"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {formatData(field.value, 'Funding Stages', ALL_LAST_FUNDING_STAGE)}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[215px] p-0 mr-[24px]" >
                                                            <Command>
                                                                <CommandInput placeholder="Search Funding Stage..." />
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
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {formatData(field.value, 'Creators', creators)}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[200px] p-0 mr-[24px]" >
                                                            <Command>
                                                                <CommandInput placeholder="Search Creator..." />
                                                                <CommandEmpty>No creators found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {creators.map((creator) => (
                                                                        <CommandItem
                                                                            value={creator.label}
                                                                            key={creator.value}
                                                                            onSelect={() => {
                                                                                if (field.value.length > 0 && field.value.includes("allCreators") && creator.value !== 'allCreators') {
                                                                                    form.setValue("creators", [...field.value.filter((value) => value !== 'allCreators'), creator.value])
                                                                                }
                                                                                else if ((field.value?.length === 1 && field.value?.includes(creator.value)) || creator.value == 'allCreators') {
                                                                                    form.setValue("creators", ["allCreators"])
                                                                                }
                                                                                else if (field.value?.includes(creator.value)) {
                                                                                    form.setValue("creators", field.value?.filter((val) => val !== creator.value))
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
                    <DataTable columns={columnsClient} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"accounts"}/>
                </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                    {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3 hover:bg-black-900 hover:fill-current text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                        <IconAccounts2 size="20" />
                    </div>
                        <div>
                            <p className="text-md text-gray-900 font-semibold">{isInbox ? "No Accounts" : "No Archive Accounts"}</p>

                        </div>
                        {isInbox && addAccountDialogButton()}</>}
                </div>)
            }
            {childData?.row && <SideSheetAccounts parentData={{ childData, setChildDataHandler }} />}
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



export default Accounts