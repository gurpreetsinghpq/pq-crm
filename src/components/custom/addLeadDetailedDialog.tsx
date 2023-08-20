import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { ArrowDown, ArrowDown01, ArrowDown01Icon, ArrowUpRight, Check, ChevronDownIcon, ChevronsDown, MoveDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRY_CODE as countryCode, TYPE as type, DESIGNATION as designation, LEAD_SOURCE as leadSource, BUDGET_RANGE as budgetRange, REGION as region, ROLETYPE as roleType } from '@/app/constants/constants'
import { DialogClose } from '@radix-ui/react-dialog'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { toast } from '../ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'

interface SelectBoxState {
    region: {
        open: boolean,
        value: string
    },
    roleType: {
        open: boolean,
        value: string
    },
    budgetRange: {
        open: boolean,
        value: string
    },
    leadsSource: {
        open: boolean,
        value: string
    },
    designation: {
        open: boolean,
        value: string
    },
    type: {
        open: boolean,
        value: string
    }
}

const selectBoxState: SelectBoxState = {
    region: {
        open: false,
        value: ""
    },
    roleType: {
        open: false,
        value: ""
    },
    budgetRange: {
        open: false,
        value: ""
    },
    leadsSource: {
        open: false,
        value: ""
    },
    designation: {
        open: false,
        value: ""
    },
    type: {
        open: false,
        value: ""
    }
}

type Inputs = {
    contact: string,
    email: string,
    phoneNo: string,
    designation: string,
    role: string
};

const FormSchema = z.object({
    organisationName: z.string({
        required_error: "Please enter a name.",
    }),
    region: z.string({
        required_error: "Please select a region"
    }),
    roleType: z.string({
        required_error: "Please select role type"
    }),
    budget: z.string({
        required_error: "Please select budget range"
    }),
    leadSource: z.string({
        required_error: "Please select a lead source"
    }),
})

const FormSchema2 = z.object({
    contactName: z.string({
        required_error: "Please enter a name.",
    }),
    designation: z.string({
        required_error: "Please select designation.",
    }),
    contactType: z.string({
        required_error: "Please select contact type"
    }),
    email: z.string({
        required_error: "Please select email"
    }),
    phoneNo: z.string({
        required_error: "Please select Phone No."
    }),
    countryCode:  z.string({
        required_error: "Please select designation.",
    }),
})

const FormSchema3 = z.object({
    allContacts: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one contact.",
    }),
})


function AddLeadDetailedDialog({ children }: { children: any }) {

    const [dummyContactData, setDummyContactData] = useState<any>([])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            // organisationName: "",
            // budget: "uptoInr1cr",
            // leadSource: "linkedin"
        }
    })

    const form2 = useForm<z.infer<typeof FormSchema2>>({
        resolver: zodResolver(FormSchema2),
        defaultValues: {
            // organisationName: "",
            // budget: "uptoInr1cr",
            // leadSource: "linkedin"
            countryCode: "+91"
        }
    })

    const form3 = useForm<z.infer<typeof FormSchema3>>({
        resolver: zodResolver(FormSchema3),
        defaultValues: {
            // organisationName: "",
            // budget: "uptoInr1cr",
            // leadSource: "linkedin"
        }
    })

    function addContact() {
        setDummyContactData((prevValues: any) => {
            return [...prevValues, form2.getValues()]
        })
    }
    console.log(dummyContactData)

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

    function onSubmit3(data: z.infer<typeof FormSchema3>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }



    const [value, setValue] = React.useState("")

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 ">
                    <DialogHeader >
                        <DialogTitle className="px-[24px] pt-[30px] pb-[10px]">
                            <span className="text-lg">Add Lead</span>
                        </DialogTitle>
                    </DialogHeader>
                    <Separator className="bg-gray-200 h-[1px] w-full " />
                    <div className='flex flex-row gap-6 px-[24px] py[24px] w-[800px]'>
                        <Form {...form}>
                            <form className='left f7lex flex-col w-1/2' onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-row gap-[10px] items-center">
                                    <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 20 20" fill="none">
                                            <g id="building-03">
                                                <path id="Icon" d="M6.25 5.83333H8.54166M6.25 9.16667H8.54166M6.25 12.5H8.54166M11.4583 5.83333H13.75M11.4583 9.16667H13.75M11.4583 12.5H13.75M16.6667 17.5V5.16667C16.6667 4.23325 16.6667 3.76654 16.485 3.41002C16.3252 3.09641 16.0703 2.84144 15.7566 2.68166C15.4001 2.5 14.9334 2.5 14 2.5H6C5.06658 2.5 4.59987 2.5 4.24335 2.68166C3.92974 2.84144 3.67478 3.09641 3.51499 3.41002C3.33333 3.76654 3.33333 4.23325 3.33333 5.16667V17.5M18.3333 17.5H1.66666" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-700">ACCOUNT</span>
                                    <div className="bg-gray-200 h-[1px] w-full" />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="organisationName"
                                    render={({ field }) => (
                                        <Input type="text" className='mt-3 ' placeholder="Enter organisation name" {...field} />
                                    )}
                                />
                                <div className='mt-3 text-sm text-blue-600 flex flex-row gap-2 justify-end items-center font-medium cursor-pointer'>
                                    <span>
                                        2 Existing Leads
                                    </span>
                                    {/* <ArrowUpRight className='text-blue-600 h-[18px] w-[18px]'/> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 12L12 4M12 4H6.66667M12 4V9.33333" stroke="#1570EF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                <div className="flex flex-row gap-[10px] items-center  mt-4">
                                    <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                        <svg width="auto" height="auto" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="briefcase-01">
                                                <path id="Icon" d="M13.3334 5.83333C13.3334 5.05836 13.3334 4.67087 13.2482 4.35295C13.0171 3.49022 12.3432 2.81635 11.4805 2.58519C11.1625 2.5 10.7751 2.5 10.0001 2.5C9.22511 2.5 8.83762 2.5 8.5197 2.58519C7.65697 2.81635 6.9831 3.49022 6.75193 4.35295C6.66675 4.67087 6.66675 5.05836 6.66675 5.83333M4.33342 17.5H15.6667C16.6002 17.5 17.0669 17.5 17.4234 17.3183C17.737 17.1586 17.992 16.9036 18.1518 16.59C18.3334 16.2335 18.3334 15.7668 18.3334 14.8333V8.5C18.3334 7.56658 18.3334 7.09987 18.1518 6.74335C17.992 6.42975 17.737 6.17478 17.4234 6.01499C17.0669 5.83333 16.6002 5.83333 15.6667 5.83333H4.33341C3.39999 5.83333 2.93328 5.83333 2.57676 6.01499C2.26316 6.17478 2.00819 6.42975 1.8484 6.74335C1.66675 7.09987 1.66675 7.56658 1.66675 8.5V14.8333C1.66675 15.7668 1.66675 16.2335 1.8484 16.59C2.00819 16.9036 2.26316 17.1586 2.57676 17.3183C2.93328 17.5 3.39999 17.5 4.33342 17.5Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-700">ROLE</span>
                                    <div className="bg-gray-200 h-[1px] w-full" />
                                </div>
                                <div className='flex flex-col mt-3 w-full'>
                                    <FormField
                                        control={form.control}
                                        name="region"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a region" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            region.map((region) => {
                                                                return <SelectItem value={region.value}>
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
                                <div className='flex flex-col mt-3 w-full'>
                                    <FormField
                                        control={form.control}
                                        name="roleType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Role Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            roleType.map((roleType) => {
                                                                return <SelectItem value={roleType.value}>
                                                                    {roleType.label}
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
                                <div className='flex flex-col mt-3 w-full'>
                                    <FormField
                                        control={form.control}
                                        name="budget"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Budget Range" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            budgetRange.map((budgetRange) => {
                                                                return <SelectItem value={budgetRange.value}>
                                                                    {budgetRange.label}
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
                                <div className="flex flex-row gap-[10px] items-center  mt-4">
                                    {/* <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                    <svg width="auto" height="auto" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="briefcase-01">
                                            <path id="Icon" d="M13.3334 5.83333C13.3334 5.05836 13.3334 4.67087 13.2482 4.35295C13.0171 3.49022 12.3432 2.81635 11.4805 2.58519C11.1625 2.5 10.7751 2.5 10.0001 2.5C9.22511 2.5 8.83762 2.5 8.5197 2.58519C7.65697 2.81635 6.9831 3.49022 6.75193 4.35295C6.66675 4.67087 6.66675 5.05836 6.66675 5.83333M4.33342 17.5H15.6667C16.6002 17.5 17.0669 17.5 17.4234 17.3183C17.737 17.1586 17.992 16.9036 18.1518 16.59C18.3334 16.2335 18.3334 15.7668 18.3334 14.8333V8.5C18.3334 7.56658 18.3334 7.09987 18.1518 6.74335C17.992 6.42975 17.737 6.17478 17.4234 6.01499C17.0669 5.83333 16.6002 5.83333 15.6667 5.83333H4.33341C3.39999 5.83333 2.93328 5.83333 2.57676 6.01499C2.26316 6.17478 2.00819 6.42975 1.8484 6.74335C1.66675 7.09987 1.66675 7.56658 1.66675 8.5V14.8333C1.66675 15.7668 1.66675 16.2335 1.8484 16.59C2.00819 16.9036 2.26316 17.1586 2.57676 17.3183C2.93328 17.5 3.39999 17.5 4.33342 17.5Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </div> */}
                                    <span className="text-xs text-gray-700">DETAILS</span>
                                    <div className="bg-gray-200 h-[1px] w-full" />
                                </div>
                                <div className='flex flex-col mt-3 w-full'>
                                    <FormField
                                        control={form.control}
                                        name="leadSource"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Lead Source" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            leadSource.map((leadSource) => {
                                                                return <SelectItem value={leadSource.value}>
                                                                    {leadSource.label}
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
                            </form>
                        </Form>
                        <Separator orientation='vertical' />
                        <Form {...form}>
                            <form className='right flex flex-col w-1/2' onSubmit={form2.handleSubmit(onSubmit2)}>

                                <div className="flex flex-row gap-[10px] items-center">
                                    <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                        <svg width="auto" height="auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="user-square">
                                                <path id="Icon" d="M4.00002 21.8174C4.6026 22 5.41649 22 6.8 22H17.2C18.5835 22 19.3974 22 20 21.8174M4.00002 21.8174C3.87082 21.7783 3.75133 21.7308 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H17.2C18.8802 2 19.7202 2 20.362 2.32698C20.9265 2.6146 21.3854 3.07354 21.673 3.63803C22 4.27976 22 5.11984 22 6.8V17.2C22 18.8802 22 19.7202 21.673 20.362C21.3854 20.9265 20.9265 21.3854 20.362 21.673C20.2487 21.7308 20.1292 21.7783 20 21.8174M4.00002 21.8174C4.00035 21.0081 4.00521 20.5799 4.07686 20.2196C4.39249 18.6329 5.63288 17.3925 7.21964 17.0769C7.60603 17 8.07069 17 9 17H15C15.9293 17 16.394 17 16.7804 17.0769C18.3671 17.3925 19.6075 18.6329 19.9231 20.2196C19.9948 20.5799 19.9996 21.0081 20 21.8174M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5Z" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-700">CONTACT</span>
                                    <div className="bg-gray-200 h-[1px] flex-1" />
                                    <div className='text-sm text-purple-700 cursor-pointer' onClick={addContact}>+ Add</div>
                                </div>
                                {dummyContactData.length > 0 && <div className='flex flex-col w-full mt-4 h-[150px] overflow-y-scroll pr-[16px] scroll-style-one'>
                                    <form onSubmit={form3.handleSubmit(onSubmit3)} className='flex flex-row w-full'>
                                        <FormField
                                            control={form3.control}
                                            name="allContacts"
                                            render={() => (
                                                <FormItem className='w-full'>
                                                    {dummyContactData.reverse().map((item: any) => (
                                                        <FormField
                                                            key={item.email}
                                                            control={form3.control}
                                                            name="allContacts"
                                                            render={({ field }) => {
                                                                return (
                                                                    <div className='flex flex-col '>
                                                                        <FormItem
                                                                            key={item.email}
                                                                            className="flex flex-row items-start space-x-3 space-y-0 w-full "
                                                                        >
                                                                            <FormControl >
                                                                                <Checkbox
                                                                                    className='mt-[2px]'
                                                                                    checked={field.value?.includes(item.email)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        return checked
                                                                                            ? field.onChange([...field.value, item.email])
                                                                                            : field.onChange(
                                                                                                field.value?.filter(
                                                                                                    (value) => value !== item.email
                                                                                                )
                                                                                            )
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="text-sm font-normal w-full">
                                                                                <div className='flex flex-col'>
                                                                                    <div className='flex flex-row justify-between w-full'>
                                                                                        <span className='text-sm font-semibold '>
                                                                                            {item.contactName} - {item.designation}
                                                                                        </span>
                                                                                        <span className='text-xs text-purple-700 px-[6px] py-[2px] border border-[1px] bg-purple-50 border-purple-200 rounded-[6px]'>{item.contactType}</span>
                                                                                    </div>
                                                                                    <div className='text-xs text-gray-600'>
                                                                                        {item.email}
                                                                                    </div>
                                                                                    <div className='text-xs text-gray-600'>
                                                                                        {item.phoneNo}
                                                                                    </div>
                                                                                </div>
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                        <Separator className='mt-[12px] mb-[8px]' />
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </div>}
                                <FormField
                                    control={form2.control}
                                    name="contactName"
                                    render={({ field }) => (
                                        <Input type="text" className='mt-3 ' placeholder="Enter organisation name" {...field} />
                                    )}
                                />
                                <div className='flex flex-row gap-4 mt-3'>
                                    <div className='flex flex-col  w-full'>
                                        <FormField
                                            control={form2.control}
                                            name="designation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Designation" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                designation.map((designation) => {
                                                                    return <SelectItem value={designation.value}>
                                                                        {designation.label}
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
                                    <div className='flex flex-col w-full'>
                                        <FormField
                                            control={form2.control}
                                            name="contactType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Type (Optional)" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                type.map((type) => {
                                                                    return <SelectItem value={type.value}>
                                                                        {type.label}
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
                                <FormField
                                    control={form2.control}
                                    name="email"
                                    render={({ field }) => (
                                        <Input type="email" className='mt-3 ' placeholder="Email" {...field} />
                                    )}
                                />
                                <div className='flex flex-row gap-2 items-center'>
                                    <FormField
                                        control={form2.control}
                                        name="countryCode"
                                        render={({ field }) => (
                                            <FormItem className='mt-3 w-1/3'>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Country Code" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            countryCode.map((countryCode) => {
                                                                return <SelectItem value={countryCode.value}>
                                                                    {countryCode.label}
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
                                        control={form2.control}
                                        name="phoneNo"
                                        render={({ field }) => (
                                            <Input type="text" className='mt-3 w-2/3' placeholder="Phone No" {...field} />
                                        )}
                                    />
                                </div>
                            </form>
                        </Form>


                    </div>
                    <Separator />
                    <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                        <DialogClose asChild>
                            <Button variant={"google"} >Cancel</Button>
                        </DialogClose>
                        <Button disabled>Save & Add</Button>
                    </div>
                </DialogContent >
            </Dialog >
        </div>
    )
}

export default AddLeadDetailedDialog