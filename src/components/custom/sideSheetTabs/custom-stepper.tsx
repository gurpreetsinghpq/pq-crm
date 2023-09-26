import { SIDESHEET_TAB_TYPE, STEPPER_STATUS } from '@/app/constants/constants'
import { Stepper } from '@/app/interfaces/interface'
import { IconActivity, IconCalendar, IconChangeLog, IconCheckCircle, IconContacts, IconEmail, IconNotes } from '@/components/icons/svgIcons'
import React from 'react'
import { valueToLabel } from '../sideSheet'
import { multiLine, multiLineStyle2 } from '../table/columns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Ban, CheckCircle, MoreVertical } from 'lucide-react'

function CustomStepper({ details }: { details: Stepper }) {

    
    const status = STEPPER_STATUS.find(val => val.label === details.status)
    return (
        <div className='custom-stepper-parent flex flex-row gap-[16px]'>
            <div className='custom-stepper-child flex flex-col items-center'>
                <div className='h-[48px] w-[48px] rounded-[10px] border-[1px] border-gray-200 bg-white-900 shadow-xs flex flex-row justify-center items-center'>
                    {details.type === SIDESHEET_TAB_TYPE.CHANGE_LOG && <IconChangeLog />}
                    {details.type === SIDESHEET_TAB_TYPE.ACTIVITY && <IconActivity />}
                    {details.type === SIDESHEET_TAB_TYPE.NOTES && <IconNotes />}
                </div>
                {!details?.isLastChild && <div className='custom-stepper-grandchild w-[2px] bg-gray-200 rounded-[2px] flex-1'>
                </div>}
            </div>
            <div className='mb-[20px] p-[16px] rounded-[10px] border-[1px] border-gray-200 bg-white-900 shadow-xs xl:min-w-[650px]  2xl:min-w-[800px]'>
                <div className='flex flex-col gap-[18px]'>
                    <div className='flex flex-row justify-between'>
                        <div className='text-md font-semibold text-gray-700'>
                            {details?.title}
                        </div>
                        <div className='flex flex-row gap-[12px]'>
                            <div className={`flex flex-row items-center gap-[6px] ${status?.class}`}>
                                {status?.icon && <status.icon />}
                                {status?.label}
                            </div>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem >
                                            <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                                                <div>
                                                    <CheckCircle className='text-success-700' size={16}/>
                                                </div>
                                                Mark as Completed
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem >
                                            <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                                                <div>
                                                    <Ban className='text-error-600' size={16}/>
                                                </div>
                                                Mark as Cancelled
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        {details?.contacts && <div className='flex flex-row gap-[4px]'>
                            <div className='flex flex-row gap-[4px]'>
                                <IconContacts size="20px" color="#7F56D9" />
                            </div>
                            <div>
                                {getContacts(details.contacts)}
                            </div>
                        </div>}
                        {details?.email && <div className='flex flex-row gap-[4px]'>
                            <div className='flex flex-row gap-[4px]'>
                                <IconEmail size="20px" color="#7F56D9" />
                            </div>
                            <div className='text-sm font-medium text-gray-700'>
                                {details?.email}
                            </div>
                        </div>}
                        {details?.date && <div className='flex flex-row gap-[4px]'>
                            <div className='flex flex-row gap-[4px]'>
                                <IconCalendar size="20px" color="#7F56D9" />
                            </div>
                            <div className='text-sm font-medium text-gray-700'>
                                {multiLineStyle2(details?.date)}
                            </div>
                        </div>}
                    </div>
                    <div className="bg-gray-200 h-[1px] w-full" ></div>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-col flex-1'>
                            <div className='text-sm text-gray-600 font-normal'>
                                Assigned to
                            </div>
                            <div className='text-sm text-gray-700 font-medium'>
                                {details?.assignedTo}
                            </div>
                        </div>
                        <div className='flex flex-col flex-1'>
                            <div className='text-sm text-gray-600 font-normal'>
                                Created by
                            </div>
                            <div className='text-sm text-gray-700 font-medium'>
                                {details?.createdBy}
                            </div>
                        </div>
                        <div className='flex flex-col flex-1'>
                            <div className='text-sm text-gray-600 font-normal'>
                                Created at
                            </div>
                            <div className='text-sm text-gray-700 font-medium'>
                                {multiLineStyle2(details?.createdAt)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}
export function getContacts(data: string[]) {
    return <div className='flex flex-row gap-[8px] items-center'>
        <span className='text-gray-700'>
            {data[0]} {data.length>1 && <>,</>}
        </span>
        {data.length>1 && <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className='text-purple-700 text-sm font-medium underline cursor-pointer'>+{data.length-1}</span>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <div className='flex flex-col gap-[5px] py-[8px]'>{data.slice(1).map((contact) => {
                        return <div>
                            {contact}
                        </div>
                    })}</div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>}

    </div>

}
export default CustomStepper