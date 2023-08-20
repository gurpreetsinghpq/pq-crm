import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import AddLeadDetailedDialog from './addLeadDetailedDialog'

const AddLeadDialog = ({ children }: { children: any }) => {
    const [inputAccount, setInputAccount] = useState("")
    const [open, setOpen] = useState(false)

    function onChangeHandler(data: string) {
        console.log(data)
        setInputAccount(data)
    }

    function onDialogChangeHandler(value: boolean) {
        setOpen(value)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0" >
                    <DialogHeader >
                        <DialogTitle className="px-[24px] pt-[30px] pb-[10px]">
                            <span className="text-lg">Add Lead</span>
                        </DialogTitle>
                    </DialogHeader>
                    <Separator className="bg-gray-200 h-[1px] " />
                    <div className="flex flex-col w-[500px]">
                        <div className="flex flex-col mx-6 gap-2">
                            <div className="flex flex-row gap-[10px] items-center">
                                <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 20 20" fill="none">
                                        <g id="building-03">
                                            <path id="Icon" d="M6.25 5.83333H8.54166M6.25 9.16667H8.54166M6.25 12.5H8.54166M11.4583 5.83333H13.75M11.4583 9.16667H13.75M11.4583 12.5H13.75M16.6667 17.5V5.16667C16.6667 4.23325 16.6667 3.76654 16.485 3.41002C16.3252 3.09641 16.0703 2.84144 15.7566 2.68166C15.4001 2.5 14.9334 2.5 14 2.5H6C5.06658 2.5 4.59987 2.5 4.24335 2.68166C3.92974 2.84144 3.67478 3.09641 3.51499 3.41002C3.33333 3.76654 3.33333 4.23325 3.33333 5.16667V17.5M18.3333 17.5H1.66666" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </div>
                                <span className="text-xs text-gray-700">ACCOUNT</span>
                                <div className="bg-gray-200 h-[1px] w-full" />
                            </div>
                            <Command className="hover:border-purple-300 hover:shadow-custom1 mt-[6px] rounded-[8px] border-[1px] border-gray-300 shadow-xs ">
                                <CommandInput onValueChange={(e) => { onChangeHandler(e) }} value={inputAccount} className="text-md" placeholder="Enter Organization Name" />
                                <CommandList className='flex flex-col'>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandItem className="flex flex-row justify-between px-4 py-4">
                                        <div className="flex flex-row gap-2">
                                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 20 20" fill="none">
                                                    <g id="building-03">
                                                        <path id="Icon" d="M6.25 5.83333H8.54166M6.25 9.16667H8.54166M6.25 12.5H8.54166M11.4583 5.83333H13.75M11.4583 9.16667H13.75M11.4583 12.5H13.75M16.6667 17.5V5.16667C16.6667 4.23325 16.6667 3.76654 16.485 3.41002C16.3252 3.09641 16.0703 2.84144 15.7566 2.68166C15.4001 2.5 14.9334 2.5 14 2.5H6C5.06658 2.5 4.59987 2.5 4.24335 2.68166C3.92974 2.84144 3.67478 3.09641 3.51499 3.41002C3.33333 3.76654 3.33333 4.23325 3.33333 5.16667V17.5M18.3333 17.5H1.66666" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                    </g>
                                                </svg>
                                            </div>
                                            <span>Swiggy</span>
                                        </div>
                                    </CommandItem>
                                    <CommandItem className="flex flex-row gap-2 px-4 py-4">
                                        <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 20 20" fill="none">
                                                <g id="building-03">
                                                    <path id="Icon" d="M6.25 5.83333H8.54166M6.25 9.16667H8.54166M6.25 12.5H8.54166M11.4583 5.83333H13.75M11.4583 9.16667H13.75M11.4583 12.5H13.75M16.6667 17.5V5.16667C16.6667 4.23325 16.6667 3.76654 16.485 3.41002C16.3252 3.09641 16.0703 2.84144 15.7566 2.68166C15.4001 2.5 14.9334 2.5 14 2.5H6C5.06658 2.5 4.59987 2.5 4.24335 2.68166C3.92974 2.84144 3.67478 3.09641 3.51499 3.41002C3.33333 3.76654 3.33333 4.23325 3.33333 5.16667V17.5M18.3333 17.5H1.66666" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                            </svg>
                                        </div>
                                        <span>Swish Bank</span>
                                    </CommandItem>
                                    <Separator />
                                    {
                                        inputAccount &&
                                        <div >
                                            <AddLeadDetailedDialog>
                                                <div className='flex flex-row order-last justify-between gap-2 px-4 py-4 items-center cursor-pointer'>
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                                            <svg width="auto" height="auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g id="plus-square">
                                                                    <path id="Icon" d="M8 5.33333V10.6667M5.33333 8H10.6667M5.2 14H10.8C11.9201 14 12.4802 14 12.908 13.782C13.2843 13.5903 13.5903 13.2843 13.782 12.908C14 12.4802 14 11.9201 14 10.8V5.2C14 4.0799 14 3.51984 13.782 3.09202C13.5903 2.71569 13.2843 2.40973 12.908 2.21799C12.4802 2 11.9201 2 10.8 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.0799 2 5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14Z" stroke="#7F56D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className='flex flex-row'>
                                                            <span className='text-purple-600 font-medium text-md '>Add <span className='font-semibold'>'{inputAccount}'</span> as new account</span>
                                                        </div>
                                                    </div>
                                                    <span className='text-xs text-purple-600 font-normal'>↵ Enter</span>
                                                </div>
                                            </AddLeadDetailedDialog>
                                        </div>
                                    }
                                </CommandList>
                            </Command>
                        </div>
                        <Separator className="bg-gray-200 h-[1px]  mt-8" />
                        <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                            <DialogClose asChild>
                                <Button variant={"google"} >Cancel</Button>
                            </DialogClose>
                            <Button disabled>Save & Add</Button>
                        </div>
                    </div>

                </DialogContent >
            </Dialog >
        </>
    )
}

export default AddLeadDialog