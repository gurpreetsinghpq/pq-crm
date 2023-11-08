import { commonClasses, commonFontClassesAddDialog, commonNumericIconClasses } from '@/app/constants/classes'
import { ACTIVITY_STATUS, ACTIVITY_TYPE, COLLATERAL_SHARED, DEAL_STATUS, ENTITY_TYPE, EXPECTED_SERVICE_FEE_RANGE, MODE, NEGOTIATION_BLOCKER, NEXT_STEP, OPEN_TO_ENGAGE, OPEN_TO_MIN_SERVICE_OR_FLAT_FEE, OPEN_TO_RETAINER_MODEL, PROPOSAL_SHARED, PROSPECT_STATUS_NOTES, REMINDER, RESPONSE_RECEIVED, ROLE_CLARITY, ROLE_STATUS, ROLE_URGENCY, SERVICE_CONTRACT_DRAFT_SHARED, SET_VALUE_CONFIG, TIME_OPTIONS, WILLING_TO_PAY } from '@/app/constants/constants'
import { IconActivityType, IconAssignedTo, IconCalendar, IconClock, IconContacts, IconDueDateAndTime, IconMode, IconMode2, IconNextStep, IconReminder } from '@/components/icons/svgIcons'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverClose } from '@radix-ui/react-popover'
import { format, min } from 'date-fns'
import { Check, ChevronDown } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getContacts } from '../custom-stepper'
import { ActivityPatchBody, ActivityPostBody, IValueLabel, Permission } from '@/app/interfaces/interface'
import { TIMEZONE, calculateMinuteDifference, compareTimeStrings, fetchTimeZone, fetchUserDataList, getCurrentDateTime, getTimeOffsetFromUTC, getToken, replaceTimeZone } from '../../commonFunctions'
import { toast } from '@/components/ui/use-toast'
import { labelToValue, valueToLabel } from '../../sideSheet'
import { beforeCancelDialog } from '../../addLeadDetailedDialog'



const FormSchema = z.object({
    type: z.string({
        // required_error: "Please enter a name.",
    }),
    contact: z.array(z.number()),
    mode: z.string({
    }),
    // status: z.string({
    // }),
    assignedTo: z.string({
    }),
    dueDate: z.date({
    }),
    dueTime: z.string({
    }),
    reminder: z.string({
    }),
    // entityType: z.string({
    // }),
    // entityName: z.string({
    // }),

})



function Activity({ contactFromParents, entityId, editMode = { isEditMode: false, data: null, yesDiscard: null } }: { contactFromParents: any, entityId: number, editMode?: { isEditMode: boolean, data: any, yesDiscard: CallableFunction | null, rescheduleActivity?: (entityId: number, data: ActivityPatchBody) => Promise<void>, setOpen?: CallableFunction } }) {
    const [userList, setUserList] = React.useState<IValueLabel[]>()
    const [isUserDataLoading, setIsUserDataLoading] = React.useState<boolean>(true)
    const [currentTime, setCurrentTime] = React.useState<string>()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            type: undefined,
            mode: undefined,
            reminder: undefined

        }
    })
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()

    const watcher = form.watch()

    useEffect(() => {
        const subscription = form.watch(() => {
            console.log("form.formState.errors", form.formState.errors)
            console.log("form.formState.isValid", form.formState.isValid)
        })
        return () => subscription.unsubscribe()
    }, [form.watch])

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
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const formattedDueDate = formattedDueDateToSend()

        const dataToSend: ActivityPostBody = {
            contact: data.contact,
            due_date: formattedDueDate,
            lead: entityId,
            mode: valueToLabel(data.mode, MODE) || "",
            reminder: Number(data.reminder) === -1 ? null : Number(data.reminder),
            type: valueToLabel(data.type, ACTIVITY_TYPE) || "",
            assigned_to: Number(form.getValues("assignedTo"))
        }


        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/activity/`, { method: "POST", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            toast({
                title: "Activity Created Succesfully!",
                variant: "dark"
            })
            console.log(result)
            form.reset()

        } catch (err) {
            console.log(err)
        }

    }

    function formattedDueDateToSend(iso: boolean = false) {
        const dueDate = form.getValues("dueDate")
        const dueTime = form.getValues("dueTime")
        const [hours, minutes] = dueTime.split(":").map(Number)
        dueDate.setHours(hours)
        dueDate.setMinutes(minutes)
        dueDate.setSeconds(0)
        dueDate.setMilliseconds(0)
        const timezoneOffSet = getTimeOffsetFromUTC(TIMEZONE)
        const dueDateFinal = replaceTimeZone(dueDate.toString(), timezoneOffSet)

        const utcDate = new Date(dueDateFinal).toISOString()
        const formattedDueDate = utcDate.replace('T', ' ').replace('Z', '')
        if (iso) {
            return utcDate
        } else {
            return formattedDueDate
        }
    }

    async function getTimeZone() {
        const formatter = new Intl.DateTimeFormat([], {
            timeZone: TIMEZONE,
            hour: "numeric",
            minute: "numeric",
            hour12: false, // Use 24-hour format

        });
        const currentTime = formatter.format(new Date())
        setCurrentTime(currentTime)
        console.log("timezone", currentTime);

    }

    useEffect(() => {
        getUserList()
        // console.log("timezone", getCurrentDateTime())
        getTimeZone()

        if (editMode.isEditMode) {
            form.setValue("assignedTo", editMode?.data?.assigned_to?.id?.toString())
            form.setValue("type", labelToValue(editMode?.data?.type, ACTIVITY_TYPE) || "")
            form.setValue("mode", labelToValue(editMode?.data?.mode, MODE) || "")
            form.setValue("contact", editMode?.data?.contact)
            console.log("REMINDER", editMode?.data?.reminder?.toString(), editMode.data.id)
            form.setValue("reminder", editMode?.data?.reminder?.toString())
            const dueDateFromEdit: string = editMode?.data?.due_date
            if (dueDateFromEdit) {
                const dateObject = new Date(dueDateFromEdit);
                const formatter = new Intl.DateTimeFormat([], {
                    timeZone: TIMEZONE,
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false, // Use 24-hour format

                });
                const dueTime = formatter.format(dateObject)
                const dueDate = new Date(new Date(dueDateFromEdit).toLocaleString("en-us", { timeZone: TIMEZONE }))
                // dueDate.setHours(0,0,0,0)
                console.log("dueDateFromEdit", dueDateFromEdit, dueDate, TIMEZONE)

                form.setValue("dueTime", dueTime)
                form.setValue("dueDate", dueDate)


            }

        }

    }, [])
    console.log(form.getValues())
    const CONTACTS_FROM_PARENT: any = contactFromParents

    console.log("contactFromParents", contactFromParents)

    function reschedule() {
        const formattedDueDate = formattedDueDateToSend()
        const reminder = Number(form.getValues("reminder"))
        if (editMode.rescheduleActivity) {
            editMode.rescheduleActivity(editMode.data.id, {
                due_date: formattedDueDate,
                reminder: reminder
            })
            editMode.setOpen && editMode.setOpen(false)
        }


    }

    return (
        <Form {...form}>
            <form className='w-full' onSubmit={form.handleSubmit(onSubmit)} >
                <div className={`flex flex-col rounded-[8px] bg-white-900 ${!editMode.isEditMode && "border-[1px] border-gray-200"}`}>
                    <div className='px-[28px] py-[24px] w-full '>
                        <div className=' flex flex-col gap-[28px]'>
                            <div className='max-w-[800px] flex flex-col gap-[16px]'>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconActivityType />
                                        <div className='text-md text-gray-500 font-normal'>Activity Type</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select disabled={editMode.isEditMode} onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value} key={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses} ${editMode.isEditMode && "bg-gray-100"}`}>
                                                                <SelectValue placeholder="Select Activity Type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                ACTIVITY_TYPE.map((region, index) => {
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
                                    </div>
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconContacts size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Contact</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="contact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className={`flex flex-row gap-2 w-full justify-between px-[12px] ${commonFontClassesAddDialog} ${editMode.isEditMode && "bg-gray-100 pointer-events-none cursor-not-allowed"}`}>
                                                                    {
                                                                        field?.value?.length > 0 ? (
                                                                            getContacts(field.value.map(contactId => {
                                                                                const contact = CONTACTS_FROM_PARENT.find((contact: any) => contact.id === contactId);
                                                                                return contact ? contact.name : null;
                                                                            }))
                                                                        ) : (
                                                                            <span className='text-muted-foreground'>Select Account Contact</span>
                                                                        )
                                                                    }
                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[430px] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Search Account Contact" />
                                                                <CommandEmpty>No Contact found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {CONTACTS_FROM_PARENT.map((contact: any, index: any) => (
                                                                            <CommandItem
                                                                                value={contact.id}
                                                                                key={contact.id}
                                                                                onSelect={() => {
                                                                                    console.log(field.value)
                                                                                    if (field?.value?.length > 0) {
                                                                                        if (field?.value?.includes(contact.id)) {
                                                                                            form.setValue("contact", [...field.value.filter((value: number) => value !== contact.id)])
                                                                                        } else {
                                                                                            form.setValue("contact", [...field.value, contact.id])
                                                                                        }
                                                                                    } else {
                                                                                        form.setValue("contact", [contact.id])
                                                                                    }

                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {contact.name}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value?.includes(contact.id)
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
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconMode2 size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Mode</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="mode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select disabled={editMode.isEditMode} onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value} key={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses} ${editMode.isEditMode && "bg-gray-100"}`}>
                                                                <SelectValue placeholder="Select Mode" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                MODE.map((mode, index) => {
                                                                    return <SelectItem key={index} value={mode.value}>
                                                                        {mode.label}
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
                                    </div>
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconAssignedTo size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Assigned To</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="assignedTo"
                                            render={({ field }) => (
                                                <FormItem className='w-full '>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className={`flex flex-row gap-2 w-full px-[14px] ${editMode.isEditMode && "bg-gray-100 pointer-events-none cursor-not-allowed"}`}>
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {userList && userList?.length > 0 && userList?.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Choose</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[350px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search User" />
                                                                <CommandEmpty>User not found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {userList && userList?.length > 0 && userList.map((reportingManager) => (
                                                                            <CommandItem
                                                                                value={reportingManager.label}
                                                                                key={reportingManager.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("assignedTo", reportingManager.value, SET_VALUE_CONFIG)
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
                                    </div>
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconDueDateAndTime size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Due Date & Time</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <div className='flex flex-row gap-[16px] '>
                                            <div className='w-[70%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="dueDate"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <FormControl>
                                                                            <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                                <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                                    {field.value ? (
                                                                                        format(field.value, "PPP")
                                                                                    ) : (
                                                                                        <span className='text-muted-foreground'>Pick a date</span>
                                                                                    )}
                                                                                </div>
                                                                                <IconCalendar size="24" color="#98A2B3" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="2xl:w-[313px] p-0 flex flex-row justify-center" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) => {
                                                                            const today = getDateAccToTimezone()
                                                                            const tempToday = structuredClone(today)
                                                                            tempToday.setHours(0, 0, 0, 0);
                                                                            return date < tempToday || ((date.toDateString() === today.toDateString()) && (today.getHours() >= 23 && today.getMinutes() >= 45))
                                                                        }
                                                                        }

                                                                        initialFocus
                                                                    />

                                                                </PopoverContent>
                                                            </Popover>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className='w-[30%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="dueTime"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <FormControl>
                                                                            <Button disabled={(() => {
                                                                                const today = getDateAccToTimezone()
                                                                                today.setHours(0, 0, 0, 0);
                                                                                const dueDate = form.getValues("dueDate")
                                                                                const disable = dueDate == undefined || form.getValues("dueDate") < today
                                                                                return disable
                                                                            })()} variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                                <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                                    {field.value ? (
                                                                                        field.value
                                                                                    ) : (
                                                                                        <span className='text-muted-foreground'>HH:MM</span>
                                                                                    )}
                                                                                </div>
                                                                                <IconClock size="24" color="#98A2B3" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[200px] p-0 ml-[32px]">
                                                                    <Command>
                                                                        <CommandInput className='w-full' placeholder="Search Due Time" />
                                                                        <CommandEmpty>Due Time not found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                                {TIME_OPTIONS.filter((timeOption) => {
                                                                                    const today = getDateAccToTimezone()
                                                                                    const shouldDisable = currentTime ? compareTimeStrings(timeOption.value, currentTime, form.getValues("dueDate"), today) : false
                                                                                    return !shouldDisable
                                                                                }).map((timeOption) => {
                                                                                    return (<CommandItem
                                                                                        value={timeOption.label}
                                                                                        key={timeOption.value}
                                                                                        onSelect={() => {
                                                                                            form.setValue("dueTime", timeOption.value, SET_VALUE_CONFIG)
                                                                                        }}
                                                                                    >
                                                                                        <div className={`flex flex-row items-center justify-between w-full `}>
                                                                                            {timeOption.label}
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                                    field.value === timeOption.value
                                                                                                        ? "opacity-100"
                                                                                                        : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                        </div>
                                                                                    </CommandItem>)
                                                                                })}
                                                                            </div>
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
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconReminder size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Reminder</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="reminder"
                                            render={({ field }) => 
                                                {
                                                    return <FormItem>
                                                    <Select
                                                        disabled={(() => {
                                                            const dueDate = form.getValues("dueDate")
                                                            const dueTime = form.getValues("dueTime")
                                                            return !dueTime
                                                        })()}
                                                        onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value} key={field.value} >
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Select Reminder" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                REMINDER.map((reminder, index) => {
                                                                    let shouldDisable = disableReminderOnInvalidDateAndTime(reminder.value)
                                                                    return <SelectItem disabled={shouldDisable} key={index} value={reminder.value}>
                                                                        {reminder.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                    {/* <FormMessage /> */}
                                                </FormItem>}
                                            }
                                        />
                                    </div>
                                </div>
                                {/* <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconReminder size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Related To</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <div className='flex flex-row gap-[16px] items-center w-full'>
                                            <FormField
                                                control={form.control}
                                                name="entityType"
                                                render={({ field }) => (
                                                    <FormItem className='w-1/2'>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Entity Type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    ENTITY_TYPE.map((entityType, index) => {
                                                                        return <SelectItem key={index} value={entityType.value}>
                                                                            {entityType.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="entityName"
                                                render={({ field }) => (
                                                    <FormItem className='w-1/2'>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button variant={"google"} className={`flex flex-row gap-2 w-full justify-between ${commonFontClassesAddDialog}`}>
                                                                        {ENTITY_TYPE.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Entity Name</span>}
                                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="xl:w-[183px] 2xl:w-[224px] p-0 ">
                                                                <Command>
                                                                    <CommandInput className='w-full' placeholder="Search Entity Name" />
                                                                    <CommandEmpty>Entity Name not found.</CommandEmpty>
                                                                    <CommandGroup className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        <div >
                                                                            {ENTITY_TYPE.map((entityType) => (
                                                                                <CommandItem
                                                                                    value={entityType.label}
                                                                                    key={entityType.label}
                                                                                    onSelect={() => {
                                                                                        form.setValue("entityType", entityType.value, SET_VALUE_CONFIG)
                                                                                    }}
                                                                                >
                                                                                    <PopoverClose asChild>
                                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                                            {entityType.label}
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                                    field.value === (entityType.value)
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
                                    </div>
                                </div> */}
                            </div>

                        </div>
                    </div>
                    <div className="bg-gray-200 h-[1px]  mt-8" />
                    {editMode.isEditMode ?
                        <div className='flex flex-row gap-2 w-full justify-end p-[24px]'>
                            {editMode.yesDiscard && beforeCancelDialog(editMode.yesDiscard)}
                            {editMode?.rescheduleActivity && <Button onClick={() => reschedule()} type='button'
                                disabled={(() => {
                                    // return false
                                    const { disableDueDate, dueDate, today } = disableDueToInvalidDate()
                                    const reminder = form.getValues("reminder")
                                    let shouldDisableDueToReminder = disableReminderOnInvalidDateAndTime(reminder)
                                    const disable = !form.formState.isDirty || disableDueDate || shouldDisableDueToReminder
                                    console.log("disable due date", dueDate < today, "due date: ", dueDate, " today: ", today)
                                    return disable

                                })()} >
                                Update
                            </Button>}
                        </div> :
                        <>
                            <div className="flex flex-row gap-2 justify-end p-[16px]">
                                <Button type='submit' disabled={!form.formState.isValid}>Save </Button>
                            </div>
                        </>}
                </div>
            </form>
        </Form>
    )

    function disableReminderOnInvalidDateAndTime(reminder: string) {
        let shouldDisable = false
        const dueDate = form.getValues("dueDate")
        const dueTime = form.getValues("dueTime")
        const currentDate = getDateAccToTimezone()
        if (Number(reminder) != -1 && dueDate && dueTime && dueDate.getDate() === currentDate.getDate()) {
            const [dueHour, dueMinute] = dueTime.split(":")
            const currentHour = currentDate.getHours()
            const currentMinute = currentDate.getMinutes()
            const minuteDiff = calculateMinuteDifference(currentHour, Number(dueHour), currentMinute, Number(dueMinute))
            console.log("time difference", currentDate.getHours(), dueHour, currentDate.getMinutes(), dueMinute)
            console.log("time difference minutes", minuteDiff)
            shouldDisable = !(Number(reminder) < minuteDiff)
        } else {
            shouldDisable = false
        }
        return shouldDisable
    }

    function disableDueToInvalidDate() {
        const today = structuredClone(getDateAccToTimezone())
        const dueDate = structuredClone(form.getValues("dueDate"))
        const dueTime = structuredClone(form.getValues("dueTime"))
        if (dueDate && dueTime) {
            const [hours, minutes] = dueTime.split(":").map(Number)
            console.log("duedate pre", dueDate)
            dueDate.setHours(hours)
            dueDate.setMinutes(minutes)
            dueDate.setSeconds(0)
            dueDate.setMilliseconds(0)
        }

        const disableDueDate = !form.getValues("dueDate") || (dueDate < today)
        return { disableDueDate, dueDate, today }
    }

    function getDateAccToTimezone(date: string = "") {
        if (date) {
            return new Date(new Date(date).toLocaleString("en-us", { timeZone: TIMEZONE }))
        } else {
            return new Date(new Date().toLocaleString("en-us", { timeZone: TIMEZONE }))
        }
    }
}

export default Activity