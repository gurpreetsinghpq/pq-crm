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
import { useState } from "react"

const FormSchema = z.object({
    username: z.string({
        required_error: "This is required"
    }).min(5, {
        message: "Username must be at least 5 characters.",
    }),
    username1: z.string({
        required_error: "This is required"
    }).min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export function InputForm() {
    const [formSchema, setFormSchema] = useState(FormSchema);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur"
    })

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

    const onDropdownChange = (e: any) => {
        const selectedValue = e.target.value;
        let updatedSchema;
    
        if (selectedValue === 'option2') {
          updatedSchema = FormSchema.extend({
            username: z.string({
                required_error: "This is required newly now"
            }).min(9, {
                message: "Username must be at least 9 characters.",
            })
        });
        } else {
          updatedSchema = FormSchema;
        }
    
        // Update the form schema
        setFormSchema(updatedSchema);
      };

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
