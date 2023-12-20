"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, ChevronDown, MinusCircle } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { ALL_FUNCTIONS, ALL_TEAM_LEADERS, COUNTRY_CODE, DESIGNATION, FUNCTION, PROFILE, REGION, TEAM_LEADERS, TYPE } from '@/app/constants/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { COMMON_TAB_CLASSES, SELECTED_TAB_CLASSES, commonClasses, commonClasses2, commonFontClassesAddDialog, tableHeaderClass } from '@/app/constants/classes'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { fetchUserDataList, fetchUserDataListForDrodpdown, getToken } from './commonFunctions'
import { PopoverClose } from '@radix-ui/react-popover'
import { DialogClose } from '@radix-ui/react-dialog'
import { beforeCancelDialog } from './addLeadDetailedDialog'
import { IChildData } from './userManagement'
import { ClientGetResponse, IValueLabel, Permission, TeamGetResponse, TeamsPostBody, UsersGetResponse } from '@/app/interfaces/interface'
import { labelToValue } from './sideSheet'
import { IconPower, IconTrash, IconUsers } from '../icons/svgIcons'
import DataTable from './table/datatable'
import { columnsTeamsDialog } from './table/columns-team-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import DataTableAddTeamDialog from './table/datatable-addteam'
import { toast } from '../ui/use-toast'

const FormSchema = z.object({
    search: z.string({}).optional(),
    teamName: z.string({
        // required_error: "Please enter a name.",
    }).min(1),
    teamLeader: z.string({
    }).min(1),
    searchSelected: z.string().optional()

})

const TABS = {
    ALL_USERS: "All Users",
    SELECTED_USERS: "Selected Users",
}

function AddTeamDialogBox({ children, permissions, parentData = undefined, setIsAddDialogClosed = undefined }: { children?: any | undefined, permissions: Permission, parentData?: { childData: IChildData, setChildDataHandler: CallableFunction, open: boolean } | undefined, setIsAddDialogClosed?: CallableFunction }) {
    const [open, setOpen] = useState<boolean>(false)
    const [userList, setUserList] = useState<IValueLabel[]>()
    const [userAssigned, setUserAssigned] = useState<boolean>(true)
    const [showAssignUser, setShowAssignUser] = useState<boolean>(false)
    const [showAssignUserTable, setShowAssignUserTable] = useState<boolean>(false)
    const [currentTab, setCurrentTab] = React.useState<string>(TABS.ALL_USERS)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [data, setUserData] = React.useState<UsersGetResponse[]>([])
    const [isMultiSelectOn, setIsMultiSelectOn] = React.useState<boolean>(false)
    const [selectedRowIds, setSelectedRowIds] = React.useState<[]>()
    const [isNetworkError, setIsNetworkError] = React.useState<boolean>(false)
    const [isUpdated, setIsUpdated] = React.useState<boolean>(false)
    const [childData, setChildData] = React.useState<IChildData>()
    const [tableLeadLength, setTableLength] = React.useState<any>()
    const [selectedRows, setSelectedRows] = React.useState<UsersGetResponse[] | null>(null)
    const [selectedOnEditModeRows, setSelectedOnEditModeRows] = React.useState<any[]>()
    const [table, setTable] = React.useState<any>()
    const [valueToSearch, setValueToSearch] = useState<string>()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            search: "",
            teamName: "",
            teamLeader: "",
            searchSelected: ""
        }
    })
    const [formSchema, setFormSchema] = useState(FormSchema)

    function setTableLeadRow(dataLocal: any, selectedData: any) {
        // const selectedRows = dataLocal.rows.filter((val: any) => val.getIsSelected())
        const selectedRowsLocal = selectedData.rows.filter((val: any) => val.getIsSelected())

        setIsMultiSelectOn(selectedRowsLocal.length !== 0)
        const ids = selectedRowsLocal.map((val: any) => val.original.id)
        setSelectedRowIds(ids)
        setTableLength(dataLocal.rows.length)
        setSelectedRows(selectedRowsLocal.map((row: any) => row.original))

        // if(data){
        // }
        // if(parentData?.childData.row.original.members.length != selectedRows?.length){
        //     if(isUpdated===false){
        //         setIsUpdated(true)
        //     }
        // }
        
    }

    function setTableSelectedRow(data: any) {

    }




    function changeStdCode(value: string) {
        let updatedSchema
        if (value != "+91") {
            updatedSchema = FormSchema.extend({
                phone: z.string().min(4).max(13)
            })
        } else {
            updatedSchema = FormSchema
        }
        setFormSchema(updatedSchema)
    }

    function yesDiscard(isAdd: boolean = false) {
        if (isAdd && setIsAddDialogClosed) {
            setIsAddDialogClosed(true)
        } else {
            parentData?.setChildDataHandler('row', undefined)
        }
        form.reset()
        setShowAssignUser(false)
        setShowAssignUserTable(false)
        setCurrentTab(TABS.ALL_USERS)
        setOpen(false)

    }

    async function addTeam(isUpdate: boolean = false) {
        const profileName = form.getValues("teamName")
        const teamLeader = form.getValues("teamLeader")
        const members = selectedRows?.map((val) => val.id)
        if (members && members?.length > 0) {
            const dataToSend: TeamsPostBody = {
                name: profileName,
                leader: Number(teamLeader),
                members: members
            }


            try {
                const dataResp = await fetch(`${baseUrl}/v1/api/team/${isUpdate ? `${parentData?.childData.row.original.id}/` : ""}`, { method: isUpdate ? "PATCH" : "POST", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })

                const result = await dataResp.json()
                if (result.status == "1") {
                    toast({
                        title: `Team ${isUpdate ? "Updated" : "Created"} Succesfully!`,
                        variant: "dark"
                    })
                    yesDiscard(true)
                } else {
                    toast({
                        title: "Api Failure!",
                        variant: "destructive"
                    })
                }

            } catch (err) {
                console.log(err)
            }
        }

    }
    async function fetchUserData(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/users/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: UsersGetResponse[] = structuredClone(result.data)
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
    }

    async function getUserList() {
        try {
            const userList: any = await fetchUserDataListForDrodpdown()
            setUserList(userList)
        } catch (err) {
            console.error("user fetch error", err)
        }
    }

    useEffect(() => {

        fetchUserData()
        getUserList()
    }, [])


    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            fetchUserData()
        }
    }



    useEffect(() => {
        if (parentData?.open) {
            setOpen(parentData?.open)
            const { childData: { row }, setChildDataHandler } = parentData
            const data: TeamGetResponse = row.original
            form.setValue("teamName", data?.name)
            setSelectedOnEditModeRows(data.members)
            form.setValue("teamLeader", data.leader.id.toString())
            setShowAssignUserTable(true)

        } else {
            setOpen(false)
        }
    }, [parentData])

    useEffect(() => {
        // set selected table data on edit mode
        if (parentData?.open) {

            if (selectedOnEditModeRows) {
                let selectedObj: any = {}
                selectedOnEditModeRows.map((val) => {
                    selectedObj[val.id] = true
                })
                table.setRowSelection((val: any) => {
                    console.log(val)
                    return selectedObj
                })
            }
        }
    }, [table])

    function assignUsers(): void {
        setShowAssignUserTable(true)
        setShowAssignUser(false)
    }

    async function deleteTeam() {
        const profileName = form.getValues("teamName")
        const teamLeader = form.getValues("teamLeader")
        const dataToSend: TeamsPostBody = {
            name: profileName,
            leader: Number(teamLeader),
            members: []
        }
        const id = parentData?.childData.row.original.id
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/team/${id}/`, { method: "PATCH", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.status == "1") {
                const dataResp = await fetch(`${baseUrl}/v1/api/team/${id}/`, { method: "DELETE", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
                if (dataResp.status === 204) {
                    toast({
                        title: `Team Deleted Succesfully!`,
                        variant: "dark"
                    })
                    yesDiscard()
                } else {
                    const result = await dataResp.json()
                    if (result.status == "1") {
                        yesDiscard()
                        toast({
                            title: `Team Deleted Succesfully!`,
                            variant: "dark"
                        })

                    } else {
                        toast({
                            title: "Api Failure!",
                            variant: "destructive"
                        })
                    }
                }
            } else {
                toast({
                    title: "Api Failure!",
                    variant: "destructive"
                })
            }

        } catch (err) {
            console.log(err)
        }

    }


    function resetSelectedFields(selectedRow: any) {
        let deselectObj: any = {}
        selectedRows?.map((val: any) => {
            if (val.id === selectedRow.id) {
                deselectObj[val.id] = false
            } else {
                deselectObj[val.id] = true
            }
        })
        table.setRowSelection((val: any) => {
            return deselectObj
        })
    }

    const watcher = form.watch()
    useEffect(() => {
        // console.log(watcher.teamName, watcher.teamLeader, form.formState.isValid, form.getFieldState("teamName").invalid, form.getFieldState("teamLeader").invalid )
        // console.log(form.getValues())
        // form.trigger()
        if (form.formState.isValid) {
            setShowAssignUser(true)
        } else {
            setShowAssignUser(false)
            // setShowAssignUserTable(false)
        }

    }, [watcher])



    useEffect(() => {
        console.log(form.getValues("searchSelected"))
        setValueToSearch(form.getValues("searchSelected"))
    }, [watcher.searchSelected])

    const filteredData = selectedRows?.filter((val) => {
        // console.log(valueToSearch,  `${val.first_name} ${val.last_name}`.toLowerCase().includes(valueToSearch) || val.email.toLowerCase() === valueToSearch,  `${val.first_name} ${val.last_name}`.toLowerCase(), `${val.first_name} ${val.last_name}`.toLowerCase() === valueToSearch , val.email.toLowerCase(), val.email.toLowerCase() === valueToSearch)
        if (valueToSearch && valueToSearch?.trim().length > 0) {
            return `${val.first_name} ${val.last_name}`.toLowerCase().includes(valueToSearch) || val.email.toLowerCase().includes(valueToSearch)
        }
        return val
    })
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogTrigger asChild>
                    <div>
                        {children}
                    </div>
                </DialogTrigger>
                <DialogContent className="p-0" onPointerDownOutside={(e) => e.preventDefault()} onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        yesDiscard()
                    }
                }}>
                    <DialogHeader>
                        <DialogTitle className='px-[24px] pt-[30px] pb-[10px]'>
                            <div className='flex flex-row justify-between w-full items-center'>
                                <div className='text-lg text-gray-900 font-semibold'>{parentData?.open ? "Edit Team" : "Add Team"}</div>
                                {
                                    parentData?.open &&
                                    <>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={"default"} className='flex flex-row gap-2 text-md font-medium bg-error-500 text-white-900 hover:bg-error-600' disabled={selectedRows?.length !== 0 || !permissions?.change} >
                                                    <IconTrash size={20} color={"white"} />
                                                    Delete Team
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                                                <div className='w-fit'>
                                                    <div className='flex flex-col gap-[32px] min-w-[380px] '>
                                                        <div className='flex flex-col gap-[5px]'>
                                                            <div className='text-gray-900 text-lg'>Are you sure you want to continue?</div>
                                                            <div className='text-gray-600 font-normal font text-sm'> Team  <span className="font-bold">  {form.getValues("teamName")} </span> will be Deleted</div>
                                                        </div>
                                                        <div className='flex flex-row gap-[12px] w-full'>
                                                            <DialogClose asChild>
                                                                <Button className='text-sm flex-1 font-semibold  px-[38px] py-[10px]' variant={'google'}>Cancel</Button>
                                                            </DialogClose>
                                                            <Button onClick={() => deleteTeam()} className='flex-1 text-sm font-semibold px-[38px] py-[10px]'>Delete Team </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                    // <div className='flex flex-row gap-[8px] text-error-400 text-sm font-medium items-center'>
                                    //     <IconPower size={20} />
                                    //     Deactivate User
                                    // </div>

                                }
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className='xl:max-h-[520px] 2xl:max-h-[640px] min-w-[770px] overflow-y-auto'>
                        <Form {...form}>
                            <form>
                                <div className='w-fit min-w-[770px]  px-[24px]'>
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
                                                    <Popover modal={true}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {userList && userList.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Team Leader</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Team Leader" />
                                                                <CommandEmpty>Team Leader not found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px]  overflow-y-auto'>
                                                                        {userList && userList.map((teamLeader) => (
                                                                            <CommandItem
                                                                                value={teamLeader.label}
                                                                                key={teamLeader.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("teamLeader", teamLeader.value, { shouldDirty: true, shouldValidate: true })
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
                                        <span className="text-xs text-gray-700">ASSIGN USERS</span>
                                        <div className="bg-gray-200 h-[1px] flex-1" ></div>
                                        {!parentData?.open && <div className={`text-sm text-purple-700  ${showAssignUser && !showAssignUserTable ? 'opacity-[1] cursor-pointer' : 'opacity-[0.3] cursor-not-allowed'}`} onClick={() => showAssignUser && !showAssignUserTable && assignUsers()}>+ Assign Users</div>}
                                    </div>
                                    <div className='text-gray-500 text-xs font-medium w-full mt-[24px] '>
                                        {!showAssignUserTable ? <div className='flex flex-row w-full justify-center'>
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
                                                {currentTab === TABS.ALL_USERS && <FormField
                                                    control={form.control}
                                                    name="search"
                                                    render={({ field }) => (
                                                        <FormItem className="w-2/3">
                                                            <FormControl>
                                                                <Input placeholder="Search all users" className="text-md border" {...field} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />}
                                                {currentTab === TABS.SELECTED_USERS && <FormField
                                                    control={form.control}
                                                    name="searchSelected"
                                                    render={({ field }) => (
                                                        <FormItem className="w-2/3">
                                                            <FormControl>
                                                                <Input placeholder="Search selected users" className="text-md border" {...field} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />}
                                                <div>
                                                    {
                                                        <div className={`${currentTab === TABS.ALL_USERS ? "block" : "hidden"}`}>
                                                            {data && <DataTableAddTeamDialog setTable={setTable} columns={columnsTeamsDialog} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"teamsDialog"} />}
                                                        </div>
                                                    }
                                                    {/* <DataTable columns={columnsTeamsDialog} data={ data } filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"teamsDialog"} /> */}
                                                    {
                                                        currentTab === TABS.SELECTED_USERS &&
                                                        <div className='grid grid-cols-2 border border-[1px] border-gray-200 w-full max-h-[200px] overflow-y-auto'>
                                                            <div className={tableHeaderClass}>
                                                                Name & Email
                                                            </div>
                                                            <div className={tableHeaderClass}>
                                                                Mobile
                                                            </div>
                                                            {
                                                                selectedRows && selectedRows?.length > 0 ? (filteredData && filteredData?.length > 0 ? filteredData?.map((val) => {
                                                                    return <>
                                                                        <div className='flex flex-col px-[24px] py-[16px] border-b-[1px] border-gray-200'>
                                                                            <div className='text-sm font-medium text-gray-900'>{val.first_name} {val.last_name}</div>
                                                                            <div className='text-sm font-normal text-gray-600'>{val.email}</div>
                                                                        </div>
                                                                        <div className='flex flex-row justify-between px-[24px] py-[16px] items-center border-b-[1px] border-gray-200'>
                                                                            <div className='text-sm font-medium text-gray-900'>{val.mobile}</div>
                                                                            <div >
                                                                                <MinusCircle color='#D92D20' className="cursor-pointer" onClick={() => resetSelectedFields(val)} />
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                }) :
                                                                    <div className='flex flex-col px-[24px] py-[16px] text-center col-span-2'>
                                                                        No search results found.
                                                                    </div>
                                                                ) : (<div className='flex flex-col px-[24px] py-[16px] text-center col-span-2'>
                                                                    No user selected.
                                                                </div>)

                                                            }
                                                            <div></div>
                                                        </div>}
                                                </div>
                                            </div>
                                        }
                                    </div>

                                </div>
                                <div>
                                    <Separator className="bg-gray-200 h-[1px]  mt-8" />
                                    <div className={`flex flex-row gap-2 mx-6 my-6`}>
                                        {parentData?.open ?
                                            <div className='flex flex-row gap-2 w-full justify-end'>
                                                {beforeCancelDialog(yesDiscard)}
                                                <Button type='button' disabled={!form.formState.isValid || !(selectedRows && selectedRows?.length > 0) || !permissions?.change} onClick={() => addTeam(true)}>
                                                    Update
                                                </Button>
                                            </div>
                                            :
                                            <div className='flex flex-row flex-row gap-2 w-full justify-end'>
                                                {beforeCancelDialog(yesDiscard)}
                                                <Button type='button' disabled={!(form.formState.isValid) || !(selectedRows && selectedRows?.length > 0)} onClick={() => addTeam()}>
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