"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { ArrowDown, ArrowDown01, ArrowDown01Icon, ArrowUpRight, Check, ChevronDown, ChevronDownIcon, ChevronsDown, Contact, Ghost, MoveDown, PencilIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRY_CODE as countryCode, TYPE as type, DESIGNATION as designation, LEAD_SOURCE as leadSource, BUDGET_RANGE as budgetRange, REGION as region, ROLETYPE as roleType, REGION, CREATORS, OWNERS, TYPE, DESIGNATION, ROLETYPE } from '@/app/constants/constants'
import { DialogClose } from '@radix-ui/react-dialog'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { toast, useToast } from '../ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { IconAccounts, IconAccounts2, IconContacts, IconCross, IconPencil, IconRoles, IconSave, IconTick } from '../icons/svgIcons'
import { Client, ClientCompleteInterface, ContactDetail, ContactPostBody, IValueLabel, LeadInterface } from '@/app/interfaces/interface'
// import { setData } from '@/app/dummy/dummydata'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import Image from 'next/image'
import { formatData, getToken } from './leads'
import Link from 'next/link'
import { PopoverClose } from '@radix-ui/react-popover'
import { preFilledClasses } from '@/app/constants/classes'


const commonClasses = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"


const FormSchema = z.object({
    organisationName: z.string({
        // required_error: "Please enter a name.",
    }).min(2),
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
    phone: "",
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


function AddContactDetailedDialog({ inputAccount, dataFromChild, details, filteredLeadData }: { inputAccount: string, dataFromChild: CallableFunction, details: ClientCompleteInterface | undefined, filteredLeadData: LeadInterface[] | undefined }) {


    const [budgetKey, setBudgetKey] = useState<number>(+new Date())
    const [formSchema2, setFormSchema2] = useState(FormSchema2)
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
        // console.log(form.getValues())

    }, [watcher1])
    useEffect(() => {
        console.log(form2.getValues())

    }, [watcher2])

    useEffect(() => {
        console.log("details", details)
        if (details?.name) {
            form.setValue("organisationName", details?.name)
        } else {
            form.setValue("organisationName", inputAccount)
        }

    }, [])

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

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        const token_superuser = getToken()
        const orgId = details?.id
        if (orgId) {
            const dataToSend: ContactPostBody = {
                name: form2.getValues("name"),
                designation: form2.getValues("designation"),
                email: form2.getValues("email"),
                organisation: details?.id,
                archived: false,
                phone: form2.getValues("phone"),
                std_code: form2.getValues("std_code"),
                type: form2.getValues("type")
            }
            try {
                const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/`, { method: "POST", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
                const result = await dataResp.json()
                console.log(result)
                dataFromChild()
                form.reset()
                resetForm2()
                toast({
                    title: "Contact Created Successfully!",
                    variant: "dark"
                })

            } catch (err) {
                console.log(err)
            }
        }
    }

    function specificValueFinder(lookupValue: string, array: any[]): IValueLabel {
        return array.find((item) => item.value === lookupValue)
    }


    function yesDiscard(): void {
        form.reset()
        resetForm2()
        dataFromChild()
    }

    function changeStdCode(value: string) {
        let updatedSchema
        console.log(value, value != "+91")
        if (value != "+91") {
            updatedSchema = FormSchema2.extend({
                phone: z.string().min(4).max(13)
            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema2
        }
        setFormSchema2(updatedSchema)
    }

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
            <div className='flex flex-col gap-6 px-[24px] py[24px]'>
                <Form {...form}>
                    <form className='left flex flex-col w-full' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="h-[24px] w-[24px] text-gray-500 rounded flex flex-row justify-center">
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
                                        <Input disabled={details?.name ? true : false} type="text" className={`mt-3 ${commonClasses} ${details?.name && preFilledClasses}`} placeholder="Organisation Name" {...field} />

                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {/* {filteredLeadData && filteredLeadData?.length > 0 && <Link href={`/dashboard?ids=${details?.name}`} target='_blank' className='mt-3 text-sm text-blue-600 flex flex-row gap-2 justify-end items-center font-medium cursor-pointer' >
                            <span>
                                {filteredLeadData?.length} Exisiting {filteredLeadData?.length === 1 ? "Lead" : "Leads"}
                            </span>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 12L12 4M12 4H6.66667M12 4V9.33333" stroke="#1570EF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>} */}
                    </form>
                </Form>
                <Form {...form2}>
                    <form className='right flex flex-col w-full' onSubmit={form2.handleSubmit(onSubmit2)}>
                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                <IconContacts size="20" color="#667085" />
                            </div>
                            <span className="text-xs text-gray-700">CONTACTS</span>
                            <div className="bg-gray-200 h-[1px] flex-1" ></div>
                        </div>
                        {<div className='flex flex-col'>
                            <FormField
                                control={form2.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" className={`mt-3 ${commonClasses}`} placeholder="Contact Name" {...field} />
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
                                                    <PopoverContent className="w-[270px] p-0 ">
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
                                                                                form2.setValue("designation", designation.value)
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={commonClasses}>
                                                            <SelectValue placeholder="Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            type.map((type, index) => {
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
                                            <Input type="email" className={`mt-3 ${commonClasses}`} placeholder="Email" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className='flex flex-row gap-2 items-center'>
                                <FormField
                                    control={form2.control}
                                    name="std_code"
                                    render={({ field }) => (
                                        <FormItem className='mt-3 w-max'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"google"} className="flex flex-row gap-2">
                                                            {countryCode.find((val) => val.value === field.value)?.value}
                                                            <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0 ml-[114px]">
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
                                                                            console.log("std_code", cc.value)
                                                                            changeStdCode(cc.value)
                                                                            form2.setValue("std_code", cc.value)
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
                                        <FormItem className='mt-3  w-3/4 flex-1'>
                                            <FormControl>
                                                <Input type="text" className={` ${commonClasses}`} placeholder="Phone No" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>}

                    </form>
                </Form>


            </div>
            <Separator className='mt-10' />
            <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                {/* <DialogClose asChild> */}
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
                {/* </DialogClose> */}
                <Button disabled={!(form.formState.isValid && form2.formState.isValid)} onClick={() => addToLead()}>Save & Add</Button>
            </div>

        </div >
    )
}

export default AddContactDetailedDialog

export function acronymFinder(lookupvalue: string, arr: IValueLabel[]) {
    return arr.find((val) => val.label === lookupvalue)?.acronym
}

export function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}