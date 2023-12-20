"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { ArrowDown, ArrowDown01, ArrowDown01Icon, ArrowUpRight, Check, ChevronDown, ChevronDownIcon, ChevronsDown, Contact, Ghost, MoveDown, PencilIcon, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRY_CODE as countryCode, TYPE as type, DESIGNATION as designation, LEAD_SOURCE as leadSource, BUDGET_RANGE as budgetRange, REGION as region, ROLETYPE as roleType, REGION, CREATORS, OWNERS, TYPE, DESIGNATION, ROLETYPE, SET_VALUE_CONFIG, DUPLICATE_ERROR_MESSAGE_DEFAULT, CONTACT_TYPE } from '@/app/constants/constants'
import { DialogClose } from '@radix-ui/react-dialog'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { toast, useToast } from '../ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { IconAccounts2, IconContacts, IconCross, IconPencil, IconRoles, IconSave, IconTick } from '../icons/svgIcons'
import { Client, ClientCompleteInterface, ContactDetail, DuplicateError, IValueLabel, LeadInterface } from '@/app/interfaces/interface'
// import { setData } from '@/app/dummy/dummydata'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import { commonClasses, commonFontClassesAddDialog, contactListClasses, preFilledClasses } from '@/app/constants/classes'
import { PopoverClose } from '@radix-ui/react-popover'
import { doesTypeIncludesMandatory, getIsContactDuplicate, getMandatoryFromType, getToken, handleAlphaNumericKeyPress, handleKeyPress, handleOnChangeNumeric, handleOnChangeNumericReturnNull, toastContactAlreadyExists } from './commonFunctions'
import Link from 'next/link'



const FormSchema = z.object({
    organisationName: z.string({
        // required_error: "Please enter a name.",
    }).min(1),
    region: z.string({
        // required_error: "Please select a region"
    }).min(1),
    roleType: z.string({
        // required_error: "Please select role type"
    }).min(1),
    budget: z.string({
        // required_error: "Please select budget range"
    }).min(1),
    leadSource: z.string({
        // required_error: "Please select a lead source"
    }).min(1),
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
    phone: null,
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
    const [formSchema2, setFormSchema2] = useState<any>(FormSchema2)
    const [isPhoneMandatory, setIsPhoneMandatory] = useState<boolean>(false)
    const [duplicateErrorMessage, setDuplicateErrorMessage] = useState<DuplicateError>(DUPLICATE_ERROR_MESSAGE_DEFAULT)
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
        // console.log(form2.getValues())
        form2.formState.isValid
        form2.formState.errors
    }, [watcher2])

    useEffect(() => {
        if (details?.name) {
            form.setValue("organisationName", details?.name, SET_VALUE_CONFIG)
        } else {
            form.setValue("organisationName", inputAccount, SET_VALUE_CONFIG)
        }
        if (details?.contacts && details?.contacts?.length > 0) {
            setDummyContactData(details?.contacts)
            setShowContactForm(false)
        }
        changeStdCode()

    }, [])

    async function addContact() {
        const finalData = form2.getValues()
        const ftype = type.find((role) => role.value === finalData.type)?.label

        const fDesignation = designation.find((des) => des.value === finalData.designation)?.label
        let name = finalData.name
        let email = finalData.email
        let phone = form2.getValues("phone")
        let std_code = form2.getValues("std_code")
        if (!isPhoneMandatory && !phone) {
            phone = ""
            std_code = ""
        }

        const phoneDuplicateLocal = dummyContactData.find((contact) => contact.phone === phone)
        const emailDuplicateLocal = dummyContactData.find((contact) => contact.email === email)

        const res = await getIsContactDuplicate(email, `${std_code}-${phone}`)

        if (res?.phone || res?.email || phoneDuplicateLocal || emailDuplicateLocal) {
            setDuplicateErrorMessage({
                email: res?.email || emailDuplicateLocal,
                phone: res?.phone || phoneDuplicateLocal
            })
        } else {
            setDuplicateErrorMessage({
                email: false,
                phone: false
            })
            setDummyContactData((prevValues: any) => {
                const list = [{ name, email, type: ftype, designation: fDesignation, isLocallyAdded: true, contactId: guidGenerator(), phone, std_code }, ...prevValues]
                return list
            })
            setShowContactForm(false)
            resetForm2()
        }

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
        const regionAcronym = acronymFinder(regionLabel, REGION)
        const roleTypeAcronym = acronymFinder(roleTypeLabel, ROLETYPE)

        let incrementalNumber: number = 1
        filteredLeadData?.forEach((val) => {
            const dataArr = val.title?.split(" ").join("").split("-")
            if (dataArr) {
                const [orgNameL, regL, roleL] = dataArr
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
            title: null,

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

        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/lead/`, { method: "POST", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.status == "1") {
                toast({
                    title: "Lead Created Succesfully!",
                    variant: "dark"
                })
                // console.log(result)
                dataFromChild()
                form.reset()
                resetForm2()
            } else {
                toast({
                    title: `${result.error}`,
                    variant: "destructive"
                })
            }

        } catch (err) {
            console.log(err)
        }
    }

    function specificValueFinder(lookupValue: string, array: any[]): IValueLabel {
        return array.find((item) => item.value === lookupValue)
    }

    function activateToUpdateForm(item: any) {
        const finalData = item
        const ftype = TYPE.find((type) => type.label === finalData.type)?.value
        // console.log(finalData.contactType)
        const fDesignation = DESIGNATION.find((des) => des.label === finalData.designation)?.value

        form2.setValue("name", item.name, SET_VALUE_CONFIG)
        if (ftype) {
            form2.setValue("type", ftype, SET_VALUE_CONFIG)
        }
        if (fDesignation) {
            form2.setValue("designation", fDesignation, SET_VALUE_CONFIG)
        }
        form2.setValue("email", item.email, SET_VALUE_CONFIG)
        let phone = item.phone
        let std_code = item.std_code
        if (!isPhoneMandatory && !phone) {
            phone = null
            std_code = "+91"
        }
        form2.setValue("std_code", std_code, SET_VALUE_CONFIG)
        form2.setValue("phone", phone, SET_VALUE_CONFIG)
        form2.setValue("contactId", item.contactId, SET_VALUE_CONFIG)
        setShowContactForm(true)
        setFormInUpdateState(true)
    }

    function addNewForm(): void {

        resetForm2()
        setShowContactForm(true)
    }

    async function updateContact() {
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
            data.email = form2.getValues("email")
            data.designation = specificValueFinder(form2.getValues("designation"), DESIGNATION)?.label
            let phone = form2.getValues("phone")
            let std_code = form2.getValues("std_code")
            if (!isPhoneMandatory && !phone) {
                phone = ""
                std_code = ""
            }
            data.std_code = std_code
            data.phone = phone

            const res = await getIsContactDuplicate(data.email, `${std_code}-${phone}`)

            if (res?.phone || res?.email) {
                setDuplicateErrorMessage({
                    email: res.email,
                    phone: res.phone
                })
            } else {
                setDuplicateErrorMessage({
                    email: false,
                    phone: false
                })
                setDummyContactData(newData)
                resetForm2()
                setFormInUpdateState(false)
                setShowContactForm(false)
            }
            // if(res===false){
            //     setDummyContactData(newData)
            //     resetForm2()
            //     setFormInUpdateState(false)
            //     setShowContactForm(false)
            // }else{
            //     toastContactAlreadyExists()
            // }
        }

    }

    function yesDiscard(): void {
        form.reset()
        resetForm2()
        dataFromChild()
    }

    function changeStdCode(type: string | undefined = undefined) {
        const value = form2.getValues("std_code")
        let updatedSchema
        const isMandatory = type ? doesTypeIncludesMandatory(type) : false
        if (type) {
            setIsPhoneMandatory(isMandatory)
        }
        if (isMandatory) {
            if (value != "+91" && value != "+1") {
                updatedSchema = FormSchema2.extend({
                    phone: z.string().min(4).max(13),
                    std_code: z.string()
                })
            }
            else {
                updatedSchema = FormSchema2
            }
        } else {
            if (value != "+91" && value != "+1") {
                updatedSchema = FormSchema2.extend({
                    phone: z.string().min(4).max(13).optional().nullable(),
                    std_code: z.string().optional()
                })
            }
            else {
                updatedSchema = FormSchema2.extend({
                    phone: z.string().min(10).max(10).optional().nullable(),
                    std_code: z.string().optional()
                })
            }
        }
        if (type) {
            const phone = form2.getValues("phone")
            if (!phone) {
                if (isMandatory) {
                    form2.setValue("phone", '')
                } else {
                    form2.setValue("phone", null)
                }
            }
        }
        setFormSchema2(updatedSchema)
    }

    useEffect(() => {
        form2.formState.errors
        form2.formState.isValid
        form2.trigger()
    }, [formSchema2])


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
            <div className='flex flex-row gap-6 px-[24px] py[24px] w-full'>
                <Form {...form}>
                    <form className='left flex flex-col w-1/2' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="h-[24px] w-[30px] text-gray-500 rounded flex flex-row justify-center">
                                <IconAccounts2 />
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
                                        {/* <Input onKeyPress={handleAlphaNumericKeyPress} disabled={details?.name ? true : false} type="text" className={`mt-3 ${commonFontClassesAddDialog} ${commonClasses} ${details?.name && preFilledClasses}`} placeholder="Organisation Name" {...field} /> */}
                                        <Input onKeyPress={handleAlphaNumericKeyPress} disabled={true} type="text" className={`mt-3 ${commonFontClassesAddDialog} ${commonClasses} ${details?.name && preFilledClasses}`} placeholder="Organisation Name" {...field} />

                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {filteredLeadData && filteredLeadData?.length > 0 && <Link href={`/filtered-data?ids=${details?.name}`} target='_blank' className='mt-3 text-sm text-blue-600 flex flex-row gap-2 justify-end items-center font-medium cursor-pointer' >
                            <span>
                                {filteredLeadData?.length} Exisiting {filteredLeadData?.length === 1 ? "Lead" : "Leads"}
                            </span>
                            {/* <ArrowUpRight className='text-blue-600 h-[18px] w-[18px]'/> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 12L12 4M12 4H6.66667M12 4V9.33333" stroke="#1570EF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>}

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
                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
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
                                    <FormItem className='w-full '>
                                        <Popover modal={true}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"google"} className="flex flex-row gap-2 w-full px-[12px] ">
                                                        <div className='w-full flex-1 text-align-left text-md flex  '>
                                                            {ROLETYPE.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Select Role Type</span>}
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>

                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput className='w-full' placeholder="Search Role Type" />
                                                    <CommandEmpty>Role Type not found.</CommandEmpty>
                                                    <CommandGroup>
                                                        <div className='flex flex-col max-h-[200px] overflow-y-auto '>
                                                            {ROLETYPE.map((roleType) => (
                                                                <CommandItem
                                                                    value={roleType.value}
                                                                    key={roleType.value}
                                                                    onSelect={() => {
                                                                        form.setValue("roleType", roleType.value, SET_VALUE_CONFIG)
                                                                    }}
                                                                >
                                                                    <div className="flex flex-row items-center justify-between w-full">
                                                                        {roleType.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4 text-purple-600",
                                                                                field.value === roleType.value
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
                        <div className='flex flex-col mt-3 w-full'>
                            {<FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} key={budgetKey}>
                                            <FormControl>
                                                <SelectTrigger disabled={!form.getValues("region")} className={`${commonFontClassesAddDialog} ${commonClasses}`}>
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
                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
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
                                <IconContacts size="20" color="#667085" />
                            </div>
                            <span className="text-xs text-gray-700">CONTACT</span>
                            <div className="bg-gray-200 h-[1px] flex-1" ></div>
                            <div className={`text-sm text-purple-700  ${!showContactForm ? 'opacity-[1] cursor-pointer' : 'opacity-[0.3] cursor-not-allowed'}`} onClick={() => !showContactForm && addNewForm()}>+ Add</div>
                        </div>
                        {dummyContactData.length > 0 && <div className={`flex flex-col w-full mt-4  pr-[16px] max-h-[340px] overflow-y-auto   ${showContactForm && "h-[150px] overflow-y-scroll "} `}>
                            <div className='flex flex-col w-full'>
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
                                            <Input type="text" className={`mt-3 ${commonFontClassesAddDialog} ${commonClasses}`} placeholder="Contact Name" {...field} />
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
                                                <Popover modal={true}>
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
                                                    <PopoverContent className=" p-0 ">
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
                                                <Select onValueChange={(val) => {
                                                    changeStdCode(val)
                                                    return field.onChange(val)
                                                }} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                            <SelectValue placeholder="Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            CONTACT_TYPE.map((type, index) => {
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
                                            <Input type="email" className={`mt-3 ${commonFontClassesAddDialog} ${commonClasses}`} placeholder="Email" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {duplicateErrorMessage?.email && <div className='text-error-500 text-sm font-normal'>
                                Email ID is linked to another contact

                            </div>}

                            <div className='flex flex-row gap-2 items-center'>
                                <FormField
                                    control={form2.control}
                                    name="std_code"
                                    render={({ field }) => (
                                        <FormItem className='mt-3 w-max'>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"google"} className="flex flex-row gap-2">
                                                            {countryCode.find((val) => val.value === field.value)?.value || <span className='text-muted-foreground '>STD Code</span>}
                                                            <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0 ml-[114px]" style={{ width: "200px" }}>
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
                                        <FormItem className='mt-3  w-3/4 flex-1' >
                                            <FormControl>
                                                <Input type="text" className={` ${commonFontClassesAddDialog} ${commonClasses}`} placeholder={`Phone No ${!isPhoneMandatory ? "(Optional)" : "(Mandatory)"}`} {...field}
                                                    onKeyPress={handleKeyPress}
                                                    onChange={event => {
                                                        const std_code = form2.getValues("std_code")
                                                        const is13Digits = std_code != "+91" && std_code != "-1"
                                                        return handleOnChangeNumericReturnNull(event, field, false, isPhoneMandatory, is13Digits ? 13 : 10)
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {duplicateErrorMessage?.phone && <div className='text-error-500 text-sm font-normal'>
                                Phone Number is linked to another contact

                            </div>}
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
                {beforeCancelDialog(yesDiscard)}
                <Button disabled={!(form.formState.isValid && dummyContactData.length > 0)} onClick={() => addToLead()}>Save & Add</Button>
            </div>

        </div >
    )
}

export default AddLeadDetailedDialog

export function beforeCancelDialog(yesDiscard: CallableFunction) {
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant={"google"}>Cancel</Button>
        </DialogTrigger>
        <DialogContent>
            <div className='min-w-[360px]'>

                <div className='flex flex-col gap-[32px] '>
                    <div className='flex flex-col'>
                        <div className='text-gray-900 text-lg font-semibold'>Unsaved changes</div>
                        <div className='text-gray-600 text-sm font-normal'>Do you want to discard changes?</div>
                    </div>
                    <div className='flex flex-row gap-[12px] w-full'>
                        <DialogClose asChild>
                            <Button className='text-sm flex-1 font-semibold  px-[38px] py-[10px]' variant={'google'}>No, go back</Button>
                        </DialogClose>
                        <Button onClick={() => yesDiscard()} className='text-sm flex-1 font-semibold px-[38px] py-[10px]'> Yes, discard</Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}

export function acronymFinder(lookupvalue: string, arr: IValueLabel[]) {
    return arr.find((val) => val.label === lookupvalue)?.acronym
}

export function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}