"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { COUNTRY_CODE, DESIGNATION, FUNCTION, PROFILE, REGION, TYPE } from '@/app/constants/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { commonClasses, commonClasses2, commonFontClassesAddDialog } from '@/app/constants/classes'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { handleKeyPress, handleOnChangeNumeric } from './commonFunctions'

const FormSchema = z.object({
    firstName: z.string({
        // required_error: "Please enter a name.",
    }).min(2),
    lastName: z.string({
        // required_error: "Please select a region"
    }),
    email: z.string({
        // required_error: "Please select role type"
    }).email(),
    std_code: z.string({
        // required_error: "Please select budget range"
    }),
    phone: z.string({
        // required_error: "Please select a lead source"
    }),
    region: z.string({

    }),
    function: z.string({

    }),
    reportingTo: z.string({

    }),
    profile: z.string({

    })
})

function AddUserDialogBox({ children }: { children: any }) {
    const [open, setOpen] = useState<boolean>(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            std_code: "+91",
            phone: "",
            region: undefined,
            function: undefined,
            reportingTo: undefined,
            profile: undefined
        }
    })
    const [formSchema, setFormSchema] = useState(FormSchema)

    function changeStdCode(value: string) {
        let updatedSchema
        console.log(value, value != "+91")
        if (value != "+91") {
            updatedSchema = FormSchema.extend({
                phone: z.string().min(4).max(13)
            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema
        }
        setFormSchema(updatedSchema)
    }

    function yesDiscard(): void {
        // throw new Error('Function not implemented.')
    }

    function addContact(): void {
        // throw new Error('Function not implemented.')
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div>
                        {children}
                    </div>
                </DialogTrigger>
                <DialogContent className="p-0" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className='px-[24px] pt-[30px] pb-[10px]'>
                            <div className='text-lg text-gray-900 font-semibold'>Add User</div>
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        <Form {...form}>
                            <form>
                                <div className='w-fit min-w-[600px] '>
                                    <Separator className="bg-gray-200 h-[1px]  mb-4" />
                                    <div className='grid grid-cols-2 gap-[16px] px-[24px]'>
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" className={` ${commonClasses2}`} placeholder="First Name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" className={` ${commonClasses2}`} placeholder="Last Name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" className={`${commonClasses2}`} placeholder="Email" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <div className='flex flex-row gap-2 items-center'>
                                            <div className=''>
                                                <FormField
                                                    control={form.control}
                                                    name="std_code"
                                                    render={({ field }) => (
                                                        <FormItem >
                                                            <Popover >
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button variant={"google"} className={`flex flex-row gap-2 ${commonClasses2}`} >
                                                                            {COUNTRY_CODE.find((val) => {
                                                                                return val.value === field.value
                                                                            })?.value}
                                                                            <ChevronDown className="h-4 w-4 opacity-50" />
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
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormControl>
                                                            <Input type="text" className={`w-full ${commonClasses2}`} placeholder="Phone No (Optional)" {...field}
                                                                onKeyPress={handleKeyPress}
                                                                onChange={event => {
                                                                    return handleOnChangeNumeric(event, field, false)
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )} />
                                            </div>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="reportingTo"
                                            render={({ field }) => (
                                                <FormItem className='w-full '>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {DESIGNATION.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Reporting To</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[290px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Reporter" />
                                                                <CommandEmpty>Reporter not found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {DESIGNATION.map((designation) => (
                                                                            <CommandItem
                                                                                value={designation.value}
                                                                                key={designation.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("reportingTo", designation.value)
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
                                        {/* <FormField
                                            control={form.control}
                                            name="region"
                                            render={({ field }) => (
                                                <FormItem className='w-full '>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {REGION.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Region</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[290px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Reporter" />
                                                                <CommandEmpty>Region not found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {REGION.map((region) => (
                                                                            <CommandItem
                                                                                value={region.value}
                                                                                key={region.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("reportingTo", region.value)
                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {region.label}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value === region.value
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
                                            name="function"
                                            render={({ field }) => (
                                                <FormItem className='w-full '>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {FUNCTION.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Function</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[290px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Function" />
                                                                <CommandEmpty>Function not found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {FUNCTION.map((func) => (
                                                                            <CommandItem
                                                                                value={func.value}
                                                                                key={func.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("function", func.value)
                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {func.label}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value === func.value
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
                                            name="profile"
                                            render={({ field }) => (
                                                <FormItem className='w-full '>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {PROFILE.find((val) => val.value === field.value)?.label || <span className='text-muted-foreground '>Profile</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[290px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Profile" />
                                                                <CommandEmpty>Profile not found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {PROFILE.map((profile) => (
                                                                            <CommandItem
                                                                                value={profile.value}
                                                                                key={profile.value}
                                                                                onSelect={() => {
                                                                                    form.setValue("reportingTo", profile.value)
                                                                                }}
                                                                            >
                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                    {profile.label}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                            field.value === profile.value
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
                                        /> */}

                                        <FormField
                                            control={form.control}
                                            name="region"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Region" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                REGION.map((region, index) => {
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
                                        <FormField
                                            control={form.control}
                                            name="function"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Function" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                FUNCTION.map((func, index) => {
                                                                    return <SelectItem key={index} value={func.value}>
                                                                        {func.label}
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
                                        <FormField
                                            control={form.control}
                                            name="profile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={(value) => {
                                                        return field.onChange(value)
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                <SelectValue placeholder="Profile" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                PROFILE.map((region, index) => {
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

                                <div>
                                    <Separator className="bg-gray-200 h-[1px]  mt-8" />
                                    <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                                        <Button variant={"google"} onClick={() => yesDiscard()}>Cancel</Button>
                                        <Button type='button' disabled={!form.formState.isValid} onClick={() => addContact()}>
                                            Save & Add
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddUserDialogBox