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
import { ClientGetResponse, Contact, ContactsGetResponse, IValueLabel, LeadInterface, Organisation, PatchLead, PatchOrganisation, PatchRoleDetails, RoleDetails, User } from '@/app/interfaces/interface'
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
import { Check, CheckCircle, CheckCircle2, MinusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const required_error = {
    required_error: "This field is required"
}

const FormSchema = z.object({
    organisationName: z.string({}),
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


const formDefaults: z.infer<typeof FormSchema> = {
    organisationName: "",
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

function SideSheetContacts({ parentData }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction } }) {

    const [formSchema, setFormSchema] = useState<any>(FormSchema);
    const [editContactNameClicked, setEditContactNameClicked] = useState<boolean>(false);
    const [numberOfErrors, setNumberOfErrors] = useState<number>()
    const [isFormInUpdateState, setFormInUpdateState] = useState<any>(false)
    const [areContactFieldValid, setContactFieldValid] = useState<boolean>(false)

    const [showContactForm, setShowContactForm] = useState(true)
    const [dummyContactData, setDummyContactData] = useState<any[]>([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [budgetKey, setBudgetKey] = React.useState<number>(+new Date())
    const [places, setPlaces] = React.useState([])
    const [beforePromoteToProspectDivsArray, setBeforePromoteToProspectDivsArray] = useState<any[]>([]);

    const { childData: { row }, setChildDataHandler } = parentData

    const userFromLocalstorage = JSON.parse(localStorage.getItem("user") || "")
    const data: ContactsGetResponse = row.original
    useEffect(() => {
        console.log(data)

    }, [])

    function closeSideSheet() {
        setChildDataHandler('row', undefined)
    }

    const LabelIcon = () => {
        // const d = LAST_FUNDING_STAGE.find((val) => val.label === data.last_funding_stage)

        // return <>{d && <d.icon />}</>
    }



    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            organisationName: data.organisation.toString(),
            name: data.name,
            email: data.email,
            designation: labelToValue(data.designation, DESIGNATION),
            phone: data.phone,
            std_code: data.std_code,
            type: labelToValue(data.type, TYPE)
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


    function discardContact() {
        setEditContactNameClicked(false)
    }

    function safeparse2() {
        const result = FormSchema.safeParse(form.getValues())
        console.log("safe prase 2 ", result)
        if (result.success) {
            setContactFieldValid(true)
        } else {
            console.log("safe prase 2 ", result.error.errors)
            setContactFieldValid(false)
        }
    }

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


    async function patchData() {


        const orgData: Partial<PatchOrganisation> = {
            name: form.getValues("organisationName"),

        }

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
        const result = FormSchema.safeParse(form.getValues())
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

    function addContact(): void {
        throw new Error('Function not implemented.')
    }

    function updateContact(): void {
        throw new Error('Function not implemented.')
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
                        <div className={`relative  w-full h-full flex flex-col ${editContactNameClicked ? "pt-[10px]": "pt-[26px]"}`}>
                            <div className='flex flex-col flex-1 overflow-y-auto  pr-[0px] '>
                                <div className='sticky top-0 bg-white-900 z-50'>
                                    {!editContactNameClicked ? <div className='px-[24px] flex flex-row items-center justify-between'>
                                        <div className=' text-gray-900 text-xl font-semibold '>
                                            {data.name}
                                        </div>
                                        <div className='cursor-pointer' onClick={() => setEditContactNameClicked(true)}>
                                            <IconEdit2 size={24} />
                                        </div>
                                    </div> :
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className='px-[16px]'>
                                                        <FormControl >
                                                            <Input type="text" className={`mt-3 ${commonClasses} ${commonFontClasses}`} placeholder="Contact Name" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='flex flex-row justify-end mt-2 items-center gap-2 '>
                                                <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] cursor-pointer`} onClick={() => discardContact()}>
                                                    <IconCross size={20} />
                                                    <span className='text-gray-600 text-xs font-semibold' >Discard</span>
                                                </div>
                                                {isFormInUpdateState ? <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] ${form.formState.isValid ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`} onClick={() => form.formState.isValid && updateContact()}>
                                                    <IconTick size={20} />
                                                    <span className='text-gray-600 text-xs font-semibold' >Update</span>
                                                </div> :
                                                    <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] ${form.formState.isValid ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`} onClick={() => form.formState.isValid && addContact()}>
                                                        <IconTick size={20} />
                                                        <span className='text-gray-600 text-xs font-semibold' >Add</span>
                                                    </div>}
                                            </div>
                                        </>
                                    }
                                    <div className="px-[16px] mt-[24px] text-md font-medium w-full flex flex-row ">
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }
                                                    } defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`border-gray-300 ${commonClasses} ${commonFontClasses}`}>
                                                                <SelectValue defaultValue={field.value} placeholder="Select Type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                TYPE.map((type, index) => {
                                                                    return <SelectItem key={index} value={type.value}>
                                                                        <div className="">
                                                                            <div className={`flex flex-row gap-2 items-center  px-2 py-1 ${!type.isDefault && 'border border-[1.5px] rounded-[8px]'} ${type.class}`}>
                                                                                {type.label}
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
                                </div>
                                <div className="bg-gray-200 mt-[20px] h-[1px]" ></div>
                                <span className='px-[16px] mt-[10px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                    <span>Account Details</span>
                                    <div className="bg-gray-200 mt-[20px] h-[1px]" ></div>
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
                                        name="organisationName"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormControl>
                                                    <Input disabled className={`border-none ${commonClasses} ${commonFontClasses} ${commonFontClasses} ${disabledClasses} ${preFilledClasses}`} placeholder="Organisation Name" {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <span className='px-[16px] mt-[24px] mb-[4px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                    <span>Contact Details</span>
                                </span>
                                <div className="bg-gray-200 h-[1px] mt-[10px]" ></div>
                                <div className='px-[16px] flex flex-col w-full' >
                                    {<div className='flex flex-col'>
                                        <div className='flex flex-row gap-4 mt-3'>
                                            <div className='flex flex-col  w-full'>
                                                <FormField
                                                    control={form.control}
                                                    name="designation"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonClasses} ${commonFontClasses}`}>
                                                                        <SelectValue placeholder="Designation" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <div className='max-h-[200px] overflow-y-auto'>
                                                                        {
                                                                            DESIGNATION.map((designation, index) => {
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

                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <Input type="email" className={`mt-3 ${commonClasses} ${commonFontClasses}`} placeholder="Email" {...field} />
                                            )}
                                        />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <FormField
                                                control={form.control}
                                                name="std_code"
                                                render={({ field }) => (
                                                    <FormItem className='mt-3 '>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button variant={"google"} className="flex flex-row gap-2">
                                                                        {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
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
                                                                                        console.log("std_code", cc.value)
                                                                                        changeStdCode(cc.value)
                                                                                        form.setValue("std_code", cc.value)
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
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem className='flex-1'>
                                                        <FormControl>
                                                            <Input type="text" className={`mt-3  ${commonClasses} ${commonFontClasses}`} placeholder="Phone No" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
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


export default SideSheetContacts
