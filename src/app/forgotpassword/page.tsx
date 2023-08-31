"use client"
import { IconCheckCircle, IconEmail, IconKey, IconLock, IconLock2, IconUserCheck } from '@/components/icons/svgIcons'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Check } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
const FormSchema = z.object({
    email: z.string({
        // required_error: "Please select designation.",
    }),
})

const commonClasses = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"

function forgotPassword() {
    const [isPasswordSet, setIsPasswordSet] = useState(true)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        }
    })
    return (
        <>{!isPasswordSet ? <Form {...form}>
            <form className='flex flex-col gap-[32px] items-center justify-center h-full' style={{background: 'url("bgpattern1.svg")', backgroundPosition: "center calc(50% - 20px)", backgroundRepeat:"no-repeat", }}>
                <div className='flex flex-col items-center gap-[24px]'>
                    <div className='flex flex-col rounded-full bg-warning-100 p-[14px]'>
                        <IconKey size={28} color={"#DC6803"} />
                    </div>
                    <div className='flex flex-col gap-[12px] items-center'>
                        <div className='text-2xl text-gray-900'>Forgot password?</div>
                        <div className='text-md text-gray-600'>No worries, we’ll send you reset instructions.</div>
                    </div>
                </div>
                <div className='flex flex-col min-w-[360px] gap-[20px]'>
                    <div className='flex flex-col gap-[20px]'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-700 text-sm font-medium'>Password</FormLabel>
                                    <FormControl>
                                        <Input type="email" className={`mb-5 ${commonClasses}`} placeholder="Enter Password" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <div className='flex flex-col gap-[24px]'>
                            <Button>Reset Password</Button>
                        </div>
                    </div>
                    <div className='flex flex-row gap-[5px] justify-center items-center'>
                        <ArrowLeft className='h-[20px] w-[20px] text-gray-600' />
                        <span className='text-gray-600 text-sm font-semibold'>Back to log in</span>
                    </div>
                </div>
            </form>
        </Form> : <div className='flex flex-col min-w-[360px] items-center justify-center h-full' style={{background: 'url("bgpattern2.svg")', backgroundPosition: "center calc(50% + 14px)"}}>
            <div className='flex flex-col items-center w-full gap-[32px]'>
                <div className='flex flex-col items-center gap-[24px]'>
                    <div className='flex flex-col rounded-full bg-purple-100 p-[14px]'>
                        <IconEmail size={28} color={"#7F56D9"} />
                    </div>
                    <div className='flex flex-col gap-[12px] w-full items-center' >
                        <div className='text-2xl text-gray-900 text-center'>Check your email</div>
                        <div className='text-md text-gray-600 text-center'>We sent a password reset link to <br/> <span className='font-medium'> rg@gmail.com</span></div>
                    </div>
                </div>
                <div className='text-sm font-normal text-gray-600'>
                    Didn’t receive the email? 
                    <span className='text-purple-700 font-semibold'> Click to resend</span>
                </div>
                <div className='flex flex-row items-center justify-center gap-[5px]'>
                    <ArrowLeft className='text-gray-600 h-[20px] w-[20px]' />
                    <span className='text-gray-600 text-md font-semibold'>Back to login</span>
                </div>
            </div>
        </div>}</>
    )
}

export default forgotPassword