import React, { useEffect, useState } from 'react'
import { IconAccounts, IconAlert, IconArrowSquareRight, IconBilling, IconBuildings, IconClosedBy, IconCoinsHand, IconContacts, IconCross, IconCurrencyDollars, IconDeal, IconEdit2, IconEsop, IconExclusitivity, IconGlobe, IconGst, IconIndustry, IconLeads, IconLocation, IconLock, IconOrgnaisation, IconPackage, IconPercent2, IconProfile, IconRequiredError, IconRetainerAdvance, IconRoles, IconSave, IconServiceFeeRange, IconShield, IconShipping, IconStackedCoins, IconStackedCoins2, IconStackedCoins3, IconTick, IconUserCheck, IconUsers, IconUsersSearch, IconWallet, Unverified } from '../icons/svgIcons'
import { IChildData } from './leads'
import { Button } from '../ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '../ui/form'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'
import { COUNTRY_CODE, CURRENCIES, DESIGNATION, DOMAINS, DUPLICATE_ERROR_MESSAGE_DEFAULT, EXCLUSIVITY, INDUSTRY, LAST_FUNDING_AMOUNT, LAST_FUNDING_STAGE, OWNERS, REGION, REGIONS, RETAINER_ADVANCE, ROLETYPE, SEGMENT, SERVICE_FEE_RANGE, SIDE_SHEET_TABS, SIDE_SHEET_TABS_ACCOUNTS, SIZE_OF_COMPANY, SOURCES, STATUSES, TIME_TO_FILL, TYPE } from '@/app/constants/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ClientGetResponse, Contact, ContactPostBody, DeepPartial, DuplicateError, IErrors, IValueLabel, LeadInterface, Organisation, PatchLead, PatchOrganisation, PatchRoleDetails, Permission, RoleDetails, User } from '@/app/interfaces/interface'
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
import { activeTabSideSheetClasses, commonClasses, commonClasses2, commonFontClasses, contactListClasses, disabledClasses, preFilledClasses, requiredErrorClasses, selectFormMessageClasses } from '@/app/constants/classes'
import { PopoverClose } from '@radix-ui/react-popover'
import { required_error } from './sideSheet'
import { toast } from '../ui/use-toast'
import { doesTypeIncludesMandatory, getIsContactDuplicate, handleKeyPress, handleOnChangeNumeric, handleOnChangeNumericReturnNull, toastContactAlreadyExists } from './commonFunctions'
import { getCookie } from 'cookies-next'
import SideSheetTabs from './sideSheetTabs/sideSheetTabs'

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

const FormSchema2Mod = z.object({
    name: z.string({
    }).min(2).max(30),
    designation: z.string({
    }).transform((val) => val === undefined ? undefined : val.trim()),
    type: z.string().transform((val) => val === undefined ? undefined : val.trim()),
    email: z.string({
    }).email(),
    phone: z.string().min(4).max(13),
    std_code: z.string({

    }),
    contactId: z.string().optional(),
})

const FormSchema2Optional = z.object({
    name: z.string({
    }).min(2).max(30),
    designation: z.string({
    }).transform((val) => val === undefined ? undefined : val.trim()),
    type: z.string().transform((val) => val === undefined ? undefined : val.trim()),
    email: z.string({
    }).email(),
    phone: z.string({
    }).min(10).max(10).optional().nullable(),
    std_code: z.string({}).optional(),
    contactId: z.string().optional(),
})
const FormSchema2ModOptional = z.object({
    name: z.string({
    }).min(2).max(30),
    designation: z.string({
    }).transform((val) => val === undefined ? undefined : val.trim()),
    type: z.string().transform((val) => val === undefined ? undefined : val.trim()),
    email: z.string({
    }).email(),
    phone: z.string().min(4).max(13).optional().nullable(),
    std_code: z.string({}).optional(),
    contactId: z.string().optional(),
})


const FormSchema = z.object({
    // creators: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one Creator.",
    // }),
    organisationName: z.string(required_error).min(1), // [x]
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
    segment: z.string().optional()
})


function SideSheetAccounts({ parentData, permissions }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction }, permissions: Permission }) {

    const [formSchema, setFormSchema] = useState<any>(FormSchema);
    const [numberOfErrors, setNumberOfErrors] = useState<IErrors>({
        invalidErrors: 0,
        requiredErrors: 0
    })
    const [rowState, setRowState] = useState<DeepPartial<ClientGetResponse>>()
    const [areContactFieldValid, setContactFieldValid] = useState<boolean>(false)
    const [editAccountNameClicked, setEditAccountNameClicked] = useState<boolean>(false);
    const [dummyContactData, setDummyContactData] = useState<any[]>([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [budgetKey, setBudgetKey] = React.useState<number>(+new Date())
    const [places, setPlaces] = React.useState([])
    const [beforePromoteToProspectDivsArray, setBeforePromoteToProspectDivsArray] = useState<any[]>([]);
    const [isVcIndustrySelected, setIsVcIndustrySelected] = useState<boolean>(false)
    const { childData: { row }, setChildDataHandler } = parentData
    const [isPhoneMandatory, setIsPhoneMandatory] = useState<boolean>(false)
    const [duplicateErrorMessage, setDuplicateErrorMessage] = useState<DuplicateError>(DUPLICATE_ERROR_MESSAGE_DEFAULT)
    const data: ClientGetResponse = row.original
    const [currentSidesheetTab, setCurrentSidesheetTab] = React.useState<string>(SIDE_SHEET_TABS_ACCOUNTS.ACCOUNT_ACTIVITY)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            organisationName: data.name,
            industry: labelToValue(data.industry || "", INDUSTRY),
            domain: undefined,
            size: undefined,
            lastFundingStage: undefined,
            lastFundingAmount: undefined,
            segment: labelToValue(data.segment || "", SEGMENT)
        },
        mode: "all"
    })


    useEffect(() => {
        console.log("sidesheetaccounts", data)
        setDummyContactData(data.contacts)
        form.setValue("domain", labelToValue(data.domain || "", DOMAINS))
        form.setValue("size", labelToValue(data.size || "", SIZE_OF_COMPANY))
        form.setValue("lastFundingStage", labelToValue(data.last_funding_stage || "", LAST_FUNDING_STAGE))
        form.setValue("lastFundingAmount", labelToValue(data.last_funding_amount?.toString() || "", LAST_FUNDING_AMOUNT))
        form.setValue("billingAddress", data.billing_address || "")
        form.setValue("shippingAddress", data.shipping_address || "")
        form.setValue("registeredName", data.registered_name || "")
        form.setValue("gstinVatGstNo", data.govt_id || "")
        checkVcIndutsry()
        setRowState({
            name: data.name
        })
        updateFormSchema()
    }, [])


    useEffect(() => {
        if (addDialogOpen) {
            updateFormSchema()
            resetForm2()
        }
        safeparse2()
    }, [addDialogOpen])

    function checkVcIndutsry() {
        const industry = form.getValues("industry")
        if (industry === "vc_pe") {
            setIsVcIndustrySelected(true)
            form.setValue("lastFundingStage", undefined)
            form.setValue("lastFundingAmount", undefined)
            form.setValue("domain", undefined)
            form.setValue("size", undefined)
            form.setValue("segment", undefined)
        } else {
            setIsVcIndustrySelected(false)
        }
        updateFormSchema()
    }

    function updateFormSchema(type: string | undefined = undefined) {
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
        console.log("updatedSchema", updatedSchema, FormSchema)
        if (addDialogOpen) {
            const std_code = form.getValues("contacts.std_code")
            const isMandatory = type ? doesTypeIncludesMandatory(type) : false
            if (type) {
                setIsPhoneMandatory(isMandatory)
            }
            if (isMandatory) {
                if (std_code !== "+91" && std_code !== "+1") {
                    updatedSchema = updatedSchema.extend({
                        contacts: FormSchema2Mod
                    })
                } else {
                    updatedSchema = updatedSchema.extend({
                        contacts: FormSchema2
                    })
                }
            } else {
                if (std_code !== "+91" && std_code !== "+1") {
                    updatedSchema = updatedSchema.extend({
                        contacts: FormSchema2ModOptional
                    })
                } else {
                    updatedSchema = updatedSchema.extend({
                        contacts: FormSchema2Optional
                    })
                }
            }
            if (type) {
                const phone = form.getValues("contacts.phone")
                if (!phone) {
                    if (isMandatory) {
                        form.setValue("contacts.phone", '')
                    } else {
                        form.setValue("contacts.phone", null)
                    }
                }
            }
        } else {
            updatedSchema = updatedSchema.omit({ contacts: true })
        }
        console.log("updatedSchema", updatedSchema)
        setFormSchema(updatedSchema)
    }

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

    function closeSideSheet() {
        setChildDataHandler('row', undefined)
    }

    const LabelIcon = () => {
        const d = LAST_FUNDING_STAGE.find((val) => val.label === data.last_funding_stage)

        return <>{d && <d.icon />}</>
    }


    useEffect(() => {
        if (addDialogOpen) {
            safeparse2()
            console.log("formSchema safeparse", formSchema)
        }
    }, [formSchema])


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
        let result
        if (isPhoneMandatory) {
            if (contacts?.std_code !== "+91" && contacts?.std_code !== "+1") {
                result = FormSchema2Mod.safeParse(contacts)
            } else {
                result = FormSchema2.safeParse(contacts)
            }
        } else {
            if (contacts?.std_code !== "+91" && contacts?.std_code !== "+1") {
                result = FormSchema2ModOptional.safeParse(contacts)
            } else {
                result = FormSchema2Optional.safeParse(contacts)
            }
        }
        console.log("safe prase 2 ", result)
        if (result.success) {
            setContactFieldValid(true)
        } else {
            setContactFieldValid(false)
        }
    }

    function yesDiscard(): void {
        setAddDialogOpen(false)
        resetForm2()
    }

    function resetForm2() {
        form.setValue("contacts.name", "")
        form.setValue("contacts.phone", "")
        form.setValue("contacts.email", "")
        form.setValue("contacts.std_code", "+91")
        form.setValue("contacts.designation", undefined)
        form.setValue("contacts.type", undefined)
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
    const token_superuser = getCookie("token")

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
            { name: "lastFundingStage", label: "Last Funding Round" },
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

        const orgData: Partial<PatchOrganisation> = {
            name: form.getValues("organisationName"),
            industry: valueToLabel(form.getValues("industry") || "", INDUSTRY),
            domain: valueToLabel(form.getValues("domain") || "", DOMAINS) || "",
            size: valueToLabel(form.getValues("size") || "", SIZE_OF_COMPANY) || "",
            last_funding_stage: valueToLabel(form.getValues("lastFundingStage") || "", LAST_FUNDING_STAGE) || "",
            last_funding_amount: valueToLabel(form.getValues("lastFundingAmount") || "", LAST_FUNDING_AMOUNT) || "",
            segment: LAST_FUNDING_STAGE.find((stage) => form.getValues("lastFundingStage") === stage.value)?.acronym || "",
            billing_address: form.getValues("billingAddress") || "",
            shipping_address: form.getValues("shippingAddress") || "",
            govt_id: form.getValues("gstinVatGstNo") || "",
            registered_name: form.getValues("registeredName") || ""

        }

        console.log("datatosend", orgData)

        const orgId = data.id

        patchOrgData(orgId, orgData)

        // try {
        //     const results = await Promise.all(apiPromises);
        //     console.log("All API requests completed:", results);
        //     closeSideSheet()
        // } catch (error) {
        //     console.error("Error fetching data:", error);
        // }

    }

    function onSubmit() {
        console.log("submitted")
        // safeprs()
        console.log(numberOfErrors)
        patchData()
    }



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

    useEffect(() => {
        if (watcher.contacts?.std_code?.length > 0) {
            updateFormSchema()
            console.log("status code watcher", form.getFieldState("contacts"))

        }
    }, [watcher.contacts?.std_code])




    function discardAccountName() {
        setEditAccountNameClicked(false)
    }

    async function updateAccountName() {
        // /v1/api/client/2/org_name/
        const orgName = form.getValues("organisationName")
        const orgId = data.id
        const dataToSend = {
            name: orgName
        }
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/${orgId}/org_name/`, { method: "PATCH", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            console.log(result)
            if (result.status == "1") {
                toast({
                    title: "Account Name Updated Successfully!",
                    variant: "dark"
                })
                setRowState((prevState) => {
                    return {
                        ...prevState,
                        name: orgName
                    }
                })
                setEditAccountNameClicked(false)
            } else {
                if (result?.error?.message.includes("No change in Name detected")) {
                    toast({
                        title: "No Change in Name Detected!",
                        variant: "destructive"
                    })

                } else {
                    toast({
                        title: "Api failure!",
                        variant: "destructive"
                    })
                }
            }
            // if (result.status == "1") {
            //     const { data: { segment } } = result
            //     console.log(data)
            //     setRowState((prevState) => {
            //         return {
            //             ...prevState,
            //             organisation: {
            //                 ...prevState?.organisation,
            //                 segment: segment
            //             }
            //         }
            //     })
            // }
        }
        catch (err) {
            console.log("error", err)
        }

    }

    async function addContact() {
        const finalData = form.getValues().contacts
        const ftype = TYPE.find((role) => role.value === finalData.type)?.label
        const fDesignation = DESIGNATION.find((des) => des.value === finalData.designation)?.label
        delete finalData["contactId"]
        const orgId = data.id
        let phone = form.getValues("contacts.phone")
        let std_code = form.getValues("contacts.std_code")
        if (!isPhoneMandatory && !phone) {
            phone = ""
            std_code = ""
        }
        const dataToSend: ContactPostBody = {
            ...finalData, type: ftype, designation: fDesignation, organisation: orgId, phone, std_code
        }

        const res = await getIsContactDuplicate(finalData.email, `${std_code}-${phone}`)

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
            try {
                const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/`, { method: "POST", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
                const result = await dataResp.json()
                console.log(result)

                if (result.status == "1") {
                    setAddDialogOpen(false)
                    resetForm2()
                    toast({
                        title: "Contact Added Successfully!",
                        variant: "dark"
                    })
                    setDummyContactData((prevValues: any) => {
                        const list = [{ ...result.data }, ...prevValues]
                        return list
                    })
                } else {
                    toast({
                        title: "Api Error!",
                        variant: "destructive"
                    })
                }

            } catch (err) {
                console.log(err)
            }
        }





        console.log("finalData", dataToSend)
        // setAddDialogOpen(false)
        // resetForm2()
    }

    return (
        <div className={`fixed flex flex-row z-[50] right-0 top-0 h-[100vh] w-[100vw] `} >
            <div className='w-full bg-gray-900 opacity-70 backdrop-blur-[8px] fade-in' onClick={closeSideSheet}>

            </div>
            <div className='absolute right-0 top-0 bottom-0 w-11/12 bg-white-900 opacity-100 slide-left'>
                <div className='absolute top-0 right-[100%] bg-white-900 p-[16px] rounded-l-[8px] cursor-pointer' onClick={closeSideSheet} >
                    <IconCross size={20} color={"#667085"} />
                </div>
                <div className='w-full h-full flex flex-row '>
                    <div className='relative  2xl:w-1/4 w-4/12 h-full flex flex-col '>
                        <Form {...form} >
                            <form className='w-full h-full flex flex-row ' onSubmitCapture={preprocess} onSubmit={form.handleSubmit(onSubmit)}>
                                <div className='relative pt-[24px] w-full h-full flex flex-col '>
                                    <div className='flex flex-col flex-1 overflow-y-auto  pr-[0px] '>
                                        <div className='sticky top-0 bg-white-900 z-50'>
                                            {!editAccountNameClicked ? <div className='px-[24px] flex flex-row items-center justify-between'>
                                                <div className=' text-gray-900 text-xl font-semibold '>
                                                    {rowState?.name}
                                                </div>
                                                {permissions?.change && <div className='cursor-pointer' onClick={() => setEditAccountNameClicked(true)}>
                                                    <IconEdit2 size={24} />
                                                </div>}
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

                                                        <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] ${!form.getFieldState("organisationName").error ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`} onClick={() => !form.getFieldState("organisationName").error && updateAccountName()}>
                                                            <IconTick size={20} />
                                                            <span className='text-gray-600 text-xs font-semibold'>Save</span>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {!isVcIndustrySelected && <div className="px-[16px] mt-[24px] text-md font-medium w-full flex flex-row ">
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
                                                                    <SelectTrigger disabled className={`border-gray-300 ${commonClasses}`}>
                                                                        <SelectValue defaultValue={field.value} placeholder="Segment" />
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

                                            </div>}
                                        </div>

                                        <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                            <span className='font-bold'>Account Details</span>
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
                                        <div className="pl-[6px] pr-[4px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                            <FormField
                                                control={form.control}
                                                name="industry"
                                                render={({ field }) => (
                                                    <FormItem className='w-full cursor-pointer'>
                                                        <Popover>
                                                            <PopoverTrigger asChild >
                                                                <div className='flex  pl-[12px] py-[8px] mb-[8px]  flex-row gap-[8px] items-center  ' >
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
                                                                    <div className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                        <div className={`w-full flex-1 text-align-left text-md flex  ${commonClasses} ${commonFontClasses}`}>
                                                                            {INDUSTRY.find((val) => val.value === field.value)?.label || <span className={`text-muted-foreground `} >Industry</span>}
                                                                        </div>
                                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                    </div>
                                                                </div>

                                                            </PopoverTrigger>
                                                            <PopoverContent className={`mt-[2px] p-0 w-[calc(32vw-6px)]`}>
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
                                                        {!form.getValues("industry") && <FormMessage className={selectFormMessageClasses} />}

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
                                                        <Select disabled={isVcIndustrySelected} onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`border-none mb-2   ${commonFontClasses} ${isVcIndustrySelected && disabledClasses} `}>
                                                                    <div className='flex flex-row gap-[22px] items-center ' >
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
                                                        <Select disabled={isVcIndustrySelected} onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`border-none mb-2 ${commonFontClasses} ${isVcIndustrySelected && disabledClasses}`}>
                                                                    <div className='flex flex-row gap-[22px] items-center  ' >
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
                                        <div className="pl-[6px] pr-[4px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                            <FormField
                                                control={form.control}
                                                name="lastFundingStage"
                                                render={({ field }) => (
                                                    <FormItem className='w-full cursor-pointer'>
                                                        <Popover >
                                                            <PopoverTrigger asChild disabled={isVcIndustrySelected}>
                                                                <div className={`flex  pl-[12px] py-[8px] mb-[8px]  flex-row gap-[8px] items-center  ${isVcIndustrySelected ? `${disabledClasses} cursor-not-allowed ` : ""}`}  >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div>
                                                                                    <IconCoinsHand size={24} color="#98A2B3" />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                Last Funding Round
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                    <div className={`flex  flex-row gap-2 w-full px-[14px] `}>
                                                                        <div className={`w-full flex-1 text-align-left text-md flex  ${commonClasses} ${commonFontClasses} `}>
                                                                            {LAST_FUNDING_STAGE.find((val) => val.value === field.value)?.label || <span className={isVcIndustrySelected ? `${disabledClasses} text-gray-400` : "text-muted-foreground"} >Last Funding Round</span>}
                                                                        </div>
                                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                    </div>
                                                                </div>

                                                            </PopoverTrigger>
                                                            {!isVcIndustrySelected && <PopoverContent className={`mt-[2px] p-0 w-[calc(32vw-6px)]`}  >
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
                                                                                        form.setValue("lastFundingStage", lastFundingStage.value, { shouldDirty: true, shouldValidate: true })
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
                                                        {!form.getValues("lastFundingStage") && <FormMessage className={selectFormMessageClasses} />}
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
                                                        <Select disabled={isVcIndustrySelected} onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`border-none mb-2 ${commonFontClasses} ${isVcIndustrySelected && `${disabledClasses}  `}`}>
                                                                    <div className='flex flex-row gap-[22px] items-center  ' >
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
                                            <span className='font-bold'>Contact Details</span>
                                            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                                                <DialogTrigger>
                                                    <span className={`text-sm text-purple-700 opacity-[1] cursor-pointer`} >
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
                                                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
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
                                                                                                                <PopoverClose asChild>
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
                                                                    <div className='flex flex-col w-full'>
                                                                        <FormField
                                                                            control={form.control}
                                                                            name="contacts.type"
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <Select onValueChange={(val) => {
                                                                                        updateFormSchema(val)
                                                                                        return field.onChange(val)
                                                                                    }} defaultValue={field.value}>
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
                                                                {duplicateErrorMessage?.email && <div className='text-error-500 text-sm font-normal'>
                                                                    Email ID is linked to another contact

                                                                </div>}
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
                                                                                                                    form.setValue("contacts.std_code", cc.value)
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
                                                                            name="contacts.phone"
                                                                            render={({ field }) => (
                                                                                <FormControl>
                                                                                    <Input type="text" className={`mt-3 w-full ${commonClasses2}`} placeholder={`Phone No ${!isPhoneMandatory ? "(Optional)" : ""}`} {...field}
                                                                                        onKeyPress={handleKeyPress}
                                                                                        onChange={event => {
                                                                                            const std_code = form.getValues("contacts.std_code")
                                                                                            const is13Digits = std_code != "+91" && std_code != "-1"
                                                                                            return handleOnChangeNumericReturnNull(event, field, false, isPhoneMandatory, is13Digits ? 13 : 10)
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            )} />
                                                                    </div>
                                                                </div>
                                                                {duplicateErrorMessage?.phone && <div className='text-error-500 text-sm font-normal'>
                                                                    Phone Number is linked to another contact

                                                                </div>}
                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div>
                                                        <Separator className="bg-gray-200 h-[1px]  mt-8" />
                                                        <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                                                            <Button variant={"google"} onClick={() => yesDiscard()}>Cancel</Button>
                                                            <Button type='button' disabled={!permissions?.change || !areContactFieldValid} onClick={() => addContact()}>
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

                                        <div className='flex flex-row flex-1 justify-end '>
                                            <Button variant="default" type="submit" disabled={!form.formState.isDirty || !permissions?.change}>Save</Button>

                                        </div>
                                    </div>

                                </div>
                                <div className="w-[1px] bg-gray-200 "></div>

                            </form>
                        </Form>
                    </div>
                    <div className="w-[1px] bg-gray-200 "></div>
                    <div className='pt-[24px]  2xl:w-3/4 w-8/12 h-full flex-1 flex flex-col'>
                        <div className='flex px-[24px] flex-row justify-between w-full gap-[20px]'>
                            <div className='flex flex-row gap-[16px]'>
                                {
                                    Object.keys(SIDE_SHEET_TABS_ACCOUNTS).map((tab) => {
                                        const tabName = SIDE_SHEET_TABS_ACCOUNTS[tab]
                                        return <>
                                            <div className={`p-[12px] cursor-pointer  text-sm font-semibold  ${currentSidesheetTab === tabName && activeTabSideSheetClasses}`} onClick={() => setCurrentSidesheetTab(tabName)}>
                                                {tabName}
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                            <div className='flex flex-row gap-[20px]'>
                                

                            </div>
                        </div>
                        <div className='px-[24px] pb-[24px] flex flex-row bg-gray-50 flex-1 border-t-[1px] border-gray-200 overflow-y-auto overflow-x-hidden '>
                            <SideSheetTabs isAccounts={true} currentParentTab={currentSidesheetTab} contactFromParents={dummyContactData} entityId={data.id} permissions={permissions} disable={{ proposal: true, requirementDeck: true }} />
                        </div>
                    </div>
                </div>

            </div>
        </div>


    )


    async function patchOrgData(orgId: number, orgData: Partial<PatchOrganisation>) {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/${orgId}/`, { method: "PATCH", body: JSON.stringify(orgData), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            console.log(result)
            if (result.status == "1") {
                toast({
                    title: "Account Details Updated Successfully!",
                    variant: "dark"
                })
            } else {
                toast({
                    title: "Api failure!",
                    variant: "destructive"
                })
            }
            // if (result.status == "1") {
            //     const { data: { segment } } = result
            //     console.log(data)
            //     setRowState((prevState) => {
            //         return {
            //             ...prevState,
            //             organisation: {
            //                 ...prevState?.organisation,
            //                 segment: segment
            //             }
            //         }
            //     })
            // }
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
