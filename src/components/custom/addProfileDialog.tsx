"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, ChevronDown, ClipboardSignature } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { ALL_FUNCTIONS, COUNTRY_CODE, DESIGNATION, FUNCTION, PROFILE, REGION, REPORTING_MANAGERS, SET_VALUE_CONFIG, TYPE } from '@/app/constants/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { commonClasses, commonClasses2, commonFontClassesAddDialog, tableHeaderClass } from '@/app/constants/classes'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { camelCaseToTitleCase, getToken, handleKeyPress, handleOnChangeNumeric } from './commonFunctions'
import { beforeCancelDialog } from './addLeadDetailedDialog'
import { IChildData } from './userManagement'
import { AccessCategoryGetResponse, IValueLabel, Permission, ProfilePostBody, SpecificProfileGetResponse, UsersGetResponse } from '@/app/interfaces/interface'
import { labelToValue } from './sideSheet'
import { IconCheckDone, IconPower, IconUserDeactive } from '../icons/svgIcons'
import { Checkbox } from '../ui/checkbox'
import { toast } from '../ui/use-toast'
import { DialogClose } from '@radix-ui/react-dialog'


const FieldSchema = z.object({
    all: z.boolean(),
    access: z.boolean(),
    add: z.boolean(),
    view: z.boolean(),
    change: z.boolean(),
});
const FieldSchemaModified = z.object({
    all: z.boolean(),
    access: z.boolean(),
    add: z.string(),
    view: z.string(),
    change: z.string(),
});

const FieldSchemaModified2 = z.object({
    all: z.boolean(),
    access: z.boolean(),
    add: z.string(),
    view: z.boolean(),
    change: z.boolean(),
});

const FormSchema = z.object({
    profileName: z.string(),
    Insights: FieldSchemaModified,
    Dashboard: FieldSchemaModified,
    Leads: FieldSchema,
    Prospects: FieldSchemaModified2,
    Deals: FieldSchemaModified2,
    Accounts: FieldSchema,
    Contacts: FieldSchema,
    UserManagement: FieldSchema,
    allTheFields: z.boolean()
});

const defaultFormSchema = {
    all: false,
    access: false,
    add: false,
    view: false,
    change: false
}


const defaultModifiedFormSchema = {
    all: false,
    access: false,
    add: "NA",
    view: "NA",
    change: "NA"
}

const defaultModifiedFormSchema2 = {
    all: false,
    access: false,
    add: "NA",
    view: false,
    change: false
}

const defaultModifiedFormSchema3 = {
    all: false,
    access: false,
    add: false,
    view: true,
    change: false
}

export type FormField = keyof typeof FormSchema['shape'];

// const allTimezones = getAllTimezones()

function AddProfileDialogBox({ children, permissions, parentData = undefined, setIsAddDialogClosed = undefined }: { children?: any | undefined, permissions: Permission, parentData?: { childData: IChildData, setChildDataHandler: CallableFunction, open: boolean } | undefined, setIsAddDialogClosed?: CallableFunction }) {
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState<SpecificProfileGetResponse>()
    const [checkFields, setCheckFields] = useState<boolean>(false)
    const [accessCategory, setAccessCategory] = useState<AccessCategoryGetResponse[]>()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            Insights: defaultModifiedFormSchema,
            Dashboard: defaultModifiedFormSchema,
            Accounts: defaultFormSchema,
            Contacts: defaultFormSchema,
            Deals: defaultModifiedFormSchema2,
            Leads: defaultFormSchema,
            Prospects: defaultModifiedFormSchema2,
            UserManagement: defaultModifiedFormSchema3,
            profileName: "",
            allTheFields: false
        }
    })



    const [formSchema, setFormSchema] = useState(FormSchema)


    function changeStdCode(value: string) {
        let updatedSchema
        if (value != "+91") {
            updatedSchema = FormSchema.extend({
                phone: z.string().min(4).max(13)
            })
        } else {
            updatedSchema = FormSchema
        }
        setFormSchema(updatedSchema)
    }

    function yesDiscard(isAdd: boolean = false) {
        if (isAdd && setIsAddDialogClosed) {
            setIsAddDialogClosed(true)
        } else {
            parentData?.setChildDataHandler('row', undefined)
        }
        setOpen(false)
        parentData?.setChildDataHandler('row', undefined)
        form.reset()
    }

    async function addProfile(isUpdate: boolean = false) {
        const preProcessData: any = removeKeyAndConvertNaToFalse(form.getValues())
        // Object.keys(preProcessData).map((key)=>{
        //     const keys = ["access", "view", "change", "add"]
        //     keys

        // })

        // console.log("preProcessData",preProcessData)
        const finalData: any = preProcessData

        Object.keys(finalData).map((key) => {
            accessCategory?.map(val => {
                if (val.name.toLowerCase() === "organisation") {
                    finalData["Accounts"] = {
                        ...finalData["Accounts"],
                        access_category: val.id
                    }
                }
                else if (camelCaseToTitleCase(key).toLowerCase().includes(val.name.toLowerCase())) {

                    finalData[key] = {
                        ...finalData[key],
                        access_category: val.id
                    }
                }
            })
        })

        // uncomment this later
        // const keysToDelete = ["profileName", "allTheFields"]
        // to be reomved
        const keysToDelete = ["profileName", "allTheFields", "Insights", "Dashboard"]
        keysToDelete.map((keyName) => {
            delete finalData[keyName]
        })
        // console.log("finalData",finalData)
        const finalDataArray = structuredClone(convertObjectToArray(finalData))
        const dataToSend: ProfilePostBody = {
            group_details: {
                name: form.getValues("profileName")
            },
            permissions: structuredClone(finalDataArray)
        }
        // console.log("dataToSend",dataToSend)

        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/rbac/profile/${isUpdate ? `${parentData?.childData.row.original.id}/` : ""}`, { method: isUpdate ? "PUT" : "POST", body: JSON.stringify(dataToSend), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })

            const result = await dataResp.json()
            if (result.status == "1") {
                toast({
                    title: `Profile ${isUpdate ? "Updated" : "Created"} Succesfully!`,
                    variant: "dark"
                })
                yesDiscard(true)
            } else {
                toast({
                    title: "Api Failure!",
                    variant: "destructive"
                })
            }

        } catch (err) {
            console.log(err)
        }


    }

    // console.clear()
    // const hey: z.infer<typeof FormSchema> 
    type FormField = keyof typeof FormSchema.shape;
    // console.log("form", form)
    // console.log(FormSchema.shape)
    // console.log("values", form.formState.defaultValues)
    const formDefaultState: any = form.formState.defaultValues
    // console.log(form)

    async function fetchProfileDetails() {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/rbac/profile/${parentData?.childData.row.original.id}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: SpecificProfileGetResponse = structuredClone(result.data)
            const superRes = data.permissions.map((obj) => {
                const name: string = obj.access_category.name
                let k: any = Object.keys(FormSchema.shape).find(field => field.includes(name.split(" ").join("")))
                if (name.toLowerCase() === "organisation") {
                    k = "Accounts"
                }
                if (k) {
                    let dataToSet: {
                        access: boolean,
                        add: boolean | string,
                        change: boolean | string,
                        view: boolean | string,
                        all: boolean | string
                    }
                    switch (k) {
                        case "Prospects":
                        case "Deals":
                            dataToSet = {
                                access: obj.access,
                                add: "NA",
                                change: obj.change,
                                view: obj.view,
                                all: obj.access && obj.change && obj.view
                            }
                            break;
                        case "Insights":
                        case "Dashboard":
                            dataToSet = {
                                access: obj.access,
                                add: "NA",
                                change: "NA",
                                view: "NA",
                                all: obj.access && obj.view
                            }
                            break;
                        case "UserManagement":
                            dataToSet = {
                                access: obj.access,
                                add: obj.add,
                                change: obj.change,
                                view: true,
                                all: obj.access && obj.add && obj.change
                            }
                            break;
                        default:
                            dataToSet = {
                                access: obj.access,
                                add: obj.add,
                                change: obj.change,
                                view: obj.view,
                                all: obj.access && obj.add && obj.change && obj.view
                            }

                    }
                    const keyName: FormField = k

                    let dataToSetFinal: any = dataToSet
                    form.setValue(keyName, dataToSetFinal)
                    return dataToSet.all
                }
            })
            if (data.permissions.length > 0) {
                form.setValue("allTheFields", superRes.every(val => val === true))
            }
            form.setValue("profileName", data.name)
            setData(data)
        }
        catch (err) {
            console.log("error", err)
        }

    }

    useEffect(() => {
        fetchCategoryAccessDetails()
        if (parentData?.open) {
            fetchProfileDetails()
        }
    }, [])

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()

    async function fetchCategoryAccessDetails() {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/rbac/category-access/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: AccessCategoryGetResponse[] = structuredClone(result.data)
            setAccessCategory(data)
        }
        catch (err) {
            console.log("error", err)
        }

    }


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
    // useEffect(() => {
    //     //     console.log(form.getValues("Leads"))
    //     //     // console.log(allTimezones.find((val) => console.log(val.value, form.getValues("timeZone")))?.label)
    //     const subscription = form.watch((data) => {
    //         console.log(data.Leads)
    //         form.setValue("Leads.all",true)
    //     })
    //     return () => subscription.unsubscribe()

    // }, [form.watch()])

    useEffect(() => {
        if (checkFields) {
            setCheckFields(false)
            const superRes = Object.keys(FormSchema.shape)
                // to be removed
                .filter((keyName) =>  keyName !== "Insights" && keyName!=="Dashboard")
                .filter((val) => val !== "profileName").map((fieldName: any) => {
                    const fieldData = form.getValues(fieldName)
                    const keys = ["access", "add", "view", "change"]
                    const keyMakeUp: any = `${fieldName}.all`
                    const keyAll: FormField = keyMakeUp
                    const result = Object.keys(fieldData).filter((key) => key != "all").every((key) => {
                        // console.log(fieldName, key)
                        return fieldData[key]
                    })
                    // const result2 = Object.keys(fieldData).filter((key) => key != "all").some((key) => {
                    //     console.log(fieldName, key)  
                    //     return fieldData[key]
                    // })   
                    // if(result2){
                    //     form.setValue(keyAll, unde)
                    // }else{
                    form.setValue(keyAll, result, SET_VALUE_CONFIG)
                    // }
                    return result
                }).every(val => {
                    return val
                })
            form.setValue("allTheFields", superRes, SET_VALUE_CONFIG)
            // keys.man((key)=>{
            //     console.log(Leads[key])
            // })

        }
    }, [checkFields])


    function handleSuperAllCheckboxChange(val: boolean) {
        const defaultAllValue = {
            access: val,
            add: val,
            view: val,
            change: val,
            all: val,
        }
        const defaultModifiedValue = {
            access: val,
            add: "NA",
            view: "NA",
            change: "NA",
            all: val,
        }
        const defaultModifiedValue2 = {
            access: val,
            add: "NA",
            view: val,
            change: val,
            all: val,
        }
        const defaultModifiedValue3 = {
            access: val,
            add: val,
            view: true,
            change: val,
            all: val,
        }
        form.setValue("Accounts", defaultAllValue, SET_VALUE_CONFIG)
        form.setValue("Contacts", defaultAllValue, SET_VALUE_CONFIG)
        form.setValue("Dashboard", defaultModifiedValue, SET_VALUE_CONFIG)
        form.setValue("Deals", defaultModifiedValue2, SET_VALUE_CONFIG)
        form.setValue("Insights", defaultModifiedValue, SET_VALUE_CONFIG)
        form.setValue("Leads", defaultAllValue, SET_VALUE_CONFIG)
        form.setValue("Prospects", defaultModifiedValue2, SET_VALUE_CONFIG)
        form.setValue("UserManagement", defaultModifiedValue3, SET_VALUE_CONFIG)
    }


    function handleAllCheckboxChange(k2: string, val: boolean) {
        const [key1, key2] = k2.split(".")
        // console.log("handlre all check box")
        if (key2 === "all") {
            const k1: any = key1
            const keyToUpdate1: FormField = k1
            if (key1.toLowerCase() === "insights" || key1.toLowerCase() === "dashboard") {
                form.setValue(keyToUpdate1, {
                    all: !val,
                    access: !val,
                    add: "NA",
                    view: "NA",
                    change: "NA"
                }, SET_VALUE_CONFIG)
            }
            else if (key1.toLowerCase() === "prospects" || key1.toLowerCase() === "deals") {
                form.setValue(keyToUpdate1, {
                    all: !val,
                    access: !val,
                    add: "NA",
                    view: !val,
                    change: !val
                }, SET_VALUE_CONFIG)
            }
            else if (key1.toLowerCase() === "usermanagement") {
                form.setValue(keyToUpdate1, {
                    all: !val,
                    access: !val,
                    add: !val,
                    view: true,
                    change: !val
                }, SET_VALUE_CONFIG)
            }
            else {
                form.setValue(keyToUpdate1, {
                    all: !val,
                    access: !val,
                    add: !val,
                    view: !val,
                    change: !val
                }, SET_VALUE_CONFIG)

            }
        }

        setCheckFields(true)
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

    async function deactivateProfile() {
        const id = parentData?.childData.row.id
        const dataResp = await fetch(`${baseUrl}/v1/api/rbac/profile/${id}/`, { method: "DELETE", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
        if (dataResp.status === 204) {
            toast({
                title: `Profile Deleted Succesfully!`,
                variant: "dark"
            })
            yesDiscard()
        } else {
            const result = await dataResp.json()
            if (result.status == "1") {
                yesDiscard()
                toast({
                    title: `Profile Deleted Succesfully!`,
                    variant: "dark"
                })

            } else {
                toast({
                    title: "Api Failure!",
                    variant: "destructive"
                })
            }
        }
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
                                    <>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button disabled={!permissions?.change || data?.users.length !== 0} variant={"default"} className='flex flex-row gap-2 text-md font-medium bg-error-500 text-white-900 hover:bg-error-600' >
                                                    {/* <IconUserDeactive size={20} color={"white"} /> */}
                                                    Delete Profile
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                                                <div className='w-fit'>
                                                    <div className='flex flex-col gap-[32px] min-w-[380px] '>
                                                        <div className='flex flex-col gap-[5px]'>
                                                            <div className='text-gray-900 text-lg'>Are you sure you want to continue?</div>
                                                            <div className='text-gray-600 font-normal font text-sm'> Profile  <span className="font-bold">  {data?.name} </span> will be Deleted</div>
                                                        </div>
                                                        <div className='flex flex-row gap-[12px] w-full'>
                                                            <DialogClose asChild>
                                                                <Button className='text-sm flex-1 font-semibold  px-[38px] py-[10px]' variant={'google'}>Cancel</Button>
                                                            </DialogClose>
                                                            <Button onClick={() => deactivateProfile()} className='flex-1 text-sm font-semibold px-[38px] py-[10px]'>Delete Profile </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </>



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
                                                    Module
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

                                                    Object.keys(FormSchema.shape)
                                                        // to be removed 
                                                        .filter((keyName) => keyName !== "Insights" && keyName !== "Dashboard" )
                                                        .map((key: any) => {
                                                            // const dataOfKey = formDefaultState[obj]
                                                            if (formDefaultState) {
                                                                const nestedObj = formDefaultState[key]
                                                                if (nestedObj) {
                                                                    return Object.keys(nestedObj)
                                                                        .map((key2, index) => {
                                                                            let k: any = `${key}.${key2}`
                                                                            let k2: FormField = k
                                                                            return <>
                                                                                {
                                                                                    index === 1 && <div className='flex flex-col px-[24px] py-[16px] border-b-[1px] border-gray-200 text-sm font-medium text-gray-900 col-span-3'>
                                                                                        <div>{camelCaseToTitleCase(key)}</div>
                                                                                    </div>
                                                                                }
                                                                                {<div className='flex flex-col px-[24px] py-[16px] border-b-[1px] border-gray-200' key={index}>
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
                                                                                                        disabled={field.value === "NA" || k === "UserManagement.view"}
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
                                                    <Button type='button' disabled={!form.formState.isValid || !permissions?.change} onClick={() => addProfile(true)}>
                                                        Update
                                                    </Button>
                                                </div> :
                                                <div className='flex flex-row flex-row gap-2 w-full justify-end'>
                                                    {beforeCancelDialog(yesDiscard)}
                                                    <Button type='button' disabled={!form.formState.isValid || !form.formState.isDirty} onClick={() => addProfile()}>
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

function removeKeyAndConvertNaToFalse(data: any): any {
    if (typeof data === 'object') {
        if (Array.isArray(data)) {
            return data.map((item) => removeKeyAndConvertNaToFalse(item));
        } else {
            const newObj: any = {};
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (key !== 'all') {
                        newObj[key] = removeKeyAndConvertNaToFalse(data[key]);
                        if (newObj[key] === 'NA') {
                            newObj[key] = false;
                        }
                    }
                }
            }
            return newObj;
        }
    } else {
        return data;
    }
}

function convertObjectToArray(data: any): any[] {
    const dataArray: any[] = [];

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const obj = data[key];
            dataArray.push(obj);
        }
    }

    return dataArray;
}


export default AddProfileDialogBox
