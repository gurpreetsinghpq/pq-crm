"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { Toaster } from "../ui/toaster"

const FormSchema = z.object({
    username: z.string({

    }).optional(),
    username1: z.string({
        required_error: "This is required"
    }),
})

export function InputForm() {
    const [formSchema, setFormSchema] = useState<any>(FormSchema);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur"
    })
    console.log(form.formState.errors)

    function onSubmit() {

        // toast({
        //     title: "You submitted the following values:",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        // })
    }

    const onDropdownChange = (e: any) => {
        const selectedValue = e.target.value;
        let updatedSchema;

        if (selectedValue === 'option2') {
            updatedSchema = FormSchema.extend({
                username: z.string({
                    required_error: "This is required newly now"
                })
            });
        } else {
            updatedSchema = FormSchema;
        }

        // Update the form schema
        setFormSchema(updatedSchema);
    };

    useEffect(()=>{
        const result = formSchema.safeParse(form.getValues());
        if (!result.success) {
            const errorMap = result.error.formErrors.fieldErrors
            console.log(errorMap)
            console.log(Object.keys(errorMap).length)
        }
    },[form.watch()])

    return (
        <>
            <select onChange={onDropdownChange}>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
            </select>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit">Submit</Button>
                    
                </form>
            </Form>
        </>

    )
}
