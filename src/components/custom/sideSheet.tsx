import React, { useEffect, useState } from 'react'
import { IconAccounts, IconAlert, IconArrowSquareRight, IconBilling, IconBuildings, IconClock, IconCoinsHand, IconContacts, IconCross, IconCurrencyDollars, IconDeal, IconEsop, IconExclusitivity, IconGlobe, IconGst, IconIndustry, IconLeads, IconLocation, IconLock, IconOrgnaisation, IconPackage, IconPercent2, IconProfile, IconRequiredError, IconRetainerAdvance, IconRoles, IconSave, IconServiceFeeRange, IconShield, IconShipping, IconStackedCoins, IconStackedCoins2, IconStackedCoins3, IconTick, IconUserCheck, IconUsers, IconUsersSearch, IconWallet, Unverified } from '../icons/svgIcons'
import { IChildData, formatData, getToken } from './leads'
import { Button } from '../ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '../ui/form'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'
import { BUDGET_RANGE, COUNTRY_CODE, CURRENCIES, DESIGNATION, DOMAINS, EXCLUSIVITY, INDUSTRY, LAST_FUNDING_AMOUNT, LAST_FUNDING_STAGE, OWNERS, REGION, REGIONS, RETAINER_ADVANCE, ROLETYPE, SERVICE_FEE_RANGE, SIZE_OF_COMPANY, SOURCES, STATUSES, TIME_TO_FILL, TYPE } from '@/app/constants/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { IValueLabel, LeadInterface, Organisation, PatchLead, PatchOrganisation, PatchRoleDetails, RoleDetails, User } from '@/app/interfaces/interface'
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
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

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
    }).min(6).max(13),
    std_code: z.string({
    }),
    contactId: z.string().optional(),
})

const FormSchema = z.object({
    // creators: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one Creator.",
    // }),
    owners: z.string(required_error), // [x]
    regions: z.string(required_error), // [x]
    sources: z.string(),
    statuses: z.string(),
    reasons: z.string().optional(),
    role: z.string(required_error), // [x]
    budget: z.string(required_error), // [x]
    fulfilledBy: z.string().optional(),
    locations: z.string().optional(), // [x]
    fixedCtcBudget: z.string().optional(), // [x]
    fixedCtcBudgetCurrency: z.string().optional(),
    dealValue: z.string().optional(),
    orgnaisationName: z.string(required_error), // [x]
    registeredName: z.string().optional(),
    industry: z.string().optional(), // [x]
    domain: z.string().optional(), // [x]
    size: z.string().optional(), // [x]
    lastFundingStage: z.string().optional(), // [x]
    lastFundingAmount: z.string().optional(), // [x]
    shippingAddress: z.string().optional(),
    billingAddress: z.string().optional(),
    exclusivity: z.string().optional(),
    serviceFeeRange: z.string().optional(),
    serviceFee: z.string().optional(),
    retainerAdvance: z.string().optional(),
    esopRsusUl: z.string().optional(),
    esopRsusUlCurrency: z.string().optional(),
    fixedBudgetUl: z.string().optional(),
    fixedBudgetUlCurrency: z.string().optional(),
    timeToFill: z.string().optional(),
    gstinVatGstNo: z.string().optional(),
    contacts: FormSchema2.optional()
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
const preFilledClasses = "disabled:text-black-900"
const disabledClasses = "bg-inherit"

function SideSheet({ parentData }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction } }) {

    const [formSchema, setFormSchema] = useState<any>(FormSchema);
    const [numberOfErrors, setNumberOfErrors] = useState<number>()
    const [areContactFieldValid, setContactFieldValid] = useState<boolean>(false)

    const [showContactForm, setShowContactForm] = useState(true)
    const [dummyContactData, setDummyContactData] = useState<any[]>([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [budgetKey, setBudgetKey] = React.useState<number>(+new Date())

    const { childData: { row }, setChildDataHandler } = parentData

    const userFromLocalstorage = JSON.parse(localStorage.getItem("user") || "")
    const data: LeadInterface = row.original
    useEffect(() => {
        setDummyContactData(data.organisation.contacts)
    }, [])

    function closeSideSheet() {
        setChildDataHandler('row', undefined)
    }

    const LabelIcon = () => {
        const d = LAST_FUNDING_STAGE.find((val) => val.label === data.organisation.last_funding_stage)

        return <>{d && <d.icon />}</>
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            regions: labelToValue(data.role?.region, REGIONS),
            sources: data.source || "",
            statuses: labelToValue(data.status, STATUSES),
            owners: labelToValue(data.owner, OWNERS),
            role: labelToValue(data.role?.role_type, ROLETYPE),
            budget: labelToValue(data.role?.budget_range, BUDGET_RANGE[labelToValue(data.role?.region, REGIONS) || ""]),
            locations: data.role.location ? data.role.location : undefined,
            fixedCtcBudget: parseCurrencyValue(data.role.fixed_budget || "")?.getNumericValue() || undefined,
            fixedBudgetUl: parseCurrencyValue(data.role.fixed_budget_ul || "")?.getNumericValue() || undefined,
            esopRsusUl: parseCurrencyValue(data.role.esop_rsu || "")?.getNumericValue() || undefined,
            orgnaisationName: data.organisation.name,
            industry: labelToValue(data.organisation.industry || "", INDUSTRY),
            domain: labelToValue(data.organisation.domain || "", DOMAINS),
            size: labelToValue(data.organisation.size || "", SIZE_OF_COMPANY),
            lastFundingStage: labelToValue(data.organisation.last_funding_stage || "", LAST_FUNDING_STAGE),
            retainerAdvance: data.retainer_advance ? "yes" : "no",
            exclusivity: data.exclusivity ? "yes" : "no",
            serviceFeeRange: labelToValue(data.service_fee_range || "", SERVICE_FEE_RANGE),
            timeToFill: labelToValue(data.role.time_To_fill || "", TIME_TO_FILL),
            lastFundingAmount: labelToValue(data.organisation.last_funding_amount?.toString() || "", LAST_FUNDING_AMOUNT),
            reasons: data.reason || undefined,
            fixedCtcBudgetCurrency: parseCurrencyValue(data.role.fixed_budget || "")?.getCurrencyCode() || "INR",
            fixedBudgetUlCurrency: parseCurrencyValue(data.role.fixed_budget_ul || "")?.getCurrencyCode() || "INR",
            esopRsusUlCurrency: parseCurrencyValue(data.role.esop_rsu || "")?.getCurrencyCode() || "INR",


        },
        mode: "all"
    })
    const watcher = form.watch()


    useEffect(() => {
        const contacts = form.getValues("contacts")
        const result = FormSchema2.safeParse(contacts)
        if (result.success) {
            setContactFieldValid(true)
        } else {
            setContactFieldValid(false)
        }

    }, [watcher])

    const reasonMap: any = {
        "junk": ["Low Cash Component", "Equity Only Role", "Non-Tech Role", "Low Service Fee"],
        "lost": ["Lost to Competition", "Internal Hiring"],
        "deferred": ["Funding Awaited", "Hiring Freeze", "Role Deferred"]
    }

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



    function addContact() {
        const finalData = form.getValues().contacts
        const ftype = TYPE.find((role) => role.value === finalData.type)?.label
        const fDesignation = DESIGNATION.find((des) => des.value === finalData.designation)?.label
        setDummyContactData((prevValues: any) => {
            const list = [{ ...form.getValues().contacts, type: ftype, designation: fDesignation, isLocallyAdded: true, contactId: guidGenerator() }, ...prevValues]
            return list
        })
        // setShowContactForm(false)
        resetForm2()
        setAddDialogOpen(false)
    }

    function yesDiscard(): void {
        resetForm2()
        setAddDialogOpen(false)
    }

    function resetForm2() {
        form.resetField("contacts", { defaultValue: form2Defaults })
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
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/lead/${data.id}/promote/`, { method: "PATCH", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.message === "success") {
                // closeSideSheet()
            }
        }
        catch (err) {
            console.log("error", err)
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

        const statusToSend = valueToLabel(form.getValues("statuses"), STATUSES)
        const reasonToSend = ["deferred", "lost", "junk"].includes(form.getValues("statuses")) ?  form.getValues("reasons") : "" 

        const leadData: Partial<PatchLead> = {
            retainer_advance: form.getValues("retainerAdvance")?.toLowerCase() === "yes" ? true : false,
            exclusivity: form.getValues("exclusivity")?.toLowerCase() === "yes" ? true : false,
            service_fee_range: valueToLabel(form.getValues("serviceFeeRange") || "", SERVICE_FEE_RANGE),
            status: statusToSend,
            reason: reasonToSend,
            // owner: valueToLabel(form.getValues("owners"), OWNERS)
        }
        const orgData: Partial<PatchOrganisation> = {
            name: form.getValues("orgnaisationName"),
            industry: valueToLabel(form.getValues("industry") || "", INDUSTRY),
            domain: valueToLabel(form.getValues("domain") || "", DOMAINS),
            size: valueToLabel(form.getValues("size") || "", SIZE_OF_COMPANY),
            last_funding_stage: valueToLabel(form.getValues("lastFundingStage") || "", LAST_FUNDING_STAGE),
            contacts: finalContactData,
            last_funding_amount: valueToLabel(form.getValues("lastFundingAmount") || "", LAST_FUNDING_AMOUNT),

        }
        const region = valueToLabel(form.getValues("regions"), REGIONS)
        const roleDetailsData: Partial<PatchRoleDetails> = {
            role_type: valueToLabel(form.getValues("role"), ROLETYPE),
            region: region,
            location: form.getValues("locations"),
            budget_range: valueToLabel(form.getValues("budget"), BUDGET_RANGE[form.getValues("regions")]),
            fixed_budget: `${form.getValues("fixedCtcBudgetCurrency")} ${form.getValues("fixedCtcBudget")}`,
            fixed_budget_ul: `${form.getValues("fixedBudgetUlCurrency")} ${form.getValues("fixedBudgetUl")}`,
            esop_rsu: `${form.getValues("esopRsusUlCurrency")} ${form.getValues("esopRsusUl")}`,
            time_To_fill: valueToLabel(form.getValues("timeToFill") || "", TIME_TO_FILL)
        }

        const orgId = data.organisation.id
        const roleId = data.role.id


        const apiPromises = [
            patchLeadData(leadData, roleDetailsData),
            patchOrgData(orgId, orgData),
            patchRoleData(roleId, roleDetailsData)
        ]

        try {
            const results = await Promise.all(apiPromises);
            console.log("All API requests completed:", results);
            closeSideSheet()
        } catch (error) {
            console.error("Error fetching data:", error);
        }

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
        let updatedSchema;
        if (value.toLowerCase() !== "unverified") {
            updatedSchema = FormSchema.extend({
                locations: z.string(required_error),
                fixedCtcBudget: z.string(required_error),
                industry: z.string(required_error), // [x]
                domain: z.string(required_error), // [x]
                size: z.string(required_error), // [x]
                lastFundingStage: z.string(required_error), // [x]
                lastFundingAmount: z.string(required_error), // [x]

            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema;
        }
        setFormSchema(updatedSchema);

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

    console.log(formSchema)

    return (
        <div className={`fixed flex flex-row z-[50] right-0 top-0 h-[100vh] w-[100vw] `} >
            <div className='w-full bg-gray-900 opacity-70 backdrop-blur-[8px] fade-in' onClick={closeSideSheet}>

            </div>
            <div className='absolute right-0 top-0 bottom-0 w-11/12 bg-white-900 opacity-100 slide-left'>
                <div className='absolute top-0 right-[100%] bg-white-900 p-[16px] rounded-l-[8px] cursor-pointer' onClick={closeSideSheet} >
                    <IconCross size={20} color={"#667085"} />
                </div>
                <Form {...form} >
                    <form className='w-full h-full flex flex-row ' onSubmitCapture={preprocess} onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='relative pt-[24px] 2xl:w-1/4 w-4/12 h-full flex flex-col '>
                            <div className='flex flex-col flex-1 overflow-y-auto  pr-[0px] '>
                                <div className='sticky top-0 bg-white-900 z-50'>
                                    <div className='px-[24px] text-gray-900 text-xl font-semibold '>
                                        {data.title}
                                    </div>
                                    <div className="px-[16px] mt-[24px] text-md font-medium w-full flex flex-row ">
                                        <FormField
                                            control={form.control}
                                            name="statuses"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <Select onValueChange={(value) => {
                                                        onStatusChange(value)
                                                        return field.onChange(value)
                                                    }
                                                    } defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`border-gray-300 ${commonClasses}`}>
                                                                <SelectValue defaultValue={field.value} placeholder="Select a Status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                STATUSES.filter((status) => status.value !== 'allStatuses').map((status, index) => {
                                                                    return <SelectItem key={index} value={status.value}>
                                                                        <div className="">
                                                                            <div className={`flex flex-row gap-2 items-center  px-2 py-1 ${!status.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status.class}`}>
                                                                                {status.icon && <status.icon />}
                                                                                {status.label}
                                                                            </div>
                                                                        </div>
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
                                    {reasonMap[form.getValues("statuses")]?.length > 0 && (<div className="px-[16px] mt-[16px] mb-[6px] text-md font-medium w-full flex flex-row ">
                                        <FormField
                                            control={form.control}
                                            name="reasons"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`border-gray-300 shadow ${commonClasses}`}>
                                                                <SelectValue defaultValue={field.value} placeholder="Select Reason" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                reasonMap[form.getValues("statuses")]?.map((reason: string, index: number) => {
                                                                    return <SelectItem key={index} value={reason}>
                                                                        {reason}
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

                                    </div>)}
                                </div>
                                <span className='px-[16px] my-[12px] text-gray-700 text-sm font-medium'>
                                    Details
                                </span>
                                <div className="px-[18px] py-[8px] gap-2 items-center w-full flex flex-row border-b-[1px] border-gray-200 bg-gray-100">
                                    <IconUsersSearch size={24} />
                                    <FormField
                                        control={form.control}
                                        name="sources"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>

                                                <FormControl>
                                                    <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} ${preFilledClasses} `} placeholder="Source" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200 ">
                                    <FormField
                                        control={form.control}
                                        name="owners"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[19px] items-center text-gray-700 ' >
                                                                <div className='text-[#98A2B3]'>
                                                                    <IconProfile size={24} />
                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Select Owner" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            OWNERS.filter((owner) => owner.value !== 'allOwners').map((owner, index) => {
                                                                return <SelectItem key={index} value={owner.value}>
                                                                    {owner.label}
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
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 bg-gray-100">
                                    <IconUserCheck size={24} />
                                    <FormField
                                        control={form.control}
                                        name="fulfilledBy"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Fulfilled By" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 bg-gray-100">
                                    <IconCurrencyDollars size={24} />
                                    <FormField
                                        control={form.control}
                                        name="dealValue"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>

                                                    <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} bg-inherit`} placeholder="Deal Value" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium'>
                                    Role Details
                                </span>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <IconRoles size={24} color="#98A2B3" />
                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Select Role" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <div className='h-[200px] overflow-y-scroll '>
                                                            {
                                                                ROLETYPE.map((role, index) => {
                                                                    return <SelectItem key={index} value={role.value}>
                                                                        {role.label}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </div>
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
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="regions"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={(value) => {
                                                    return field.onChange(value)
                                                }} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <IconGlobe size={24} color="#98A2B3" />
                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Select Region" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            REGIONS.filter((region) => region.value !== 'allRegions').map((region, index) => {
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
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 border-b-2 " >
                                    <IconLocation size={24} color="#98A2B3" />
                                    <FormField
                                        control={form.control}
                                        name="locations"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input className={`border-none ${commonClasses} ${commonFontClasses}`} placeholder="Location" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="budget"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <IconWallet size={24} color="#98A2B3" />
                                                                </div>
                                                                <SelectValue placeholder="Select Budget" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            BUDGET_RANGE[form.getValues("regions")]?.map((budget, index) => {
                                                                return <SelectItem key={index} value={budget.value}>
                                                                    {budget.label}
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
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                    <IconStackedCoins size={24} />
                                    <div className='flex flex-row w-full items-center'>
                                        <FormField
                                            control={form.control}
                                            name="fixedCtcBudgetCurrency"
                                            render={({ field }) => (
                                                <FormItem className='w-fit min-w-[80px]'>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                        <FormControl>
                                                            <SelectTrigger className={`border-none ${commonFontClasses}`}>
                                                                <SelectValue placeholder="INR" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                CURRENCIES?.map((currency, index) => {
                                                                    return <SelectItem key={index} value={currency.value}>
                                                                        {currency.label}
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
                                            control={form.control}
                                            name="fixedCtcBudget"
                                            render={({ field }) => (
                                                <FormItem className='flex-1'>
                                                    <FormControl>
                                                        <Input className={`border-none ${commonClasses} ${commonFontClasses}`} placeholder="Fixed Budget" {...field}
                                                            onKeyPress={handleKeyPress}
                                                            onChange={event => {
                                                                return handleOnChangeNumeric(event, field)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>

                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                    <IconStackedCoins2 size={24} />
                                    <div className='flex flex-row w-full items-center'>
                                        <FormField
                                            control={form.control}
                                            name="fixedBudgetUlCurrency"
                                            render={({ field }) => (
                                                <FormItem className='w-fit min-w-[80px]'>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                        <FormControl>
                                                            <SelectTrigger className={`border-none ${commonFontClasses}`}>
                                                                <SelectValue placeholder="INR" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                CURRENCIES?.map((currency, index) => {
                                                                    return <SelectItem key={index} value={currency.value}>
                                                                        {currency.label}
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
                                            control={form.control}
                                            name="fixedBudgetUl"
                                            render={({ field }) => (
                                                <FormItem className='flex-1'>
                                                    <FormControl>
                                                        <Input className={`border-none ${commonClasses} ${commonFontClasses}`} placeholder="Fixed Budget UL" {...field}
                                                            onKeyPress={handleKeyPress}
                                                            onChange={event => {
                                                                return handleOnChangeNumeric(event, field)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                    <IconEsop size={24} />
                                    <div className='flex flex-row w-full items-center'>
                                        <FormField
                                            control={form.control}
                                            name="esopRsusUlCurrency"
                                            render={({ field }) => (
                                                <FormItem className='w-fit min-w-[80px]'>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                        <FormControl>
                                                            <SelectTrigger className={`border-none ${commonFontClasses}`}>
                                                                <SelectValue placeholder="INR" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                CURRENCIES?.map((currency, index) => {
                                                                    return <SelectItem key={index} value={currency.value}>
                                                                        {currency.label}
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
                                            control={form.control}
                                            name="esopRsusUl"
                                            render={({ field }) => (
                                                <FormItem className='flex-1'>
                                                    <FormControl>
                                                        <Input className={`border-none ${commonClasses} ${commonFontClasses}`} placeholder="ESOP/RSUs UL" {...field}
                                                            onKeyPress={handleKeyPress}
                                                            onChange={event => {
                                                                return handleOnChangeNumeric(event, field)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="timeToFill"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <IconClock size={24} color="#98A2B3" />
                                                                </div>
                                                                <SelectValue placeholder="Time to Fill" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            TIME_TO_FILL.map((timeToFill, index) => {
                                                                return <SelectItem key={index} value={timeToFill.value}>
                                                                    {timeToFill.label}
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
                                <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                    <span>Account Details</span>
                                    {data.organisation.last_funding_stage && <LabelIcon />}
                                </span>
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 bg-gray-100">
                                    <IconOrgnaisation size={24} />
                                    <FormField
                                        control={form.control}
                                        name="orgnaisationName"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} ${preFilledClasses}`} placeholder="Organisation Name" {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 cursor-not-allowed bg-gray-100">
                                                <IconShield size={24} />
                                                <FormField
                                                    control={form.control}
                                                    name="registeredName"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormControl>
                                                                <Input disabled className={`border-none ${commonClasses} ${commonFontClasses}  ${disabledClasses} `} placeholder="Registered Name" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side='right' >
                                            Editable only in the Prospect state
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
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
                                                                    <IconIndustry size={24} color="#98A2B3" />
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
                                                                    <IconBuildings size={24} color="#98A2B3" />
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
                                                                    <IconUsers size={24} color="#98A2B3" />
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
                                                                    <IconCoinsHand size={24} color="#98A2B3" />
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
                                                                    <IconStackedCoins3 size={24} />

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
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 cursor-not-allowed bg-gray-100">
                                                <IconBilling size={24} />
                                                <FormField
                                                    control={form.control}
                                                    name="billingAddress"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormControl>
                                                                <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Billing Address" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side='right'>
                                            Editable only in the Prospect state
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 cursor-not-allowed bg-gray-100">
                                                <IconPackage size={24} />
                                                <FormField
                                                    control={form.control}
                                                    name="shippingAddress"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormControl>
                                                                <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Shipping Address" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side='right'>
                                            Editable only in the Prospect state
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>



                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 cursor-not-allowed bg-gray-100">
                                    <IconGst size={24} />
                                    <FormField
                                        control={form.control}
                                        name="gstinVatGstNo"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="GSTIN/VAT/GST Number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <span className='px-[16px] mb-[12px] mt-[24px] text-gray-700 text-sm font-medium'>
                                    Engagement Model
                                </span>
                                <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="retainerAdvance"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2  ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <IconRetainerAdvance size={24} color="#98A2B3" />
                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Retainer Advance" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            RETAINER_ADVANCE.map((retainer, index) => {
                                                                return <SelectItem key={index} value={retainer.value}>
                                                                    {retainer.label}
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
                                        name="exclusivity"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <IconExclusitivity size={24} color="#98A2B3" />
                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Exclusivity" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            EXCLUSIVITY.map((retainer, index) => {
                                                                return <SelectItem key={index} value={retainer.value}>
                                                                    {retainer.label}
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
                                        name="serviceFeeRange"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={`border-none mb-2 ${commonFontClasses}`}>
                                                            <div className='flex flex-row gap-[22px] items-center text-gray-700 ' >
                                                                <div >
                                                                    <IconServiceFeeRange size={24} color="#98A2B3" />
                                                                </div>
                                                                <SelectValue defaultValue={field.value} placeholder="Service Fee Range" {...field} />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            SERVICE_FEE_RANGE.map((retainer, index) => {
                                                                return <SelectItem key={index} value={retainer.value}>
                                                                    {retainer.label}
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
                                <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 bg-gray-100">
                                    <IconPercent2 size={24} color="#98A2B3" />
                                    <FormField
                                        control={form.control}
                                        name="serviceFee"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses}`} placeholder="Service Fee" {...field} />
                                                </FormControl>
                                                <FormMessage />
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
                                        <DialogContent className="p-0">
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
                                                                        <FormItem>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                    <SelectTrigger className={commonClasses2}>
                                                                                        <SelectValue placeholder="Designation" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    {DESIGNATION.map((designation, index) => {
                                                                                        return <SelectItem value={designation.value} key={index}>
                                                                                            {designation.label}
                                                                                        </SelectItem>
                                                                                    })}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormItem>
                                                                    )} />
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
                                                                            <Popover>
                                                                                <PopoverTrigger asChild>
                                                                                    <FormControl>
                                                                                        <Button variant={"google"} className={`flex flex-row gap-2 ${commonClasses2}`} >
                                                                                            {COUNTRY_CODE.find((val) => val.value === field.value)?.value}
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
                                                                                                {COUNTRY_CODE.map((cc) => (
                                                                                                    <CommandItem
                                                                                                        value={cc.label}
                                                                                                        key={cc.label}
                                                                                                        onSelect={() => {
                                                                                                            console.log("contacts.std_code", cc.value)
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
                                                    <div className='flex flex-col border-[1px] border-gray-200 rounded-[8px] p-[16px] mb-[12px]' key={index} >
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
                                        {numberOfErrors} fields missing
                                    </span>
                                </div>}
                                <div className='flex flex-row flex-1 justify-end '>
                                    <Button variant="default" type="submit" >Save</Button>

                                </div>
                            </div>

                        </div>
                        <div className="w-[1px] bg-gray-200 "></div>

                        <div className='p-[24px] 2xl:w-3/4 w-6/12 h-full flex-1 flex flex-col'>
                            <div className='flex flex-row justify-end'>
                                <Button variant={'default'} className='flex flex-row gap-2' type='button' onClick={() => promoteToProspect()}>Promote to Prospect <IconArrowSquareRight size={20} /></Button>
                            </div>
                            <div className='flex flex-row'>
                                <div className='flex flex-col w-full mt-[24px]'>
                                    <Tabs defaultValue="account" className="w-full ">
                                        <TabsList className='w-full justify-start px-[24px]' >
                                            <IconLock size={24} />
                                            {tabs.map((tab) => {
                                                return <TabsTrigger disabled key={tab.value} value={tab.value} ><div className='text-sm font-semibold '>{tab.label}</div></TabsTrigger>
                                            })}
                                        </TabsList>
                                        {
                                            // tabs.map((tab) => {
                                            //     return <TabsContent key={tab.value} value={tab.value}>{`you are in ${tab.label} Tab`}.</TabsContent>
                                            // })
                                        }
                                    </Tabs>

                                </div>
                            </div>
                        </div>
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

    async function patchLeadData(leadData: Partial<PatchLead>, roleData: Partial<RoleDetails>) {

        const titleExisting = data.title?.split(" ").join("").split("-")

        let newTitle = null
        if (titleExisting) {
            let [orgName, region, role, numeric] = titleExisting
            if (orgName && roleData.region && roleData.role_type && numeric) {
                const regionAcronym = acronymFinder(roleData.region, REGION)
                const roleTypeAcronym = acronymFinder(roleData.role_type, ROLETYPE)
                newTitle = `${orgName} - ${regionAcronym} - ${roleTypeAcronym} - ${numeric}`
                leadData.title = newTitle
            }
        }


        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/lead/${data.id}/`, { method: "PATCH", body: JSON.stringify(leadData), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
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

    function requiredErrorComponent() {
        return <div className={`${requiredErrorClasses} flex flex-row gap-[5px] items-center`}>
            Required
            <IconRequiredError size={16} />
        </div>
    }

}


export default SideSheet
