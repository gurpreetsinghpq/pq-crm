"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { ALL_FUNCTIONS, ALL_TEAM_LEADERS, COUNTRY_CODE, DESIGNATION, FUNCTION, PROFILE, REGION, TYPE } from '@/app/constants/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { COMMON_TAB_CLASSES, SELECTED_TAB_CLASSES, commonClasses, commonClasses2, commonFontClassesAddDialog } from '@/app/constants/classes'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { handleKeyPress, handleOnChangeNumeric } from './commonFunctions'
import { PopoverClose } from '@radix-ui/react-popover'
import { DialogClose } from '@radix-ui/react-dialog'
import { beforeCancelDialog } from './addLeadDetailedDialog'
import { IChildData } from './userManagement'
import { ClientGetResponse, IValueLabel, UsersGetResponse } from '@/app/interfaces/interface'
import { labelToValue } from './sideSheet'
import { IconPower, IconUsers } from '../icons/svgIcons'
import DataTable from './table/datatable'
import { columnsTeamsDialog } from './table/columns-team-dialog'
import { getToken } from './leads'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

const FormSchema = z.object({
    search: z.string({}),
    teamName: z.string({
        // required_error: "Please enter a name.",
    }).min(2),
    teamLeader: z.string({

    })

})

const tabs: IValueLabel[] = [
    { label: "All Users", value: "allUsers" },
    { label: "Selected Users", value: "selectedUsers" },
];


const TABS = {
    ALL_USERS: "All Users",
    SELECTED_USERS: "Selected Users",
}

function AddTeamDialogBox({ children, parentData = undefined }: { children?: any | undefined, parentData?: { childData: IChildData, setChildDataHandler: CallableFunction, open: boolean } | undefined }) {
    const [open, setOpen] = useState<boolean>(false)
    const [userAssigned, setUserAssigned] = useState<boolean>(true)
    const [showAssignUser, setShowAssignUser] = useState<boolean>(true)
    const [currentTab, setCurrentTab] = React.useState<string>(TABS.ALL_USERS)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [data, setUserData] = React.useState<UsersGetResponse[]>([])
    const [isMultiSelectOn, setIsMultiSelectOn] = React.useState<boolean>(false)
    const [selectedRowIds, setSelectedRowIds] = React.useState<[]>()
    const [isNetworkError, setIsNetworkError] = React.useState<boolean>(false)
    const [childData, setChildData] = React.useState<IChildData>()
    const [tableLeadLength, setTableLength] = React.useState<any>()
    const [selectedRows, setSelectedRows] = React.useState<UsersGetResponse[]>()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            search: "",
            teamName: "",
            teamLeader: undefined
        }
    })
    const [formSchema, setFormSchema] = useState(FormSchema)

    function setTableLeadRow(data: any) {
        const selectedRows = data.rows.filter((val: any) => val.getIsSelected())
        setIsMultiSelectOn(selectedRows.length !== 0)
        const ids = selectedRows.map((val: any) => val.original.id)
        setSelectedRowIds(ids)
        setTableLength(data.rows.length)
        setSelectedRows(selectedRows.map((row: any) => row.original))
    }

    console.log(selectedRows)

    function changeStdCode(value: string) {
        let updatedSchema
        console.log(value, value != "+91")
        if (value != "+91") {
            updatedSchema = FormSchema.extend({
                phone: z.string().min(4).max(13)
            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema
        }
        setFormSchema(updatedSchema)
    }

    function yesDiscard() {
        setOpen(false)
    }

    function addContact() {

    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    getToken()
    const token_superuser = getToken()
    async function fetchLeadData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/users/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: UsersGetResponse[] = structuredClone(result.data)
            let dataFromApi = data
            console.log(data)
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
    }

    useEffect(() => {
        fetchLeadData()
    }, [])

    const watcher = form.watch()
    // useEffect(()=>{
    //     console.log(form.getValues())
    // },[watcher])

    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            fetchLeadData()
        }
    }



    useEffect(() => {
        if (parentData?.open) {
            setOpen(parentData?.open)
            const { childData: { row }, setChildDataHandler } = parentData
            const data: UsersGetResponse = row.original
        } else {
            setOpen(false)
        }
    }, [parentData])

    function updateContact(): void {
        throw new Error('Function not implemented.')
    }

    function assignUsers(): void {
        setShowAssignUser(false)
    }


    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogTrigger asChild>
                    <div>
                        {children}
                    </div>
                </DialogTrigger>
                <DialogContent className="p-0" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className='px-[24px] pt-[30px] pb-[10px]'>
                            <div className='text-lg text-gray-900 font-semibold'>{parentData?.open ? "Edit Team" : "Add Team"}</div>
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        <Form {...form}>
                            <form>
                                <div className='w-fit min-w-[600px]  px-[24px]'>
                                    <Separator className="bg-gray-200 h-[1px]  mb-4" />
                                    <div className='flex flex-row gap-[16px]'>
                                        <FormField
                                            control={form.control}
                                            name="teamName"
                                            render={({ field }) => (
                                                <FormItem className='w-1/2'>
                                                    <FormControl>
                                                        <Input type="text" className={` ${commonClasses2}`} placeholder="Team Name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <FormField
                                            control={form.control}
                                            name="teamLeader"
                                            render={({ field }) => (
                                                <FormItem className='w-1/2 '>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {ALL_TEAM_LEADERS.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Team Leader</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[290px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Team Leader" />
                                                                <CommandEmpty>Team Leader not found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {ALL_TEAM_LEADERS.map((teamLeader) => (
                                                                            <CommandItem
                                                                                value={teamLeader.value}
                                                                                key={teamLeader.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("teamLeader", teamLeader.value)
                                                                                }}
                                                                            >
                                                                                <PopoverClose asChild>
                                                                                    <div className="flex flex-row items-center justify-between w-full">
                                                                                        {teamLeader.label}
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "mr-2 h-4 w-4 text-purple-600",
                                                                                                field.value === teamLeader.value
                                                                                                    ? "opacity-100"
                                                                                                    : "opacity-0"
                                                                                            )}
                                                                                        />
                                                                                    </div>
                                                                                </PopoverClose>
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
                                    <div className="flex flex-row gap-[10px] items-center mt-[24px]">
                                        <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                            <IconUsers size="20" />
                                        </div>
                                        <span className="text-xs text-gray-700">USERS</span>
                                        <div className="bg-gray-200 h-[1px] flex-1" ></div>
                                        <div className={`text-sm text-purple-700  ${!showAssignUser ? 'opacity-[1] cursor-pointer' : 'opacity-[0.3] cursor-not-allowed'}`} onClick={() => !showAssignUser && assignUsers()}>+ Assign Users</div>
                                    </div>
                                    <div className='text-gray-500 text-xs font-medium w-full mt-[24px] '>
                                        {!userAssigned ? <div className='flex flex-row w-full justify-center'>
                                            No Users Assigned
                                        </div> :
                                            <div className='flex flex-col gap-[24px]'>
                                                <div className="flex flex-row ">
                                                    <div onClick={() => setCurrentTab(TABS.ALL_USERS)} className={`${COMMON_TAB_CLASSES} ${currentTab === TABS.ALL_USERS && SELECTED_TAB_CLASSES}`}>{TABS.ALL_USERS}</div>
                                                    <div onClick={() => {
                                                        
                                                        setCurrentTab(TABS.SELECTED_USERS)

                                                    }} className={`${COMMON_TAB_CLASSES} ${currentTab === TABS.SELECTED_USERS && SELECTED_TAB_CLASSES}`}>{TABS.SELECTED_USERS} ({selectedRowIds?.length})</div>
                                                </div>
                                                {/* <Tabs defaultValue="allUsers" className="w-full ">
                                                    <TabsList className='w-full justify-start px-[24px]' >
                                                        {tabs.map((tab) => {
                                                            return <TabsTrigger key={tab.value} value={tab.value} ><div className='text-sm font-semibold '>{tab.label}</div></TabsTrigger>
                                                        })}
                                                    </TabsList>
                                                    <TabsContent value={"allUsers"}>
                                                        <DataTable columns={columnsTeamsDialog} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"teamsDialog"} />
                                                    </TabsContent>
                                                    <TabsContent value={"selectedUsers"}>
                                                        {selectedRows && <DataTable columns={columnsTeamsDialog} data={selectedRows} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"teamsDialog"} />}
                                                    </TabsContent>
                                                </Tabs> */}
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
                                                <div>
                                                    <DataTable columns={columnsTeamsDialog} data={currentTab===TABS.ALL_USERS ? data :  selectedRows ? selectedRows : []} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"teamsDialog"} />
                                                    {/* <DataTable columns={columnsTeamsDialog} data={ data } filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"teamsDialog"} /> */}
                                                </div>
                                            </div>
                                        }
                                    </div>

                                </div>
                                <div>
                                    <Separator className="bg-gray-200 h-[1px]  mt-8" />
                                    <div className={`flex flex-row gap-2 mx-6 my-6`}>
                                        {parentData?.open ?
                                            <div className='flex flex-row w-full justify-between '>
                                                <div className='flex flex-row gap-[8px] text-error-400 text-sm font-medium items-center'>
                                                    <IconPower size={20} />
                                                    Deactivate Team
                                                </div>
                                                <div className='flex flex-row gap-2'>
                                                    {beforeCancelDialog(yesDiscard)}
                                                    <Button type='button' disabled={!form.formState.isValid} onClick={() => updateContact()}>
                                                        Update
                                                    </Button>
                                                </div>
                                            </div>
                                            :
                                            <div className='flex flex-row flex-row gap-2 w-full justify-end'>
                                                {beforeCancelDialog(yesDiscard)}
                                                <Button type='button' disabled={!form.formState.isValid} onClick={() => addContact()}>
                                                    Save & Add
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddTeamDialogBox