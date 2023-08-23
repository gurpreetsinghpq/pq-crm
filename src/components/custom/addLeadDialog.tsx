"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import AddLeadDetailedDialog from './addLeadDetailedDialog'
import { IconAccounts, IconBuildings } from '../icons/svgIcons'

const duummySearchedItems = ["Swiggy", "Swish Bank"]

const AddLeadDialog = ({ children }: { children: any }) => {
    const [inputAccount, setInputAccount] = useState("")
    const [open, setOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    function onChangeHandler(data: string) {
        console.log(data)
        setInputAccount(data)
    }

    const [onDataUpdate, setOnDataUpdate] = useState()

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
                    {/* <Separator className="bg-gray-200 h-[1px] " /> */}
                    <div className={`flex flex-col ${isExpanded ? 'w-[800px]' : 'w-[500px]'}`}>
                        {!isExpanded ? <div className="flex flex-col mx-6 gap-2">
                            <div className="flex flex-row gap-[10px] items-center">
                                <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                    <IconAccounts size="20" />
                                </div>
                                <span className="text-xs text-gray-700">ACCOUNT</span>
                                <div className="bg-gray-200 h-[1px] w-full" />
                            </div>
                            <Command className="hover:border-purple-300 hover:shadow-custom1 mt-[6px] rounded-[8px] border-[1px] border-gray-300 shadow-xs ">
                                <CommandInput onValueChange={(e) => { onChangeHandler(e) }} value={inputAccount} className="text-md" placeholder="Enter Organization Name" />
                                <CommandList className='flex flex-col'>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    {duummySearchedItems.map((item:string, index) => (
                                        <CommandItem key={index} className="flex flex-row justify-between px-4 py-4">
                                            <div className='flex flex-row justify-between w-full items-center'>
                                                <div className="flex flex-row gap-2">
                                                    <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                                        <IconBuildings size="20" />
                                                    </div>
                                                    <span>{item}</span>
                                                </div>
                                                <span className='text-lg text-gray-700'>🡵</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                    <Separator />
                                    {
                                        inputAccount &&
                                        <div onClick={() => setIsExpanded(true)}>
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
                                        </div>
                                    }
                                </CommandList>
                            </Command>
                        </div> : <div>
                            <AddLeadDetailedDialog setOnDataUpdate={setOnDataUpdate} inputAccount={inputAccount}/>
                        </div>}
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