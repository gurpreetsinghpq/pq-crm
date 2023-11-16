import React, { useEffect, useState } from 'react'
import { IconAccounts, IconAlert, IconArrowSquareRight, IconBilling, IconBuildings, IconCheckCircle, IconClock, IconClosedBy, IconCoinsHand, IconContacts, IconCross, IconCurrencyDollars, IconDeal, IconEdit2, IconEmail, IconEsop, IconExclusitivity, IconGlobe, IconGst, IconIndustry, IconLeads, IconLocation, IconLock, IconOrgnaisation, IconPackage, IconPercent2, IconProfile, IconRequiredError, IconRetainerAdvance, IconRoles, IconSave, IconServiceFeeRange, IconShield, IconShipping, IconStackedCoins, IconStackedCoins2, IconStackedCoins3, IconTick, IconUserCheck, IconUsers, IconUsersSearch, IconWallet, Unverified } from '../icons/svgIcons'
import { IChildData, formatData } from './leads'
import { Button } from '../ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '../ui/form'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'
import { COUNTRY_CODE, CURRENCIES, DESIGNATION, DOMAINS, EXCLUSIVITY, INDUSTRY, LAST_FUNDING_AMOUNT, LAST_FUNDING_STAGE, OWNERS, REGION, REGIONS, RETAINER_ADVANCE, ROLETYPE, SEGMENT, SERVICE_FEE_RANGE, SET_VALUE_CONFIG, SIZE_OF_COMPANY, SOURCES, STATUSES, TIME_TO_FILL, TYPE } from '@/app/constants/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ClientCompleteInterface, ClientGetResponse, Contact, ContactPatchBody, ContactsGetResponse, DeepPartial, IValueLabel, LeadInterface, Organisation, PatchLead, PatchOrganisation, PatchRoleDetails, Permission, RoleDetails, User } from '@/app/interfaces/interface'
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
import { Check, CheckCircle, CheckCircle2, ChevronDown, Loader2, MinusCircleIcon, Phone, Type } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { commonClasses, commonClasses2, commonFontClasses, contactListClasses, disabledClasses, preFilledClasses, requiredErrorClasses, selectFormMessageClasses } from '@/app/constants/classes'
import { PopoverClose } from '@radix-ui/react-popover'
import { required_error } from './sideSheet'
import { toast } from '../ui/use-toast'
import { getCookie } from 'cookies-next'
import { doesTypeIncludesMandatory, handleOnChangeNumericReturnNull } from './commonFunctions'
import { useDebounce } from '@/hooks/useDebounce'


const FormSchema = z.object({
    organisationName: z.string({}).min(1),
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

let dataFromApi: ClientCompleteInterface[] = []

function SideSheetContacts({ parentData, permissions, accountList }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction }, permissions: Permission, accountList: IValueLabel[] | undefined }) {

    const [formSchema, setFormSchema] = useState<any>(FormSchema);
    const [editContactNameClicked, setEditContactNameClicked] = useState<boolean>(false);
    const [numberOfErrors, setNumberOfErrors] = useState<number>()
    const [isFormInUpdateState, setFormInUpdateState] = useState<any>(false)
    const [areContactFieldValid, setContactFieldValid] = useState<boolean>(false)
    const [organisationList, setOrganisationList] = useState<ClientCompleteInterface[]>()
    const { childData: { row }, setChildDataHandler } = parentData
    const [rowState, setRowState] = useState<DeepPartial<ClientGetResponse>>()
    const [isPhoneMandatory, setIsPhoneMandatory] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [accountData, setAccountData] = useState<ClientCompleteInterface[]>([])
    const [inputAccount, setInputAccount] = useState("")
    const [currentAccountName, setCurrentAccountName] = useState("")

    const data: ContactsGetResponse = row.original
    useEffect(() => {
        console.log(data)

        setRowState((prevState) => ({
            ...prevState,
            name: data.name
        }))
        const type = labelToValue(data.type, TYPE)
        console.log("type", type)
        changeStdCode(type)
        console.log("data.name",data.organisation)
        setCurrentAccountName(data.organisation.name)
    }, [])

    function closeSideSheet() {
        setChildDataHandler('row', undefined)
    }

    const LabelIcon = () => {
        // const d = LAST_FUNDING_STAGE.find((val) => val.label === data.last_funding_stage)

        // return <>{d && <d.icon />}</>
    }


    async function fetchClientData(textToSearch: string) {
        const nameQueryParam = textToSearch ? `&name=${encodeURIComponent(textToSearch)}` : '';
        setLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/?page=1&limit=15${nameQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" }, cache: "no-store" })
            const result = await dataResp.json()
            setLoading(false)
            let data: ClientCompleteInterface[] = structuredClone(result.data)
            setAccountData(data)
            let fdata = data
            dataFromApi = fdata
        }
        catch (err) {
            console.log("error", err)
            setLoading(false)
        }
    }


    const debouncedSearchableFilters = useDebounce(inputAccount, 500)

    useEffect(() => {
        console.log("fetchclientdata", debouncedSearchableFilters)
        if (inputAccount.length === 0) {
            setAccountData([])
        }

        fetchClientData(debouncedSearchableFilters)

    }, [debouncedSearchableFilters])

    function onChangeHandler(data: string) {
        setInputAccount(data)
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            organisationName: data.organisation.id.toString(),
            name: data.name,
            email: data.email,
            designation: labelToValue(data.designation, DESIGNATION),
            phone: data.phone,
            std_code: data.std_code || "+91",
            type: labelToValue(data.type, TYPE)
        },
        mode: "all"
    })



    const watcher = form.watch()

    useEffect(() => {
        safeparse2()
        form.formState.isValid
        form.formState.isDirty
        console.log("formstate isvalid", form.formState.isValid, "formstate isdirty", form.formState.isDirty)

    }, [watcher])

    useEffect(() => {
        form.trigger()
    }, [formSchema])

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
    const token_superuser = getCookie("token")


    async function patchData() {

        const contactId = data.id

        let phone = form.getValues("phone")
        let std_code = form.getValues("std_code")

        if (!phone || !std_code) {
            phone = ""
            std_code = ""
        }

        const contactDetails: Partial<ContactPatchBody> = {
            name: form.getValues("name"),
            email: form.getValues("email"),
            designation: valueToLabel(form.getValues("designation") || "", DESIGNATION) || "",
            type: valueToLabel(form.getValues("type") || "", TYPE) || "",
            phone: phone,
            std_code: std_code,
            organisation: Number(form.getValues("organisationName"))
        }



        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/${contactId}/`, { method: "PATCH", body: JSON.stringify(contactDetails), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            console.log(result)
            if (result.status == "1") {
                toast({
                    title: "Contact Details Updated Successfully!",
                    variant: "dark"
                })
            } else {
                toast({
                    title: "Api failure!",
                    variant: "destructive"
                })
            }

        }
        catch (err) {
            console.log("error", err)
        }
        // /v1/api/client/contact/


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

    function changeStdCode(type: string | undefined = undefined) {
        const value = form.getValues("std_code")
        let updatedSchema
        const isMandatory = type ? doesTypeIncludesMandatory(type) : false
        if (type) {
            setIsPhoneMandatory(isMandatory)
        }
        console.log(value, value != "+91")
        if (isMandatory) {
            if (value != "+91" && value != "+1") {
                updatedSchema = FormSchema.extend({
                    phone: z.string().min(4).max(13),
                    std_code: z.string()
                })
            }
            else {
                updatedSchema = FormSchema
            }
        } else {
            if (value != "+91" && value != "+1") {
                updatedSchema = FormSchema.extend({
                    phone: z.string().min(4).max(13).optional().nullable(),
                    std_code: z.string().optional()
                })
            }
            else {
                updatedSchema = FormSchema.extend({
                    phone: z.string().min(10).max(10).optional().nullable(),
                    std_code: z.string().optional()
                })
            }
        }
        if (type) {
            const phone = form.getValues("phone")
            if (!phone) {
                if (isMandatory) {
                    form.setValue("phone", '')
                } else {
                    form.setValue("phone", null)
                }
            }
        }
        setFormSchema(updatedSchema)
        console.log("updatedschema", updatedSchema)
    }

    function updateContactName(): void {
        setEditContactNameClicked(false)
        setRowState((prevState) => ({
            ...prevState,
            name: form.getValues("name")
        }))
        // throw new Error('Function not implemented.')

    }

    function updateContact(): void {
        // throw new Error('Function not implemented.')
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
                        <div className={`relative  w-full h-full flex flex-col ${editContactNameClicked ? "pt-[10px]" : "pt-[26px]"}`}>
                            <div className='flex flex-col flex-1 overflow-y-auto  pr-[0px] '>
                                <div className='sticky top-0 bg-white-900 z-50'>
                                    {!editContactNameClicked ? <div className='px-[24px] flex flex-row items-center justify-between'>
                                        <div className=' text-gray-900 text-xl font-semibold '>
                                            {rowState?.name}
                                        </div>
                                        {permissions?.change && <div className='cursor-pointer' onClick={() => setEditContactNameClicked(true)}>
                                            <IconEdit2 size={24} />
                                        </div>}
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
                                            <div className='flex flex-row justify-end mt-2 mr-[10px] items-center gap-2 '>
                                                <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] cursor-pointer`} onClick={() => discardContact()}>
                                                    <IconCross size={20} />
                                                    <span className='text-gray-600 text-xs font-semibold' >Cancel</span>
                                                </div>

                                                <div className={`flex flex-row gap-2 hover:bg-accent hover:text-accent-foreground items-center px-3 py-2 rounded-[6px] ${!form.getFieldState("name").error ? 'cursor-pointer opacity-[1]' : 'cursor-not-allowed opacity-[0.3]'}`} onClick={() => !form.getFieldState("name").error && updateContactName()}>
                                                    <IconTick size={20} />
                                                    <span className='text-gray-600 text-xs font-semibold' >Save</span>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    <div className="px-[16px] mt-[24px] text-md font-medium w-full flex flex-row ">
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <Select onValueChange={(val) => {
                                                        changeStdCode(val)
                                                        return field.onChange(val)
                                                    }} defaultValue={field.value}>
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
                                {/* <div className="bg-gray-200 mt-[20px] h-[1px]" ></div> */}
                                <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                    <span className='font-bold'>Account Details</span>
                                    <div className="bg-gray-200 mt-[20px] h-[1px]" ></div>
                                </span>

                                <div className="pl-[18px] pr-[4px] pt-[10px] pb-[14px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                    <FormField
                                        control={form.control}
                                        name="organisationName"
                                        render={({ field }) => (
                                            <FormItem className='w-full cursor-pointer'>
                                                <Popover>
                                                    <PopoverTrigger asChild >
                                                        <div className='flex flex-row gap-[10px] items-center  ' >
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
                                                            <div className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                <div className={`w-full flex-1 text-align-left text-md flex  ${commonClasses} ${commonFontClasses}`}>
                                                                    { currentAccountName || <span className='text-muted-foreground '>Organisation</span>}
                                                                </div>
                                                                <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                            </div>
                                                        </div>

                                                    </PopoverTrigger>
                                                    <PopoverContent className="mt-[8px] p-0 w-[33vw]" >
                                                        <Command>
                                                            <CommandInput  onInput={(e) => { onChangeHandler(e.currentTarget.value) }} className='w-full flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50' placeholder="Search Organisation" />

                                                            {loading ? <div className='p-[16px] flex flex-row justify-center items-center min-h-[150px]'>
                                                                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                                                            </div> :
                                                                <>
                                                                    {accountData.length> 0 ?
                                                                    <div>
                                                                        <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                            {accountData.map((account) => (
                                                                                <div
                                                                                    key={account.id.toString()}
                                                                                    onClick={() => {
                                                                                        form.setValue("organisationName", account.id.toString(), SET_VALUE_CONFIG)
                                                                                        setCurrentAccountName(account.name)
                                                                                    }}
                                                                                    className="relative flex cursor-default hover:bg-accent items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground "
                                                                                >
                                                                                    <PopoverClose asChild>
                                                                                        <div className="flex flex-row items-center justify-between w-full">
                                                                                            {account.name}
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "mr-2 h-4 w-4 text-purple-600",
                                                                                                    field.value === account.id.toString()
                                                                                                        ? "opacity-100"
                                                                                                        : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                        </div>
                                                                                    </PopoverClose>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div> :  <div className='py-6 text-center text-sm'>Organisation not found.</div>}
                                                                </>
                                                            }
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <span className='px-[16px] mt-[24px] mb-[4px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                    <span className='font-bold'>Contact Details</span>
                                </span>
                                {/* <div className="bg-gray-200 h-[1px] mt-[10px]" ></div> */}
                                <div className=' flex flex-col w-full' >
                                    <div className='flex flex-col'>
                                        <div className="pl-[18px] pr-[4px] pt-[10px] pb-[14px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                            <FormField
                                                control={form.control}
                                                name="designation"
                                                render={({ field }) => (
                                                    <FormItem className='w-full cursor-pointer'>
                                                        <Popover>
                                                            <PopoverTrigger asChild >
                                                                <div className='flex flex-row gap-[10px] items-center  ' >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div>
                                                                                    <IconContacts size={24} color="#98A2B3" />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                Designation
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                    <div className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                        <div className={`w-full flex-1 text-align-left text-md flex  ${commonClasses} ${commonFontClasses}`}>
                                                                            {DESIGNATION.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Designation</span>}
                                                                        </div>
                                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                    </div>
                                                                </div>

                                                            </PopoverTrigger>
                                                            <PopoverContent className="mt-[8px] p-0 w-[33vw]" >
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
                                                                                        form.setValue("designation", designation.value, SET_VALUE_CONFIG)
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
                                        <div className="px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <IconEmail size={24} color={"#98A2B3"} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Email
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <FormField
                                                control={form.control}
                                                name="email"
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
                                        <div className='flex flex-row  gap-2 items-center px-[18px] py-[8px] gap-2 text-sm font-semibold w-full flex flex-row  items-center border-b-[1px] border-gray-200' >
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <Phone size={22} color={"#98A2B3"} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Phone
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <div className='flex flex-row flex-1 gap-2 items-center'>
                                                <FormField
                                                    control={form.control}
                                                    name="std_code"
                                                    render={({ field }) => (
                                                        <FormItem >
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button variant={"ghost"} className="flex flex-row gap-2">
                                                                            {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                            {COUNTRY_CODE.find((val) => val.value === field.value)?.value || <span className='text-muted-foreground '> STD Code</span>}
                                                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[200px] p-0 ml-[114px]">
                                                                    <Command>
                                                                        <CommandInput className='w-full' placeholder="Search Country Code" />
                                                                        <CommandEmpty>Country code not found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                                {COUNTRY_CODE.map((cc) => (
                                                                                    <CommandItem
                                                                                        value={cc.label}
                                                                                        key={cc.label}
                                                                                        onSelect={() => {
                                                                                            console.log("std_code", cc.value)
                                                                                            form.setValue("std_code", cc.value, SET_VALUE_CONFIG)
                                                                                            changeStdCode()

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
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem className='flex-1 '>
                                                            <FormControl>
                                                                <Input type="text" className={`border-none ${commonClasses} ${commonFontClasses} `} placeholder={`Phone No ${!isPhoneMandatory ? "(Optional)" : ""}`} {...field}
                                                                    onKeyPress={handleKeyPress}
                                                                    onChange={event => {
                                                                        const std_code = form.getValues("std_code")
                                                                        const is13Digits = std_code != "+91" && std_code != "-1"
                                                                        return handleOnChangeNumericReturnNull(event, field, false, isPhoneMandatory, is13Digits ? 13 : 10)
                                                                    }} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='w-full px-[24px] py-[16px] border border-gray-200 flex flex-row justify-between items-center'>
                                {/* {numberOfErrors && <div className='flex flex-row gap-[8px] text-error-500 font-medium text-xs'>
                                    <IconAlert size={16} />
                                    <span>
                                        {numberOfErrors} field(s) missing
                                    </span>
                                </div>} */}
                                <div className='flex flex-row flex-1 justify-end '>
                                    <Button variant="default" type="submit"
                                        disabled={!form.formState.isDirty || !form.formState.isValid || !permissions?.change}
                                    >
                                        Save
                                    </Button>

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
