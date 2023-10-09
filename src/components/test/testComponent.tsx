"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import React, { useEffect, useState } from 'react'
import { Toaster } from "../ui/toaster"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { commonClasses, commonFontClasses } from "@/app/constants/classes"
import { OWNERS } from "@/app/constants/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"

const FormSchema = z.object({
    owners: z.string().transform((val) => val === undefined ? undefined : val.trim()),
    organisationName: z.string(),
    contact: z.object({
        name: z.string({
        }).min(2).max(30),
        designation: z.string({
        }).transform((val) => val === undefined ? undefined : val.trim()),
        type: z.string().transform((val) => val === undefined ? undefined : val.trim()),
        email: z.string({
        }).email(),
        phone: z.string({
        }).min(10).max(10),
        std_code: z.string({
    
        }),
        contactId: z.string().optional(),
    })
})
function TestComponent() {
    const { toast } = useToast()
    const [key, setKey] = useState<number>(+new Date())
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            owners: undefined   ,
            organisationName: "Yeo"
        }
    })
    function reset() {
        // form.setValue("organisationName","")
        form.reset({ owners: undefined, organisationName: "" })

        // form.setValue("owners", )
        console.log(form.getValues())
        setKey(+new Date())
    }
    const watch = form.watch()
    useEffect(()=>{
        
        console.log(form.getValues())
    },[watch])
    return (
        <>
            <div className="flex flex-row w-full mt-[40px] justify-center">
                <Form {...form}>
                    <form className="flex flex-col gap-[20px]">
                        <FormField
                            control={form.control}
                            name="organisationName"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <Input className={` `} placeholder="Organisation Name" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="owners"
                            
                            render={({ field }) => {
                                console.log(field)
                                return <FormItem className='w-full' >
                                    <FormControl >
                                        <Select   onValueChange={(val)=>console.log("on value change",val)} value={field.value} key={key}>
                                            <SelectTrigger  className={`border-gray-300 shadow ${commonClasses}`}>
                                                <SelectValue  placeholder="Select Owner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    OWNERS.filter((owner) => owner.value !== 'allOwners').map((owner, index) => {
                                                        return <SelectItem key={index} value={owner.value}>
                                                            {owner.label}
                                                        </SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            }} />
                        <Button type="button" onClick={() => reset()}>Reset</Button>
                    </form>
                </Form>
            </div>
        </>
    )

}

export default TestComponent