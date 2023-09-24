"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { ALL_FUNCTIONS, COUNTRY_CODE, DESIGNATION, FUNCTION, PROFILE, REGION, REPORTING_MANAGERS, SET_VALUE_CONFIG, TYPE } from '@/app/constants/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { commonClasses, commonClasses2, commonFontClassesAddDialog } from '@/app/constants/classes'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { fetchProfileDataList, fetchTeamDataList, fetchUserDataList, handleKeyPress, handleOnChangeNumeric } from './commonFunctions'
import { PopoverClose } from '@radix-ui/react-popover'
import { DialogClose } from '@radix-ui/react-dialog'
import { beforeCancelDialog } from './addLeadDetailedDialog'
import { IChildData } from './userManagement'
import { IValueLabel, Permission, UserPatchBody, UserPostBody, UsersGetResponse } from '@/app/interfaces/interface'
import { labelToValue, valueToLabel } from './sideSheet'
import { IconPower, IconUserActive, IconUserDeactive } from '../icons/svgIcons'
import { getToken } from './leads'
import { toast } from '../ui/use-toast'

const FormSchema = z.object({
    firstName: z.string({
        // required_error: "Please enter a name.",
    }).min(1),
    lastName: z.string({
        // required_error: "Please select a region"
    }).min(1),
    email: z.string({
        // required_error: "Please select role type"
    }).email().min(1),
    std_code: z.string({
        // required_error: "Please select budget range"
    }).min(1).optional(),
    phone: z.string({
        // required_error: "Please select a lead source"
    }).min(10).max(10).optional(),
    region: z.string({

    }).min(1).transform((val) => val === undefined ? undefined : val.trim()),
    function: z.string({

    }).min(1).transform((val) => val === undefined ? undefined : val.trim()),
    reportingTo: z.string({

    }).min(1),
    profile: z.string({

    }).min(1),
    // timeZone: z.string({

    // })
})

// const allTimezones = getAllTimezones()

function AddUserDialogBox({ children, permissions, parentData = undefined, setIsAddDialogClosed }: { children?: any | undefined, permissions:Permission,  parentData?: { childData: IChildData, setChildDataHandler: CallableFunction, open: boolean } | undefined , setIsAddDialogClosed?:CallableFunction}) {
    const [open, setOpen] = useState<boolean>(false)
    const [userList, setUserList] = useState<IValueLabel[]>()
    const [teamList, setTeamList] = useState<IValueLabel[]>()
    const [profileList, setProfileList] = useState<IValueLabel[]>()    
    const [formSchema, setFormSchema] = useState(FormSchema)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            std_code: "+91",
            phone: undefined,
            region: undefined,
            function: undefined,
            reportingTo: undefined,
            profile: undefined,
            // timeZone: getClientTimezone()
        }
    })
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()
    const data: UsersGetResponse = parentData?.childData.row.original




    function changeStdCode() {
        const value = form.getValues("std_code")
        let updatedSchema
        console.log("std_code", value, value != "+91")
        if (value != "+91") {
            updatedSchema = FormSchema.extend({
                phone: z.string().min(4).max(13).optional()
            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema
        }
        setFormSchema(updatedSchema)
        console.log("updatedSchema", updatedSchema)
    }

    useEffect(()=>{
        console.log("formschema", formSchema)
        console.log("formschema errors", form.formState.errors)
        form.trigger()
    },[formSchema])

    function yesDiscard(isAdd:boolean=false) {
        setOpen(false)
        form.reset()
        if(isAdd && setIsAddDialogClosed){
            setIsAddDialogClosed(true)
        }else{
            parentData?.setChildDataHandler('row', undefined)
        }
    }

    async function addUser(isUpdate: boolean = false) {
        
        const dataToSend: UserPostBody = {
            first_name: form.getValues("firstName") || "",
            last_name: form.getValues("lastName") || "",
            email: form.getValues("email") || "",
            function: valueToLabel(form.getValues("function") || "", FUNCTION) || "",
            password: "12345678",
            profile: Number(form.getValues("profile")),
            reporting_to: Number(form.getValues("reportingTo")),
            region: valueToLabel(form.getValues("region") || "", REGION) || ""
        }
        
        const dataToSendOnUpdate: Partial<UserPatchBody> = {
            first_name: form.getValues("firstName") || "",
            last_name: form.getValues("lastName") || "",
            email: form.getValues("email") || "",
            function: valueToLabel(form.getValues("function") || "", FUNCTION) || "",
            // mobile: `${form.getValues("std_code")} ${form.getValues("phone")}` ,
            mobile: `${form.getValues("phone")}`,
            profile: Number(form.getValues("profile")),
            reporting_to: Number(form.getValues("reportingTo")),
            region: valueToLabel(form.getValues("region") || "", REGION) || ""
        }
       
        if(form.getValues("phone")){
            const mobileNumber = `${form.getValues("std_code")} ${form.getValues("phone")}` 
            dataToSend["mobile"] = mobileNumber
            dataToSendOnUpdate["mobile"] = mobileNumber
        }else{
            dataToSend["mobile"] = ""
            dataToSendOnUpdate["mobile"] =""
        }
        
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/users/${isUpdate ? `${parentData?.childData.row.original.id}/` : ""}`, { method: isUpdate ? "PATCH" : "POST", body: JSON.stringify(isUpdate ? dataToSendOnUpdate : dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })

            const result = await dataResp.json()
            if (result.status == "1") {
                toast({
                    title: `User ${isUpdate ? "Updated" : "Created"} Succesfully!`,
                    variant: "dark"
                })
                console.log(result)
                yesDiscard(true)
            } else {
                if(result?.error?.email?.includes("user with this email already exists")){
                    toast({
                        title: "user with this email already exists",
                        variant: "destructive"
                    })
                }else{
                    toast({
                        title: "Api Failure!",
                        variant: "destructive"
                    })
                }
            }

        } catch (err) {
            console.log(err)
        }

    }

    async function getUserList() {
        try {
            const userList: any = await fetchUserDataList()
            setUserList(userList)
        } catch (err) {
            console.error("user fetch error", err)
        }

    }

    async function getTeamList() {
        try {
            const teamList: any = await fetchTeamDataList()
            setTeamList(teamList)
        } catch (err) {
            console.error("user fetch error", err)
        }
    }

    async function getProfileList() {
        try {
            const profileList: any = await fetchProfileDataList()
            setProfileList(profileList)
        } catch (err) {
            console.error("user fetch error", err)
        }
    }

    useEffect(() => {
        getUserList()
        getTeamList()
        getProfileList()
        changeStdCode()
    }, [])

    useEffect(() => {
        if (parentData?.open) {
            setOpen(parentData?.open)
            const { childData: { row }, setChildDataHandler } = parentData
            const data: UsersGetResponse = row.original
            form.setValue("firstName", data.first_name)
            form.setValue("lastName", data.last_name)
            form.setValue("email", data.email)
            const [stdCode, mobile] =  data.mobile.split(" ")
            if(stdCode?.length>0 && mobile?.length>0){
                form.setValue("phone", mobile)
                form.setValue("std_code",stdCode)
            }
            form.setValue("reportingTo", data?.reporting_to?.id?.toString())
            form.setValue("profile", data.profile.id.toString())
            form.setValue("function", labelToValue(data.function, ALL_FUNCTIONS) || undefined)
            form.setValue("region", labelToValue(data.region || "", REGION) || undefined)
            console.log("function", labelToValue(data.function, ALL_FUNCTIONS))
        } else {
            setOpen(false)
        }
    }, [parentData])

    function updateContact(): void {
        throw new Error('Function not implemented.')
    }


    useEffect(() => {
        // console.log(form.getValues())
        // console.log(allTimezones.find((val) => console.log(val.value, form.getValues("timeZone")))?.label)
        const subscription = form.watch(() => {
            form.getValues()
            console.log(form.formState.isValid, form.formState.isDirty, form.formState.errors)
        })
        return () => subscription.unsubscribe()
    }, [form.watch])


    async function patchDeactivateUserData() {
        const ids = [parentData?.childData.row.original.id]
        const isActive = !parentData?.childData.row.original.is_active
        const url = `${baseUrl}/v1/api/users/bulk_active/`;

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
                yesDiscard()
                toast({
                    title: `${ids.length} ${ids.length > 1 ? "Users" : "User"} ${isActive ? "Activated" : "Deactivated"} Succesfully!`,
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
                        console.log("this should not be called");
                        yesDiscard()
                    }
                }}>
                    <DialogHeader>
                        <DialogTitle className='px-[24px] pt-[30px] pb-[10px]'>
                            <div className='flex flex-row justify-between w-full items-center'>
                                <div className='text-lg text-gray-900 font-semibold'>{parentData?.open ? "Edit User" : "Add User"}</div>
                                {
                                    parentData?.open &&
                                    <Button disabled={!permissions?.change || !data.is_email_verified} onClick={() => patchDeactivateUserData()} variant={"default"} className={`flex flex-row gap-2 text-md font-medium  text-white-900 ${data.is_active ? "bg-error-600 hover:bg-error-700" : "bg-success-600 hover:bg-success-700"} `}>
                                        {
                                            data.is_active ? <>
                                                <IconUserDeactive size={20} color={"white"} />
                                                Deactivate User
                                            </> :
                                                <>
                                                    <IconUserActive size={20} color={"white"} />
                                                    Activate User
                                                </>
                                        }

                                    </Button>
                                    // <div className='flex flex-row gap-[8px] text-error-400 text-sm font-medium items-center'>
                                    //     <IconPower size={20} />
                                    //     Deactivate User
                                    // </div>

                                }
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        <Form {...form}>
                            <form>
                                <div className='w-fit min-w-[600px] '>
                                    <Separator className="bg-gray-200 h-[1px]  mb-4" />
                                    <div className='grid grid-cols-2 gap-[16px] px-[24px]'>
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" className={` ${commonClasses2}`} placeholder="First Name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" className={` ${commonClasses2}`} placeholder="Last Name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" className={`${commonClasses2}`} placeholder="Email" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <div className=''>
                                                <FormField
                                                    control={form.control}
                                                    name="std_code"
                                                    render={({ field }) => (
                                                        <FormItem >
                                                            <Popover >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button variant={"google"} className={`flex flex-row gap-2 ${commonClasses2}`} >
                                                                            {COUNTRY_CODE.find((val) => {
                                                                                return val.value === field.value
                                                                            })?.value}
                                                                            <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[200px] p-0 ml-[114px]">
                                                                    <Command >
                                                                        <CommandInput className='w-full' placeholder="Search Country Code" />
                                                                        <CommandEmpty>Country code not found.</CommandEmpty>
                                                                        <CommandGroup >
                                                                            <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                                {COUNTRY_CODE.map((cc) => (
                                                                                    <CommandItem
                                                                                        value={cc.label}
                                                                                        key={cc.label}
                                                                                        onSelect={() => {
                                                                                            form.setValue("std_code", cc.value, SET_VALUE_CONFIG)
                                                                                            changeStdCode()
                                                                                        }}
                                                                                    >
                                                                                        <PopoverClose asChild>
                                                                                            <div className="flex flex-row items-center justify-between w-full">
                                                                                                {cc.label}
                                                                                                <Check
                                                                                                    className={cn(
                                                                                                        "mr-2 h-4 w-4 text-purple-600",
                                                                                                        field.value?.includes(cc.value)
                                                                                                            ? "opacity-100"
                                                                                                            : "opacity-0"
                                                                                                    )} />
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
                                                    )} />
                                            </div>
                                            <div className='flex-1'>
                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormControl>
                                                            <Input type="text" className={`w-full ${commonClasses2}`} placeholder="Phone No (Optional)" {...field}
                                                                onKeyPress={handleKeyPress}
                                                                onChange={event => {
                                                                    return handleOnChangeNumeric(event, field, false)
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )} />
                                            </div>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="reportingTo"
                                            render={({ field }) => (
                                                <FormItem className='w-full '>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {userList && userList.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Reporting To</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[350px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Reporting Manager" />
                                                                <CommandEmpty>Reporting Manager not found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {userList && userList.map((reportingManager) => (
                                                                            <CommandItem
                                                                                value={reportingManager.value}
                                                                                key={reportingManager.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("reportingTo", reportingManager.value, SET_VALUE_CONFIG)
                                                                                }}
                                                                            >
                                                                                <PopoverClose asChild>
                                                                                    <div className="flex flex-row items-center justify-between w-full">
                                                                                        {reportingManager.label}
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "mr-2 h-4 w-4 text-purple-600",
                                                                                                field.value === reportingManager.value
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


                                        <FormField
                                            control={form.control}
                                            name="region"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Region" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                REGION.map((region, index) => {
                                                                    return <SelectItem key={index} value={region.value}>
                                                                        {region.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                    {/* <FormMessage /> */}
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="function"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Function" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                FUNCTION.map((func, index) => {
                                                                    return <SelectItem key={index} value={func.value}>
                                                                        {func.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                    {/* <FormMessage /> */}
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="profile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Profile" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                profileList && profileList.map((region, index) => {
                                                                    return <SelectItem key={index} value={region.value}>
                                                                        {region.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                    {/* <FormMessage /> */}
                                                </FormItem>
                                            )}
                                        />
                                        {/* <FormField
                                            control={form.control}
                                            name="timeZone"
                                            render={({ field }) => (
                                                <FormItem className='w-full col-span-2'>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {allTimezones.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Time Zone</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[713px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Timezone" />
                                                                <CommandEmpty>Search Time Zone.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {allTimezones.map((timeZone) => (
                                                                            <CommandItem
                                                                                value={timeZone.value}
                                                                                key={timeZone.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("timeZone", timeZone.value)
                                                                                }}
                                                                            >
                                                                                <PopoverClose asChild>
                                                                                    <div className="flex flex-row items-center justify-between w-full">
                                                                                        {timeZone.label}
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "mr-2 h-4 w-4 text-purple-600",
                                                                                                field.value === timeZone.value
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
                                        /> */}
                                        {/* <div className='text-sm text-gray-600 font-normal col-span-2'>Timezone is updated automatically to match your computer timezone</div> */}

                                    </div>

                                </div>

                                <div>
                                    <Separator className="bg-gray-200 h-[1px]  mt-8" />
                                    <div className={`flex flex-row gap-2 mx-6 my-6`}>
                                        {
                                            parentData?.open ?
                                                <div className='flex flex-row gap-2 w-full justify-end'>
                                                    {beforeCancelDialog(yesDiscard)}
                                                    <Button type='button' disabled={!form.formState.isValid || !form.formState.isDirty || !permissions?.change} onClick={() => addUser(true)}>
                                                        Update
                                                    </Button>
                                                </div> :
                                                <div className='flex flex-row flex-row gap-2 w-full justify-end'>
                                                    {beforeCancelDialog(yesDiscard)}
                                                    <Button type='button' disabled={!form.formState.isValid} onClick={() => addUser()}>
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

function getClientTimezone() {
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(timeZoneOffsetMinutes) / 60);
    const minutes = Math.abs(timeZoneOffsetMinutes) % 60;
    const sign = timeZoneOffsetMinutes > 0 ? '-' : '+';

    const timeZoneString = `Time Zone (${sign}${hours}:${minutes < 10 ? '0' : ''}${minutes})`;
    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return `${timeZoneString} ${timeZoneName}`;
}

function getAllTimezones(): IValueLabel[] {
    const allTimezones = Intl.supportedValuesOf('timeZone');

    const timezoneOptions: IValueLabel[] = allTimezones
        .map((timezone) => ({
            value: `Time Zone (${getUserTimezoneOffset(timezone)}) ${timezone}`,
            label: `Time Zone (${getUserTimezoneOffset(timezone)}) ${timezone}`,
        }));

    return timezoneOptions;
}

function getUserTimezoneOffset(timezone: string): string {
    const now = new Date();
    const userTimezoneOffset = now
        .toLocaleTimeString('en-us', { timeZone: timezone, timeZoneName: 'short' })
        .split(' ')[2];
    return userTimezoneOffset;
}

export default AddUserDialogBox