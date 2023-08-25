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
import { LeadInterface, columns } from "./table/columns"
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import AddLeadDialog from "./addLeadDialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronDownIcon, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "../ui/use-toast"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconArchive, IconInbox, IconLeads, Unverified } from "../icons/svgIcons"
import { DateRangePicker, getLast7Days } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { IValueLabel } from "@/app/interfaces/interface"
import { getData } from "@/app/dummy/dummydata"
import Loader from "./loader"
import { TableContext } from "@/app/helper/context"
import SideSheet from "./sideSheet"

type Checked = DropdownMenuCheckboxItemProps["checked"]



const FormSchema = z.object({
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
    dateRange: z.any()
})

// let tableLeadLength = 0

export interface IChildData {
    row: any
}

const Leads = () => {

    const [isSideSheetOpen, setIsSideSheetOpen] = React.useState<boolean>(false)

    const [data, setLeadData] = React.useState<LeadInterface[]>([])

    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [isNetworkError, setIsNetworkError] = React.useState<boolean>(false)
    const [tableLeadLength, setTableLength] = React.useState<any>()

    const [childData, setChildData] = React.useState<IChildData>()


    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
    }
    React.useEffect(() => {
        console.log(childData)
    }, [childData?.row])
    function setTableLeadLength(number: number) {
        setTableLength(number)
    }

    const {from, to} = getLast7Days()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            regions: ["allRegions"],
            sources: ["allSources"],
            statuses: ["allStatuses"],
            owners: ['allOwners'],
            creators: ['allCreators'],
            search: "",
            dateRange: {
                "range": {
                "from": from,
                "to": to
            },
            rangeCompare: undefined
        }
        }
    })

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








    async function fetchLeadData() {
        setIsLoading(true)
        try {
            let data = structuredClone(await getData())
            setLeadData(data.reverse())
            setIsLoading(false)
        }
        catch (err) {
            setIsLoading(false)
            setIsNetworkError(true)
            console.log("error", err)
        }
    }


    React.useEffect(() => {

        fetchLeadData()
    }, [])

    const watcher = form.watch()


    React.useEffect(() => {
        console.log(watcher)
    }, [watcher])
    // console.log(tableLeadLength)



    return <div className="flex flex-col flex-1">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
                <div className="flex flex-row place-content-between top px-6 py-5 border-b-2 border-gray-100">
                    <div className="w-1/2 flex flex-row gap-4 items-center">
                        <FormField
                            control={form.control}
                            name="search"
                            render={({ field }) => (
                                <FormItem className="w-2/3">
                                    <FormControl>
                                        {/* <Command className="border "> */}
                                        <Input placeholder="Search" className="text-md border" {...field} />
                                        {/* </Command> */}
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row border border-[1px] border-gray-300 rounded-[8px]">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={"ghost"} className="rounded-r-none">
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
                                        <Button variant={"ghost"} className="rounded-l-none">
                                            <IconArchive size={20} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side={"bottom"} sideOffset={5}>
                                        Archive
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <div className="right flex flex-row gap-4 ">
                        <AddLeadDialog fetchLeadData={fetchLeadData}>
                            <Button className="flex flex-row gap-2">
                                <Image src="/plus.svg" alt="plus lead" height={20} width={20} />
                                Add Lead
                            </Button>
                        </AddLeadDialog>

                    </div>
                </div>

                <div className="bottom flex-1 flex flex-col">
                    <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                        <div className=" flex items-center flex-row gap-2">
                            <span className="text-sm ">{isLoading ? "Loading..." : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Leads" : "Lead"}` : "No Leads"}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={"google"} className="p-[8px]" onClick={() => fetchLeadData()}>
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
                                    name="sources"
                                    render={({ field }) => {
                                        return <DropdownMenu >
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Sources', sources)}
                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[160px]">
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
                                                                <div className={`flex flex-row gap-2 items-center  px-2 py-1 ${!status.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status.class}`}>
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
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
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
                                                            {formatData(field.value, 'Owners', owners)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search Creator..." />
                                                        <CommandEmpty>No creators found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {owners.map((owner) => (
                                                                <CommandItem
                                                                    value={owner.label}
                                                                    key={owner.value}
                                                                    onSelect={() => {
                                                                        if (field.value.length > 0 && field.value.includes("allOwners") && owner.value !== 'allOwners') {
                                                                            form.setValue("owners", [...field.value.filter((value) => value !== 'allOwners'), owner.value])
                                                                        }
                                                                        else if ((field.value?.length === 1 && field.value?.includes(owner.value) || owner.value == 'allOwners')) {
                                                                            form.setValue("owners", ["allOwners"])

                                                                        }
                                                                        else if (field.value?.includes(owner.value)) {
                                                                            form.setValue("owners", field.value?.filter((val) => val !== owner.value))
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
                                                            {formatData(field.value, 'Creators', creators)}
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
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
                        </div>
                    </div>
                    {
                        isLoading ? (<div className="flex flex-row h-[60vh] justify-center items-center">
                            <Loader />
                        </div>) : data.length > 0 ? <div className="tbl w-full flex flex-1 flex-col">
                            {/* <TableContext.Provider value={{ tableLeadLength, setTableLeadLength }}> */}
                            <DataTable columns={columns} data={data} filterObj={form.getValues()} setTableLeadLength={setTableLeadLength} setChildDataHandler={setChildDataHandler} />
                            {/* </TableContext.Provider> */}
                        </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                            {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3 hover:bg-black-900 hover:fill-current text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                                <IconLeads size="20" />
                            </div>
                                <div>
                                    <p className="text-md text-gray-900 font-semibold">No Leads</p>

                                </div>
                                <AddLeadDialog fetchLeadData={fetchLeadData}>
                                    <Button className="flex flex-row gap-2">
                                        <Image src="/plus.svg" alt="plus lead" height={20} width={20} />
                                        Add Lead
                                    </Button>
                                </AddLeadDialog></>}
                        </div>)
                    }
                    {childData?.row && <SideSheet parentData={{ childData, setChildDataHandler }} />}
                </div>
            </form>

        </Form>


    </div>
}

export function formatData(data: any[], plural: string, childOf: IValueLabel[]) {
    const finalString = data.length > 1 ? `${data.length} ${plural}` : childOf.find((item) => item.value === data[0])?.label
    return finalString
}



export default Leads