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
import { Check, ChevronDownIcon, Loader2, Search } from "lucide-react"
import { UseFormReturn, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast, useToast } from "../ui/use-toast"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses, INDUSTRIES, ALL_DOMAINS, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_LAST_FUNDING_STAGE, DESIGNATION, ALL_DESIGNATIONS, ALL_TYPES, ALL_FUNCTIONS, ALL_PROFILES } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconArchive2,  IconUserActive,IconUserDeactive, IconUsers } from "../icons/svgIcons"
import { DateRangePicker, getThisMonth } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { ClientGetResponse, ContactsGetResponse, IValueLabel, LeadInterface, PatchLead, Permission, User, UsersGetResponse } from "@/app/interfaces/interface"
// import { getData } from "@/app/dummy/dummydata"
import Loader from "./loader"
import { TableContext } from "@/app/helper/context"
import SideSheet from "./sideSheet"
import { useRouter, useSearchParams } from "next/navigation"
import AddUserDialogBox from "./addUserDialogBox"
import { columnsUsers } from "./table/columns-users"
import { formatData } from "./leads"
import { fetchProfileDataList, getToken } from "./commonFunctions"

type Checked = DropdownMenuCheckboxItemProps["checked"]





// let tableLeadLength = 0

export interface IChildData {
    row: any
}

let dataFromApi: UsersGetResponse[] = []

function Users({ form, permissions }: {
    form: UseFormReturn<{
        regions: string[];
        functions: string[];
        profiles: string[];
        statuses: string[];
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>,
    permissions: Permission
}) {

    const { toast } = useToast()

    const router = useRouter();

    const [data, setUserData] = React.useState<UsersGetResponse[]>([])

    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [isMultiSelectOn, setIsMultiSelectOn] = React.useState<boolean>(false)
    const [isActivated, setIsActivated] = React.useState<boolean>(true)
    const [isNetworkError, setIsNetworkError] = React.useState<boolean>(false)
    const [tableLeadLength, setTableLength] = React.useState<any>()
    const [selectedRowIds, setSelectedRowIds] = React.useState<[]>()
    const [childData, setChildData] = React.useState<IChildData>()
    const [isProfileDataLoading, setIsProfileDataLoading] = React.useState<boolean>(true)
    const [profileList, setProfileList] = React.useState<IValueLabel[]>()
    const [isAddDialogClosed, setIsAddDialogClosed] = React.useState<boolean>(false)


    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            fetchUserData()
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

    const { from, to } = getThisMonth()


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
            await fetchUserData(true)
        } else {
            fetchUserData()
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()
    async function fetchUserData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/users/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: UsersGetResponse[] = structuredClone(result.data)
            dataFromApi = data
            const filteredData = noArchiveFilter ? dataFromApi : filterActivateOrDeactivate(dataFromApi, isActivated)
            setUserData(filteredData)
            setIsLoading(false)
            if(dataFromApi.length===0){
                setTableLength(0)
            }
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
        getProfileList()
    }
    async function getProfileList() {
        setIsProfileDataLoading(true)
        try {
            const profileList: any = await fetchProfileDataList()
            setProfileList(profileList)
            setIsProfileDataLoading(false)
        } catch (err) {
            console.error("user fetch error", err)
            setIsProfileDataLoading(false)
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

    React.useEffect(() => {
        if(isAddDialogClosed){
            fetchUserData()
            setIsAddDialogClosed(false)
        }
    }, [isAddDialogClosed])

    // React.useEffect(() => {
    //     setUserData(filterInboxOrArchive(dataFromApi, isActivated))
    // }, [isActivated])
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


    async function patchDeactivateUserData(ids: number[]) {

        const url = `${baseUrl}/v1/api/users/bulk_active/`;

        const isActive = !isActivated

        try {
            const dataResp = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({ users: ids, active: isActive }),
                headers: {
                    "Authorization": `Token ${token_superuser}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            const result = await dataResp.json();

            if (result.message === "success") {
                fetchUserData()
                toast({
                    title: `${ids.length} ${ids.length > 1 ? "Users" : "User"} ${!isActivated ? "Activated" : "Deactivated"} Succesfully!`,
                    variant: "dark"
                })
                return result;
            } else {
                throw new Error("Failed to patch user data");
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

        const promisePatch = patchDeactivateUserData(selectedRowIds)

        promisePatch
            .then((resp) => {
                // All patching operations are complete
                // You can run your code here
                console.log("All patching operations are done");
                fetchUserData()

            })
            .catch((error) => {
                console.log("Error during patching:", error);

            });
    }

    React.useEffect(() => {
        setUserData(filterActivateOrDeactivate(dataFromApi, isActivated))
    }, [isActivated])

    const addUserDialogButton = () => <AddUserDialogBox permissions={permissions} setIsAddDialogClosed={setIsAddDialogClosed}>
        <Button disabled={!permissions?.add} className="flex flex-row gap-2" type="button">
            <Image src="/images/plus.svg" alt="plus lead" height={20} width={20} />
            Add User
        </Button>
    </AddUserDialogBox>


    return (
        <>
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
                                            <Button type="button" variant={isActivated ? "default" : "ghost"} className={`rounded-r-none ${isActivated && "bg-success-500 hover:bg-success-600"}`} onClick={() => setIsActivated(true)}>
                                                <IconUserActive size={20} color={isActivated ? "white" : "#667085"} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={"bottom"} sideOffset={5}>
                                            Active Users
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="h-[full] w-[1px] bg-gray-300"></div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="button" variant={!isActivated ? "default" : "ghost"} className={`rounded-l-none ${!isActivated && "bg-error-500 hover:bg-error-600"}`} onClick={() => setIsActivated(false)}>
                                                <IconUserDeactive size={20} color={!isActivated ? "white" : "#667085"} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={"bottom"} sideOffset={5} >
                                            Deactivated Users
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>}
                        </div>
                        <div className="right flex flex-row gap-4 ">
                            {!form.getValues("queryParamString") && addUserDialogButton()}

                        </div>
                    </div>
                    <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                        <div className=" flex items-center flex-row gap-2">
                            <span className="text-sm ">{isLoading ? "Loading..." : isMultiSelectOn ? <span>Selected {selectedRowIds?.length} out of {tableLeadLength} {tableLeadLength > 1 ? "Users" : "User"}</span> : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Users" : "User"}` : "No Users"}</span>
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
                                        <Button variant={"google"} className="p-[8px]" type="button" onClick={() => fetchUserData()}>
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
                                        <Button disabled={!permissions?.change} variant={"default"} className={`flex flex-row gap-2 text-md font-medium  text-white-900 ${isActivated ? "bg-error-600 hover:bg-error-700" : "bg-success-600 hover:bg-success-700"} `} type="button">
                                            {isActivated ? <>
                                                <IconUserDeactive size={20} color={"white"} />
                                                Deactivate
                                            </> :
                                                <>
                                                    <IconUserActive size={20} color={"white"} />
                                                    Activate
                                                </>}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                                        <div className='w-fit'>
                                            <div className='flex flex-col gap-[32px] min-w-[380px] '>
                                                <div className='flex flex-col gap-[5px]'>
                                                    <div className='text-gray-900 text-lg'>Are you sure you want to continue?</div>
                                                    <div className='text-gray-600 font-normal font text-sm'> <span className="font-bold">{selectedRowIds?.length} {selectedRowIds && selectedRowIds?.length > 1 ? "Users" : "User"} </span> will be {isActivated ? "Deactivated" : "Activated"}</div>
                                                </div>
                                                <div className='flex flex-row gap-[12px] w-full'>
                                                    <DialogClose asChild>
                                                        <Button className='text-sm flex-1 font-semibold  px-[38px] py-[10px]' variant={'google'}>Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={archiveApi} className='flex-1 text-sm font-semibold px-[38px] py-[10px]'>{isActivated ? "Deactivate" : "Activate"} </Button>
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
                                            initialDateFrom={form.getValues("dateRange").range.from}
                                            initialDateTo={form.getValues("dateRange").range.to}
                                            queryParamString={form.getValues("queryParamString")}
                                            align="start"
                                            locale="en-GB"
                                            showCompare={false}
                                            classFromParent="sm:max-h-[50vh] xl:max-h-[60vh] 2xl:max-h-[400px] overflow-y-auto"
                                        />
                                    </div> <div className="">
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
                                    </div>
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="functions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover modal={true}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {formatData(field.value, 'Functions', ALL_FUNCTIONS)}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className=" p-0 !w-[230px]">
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
                                                                                    form.setValue("functions", ["allFunctions"])

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
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover modal={true}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                    {isProfileDataLoading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />  </> : profileList && formatData(field.value, 'Profiles', [{ value: "allProfiles", label: "All Profiles" }, ...profileList])}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className=" p-0 !w-[230px]">
                                                            <Command>
                                                                <CommandInput placeholder="Search Profile" />
                                                                <CommandEmpty>No Profile found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {profileList && [{ value: "allProfiles", label: "All Profiles" }, ...profileList].map((profile) => (
                                                                            <CommandItem
                                                                                value={profile.label}
                                                                                key={profile.value}
                                                                                onSelect={() => {
                                                                                    if (field.value.length > 0 && field.value.includes("allProfiles") && profile.value !== 'allProfiles') {
                                                                                        form.setValue("profiles", [...field.value.filter((value: string) => value !== 'allProfiles'), profile.value])
                                                                                    }
                                                                                    else if ((field.value?.length === 1 && field.value?.includes(profile.value) || profile.value == 'allProfiles')) {
                                                                                        form.setValue("profiles", ["allProfiles"])

                                                                                    }
                                                                                    else if (field.value?.includes(profile.value)) {
                                                                                        form.setValue("profiles", field.value?.filter((val: string) => val !== profile.value))
                                                                                    } else {
                                                                                        form.setValue("profiles", [...field.value, profile.value])
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {profile.label}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value?.includes(profile.value)
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
                                    {/* <div className="text-md font-medium">
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

                                    </div> */}
                                </>}
                        </div>
                    </div>
                </form>
            </Form>
            {
                isLoading ? (<div className="flex flex-row h-[60vh] justify-center items-center">
                    <Loader />
                </div>) : data?.length > 0 ? <div className="tbl w-full flex flex-1 flex-col">
                    <DataTable columns={columnsUsers(setChildDataHandler)} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"users"} />
                </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                    {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3 hover:bg-black-900 hover:fill-current text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                        <IconUsers size="20" />
                    </div>
                        <div>
                            <p className="text-md text-gray-900 font-semibold">{isActivated ? "No Active Users" : "No Deactivated Users"}</p>

                        </div>
                        {/* {isActivated && addUserDialogButton()} */}
                    </>
                    }
                </div>)
            }
            {childData?.row && <AddUserDialogBox permissions={permissions} parentData={{ childData, setChildDataHandler, open: true }} />}
        </>
    )
}

function filterActivateOrDeactivate(data: UsersGetResponse[], isActivated: boolean) {
    return data.filter((val) => val.is_active === isActivated)
}

export default Users