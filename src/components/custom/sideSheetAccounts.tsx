import React, { useEffect, useState } from 'react'
import { IconAccounts, IconAlert, IconArrowSquareRight, IconBilling, IconBuildings, IconCheckCircle, IconClock, IconClosedBy, IconCoinsHand, IconContacts, IconCross, IconCurrencyDollars, IconDeal, IconEdit2, IconEsop, IconExclusitivity, IconGlobe, IconGst, IconIndustry, IconLeads, IconLocation, IconLock, IconOrgnaisation, IconPackage, IconPercent2, IconProfile, IconRequiredError, IconRetainerAdvance, IconRoles, IconSave, IconServiceFeeRange, IconShield, IconShipping, IconStackedCoins, IconStackedCoins2, IconStackedCoins3, IconTick, IconUserCheck, IconUsers, IconUsersSearch, IconWallet, Unverified } from '../icons/svgIcons'
import { IChildData, formatData, getToken } from './leads'
import { Button } from '../ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '../ui/form'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'
import { BUDGET_RANGE, COUNTRY_CODE, CURRENCIES, DESIGNATION, DOMAINS, EXCLUSIVITY, INDUSTRY, LAST_FUNDING_AMOUNT, LAST_FUNDING_STAGE, OWNERS, REGION, REGIONS, RETAINER_ADVANCE, ROLETYPE, SEGMENT, SERVICE_FEE_RANGE, SIZE_OF_COMPANY, SOURCES, STATUSES, TIME_TO_FILL, TYPE } from '@/app/constants/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ClientGetResponse, Contact, IValueLabel, LeadInterface, Organisation, PatchLead, PatchOrganisation, PatchRoleDetails, RoleDetails, User } from '@/app/interfaces/interface'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { CommandGroup } from 'cmdk'
import { Command, CommandEmpty, CommandInput, CommandItem } from '../ui/command'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { acronymFinder, guidGenerator } from './addLeadDetailedDialog'
import { Tooltip, TooltipProvider } from '@radix-ui/react-tooltip'
import { TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Check, CheckCircle, CheckCircle2, ChevronDown, MinusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { contactListClasses } from '@/app/constants/classes'

const required_error = {
    required_error: "This field is required"
}

const FormSchema2 = z.object({
    name: z.string({
    }).min(2).max(30),
    designation: z.string({
    }).transform((val) => val === undefined ? undefined : val.trim()),
    type: z.string().transform((val) => val === undefined ? undefined : val.trim()),
    email: z.string({
    }).email(),
    phone: z.string({
    }).min(10).max(10),
    std_code: z.string({

    }),
    contactId: z.string().optional(),
})
const optionalFormschema2 = z.object({
    name: z.string({
    }).optional(),
    designation: z.string({
    }).optional(),
    type: z.string({
    }).optional(),
    email: z.string({
    }).optional(),
    phone: z.string({
    }).optional(),
    std_code: z.string({
    }).optional(),
    contactId: z.string().optional(),
})

const FormSchema = z.object({
    // creators: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one Creator.",
    // }),
    orgnaisationName: z.string(required_error), // [x]
    registeredName: z.string().optional(),
    industry: z.string().optional(), // [x]
    domain: z.string().optional(), // [x]
    size: z.string().optional(), // [x]
    lastFundingStage: z.string().optional(), // [x]
    lastFundingAmount: z.string().optional(), // [x]
    shippingAddress: z.string().optional(),
    billingAddress: z.string().optional(),
    gstinVatGstNo: z.string().optional(),
    contacts: z.string().optional(),
    segment: z.string()
})



const form2Defaults: z.infer<typeof FormSchema2> = {
    name: "",
    email: "",
    phone: "",
    std_code: "+91",
    designation: undefined,
    type: undefined,
    contactId: undefined
}


const commonClasses = "shadow-none focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"
const commonClasses2 = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"
const commonFontClasses = "text-sm font-medium text-gray-700"
const requiredErrorClasses = "text-sm font-medium text-error-500"
const selectFormMessageClasses = "pl-[36px] pb-[8px]"
const preFilledClasses = "disabled:text-black-700 disabled:opacity-1"
const disabledClasses = "bg-inherit"

function SideSheetAccounts({ parentData }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction } }) {

    const [formSchema, setFormSchema] = useState<any>(FormSchema);
    const [numberOfErrors, setNumberOfErrors] = useState<number>()
    const [areContactFieldValid, setContactFieldValid] = useState<boolean>(false)
    const [editAccountNameClicked, setEditAccountNameClicked] = useState<boolean>(false);
    const [showContactForm, setShowContactForm] = useState(true)
    const [dummyContactData, setDummyContactData] = useState<any[]>([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [budgetKey, setBudgetKey] = React.useState<number>(+new Date())
    const [places, setPlaces] = React.useState([])
    const [beforePromoteToProspectDivsArray, setBeforePromoteToProspectDivsArray] = useState<any[]>([]);

    const { childData: { row }, setChildDataHandler } = parentData

    const userFromLocalstorage = JSON.parse(localStorage.getItem("user") || "")
    const data: ClientGetResponse = row.original
    useEffect(() => {
        console.log(data)
        setDummyContactData(data.contacts)

    }, [])

    useEffect(() => {
        let updatedSchema
        if (addDialogOpen) {
            updatedSchema = FormSchema.extend({
                contacts: FormSchema2
            })

        } else {
            updatedSchema = FormSchema.omit({ contacts: true })
        }
        setFormSchema(updatedSchema)
        if (addDialogOpen) {
            resetForm2()
        }
        safeparse2()
    }, [addDialogOpen])

    function closeSideSheet() {
        setChildDataHandler('row', undefined)
    }

    const LabelIcon = () => {
        const d = LAST_FUNDING_STAGE.find((val) => val.label === data.last_funding_stage)

        return <>{d && <d.icon />}</>
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            orgnaisationName: data.name,
            industry: labelToValue(data.industry || "", INDUSTRY),
            domain: labelToValue(data.domain || "", DOMAINS),
            size: labelToValue(data.size || "", SIZE_OF_COMPANY),
            lastFundingStage: labelToValue(data.last_funding_stage || "", LAST_FUNDING_STAGE),
            lastFundingAmount: labelToValue(data.last_funding_amount?.toString() || "", LAST_FUNDING_AMOUNT),
            segment: labelToValue(data.segment || "", SEGMENT)
        },
        mode: "all"
    })
    const watcher = form.watch()

    useEffect(() => {
        safeparse2()

    }, [watcher])


    const tabs: IValueLabel[] = [
        { label: "Proposal", value: "proposal" },
        { label: "Service Contract", value: "service contract" },
        { label: "Requirement Deck", value: "requirement deck" },
        { label: "Profile Mapping", value: "profile mapping" },
        { label: "Interviews", value: "interviews" },
        { label: "Offer Rollout", value: "offer rollout" },
        { label: "Onboarding", value: "onboarding" },
        { label: "Replacement", value: "replacement" }
    ];



    function safeparse2() {
        const contacts = form.getValues("contacts")
        const result = FormSchema2.safeParse(contacts)
        console.log("safe prase 2 ", result)
        if (result.success) {
            setContactFieldValid(true)
        } else {
            console.log("safe prase 2 ", result.error.errors)
            setContactFieldValid(false)
        }
    }

    function addContact() {
        const finalData = form.getValues().contacts
        const ftype = TYPE.find((role) => role.value === finalData.type)?.label
        const fDesignation = DESIGNATION.find((des) => des.value === finalData.designation)?.label
        setDummyContactData((prevValues: any) => {
            const list = [{ ...form.getValues().contacts, type: ftype, designation: fDesignation, isLocallyAdded: true, contactId: guidGenerator() }, ...prevValues]
            return list
        })
        // setShowContactForm(false)
        setAddDialogOpen(false)
        resetForm2()
    }

    function yesDiscard(): void {
        setAddDialogOpen(false)
        resetForm2()
    }

    function resetForm2() {
        // form.resetField("contacts", { defaultValue: form2Defaults })
        form.reset({ "contacts": form2Defaults })
    }
    console.log(form.formState.errors)
    useEffect(() => {
        // console.log(reasonMap[form.getValues("reasons")])
    }, [form.watch()])

    function labelToValue(lookup: string, arr: IValueLabel[]) {
        return arr.find((item) => item.label === lookup)?.value
    }
    function valueToLabel(lookup: string, arr: IValueLabel[]) {
        return arr.find((item) => item.value === lookup)?.label
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()

    async function promoteToProspect() {
        const fieldsNeccessary = [
            { name: "esopRsusUl", label: "ESOP RSUS UL" },
            { name: "esopRsusUlCurrency", label: "ESOP RSUS UL Currency" },
            { name: "fixedBudgetUl", label: "Fixed Budget UL" },
            { name: "fixedBudgetUlCurrency", label: "Fixed Budget UL Currency" },
            { name: "timeToFill", label: "Time to Fill" },
            { name: "industry", label: "Industry" },
            { name: "domain", label: "Domain" },
            { name: "size", label: "Size" },
            { name: "lastFundingStage", label: "Last Funding Stage" },
            { name: "lastFundingAmount", label: "Last Funding Amount" },
            { name: "retainerAdvance", label: "Retainer Advance" },
            { name: "exclusivity", label: "Exclusivity" },
            { name: "serviceFeeRange", label: "Service Fee Range" },
        ];

        const missingFields = fieldsNeccessary.filter((field) => {
            const value = form.getValues(field.name);
            return !value; // Check if value is falsy (empty or undefined)
        });

        const beforePromoteToProspectDivsArray: any[] = fieldsNeccessary.map((field) => {
            const isMissing = missingFields.some((missingField) => missingField.name === field.name);
            const icon = isMissing ? <MinusCircleIcon size={20} color="red" /> : <CheckCircle2 size={20} color="#17B26A" />

            return (
                <div className={`flex text-md flex-row gap-[8px] items-center {${isMissing ? "" : "font-normal opacity-[0.7]"}`} key={field.name}>
                    {icon}
                    <span className={`${isMissing ? "font-semibold text-gray-900 " : "font-normal opacity-[0.7]"}`}>{field.label}</span>
                </div>
            );
        });
        if (missingFields.length > 0 && beforePromoteToProspectDivsArray.length > 0) {
            setBeforePromoteToProspectDivsArray(beforePromoteToProspectDivsArray);
        } else {
            setBeforePromoteToProspectDivsArray([]);
            try {
                const dataResp = await fetch(`${baseUrl}/v1/api/lead/${data.id}/promote/`, { method: "PATCH", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
                const result = await dataResp.json()
                if (result.message === "success") {
                    closeSideSheet()
                }
            }
            catch (err) {
                console.log("error", err)
            }
        }


    }

    async function patchData() {


        const finalContactData = dummyContactData.filter((contact) => !contact.id)
        let keysToRemove: any = ["contactId", "isLocallyAdded",]
        finalContactData.forEach((item) => {
            keysToRemove.forEach((key: string) => {
                if (key in item) {
                    delete item[key];
                }
            });
        })

        const orgData: Partial<PatchOrganisation> = {
            name: form.getValues("orgnaisationName"),
            industry: valueToLabel(form.getValues("industry") || "", INDUSTRY),
            domain: valueToLabel(form.getValues("domain") || "", DOMAINS),
            size: valueToLabel(form.getValues("size") || "", SIZE_OF_COMPANY),
            last_funding_stage: valueToLabel(form.getValues("lastFundingStage") || "", LAST_FUNDING_STAGE),
            last_funding_amount: valueToLabel(form.getValues("lastFundingAmount") || "", LAST_FUNDING_AMOUNT),
            segment: valueToLabel(form.getValues("segment") || "", SEGMENT) || LAST_FUNDING_STAGE.find((stage) => form.getValues("lastFundingStage") === stage.value)?.acronym
        }


        const contactToSend: Contact[] = finalContactData.map((val) => {
            val.organisation = data.id
            val.archived = false
            return val
        })
        const contacts: Contact[] = contactToSend

        const orgId = data.id


        const apiPromises = [
            // patchOrgData(orgId, orgData),
            // patchContactData(contacts)
        ]

        // try {
        //     const results = await Promise.all(apiPromises);
        //     console.log("All API requests completed:", results);
        //     closeSideSheet()
        // } catch (error) {
        //     console.error("Error fetching data:", error);
        // }

    }

    function safeprs() {
        const result = formSchema.safeParse(form.getValues())
        console.log(result)
        if (!result.success) {
            const errorMap = result.error.formErrors.fieldErrors
            console.log(errorMap)
            setNumberOfErrors(Object.keys(errorMap).length)
        }
    }

    function onSubmit() {
        console.log("submitted")
        // safeprs()
        console.log(numberOfErrors)
        patchData()
    }


    function onStatusChange(value: string) {
        updateFormSchemaOnStatusChange(value)


    }
    function updateFormSchemaOnStatusChange(value: string) {
        let updatedSchema
        if (value.toLowerCase() !== "unverified") {
            updatedSchema = FormSchema.extend({
                locations: z.string(required_error).min(1, { message: required_error.required_error }),
                fixedCtcBudget: z.string(required_error).min(1, { message: required_error.required_error }),
                industry: z.string(required_error).min(1, { message: required_error.required_error }),
                domain: z.string(required_error).min(1, { message: required_error.required_error }),
                size: z.string(required_error).min(1, { message: required_error.required_error }),
                lastFundingStage: z.string(required_error).min(1, { message: required_error.required_error }),
                lastFundingAmount: z.string(required_error).min(1, { message: required_error.required_error }), // [x]
            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema
        }
        setFormSchema(updatedSchema)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const keyValue = event.key;
        const validCharacters = /^[0-9.,\b]+$/; // Allow numbers, comma, period, and backspace (\b)


        if (!validCharacters.test(keyValue)) {
            event.preventDefault();
        }
    };

    function preprocess() {
        console.log("preprocess")
        safeprs()
    }

    function parseCurrencyValue(inputString: string) {
        const currencyRegex = /([A-Z]{3})\s([\d,]+)/; // Updated regex to match currency code and numeric value with commas

        const match = inputString.match(currencyRegex);

        if (match) {
            const currencyCode = match[1];
            const numericValueWithCommas = match[2];

            return {
                getCurrencyCode: () => currencyCode,
                getNumericValue: () => numericValueWithCommas,
            };
        } else {
            return null; // Return null if no match is found
        }
    }

    // Example usage:
    const inputString = "INR 2,320,434.35";
    const parsed = parseCurrencyValue(inputString);

    if (parsed) {
        console.log("Currency Code:", parsed.getCurrencyCode());
        console.log("Numeric Value:", parsed.getNumericValue());
    } else {
        console.log("Invalid input string.");
    }

    useEffect(() => {
        console.log(form.getValues("contacts.std_code"))
        let updatedSchema = formSchema
        if (form.getValues("contacts.std_code") === "+91") {
            formSchema.extend({
                contacts: FormSchema2.extend({
                    phone: z.string().min(10).max(10)
                })
            })

        } else {
            formSchema.extend({
                contacts: FormSchema2.extend({
                    phone: z.string().min(4).max(13)
                })
            })
        }
        setFormSchema(updatedSchema)
    }, [watcher.contacts?.std_code])

    console.log(formSchema)

    function changeStdCode(value: string) {
        // let updatedSchema
        // console.log(value, value != "+91" )
        // if (value != "+91") {
        //     updatedSchema = formSchema.extend({
        //         contacts: FormSchema2.extend({
        //             phone: z.string().min(4).max(13) 
        //         })
        //     })
        // } else {
        //     console.log("neh")
        //     updatedSchema = formSchema.extend({
        //         contacts: FormSchema2
        //     })
        // }
        // setFormSchema(updatedSchema)
    }


    function discardAccountName() {
        setEditAccountNameClicked(false)
    }

    return (
        <div className={`fixed flex flex-row z-[50] right-0 top-0 h-[100vh] w-[100vw] `} >
            <div className='w-full bg-gray-900 opacity-70 backdrop-blur-[8px] fade-in' onClick={closeSideSheet}>

            </div>
            <div className='absolute right-0 top-0 bottom-0 w-4/12 bg-white-900 opacity-100 slide-left'>
                <div className='absolute top-0 right-[100%] bg-white-900 p-[16px] rounded-l-[8px] cursor-pointer' onClick={closeSideSheet} >
                    <IconCross size={20} color={"#667085"} />
                </div>
                <Form {...form} >
                    <form className='w-full h-full flex flex-row ' onSubmitCapture={preprocess} onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='relative pt-[24px] w-full h-full flex flex-col '>
                            <div className='flex flex-col flex-1 overflow-y-auto  pr-[0px] '>
                                <div className='sticky top-0 bg-white-900 z-50'>
                                    {!editAccountNameClicked ? <div className='px-[24px] flex flex-row items-center justify-between'>
                                        <div className=' text-gray-900 text-xl font-semibold '>
                                            {data.name}
                                        </div>
                                        <div className='cursor-pointer' onClick={() => setEditAccountNameClicked(true)}>
                                            <IconEdit2 size={24} />
                                        </div>
                                    </div> :
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="organisationName"
                                                render={({ field }) => (
                                                    <FormItem className='px-[16px]'>
                                                        <FormControl >
                                                            <Input type="text" className={`mt-3 ${commonClasses} ${commonFontClasses}`} placeholder="Organisation Name" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='flex flex-row justify-end mt-2 mr-[10px] items-center gap-2 '>
                                                <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] cursor-pointer`} onClick={() => discardAccountName()}>
                                                    <IconCross size={20} />
                                                    <span className='text-gray-600 text-xs font-semibold' >Cancel</span>
                                                </div>

                                                <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] ${!form.getFieldState("name").error ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`} onClick={() => form.formState.isValid && addContact()}>
                                                    <IconTick size={20} />
                                                    <span className='text-gray-600 text-xs font-semibold' >Save</span>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    <div className="px-[16px] mt-[24px] text-md font-medium w-full flex flex-row ">
                                        <FormField
                                            control={form.control}
                                            name="segment"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }
                                                    } defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`border-gray-300 ${commonClasses}`}>
                                                                <SelectValue defaultValue={field.value} placeholder="Select a Segment" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                SEGMENT.map((segment, index) => {
                                                                    return <SelectItem key={index} value={segment.value}>
                                                                        <div className={`flex flex-row gap-2 items-center ${!segment.isDefault && 'border border-[1.5px] rounded-[16px]'} ${segment.class}`}>
                                                                            {segment.label}
                                                                        </div>
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                    <FormMessage className={selectFormMessageClasses} />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                </div>

                                <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                    <span>Account Details</span>
                                </span>

                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div>
                                                    <IconShield size={24} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Registered Name
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <FormField
                                        control={form.control}
                                        name="registeredName"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input className={`border-none ${commonClasses} ${commonFontClasses} `} placeholder="Registered Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="industry"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div>
                                                                                    <IconIndustry size={24} color="#98A2B3" />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                Industry
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>

                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Industry" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent >
                                                        <div className='h-[200px] overflow-y-scroll '>
                                                            {
                                                                INDUSTRY.map((industry, index) => {
                                                                    return <SelectItem key={index} value={industry.value}>
                                                                        {industry.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </div>
                                                    </SelectContent>
                                                </Select>
                                                {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                <FormMessage className={selectFormMessageClasses} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="domain"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div>
                                                                                    <IconBuildings size={24} color="#98A2B3" />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                Domain
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>

                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Domain" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            DOMAINS.map((domain, index) => {
                                                                return <SelectItem key={index} value={domain.value}>
                                                                    {domain.label}
                                                                </SelectItem>
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                <FormMessage className={selectFormMessageClasses} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="size"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div>
                                                                                    <IconUsers size={24} color="#98A2B3" />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                Size
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>

                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Size" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            SIZE_OF_COMPANY.map((companySize, index) => {
                                                                return <SelectItem key={index} value={companySize.value}>
                                                                    {companySize.label}
                                                                </SelectItem>
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                <FormMessage className={selectFormMessageClasses} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="lastFundingStage"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div>
                                                                                    <IconCoinsHand size={24} color="#98A2B3" />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                Last Funding Stage
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>

                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Last Funding Stage" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <div className='h-[200px] overflow-y-scroll '>
                                                            {
                                                                LAST_FUNDING_STAGE.map((lastFundingStage, index) => {
                                                                    return <SelectItem key={index} value={lastFundingStage.value}>
                                                                        {lastFundingStage.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </div>
                                                    </SelectContent>
                                                </Select>
                                                {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                <FormMessage className={selectFormMessageClasses} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="lastFundingAmount"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div>
                                                                                    <IconStackedCoins3 size={24} />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                Last Funding Amount
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>


                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Last Funding Amount" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <div className='h-[200px] overflow-y-scroll '>
                                                            {
                                                                LAST_FUNDING_AMOUNT.map((lastFundingStage, index) => {
                                                                    return <SelectItem key={index} value={lastFundingStage.value}>
                                                                        {lastFundingStage.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </div>
                                                    </SelectContent>
                                                </Select>
                                                {/* <FormDescription>
                                                    You can manage email addresses in your{" "}
                                                </FormDescription> */}
                                                <FormMessage className={selectFormMessageClasses} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 ">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div>
                                                    <IconBilling size={24} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                Billing Address
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <FormField
                                        control={form.control}
                                        name="billingAddress"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input className={`border-none ${commonClasses} ${commonFontClasses}  `} placeholder="Billing Address" {...field} />
                                                </FormControl>
                                                <FormMessage className={selectFormMessageClasses} />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div>
                                                    <IconPackage size={24} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                Shipping Address
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <FormField
                                        control={form.control}
                                        name="shippingAddress"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input className={`border-none ${commonClasses} ${commonFontClasses}`} placeholder="Shipping Address" {...field} />
                                                </FormControl>
                                                <FormMessage className={selectFormMessageClasses} />
                                            </FormItem>
                                        )}
                                    />
                                </div>



                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div>
                                                    <IconGst size={24} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                GSTIN/VAT/GST Number
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <FormField
                                        control={form.control}
                                        name="gstinVatGstNo"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input className={`border-none ${commonClasses} ${commonFontClasses} `} placeholder="GSTIN/VAT/GST Number" {...field} />
                                                </FormControl>
                                                <FormMessage className={selectFormMessageClasses} />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                    <span>Contact Details</span>
                                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                                        <DialogTrigger>
                                            <span className={`text-sm text-purple-700  ${showContactForm ? 'opacity-[1] cursor-pointer' : 'opacity-[0.3] cursor-not-allowed'}`} >
                                                + Add
                                            </span>
                                        </DialogTrigger>
                                        <DialogContent className="p-0" onPointerDownOutside={(e) => e.preventDefault()}>
                                            <DialogHeader>
                                                <DialogTitle className='px-[24px] pt-[30px] pb-[10px]'>
                                                    <div className='text-lg text-gray-900 font-semibold'>Add Contact</div>
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className='w-fit min-w-[600px] '>
                                                <Separator className="bg-gray-200 h-[1px]  mb-4" />
                                                <div className='flex flex-col px-[24px]'>
                                                    <div className='flex flex-col'>
                                                        <FormField
                                                            control={form.control}
                                                            name="contacts.name"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input type="text" className={`mt-3 ${commonClasses2}`} placeholder="Contact Name" {...field} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )} />
                                                        <div className='flex flex-row gap-4 mt-3'>
                                                            <div className='flex flex-col  w-full'>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="contacts.designation"
                                                                    render={({ field }) => (
                                                                        <FormItem className='w-full '>
                                                                            <Popover>
                                                                                <PopoverTrigger asChild>
                                                                                    <FormControl>
                                                                                        <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                                            <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                                                {DESIGNATION.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Designation</span>}
                                                                                            </div>
                                                                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                                                                        </Button>
                                                                                    </FormControl>
                                                                                </PopoverTrigger>
                                                                                <PopoverContent className="w-[268px] p-0 ">
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
                                                                                                            form.setValue("contacts.designation", designation.value)
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
                                                            <div className='flex flex-col w-full'>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="contacts.type"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                    <SelectTrigger className={commonClasses2}>
                                                                                        <SelectValue placeholder="Type" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    {TYPE.map((type, index) => {
                                                                                        return <SelectItem value={type.value} key={index}>
                                                                                            {type.label}
                                                                                        </SelectItem>
                                                                                    })}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormItem>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <FormField
                                                            control={form.control}
                                                            name="contacts.email"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input type="email" className={`mt-3 ${commonClasses2}`} placeholder="Email" {...field} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )} />
                                                        <div className='flex flex-row gap-2 items-center'>
                                                            <div className=''>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="contacts.std_code"
                                                                    render={({ field }) => (
                                                                        <FormItem className='mt-3'>
                                                                            <Popover >
                                                                                <PopoverTrigger asChild>
                                                                                    <FormControl>
                                                                                        <Button variant={"google"} className={`flex flex-row gap-2 ${commonClasses2}`} >
                                                                                            {COUNTRY_CODE.find((val) => {
                                                                                                return val.value === field.value
                                                                                            })?.value}
                                                                                            <ChevronDown className="h-4 w-4 opacity-50" />
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
                                                                                                            console.log("contacts.std_code", cc.value)
                                                                                                            changeStdCode(cc.value)
                                                                                                            form.setValue("contacts.std_code", cc.value)
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
                                                                                                                )} />
                                                                                                        </div>
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
                                                                    name="contacts.phone"
                                                                    render={({ field }) => (
                                                                        <FormControl>
                                                                            <Input type="text" className={`mt-3 w-full ${commonClasses2}`} placeholder="Phone No" {...field}
                                                                                onKeyPress={handleKeyPress}
                                                                                onChange={event => {
                                                                                    return handleOnChangeNumeric(event, field, false)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>

                                            <div>
                                                <Separator className="bg-gray-200 h-[1px]  mt-8" />
                                                <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                                                    <Button variant={"google"} onClick={() => yesDiscard()}>Cancel</Button>
                                                    <Button type='button' disabled={!areContactFieldValid} onClick={() => addContact()}>
                                                        Save & Add
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                </span>
                                <div className='px-[16px]'>
                                    {dummyContactData.length > 0 && <div className='flex flex-col w-full mt-4  pr-[16px] '>
                                        <div className='flex flex-col w-full'>
                                            {
                                                dummyContactData.map((item, index: number) => (
                                                    <div className={`${contactListClasses}`} key={index} >
                                                        <div className='flex flex-col'>
                                                            <div className='flex flex-row justify-between w-full'>

                                                                <span className='text-sm font-semibold flex-1'>
                                                                    {item.name}
                                                                </span>
                                                                {item?.type && item?.type?.trim() !== "" && <div>
                                                                    <span className={`text-xs mr-[10px] px-[6px] py-[2px] border border-[1px] rounded-[6px] font-medium ${TYPE.find(val => val.label === item.type)?.class}`}>{item.type}</span>
                                                                </div>}
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
                                </div>
                            </div>
                            <div className='w-full px-[24px] py-[16px] border border-gray-200 flex flex-row justify-between items-center'>
                                {numberOfErrors && <div className='flex flex-row gap-[8px] text-error-500 font-medium text-xs'>
                                    <IconAlert size={16} />
                                    <span>
                                        {numberOfErrors} field(s) missing
                                    </span>
                                </div>}
                                <div className='flex flex-row flex-1 justify-end '>
                                    <Button variant="default" type="submit" >Save</Button>

                                </div>
                            </div>

                        </div>
                        <div className="w-[1px] bg-gray-200 "></div>

                    </form>
                </Form>

            </div>
        </div>


    )

    function handleOnChangeNumeric(event: React.ChangeEvent<HTMLInputElement>, field: any, isSeparator: boolean = true) {
        const cleanedValue = event.target.value.replace(/[,\.]/g, '')
        console.log(cleanedValue)
        if (isSeparator) {
            return field.onChange((+cleanedValue).toLocaleString())
        } else {
            return field.onChange((+cleanedValue).toString())
        }
    }

    async function patchOrgData(orgId: number, orgData: Partial<PatchOrganisation>) {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/${orgId}/`, { method: "PATCH", body: JSON.stringify(orgData), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.message === "success") {
            }
        }
        catch (err) {
            console.log("error", err)
        }
    }


    async function patchRoleData(roleId: number, roleDetailsData: Partial<PatchOrganisation>) {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/role_detail/${roleId}/`, { method: "PATCH", body: JSON.stringify(roleDetailsData), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.message === "success") {
            }
        }
        catch (err) {
            console.log("error", err)
        }
    }
    async function patchContactData(contacts: Contact[]) {
        try {
            for (const contact of contacts) {
                const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/`, {
                    method: "POST",
                    body: JSON.stringify(contact),
                    headers: {
                        "Authorization": `Token ${token_superuser}`,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                });

                const result = await dataResp.json();
                if (result.message === "success") {
                    // Handle success for each contact if needed
                }
            }
        } catch (err) {
            console.log("error", err);
        }
    }

    function requiredErrorComponent() {
        return <div className={`${requiredErrorClasses} flex flex-row gap-[5px] items-center`}>
            Required
            <IconRequiredError size={16} />
        </div>
    }

}


export default SideSheetAccounts
