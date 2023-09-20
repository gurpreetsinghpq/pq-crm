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
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses, INDUSTRIES, ALL_DOMAINS, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_LAST_FUNDING_STAGE, DESIGNATION, ALL_DESIGNATIONS, ALL_TYPES, ALL_FUNCTIONS, ALL_PROFILES, OWNERS, ALL_TEAM_LEADERS } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconArchive, IconArchive2, IconArrowSquareRight, IconContacts, IconCross, IconInbox, IconUserCheck, IconUserCross, IconUsers, Unverified } from "../icons/svgIcons"
import { DateRangePicker, getThisMonth } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { ClientGetResponse, ContactsGetResponse, IValueLabel, LeadInterface, PatchLead, TeamGetResponse, User, UsersGetResponse } from "@/app/interfaces/interface"
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
import AddUserDialogBox from "./addUserDialogBox"
import { columnsUsers } from "./table/columns-users"
import { formatData, getToken } from "./leads"
import { columnsTeams } from "./table/columns-teams"
import AddTeamDialogBox from "./addTeamDialogBox"
import { fetchUserDataList } from "./commonFunctions"

type Checked = DropdownMenuCheckboxItemProps["checked"]




// let tableLeadLength = 0

export interface IChildData {
    row: any
}


function Teams({ form }: {
    form: UseFormReturn<{
        teamLeaders: string[];
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>
}) {

    const { toast } = useToast()

    const router = useRouter();

    const [data, setUserData] = React.useState<TeamGetResponse[]>([])

    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [isMultiSelectOn, setIsMultiSelectOn] = React.useState<boolean>(false)
    const [isInbox, setIsInbox] = React.useState<boolean>(true)
    const [isNetworkError, setIsNetworkError] = React.useState<boolean>(false)
    const [tableLeadLength, setTableLength] = React.useState<any>()
    const [selectedRowIds, setSelectedRowIds] = React.useState<[]>()

    const [childData, setChildData] = React.useState<IChildData>()
    const [isUserDataLoading, setIsUserDataLoading] = React.useState<boolean>(true)
    const [userList, setUserList] = React.useState<IValueLabel[]>()



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
    getToken()
    const token_superuser = getToken()
    async function fetchLeadData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/team/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: TeamGetResponse[] = structuredClone(result.data)
            let dataFromApi = data
            setUserData(dataFromApi)
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

    const watcher = form.watch()


    React.useEffect(() => {
        console.log(watcher)
    }, [watcher])

    // React.useEffect(() => {
    //     setUserData(filterInboxOrArchive(dataFromApi, isInbox))
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

    const addTeamDialogButton = () => <AddTeamDialogBox>
        <Button className="flex flex-row gap-2" type="button">
            <Image src="/plus.svg" alt="plus lead" height={20} width={20} />
            Add Team
        </Button>
    </AddTeamDialogBox>


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
                        </div>
                        <div className="right flex flex-row gap-4 ">
                            {!form.getValues("queryParamString") && addTeamDialogButton()}

                        </div>
                    </div>
                    <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                        <div className=" flex items-center flex-row gap-2">
                            <span className="text-sm ">{isLoading ? "Loading..." : isMultiSelectOn ? <span>Selected {selectedRowIds?.length} out of {tableLeadLength} {tableLeadLength > 1 ? "Teams" : "Team"}</span> : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Teams" : "Team"}` : "No Teams"}</span>
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
                                            name="teamLeaders"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex flex-row gap-2">
                                                                    {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                    {isUserDataLoading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />  </> : userList && formatData(field.value, 'Team Leaders', [{ value: "allTeamLeaders", label: "All Team Leaders" }, ...userList])}
                                                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[230px] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Search Team Leader" />
                                                                <CommandEmpty>No Team Leader found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {userList && [{ value: "allTeamLeaders", label: "All Team Leaders" }, ...userList].map((teamLeader) => (
                                                                            <CommandItem
                                                                                value={teamLeader.value}
                                                                                key={teamLeader.value}
                                                                                onSelect={() => {
                                                                                    if (field.value.length > 0 && field.value.includes("allTeamLeaders") && teamLeader.value !== 'allTeamLeaders') {
                                                                                        form.setValue("teamLeaders", [...field.value.filter((value: string) => value !== 'allTeamLeaders'), teamLeader.value])
                                                                                    }
                                                                                    else if ((field.value?.length === 1 && field.value?.includes(teamLeader.value) || teamLeader.value == 'allTeamLeaders')) {
                                                                                        form.setValue("teamLeaders", ["allTeamLeaders"])

                                                                                    }
                                                                                    else if (field.value?.includes(teamLeader.value)) {
                                                                                        form.setValue("teamLeaders", field.value?.filter((val: string) => val !== teamLeader.value))
                                                                                    } else {
                                                                                        form.setValue("teamLeaders", [...field.value, teamLeader.value])
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {teamLeader.label}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value?.includes(teamLeader.value)
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
                    <DataTable columns={columnsTeams(setChildDataHandler)} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"teams"} />
                </div> : (<div className="flex flex-col gap-6 items-center p-10 ">
                    {isNetworkError ? <div>Sorry there was a network error please try again later...</div> : <><div className="h-12 w-12 mt-4 p-3 hover:bg-black-900 hover:fill-current text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                        <IconUsers size="20" />
                    </div>
                        <div>
                            <p className="text-md text-gray-900 font-semibold">{isInbox ? "No Teams" : "No Archive Teams"}</p>

                        </div>
                        {isInbox && addTeamDialogButton()}</>}
                </div>)
            }
            {childData?.row && <AddTeamDialogBox parentData={{ childData, setChildDataHandler, open: true }} />}
        </>
    )
}

export default Teams