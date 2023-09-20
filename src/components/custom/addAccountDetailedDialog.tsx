"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { ArrowDown, ArrowDown01, ArrowDown01Icon, ArrowUpRight, Check, ChevronDown, ChevronDownIcon, ChevronsDown, Contact, Ghost, MoveDown, PencilIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRY_CODE as countryCode, TYPE as type, DESIGNATION as designation, LEAD_SOURCE as leadSource, BUDGET_RANGE as budgetRange, REGION as region, ROLETYPE as roleType, REGION, CREATORS, OWNERS, TYPE, DESIGNATION, ROLETYPE, INDUSTRIES, INDUSTRY, DOMAINS, SIZE_OF_COMPANY, LAST_FUNDING_STAGE, LAST_FUNDING_AMOUNT, SET_VALUE_CONFIG } from '@/app/constants/constants'
import { DialogClose } from '@radix-ui/react-dialog'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { toast, useToast } from '../ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { IconAccounts, IconAccounts2, IconContacts, IconCross, IconPencil, IconRoles, IconSave, IconTick } from '../icons/svgIcons'
import { Client, ClientCompleteInterface, ClientPostBody, ContactDetail, IErrors, IValueLabel, LeadInterface } from '@/app/interfaces/interface'
// import { setData } from '@/app/dummy/dummydata'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import Image from 'next/image'
import { formatData, getToken } from './leads'
import Link from 'next/link'
import { contactListClasses, disabledClasses, preFilledClasses } from '@/app/constants/classes'
import { PopoverClose } from '@radix-ui/react-popover'
import { required_error } from './sideSheet'


const commonClasses = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"


const FormSchema = z.object({
    organisationName: z.string().min(1), // [x]
    industry: z.string().min(1), // [x]
    domain: z.string().min(1).transform((val) => val === undefined ? undefined : val.trim()), // [x]
    size: z.string().min(1).transform((val) => val === undefined ? undefined : val.trim()), // [x]
    lastFundingStage: z.string().min(1).transform((val) => val === undefined ? undefined : val.trim()), // [x]
    lastFundingAmount: z.string().min(1).transform((val) => val === undefined ? undefined : val.trim()), // [x]
    // registeredName: z.string().optional(),
    // gstinVatGstNo: z.string().optional(),
    // billingAddress: z.string().optional(),
    // shippingAddress: z.string(),
    // contacts: z.string().optional(),
    // sameAsBillingAddress: z.boolean().optional()
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



function AddAcountDetailedDialog({ inputAccount, dataFromChild, details, filteredLeadData }: { inputAccount: string, dataFromChild: CallableFunction, details: ClientCompleteInterface | undefined, filteredLeadData: LeadInterface[] | undefined }) {

    const [dummyContactData, setDummyContactData] = useState<any[]>([])
    const [showContactForm, setShowContactForm] = useState<any>(true)
    const [isFormInUpdateState, setFormInUpdateState] = useState<any>(false)
    const [budgetKey, setBudgetKey] = useState<number>(+new Date())
    const [formSchema2, setFormSchema2] = useState(FormSchema2)
    const [isVcIndustrySelected, setIsVcIndustrySelected] = useState<boolean>(false)
    const { toast } = useToast()
    const [numberOfErrors, setNumberOfErrors] = useState<IErrors>({
        invalidErrors: 0,
        requiredErrors: 0
    })
    const [formSchema, setFormSchema] = useState<any>(FormSchema);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lastFundingStage: undefined,
            lastFundingAmount: undefined,
            domain: undefined,
            size: undefined,
            organisationName: undefined,
            industry: undefined
        }
    })

    const form2 = useForm<z.infer<typeof formSchema2>>({
        resolver: zodResolver(formSchema2),
        defaultValues: form2Defaults

    })

    function safeprs() {
        const result = formSchema.safeParse(form.getValues())
        if (!result.success) {
            const errorMap = result.error.formErrors.fieldErrors
            console.log("errormap", errorMap)
            // Initialize error counters
            let requiredErrorsCount = 0;
            let invalidErrorsCount = 0;

            // Iterate through the error map
            for (const field in errorMap) {
                const errors = errorMap[field];
                for (const error of errors) {
                    if (error.includes("Required")) {
                        requiredErrorsCount++;
                    } else {
                        invalidErrorsCount++;
                    }
                }
            }
            const errorState = {
                requiredErrors: requiredErrorsCount,
                invalidErrors: invalidErrorsCount
            };
            setNumberOfErrors(errorState)

            console.log("errors", errorState)
        }
    }

    useEffect(()=>{
        form2.trigger()
    },[formSchema])

    const watcher = form.watch()

    useEffect(() => {
        console.log("errors", form.formState.errors, "valid", form.formState.isValid)

    }, [watcher])

    useEffect(() => {
        form2.trigger()
    }, [formSchema2])

    useEffect(() => {
        console.log("details", details)
        if (details?.name) {
            form.setValue("organisationName", details?.name, SET_VALUE_CONFIG)
        } else {
            form.setValue("organisationName", inputAccount, SET_VALUE_CONFIG)
        }
        // if (details?.contacts && details?.contacts?.length > 0) {
        //     setDummyContactData(details?.contacts)
        //     setShowContactForm(false)
        // }
        changeStdCode()
    }, [])

    // console.log(dummyContactData)


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

    // function checkVcIndutsry() {
    //     const industry = form.getValues("industry")
    //     let updatedSchema
    //     if (form.getValues("industry") === "vc_pe") {
    //         updatedSchema = FormSchema.extend({
    //             domain: z.string().optional(),
    //             size: z.string().optional(),
    //             lastFundingStage: z.string().optional(),
    //             lastFundingAmount: z.string().optional(),
    //         })
    //     }
    //     if (industry === "vc_pe") {
    //         setIsVcIndustrySelected(true)
    //         form.setValue("lastFundingStage", undefined)
    //         form.setValue("lastFundingAmount", undefined)
    //         form.setValue("domain", undefined)
    //         form.setValue("size", undefined)
    //     } else {
    //         setIsVcIndustrySelected(false)
    //     }
    // }

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

    async function addToContact() {
        const formData = form.getValues()
        const industryLabel = specificValueFinder(formData.industry, INDUSTRY)?.label
        const domainLabel = specificValueFinder(formData.domain || "", DOMAINS)?.label
        const sizeLabel = specificValueFinder(formData.size || "", SIZE_OF_COMPANY)?.label
        const lastFundingStageLabel = specificValueFinder(formData.lastFundingStage || "", LAST_FUNDING_STAGE)?.label
        const lastFundingAmountLabel = specificValueFinder(formData.lastFundingAmount || "", LAST_FUNDING_AMOUNT)?.label
        const registeredName = formData.registeredName || ""
        const gstinVatGstNo = formData.gstinVatGstNo || ""
        const billingAddress = formData.billingAddress || ""
        const shippingAddress = formData.shippingAddress || ""
        const organisationName = formData.organisationName || ""
        const segment = LAST_FUNDING_STAGE.find((stage) => form.getValues("lastFundingStage") === stage.value)?.acronym || ""
        const finalContactData = dummyContactData.filter((contact) => !contact.id)

        let keysToRemove: any = ["contactId", "isLocallyAdded",]
        finalContactData.forEach((item) => {
            keysToRemove.forEach((key: string) => {
                if (key in item) {
                    delete item[key];
                }
            });
        })

        const dataToSend: ClientPostBody = {
            billing_address: billingAddress,
            shipping_address: shippingAddress,
            contact_details: finalContactData,
            domain: domainLabel,
            last_funding_amount: lastFundingAmountLabel,
            last_funding_stage: lastFundingStageLabel,
            govt_id: gstinVatGstNo,
            industry: industryLabel,
            name: organisationName,
            registered_name: registeredName,
            size: sizeLabel,
            segment: segment
        }


        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        const token_superuser = getToken()

        console.log(dataToSend)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/`, { method: "POST", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            console.log(result)
            dataFromChild()
            form.reset()
            resetForm2()
            toast({
                title: "Account Created Successfully!",
                variant: "dark"
            })

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

        form2.setValue("name", item.name, SET_VALUE_CONFIG)
        if (ftype) {
            form2.setValue("type", ftype, SET_VALUE_CONFIG)
        }
        form2.setValue("std_code", item.std_code, SET_VALUE_CONFIG)
        if (fDesignation) {
            form2.setValue("designation", fDesignation, SET_VALUE_CONFIG)
        }
        form2.setValue("email", item.email, SET_VALUE_CONFIG)
        form2.setValue("phone", item.phone, SET_VALUE_CONFIG)
        form2.setValue("contactId", item.contactId, SET_VALUE_CONFIG)
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

    function changeStdCode() {
        const value = form2.getValues("std_code")
        let updatedSchema
        console.log(value, value != "+91")
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

    function checkVcIndutsry() {
        const industry = form.getValues("industry")
        if (industry === "vc_pe") {
            setIsVcIndustrySelected(true)
            form.setValue("lastFundingStage", undefined, SET_VALUE_CONFIG)
            form.setValue("lastFundingAmount", undefined, SET_VALUE_CONFIG)
            form.setValue("domain", undefined, SET_VALUE_CONFIG)
            form.setValue("size", undefined, SET_VALUE_CONFIG)
        } else {
            setIsVcIndustrySelected(false)
        }
        updateFormSchema()
    }
    function updateFormSchema() {
        let updatedSchema
        if (form.getValues("industry") === "vc_pe") {
            updatedSchema = FormSchema.extend({
                domain: z.string().optional(),
                size: z.string().optional(),
                lastFundingStage: z.string().optional(),
                lastFundingAmount: z.string().optional(),
            })
        } else {
            updatedSchema = FormSchema
        }
        setFormSchema(updatedSchema)
    }

    return (
        <div>
            <div className='flex flex-row gap-6 px-[24px] py[24px] w-[800px]'>
                <Form {...form}>
                    <form className='left w-1/2 flex flex-col' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="h-[24px] w-[30px] text-gray-500 rounded flex flex-row justify-center">
                                <IconAccounts2 />
                            </div>
                            <span className="text-xs text-gray-700">ACCOUNT</span>
                            <div className="bg-gray-200 h-[1px] w-full" ></div>
                        </div>
                        <div className='flex flex-col gap-[16px] mt-[18px]'>
                            <FormField
                                control={form.control}
                                name="organisationName"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormControl>
                                            <Input type="text" className={` ${commonClasses}`} placeholder="Organisation Name" {...field} />

                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem className='w-full '>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                        <div className='w-full flex-1 text-align-left text-md flex  '>
                                                            {INDUSTRY.find((val) => val.value === field.value)?.label || <span className={`text-muted-foreground `} >Industry</span>}
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[350px] p-0 ">
                                                <Command>
                                                    <CommandInput className='w-full' placeholder="Search Industry" />
                                                    <CommandEmpty>Industry not found.</CommandEmpty>
                                                    <CommandGroup>
                                                        <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                            {INDUSTRY.map((industry) => (
                                                                <CommandItem
                                                                    value={industry.value}
                                                                    key={industry.value}
                                                                    onSelect={() => {
                                                                        form.setValue("industry", industry.value, { shouldDirty: true, shouldValidate: true })
                                                                        checkVcIndutsry()
                                                                    }}
                                                                >
                                                                    <PopoverClose asChild>
                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                            {industry.label}
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                    field.value === industry.value
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
                                name="domain"
                                render={({ field }) => (
                                    <FormItem >
                                        <Select disabled={isVcIndustrySelected} onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Domain" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                <div className='max-h-[200px] overflow-y-auto '>
                                                    {
                                                        DOMAINS.map((domain, index) => {
                                                            return <SelectItem key={index} value={domain.value}>
                                                                {domain.label}
                                                            </SelectItem>
                                                        })
                                                    }
                                                </div>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem >
                                        <Select disabled={isVcIndustrySelected} onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                <div className='max-h-[200px] overflow-y-auto '>
                                                    {
                                                        SIZE_OF_COMPANY.map((size, index) => {
                                                            return <SelectItem key={index} value={size.value}>
                                                                {size.label}
                                                            </SelectItem>
                                                        })
                                                    }
                                                </div>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastFundingStage"
                                render={({ field }) => (
                                    <FormItem className='w-full '>
                                        <Popover>
                                            <PopoverTrigger asChild disabled={isVcIndustrySelected}>
                                                <FormControl>
                                                    <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] disabled:opacity-1">
                                                        <div className='w-full flex-1 text-align-left text-md flex  '>
                                                            {LAST_FUNDING_STAGE.find((val) => val.value === field.value)?.label || <span className={isVcIndustrySelected ? `${disabledClasses} text-gray-400` : "text-muted-foreground"} >Last Funding Stage</span>}
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            {!isVcIndustrySelected && <PopoverContent className="w-[350px] p-0 ">
                                                <Command>
                                                    <CommandInput className='w-full' placeholder="Search Funding Stage" />
                                                    <CommandEmpty>Funding Stage not found.</CommandEmpty>
                                                    <CommandGroup>
                                                        <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                            {LAST_FUNDING_STAGE.map((lastFundingStage) => (
                                                                <CommandItem
                                                                    value={lastFundingStage.value}
                                                                    key={lastFundingStage.value}
                                                                    onSelect={() => {
                                                                        form.setValue("lastFundingStage", lastFundingStage.value, SET_VALUE_CONFIG)
                                                                    }}
                                                                >
                                                                    <PopoverClose asChild>
                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                            {lastFundingStage.label}
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                    field.value === lastFundingStage.value
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
                                            </PopoverContent>}
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastFundingAmount"
                                render={({ field }) => (
                                    <FormItem >
                                        <Select disabled={isVcIndustrySelected} onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={commonClasses}>
                                                    <SelectValue placeholder="Last Funding Amount" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                <div className='max-h-[200px] overflow-y-auto '>
                                                    {
                                                        LAST_FUNDING_AMOUNT.map((size, index) => {
                                                            return <SelectItem key={index} value={size.value}>
                                                                {size.label}
                                                            </SelectItem>
                                                        })
                                                    }
                                                </div>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* <div className='flex flex-row gap-4 mt-[24px] w-full '>
                            <FormField
                                control={form.control}
                                name="registeredName"
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <Input type="text" className={` ${commonClasses}`} placeholder="Registered Name (Optional)" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gstinVatGstNo"
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <Input type="text" className={` ${commonClasses}`} placeholder="GSTIN/VAT/GST No (Optional)" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className='flex flex-row gap-4 mt-[24px] w-full '>
                            <FormField
                                control={form.control}
                                name="billingAddress"
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <Input type="text" className={` ${commonClasses}`} placeholder="Billing Address (Optional)" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className='flex flex-row mt-[24px] gap-[8px]'>
                            <FormField
                                control={form.control}
                                name="sameAsBillingAddress"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center gap-[8px]">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel >
                                            <div className="text-sm mb-[6px] font-medium text-gray-700 ">
                                                Same as Billing Address
                                            </div>
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-row gap-4 mt-[4px] w-full '>
                            <FormField
                                control={form.control}
                                name="shippingAddress"
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <Input type="text" className={` ${commonClasses}`} placeholder="Shipping Address" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                        </div> */}
                    </form>
                </Form>
                <div className="w-[1px] bg-gray-200 "></div>
                <Form {...form2}>
                    <form className='right w-1/2 flex flex-col ' onSubmit={form2.handleSubmit(onSubmit2)}>
                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                <IconContacts size="20" color="#667085" />
                            </div>
                            <span className="text-xs text-gray-700">CONTACTS</span>
                            <div className="bg-gray-200 h-[1px] flex-1" ></div>
                            <div className={`text-sm text-purple-700  ${!showContactForm ? 'opacity-[1] cursor-pointer' : 'opacity-[0.3] cursor-not-allowed'}`} onClick={() => !showContactForm && addNewForm()}>+ Add</div>
                        </div>
                        {dummyContactData.length > 0 && <div className={`flex flex-col w-full mt-4  pr-[16px] max-h-[340px] overflow-y-auto   ${showContactForm && "h-[150px] overflow-y-scroll "} `}>
                            <div className='flex flex-col w-full gap-[24px]'>
                                {
                                    dummyContactData.map((item: any, index: number) => (
                                        <div className={`${contactListClasses}`} key={index} >
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
                                                            item.isLocallyAdded && !showContactForm && <TooltipProvider>
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
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" className={`mt-3 ${commonClasses}`} placeholder="Contact Name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className='flex flex-row gap-4 mt-3'>
                                <div className='flex flex-col w-1/2 '>
                                    <FormField
                                        control={form2.control}
                                        name="designation"
                                        render={({ field }) => (
                                            <FormItem className='w-full '>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                    {DESIGNATION.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Designation</span>}
                                                                </div>
                                                                <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0 ml-[32px]">
                                                        <Command>
                                                            <CommandInput className='w-full' placeholder="Search Designation" />
                                                            <CommandEmpty>Designation not found.</CommandEmpty>
                                                            <CommandGroup>
                                                                <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                    {DESIGNATION.map((designation) => (
                                                                        <CommandItem
                                                                            value={designation.value}
                                                                            key={designation.value}
                                                                            onSelect={() => {
                                                                                form2.setValue("designation", designation.value, SET_VALUE_CONFIG)
                                                                            }}
                                                                        >
                                                                            <div className="flex flex-row items-center justify-between w-full">
                                                                                {designation.label}
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4 text-purple-600",
                                                                                        field.value === designation.value
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
                                <div className='flex flex-col w-1/2'>
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
                                    <FormItem>
                                        <FormControl>
                                            <Input type="email" className={`mt-3 ${commonClasses}`} placeholder="Email" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className='flex flex-row gap-2 items-center'>
                                <FormField
                                    control={form2.control}
                                    name="std_code"
                                    render={({ field }) => (
                                        <FormItem className='mt-3 w-max'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"google"} className="flex flex-row gap-2">
                                                            {countryCode.find((val) => val.value === field.value)?.value}
                                                            <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0 ml-[114px]">
                                                    <Command>
                                                        <CommandInput className='w-full' placeholder="Search Country Code" />
                                                        <CommandEmpty>Country code not found.</CommandEmpty>
                                                        <CommandGroup className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                            <div >
                                                                {countryCode.map((cc) => (
                                                                    <CommandItem
                                                                        value={cc.label}
                                                                        key={cc.label}
                                                                        onSelect={() => {
                                                                            console.log("std_code", cc.value)
                                                                            form2.setValue("std_code", cc.value, SET_VALUE_CONFIG)
                                                                            changeStdCode()
                                                                        }}
                                                                    >
                                                                        <PopoverClose asChild>
                                                                            <div className="flex flex-row items-center justify-between w-full">
                                                                                {cc.label}
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4 text-purple-600",
                                                                                        field.value === (cc.value)
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
                                    control={form2.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className='mt-3  w-3/4 flex-1'>
                                            <FormControl>
                                                <Input type="text" className={` ${commonClasses}`} placeholder="Phone No" {...field} />
                                            </FormControl>
                                        </FormItem>
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
                <Button disabled={!(form.formState.isValid && dummyContactData.length > 0)} onClick={() => addToContact()}>Save & Add</Button>
            </div>

        </div >
    )
}

export default AddAcountDetailedDialog

export function acronymFinder(lookupvalue: string, arr: IValueLabel[]) {
    return arr.find((val) => val.label === lookupvalue)?.acronym
}

export function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}