import { PasswordPatchBody, UserPatchBody, UserProfile } from '@/app/interfaces/interface'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { IconCheckCircle, IconHomeLine, IconLock, IconLockUnblocked, IconProfile } from '../icons/svgIcons'
import { Check, ChevronDown, ChevronRight, Eye, EyeOff, HelpCircle } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { commonClasses, commonClasses2, commonFontClassesAddDialog, myAccountLabelClasses } from '@/app/constants/classes'
import { fetchTimeZone, getToken, handleKeyPress, handleOnChangeNumeric, handleOnChangeNumericReturnNull, hasSpecialCharacter } from './commonFunctions'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ALL_FUNCTIONS, COUNTRY_CODE, FUNCTION, REGION, SET_VALUE_CONFIG, TIME_ZONES } from '@/app/constants/constants'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { PopoverClose } from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { labelToValue, valueToLabel } from './sideSheet'
import { toast } from '../ui/use-toast'

const TITLES = {
    PROFILE: "My Profile",
    PASSWORD: "Password",
}

interface ErrorChecks {
    minChars: boolean
    oneSpecialChar: boolean
}

type ButtonVariants = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "google" | null | undefined


const FormSchema = z.object({
    firstName: z.string({
    }).min(1),
    lastName: z.string({
    }).min(1),
    email: z.string({
    }).email().min(1),
    std_code: z.string({
    }).min(1).optional(),
    phone: z.string({
    }).min(10).max(10).optional(),
    region: z.string({

    }).min(1).transform((val) => val === undefined ? undefined : val.trim()),
    function: z.string({

    }).min(1).transform((val) => val === undefined ? undefined : val.trim()),
    reportingTo: z.string({

    }).min(1),
    profile: z.string({

    }).min(1),
    timeZone: z.string()
})

const FormSchema2 = z.object({
    oldPassword: z.string({
        required_error: "Please enter password.",
    }).min(1),
    password: z.string({
        required_error: "Please enter password.",
    }).min(1),
    confirm_password: z.string({
        required_error: "Please re-enter your password.",
    }).min(1)
}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Password don't match",
})

type PasswordShow = {
    password: boolean,
    confirmPassword: boolean,
    oldPassword: boolean
}
function MyAccount({ myDetails, setCurrentParentTab, parentTitles, initialParentTitle }: { myDetails: UserProfile | undefined, setCurrentParentTab: CallableFunction, parentTitles: any, initialParentTitle: string }) {

    const [currentTab, setCurrentTab] = useState(TITLES.PROFILE)
    const [formSchema, setFormSchema] = useState(FormSchema)
    const [errorChecks, setErrorChecks] = useState<Partial<ErrorChecks>>()
    const [showPassword, setShowPassword] = useState<PasswordShow>({
        confirmPassword: true,
        oldPassword: true,
        password: true
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            std_code: "+91",
            phone: undefined,
            region: myDetails?.region || "",
            function: myDetails?.function,
            reportingTo: undefined,
            profile: undefined,
            timeZone: ""
        }
    })

    const form2 = useForm<z.infer<typeof FormSchema2>>({
        resolver: zodResolver(FormSchema2),
        mode: "all"
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()


    function showPasswordHandler(key: keyof PasswordShow, show: boolean) {
        setShowPassword((prevState) => {
            return {
                ...prevState,
                [key]: show
            }
        })
    }

    function changeStdCode() {
        const value = form.getValues("std_code")
        let updatedSchema
        console.log("std_code", value, value != "+91")
        if (value != "+91" && value != "+1") {
            updatedSchema = FormSchema.extend({
                phone: z.string().min(4).max(13).optional()
            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema
        }
        setFormSchema(updatedSchema)
        console.log("updatedSchema", updatedSchema)
    }


    useEffect(() => {
        console.log("formschema", formSchema)
        console.log("formschema errors", form.formState.errors)
        form.trigger()
    }, [formSchema])

    function getButtonState(tab: string): { variant?: ButtonVariants, color: string } {
        if (currentTab === tab) {
            return {
                variant: "default",
                color: "white"
            }
        } else {
            return {
                variant: "ghost",
                color: "#667085"
            }
        }
    }


    const watcher = form2.watch()

    useEffect(() => {
        const result = FormSchema2.safeParse(form2.getValues());
        if (!result.success) {
            const errorMap = result.error.formErrors.fieldErrors.password
            console.log(errorMap)
        }
        if (form2.getValues("password")?.length >= 8) {
            setErrorChecks((prev) => { return { ...prev, minChars: true } })
        } else {
            setErrorChecks((prev) => { return { ...prev, minChars: false } })
        }
        if (hasSpecialCharacter(form2.getValues("password"))) {
            setErrorChecks((prev) => { return { ...prev, oneSpecialChar: true } })
        } else {
            setErrorChecks((prev) => { return { ...prev, oneSpecialChar: false } })
        }

    }, [watcher.password, watcher.confirm_password])


    async function updateMyDetails() {

        const dataToSendOnUpdate: Partial<UserPatchBody> = {
            mobile: `${form.getValues("phone")}`,
            time_zone: form.getValues("timeZone"),
            profile: myDetails?.profile.id,
        }

        if (form.getValues("phone")) {
            const mobileNumber = `${form.getValues("std_code")} ${form.getValues("phone")}`
            dataToSendOnUpdate["mobile"] = mobileNumber
        } else {
            dataToSendOnUpdate["mobile"] = ""
        }

        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/users/${myDetails?.id}/`, { method: "PATCH", body: JSON.stringify(dataToSendOnUpdate), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })

            const result = await dataResp.json()
            if (result.status == "1") {
                toast({
                    title: `Details Updated Succesfully!`,
                    variant: "dark"
                })
                setCurrentParentTab(initialParentTitle, true)
            } else {
                if (result?.error?.email?.includes("user with this email already exists")) {
                    toast({
                        title: "user with this email already exists",
                        variant: "destructive"
                    })
                } else {
                    toast({
                        title: "Api Failure!",
                        variant: "destructive"
                    })
                }
            }

        } catch (err) {
            console.log(err)
        }

    }
    async function updatePassword() {

        const dataToSendOnUpdate: Partial<PasswordPatchBody> = {
            old_password: form2.getValues("oldPassword"),
            new_password: form2.getValues("password"),
        }

        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/users/${myDetails?.id}/update_password/`, { method: "PATCH", body: JSON.stringify(dataToSendOnUpdate), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })

            const result = await dataResp.json()
            if (result.status == "1") {
                toast({
                    title: `Password Updated Succesfully!`,
                    variant: "dark"
                })
                setCurrentParentTab(initialParentTitle, true)
            } else {
                if (result?.error?.email?.includes("user with this email already exists")) {
                    toast({
                        title: "user with this email already exists",
                        variant: "destructive"
                    })
                } else {
                    toast({
                        title: result?.error?.message ? result?.error?.message : "Api Failure!",
                        variant: "destructive"
                    })
                }
            }

        } catch (err) {
            console.log(err)
        }

    }


    useEffect(() => {
        if (myDetails?.id) {
            const data = myDetails
            form.setValue("firstName", data.first_name)
            form.setValue("lastName", data.last_name)
            form.setValue("email", data.email)
            const [stdCode, mobile] = data.mobile.split(" ")
            if (stdCode?.length > 0 && mobile?.length > 0) {
                form.setValue("phone", mobile)
                form.setValue("std_code", stdCode)
            }
            if (data?.reporting_to?.id) {
                form.setValue("reportingTo", data.reporting_to.id?.toString())
            }
            form.setValue("profile", data.profile.id.toString())
            if (data?.time_zone) {
                form.setValue("timeZone", data.time_zone)
            }
            console.log("myDetails data", myDetails, labelToValue(data.function, ALL_FUNCTIONS), labelToValue(data.region || "", REGION))

        }
    }, [myDetails])


    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("form data", data)
        updateMyDetails()

    }
    function onSubmit2(data: z.infer<typeof FormSchema2>) {
        console.log("form data", data)
        updatePassword()

    }

    return (
        <div className='flex flex-row h-full'>
            <div className='left flex flex-col px-[16px] py-[36px] bg-[#F9FAFB] border-r-[1px] border-gray-200 min-w-[281px] '>
                <div className='flex flex-col gap-[16px]'>
                    <div className='text-gray-900 text-md font-medium'>
                        Profile
                    </div>
                    <div className='flex flex-col gap-[4px]'>
                        <Button onClick={() => setCurrentTab(TITLES.PROFILE)} variant={getButtonState(TITLES.PROFILE).variant} className='flex flex-row text-sm  gap-[12px] w-full justify-start'>
                            <IconProfile color={getButtonState(TITLES.PROFILE).color} size="16" />
                            My Profile
                        </Button>
                        <Button onClick={() => setCurrentTab(TITLES.PASSWORD)} variant={getButtonState(TITLES.PASSWORD).variant} className='flex flex-row text-sm  gap-[12px] w-full justify-start'>
                            <IconLockUnblocked color={getButtonState(TITLES.PASSWORD).color} size="16" />
                            Password
                        </Button>
                    </div>
                </div>

            </div>
            <div className='right flex flex-col flex-1 max-h-[100vh] overflow-y-auto' >
                <div className='top flex flex-row items-center gap-[8px] px-[16px] py-[22px] border-b-[1px] border-gray-200 w-full'>
                    <div className='p-[4px] cursor-pointer' onClick={() => setCurrentParentTab(initialParentTitle)}>
                        <IconHomeLine size="20" />
                    </div>
                    <ChevronRight size={16} className='text-gray-300' />
                    <div className='text-sm font-medium text-gray-600 px-[8px] py-[4px]'>
                        Profile
                    </div>
                    <ChevronRight size={16} className='text-gray-300' />
                    <div className='text-sm font-semibold text-gray-600 px-[16px] py-[8px] rounded-[6px] bg-gray-50'>
                        {currentTab}
                    </div>
                </div>
                <div className='bottom px-[48px] py-[28px]'>
                    {currentTab === TITLES.PROFILE && <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            <div className='text-lg font-semibold pb-[20px]'>{currentTab}</div>
                            <div className='h-[1px] w-full bg-gray-200'></div>
                            <div className='flex flex-col py-[24px]'>
                                <div className='flex flex-row '>
                                    <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                        Full Name
                                    </div>
                                    <div className='flex flex-row gap-[16px] min-w-[600px]'>
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem className='flex-1'>
                                                    <FormControl>
                                                        <Input disabled type="text" className={`bg-gray-100  ${commonClasses2}`} placeholder="First Name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem className='flex-1'>
                                                    <FormControl>
                                                        <Input disabled type="text" className={`bg-gray-100  ${commonClasses2}`} placeholder="Last Name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                    </div>

                                </div>
                                <div className='h-[1px] w-full bg-gray-200 my-[20px]'></div>
                                <div className='flex flex-row '>
                                    <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                        Phone
                                    </div>
                                    <div className='flex flex-row gap-[16px] min-w-[600px]'>
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
                                                                        <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
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
                                                                                                )} />
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
                                                )} />
                                        </div>
                                        <div className='flex-1'>
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormControl>
                                                        <FormItem className='flex-1'>
                                                            <Input type="text" className={`w-full ${commonClasses2}`} placeholder="Phone No" {...field}
                                                                onKeyPress={handleKeyPress}
                                                                onChange={event => {
                                                                    const std_code = form.getValues("std_code")
                                                                    const is13Digits = std_code != "+91" && std_code != "-1"
                                                                    return handleOnChangeNumericReturnNull(event, field, false, false, is13Digits ? 13 : 10)
                                                                }}
                                                            />
                                                        </FormItem>
                                                    </FormControl>
                                                )} />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row pt-[24px]'>
                                    <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                        Email Address
                                    </div>
                                    <div className='min-w-[600px]'>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormControl>
                                                        <Input disabled type="text" className={`bg-gray-100 ${commonClasses2}`} placeholder="Email" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                    </div>
                                </div>
                                <div className='h-[1px] w-full bg-gray-200 my-[20px]'></div>
                                <div className='flex flex-row'>
                                    <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                        Function
                                    </div>
                                    <div className='min-w-[600px]'>
                                        <FormField
                                            control={form.control}
                                            name="function"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormControl>
                                                        <Input disabled type="text" className={`bg-gray-100 ${commonClasses2}`} placeholder="Email" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />

                                    </div>
                                </div>
                                <div className='flex flex-row pt-[24px]'>
                                    <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                        Region
                                    </div>
                                    <div className='min-w-[600px]'>
                                        <FormField
                                            control={form.control}
                                            name="region"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormControl>
                                                        <Input disabled type="text" className={`bg-gray-100 ${commonClasses2}`} placeholder="Email" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                    </div>
                                </div>
                                <div className='flex flex-row pt-[24px]'>
                                    <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                        <div className='flex flex-row gap-[4px] items-center'>
                                            Timezone
                                            <HelpCircle className='text-gray-400' size={16} />
                                        </div>
                                    </div>
                                    <div className='min-w-[600px]'>
                                        <FormField
                                            control={form.control}
                                            name="timeZone"
                                            render={({ field }) => (
                                                <FormItem className='w-full col-span-2'>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"google"} className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                    <div className='w-full flex-1 text-align-left text-md flex  '>
                                                                        {TIME_ZONES.find((val) => val.utc[0] === field.value)?.text || <span className='text-muted-foreground '>Time Zone</span>}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[600px] p-0">
                                                            <Command>
                                                                <CommandInput className='w-full' placeholder="Search Timezone" />
                                                                <CommandEmpty>Search Time Zone.</CommandEmpty>
                                                                <CommandGroup>
                                                                    <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                        {TIME_ZONES.map((timeZone) => (
                                                                            <CommandItem
                                                                                value={timeZone.text}
                                                                                key={timeZone.text}
                                                                                onSelect={() => {
                                                                                    form.setValue("timeZone", timeZone.utc[0], SET_VALUE_CONFIG)
                                                                                }}
                                                                            >
                                                                                <PopoverClose asChild>
                                                                                    <div className="flex flex-row items-center justify-between w-full">
                                                                                        {timeZone.text}
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "mr-2 h-4 w-4 text-purple-600",
                                                                                                field.value === timeZone.utc[0]
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
                                </div>
                                <div className='h-[1px] w-full bg-gray-200 my-[20px]'></div>
                                <div className='flex flex-row justify-end gap-[12px]'>
                                    <Button type='button' variant={"google"} onClick={() => setCurrentParentTab(initialParentTitle)}>Cancel</Button>
                                    <Button type='submit' disabled={!form.formState.isDirty || !form.formState.isValid}>Save</Button>

                                </div>
                            </div>
                        </form>
                    </Form>}
                    {
                        currentTab === TITLES.PASSWORD && <Form {...form2}>
                            <form onSubmit={form2.handleSubmit(onSubmit2)}>
                                <div className='text-lg font-semibold pb-[20px]'>{currentTab}</div>
                                <div className='h-[1px] w-full bg-gray-200'></div>
                                <div className='flex flex-col py-[24px]'>
                                    <div className='flex flex-row '>
                                        <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                            Current Password
                                        </div>
                                        <div className='flex flex-row gap-[16px] min-w-[600px] items-center'>
                                            <FormField
                                                control={form2.control}
                                                name="oldPassword"
                                                render={({ field }) => (
                                                    <FormItem className='flex-1'>
                                                        <FormControl>
                                                            <Input type={showPassword.oldPassword ? "password" : "text"} className={` ${commonClasses2}`} placeholder="Enter Current Password" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )} />
                                            <div className='cursor-pointer' >
                                                {
                                                    showPassword.oldPassword ? <EyeOff className='text-gray-600' onClick={() => showPasswordHandler("oldPassword", false)} /> : <Eye className='text-gray-600' onClick={() => showPasswordHandler("oldPassword", true)} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='h-[1px] w-full bg-gray-200 my-[20px]'></div>
                                    <div className='flex flex-row '>
                                        <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                            New Password
                                        </div>
                                        <div className='flex flex-row gap-[16px] min-w-[600px] items-center'>
                                            <FormField
                                                control={form2.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem className='flex-1'>
                                                        <FormControl>
                                                            <Input type={showPassword.password ? "password" : "text"} className={` ${commonClasses2}`} placeholder="Enter New Password" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='cursor-pointer' >
                                                {
                                                    showPassword.password ? <EyeOff className='text-gray-600' onClick={() => showPasswordHandler("password", false)} /> : <Eye className='text-gray-600' onClick={() => showPasswordHandler("password", true)} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-row py-[24px]'>
                                        <div className={`text-sm font-semibold text-gray-700 ${myAccountLabelClasses}`}>
                                            Confirm Password
                                        </div>
                                        <div className='flex flex-row gap-[16px] min-w-[600px] items-center'>
                                            <FormField
                                                control={form2.control}
                                                name="confirm_password"
                                                render={({ field }) => (
                                                    <FormItem className='flex-1'>
                                                        <FormControl>
                                                            <Input type={showPassword.confirmPassword ? "password" : "text"} className={` ${commonClasses2}`} placeholder="Enter Confirm Password" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='cursor-pointer' >
                                                {
                                                    showPassword.confirmPassword ? <EyeOff className='text-gray-600' onClick={() => showPasswordHandler("confirmPassword", false)} /> : <Eye className='text-gray-600' onClick={() => showPasswordHandler("confirmPassword", true)} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-[12px]'>
                                        <div className='flex flex-row gap-[8px] items-center'>
                                            <IconCheckCircle color={`${errorChecks?.minChars ? "#17B26A" : "#D0D5DD"}`} />
                                            <span>Must be at least 8 characters</span>
                                        </div>
                                        <div className='flex flex-row gap-[8px] items-center'>
                                            <IconCheckCircle color={`${errorChecks?.oneSpecialChar ? "#17B26A" : "#D0D5DD"}`} />
                                            <span>Must contain one special character</span>
                                        </div>
                                    </div>

                                    <div className='h-[1px] w-full bg-gray-200 my-[20px]'></div>
                                    <div className='flex flex-row justify-end gap-[12px]'>
                                        <Button type='button' variant={"google"} onClick={() => setCurrentParentTab(initialParentTitle)}>Cancel</Button>
                                        <Button type='submit' disabled={!form2.formState.isDirty || !form2.formState.isValid || !errorChecks?.minChars || !errorChecks.oneSpecialChar}>Update Password</Button>

                                    </div>
                                </div>
                            </form>
                        </Form>
                    }
                </div>

            </div>
        </div>
    )
}

export default MyAccount