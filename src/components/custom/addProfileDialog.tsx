"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { ALL_FUNCTIONS, COUNTRY_CODE, DESIGNATION, FUNCTION, PROFILE, REGION, REPORTING_MANAGERS, TYPE } from '@/app/constants/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { commonClasses, commonClasses2, commonFontClassesAddDialog, tableHeaderClass } from '@/app/constants/classes'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { handleKeyPress, handleOnChangeNumeric } from './commonFunctions'
import { PopoverClose } from '@radix-ui/react-popover'
import { DialogClose } from '@radix-ui/react-dialog'
import { beforeCancelDialog } from './addLeadDetailedDialog'
import { IChildData } from './userManagement'
import { IValueLabel, UsersGetResponse } from '@/app/interfaces/interface'
import { labelToValue } from './sideSheet'
import { IconCheckDone, IconPower, IconUserDeactive } from '../icons/svgIcons'
import { Checkbox } from '../ui/checkbox'


const FieldSchema = z.object({
    all: z.boolean(),
    access: z.boolean(),
    create: z.boolean(),
    read: z.boolean(),
    update: z.boolean(),
});
const FieldSchemaModified = z.object({
    all: z.boolean(),
    access: z.boolean(),
    create: z.string(),
    read: z.string(),
    update: z.string(),
});

const FormSchema = z.object({
    profileName: z.string(),
    Insights: FieldSchemaModified,
    Dashboard: FieldSchemaModified,
    Leads: FieldSchema,
    Prospects: FieldSchema,
    Deals: FieldSchema,
    Accounts: FieldSchema,
    Contacts: FieldSchema,
    UserManagement: FieldSchema,
    allTheFields: z.boolean()
});

const defaultFormSchema = {
    all: false,
    access: false,
    create: false,
    read: false,
    update: false
}


const defaultModifiedFormSchema = {
    all: false,
    access: false,
    create: "NA",
    read: "NA",
    update: "NA"
}

export type FormField = keyof typeof FormSchema['shape'];

// const allTimezones = getAllTimezones()

function AddProfileDialogBox({ children, parentData = undefined }: { children?: any | undefined, parentData?: { childData: IChildData, setChildDataHandler: CallableFunction, open: boolean } | undefined }) {
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            Insights: defaultModifiedFormSchema,
            Dashboard: defaultModifiedFormSchema,
            Accounts: defaultFormSchema,
            Contacts: defaultFormSchema,
            Deals: defaultFormSchema,
            Leads: defaultFormSchema,
            Prospects: defaultFormSchema,
            UserManagement: defaultFormSchema,
            profileName: "",
            allTheFields: false
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

    function yesDiscard() {
        setOpen(false)
        parentData?.setChildDataHandler('row', undefined)
        form.reset()
    }

    function addContact() {

    }

    // console.clear()
    // const hey: z.infer<typeof FormSchema> 
    type FormField = keyof typeof FormSchema.shape;
    // console.log("form", form)
    // console.log(FormSchema.shape)
    // console.log("values", form.formState.defaultValues)
    const formDefaultState: any = form.formState.defaultValues
    // console.log(form)


    useEffect(() => {
        if (parentData?.open) {
            setOpen(parentData?.open)
            const { childData: { row }, setChildDataHandler } = parentData
            const data: UsersGetResponse = row.original
        } else {
            setOpen(false)
        }
    }, [parentData])

    function updateContact(): void {
        throw new Error('Function not implemented.')
    }

    const watcher = form.watch()
    useEffect(() => {
        console.log(form.getValues())
        // console.log(allTimezones.find((val) => console.log(val.value, form.getValues("timeZone")))?.label)

    }, [watcher])

    function handleSuperAllCheckboxChange(val:boolean){
        const defaultAllValue = {
            access: val,
            create: val,
            read: val,
            update: val,
            all: val,
        }
        const defaultModifiedValue ={
            access: val,
            create: "NA",
            read: "NA",
            update: "NA",
            all: val,
        }
        form.setValue("Accounts",defaultAllValue)
        form.setValue("Contacts",defaultAllValue)
        form.setValue("Dashboard",defaultModifiedValue)
        form.setValue("Deals",defaultAllValue)
        form.setValue("Insights",defaultModifiedValue)
        form.setValue("Deals",defaultAllValue)
        form.setValue("Leads",defaultAllValue)
        form.setValue("Prospects",defaultAllValue)
        form.setValue("UserManagement",defaultAllValue)
    }


    function handleAllCheckboxChange(k2: string, val: boolean) {
        const [key1, key2] = k2.split(".")
        const keys = ["access", "read", "update", "create"]
        if (key2 === "all") {
            const k1: any = key1
            const keyToUpdate1: FormField = k1
            if (key1.toLowerCase() === "insights" || key1.toLowerCase() === "dashboard") {
                form.setValue(keyToUpdate1, {
                    all: !val,
                    access: !val,
                    create: "NA",
                    read: "NA",
                    update: "NA"
                }, { shouldDirty: true })
            } else {
                form.setValue(keyToUpdate1, {
                    all: !val,
                    access: !val,
                    create: !val,
                    read: !val,
                    update: !val
                }, { shouldDirty: true })

            }
        }
        // if(key2==="all"){
        //     keys.map(val=>{
        //         const k1:any = key1
        //         const k2:any = val
        //         const keyToUpdate1:FormField=k1
        //         const keyToUpdate2:FormField=k2
        //         const updateKey:any = `${key1}.${val}` 
        //         const nestedKeyName:FormField = updateKey

        //         form.setValue(keyToUpdate1, {
        //             [val] : rue
        //         })
        //     })
        // }
    }


    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogTrigger asChild>
                    <div>
                        {children}
                    </div>
                </DialogTrigger>
                <DialogContent className="p-0" onPointerDownOutside={(e) => e.preventDefault()} onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        yesDiscard()
                    }
                }}>
                    <DialogHeader>
                        <DialogTitle className='px-[24px] pt-[30px] pb-[10px]'>
                            <div className='flex flex-row justify-between w-full items-center'>
                                <div className='text-lg text-gray-900 font-semibold'>{parentData?.open ? "Edit Profile" : "Add Profile"}</div>
                                {
                                    parentData?.open &&
                                    <Button variant={"default"} className='flex flex-row gap-2 text-md font-medium bg-error-500 text-white-900 hover:bg-error-600'>
                                        <IconUserDeactive size={20} color={"white"} />
                                        Deactivate User
                                    </Button>
                                    // <div className='flex flex-row gap-[8px] text-error-400 text-sm font-medium items-center'>
                                    //     <IconPower size={20} />
                                    //     Deactivate User
                                    // </div>

                                }
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        <Form {...form}>
                            <form>
                                <div className='w-fit min-w-[650px]  '>
                                    <Separator className="bg-gray-200 h-[1px]  mb-4" />
                                    <div className='px-[24px] flex flex-col '>
                                        <FormField
                                            control={form.control}
                                            name="profileName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" className={` ${commonClasses2}`} placeholder="Profile Name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <div className="flex flex-row gap-[10px] items-center mt-[24px]">
                                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                                <IconCheckDone size="20" />
                                            </div>
                                            <span className="text-xs text-gray-700">PERMISSIONS</span>
                                            <div className="bg-gray-200 h-[1px] flex-1" ></div>
                                        </div>
                                        <div className='checkboxes mt-[24px]'>
                                            <div className='grid grid-cols-8 border border-[1px] border-gray-200 w-full xl:max-h-[200px] 2xl:max-h-fit overflow-y-auto'>
                                                <div className={tableHeaderClass}>
                                                    <FormField
                                                        control={form.control}
                                                        name={"allTheFields"}
                                                        render={({ field }) => {
                                                            const value: any = field.value
                                                            const fieldValue: boolean = value === "NA" ? false : value
                                                            return <FormItem >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        onCheckedChange={(val) => {
                                                                            handleSuperAllCheckboxChange(!fieldValue)
                                                                            field.onChange(val)
                                                                        }}
                                                                        checked={fieldValue}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        }}
                                                    />
                                                </div>
                                                <div className={`${tableHeaderClass} col-span-3`}>
                                                    Permission Type
                                                </div>
                                                <div className={tableHeaderClass}>
                                                    Access
                                                </div>
                                                <div className={tableHeaderClass}>
                                                    Create
                                                </div>
                                                <div className={tableHeaderClass}>
                                                    Read
                                                </div>
                                                <div className={tableHeaderClass}>
                                                    Update
                                                </div>
                                                {

                                                    Object.keys(FormSchema.shape).map((key: any) => {
                                                        // const dataOfKey = formDefaultState[obj]
                                                        if (formDefaultState) {
                                                            const nestedObj = formDefaultState[key]
                                                            if (nestedObj) {
                                                                return Object.keys(nestedObj).map((key2, index) => {
                                                                    let k: any = `${key}.${key2}`
                                                                    let k2: FormField = k
                                                                    return <>
                                                                        {
                                                                            index === 1 && <div className='flex flex-col px-[24px] py-[16px] border-b-[1px] border-gray-200 text-sm font-medium text-gray-900 col-span-3'>
                                                                                {key}
                                                                            </div>
                                                                        }
                                                                        {<div className='flex flex-col px-[24px] py-[16px] border-b-[1px] border-gray-200'>
                                                                            <FormField
                                                                                control={form.control}
                                                                                name={k2}
                                                                                render={({ field }) => {
                                                                                    const value: any = field.value
                                                                                    const fieldValue: boolean = value === "NA" ? false : value

                                                                                    // console.log(field)
                                                                                    return <FormItem >
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                onCheckedChange={(val) => {
                                                                                                    handleAllCheckboxChange(k2, fieldValue)
                                                                                                    field.onChange(val)
                                                                                                }}
                                                                                                checked={fieldValue}
                                                                                                disabled={field.value === "NA"}
                                                                                            />
                                                                                        </FormControl>
                                                                                    </FormItem>
                                                                                }}
                                                                            />
                                                                        </div>}

                                                                    </>

                                                                })
                                                            }
                                                        }
                                                    })
                                                }
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Separator className="bg-gray-200 h-[1px]  mt-8" />
                                    <div className={`flex flex-row gap-2 mx-6 my-6`}>
                                        {
                                            parentData?.open ?
                                                <div className='flex flex-row gap-2 w-full justify-end'>
                                                    {beforeCancelDialog(yesDiscard)}
                                                    <Button type='button' disabled={!form.formState.isValid} onClick={() => updateContact()}>
                                                        Update
                                                    </Button>
                                                </div> :
                                                <div className='flex flex-row flex-row gap-2 w-full justify-end'>
                                                    {beforeCancelDialog(yesDiscard)}
                                                    <Button type='button' disabled={!form.formState.isValid} onClick={() => addContact()}>
                                                        Save & Add
                                                    </Button>
                                                </div>
                                        }
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

export default AddProfileDialogBox