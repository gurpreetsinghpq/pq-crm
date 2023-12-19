import React, { useState } from 'react'
import Activity from './activity'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { ActivityPatchBody, Permission } from '@/app/interfaces/interface'
import { IconAssignedTo, IconReschedule } from '@/components/icons/svgIcons'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'


function RescheduleActivity({ data, entityId, contactFromParents, rescheduleActivity, isReassign = false }: { data: any, entityId: number, contactFromParents: any, rescheduleActivity?: (entityId: number, data: ActivityPatchBody) => Promise<void>, isReassign?: boolean }) {
    const [open, setOpen] = useState<boolean>(false)
    function yesDiscard(isAdd: boolean = false) {
        setOpen(false)
    }
    return (

        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                        {isReassign ?
                            <>
                                <div>
                                    <IconAssignedTo color="#344054" size={16} />
                                </div>
                                Reassign
                            </> : <>
                                <div>
                                    <IconReschedule size={16} />
                                </div>
                                Reschedule
                            </>}
                    </div>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className='p-0 '>
                <div className='w-fit p-0'>
                    <DialogHeader>
                        <DialogTitle className="px-[24px] pt-[30px] pb-[10px]">
                            <span className="text-lg">{isReassign? "Reassign" : "Reschedule"} Activity</span>
                        </DialogTitle>
                        <div className="bg-gray-200 h-[1px]  mt-8" />
                    </DialogHeader>
                    <div className='flex flex-col gap-[32px] min-w-[780px] '>
                        <div>
                            <Activity editMode={{ isEditMode: true, data, yesDiscard, rescheduleActivity, setOpen, isReassign: isReassign }} entityId={entityId} contactFromParents={contactFromParents} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default RescheduleActivity