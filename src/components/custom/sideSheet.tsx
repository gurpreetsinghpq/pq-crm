import React, { useEffect } from 'react'
import { IconArrowSquareRight, IconCross, IconGlobe, IconLeads, IconLock, IconProfile, IconRoles, IconUserCheck, IconWallet } from '../icons/svgIcons'
import { IChildData, formatData } from './leads'
import { LeadInterface } from './table/columns'
import { Button } from '../ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'
import { BUDGET_RANGE, OWNERS, REGIONS, ROLETYPE, SOURCES, STATUSES } from '@/app/constants/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { IValueLabel } from '@/app/interfaces/interface'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'

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
    fulfilledBy:z.string()
})

const commonClasses = "focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"

function SideSheet({ parentData }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction } }) {

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
            budget: labelToValue(data.budgetRange, BUDGET_RANGE)
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
                            <div className="h-[1px] mt-[16px] w-full bg-gray-200 "></div>
                            <span className='px-[16px] my-[12px] text-gray-700 text-sm font-medium'>
                                Details
                            </span>
                            <div className="px-[6px] text-md font-medium w-full flex flex-row ">
                                <FormField
                                    control={form.control}
                                    name="sources"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-2 items-center text-gray-700 ' >
                                                            <div className='text-[#98A2B3]'>
                                                                <IconLeads size={24} />
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
                            <div className="h-[1px]  w-full bg-gray-200 "></div>
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row ">
                                <FormField
                                    control={form.control}
                                    name="owners"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-2 items-center text-gray-700 ' >
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
                            <div className="h-[1px] w-full bg-gray-200 "></div>
                            <div className="px-[18px] mt-[16px] text-sm font-semibold w-full flex flex-row  items-center opacity-50">
                                <IconUserCheck size={24} />
                                <FormField
                                    control={form.control}
                                    name="fulfilledBy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Input className='border-none' placeholder="Fulfilled By" {...field}/>
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="h-[1px] mt-[12px] w-full bg-gray-200 "></div>
                            <span className='px-[16px] mt-[18px] mb-[12px] text-gray-700 text-sm font-medium'>
                                Role Details
                            </span>
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row ">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-2 items-center text-gray-700 ' >
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
                            <div className="h-[1px]  w-full bg-gray-200 "></div>
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row ">
                                <FormField
                                    control={form.control}
                                    name="regions"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-2 items-center text-gray-700 ' >
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
                            <div className="h-[1px]  w-full bg-gray-200 "></div>
                            <div className="px-[6px] mt-[8px] text-md font-medium w-full flex flex-row ">
                                <FormField
                                    control={form.control}
                                    name="budget"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={'border-none mb-2 '}>
                                                        <div className='flex flex-row gap-2 items-center text-gray-700 ' >
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