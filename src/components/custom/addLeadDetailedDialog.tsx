"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { ArrowDown, ArrowDown01, ArrowDown01Icon, ArrowUpRight, Check, ChevronDownIcon, ChevronsDown, Contact, Ghost, MoveDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRY_CODE as countryCode, TYPE as type, DESIGNATION as designation, LEAD_SOURCE as leadSource, BUDGET_RANGE as budgetRange, REGION as region, ROLETYPE as roleType, REGION, CREATORS, OWNERS } from '@/app/constants/constants'
import { DialogClose } from '@radix-ui/react-dialog'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { toast } from '../ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { IconAccounts, IconContacts, IconCross, IconRoles, IconTick } from '../icons/svgIcons'
import { IValueLabel } from '@/app/interfaces/interface'
import { setData } from '@/app/dummy/dummydata'


const commonClasses = "focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"


const FormSchema = z.object({
    organisationName: z.string({
        required_error: "Please enter a name.",
    }).min(2),
    region: z.string({
        required_error: "Please select a region"
    }),
    roleType: z.string({
        required_error: "Please select role type"
    }),
    budget: z.string({
        required_error: "Please select budget range"
    }),
    leadSource: z.string({
        required_error: "Please select a lead source"
    }),
})

const FormSchema2 = z.object({
    contactName: z.string({
        required_error: "Please enter a name.",
    }).min(2).max(30),
    designation: z.string({
        required_error: "Please select designation.",
    }),
    contactType: z.optional(z.string()),
    email: z.string({
        required_error: "Please select email"

    }).email(),
    phoneNo: z.string({
        required_error: "Please select Phone No."
    }).min(6).max(13),
    countryCode: z.string({
        required_error: "Please select designation.",
    }),
})



function AddLeadDetailedDialog({ inputAccount, dataFromChild }: { inputAccount: string, dataFromChild: CallableFunction }) {

    const [dummyContactData, setDummyContactData] = useState<any[]>([])
    const [showContactForm, setShowContactForm] = useState<any>(true)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            organisationName: inputAccount,
            // budget: "uptoInr1cr",
            // leadSource: "linkedin"
        }
    })

    const form2 = useForm<z.infer<typeof FormSchema2>>({
        resolver: zodResolver(FormSchema2),
        defaultValues: {
            // organisationName: "",
            // budget: "uptoInr1cr",
            // leadSource: "linkedin"
            contactName: "",
            email: "",
            phoneNo: "",
            countryCode: "+91"
        },

    })

    const watcher = form2.watch()

    useEffect(() => {
        console.log(form2.formState.isValid)

    }, [watcher])


    function addContact() {
        console.log(form2.getValues())
        const finalData = form2.getValues()
        const ftype = type.find((role) => role.value === finalData.contactType)?.label
        console.log(finalData.contactType)
        const fDesignation = designation.find((des) => des.value === finalData.designation)?.label
        setDummyContactData((prevValues: any) => {
            return [...prevValues, { ...form2.getValues(), contactType: ftype, designation: fDesignation }]
        })
        setShowContactForm(false)
        form2.reset()
    }
    function discardContact() {
        setShowContactForm(false)
        form2.reset()
    }

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

    function onSubmit2(data: z.infer<typeof FormSchema2>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    function addToLead(): void {
        const formData = form.getValues()
        const regionLabel = specificValueFinder(formData.region, region)?.label
        const budgetLabel = specificValueFinder(formData.budget, budgetRange)?.label
        const leadSourceLabel = specificValueFinder(formData.leadSource, leadSource)?.label
        const roleTypeLabel = specificValueFinder(formData.roleType, roleType)?.label
        const createdOn = new Date()
        const createdBy = CREATORS[(Math.floor(Math.random()*(CREATORS.length-1)))>0?(Math.floor(Math.random()*(CREATORS.length-1))):1].label
        const owner = OWNERS[(Math.floor(Math.random()*(OWNERS.length-1)))>0?(Math.floor(Math.random()*(OWNERS.length-1))):1].label
        console.log(regionLabel,budgetLabel,leadSourceLabel,roleTypeLabel,createdOn,createdBy,owner)
        form.reset()
        form2.reset()
        setData({
            budgetRange: budgetLabel,
            id: Math.floor(Math.random()*10000).toString(),
            owner: owner,
            region: regionLabel,
            createdBy: createdBy,
            createdOn: createdOn.toLocaleDateString(),
            source: leadSourceLabel,
            status: "Unverified",
            title: `${formData.organisationName} - ${regionLabel} - ${roleTypeLabel}`,
            role: roleTypeLabel
        })
        dataFromChild()
    }

    function specificValueFinder(lookupValue: string,  array:any[] ):IValueLabel{
        return array.find((item)=>item.value===lookupValue)
    }

    return (
        <div>
            {/* <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 ">
                    <DialogHeader >
                        <DialogTitle className="px-[24px] pt-[30px] pb-[10px]">
                            <span className="text-lg">Add Lead</span>
                        </DialogTitle>
                    </DialogHeader>
                    <Separator className="bg-gray-200 h-[1px] w-full " /> */}
            <div className='flex flex-row gap-6 px-[24px] py[24px] w-[800px]'>
                <Form {...form}>
                    <form className='left f7lex flex-col w-1/2' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                <IconAccounts size="20" />
                            </div>
                            <span className="text-xs text-gray-700">ACCOUNT</span>
                            <div className="bg-gray-200 h-[1px] w-full" ></div>
                        </div>
                        <FormField
                            control={form.control}
                            name="organisationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="text" className={`mt-3 ${commonClasses}`} placeholder="Enter organisation name" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='mt-3 text-sm text-blue-600 flex flex-row gap-2 justify-end items-center font-medium cursor-pointer'>
                            <span>
                                2 Existing Leads
                            </span>
                            {/* <ArrowUpRight className='text-blue-600 h-[18px] w-[18px]'/> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 12L12 4M12 4H6.66667M12 4V9.33333" stroke="#1570EF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className="flex flex-row gap-[10px] items-center  mt-4">
                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                <IconRoles size={20} />
                            </div>
                            <span className="text-xs text-gray-700">ROLE</span>
                            <div className="bg-gray-200 h-[1px] w-full" />
                        </div>
                        <div className='flex flex-col mt-3 w-full'>
                            <FormField
                                control={form.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Select a Region" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    region.map((region, index) => {
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-col mt-3 w-full'>
                            <FormField
                                control={form.control}
                                name="roleType"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Select a Role Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    roleType.map((roleType, index) => {
                                                        return <SelectItem key={index} value={roleType.value}>
                                                            {roleType.label}
                                                        </SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-col mt-3 w-full'>
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Select a Budget Range" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    budgetRange.map((budgetRange, index) => {
                                                        return <SelectItem value={budgetRange.value} key={index}>
                                                            {budgetRange.label}
                                                        </SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-row gap-[10px] items-center  mt-4">
                            {/* <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                    <svg width="auto" height="auto" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="briefcase-01">
                                            <path id="Icon" d="M13.3334 5.83333C13.3334 5.05836 13.3334 4.67087 13.2482 4.35295C13.0171 3.49022 12.3432 2.81635 11.4805 2.58519C11.1625 2.5 10.7751 2.5 10.0001 2.5C9.22511 2.5 8.83762 2.5 8.5197 2.58519C7.65697 2.81635 6.9831 3.49022 6.75193 4.35295C6.66675 4.67087 6.66675 5.05836 6.66675 5.83333M4.33342 17.5H15.6667C16.6002 17.5 17.0669 17.5 17.4234 17.3183C17.737 17.1586 17.992 16.9036 18.1518 16.59C18.3334 16.2335 18.3334 15.7668 18.3334 14.8333V8.5C18.3334 7.56658 18.3334 7.09987 18.1518 6.74335C17.992 6.42975 17.737 6.17478 17.4234 6.01499C17.0669 5.83333 16.6002 5.83333 15.6667 5.83333H4.33341C3.39999 5.83333 2.93328 5.83333 2.57676 6.01499C2.26316 6.17478 2.00819 6.42975 1.8484 6.74335C1.66675 7.09987 1.66675 7.56658 1.66675 8.5V14.8333C1.66675 15.7668 1.66675 16.2335 1.8484 16.59C2.00819 16.9036 2.26316 17.1586 2.57676 17.3183C2.93328 17.5 3.39999 17.5 4.33342 17.5Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </div> */}
                            <span className="text-xs text-gray-700">DETAILS</span>
                            <div className="bg-gray-200 h-[1px] w-full" ></div>
                        </div>
                        <div className='flex flex-col mt-3 w-full'>
                            <FormField
                                control={form.control}
                                name="leadSource"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Select a Lead Source" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    leadSource.map((leadSource, index) => {
                                                        return <SelectItem key={index} value={leadSource.value}>
                                                            {leadSource.label}
                                                        </SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
                <div className="w-[1px] bg-gray-200 "></div>
                <Form {...form2}>
                    <form className='ri ght flex flex-col w-1/2' onSubmit={form2.handleSubmit(onSubmit2)}>

                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                <IconContacts size="20" />
                            </div>
                            <span className="text-xs text-gray-700">CONTACT</span>
                            <div className="bg-gray-200 h-[1px] flex-1" ></div>
                            <div className={`text-sm text-purple-700  ${!showContactForm ? 'opacity-[1] cursor-pointer' : 'opacity-[0.3] cursor-not-allowed'}`} onClick={() => !showContactForm && setShowContactForm(true)}>+ Add</div>
                        </div>
                        {dummyContactData.length > 0 && <div className='flex flex-col w-full mt-4 h-[150px] overflow-y-scroll pr-[16px] scroll-style-one'>
                            <div className='flex flex-col w-full'>
                                {
                                    dummyContactData.reverse().map((item: any, index: number) => (
                                        <div className='flex flex-col ' key={index} >
                                            <div className='flex flex-col'>
                                                <div className='flex flex-row justify-between w-full'>
                                                    <span className='text-sm font-semibold '>
                                                        {item.contactName} - {item.designation}
                                                    </span>
                                                    { item?.contactType && item?.contactType?.trim()!=="" && <div>
                                                        <span className='text-xs text-purple-700 px-[6px] py-[2px] border border-[1px] bg-purple-50 border-purple-200 rounded-[6px]'>{item.contactType}</span>
                                                    </div>}
                                                </div>
                                                <div className='text-xs text-gray-600'>
                                                    {item.email}
                                                </div>
                                                <div className='text-xs text-gray-600'>
                                                    {item.countryCode} {item.phoneNo}
                                                </div>
                                            </div>

                                            <Separator className='mt-[12px] mb-[8px]' />
                                        </div>
                                    ))
                                }


                            </div>
                        </div>}
                        {dummyContactData?.length > 0 && <div className="bg-gray-200 h-[1px]" ></div>}
                        {showContactForm && <div className='flex flex-col'>
                            <FormField
                                control={form2.control}
                                name="contactName"
                                render={({ field }) => (
                                    <Input type="text" className={`mt-3 ${commonClasses}`} placeholder="Enter contact name" {...field} />
                                )}
                            />
                            <div className='flex flex-row gap-4 mt-3'>
                                <div className='flex flex-col  w-full'>
                                    <FormField
                                        control={form2.control}
                                        name="designation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={commonClasses}>
                                                            <SelectValue placeholder="Designation" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            designation.map((designation, index) => {
                                                                return <SelectItem value={designation.value} key={index}>
                                                                    {designation.label}
                                                                </SelectItem>
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='flex flex-col w-full'>
                                    <FormField
                                        control={form2.control}
                                        name="contactType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={commonClasses}>
                                                            <SelectValue placeholder="Type (Optional)" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            type.map((type, index) => {
                                                                return <SelectItem value={type.value} key={index}>
                                                                    {type.label}
                                                                </SelectItem>
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormField
                                control={form2.control}
                                name="email"
                                render={({ field }) => (
                                    <Input type="email" className={`mt-3 ${commonClasses}`} placeholder="Email" {...field} />
                                )}
                            />
                            <div className='flex flex-row gap-2 items-center'>
                                <FormField
                                    control={form2.control}
                                    name="countryCode"
                                    render={({ field }) => (
                                        <FormItem className='mt-3 w-1/3'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={commonClasses}>
                                                        <SelectValue placeholder="Country Code" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        countryCode.map((countryCode, index) => {
                                                            return <SelectItem value={countryCode.value} key={index}>
                                                                {countryCode.label}
                                                            </SelectItem>
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                            {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form2.control}
                                    name="phoneNo"
                                    render={({ field }) => (
                                        <Input type="text" className={`mt-3 w-2/3 ${commonClasses}`} placeholder="Phone No" {...field} />
                                    )}
                                />
                            </div>
                            <div className='flex flex-row justify-end mt-2 items-center gap-2 '>
                                <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground  px-3 py-2 rounded-[6px] ${form2.formState.isValid ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`} onClick={() => form2.formState.isValid && discardContact()}>
                                    <IconCross size={20} />
                                    <span className='text-gray-600 text-xs font-semibold' >Discard</span>
                                </div>
                                <Button type='submit' variant="ghost" onClick={() => form2.formState.isValid && addContact()} className={`flex flex-row gap-2 ${form2.formState.isValid ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`}>
                                    <IconTick size={20} />
                                    <span className='text-gray-600 text-xs font-semibold' >Add</span>
                                </Button>
                            </div>
                        </div>}

                    </form>
                </Form>


            </div>
            <Separator className='mt-10' />
            <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                <DialogClose asChild>
                    <Button variant={"google"} >Cancel</Button>
                </DialogClose>
                <Button disabled={!(form.formState.isValid && dummyContactData.length>0)} onClick={() => addToLead()}>Save & Add</Button>
            </div>

        </div>
    )
}

export default AddLeadDetailedDialog