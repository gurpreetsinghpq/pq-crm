"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { ALL_FUNCTIONS, COUNTRY_CODE, DESIGNATION, FUNCTION, PROFILE, REGION, REPORTING_MANAGERS, TYPE } from '@/app/constants/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { commonClasses, commonClasses2, commonFontClassesAddDialog } from '@/app/constants/classes'
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
import { IValueLabel, UsersGetResponse } from '@/app/interfaces/interface'
import { labelToValue } from './sideSheet'
import { IconPower, IconUserDeactive } from '../icons/svgIcons'

const FormSchema = z.object({
    firstName: z.string({
        // required_error: "Please enter a name.",
    }).min(2),
    lastName: z.string({
        // required_error: "Please select a region"
    }),
    email: z.string({
        // required_error: "Please select role type"
    }).email(),
    std_code: z.string({
        // required_error: "Please select budget range"
    }),
    phone: z.string({
        // required_error: "Please select a lead source"
    }),
    region: z.string({

    }),
    function: z.string({

    }),
    reportingTo: z.string({

    }),
    profile: z.string({

    }),
    // timeZone: z.string({

    // })
})

// const allTimezones = getAllTimezones()

function AddUserDialogBox({ children, parentData = undefined }: { children?: any | undefined, parentData?: { childData: IChildData, setChildDataHandler: CallableFunction, open: boolean } | undefined }) {
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            std_code: "+91",
            phone: "",
            region: undefined,
            function: undefined,
            reportingTo: undefined,
            profile: undefined,
            // timeZone: getClientTimezone()
        }
    })



    const [formSchema, setFormSchema] = useState(FormSchema)

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
        parentData?.setChildDataHandler('row', undefined)
    }

    function addContact() {

    }

    useEffect(() => {
        if (parentData?.open) {
            setOpen(parentData?.open)
            const { childData: { row }, setChildDataHandler } = parentData
            const data: UsersGetResponse = row.original
            form.setValue("firstName", data.first_name)
            form.setValue("lastName", data.last_name)
            form.setValue("email", data.email)
            form.setValue("phone", data.mobile)
            // form.setValue("std_code", data.)
            // form.setValue("reportingTo", data.reporting_to)
            // form.setValue("region", data.region)
            // form.setValue("profile", data.profile)
            form.setValue("function", labelToValue(data.function, ALL_FUNCTIONS) || "")
        } else {
            setOpen(false)
        }
    }, [parentData])

    function updateContact(): void {
        throw new Error('Function not implemented.')
    }

    const watcher = form.watch()
    useEffect(() => {
        // console.log(form.getValues())
        // console.log(allTimezones.find((val) => console.log(val.value, form.getValues("timeZone")))?.label)

    }, [watcher])

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
                                    <Button variant={"default"} className='flex flex-row gap-2 text-md font-medium bg-error-500 text-white-900 hover:bg-error-600'>
                                        <IconUserDeactive size={20} color={ "white"}/>
                                        Deactivate User
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
                                                                                            console.log("std_code", cc.value)
                                                                                            changeStdCode(cc.value)
                                                                                            form.setValue("std_code", cc.value)
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
                                                                        {REPORTING_MANAGERS.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Reporting To</span>}
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
                                                                        {REPORTING_MANAGERS.map((reportingManager) => (
                                                                            <CommandItem
                                                                                value={reportingManager.value}
                                                                                key={reportingManager.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("reportingTo", reportingManager.value)
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
                                                                PROFILE.map((region, index) => {
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
                                                    <Button type='button' disabled={!form.formState.isValid} onClick={() => updateContact()}>
                                                        Update
                                                    </Button>
                                                </div> :
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