"use client"
import { hasSpecialCharacter } from '@/components/custom/commonFunctions'
import { IconCheckCircle, IconLock, IconLock2, IconUserCheck } from '@/components/icons/svgIcons'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
    password: z.string({
        required_error: "Please enter password.",
    })
    .min(8, { message: "" }).regex(
        new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
        "One special character"
    )
    ,
    confirm_password: z.string({
        required_error: "Please re-enter your password.",
    })
}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Password don't match",
})
const commonClasses = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"

interface ErrorChecks {
    minChars: boolean
    oneSpecialChar: boolean
}

function setPassword() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [started, setStarted] = useState(false); // Track whether the countdown has started

    const [errorChecks, setErrorChecks] = useState<Partial<ErrorChecks>>()

    const [isPasswordSet, setIsPasswordSet] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "all"
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL


    const searchParams = useSearchParams()


    async function setPasswordApi() {
        setIsLoading(true)

        const token = searchParams.get("token")

        console.log("token", token)
        if (token) {
            const formData = form.getValues()
            const { password } = formData

            const dataToSend = {
                token: token,
                password
            }

            try {
                const dataResp = await fetch(`${baseUrl}/v1/api/password_reset/confirm/`, { method: "POST", body: JSON.stringify(dataToSend), headers: { "Accept": "application/json", "Content-Type": "application/json" } })
                const result = await dataResp.json()
                setIsLoading(false)
                if(result.status==="1"){
                    setIsPasswordSet(true)
                    setStarted(true)
                }else{
                    toast({
                        title: result?.error?.message || "Sorry some error have occured please try again later",
                        variant: "destructive"
                    })
                }
                
            }
            catch (err) {
                setIsLoading(false)
                console.log("error", err)
            }
        }

    }
    function onSubmit() {

        setPasswordApi()
    }

    const watcher = form.watch()

    useEffect(() => {
        const result = FormSchema.safeParse(form.getValues());
        if (!result.success) {
            const errorMap = result.error.formErrors.fieldErrors.password
            console.log(errorMap)
        }
        if (form.getValues("password")?.length >= 8) {
            setErrorChecks((prev) => { return { ...prev, minChars: true } })
        } else {
            setErrorChecks((prev) => { return { ...prev, minChars: false } })
        }
        if (hasSpecialCharacter(form.getValues("password"))) {
            setErrorChecks((prev) => { return { ...prev, oneSpecialChar: true } })
        } else {
            setErrorChecks((prev) => { return { ...prev, oneSpecialChar: false } })
        }

    }, [watcher.password, watcher.confirm_password])





    return (
        <>{!isPasswordSet ? <Form {...form}>
            <form className='flex flex-col gap-[32px] items-center justify-center h-full' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col items-center gap-[24px]'>
                    <div className='flex flex-col rounded-full bg-purple-100 p-[14px]'>
                        <IconLock2 size={28} color={"#7F56D9"} />
                    </div>
                    <div className='flex flex-col gap-[12px] items-center'>
                        <div className='text-2xl text-gray-900'>Set new password</div>
                        <div className='text-md text-gray-600'>Your new password must be different to previously used passwords.</div>
                    </div>
                </div>
                <div className='flex flex-col min-w-[360px] gap-[20px]'>
                    <div className='flex flex-col gap-[20px]'>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-700 text-sm font-medium'>Password</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="current-password" type="password" className={`mb-5 ${commonClasses}`} placeholder="Enter Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-700 text-sm font-medium'>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="new-password" type="password" className={`mb-5 ${commonClasses}`} placeholder="Enter Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <div className='flex flex-col gap-[24px]'>
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
                            <Button type='submit'>Set Password</Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form> : <div className='flex flex-col min-w-[360px] items-center justify-center h-full'>
            <div className='flex flex-col items-center w-full gap-[32px]'>
                <div className='flex flex-col items-center gap-[24px]'>
                    <div className='flex flex-col rounded-full bg-success-100 p-[14px]'>
                        <Check className={`text-success-600 h-[28px] w-[28px]`} />
                    </div>
                    <div className='flex flex-col gap-[12px] w-full items-center'>
                        <div className='text-2xl text-gray-900 text-center'>Password reset</div>
                        <div className='text-md text-gray-600'>Your password has been successfully reset. Click below to log in magically.</div>
                    </div>
                </div>
                <div className='flex items-center   flex-col gap-[18px]'>
                    <Button className='min-w-[360px]' >
                        <Link href={"/signin"} className='w-full'>
                            Continue to Log In
                        </Link>
                    </Button>
                </div>
            </div>
        </div>}</>
    )
}

export default setPassword