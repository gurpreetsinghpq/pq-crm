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
import { DropdownMenuCheckboxItemProps, RadioGroup, Separator } from "@radix-ui/react-dropdown-menu"
import DataTable from "./table/datatable"
import { LeadInterface, columns } from "./table/columns"
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import AddLeadDialog from "./addLeadDialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronDownIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "../ui/use-toast"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconProspects, Unverified } from "../icons/svgIcons"

type Checked = DropdownMenuCheckboxItemProps["checked"]

function getData(): LeadInterface[] {
    return [
        {
            id: "728ed52f",
            budgetRange: "INR 1cr - 2cr",
            createdBy: "Varun Aggarwal",
            createdOn: "December 20, 2021",
            owner: "Varun Aggarwal",
            region: "India",
            source: "Linkedin",
            status: "Unverified",
            title: "Swiggy - IND - CTO",
            role:"CTO",
        },
        // ...
    ]
}



const FormSchema = z.object({
    owners: z.string({
        required_error: "Please select a owner.",
    }),
    creators: z.string({
        required_error: "Please select a creator"
    }),
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one region.",
    }),
    sources: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one source.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    })
})

const Prospects = () => {
    const [showIndia, setshowIndia] = React.useState<boolean>(false);
    const [showUsa, setshowUsa] = React.useState<boolean>(false);
    const [showUk, setshowUk] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            regions: ["india", "usa"],
            sources: ["referral", "events"],
            statuses: ["junk"]
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

    const [areThereAnyLeads, setAreThereAnyLeads] = React.useState<Checked>(false)
    const data = getData()

    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-row place-content-between top px-6 py-5 border-b-2 border-gray-100">
                    <div className="w-1/2 flex flex-row gap-4 items-center">
                        <Command className="border w-2/3">
                            <CommandInput placeholder="Search" className="text-md" />
                        </Command>
                        <div className="flex flex-row gap-1">
                            <Button variant={"outline"}>
                                <Image src="/inbox.svg" alt="plus lead" sizes="100vw" width={0} height={0} style={{ width: '100%', height: 'auto', objectFit: "contain" }} />
                            </Button>
                            <Button variant={"outline"}>
                                <Image src="/archive.svg" alt="plus lead" width={0} height={0} style={{ width: '100%', height: 'auto', objectFit: "contain" }} />
                            </Button>
                        </div>
                    </div>
                    <div className="right flex flex-row gap-4 ">
                        
                    </div>
                </div>

                <div className="bottom">
                    <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                        <div className="w-1/4 flex items-center flex-row gap-2">
                            <span className="text-sm ">No Prospects found</span>
                            <Button variant={"google"} className="p-[8px]">
                                <Image width={20} height={20} alt="Refresh" src={"/refresh.svg"} />
                            </Button>
                        </div>

                        <div className="w-3/4 flex flex-row gap-3 justify-end">

                            <div>
                                <DropdownMenu >
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="google" className="flex flex-row gap-2 items-center">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="calendar">
                                                    <path id="Icon" d="M17.5 8.33342H2.5M13.3333 1.66675V5.00008M6.66667 1.66675V5.00008M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4388 17.2275 16.9684C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33342C17.5 5.93328 17.5 5.23322 17.2275 4.69844C16.9878 4.22803 16.6054 3.84558 16.135 3.6059C15.6002 3.33341 14.9001 3.33341 13.5 3.33341H6.5C5.09987 3.33341 4.3998 3.33341 3.86502 3.6059C3.39462 3.84558 3.01217 4.22803 2.77248 4.69844C2.5 5.23322 2.5 5.93328 2.5 7.33341V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9684C3.01217 17.4388 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                            </svg>
                                            Last 7 Days
                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuCheckboxItem
                                            checked={showIndia}
                                            onCheckedChange={setshowIndia}
                                        >
                                            India
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={showUsa}
                                            onCheckedChange={setshowUsa}
                                        >
                                            USA
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={showUk}
                                            onCheckedChange={setshowUk}
                                        >
                                            UK
                                        </DropdownMenuCheckboxItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="regions"
                                    render={({ field }) => {
                                        return <DropdownMenu >
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="google" className="flex flex-row gap-2">All Regions
                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                {
                                                    regions.map((region) => {
                                                        return <DropdownMenuCheckboxItem
                                                            key={region.value}
                                                            checked={field.value?.includes(region.value)}
                                                            onCheckedChange={(checked) => {
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
                                                <Button variant="google" className="flex flex-row gap-2">All Sources
                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                {
                                                    sources.map((source) => {
                                                        return <DropdownMenuCheckboxItem
                                                            key={source.value}
                                                            checked={field.value?.includes(source.value)}
                                                            onCheckedChange={(checked) => {
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
                                                <Button variant="google" className="flex flex-row gap-2">All Statuses
                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                {
                                                    statuses.map((status) => {
                                                        return <DropdownMenuCheckboxItem
                                                            key={status.value}
                                                            checked={field.value?.includes(status.value)}
                                                            onCheckedChange={(checked) => {
                                                                return checked ? field.onChange([...field.value, status.value]) : field.onChange(field.value?.filter((value) => value != status.value))
                                                            }}
                                                        >
                                                            <div className="flex flex-row gap-2 items-center">
                                                                {status.icon && <status.icon/>}
                                                                {status.label}
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
                                    name="owners"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"google"}>
                                                            {
                                                                field.value ? owners.find((owner) => owner.value === field.value)?.label : "Select Owner"
                                                            }
                                                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                                        <Button variant={"google"}>
                                                            {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                            All Creators
                                                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search creator..." />
                                                        <CommandEmpty>No creators found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {creators.map((creator) => (
                                                                <CommandItem
                                                                    value={creator.label}
                                                                    key={creator.value}
                                                                    onSelect={() => {
                                                                        form.setValue("creators", creator.value)
                                                                    }}
                                                                >
                                                                    <div className="flex flex-row items-center justify-between w-full">
                                                                        {creator.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4 text-purple-600",
                                                                                creator.value === field.value
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
                        areThereAnyLeads ? <div className="table w-full">
                            {/* <DataTable columns={columns} data={data} /> */}
                        </div> : <div className="flex flex-col gap-6 items-center p-10 ">
                            <div className="h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-black-900 hover:fill-current text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                                <IconProspects size={20}/>
                            </div>
                            <div>
                                <p className="text-md text-gray-900 font-semibold">No Prospects found</p>

                            </div>
                           
                        </div>
                    }
                </div>
            </form>

        </Form>


    </div>
}

export default Prospects