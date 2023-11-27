import React, { useEffect, useState } from 'react'
import { IconAccounts, IconAlert, IconArrowSquareRight, IconBilling, IconBuildings, IconCheckCircle, IconClock, IconClosedBy, IconCoinsHand, IconContacts, IconCross, IconCurrencyDollars, IconDeal, IconEquityFee, IconEsop, IconExclusitivity, IconFlatFee, IconGlobe, IconGst, IconIndustry, IconLeads, IconLocation, IconLock, IconOrgnaisation, IconPackage, IconPercent2, IconProfile, IconRequiredError, IconRetainerAdvance, IconRoles, IconSave, IconServiceFeeRange, IconShield, IconShipping, IconStackedCoins, IconStackedCoins2, IconStackedCoins3, IconTick, IconUserCheck, IconUsers, IconUsersSearch, IconWallet, Unverified } from '../icons/svgIcons'
import { IChildData } from './leads'
import { Button } from '../ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '../ui/form'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'
import { BUDGET_RANGE, COUNTRY_CODE, CURRENCIES, DESIGNATION, DOMAINS, EXCLUSIVITY, INDUSTRY, LAST_FUNDING_AMOUNT, LAST_FUNDING_STAGE, OWNERS, REGION, REGIONS, RETAINER_ADVANCE, ROLETYPE, SEGMENT, SERVICE_FEE_RANGE, SIZE_OF_COMPANY, SOURCES, PROSPECT_STATUSES, TIME_TO_FILL, TYPE, CLOSEDBY, SET_VALUE_CONFIG, SIDE_SHEET_TABS, DUPLICATE_ERROR_MESSAGE_DEFAULT } from '@/app/constants/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Contact, IValueLabel, LeadInterface, Organisation, PatchLead, PatchOrganisation, PatchRoleDetails, PatchProspect, ProspectsGetResponse, RoleDetails, User, Permission, IErrors, DeepPartial, ContactPostBody, DuplicateError } from '@/app/interfaces/interface'
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
import { activeTabSideSheetClasses, commonClasses, commonClasses2, commonFontClasses, contactListClasses, disabledClasses, inputFormMessageClassesWithSelect, popoverSidesheetWidthClasses, preFilledClasses, requiredErrorClasses, selectFormMessageClasses } from '@/app/constants/classes'
import { PopoverClose } from '@radix-ui/react-popover'
import { required_error } from './sideSheet'
import { convertLocalStringToNumber, doesTypeIncludesMandatory, fetchUserDataList, getIsContactDuplicate, handleOnChangeNumeric, handleOnChangeNumericReturnNull, toastContactAlreadyExists } from './commonFunctions'
import { toast, useToast } from '../ui/use-toast'
import { getCookie } from 'cookies-next'
import SideSheetTabs from './sideSheetTabs/sideSheetTabs'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'


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
    owners: z.string(), // [x]
    regions: z.string(), // [x]
    sources: z.string(),
    statuses: z.string(),
    reasons: z.string().optional(),
    role: z.string(), // [x]
    budget: z.string(), // [x]
    closedBy: z.string().optional(),
    fulfilledBy: z.string().optional(),
    locations: z.string(required_error).min(1, { message: required_error.required_error }), // [x]
    fixedCtcBudget: z.string(required_error).min(1, { message: required_error.required_error }), // [x]
    fixedCtcBudgetCurrency: z.string().optional(),
    dealValue: z.string().optional(),
    orgnaisationName: z.string(), // [x]
    registeredName: z.string().optional(),
    industry: z.string(required_error).min(1, { message: required_error.required_error }), // [x]
    domain: z.string().optional(), // [x]
    size: z.string().optional(), // [x]
    lastFundingStage: z.string().optional(), // [x]
    lastFundingAmount: z.string().optional(), // [x]
    shippingAddress: z.string().optional(),
    billingAddress: z.string().optional(),
    exclusivity: z.string(required_error).min(1, { message: required_error.required_error }),
    serviceFeeRange: z.string(required_error).min(1, { message: required_error.required_error }),
    serviceFee: z.string().optional(),
    retainerAdvance: z.string(required_error).min(1, { message: required_error.required_error }),
    esopRsusUl: z.string().optional(),
    esopRsusUlCurrency: z.string().optional(),
    fixedBudgetUl: z.string(required_error).min(1, { message: required_error.required_error }),
    fixedBudgetUlCurrency: z.string().optional(),
    timeToFill: z.string(required_error).min(1, { message: required_error.required_error }),
    gstinVatGstNo: z.string().optional(),
    contacts: z.string().optional(),
    equityFee: z.string().optional(),
    equityFeeCurrency: z.string().optional(),
    flatFee: z.string().optional(),
    flatFeeCurrency: z.string().optional(),
    feeType: z.string().optional()
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



function SideSheetProspects({ parentData, permissions }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction }, permissions: Permission }) {

    const [formSchema, setFormSchema] = useState<any>(FormSchema);
    const [numberOfErrors, setNumberOfErrors] = useState<IErrors>({
        invalidErrors: 0,
        requiredErrors: 0
    })
    const [userList, setUserList] = useState<IValueLabel[]>()
    const [areContactFieldValid, setContactFieldValid] = useState<boolean>(false)
    const [isPromoteToDealClicked, setPromoteToDealClicked] = useState<boolean>(false)
    const [isPromoteToDealErorrs, setPromoteToDealErrors] = useState<boolean>(false)
    const [isVcIndustrySelected, setIsVcIndustrySelected] = useState<boolean>(false)
    const [showContactForm, setShowContactForm] = useState(true)
    const [dummyContactData, setDummyContactData] = useState<any[]>([])
    const [showErrors, setShowErrors] = useState<boolean>(false)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [budgetKey, setBudgetKey] = React.useState<number>(+new Date())
    const [places, setPlaces] = React.useState([])
    const [currentSidesheetTab, setCurrentSidesheetTab] = React.useState<string>(SIDE_SHEET_TABS.DEAL_FLOW)
    const [beforePromoteToProspectDivsArray, setBeforePromoteToProspectDivsArray] = useState<any[]>([]);
    // used for handling on side sheet open and result from api as side sheet is not been closed when clicked on save (usage: promote to prospect)
    const [rowState, setRowState] = useState<DeepPartial<ProspectsGetResponse>>()
    const { childData: { row }, setChildDataHandler } = parentData
    const [isPhoneMandatory, setIsPhoneMandatory] = useState<boolean>(false)
    const [duplicateErrorMessage, setDuplicateErrorMessage] = useState<DuplicateError>(DUPLICATE_ERROR_MESSAGE_DEFAULT)
    const data: ProspectsGetResponse = row.original
    const [isServiceRadioSelected, setIsServiceRadioSelected] = useState<boolean>(data.lead.service_fee ? true : data.lead.flat_fee ? false : true)

    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            regions: data.lead.role?.region,
            sources: data.lead.source || "",
            statuses: labelToValue(data.status, PROSPECT_STATUSES),
            owners: undefined,
            role: data.lead.role?.role_type,
            budget: labelToValue(data.lead.role?.budget_range, BUDGET_RANGE[labelToValue(data.lead.role?.region, REGIONS) || ""]),
            locations: data.lead.role.location ? data.lead.role.location : undefined,
            fixedCtcBudget: parseCurrencyValue(data.lead.role.fixed_budget || "")?.getNumericValue() || undefined,
            fixedBudgetUl: parseCurrencyValue(data.lead.role.fixed_budget_ul || "")?.getNumericValue() || undefined,
            esopRsusUl: parseCurrencyValue(data.lead.role.esop_rsu || "")?.getNumericValue() || undefined,
            orgnaisationName: data.lead.organisation.name,
            industry: labelToValue(data.lead.organisation.industry || "", INDUSTRY),
            domain: undefined,
            size: undefined,
            lastFundingStage: undefined,
            lastFundingAmount: undefined,
            retainerAdvance: data.lead.retainer_advance === true ? "yes" : data.lead.retainer_advance === false ? "no" : undefined,
            exclusivity: data.lead.exclusivity === true ? "yes" : data.lead.exclusivity === false ? "no" : undefined,
            serviceFeeRange: labelToValue(data.lead.service_fee_range || "", SERVICE_FEE_RANGE),
            timeToFill: labelToValue(data.lead.role.time_To_fill || "", TIME_TO_FILL),
            reasons: data.reason || undefined,
            fixedCtcBudgetCurrency: parseCurrencyValue(data.lead.role.fixed_budget || "")?.getCurrencyCode() || "INR",
            fixedBudgetUlCurrency: parseCurrencyValue(data.lead.role.fixed_budget_ul || "")?.getCurrencyCode() || "INR",
            esopRsusUlCurrency: parseCurrencyValue(data.lead.role.esop_rsu || "")?.getCurrencyCode() || "INR",
            flatFeeCurrency: parseCurrencyValue(data.lead.flat_fee || "")?.getCurrencyCode() || "INR",
            equityFeeCurrency: parseCurrencyValue(data.lead.equity_fee || "")?.getCurrencyCode() || "INR",
            registeredName: data.lead.organisation.registered_name || "",
            billingAddress: data.lead.organisation.billing_address || "",
            shippingAddress: data.lead.organisation.shipping_address || "",
            gstinVatGstNo: data.lead.organisation.govt_id || "",
            // serviceFee: data.lead.service_fee || "",
            // flatFee: parseCurrencyValue(data.lead.flat_fee || "")?.getNumericValue() || undefined,
            serviceFee: "",
            flatFee: "",
            equityFee: parseCurrencyValue(data.lead.equity_fee || "")?.getNumericValue() || undefined,

        },
        mode: "all"
    })

    useEffect(() => {
        setRowState({
            status: data.status,
            lead: {
                organisation: {
                    segment: data.lead.organisation.segment
                }
            }
        })
        setDummyContactData(data.lead.organisation.contacts)
        const status = labelToValue(data.status, PROSPECT_STATUSES)
        if (status) {
            updateFormSchemaOnStatusChange(status, false)
        }
        if (form.getValues("industry") === "vc_pe") {
            setIsVcIndustrySelected(true)
        }
        form.setValue("reasons", data.reason || undefined)
        form.setValue("budget", labelToValue(data.lead.role?.budget_range, BUDGET_RANGE[labelToValue(data.lead.role?.region, REGIONS) || ""]))
        form.setValue("domain", labelToValue(data.lead.organisation.domain || "", DOMAINS))
        form.setValue("size", labelToValue(data.lead.organisation.size || "", SIZE_OF_COMPANY))
        form.setValue("lastFundingStage", labelToValue(data.lead.organisation.last_funding_stage || "", LAST_FUNDING_STAGE))
        form.setValue("lastFundingAmount", labelToValue(data.lead.organisation.last_funding_amount?.toString() || "", LAST_FUNDING_AMOUNT))
        form.setValue("owners", data?.owner?.id?.toString() || "")
        form.setValue("serviceFee", data.lead.service_fee || "")
        form.setValue("flatFee", parseCurrencyValue(data.lead.flat_fee || "")?.getNumericValue() || undefined)

        getUserList()
        console.log("isServiceRadioSelected", isServiceRadioSelected, data.lead.service_fee, data.lead.flat_fee, data.lead.service_fee ? data.lead.flat_fee ? false : true : true)
    }, [])


    function closeSideSheet() {
        setChildDataHandler('row', undefined)
    }

    const LabelIcon = () => {
        // const d = LAST_FUNDING_STAGE.find((val) => val.label === data.organisation.last_funding_stage)
        const d = SEGMENT.find(val => val.label === data.lead.organisation.segment)
        return <>{d && <d.icon />}</>
    }



    const watcher = form.watch()



    useEffect(() => {
        const status = labelToValue(form.getValues("statuses"), PROSPECT_STATUSES)
        if (status) {
            updateFormSchemaOnStatusChange(status)
        }
        if (addDialogOpen) {
            resetForm2()
        }
        safeparse2()
    }, [addDialogOpen])

    useEffect(() => {
        safeparse2()

    }, [watcher])

    const reasonMap: any = {
        "disqualified": ["Cash Component Reduced", "No Retainer Advance", "Service Fee Reduced", "No Exclusivity"],
        "lost": ["Lost to Competition", "Internal Hiring"],
        "deferred": ["On Interim Hold", "Requirements Changed"]
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

    async function addContact() {
        const finalData = form.getValues().contacts
        const ftype = TYPE.find((role) => role.value === finalData.type)?.label
        const fDesignation = DESIGNATION.find((des) => des.value === finalData.designation)?.label
        delete finalData["contactId"]
        const orgId = data.lead.organisation.id
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
        const subscription = form.watch(() => {
            safeparse2()
            setShowErrors(false)
            // console.log("showErrors setter", false)
        }
        )
        return () => subscription.unsubscribe()
    }, [form.watch])

    function labelToValue(lookup: string, arr: IValueLabel[]) {
        return arr.find((item) => item.label === lookup)?.value
    }
    function valueToLabel(lookup: string, arr: IValueLabel[]) {
        return arr.find((item) => item.value === lookup)?.label
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getCookie("token")

    async function promoteToDeal() {
        setPromoteToDealClicked(true)
        setShowErrors(true)
        console.log("showErrors setter", true)
        const status = rowState?.status
        if (status) {
            updateFormSchemaOnStatusChange(status, true)
        }


        // const beforePromoteToProspectDivsArray: any[] = fieldsNeccessary.map((field) => {
        //     const isMissing = missingFields.some((missingField) => missingField.name === field.name);
        //     const icon = isMissing ? <MinusCircleIcon size={20} color="red" /> : <CheckCircle2 size={20} color="#17B26A" />

        //     return (
        //         <div className={`flex text-md flex-row gap-[8px] items-center {${isMissing ? "" : "font-normal opacity-[0.7]"}`} key={field.name}>
        //             {icon}
        //             <span className={`${isMissing ? "font-semibold text-gray-900 " : "font-normal opacity-[0.7]"}`}>{field.label}</span>
        //         </div>
        //     );
        // });
        // if (missingFields.length > 0 && beforePromoteToProspectDivsArray.length > 0) {
        //     setBeforePromoteToProspectDivsArray(beforePromoteToProspectDivsArray);
        // } else {
        //     setBeforePromoteToProspectDivsArray([]);
        //     try {
        //         const dataResp = await fetch(`${baseUrl}/v1/api/lead/${data.id}/promote/`, { method: "PATCH", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
        //         const result = await dataResp.json()
        //         if (result.message === "success") {
        //             // closeSideSheet()
        //         }
        //     }
        //     catch (err) {
        //         console.log("error", err)
        //     }
        // }



    }

    async function patchData() {

        setNumberOfErrors({ invalidErrors: 0, requiredErrors: 0 })
        const finalContactData = dummyContactData.filter((contact) => !contact.id)
        let keysToRemove: any = ["contactId", "isLocallyAdded",]
        finalContactData.forEach((item) => {
            keysToRemove.forEach((key: string) => {
                if (key in item) {
                    delete item[key];
                }
            });
        })

        const statusToSend = valueToLabel(form.getValues("statuses"), PROSPECT_STATUSES)
        const reasonToSend = ["deferred", "lost", "disqualified"].includes(form.getValues("statuses")) ? form.getValues("reasons") : ""


        const leadData: Partial<PatchLead> = {
            retainer_advance: form.getValues("retainerAdvance")?.toLowerCase() === "yes" ? true : form.getValues("retainerAdvance")?.toLowerCase() === "no" ? false : null,
            exclusivity: form.getValues("exclusivity")?.toLowerCase() === "yes" ? true : form.getValues("exclusivity")?.toLowerCase() === "no" ? false : null,
            service_fee_range: valueToLabel(form.getValues("serviceFeeRange") || "", SERVICE_FEE_RANGE),
            // owner: valueToLabel(form.getValues("owners"), OWNERS),
            equity_fee: form.getValues("equityFee") ? `${form.getValues("equityFeeCurrency")} ${form.getValues("equityFee")}` : null,
        }
        if (isServiceRadioSelected) {
            leadData["service_fee"] = form.getValues("serviceFee") || null
            leadData["flat_fee"] = null
        } else {
            leadData["flat_fee"] = form.getValues("flatFee") ? `${form.getValues("flatFeeCurrency")} ${form.getValues("flatFee")}` : null,
            leadData["service_fee"] = null
        }

        const prospectData: Partial<PatchProspect> = {
            reason: reasonToSend || null,
            status: statusToSend,
            owner: Number(form.getValues("owners")) || null
            // lead: leadData
            // owner: valueToLabel(form.getValues("owners"), OWNERS)
        }
        const orgData: Partial<PatchOrganisation> = {
            name: form.getValues("orgnaisationName"),
            industry: valueToLabel(form.getValues("industry") || "", INDUSTRY),
            domain: valueToLabel(form.getValues("domain") || "", DOMAINS),
            size: valueToLabel(form.getValues("size") || "", SIZE_OF_COMPANY),
            last_funding_stage: valueToLabel(form.getValues("lastFundingStage") || "", LAST_FUNDING_STAGE),
            last_funding_amount: valueToLabel(form.getValues("lastFundingAmount") || "", LAST_FUNDING_AMOUNT),
            segment: LAST_FUNDING_STAGE.find((stage) => form.getValues("lastFundingStage") === stage.value)?.acronym,
            registered_name: form.getValues("registeredName"),
            billing_address: form.getValues("billingAddress"),
            shipping_address: form.getValues("shippingAddress"),
            govt_id: form.getValues("gstinVatGstNo")
        }
        const region = valueToLabel(form.getValues("regions"), REGIONS)
        const roleDetailsData: Partial<PatchRoleDetails> = {
            // role_type: valueToLabel(form.getValues("role"), ROLETYPE),
            // region: region,
            location: form.getValues("locations"),
            budget_range: valueToLabel(form.getValues("budget"), BUDGET_RANGE[labelToValue(form.getValues("regions"), REGIONS) || ""]),
            fixed_budget: form.getValues("fixedCtcBudget") ? `${form.getValues("fixedCtcBudgetCurrency")} ${form.getValues("fixedCtcBudget")}` : null,
            fixed_budget_ul: form.getValues("fixedBudgetUl") ? `${form.getValues("fixedBudgetUlCurrency")} ${form.getValues("fixedBudgetUl")}` : null,
            esop_rsu: form.getValues("esopRsusUl") ? `${form.getValues("esopRsusUlCurrency")} ${form.getValues("esopRsusUl")}` : null,
            time_To_fill: valueToLabel(form.getValues("timeToFill") || "", TIME_TO_FILL)
        }

        const contactToSend: Contact[] = finalContactData.map((val) => {
            val.organisation = data.lead.organisation.id
            val.archived = false
            return val
        })
        const contacts: Contact[] = contactToSend

        const orgId = data.lead.organisation.id
        const roleId = data.lead.role.id
        const prospectId = data.id
        const leadId = data.lead.id


        const apiPromises = [
            patchOrgData(orgId, orgData),
            patchRoleData(roleId, roleDetailsData),
            // patchContactData(contacts),
            patchProspectData(prospectId, prospectData),
            patchLeadData(leadData, roleDetailsData)
        ]

        try {
            const results = await Promise.all(apiPromises);
            console.log("All API requests completed:", results);
            toast({
                title: "Prospect Updated Successfully!",
                variant: "dark"
            })
            // closeSideSheet()
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }

    async function getUserList() {
        try {
            const userList: any = await fetchUserDataList()
            setUserList(userList)
        } catch (err) {
            console.error("user fetch error", err)
        }

    }

    function safeprs(isPromoteToDeal: boolean = false) {
        const result = formSchema.safeParse(form.getValues())
        if (isPromoteToDeal) {
            setPromoteToDealClicked(false)
        }
        console.log("error", result)
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
            if (isPromoteToDeal) {
                console.log("isPromoteToDeal if", isPromoteToDeal)
                setPromoteToDealErrors(true)
            } else {
                console.log("isPromoteToDeal else", isPromoteToDeal)
                setPromoteToDealErrors(false)
            }
        } else {
            if (isPromoteToDeal) {
                postPromoteToDealSafeParse()

            }
        }
    }

    function onSubmit() {
        console.log("submitted")
        // safeprs()
        console.log(numberOfErrors)
        patchData()
    }


    function onStatusChange(value: string) {
        updateFormSchemaOnStatusChange(value, false, true)


    }
    function updateFormSchemaOnStatusChange(value: string, isPromoteToDeal: boolean = false, changeReason: boolean = false, type: string | undefined = undefined) {
        let updatedSchema
        if (value.toLowerCase() !== "qualified") {
            console.log("else")
            updatedSchema = FormSchema.extend({
                reasons: z.string(required_error).min(1, { message: required_error.required_error }),
            })

        } else {
            console.log("aualified")
            updatedSchema = FormSchema.extend({
                reasons: z.string().optional()
            })

            if (isPromoteToDeal) {
                updatedSchema = updatedSchema.extend({
                    registeredName: z.string(required_error).min(1, { message: required_error.required_error }),
                    shippingAddress: z.string(required_error).min(1, { message: required_error.required_error }),
                    billingAddress: z.string(required_error).min(1, { message: required_error.required_error }),
                    gstinVatGstNo: z.string(required_error).min(1, { message: required_error.required_error }),
                })
                if (isServiceRadioSelected) {
                    updatedSchema = updatedSchema.extend({
                        serviceFee: z.string(required_error).min(1, { message: required_error.required_error }),
                    })

                } else {
                    updatedSchema = updatedSchema.extend({
                        flatFee: z.string(required_error).min(1, { message: required_error.required_error }),
                    })

                }
            }
        }

        if (form.getValues("industry") === "vc_pe") {
            updatedSchema = updatedSchema.extend({
                domain: z.string().optional(),
                size: z.string().optional(),
                lastFundingStage: z.string().optional(),
                lastFundingAmount: z.string().optional(),
            })
        } else {
            updatedSchema = updatedSchema.extend({
                domain: z.string(required_error).min(1, { message: required_error.required_error }),
                size: z.string(required_error).min(1, { message: required_error.required_error }),
                lastFundingStage: z.string(required_error).min(1, { message: required_error.required_error }),
                lastFundingAmount: z.string(required_error).min(1, { message: required_error.required_error }),
            })
        }

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

        updatedSchema = updatedSchema.superRefine((data, ctx) => {
            const fixedBudgetUl = data.fixedBudgetUl;
            const fixedCtcBudget = data.fixedCtcBudget;
            const esopRsusUl = data.esopRsusUl;
            const serviceFee = data.serviceFee;
            const flatFee = data.flatFee;
            const equityFee = data.equityFee;

            // Check if fixedBudgetUl is a valid number greater than or equal to fixedCtcBudget
            if (fixedBudgetUl !== null && fixedBudgetUl !== '' && fixedBudgetUl != undefined && fixedCtcBudget !== null && fixedCtcBudget !== '' && fixedCtcBudget != undefined) {
                const fixedBudgetUlNumeric = Number(fixedBudgetUl?.toLocaleString().replace(/\D/g, ''));
                const fixedCtcBudgetNumeric = Number(fixedCtcBudget?.toLocaleString().replace(/\D/g, ''));
                const isFixedBudgetGreaterOrEqual = fixedBudgetUlNumeric >= fixedCtcBudgetNumeric;

                if (!isFixedBudgetGreaterOrEqual) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        // message: "Fixed Budget should be greater than or equal to Fixed CTC Budget.",
                        message: "Invalid Input",
                        path: ["fixedBudgetUl"],
                    });
                }
            }

            // Check if fixedCtcBudget is a valid number greater than or equal to 49999
            if (fixedCtcBudget !== null && fixedCtcBudget !== '' && fixedCtcBudget !== undefined) {
                const fixedCtcBudgetNumeric = Number(fixedCtcBudget?.toLocaleString().replace(/\D/g, ''));
                const isFixedCtcBudgetValid = fixedCtcBudgetNumeric >= 49999;

                if (!isFixedCtcBudgetValid) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        // message: "Fixed CTC Budget should be greater than or equal to 49999.",
                        message: "Invalid Input",
                        path: ["fixedCtcBudget"],
                    });
                }
            }

            // Check if esopRsusUl is a valid number greater than or equal to 9999
            if (esopRsusUl !== null && esopRsusUl !== '' && esopRsusUl !== undefined) {
                const esopRsusUlNumeric = Number(esopRsusUl?.toLocaleString().replace(/\D/g, ''));
                const isEsopRsusUlValid = esopRsusUlNumeric > 9999;

                if (!isEsopRsusUlValid) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        // message: "Esop Rsus Ul should be greater than or equal to 9999.",
                        message: "Invalid Input",
                        path: ["esopRsusUl"],
                    });
                }
            }

            if (serviceFee !== null && serviceFee !== '' && serviceFee !== undefined) {
                const serviceFeeNumeric = Number(serviceFee);
                const isServiceFeeValid = serviceFeeNumeric >= 10 && serviceFeeNumeric <= 50;

                if (!isServiceFeeValid) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Invalid Input",
                        path: ["serviceFee"],
                    });
                }
            }
            if (equityFee !== null && equityFee !== '' && equityFee !== undefined) {
                const equityFeeNumeric = Number(equityFee?.toLocaleString().replace(/\D/g, ''));
                const isEquityFeeValid = equityFeeNumeric > 9999;

                if (!isEquityFeeValid) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        // message: "Esop Rsus Ul should be greater than or equal to 9999.",
                        message: "Invalid Input",
                        path: ["equityFee"],
                    });
                }
            }

            if (flatFee !== null && flatFee !== '' && flatFee !== undefined) {
                const flatFeeNumeric = Number(flatFee?.toLocaleString().replace(/\D/g, ''));
                const isFlatFeeValid = flatFeeNumeric > 9999;

                if (!isFlatFeeValid) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        // message: "Esop Rsus Ul should be greater than or equal to 9999.",
                        message: "Invalid Input",
                        path: ["flatFee"],
                    });
                }
            }

            return data; // Return the data
        });

        setFormSchema(updatedSchema)
        setNumberOfErrors({ invalidErrors: 0, requiredErrors: 0 })
        form.clearErrors()
        console.log("first ", FormSchema)
        if (changeReason) {
            form.setValue("reasons", undefined)
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const keyValue = event.key;
        const validCharacters = /^[0-9.,\b]+$/; // Allow numbers, comma, period, and backspace (\b)


        if (!validCharacters.test(keyValue)) {
            event.preventDefault();
        }
    };

    function checkVcIndutsry() {
        const industry = form.getValues("industry")
        if (industry === "vc_pe") {
            setIsVcIndustrySelected(true)
            form.setValue("lastFundingStage", undefined)
            form.setValue("lastFundingAmount", undefined)
            form.setValue("domain", undefined)
            form.setValue("size", undefined)
        } else {
            setIsVcIndustrySelected(false)
        }
    }

    function preprocess() {
        updateFormSchemaOnStatusChange(form.getValues("statuses"))
        safeprs()
        setShowErrors(true)

        console.log("showErrors setter", true)

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
        if (watcher.contacts?.std_code?.length > 0) {
            console.log("status code watcher")
            const status = form.getValues("statuses")
            updateFormSchemaOnStatusChange(status)
            console.log("status code watcher", form.getFieldState("contacts"))
        }
    }, [watcher.contacts?.std_code])

    // console.log("isPromoteToDealClicked",isPromoteToDealClicked)
    console.log("isPromoteToDealErorrs", isPromoteToDealErorrs)
    useEffect(() => {
        // console.log(formSchema, isPromoteToDealClicked)
        if (isPromoteToDealClicked) {
            console.log("promote to prospect clickeed")
            safeprs(true)
            form.trigger()
        } else {
            safeprs()
        }

        if (addDialogOpen) {
            safeparse2()
        }
    }, [formSchema])

    useEffect(() => {
        if (isServiceRadioSelected) {
            form.resetField("flatFee")
            form.setValue("flatFeeCurrency", "INR")
            form.setValue("equityFeeCurrency", form.getValues("fixedCtcBudgetCurrency"))
        } else {
            form.resetField("serviceFee")
            form.setValue("equityFeeCurrency", form.getValues("flatFeeCurrency"))
        }
        updateFormSchemaOnStatusChange(form.getValues("statuses"))
    }, [isServiceRadioSelected])



    async function postPromoteToDealSafeParse() {
        patchData()
        setPromoteToDealClicked(false)
        try {
            let dealValue
            let dealValueToSend
            if (isServiceRadioSelected) {
                dealValue = Number(convertLocalStringToNumber(form.getValues("fixedCtcBudget"))) * Number(form.getValues("serviceFee")) / 100
                dealValue += Number(convertLocalStringToNumber(form.getValues("equityFee")))
                dealValueToSend = `${form.getValues("fixedCtcBudgetCurrency")} ${dealValue.toLocaleString("en-US")}`
            } else {
                dealValue = Number(convertLocalStringToNumber(form.getValues("flatFee"))) + Number(convertLocalStringToNumber(form.getValues("equityFee")))
                dealValueToSend = `${form.getValues("flatFeeCurrency")} ${dealValue.toLocaleString("en-US")}`
            }
            console.log("dealValueToSend", dealValueToSend)
            const dataResp = await fetch(`${baseUrl}/v1/api/prospect/${data.id}/promote/`, { method: "PATCH", body: JSON.stringify({ deal_value: dealValueToSend }), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.message === "success") {
                closeSideSheet()
                toast({
                    title: "Promoted to Deal!",
                    variant: "dark"
                })
            }
        }
        catch (err) {
            console.log("error", err)
        }
        //     }

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
                                <div className='pt-[24px] h-full flex flex-col w-full'>
                                    <div className='flex flex-col flex-1 overflow-y-auto  pr-[0px] '>
                                        <div className='sticky top-0 bg-white-900 z-50'>
                                            <div className='px-[24px] text-gray-900 text-xl font-semibold '>
                                                {data.lead.title}
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
                                                                        PROSPECT_STATUSES.filter((status) => status.value !== 'allStatuses').map((status, index) => {
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
                                                            <FormMessage className={selectFormMessageClasses} />
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
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
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
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>)}
                                        </div>
                                        <span className='px-[16px] my-[12px] text-gray-700 text-sm font-bold'>
                                            Details
                                        </span>
                                        <div className="px-[18px] py-[8px] gap-2 items-center w-full flex flex-row border-b-[1px] border-gray-200 bg-gray-100">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconUsersSearch size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Source
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <FormField
                                                control={form.control}
                                                name="sources"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>

                                                        <FormControl>
                                                            <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} ${preFilledClasses} `} placeholder="Source" {...field} />
                                                        </FormControl>
                                                        <FormMessage className={selectFormMessageClasses} />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>
                                        <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200 ">
                                            <FormField
                                                control={form.control}
                                                name="owners"
                                                render={({ field }) => (
                                                    <FormItem className='w-full cursor-pointer'>
                                                        <Popover>
                                                            <PopoverTrigger asChild >
                                                                <div className='flex  pl-[12px] py-[8px] mb-[8px]  flex-row gap-[8px] items-center  ' >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div>
                                                                                    <IconProfile size={24} />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                Owned By
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                    <div className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                        <div className={`w-full flex-1 text-align-left text-md flex  ${commonClasses} ${commonFontClasses}`}>
                                                                            {userList && userList?.length > 0 && userList?.find((val) => val.value === field.value)?.label || <span className={`text-muted-foreground `} >Owned By</span>}
                                                                        </div>
                                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                    </div>
                                                                </div>

                                                            </PopoverTrigger>
                                                            <PopoverContent className={`mt-[2px] p-0 ${popoverSidesheetWidthClasses}`}>
                                                                <Command>
                                                                    <CommandInput className='w-full' placeholder="Search Owner" />
                                                                    <CommandEmpty>Owner not found.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                            {userList && userList?.length > 0 && userList.map((owner) => (
                                                                                <CommandItem
                                                                                    value={owner.label}
                                                                                    key={owner.value}
                                                                                    onSelect={() => {
                                                                                        form.setValue("owners", owner.value, SET_VALUE_CONFIG)
                                                                                    }}
                                                                                >
                                                                                    <PopoverClose asChild>
                                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                                            {owner.label}
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                                    field.value === owner.value
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
                                                        {!form.getValues("owners") && <FormMessage className={selectFormMessageClasses} />}

                                                    </FormItem>
                                                )}
                                            />

                                        </div>

                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 bg-gray-100">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className='text-[#98A2B3]'>
                                                            <IconClosedBy size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Closed By
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <FormField
                                                control={form.control}
                                                name="closedBy"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormControl>
                                                            <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Closed By" {...field} />
                                                        </FormControl>
                                                        <FormMessage className={selectFormMessageClasses} />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 bg-gray-100">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconUserCheck size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Fulfilled By
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <FormField
                                                control={form.control}
                                                name="fulfilledBy"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormControl>
                                                            <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Fulfilled By" {...field} />
                                                        </FormControl>
                                                        <FormMessage className={selectFormMessageClasses} />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 bg-gray-100">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconCurrencyDollars size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Deal Value
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <FormField
                                                control={form.control}
                                                name="dealValue"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormControl>

                                                            <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} bg-inherit`} placeholder="Deal Value" {...field} />
                                                        </FormControl>
                                                        <FormMessage className={selectFormMessageClasses} />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-bold'>
                                            Role Details
                                        </span>
                                        <div className="px-[18px] py-[8px] gap-2 items-center w-full flex flex-row border-b-[1px] border-gray-200 bg-gray-100">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconRoles size={24} color="#98A2B3" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Role
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <FormField
                                                control={form.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>

                                                        <FormControl>
                                                            <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} ${preFilledClasses} `} placeholder="Role" {...field} />
                                                        </FormControl>
                                                        <FormMessage className={selectFormMessageClasses} />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>
                                        <div className="px-[18px] py-[8px] gap-2 items-center w-full flex flex-row border-b-[1px] border-gray-200 bg-gray-100">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconGlobe size={24} color="#98A2B3" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Region
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <FormField
                                                control={form.control}
                                                name="regions"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>

                                                        <FormControl>
                                                            <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} ${preFilledClasses} `} placeholder="Region" {...field} />
                                                        </FormControl>
                                                        <FormMessage className={selectFormMessageClasses} />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 border-b-2 " >
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconLocation size={24} color="#98A2B3" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Location
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

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
                                                                    <div className='flex flex-row gap-[22px] items-center  ' >
                                                                        <div >
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <div>
                                                                                            <IconWallet size={24} color="#98A2B3" />
                                                                                        </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent side="top">
                                                                                        Budget Range
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>

                                                                        </div>
                                                                        <SelectValue placeholder="Select Budget" />
                                                                    </div>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    BUDGET_RANGE[labelToValue(form.getValues("regions"), REGIONS) || ""]?.map((budget, index) => {
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
                                                            <IconStackedCoins size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Cash CTC Budget
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <div className='flex ml-[2px] flex-row w-full items-start'>
                                                <FormField
                                                    control={form.control}
                                                    name="fixedCtcBudgetCurrency"
                                                    render={({ field }) => (
                                                        <FormItem className='w-fit min-w-[80px]'>
                                                            <Select onValueChange={
                                                                (val) => {
                                                                    if (isServiceRadioSelected) {

                                                                        form.setValue("equityFeeCurrency", val)
                                                                    }
                                                                    return field.onChange(val)
                                                                }
                                                            } defaultValue={field.value} >
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
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="fixedCtcBudget"
                                                    render={({ field }) => (
                                                        <FormItem className='flex-1'>
                                                            <FormControl>
                                                                <Input className={`border-none ${commonClasses} ${commonFontClasses}`} placeholder="Cash CTC Budget" {...field}
                                                                    onKeyPress={handleKeyPress}
                                                                    onChange={event => {
                                                                        return handleOnChangeNumeric(event, field)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className={inputFormMessageClassesWithSelect} />
                                                        </FormItem>

                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconStackedCoins2 size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Cash CTC Budget Upper Limit
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <div className='flex ml-[2px] flex-row w-full items-start'>
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
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="fixedBudgetUl"
                                                    render={({ field }) => (
                                                        <FormItem className='flex-1'>
                                                            <FormControl>
                                                                <Input className={`border-none ${commonClasses} ${commonFontClasses}`} placeholder="Cash CTC Budget UL" {...field}
                                                                    onKeyPress={handleKeyPress}
                                                                    onChange={event => {
                                                                        return handleOnChangeNumeric(event, field)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className={inputFormMessageClassesWithSelect} />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconEsop size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        ESOPs/RSUs Budget Upper Limit
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <div className='flex ml-[2px] flex-row w-full items-start'>
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
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="esopRsusUl"
                                                    render={({ field }) => (
                                                        <FormItem className='flex-1'>
                                                            <FormControl>
                                                                <Input className={`border-none ${commonClasses} ${commonFontClasses}`} placeholder="ESOPs/RSUs Budget UL" {...field}
                                                                    onKeyPress={handleKeyPress}
                                                                    onChange={event => {
                                                                        return handleOnChangeNumeric(event, field)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className={inputFormMessageClassesWithSelect} />
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
                                                                    <div className='flex flex-row gap-[22px] items-center  ' >
                                                                        <div >
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <div>
                                                                                            <IconClock size={24} color="#98A2B3" />
                                                                                        </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent side="top">
                                                                                        Time to Fill
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>

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
                                                        <FormMessage className={selectFormMessageClasses} />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                            <span className='font-bold'>Account Details</span>
                                            <div> <LabelIcon /> </div>
                                        </span>
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 bg-gray-100">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconOrgnaisation size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Organisation Name
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

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
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
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
                                        <div className="pl-[6px] pr-[4px] pt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
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
                                                            <PopoverContent className={`mt-[2px] p-0 ${popoverSidesheetWidthClasses}`}>
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
                                                                                        form.setValue("industry", industry.value, SET_VALUE_CONFIG)
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
                                        <div className={`px-[6px] pt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200 ${isVcIndustrySelected && "bg-gray-100 cursor-not-allowed"}`}>
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
                                        <div className={`px-[6px] pt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200 ${isVcIndustrySelected && "bg-gray-100 cursor-not-allowed"}`}>
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
                                        <div className={`pl-[6px] pr-[4px] pt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200 ${isVcIndustrySelected && "bg-gray-100 cursor-not-allowed"}`}>
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
                                                            {!isVcIndustrySelected && <PopoverContent className={`mt-[2px] p-0 ${popoverSidesheetWidthClasses}`}  >
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
                                                        {!form.getValues("lastFundingStage") && <FormMessage className={selectFormMessageClasses} />}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className={`px-[6px] pt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200 ${isVcIndustrySelected && "bg-gray-100 cursor-not-allowed"}`}>
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
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
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
                                                            <Input className={`border-none ${commonClasses} ${commonFontClasses} `} placeholder="Billing Address" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
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
                                                            <Input className={`border-none ${commonClasses} ${commonFontClasses} `} placeholder="Shipping Address" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>



                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 ">
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
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <span className='px-[16px] mb-[12px] mt-[24px] text-gray-700 text-sm font-bold'>
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
                                                                    <div className='flex flex-row gap-[22px] items-center  ' >
                                                                        <div >
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <div>
                                                                                            <IconRetainerAdvance size={24} color="#98A2B3" />
                                                                                        </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent side="top">
                                                                                        Retainer Advance
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>

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
                                                                    <div className='flex flex-row gap-[22px] items-center  ' >
                                                                        <div >
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <div>
                                                                                            <IconExclusitivity size={24} color="#98A2B3" />
                                                                                        </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent side="top">
                                                                                        Exclusivity
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>

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
                                                                    <div className='flex flex-row gap-[22px] items-center  ' >
                                                                        <div >
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <div>
                                                                                            <IconServiceFeeRange size={24} color="#98A2B3" />
                                                                                        </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent side="top">
                                                                                        Service Fee Range
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>

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
                                        <div className={`py-[20px] border-b-[1px] border-gray-200 ${commonFontClasses} font-medium`}>
                                            <FormField
                                                control={form.control}
                                                name="feeType"
                                                defaultValue={isServiceRadioSelected ? 'service_fee' : 'flat_fee'}
                                                render={({ field }) => (
                                                    <FormItem className=" space-y-3">
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={(val) => {
                                                                    if (val === "service_fee") {
                                                                        setIsServiceRadioSelected(true)
                                                                    } else {
                                                                        setIsServiceRadioSelected(false)
                                                                    }
                                                                    return field.onChange(val)
                                                                }}
                                                                defaultValue={field.value}
                                                                className="flex flex-row px-[18px] gap-[40px]"
                                                            >
                                                                <FormItem className="flex items-center space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="service_fee" />
                                                                    </FormControl>
                                                                    <FormLabel className='px-[10px]'>
                                                                        Service Fee %
                                                                    </FormLabel>
                                                                </FormItem>
                                                                <FormItem className="flex items-center space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="flat_fee" />
                                                                    </FormControl>
                                                                    <FormLabel className='px-[10px]'>
                                                                        Flat Fee
                                                                    </FormLabel>
                                                                </FormItem>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className={`px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 ${!isServiceRadioSelected ? 'bg-gray-100' : ''}`}>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconPercent2 size={24} color="#98A2B3" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Service Fee
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <FormField
                                                control={form.control}
                                                name="serviceFee"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormControl>
                                                            <Input disabled={!isServiceRadioSelected} className={`border-none ${commonClasses} ${commonFontClasses} ${!isServiceRadioSelected ? 'bg-gray-100' : ''}`} placeholder="Service Fee" {...field}
                                                                onKeyPress={handleKeyPress}
                                                                onChange={event => {
                                                                    return handleOnChangeNumeric(event, field, false)
                                                                }} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {/* new fields */}
                                        <div className={`px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200 ${isServiceRadioSelected ? 'bg-gray-100' : ''}`}>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconFlatFee size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Flat Fee
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <div className='flex ml-[2px] flex-row w-full items-start'>
                                                <FormField
                                                    control={form.control}
                                                    name="flatFeeCurrency"
                                                    render={({ field }) => (
                                                        <FormItem className='w-fit min-w-[80px]'>
                                                            <Select disabled={isServiceRadioSelected} onValueChange={
                                                                (val) => {
                                                                    form.setValue("equityFeeCurrency", val)
                                                                    return field.onChange(val)
                                                                }
                                                            } defaultValue={field.value} key={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`border-none ${commonFontClasses} ${isServiceRadioSelected ? `${disabledClasses} text-gray-400` : ''}`}>
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
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="flatFee"
                                                    render={({ field }) => (
                                                        <FormItem className='flex-1'>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isServiceRadioSelected}
                                                                    className={`border-none ${commonClasses} ${commonFontClasses} ${isServiceRadioSelected ? disabledClasses : ''}`} placeholder="Flat Fee" {...field}
                                                                    onKeyPress={handleKeyPress}
                                                                    onChange={event => {
                                                                        return handleOnChangeNumeric(event, field)
                                                                    }}

                                                                />
                                                            </FormControl>
                                                            <FormMessage className={inputFormMessageClassesWithSelect} />
                                                        </FormItem>

                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconEquityFee size={24} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        Equity Fee
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <div className='flex ml-[2px] flex-row w-full items-start'>
                                                <FormField
                                                    control={form.control}
                                                    name="equityFeeCurrency"
                                                    render={({ field }) => (
                                                        <FormItem className='w-fit min-w-[80px]'>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger disabled className={`border-none ${commonFontClasses} `}>
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
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="equityFee"
                                                    render={({ field }) => (
                                                        <FormItem className='flex-1'>
                                                            <FormControl>
                                                                <Input className={`border-none ${commonClasses} ${commonFontClasses} `} placeholder="Equity Fee" {...field}
                                                                    onKeyPress={handleKeyPress}
                                                                    onChange={event => {
                                                                        return handleOnChangeNumeric(event, field)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className={inputFormMessageClassesWithSelect} />
                                                        </FormItem>

                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                            <span className='font-bold'>Contact Details</span>
                                            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                                                <DialogTrigger asChild>
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
                                                                                        updateFormSchemaOnStatusChange(form.getValues("statuses"), false, false, val)
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
                                                                                    <Input type="text" className={`mt-3 w-full ${commonClasses2}`} placeholder={`Phone No ${!isPhoneMandatory ? "(Optional)" : "(Mandatory)"}`} {...field}
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
                                                            <Button type='button' disabled={!areContactFieldValid || !permissions?.change} onClick={() => addContact()}>
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
                                        {showErrors && (numberOfErrors.requiredErrors > 0 || numberOfErrors.invalidErrors > 0) && !isPromoteToDealErorrs && <div className='flex flex-row gap-[8px] text-error-500 font-medium text-xs items-center'>
                                            <IconRequiredError size={16} />
                                            <div className="flex flex-row text-xs text-error-700 gap-[3px] font-normal">
                                                {(numberOfErrors.requiredErrors > 0 || numberOfErrors.invalidErrors > 0) && <span className='font-bold'>Field(s)</span>}
                                                {numberOfErrors.requiredErrors > 0 && <span>
                                                    Missing:
                                                    <span className='font-bold'> {numberOfErrors.requiredErrors} </span>
                                                </span>}
                                                {numberOfErrors.requiredErrors > 0 && numberOfErrors.invalidErrors > 0 && ";"}
                                                {numberOfErrors.invalidErrors > 0 && <span>
                                                    Invalid: <span className='font-bold'>{numberOfErrors.invalidErrors}</span>
                                                </span>}
                                            </div>
                                        </div>}
                                        <div className='flex flex-row flex-1 justify-end '>
                                            <Button variant="default" type="submit" disabled={!form.formState.isDirty || !permissions?.change} >Save</Button>

                                        </div>
                                    </div>

                                </div>
                            </form>
                        </Form>
                    </div>
                    <div className="w-[1px] bg-gray-200 "></div>

                    <div className='pt-[24px]  2xl:w-3/4 w-8/12 h-full flex-1 flex flex-col'>
                        <div className='flex px-[24px] flex-row justify-between w-full gap-[20px]'>
                            <div className='flex flex-row gap-[16px]'>
                                {
                                    Object.keys(SIDE_SHEET_TABS).map((tab) => {
                                        const tabName = SIDE_SHEET_TABS[tab]
                                        return <>
                                            <div className={`p-[12px] cursor-pointer  text-sm font-semibold  ${currentSidesheetTab === tabName && activeTabSideSheetClasses}`} onClick={() => setCurrentSidesheetTab(tabName)}>
                                                {tabName}
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                            <div className='flex flex-row gap-[20px]'>
                                {showErrors && (numberOfErrors.requiredErrors > 0 || numberOfErrors.invalidErrors > 0) && isPromoteToDealErorrs && <div className='flex flex-row gap-[8px] text-error-500 font-medium text-xs items-center'>
                                    <IconRequiredError size={16} />
                                    <div className="flex flex-row text-xs text-error-700 gap-[3px] font-normal">
                                        {(numberOfErrors.requiredErrors > 0 || numberOfErrors.invalidErrors > 0) && <span className='font-bold'>Field(s)</span>}
                                        {numberOfErrors.requiredErrors > 0 && <span>
                                            Missing:
                                            <span className='font-bold'> {numberOfErrors.requiredErrors} </span>
                                        </span>}
                                        {numberOfErrors.requiredErrors > 0 && numberOfErrors.invalidErrors > 0 && ";"}
                                        {numberOfErrors.invalidErrors > 0 && <span>
                                            Invalid: <span className='font-bold'>{numberOfErrors.invalidErrors}</span>
                                        </span>}
                                    </div>
                                </div>}
                                <Button className='flex flex-row gap-2' disabled={!permissions?.change || (rowState?.status ? (rowState?.status?.toLowerCase() !== "qualified" || form.getValues("statuses")?.toLowerCase() !== "qualified") : false)} variant={'default'} type='button' onClick={() => promoteToDeal()}>
                                    <span >Promote to Deal</span> <IconArrowSquareRight size={20} />
                                </Button>
                            </div>


                        </div>
                        <div className='px-[24px] pb-[24px] flex flex-row bg-gray-50 flex-1 border-t-[1px] border-gray-200 overflow-y-auto overflow-x-hidden '>
                            <SideSheetTabs currentParentTab={currentSidesheetTab} contactFromParents={dummyContactData} entityId={data.lead.id} permissions={permissions} disable={{ requirementDeck: true }} />
                        </div>
                    </div>
                </div>

            </div>
        </div>


    )


    function handleOnChangeNumericDecimal(event: React.ChangeEvent<HTMLInputElement>, field: any, isSeparator: boolean = true) {
        // Remove all non-numeric characters except the first one and allow a single decimal point.
        const cleanedValue = event.target.value.replace(/[^0-9.]+/g, '').replace(/^(\d*\.\d*).*$/, '$1');
        console.log(cleanedValue);

        // Return the cleaned numeric value as a string without formatting.
        return field.onChange(cleanedValue);
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

        const titleExisting = data.lead.title?.split(" ").join("").split("-")

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
            const dataResp = await fetch(`${baseUrl}/v1/api/lead/${data.lead.id}/`, { method: "PATCH", body: JSON.stringify(leadData), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.message.toLowerCase() === "success") {
                const { data: { status } } = result
                setRowState((prevState) => {
                    return {
                        ...prevState,
                        status: status
                    }
                })
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

    async function patchProspectData(prospectId: number, prospect: Partial<PatchProspect>) {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/prospect/${prospectId}/`, {
                method: "PATCH",
                body: JSON.stringify(prospect),
                headers: {
                    "Authorization": `Token ${token_superuser}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })

            const result = await dataResp.json();
            if (result.status == "1") {
                const { data: { status } } = result
                setRowState({
                    status: status
                })
                // Handle success for each contact if needed
            }
        } catch (err) {

        }
    }

}

export default SideSheetProspects
