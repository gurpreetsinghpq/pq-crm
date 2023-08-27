import React, { useEffect, useState } from 'react'
import { IconAccounts, IconArrowSquareRight, IconBilling, IconBuildings, IconClock, IconCoinsHand, IconCross, IconCurrencyDollars, IconDeal, IconGlobe, IconIndustry, IconLeads, IconLocation, IconLock, IconOrgnaisation, IconProfile, IconRoles, IconShield, IconShipping, IconStackedCoins, IconStackedCoins2, IconStackedCoins3, IconUserCheck, IconUsers, IconUsersSearch, IconWallet } from '../icons/svgIcons'
import { IChildData, formatData } from './leads'
import { LeadInterface } from './table/columns'
import { Button } from '../ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'
import { BUDGET_RANGE, DOMAINS, INDUSTRY, LAST_FUNDING_STAGE, OWNERS, REGIONS, RETAINER_ADVANCE, ROLETYPE, SIZE_OF_COMPANY, SOURCES, STATUSES, TIME_TO_FILL } from '@/app/constants/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { IValueLabel } from '@/app/interfaces/interface'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'

const FormSchema = z.object({
    owners: z.string(),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    regions: z.string(),
    sources: z.string(),
    statuses: z.string(),
    search: z.string(),
    reasons: z.string(),
    role: z.string(),
    budget: z.string(),
    fulfilledBy: z.string(),
    locations: z.string(),
    fixedCtcBudget: z.string(),
    dealValue: z.string(),
    orgnaisationName: z.string(),
    registeredName: z.string(),
    headOfficeLocation: z.string(),
    accountType: z.string(),
    industry: z.string(),
    domain: z.string(),
    size: z.string(),
    lastFundingStage: z.string(),
    lastFundingAmount: z.string(),
    shippingAddress: z.string(),
    billingAddress: z.string(),
    retainerModel: z.string(),
    retainderAdvance: z.string(),
    esopRsusUl: z.string(),
    fixedBudgetUl: z.string(),
    timeToFill: z.string(),
    gstinVatGstNo: z.string()
})

const commonClasses = "focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"

function SideSheet({ parentData }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction } }) {

    const [showContactForm, setShowContactForm] = useState(true)

    const { childData: { row }, setChildDataHandler } = parentData

    const data: LeadInterface = row?.original

    function closeSideSheet() {
        setChildDataHandler('row', undefined)
    }


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            regions: labelToValue(data.region, REGIONS),
            sources: labelToValue(data.source, SOURCES),
            statuses: labelToValue(data.status, STATUSES),
            owners: labelToValue(data.owner, OWNERS),
            creators: ['allCreators'],
            search: "",
            role: labelToValue(data.role, ROLETYPE),
            budget: labelToValue(data.budgetRange, BUDGET_RANGE),
            fixedCtcBudget: ""
        }
    })

    const reasonMap: any = {
        "junk": ["Low Fixed CTC Budget", "Equity Only Role"],
        "lost": ["Lost to Competition", "No Third Party", "Closed Internally"],
        "deferred": ["Funding Awaited", "Role Deferred"]
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


    useEffect(() => {
        console.log(form.getValues("statuses"))
        // console.log(reasonMap[form.getValues("reasons")])
    }, [form.watch()])

    function labelToValue(lookup: string, arr: IValueLabel[]) {
        return arr.find((item) => item.label === lookup)?.value
    }
    console.log(data.contacts)

    return (
        <div className={`fixed flex flex-row z-[50] right-0 top-0 h-[100vh] w-[100vw] `}>
            <div className='w-full bg-gray-900 opacity-70 backdrop-blur-[8px] fade-in' onClick={closeSideSheet}>

            </div>
            <div className='absolute right-0 top-0 bottom-0 w-11/12 bg-white-900 opacity-100 slide-left'>
                <div className='absolute top-0 right-[100%] bg-white-900 p-[16px] rounded-l-[8px] cursor-pointer' onClick={closeSideSheet} >
                    <IconCross size={20} color={"#667085"} />
                </div>
                <div className='w-full h-full flex flex-row '>
                    <div className='relative pt-[24px] w-1/4 h-full flex flex-col '>
                        <div className='flex flex-col flex-1 overflow-y-auto scroll-style-one pr-[0px] '>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={commonClasses}>
                                                            <SelectValue defaultValue={field.value} placeholder="Select a Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            STATUSES.filter((status) => status.value !== 'allStatuses').map((status, index) => {
                                                                return <SelectItem key={index} value={status.value}>
                                                                    {status.label}
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
                                                        <SelectTrigger className={commonClasses}>
                                                            <SelectValue defaultValue={field.value} placeholder="Select Reason" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            reasonMap[form.getValues("statuses")].map((reason: string, index: number) => {
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
                            <div className="px-[6px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200 ">
                                <FormField
                                    control={form.control}
                                    name="sources"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div className='text-[#98A2B3]'>
                                                                <IconUsersSearch size={24} />
                                                            </div>
                                                            <SelectValue defaultValue={field.value} placeholder="Select a Status" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        SOURCES.filter((source) => source.value !== 'allSourcees').map((source, index) => {
                                                            return <SelectItem key={index} value={source.value}>
                                                                {source.label}
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
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                <FormField
                                    control={form.control}
                                    name="owners"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconUserCheck size={24} />
                                <FormField
                                    control={form.control}
                                    name="fulfilledBy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Fulfilled By" {...field} />
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconCurrencyDollars size={24} />
                                <FormField
                                    control={form.control}
                                    name="dealValue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Deal Value" {...field} />
                                            </FormLabel>
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
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div >
                                                                <IconRoles size={24} color="#98A2B3" />
                                                            </div>
                                                            <SelectValue defaultValue={field.value} placeholder="Select Role" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        ROLETYPE.map((role, index) => {
                                                            return <SelectItem key={index} value={role.value}>
                                                                {role.label}
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
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                <FormField
                                    control={form.control}
                                    name="regions"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
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
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                <FormField
                                    control={form.control}
                                    name="locations"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div >
                                                                <IconLocation size={24} color="#98A2B3" />
                                                            </div>
                                                            <SelectValue defaultValue={field.value} placeholder="Location" />
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
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                <FormField
                                    control={form.control}
                                    name="budget"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div >
                                                                <IconWallet size={24} color="#98A2B3" />
                                                            </div>
                                                            <SelectValue defaultValue={field.value} placeholder="Select Budget" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        BUDGET_RANGE.map((budget, index) => {
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
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconStackedCoins size={24} />
                                <FormField
                                    control={form.control}
                                    name="fixedCtcBudget"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Fixed CTC Budget" {...field} />
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconStackedCoins2 size={24} />
                                <FormField
                                    control={form.control}
                                    name="esopRsusUl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="ESOP/RSUs UL" {...field} />
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconDeal size={24} />
                                <FormField
                                    control={form.control}
                                    name="fixedBudgetUl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Fixed Budget UL" {...field} />
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                <FormField
                                    control={form.control}
                                    name="timeToFill"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div >
                                                                <IconClock size={24} color="#98A2B3" />
                                                            </div>
                                                            <SelectValue defaultValue={field.value} placeholder="Time to Fill" />
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
                                <span className='rounded-[6px] bg-purple-50 text-purple-700 px-[8px] py-[2px] text-xs font-medium border-[1px] border-purple-200'>Rockstar</span>
                            </span>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconOrgnaisation size={24} />
                                <FormField
                                    control={form.control}
                                    name="orgnaisationName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Orgnaisation Name" {...field} />
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconShield size={24} />
                                <FormField
                                    control={form.control}
                                    name="registeredName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Registered Name" {...field} />
                                            </FormLabel>
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
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div >
                                                                <IconIndustry size={24} color="#98A2B3" />
                                                            </div>
                                                            <SelectValue defaultValue={field.value} placeholder="Industry" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        INDUSTRY.map((industry, index) => {
                                                            return <SelectItem key={index} value={industry.value}>
                                                                {industry.label}
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
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                <FormField
                                    control={form.control}
                                    name="domain"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
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
                                            <FormMessage />
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
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
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
                                            <FormMessage />
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
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div >
                                                                <IconCoinsHand size={24} color="#98A2B3" />
                                                            </div>
                                                            <SelectValue defaultValue={field.value} placeholder="Last Funding Stage" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        LAST_FUNDING_STAGE.map((lastFundingStage, index) => {
                                                            return <SelectItem key={index} value={lastFundingStage.value}>
                                                                {lastFundingStage.label}
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
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconStackedCoins3 size={24} />
                                <FormField
                                    control={form.control}
                                    name="lastFundingAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Last Funding Amount" {...field} />
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconShipping size={24} />
                                <FormField
                                    control={form.control}
                                    name="shippingAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Shipping Address" {...field} />
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconBilling size={24} />
                                <FormField
                                    control={form.control}
                                    name="billingAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Billing Address" {...field} />
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[18px] py-[8px] text-sm font-semibold w-full flex flex-row  items-center opacity-50 border-b-[1px] border-gray-200">
                                <IconBilling size={24} />
                                <FormField
                                    control={form.control}
                                    name="gstinVatGstNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="GSTIN/VAT/GST No:" {...field} />
                                            </FormLabel>
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
                                    name="retainerModel"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div >
                                                                <IconOrgnaisation size={24} color="#98A2B3" />
                                                            </div>
                                                            <SelectValue defaultValue={field.value} placeholder="Retainer Model" />
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row border-b-[1px] border-gray-200">
                                <FormField
                                    control={form.control}
                                    name="retainderAdvance"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-[13px] items-center text-gray-700 ' >
                                                            <div >
                                                                <IconIndustry size={24} color="#98A2B3" />
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <span className='px-[16px] mt-[24px] mb-[12px] text-gray-700 text-sm font-medium flex flex-row justify-between items-center'>
                                <span>Contact Details</span>
                                <span className={`text-sm text-purple-700  ${!showContactForm ? 'opacity-[1] cursor-pointer' : 'opacity-[0.3] cursor-not-allowed'}`} >+ Add</span>

                            </span>
                            <div className='px-[16px]'>
                                {data.contacts.length > 0 && <div className='flex flex-col w-full mt-4  pr-[16px] scroll-style-one'>
                                    <div className='flex flex-col w-full'>
                                        {
                                            data.contacts.reverse().map((item: any, index: number) => (
                                                <div className='flex flex-col ' key={index} >
                                                    <div className='flex flex-col'>
                                                        <div className='flex flex-row justify-between w-full'>
                                                        {/* truncate w-[100px] */}
                                                            <span className='text-sm font-semibold flex-1'>
                                                                {item.contactName} - {item.designation}
                                                            </span>
                                                            {item?.contactType && item?.contactType?.trim() !== "" && <div>
                                                                <span className='text-xs text-purple-700 px-[6px] py-[2px] border border-[1px] bg-purple-50 border-purple-200 rounded-[6px] '>{item.contactType}</span>
                                                            </div>}
                                                        </div>
                                                        <div className='text-xs text-gray-600 font-normal'>
                                                            {item.email}
                                                        </div>
                                                        <div className='text-xs text-gray-600 font-normal'>
                                                            {item.countryCode} {item.phoneNo}
                                                        </div>
                                                    </div>

                                                    <Separator className='mt-[12px] mb-[8px]' />
                                                </div>
                                            ))
                                        }


                                    </div>
                                </div>}
                            </div>
                        </div>

                        <div className='w-full px-[24px] py-[16px] border border-gray-200 flex justify-end'>
                            <Button variant="default" disabled>Save</Button>
                        </div>
                    </div>
                    <div className="w-[1px] bg-gray-200 "></div>

                    <div className='p-[24px] w-3/4 h-full flex-1 flex flex-col'>
                        <div className='flex flex-row justify-end'>
                            <Button variant={'default'} className='flex flex-row gap-2'>Promote to Prospect <IconArrowSquareRight size={20} /></Button>
                        </div>
                        <div className='flex flex-row'>
                            <div className='flex flex-col w-full mt-[24px]'>
                                <Tabs defaultValue="account" className="w-full ">
                                    <TabsList className='w-full justify-start px-[24px]'>
                                        <IconLock size={24} />
                                        {tabs.map((tab) => {
                                            return <TabsTrigger value={tab.value}><div className='text-sm font-semibold '>{tab.label}</div></TabsTrigger>
                                        })}
                                    </TabsList>
                                    {
                                        tabs.map((tab) => {
                                            return <TabsContent value={tab.value}>{`you are in ${tab.label} Tab`}.</TabsContent>
                                        })
                                    }
                                </Tabs>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SideSheet