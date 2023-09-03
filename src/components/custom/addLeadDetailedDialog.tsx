"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { ArrowDown, ArrowDown01, ArrowDown01Icon, ArrowUpRight, Check, ChevronDownIcon, ChevronsDown, Contact, Ghost, MoveDown, PencilIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRY_CODE as countryCode, TYPE as type, DESIGNATION as designation, LEAD_SOURCE as leadSource, BUDGET_RANGE as budgetRange, REGION as region, ROLETYPE as roleType, REGION, CREATORS, OWNERS, TYPE, DESIGNATION, ROLETYPE } from '@/app/constants/constants'
import { DialogClose } from '@radix-ui/react-dialog'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { toast, useToast } from '../ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { IconAccounts, IconContacts, IconCross, IconPencil, IconRoles, IconSave, IconTick } from '../icons/svgIcons'
import { Client, ClientCompleteInterface, ContactDetail, IValueLabel, LeadInterface } from '@/app/interfaces/interface'
// import { setData } from '@/app/dummy/dummydata'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import Image from 'next/image'
import { formatData, getToken } from './leads'


const commonClasses = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"


const FormSchema = z.object({
    organisationName: z.string({
        // required_error: "Please enter a name.",
    }).min(2),
    region: z.string({
        // required_error: "Please select a region"
    }),
    roleType: z.string({
        // required_error: "Please select role type"
    }),
    budget: z.string({
        // required_error: "Please select budget range"
    }),
    leadSource: z.string({
        // required_error: "Please select a lead source"
    }),
})

const FormSchema2 = z.object({
    name: z.string({
        // required_error: "Please enter a name.",
    }).min(2).max(30),
    designation: z.string({
        // required_error: "Please select designation.",
    }),
    type: z.string(),
    email: z.string({
        // required_error: "Please select email"

    }).email(),
    phone: z.string({
        // required_error: "Please select Phone No."
    }).min(10).max(10),
    std_code: z.string({
        // required_error: "Please select designation.",
    }),
    contactId: z.string().optional()
})

const form2Defaults = {
    name: "",
    email: "",
    phone: "",
    std_code: "+91"
}

// function transformContactsToBackendStructure(contacts: any): ContactDetail[] {
//     return contacts.map((contact: any) => ({
//         name: contact.contactName,
//         email: contact.email,
//         std_code: contact.countryCode,
//         phone: contact.phoneNo,
//         designation: contact.designation,
//         type: contact.contactType
//     }));
// }


function AddLeadDetailedDialog({ inputAccount, dataFromChild, details, filteredLeadData }: { inputAccount: string, dataFromChild: CallableFunction, details: ClientCompleteInterface | undefined, filteredLeadData: LeadInterface[] | undefined }) {

    const [dummyContactData, setDummyContactData] = useState<any[]>([])
    const [showContactForm, setShowContactForm] = useState<any>(true)
    const [isFormInUpdateState, setFormInUpdateState] = useState<any>(false)
    const [budgetKey, setBudgetKey] = useState<number>(+new Date())
    const [formSchema2, setFormSchema2] = useState(FormSchema2)
    const { toast } = useToast()


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            "organisationName": ""
        }
    })

    const form2 = useForm<z.infer<typeof formSchema2>>({
        resolver: zodResolver(formSchema2),
        defaultValues: form2Defaults

    })

    

    const watcher1 = form.watch()
    const watcher2 = form2.watch()

    useEffect(() => {
        // console.log(form.getValues())

    }, [watcher1])
    useEffect(() => {
        console.log(form2.getValues())

    }, [watcher2])

    useEffect(() => {
        console.log("details", details)
        if (details?.name) {
            form.setValue("organisationName", details?.name)
        } else {
            form.setValue("organisationName", inputAccount)
        }
        if (details?.contacts && details?.contacts?.length > 0) {
            setDummyContactData(details?.contacts)
            setShowContactForm(false)
        }

    }, [])

    console.log(dummyContactData)


    function addContact() {
        console.log(form2.getValues())
        const finalData = form2.getValues()
        const ftype = type.find((role) => role.value === finalData.type)?.label
        console.log(finalData.type)
        const fDesignation = designation.find((des) => des.value === finalData.designation)?.label
        setDummyContactData((prevValues: any) => {
            const list = [{ ...form2.getValues(), type: ftype, designation: fDesignation, isLocallyAdded: true, contactId: guidGenerator() }, ...prevValues]
            return list
        })
        setShowContactForm(false)
        resetForm2()
    }
    function discardContact() {
        setShowContactForm(false)
        setFormInUpdateState(false)
        resetForm2()
    }

    function resetForm2() {
        form2.reset(form2Defaults)
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

    async function addToLead() {
        const formData = form.getValues()
        const regionLabel = specificValueFinder(formData.region, region)?.label
        const budgetLabel = specificValueFinder(formData.budget, budgetRange[form.getValues("region")])?.label
        const leadSourceLabel = specificValueFinder(formData.leadSource, leadSource)?.label
        const roleTypeLabel = specificValueFinder(formData.roleType, roleType)?.label
        const createdOn = new Date()
        const createdBy = CREATORS[(Math.floor(Math.random() * (CREATORS.length - 1))) != 0 ? (Math.floor(Math.random() * (CREATORS.length - 1))) : 1].label
        const owner = OWNERS[(Math.floor(Math.random() * (OWNERS.length - 1))) != 0 ? (Math.floor(Math.random() * (OWNERS.length - 1))) : 1].label
        console.log(regionLabel, budgetLabel, leadSourceLabel, roleTypeLabel, createdOn, createdBy, owner)
        // setData({
        //     budgetRange: budgetLabel,
        //     id: Math.floor(Math.random() * 10000).toString(),
        //     owner: owner,
        //     region: regionLabel,
        //     createdBy: createdBy,
        //     createdOn: createdOn.toISOString(),
        //     source: leadSourceLabel,
        //     status: "Unverified",
        //     title: `${formData.organisationName} - ${regionLabel} - ${roleTypeLabel}`,
        //     role: roleTypeLabel,
        //     contacts: dummyContactData
        // })

        const regionAcronym = acronymFinder(regionLabel, REGION)
        const roleTypeAcronym = acronymFinder(roleTypeLabel, ROLETYPE)

        let incrementalNumber: number = 1
        filteredLeadData?.forEach((val) => {
            const dataArr = val.title?.split(" ").join("").split("-")
            if (dataArr) {
                const [orgNameL, regL, roleL] = dataArr
                console.log(orgNameL.toLowerCase() === formData.organisationName.toLowerCase() && regionAcronym?.toLowerCase() === regL.toLowerCase() && roleTypeAcronym?.toLowerCase() === roleL.toLowerCase())
                console.log(orgNameL.toLowerCase(), formData.organisationName.toLowerCase(), regionAcronym?.toLowerCase(), regL.toLowerCase(), roleTypeAcronym?.toLowerCase(), roleL.toLowerCase())
                if (orgNameL.toLowerCase() === formData.organisationName.toLowerCase() && regionAcronym?.toLowerCase() === regL.toLowerCase() && roleTypeAcronym?.toLowerCase() === roleL.toLowerCase()) {
                    incrementalNumber++
                }
            }
        })
        const title = `${formData.organisationName} - ${regionAcronym} - ${roleTypeAcronym} - ${incrementalNumber}`
        const finalContactData = dummyContactData.filter((contact) => !contact.id)

        let keysToRemove: any = ["contactId", "isLocallyAdded",]
        finalContactData.forEach((item) => {
            keysToRemove.forEach((key: string) => {
                if (key in item) {
                    delete item[key];
                }
            });
        })

        const dataToSend: Client = {
            title: title,

            organisation: {
                contact_details: finalContactData,
                name: formData.organisationName,

            },
            role_details: {
                budget_range: budgetLabel,
                region: regionLabel,
                role_type: roleTypeLabel
            },
            source: leadSourceLabel
        }
        if (details?.id) {
            dataToSend.organisation.id = details.id
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        const token_superuser = getToken()

        console.log(dataToSend)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/lead/`, { method: "POST", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            console.log(result)
            dataFromChild()
            form.reset()
            resetForm2()

        } catch (err) {
            console.log(err)
        }
    }

    function specificValueFinder(lookupValue: string, array: any[]): IValueLabel {
        return array.find((item) => item.value === lookupValue)
    }

    function activateToUpdateForm(item: any) {
        const finalData = item
        console.log(finalData)
        const ftype = TYPE.find((type) => type.label === finalData.type)?.value
        // console.log(finalData.contactType)
        const fDesignation = DESIGNATION.find((des) => des.label === finalData.designation)?.value

        form2.setValue("name", item.name)
        if (ftype) {
            form2.setValue("type", ftype)
        }
        form2.setValue("std_code", item.std_code)
        if (fDesignation) {
            form2.setValue("designation", fDesignation)
        }
        form2.setValue("email", item.email)
        form2.setValue("phone", item.phone)
        form2.setValue("contactId", item.contactId)
        console.log(form2.getValues())
        setShowContactForm(true)
        setFormInUpdateState(true)
    }

    function addNewForm(): void {
        resetForm2()
        setShowContactForm(true)
    }

    function updateContact(): void {
        const currentContactId = form2.getValues("contactId")
        console.debug(currentContactId, form2.getValues())
        if (currentContactId) {
            const newData = structuredClone(dummyContactData)
            const data = newData.find((value) => value.contactId === currentContactId)
            data.name = form2.getValues("name")
            const roleType = form2.getValues("type")
            if (roleType) {
                data.type = specificValueFinder(roleType, TYPE)?.label
            }
            data.std_code = form2.getValues("std_code")
            data.designation = specificValueFinder(form2.getValues("designation"), DESIGNATION)?.label
            data.email = form2.getValues("email")
            data.phone = form2.getValues("phone")
            setDummyContactData(newData)
        }
        resetForm2()
        setFormInUpdateState(false)
        setShowContactForm(false)

    }

    function yesDiscard(): void {
        form.reset()
        resetForm2()
        dataFromChild()
    }

    function changeStdCode(value: string) {
        let updatedSchema
        console.log(value, value != "+91" )
        if (value != "+91") {
            updatedSchema = FormSchema2.extend({
                phone: z.string().min(4).max(13) 
            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema2
        }
        setFormSchema2(updatedSchema)
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
                                        <Input disabled={details?.name ? true : false} type="text" className={`mt-3 ${commonClasses}`} placeholder="Organisation Name" {...field} />

                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {filteredLeadData && filteredLeadData?.length > 0 && <div className='mt-3 text-sm text-blue-600 flex flex-row gap-2 justify-end items-center font-medium cursor-pointer' onClick={() => window.open(`/dashboard?ids=${details?.name}`)}>
                            <span>
                                {filteredLeadData?.length} Exisiting {filteredLeadData?.length === 1 ? "Lead" : "Leads"}
                            </span>
                            {/* <ArrowUpRight className='text-blue-600 h-[18px] w-[18px]'/> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 12L12 4M12 4H6.66667M12 4V9.33333" stroke="#1570EF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>}

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
                                        <Select onValueChange={(value) => {
                                            form.resetField("budget", { defaultValue: undefined })
                                            setBudgetKey(+ new Date())
                                            return field.onChange(value)
                                        }} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Select Region" />
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
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-col mt-3 w-full '>
                            <FormField
                                control={form.control}
                                name="roleType"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Select Role Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                <div className='max-h-[200px] overflow-y-auto '>
                                                    {
                                                        roleType.map((roleType, index) => {
                                                            return <SelectItem key={index} value={roleType.value}>
                                                                {roleType.label}
                                                            </SelectItem>
                                                        })
                                                    }
                                                </div>
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
                        <div className='flex flex-col mt-3 w-full'>
                            {<FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} key={budgetKey}>
                                            <FormControl>
                                                <SelectTrigger disabled={!form.getValues("region")} className={commonClasses}>
                                                    <SelectValue placeholder="Select Budget Range" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    budgetRange[form.getValues("region")]?.map((budgetRange, index) => {
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
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />}
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
                                                    <SelectValue placeholder="Select Lead Source" />
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
                                        {/* <FormMessage /> */}
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
                <div className="w-[1px] bg-gray-200 "></div>
                <Form {...form2}>
                    <form className='right flex flex-col w-1/2' onSubmit={form2.handleSubmit(onSubmit2)}>
                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                <IconContacts size="20" />
                            </div>
                            <span className="text-xs text-gray-700">CONTACT</span>
                            <div className="bg-gray-200 h-[1px] flex-1" ></div>
                            <div className={`text-sm text-purple-700  ${!showContactForm ? 'opacity-[1] cursor-pointer' : 'opacity-[0.3] cursor-not-allowed'}`} onClick={() => !showContactForm && addNewForm()}>+ Add</div>
                        </div>
                        {dummyContactData.length > 0 && <div className={`flex flex-col w-full mt-4  pr-[16px] max-h-[340px] overflow-y-auto   ${showContactForm && "h-[150px] overflow-y-scroll "} `}>
                            <div className='flex flex-col w-full'>
                                {
                                    dummyContactData.map((item: any, index: number) => (
                                        <div className='relative flex flex-col border-[1px] border-gray-200 rounded-[8px] p-[16px] mb-[12px]' key={index} >
                                            <div className='flex flex-col'>
                                                <div className='flex flex-row justify-between w-full items-baseline '>
                                                    <span className='text-sm font-semibold flex-1'>
                                                        {item.name}
                                                    </span>
                                                    <div className='flex flex-row gap-2 items-center'>
                                                        {item?.type && item?.type?.trim() !== "" && <div>
                                                            <span className={`text-xs mr-[10px] px-[6px] py-[2px] border border-[1px] rounded-[6px] font-medium ${type.find(val => val.label === item.type)?.class}`}>{item.type}</span>
                                                        </div>}

                                                        {
                                                            item.isLocallyAdded && !showContactForm &&  <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger >
                                                                        <div className='absolute right-[5px] top-[10px] h-[16px] cursor-pointer' onClick={() => activateToUpdateForm(item)}>
                                                                            <IconPencil />
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side='right' >
                                                                        Edit
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>}
                                                    </div>
                                                </div>
                                                <div className='text-xs font-medium text-purple-700 flex-1'>
                                                    {item.designation}
                                                </div>
                                                <div className='text-xs text-gray-600 font-normal'>
                                                    {item.email}
                                                </div>
                                                <div className='text-xs text-gray-600 font-normal'>
                                                    {item.std_code} {item.phone}
                                                </div>
                                            </div>

                                        </div>
                                    ))
                                }


                            </div>
                        </div>}
                        {dummyContactData?.length > 0 && showContactForm && <div className="bg-gray-200 h-[1px]" ></div>}
                        {showContactForm && <div className='flex flex-col'>
                            <FormField
                                control={form2.control}
                                name="name"
                                render={({ field }) => (
                                    <Input type="text" className={`mt-3 ${commonClasses}`} placeholder="Contact Name" {...field} />
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
                                                        <div className='max-h-[200px] overflow-y-auto'>
                                                            {
                                                                designation.map((designation, index) => {
                                                                    return <SelectItem value={designation.value} key={index}>
                                                                        {designation.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </div>
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
                                <div className='flex flex-col w-full'>
                                    <FormField
                                        control={form2.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={commonClasses}>
                                                            <SelectValue placeholder="Type" />
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
                                                {/* <FormMessage /> */}
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
                                    name="std_code"
                                    render={({ field }) => (
                                        <FormItem className='mt-3 w-1/4'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"google"} className="flex flex-row gap-2">
                                                            {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                            {countryCode.find((val) => val.value === field.value)?.value}
                                                            <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0 ml-[114px]">
                                                    <Command>
                                                        <CommandInput className='w-full' placeholder="Search Country Code..." />
                                                        <CommandEmpty>Country code not found.</CommandEmpty>
                                                        <CommandGroup>
                                                            <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                {countryCode.map((cc) => (
                                                                    <CommandItem
                                                                        value={cc.label}
                                                                        key={cc.label}
                                                                        onSelect={() => {
                                                                            console.log("std_code", cc.value)
                                                                            changeStdCode(cc.value)
                                                                            form2.setValue("std_code", cc.value)
                                                                        }}
                                                                    >
                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                            {cc.label}
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                    field.value?.includes(cc.value)
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
                                <FormField
                                    control={form2.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <Input type="text" className={`mt-3 w-3/4 ${commonClasses}`} placeholder="Phone No" {...field} />
                                    )}
                                />
                            </div>
                            <div className='flex flex-row justify-end mt-2 items-center gap-2 '>
                                {dummyContactData.length > 0 && <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] cursor-pointer`} onClick={() => discardContact()}>
                                    <IconCross size={20} />
                                    <span className='text-gray-600 text-xs font-semibold' >Discard</span>
                                </div>}
                                {isFormInUpdateState ? <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] ${form2.formState.isValid ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`} onClick={() => form2.formState.isValid && updateContact()}>
                                    <IconTick size={20} />
                                    <span className='text-gray-600 text-xs font-semibold' >Update</span>
                                </div> :
                                    <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] ${form2.formState.isValid ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`} onClick={() => form2.formState.isValid && addContact()}>
                                        <IconTick size={20} />
                                        <span className='text-gray-600 text-xs font-semibold' >Add</span>
                                    </div>}
                            </div>
                        </div>}

                    </form>
                </Form>


            </div>
            <Separator className='mt-10' />
            <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                {/* <DialogClose asChild> */}
                <Dialog >
                    <DialogTrigger asChild>
                        <Button variant={"google"} >Cancel</Button>
                    </DialogTrigger>
                    <DialogContent >
                        <div className='w-fit'>
                            <DialogHeader>
                                <div className='bg-warning-100 border-warning-50 rounded-full w-fit p-[12px]'>
                                    <IconSave size={24} />
                                </div>
                            </DialogHeader>
                            <div className='flex flex-col gap-[32px] mt-[16px]'>
                                <div className='flex flex-col'>
                                    <div className='text-gray-900 text-lg'>Unsaved changes</div>
                                    <div className='text-gray-600 text-sm'>Do you want to discard changes?</div>
                                </div>
                                <div className='flex flex-row gap-[12px]'>
                                    <DialogClose asChild>
                                        <Button className='text-md font-semibold  px-[38px] py-[10px]' variant={'google'}>No, go back</Button>
                                    </DialogClose>
                                    <Button onClick={() => yesDiscard()} className='text-md font-semibold px-[38px] py-[10px]'>Yes, discard</Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {/* </DialogClose> */}
                <Button disabled={!(form.formState.isValid && dummyContactData.length > 0)} onClick={() => addToLead()}>Save & Add</Button>
            </div>

        </div >
    )
}

export default AddLeadDetailedDialog

export function acronymFinder(lookupvalue: string, arr: IValueLabel[]) {
    return arr.find((val) => val.label === lookupvalue)?.acronym
}

export function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}