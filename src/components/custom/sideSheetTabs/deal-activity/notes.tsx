import { commonClasses, commonFontClassesAddDialog, commonNumericIconClasses } from '@/app/constants/classes'
import { ACTIVITY_TYPE, COLLATERAL_SHARED, DEAL_STATUS, EXPECTED_SERVICE_FEE_RANGE, MODE, NEGOTIATION_BLOCKER, NEXT_STEP, OPEN_TO_ENGAGE, OPEN_TO_MIN_SERVICE_OR_FLAT_FEE, OPEN_TO_RETAINER_MODEL, PROPOSAL_SHARED, PROSPECT_STATUS_NOTES, RESPONSE_RECEIVED, ROLE_CLARITY, ROLE_STATUS, ROLE_URGENCY, SERVICE_CONTRACT_DRAFT_SHARED, WILLING_TO_PAY } from '@/app/constants/constants'
import { IconActivityType, IconContacts, IconMode, IconNextStep } from '@/components/icons/svgIcons'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getContacts } from '../custom-stepper'



const FormSchema = z.object({
    activityType: z.string({
        // required_error: "Please enter a name.",
    }),
    contact: z.array(z.string()),
    mode: z.string({
    }),
    nextStep: z.string({
    }).optional(),
    roleStatus: z.string().optional(),
    roleUrgency: z.string({
    }).optional(),
    openToRetainerModel: z.string({
    }).optional(),
    openToMinServiceFeeOrFlatFee: z.string({}).optional(),
    collateralShared: z.string({}).optional(),
    responseReceived: z.string({}).optional(),
    openToEngage: z.string({}).optional(),
    roleClarity: z.string({}).optional(),
    willingToPayRA: z.string({}).optional(),
    expectedServiceFeeRange: z.string({}).optional(),
    proposalShared: z.string({}).optional(),
    relatedTo: z.string({}).optional(),
    prospectStatus: z.string({}).optional(),
    dealStatus: z.string({}).optional(),
    negotiationBlocker: z.string({}).optional(),
    serviceContractDraftShared: z.string({}).optional(),
})

const FormSchemaWhenColdOutreachAndInbound = z.object({
    roleStatus: z.string({
    }),
    roleUrgency: z.string({
    }),
    openToRetainerModel: z.string({
    }),
    openToMinServiceFeeOrFlatFee: z.string({

    }),
    collateralShared: z.string({
    })
})

const FormSchemaWhenColdOutreach = z.object({
    responseReceived: z.string({
    }),
    roleStatus: z.string({
    }),
    collateralShared: z.string({
    }),
    openToEngage: z.string({
    }),
})

const FormSchemaWhenExploratoryMeeting = z.object({
    roleStatus: z.string({
    }),
    roleClarity: z.string({
    }),
    willingToPayRA: z.string({
    }),
    expectedServiceFeeRange: z.string({
    }),
    proposalShared: z.string({
    }),
})

const FormSchemaWhenFollowUp = z.object({
    relatedTo: z.string({
    }),
    roleStatus: z.string({
    }),
    willingToPayRA: z.string({
    }),
    expectedServiceFeeRange: z.string({
    }),
    prospectStatus: z.string({
    }),
})

const FormSchemaWhenNegotiation = z.object({
    dealStatus: z.string({
    }),
    negotiationBlocker: z.string({
    }),
    serviceContractDraftShared: z.string({
    }),
})

function Notes({ contactFromParents }: { contactFromParents: any }) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {

        }
    })

    const watcher = form.watch()

    useEffect(() => {
        const subscription = form.watch(() => {

        })
        return () => subscription.unsubscribe()
    }, [form.watch])

    const isFirstForm = (form.getValues("activityType")?.toLowerCase() === "coldoutreach") && (form.getValues("mode")?.toLowerCase() === "call" || form.getValues("mode")?.toLowerCase() === "vc" || form.getValues("mode")?.toLowerCase() === "inperson")
    const isSecondForm = (form.getValues("activityType")?.toLowerCase() === "coldoutreach") && (form.getValues("mode")?.toLowerCase() === "email" || form.getValues("mode")?.toLowerCase() === "linkedin")
    const isThirdForm = (form.getValues("activityType")?.toLowerCase() === "exploratorydiscussion")
    const isFourthForm = (form.getValues("activityType")?.toLowerCase() === "followup")
    const isFifthForm = (form.getValues("activityType")?.toLowerCase() === "negotiation")
    const isSixthForm = (form.getValues("activityType")?.toLowerCase() === "inboundleadverification") && (form.getValues("mode")?.toLowerCase() === "call" || form.getValues("mode")?.toLowerCase() === "vc" || form.getValues("mode")?.toLowerCase() === "inperson")
    const isSeventhForm = (form.getValues("activityType")?.toLowerCase() === "inboundleadverification") && (form.getValues("mode")?.toLowerCase() === "email" || form.getValues("mode")?.toLowerCase() === "linkedin")

    const isAnyForm = [isFirstForm, isSecondForm, isThirdForm, isFourthForm, isFifthForm, isSixthForm, isSeventhForm].some((val) => val === true)
    console.log(isFirstForm, isSecondForm, isThirdForm, isFourthForm, isFifthForm)

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }
    console.log(form.getValues())
    const CONTACTS_FROM_PARENT: any = contactFromParents

    console.log("contactFromParents", contactFromParents)

    return (
        <Form {...form}>
            <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col rounded-[8px] bg-white-900 border-[1px] border-gray-200'>
                    <div className='px-[28px] py-[24px] w-full '>
                        <div className=' flex flex-col gap-[28px]'>
                            <div className='max-w-[800px] flex flex-col gap-[16px]'>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconActivityType />
                                        <div className='text-md text-gray-500 font-normal'>Activity Type</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="activityType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Select Activity" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                ACTIVITY_TYPE.map((region, index) => {
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
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconContacts size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Contact</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="contact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className={`flex flex-row gap-2 w-full justify-between px-[12px] ${commonFontClassesAddDialog}`}>
                                                                    {
                                                                        field?.value?.length > 0 ? (
                                                                            getContacts(field.value.map(contactId => {
                                                                                const contact = CONTACTS_FROM_PARENT.find((contact: any) => contact.id === contactId);
                                                                                return contact ? contact.name : null;
                                                                            }))
                                                                        ) : (
                                                                            <span className='text-muted-foreground'>Contact</span>
                                                                        )
                                                                    }
                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[430px] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Search Contact" />
                                                                <CommandEmpty>No Contact found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {CONTACTS_FROM_PARENT.map((contact: any, index: any) => (
                                                                            <CommandItem
                                                                                value={contact.id}
                                                                                key={contact.id}
                                                                                onSelect={() => {
                                                                                    console.log(field.value)
                                                                                    if (field?.value?.length > 0) {
                                                                                        if (field?.value?.includes(contact.id)) {
                                                                                            form.setValue("contact", [...field.value.filter((value: string) => value !== contact.id)])
                                                                                        } else {
                                                                                            form.setValue("contact", [...field.value, contact.id])
                                                                                        }
                                                                                    } else {
                                                                                        form.setValue("contact", [contact.id])
                                                                                    }

                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {contact.name}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value?.includes(contact.id)
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
                                </div>
                                <div className='flex flex-row gap-[16px] w-full'>
                                    <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                        <IconMode size="24" color="#98A2B3" />
                                        <div className='text-md text-gray-500 font-normal'>Mode</div>
                                    </div>
                                    <div className='flex-1 w-[60%]'>
                                        <FormField
                                            control={form.control}
                                            name="mode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Select Mode" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                MODE.map((mode, index) => {
                                                                    return <SelectItem key={index} value={mode.value}>
                                                                        {mode.label}
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
                            </div>
                            {isAnyForm && <div className='flex flex-col gap-[24px]'>
                                <div className='flex flex-row gap-[10px] items-center'>
                                    <div className='text-purple-700 text-sm font-bold'>Activity Note</div>
                                    <div className="bg-gray-200 h-[1px] flex-1" ></div>
                                </div>
                                {isFirstForm && <div className='flex flex-col gap-[16px] w-full max-w-[800px]'>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>1</div>
                                            <div className='text-md text-gray-500 font-normal'>Role Status</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="roleStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Role Status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    ROLE_STATUS.map((roleStatus, index) => {
                                                                        return <SelectItem key={index} value={roleStatus.value}>
                                                                            {roleStatus.label}
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
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>2</div>
                                            <div className='text-md text-gray-500 font-normal'>Role Urgency</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="roleUrgency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Role Urgency" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    ROLE_URGENCY.map((roleUrgency, index) => {
                                                                        return <SelectItem key={index} value={roleUrgency.value}>
                                                                            {roleUrgency.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>3</div>
                                            <div className='text-md text-gray-500 font-normal'>Open to Retainer Model</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="openToRetainerModel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Open to Retainer  Model" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    OPEN_TO_RETAINER_MODEL.map((openToRetainerModel, index) => {
                                                                        return <SelectItem key={index} value={openToRetainerModel.value}>
                                                                            {openToRetainerModel.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>4</div>
                                            <div className='text-md text-gray-500 font-normal'>Open to Min Service Fee or Flat Fee</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="openToMinServiceFeeOrFlatFee"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Open to Min Service Fee or Flat Fee" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    OPEN_TO_MIN_SERVICE_OR_FLAT_FEE.map((openToMinServiceOrFlatFee, index) => {
                                                                        return <SelectItem key={index} value={openToMinServiceOrFlatFee.value}>
                                                                            {openToMinServiceOrFlatFee.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>5</div>
                                            <div className='text-md text-gray-500 font-normal'>Collateral Shared</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="collateralShared"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Collateral Shared" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    COLLATERAL_SHARED.map((collateralShared, index) => {
                                                                        return <SelectItem key={index} value={collateralShared.value}>
                                                                            {collateralShared.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>}
                                {
                                    isSecondForm && <div className='flex flex-col gap-[16px] w-full max-w-[800px]'>
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>1</div>
                                                <div className='text-md text-gray-500 font-normal'>Response Received</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="responseReceived"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Response Received" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        RESPONSE_RECEIVED.map((responseReceived, index) => {
                                                                            return <SelectItem key={index} value={responseReceived.value}>
                                                                                {responseReceived.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>2</div>
                                                <div className='text-md text-gray-500 font-normal'>Role Status</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="roleStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Role Status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        ROLE_STATUS.map((roleStatus, index) => {
                                                                            return <SelectItem key={index} value={roleStatus.value}>
                                                                                {roleStatus.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>3</div>
                                                <div className='text-md text-gray-500 font-normal'>Collateral Shared</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="collateralShared"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Collateral Shared" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        COLLATERAL_SHARED.map((collateralShared, index) => {
                                                                            return <SelectItem key={index} value={collateralShared.value}>
                                                                                {collateralShared.label}
                                                                            </SelectItem>
                                                                        })
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>4</div>
                                                <div className='text-md text-gray-500 font-normal'>Open to Engage</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="openToEngage"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Open to Engage" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        OPEN_TO_ENGAGE.map((openToEngage, index) => {
                                                                            return <SelectItem key={index} value={openToEngage.value}>
                                                                                {openToEngage.label}
                                                                            </SelectItem>
                                                                        })
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    isThirdForm && <div className='flex flex-col gap-[16px] w-full max-w-[800px]'>
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>1</div>
                                                <div className='text-md text-gray-500 font-normal'>Role Status</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="roleStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Role Status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        ROLE_STATUS.map((roleStatus, index) => {
                                                                            return <SelectItem key={index} value={roleStatus.value}>
                                                                                {roleStatus.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>2</div>
                                                <div className='text-md text-gray-500 font-normal'>Role Clarity</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="roleClarity"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Role Clarity" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        ROLE_CLARITY.map((roleClarity, index) => {
                                                                            return <SelectItem key={index} value={roleClarity.value}>
                                                                                {roleClarity.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>3</div>
                                                <div className='text-md text-gray-500 font-normal'>Willing to Pay RA</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="willingToPayRA"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Willing to Pay RA" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        WILLING_TO_PAY.map((willingToPay, index) => {
                                                                            return <SelectItem key={index} value={willingToPay.value}>
                                                                                {willingToPay.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>4</div>
                                                <div className='text-md text-gray-500 font-normal'>Expected Service Fee Range</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="expectedServiceFeeRange"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Expected Service Fee Range" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        EXPECTED_SERVICE_FEE_RANGE.map((expectedServiceFeeRange, index) => {
                                                                            return <SelectItem key={index} value={expectedServiceFeeRange.value}>
                                                                                {expectedServiceFeeRange.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>5</div>
                                                <div className='text-md text-gray-500 font-normal'>Proposal Shared</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="proposalShared"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Proposal Shared" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        PROPOSAL_SHARED.map((proposalShared, index) => {
                                                                            return <SelectItem key={index} value={proposalShared.value}>
                                                                                {proposalShared.label}
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
                                    </div>
                                }
                                {
                                    isFourthForm && <div className='flex flex-col gap-[16px] w-full max-w-[800px]'>
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>1</div>
                                                <div className='text-md text-gray-500 font-normal'>Related To</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="relatedTo"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Related To" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        ROLE_CLARITY.map((roleClarity, index) => {
                                                                            return <SelectItem key={index} value={roleClarity.value}>
                                                                                {roleClarity.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>2</div>
                                                <div className='text-md text-gray-500 font-normal'>Role Status</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="roleStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Role Status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        ROLE_STATUS.map((roleStatus, index) => {
                                                                            return <SelectItem key={index} value={roleStatus.value}>
                                                                                {roleStatus.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>3</div>
                                                <div className='text-md text-gray-500 font-normal'>Willing to Pay RA</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="willingToPayRA"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Willing to Pay RA" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        WILLING_TO_PAY.map((willingToPay, index) => {
                                                                            return <SelectItem key={index} value={willingToPay.value}>
                                                                                {willingToPay.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>4</div>
                                                <div className='text-md text-gray-500 font-normal'>Expected Service Fee Range</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="expectedServiceFeeRange"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Expected Service Fee Range" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        EXPECTED_SERVICE_FEE_RANGE.map((expectedServiceFeeRange, index) => {
                                                                            return <SelectItem key={index} value={expectedServiceFeeRange.value}>
                                                                                {expectedServiceFeeRange.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>5</div>
                                                <div className='text-md text-gray-500 font-normal'>Prospect Status</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="prospectStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Prospect Status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        PROSPECT_STATUS_NOTES.map((prospectStatusNotes, index) => {
                                                                            return <SelectItem key={index} value={prospectStatusNotes.value}>
                                                                                {prospectStatusNotes.label}
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

                                    </div>
                                }
                                {
                                    isFifthForm && <div className='flex flex-col gap-[16px] w-full max-w-[800px]'>
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>1</div>
                                                <div className='text-md text-gray-500 font-normal'>Deal Status</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="dealStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Deal Status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        DEAL_STATUS.map((dealStatus, index) => {
                                                                            return <SelectItem key={index} value={dealStatus.value}>
                                                                                {dealStatus.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>2</div>
                                                <div className='text-md text-gray-500 font-normal'>Negotiation Blocker</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="negotiationBlocker"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Negotiation Blocker" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        NEGOTIATION_BLOCKER.map((negotiationBlocker, index) => {
                                                                            return <SelectItem key={index} value={negotiationBlocker.value}>
                                                                                {negotiationBlocker.label}
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
                                        <div className='flex flex-row gap-[16px]'>
                                            <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                                <div className={commonNumericIconClasses}>3</div>
                                                <div className='text-md text-gray-500 font-normal'>Service Contract Draft Shared</div>
                                            </div>
                                            <div className='flex-1 w-[60%]'>
                                                <FormField
                                                    control={form.control}
                                                    name="serviceContractDraftShared"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={(value) => {
                                                                return field.onChange(value)
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                        <SelectValue placeholder="Select Service Contract Draft Shared" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        SERVICE_CONTRACT_DRAFT_SHARED.map((serviceContractDraftShared, index) => {
                                                                            return <SelectItem key={index} value={serviceContractDraftShared.value}>
                                                                                {serviceContractDraftShared.label}
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
                                    </div>
                                }
                                {isSixthForm && <div className='flex flex-col gap-[16px] w-full max-w-[800px]'>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>1</div>
                                            <div className='text-md text-gray-500 font-normal'>Role Urgency</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="roleUrgency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Role Urgency" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    ROLE_URGENCY.map((roleUrgency, index) => {
                                                                        return <SelectItem key={index} value={roleUrgency.value}>
                                                                            {roleUrgency.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>2</div>
                                            <div className='text-md text-gray-500 font-normal'>Open to Retainer Model</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="openToRetainerModel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Open to Retainer  Model" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    OPEN_TO_RETAINER_MODEL.map((openToRetainerModel, index) => {
                                                                        return <SelectItem key={index} value={openToRetainerModel.value}>
                                                                            {openToRetainerModel.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>3</div>
                                            <div className='text-md text-gray-500 font-normal'>Open to Min Service Fee or Flat Fee</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="openToMinServiceFeeOrFlatFee"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Open to Min Service Fee or Flat Fee" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    OPEN_TO_MIN_SERVICE_OR_FLAT_FEE.map((openToMinServiceOrFlatFee, index) => {
                                                                        return <SelectItem key={index} value={openToMinServiceOrFlatFee.value}>
                                                                            {openToMinServiceOrFlatFee.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>4</div>
                                            <div className='text-md text-gray-500 font-normal'>Collateral Shared</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="collateralShared"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Collateral Shared" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    COLLATERAL_SHARED.map((collateralShared, index) => {
                                                                        return <SelectItem key={index} value={collateralShared.value}>
                                                                            {collateralShared.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>}
                                {isSeventhForm && <div className='flex flex-col gap-[16px] w-full max-w-[800px]'>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>1</div>
                                            <div className='text-md text-gray-500 font-normal'>Response Received</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="responseReceived"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Response Received" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    RESPONSE_RECEIVED.map((responseReceived, index) => {
                                                                        return <SelectItem key={index} value={responseReceived.value}>
                                                                            {responseReceived.label}
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
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>2</div>
                                            <div className='text-md text-gray-500 font-normal'>Open to Retainer Model</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="openToRetainerModel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Open to Retainer  Model" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    OPEN_TO_RETAINER_MODEL.map((openToRetainerModel, index) => {
                                                                        return <SelectItem key={index} value={openToRetainerModel.value}>
                                                                            {openToRetainerModel.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>3</div>
                                            <div className='text-md text-gray-500 font-normal'>Open to Min Service Fee or Flat Fee</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="openToMinServiceFeeOrFlatFee"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Open to Min Service Fee or Flat Fee" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    OPEN_TO_MIN_SERVICE_OR_FLAT_FEE.map((openToMinServiceOrFlatFee, index) => {
                                                                        return <SelectItem key={index} value={openToMinServiceOrFlatFee.value}>
                                                                            {openToMinServiceOrFlatFee.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <div className={commonNumericIconClasses}>4</div>
                                            <div className='text-md text-gray-500 font-normal'>Collateral Shared</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="collateralShared"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Collateral Shared" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    COLLATERAL_SHARED.map((collateralShared, index) => {
                                                                        return <SelectItem key={index} value={collateralShared.value}>
                                                                            {collateralShared.label}
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>}
                            </div>}
                            <div className='flex flex-col gap-[24px]'>
                                <div className='flex flex-row gap-[10px] items-center'>
                                    <div className='text-purple-700 text-sm font-bold'>Next Step</div>
                                    <div className="bg-gray-200 h-[1px] flex-1" ></div>
                                </div>
                                <div className='flex flex-col gap-[16px] w-full max-w-[800px]'>
                                    <div className='flex flex-row gap-[16px]'>
                                        <div className='flex flex-row gap-[8px] items-center w-[40%]'>
                                            <IconNextStep />
                                            <div className='text-md text-gray-500 font-normal'>Next Step</div>
                                        </div>
                                        <div className='flex-1 w-[60%]'>
                                            <FormField
                                                control={form.control}
                                                name="roleStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Next Step" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    NEXT_STEP.map((nextStep, index) => {
                                                                        return <SelectItem key={index} value={nextStep.value}>
                                                                            {nextStep.label}
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
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="bg-gray-200 h-[1px]  mt-8" />
                    <div className="flex flex-row gap-2 justify-end p-[16px]">
                        {/* <Button variant={"google"} >Cancel</Button> */}
                        <Button >Save </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default Notes