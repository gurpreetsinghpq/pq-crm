import { commonClasses, commonFontClassesAddDialog, commonNumericIconClasses } from '@/app/constants/classes'
import { ACTIVITY_STATUS, ACTIVITY_TYPE, COLLATERAL_SHARED, DEAL_STATUS, ENTITY_TYPE, EXPECTED_SERVICE_FEE_RANGE, MODE, NEGOTIATION_BLOCKER, NEXT_STEP, OPEN_TO_ENGAGE, OPEN_TO_MIN_SERVICE_OR_FLAT_FEE, OPEN_TO_RETAINER_MODEL, PROPOSAL_SHARED, PROSPECT_STATUS_NOTES, REMINDER, RESPONSE_RECEIVED, ROLE_CLARITY, ROLE_STATUS, ROLE_URGENCY, SERVICE_CONTRACT_DRAFT_SHARED, SET_VALUE_CONFIG, TIME_OPTIONS, WILLING_TO_PAY } from '@/app/constants/constants'
import { IconActivityType, IconCalendar, IconClock, IconContacts, IconDueDateAndTime, IconMode, IconNextStep, IconReminder } from '@/components/icons/svgIcons'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverClose } from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { Check, ChevronDown } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'



const FormSchema = z.object({
    activityType: z.string({
        // required_error: "Please enter a name.",
    }),
    contact: z.string({
        // required_error: "Please select a region"
    }),
    mode: z.string({
    }),
    status: z.string({
    }),
    assignedTo: z.string({
    }),
    dueDate: z.date({
    }),
    dueTime: z.string({
    }),
    reminder: z.string({
    }),
    entityType: z.string({
    }),
    entityName: z.string({
    }),

})



function Activity({ contactFromParents }: { contactFromParents: any }) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {

        }
    })

    const watcher = form.watch()

    useEffect(() => {
        const subscription = form.watch(() => {

        })
        return () => subscription.unsubscribe()
    }, [form.watch])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }
    console.log(form.getValues())
    const CONTACTS_FROM_PARENT: any = contactFromParents

    console.log("contactFromParents", contactFromParents)

    return (
        <Form {...form}>
            <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col rounded-[8px] bg-white-900 border-[1px] border-gray-200'>
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
                                            name="activityType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Select Activity" />
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
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Select Contact" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                CONTACTS_FROM_PARENT.map((contact: any, index: any) => {
                                                                    return <SelectItem key={index} value={contact.id.toString()}>
                                                                        {contact.name}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconMode size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Mode</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="mode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
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
                                        <IconMode size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Status</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Select Status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                ACTIVITY_STATUS.map((status, index) => {
                                                                    return <SelectItem key={index} value={status.value}>
                                                                        {status.label}
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
                                                                        disabled={(date) =>
                                                                            date > new Date() || date < new Date("1900-01-01")
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
                                                                            <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
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
                                                                                {TIME_OPTIONS.map((timeOption) => (
                                                                                    <CommandItem
                                                                                        value={timeOption.value}
                                                                                        key={timeOption.value}
                                                                                        onSelect={() => {
                                                                                            form.setValue("dueTime", timeOption.value, SET_VALUE_CONFIG)
                                                                                        }}
                                                                                    >
                                                                                        <div className="flex flex-row items-center justify-between w-full">
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
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Select Reminder" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                REMINDER.map((reminder, index) => {
                                                                    return <SelectItem key={index} value={reminder.value}>
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
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
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
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="bg-gray-200 h-[1px]  mt-8" />
                    <div className="flex flex-row gap-2 justify-end p-[16px]">
                        {/* <Button variant={"google"} >Cancel</Button> */}
                        <Button >Save </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default Activity