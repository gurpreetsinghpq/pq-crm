"use client"
import { IconCheckCircle, IconLock, IconLock2, IconUserCheck } from '@/components/icons/svgIcons'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
    password: z.string({
        // required_error: "Please select designation.",
    }),
    comfirm_password: z.string({
        // required_error: "Please enter a name.",
    }),
})

const commonClasses = "text-md font-normal text-gray-900 focus:shadow-custom1 focus:border-[1px] focus:border-purple-300"

function setPassword() {
    const [isPasswordSet, setIsPasswordSet] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: "",
            comfirm_password: ""
        }
    })
    return (
        <>{!isPasswordSet ? <Form {...form}>
            <form className='flex flex-col gap-[32px] items-center justify-center h-full'>
                <div className='flex flex-col items-center gap-[24px]'>
                    <div className='flex flex-col rounded-full bg-purple-100 p-[14px]'>
                        <IconLock2 size={28} color={"#7F56D9"} />
                    </div>
                    <div className='flex flex-col gap-[12px] items-center'>
                        <div className='text-2xl text-gray-900'>Set password</div>
                        <div className='text-md text-gray-600'>Set a password for your account.</div>
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
                                        <Input type="password" className={`mb-5 ${commonClasses}`} placeholder="Enter Password" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comfirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-700 text-sm font-medium'>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" className={`mb-5 ${commonClasses}`} placeholder="Enter Password" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <div className='flex flex-col gap-[24px]'>
                            <div className='flex flex-col gap-[12px]'>
                                <div className='flex flex-row gap-[8px] items-center'>
                                    <IconCheckCircle />
                                    <span>Must be at least 8 characters</span>
                                </div>
                                <div className='flex flex-row gap-[8px] items-center'>
                                    <IconCheckCircle color={"#17B26A"} />
                                    <span>Must contain one special character</span>
                                </div>
                            </div>
                            <Button>Set Password</Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form> : <div className='flex flex-col min-w-[360px] items-center justify-center h-full'>
            <div className='flex flex-col items-center w-full gap-[32px]'>
                <div className='flex flex-col items-center gap-[24px]'>
                    <div className='flex flex-col rounded-full bg-success-100 p-[14px]'>
                        <Check className='text-success-600 h-[28px] w-[28px]' />
                    </div>
                    <div className='flex flex-col gap-[12px] w-full items-center'>
                        <div className='text-2xl text-gray-900 text-center'>Password set <br /> Successfully</div>
                        <div className='text-md text-gray-600'>Go ahead and log in</div>
                    </div>
                </div>
                <div className='flex items-center   flex-col gap-[18px]'>
                    <Button className='min-w-[360px]'>Go to Login</Button>
                    <span className='text-gray-600 text-md font-normal'>Redirecting in <span className='font-bold'> 5 </span> seconds </span>
                </div>
            </div>
        </div>}</>
    )
}

export default setPassword