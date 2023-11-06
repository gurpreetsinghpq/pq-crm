"use client"
import { IconPq, IconPq2, IconPq2Light, IconPqName } from '@/components/icons/svgIcons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { commonClasses } from '../constants/classes';
import { toast } from '@/components/ui/use-toast';

const FormSchema = z.object({
  email: z.string({
    // required_error: "Please select designation.",
  }).email(),
})

function LinkInvalid() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    }
  })


  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  async function resendEmail(data: z.infer<typeof FormSchema>) {
    try {
      const dataResp = await fetch(`${baseUrl}/v1/api/users/resend_verification_email/`, { method: "POST", body: JSON.stringify({ email: data.email }), headers: { "Authorization": `Token e08e9b0a4c7f0e9e64b14259b40e0a0874a7587b`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()
      if (result.status == "1") {
        toast({
          title: `Email Resent Succesfully!`,
          variant: "dark"
        })
        console.log(result)
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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // resendEmail(data)

  }
  return (
    <div className="flex flex-col justify-center items-center h-full  bg-[url('/images/link-invalid-bg.jpg')] bg-cover bg-no-repeat bg-center	">
      <div className='flex flex-col min-w-[552px] rounded-[12px] gap-[24px] bg-[#E8DFD6] p-[16px] justify-center items-center min-h-[276px] box-shadow-custom1'>
        <div className='flex flex-row gap-[16px] justify-center items-center'>
          <IconPq2 size={57} />
          <IconPqName height={42} width={141} />
        </div>
        <div className='flex flex-col gap-[12px] items-center justify-center'>
          <div className='flex flex-col text-[30px] font-normal'>
            link expired
          </div>
          <div className='max-w-[472px] text-center text-md font-normal text-gray-600'>
            Either the provided activation token is invalid or this account has already been activated.
          </div>
        </div>
        {/* <div className="bg-gray-200 h-[1px] w-full" /> */}
        {/* <div className="flex flex-row gap-2 justify-end w-full mr-[10px]">
          <Button variant={"google"} >Close</Button>
          <Dialog >
            <DialogTrigger asChild>
              <Button > Request New</Button>
            </DialogTrigger>
            <DialogContent className="p-0" >
              <Form {...form}>
                <form className='flex flex-col gap-[20px] h-full px-[30px] py-[24px] min-w-[400px]' onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-700 text-xl font-medium'>Email</FormLabel>
                        <FormControl>
                          <Input type="email" className={`mb-5 ${commonClasses}`} placeholder="Enter Email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className='flex flex-row justify-end'>
                    <Button type='submit' disabled={!form.formState.isValid}> Resend Email</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div> */}
      </div>

    </div>
  )
}

export default LinkInvalid