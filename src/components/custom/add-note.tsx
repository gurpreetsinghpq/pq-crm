import React, { Children, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { ActivityAccToEntity, ActivityPatchBody, Permission } from '@/app/interfaces/interface'
import { IconNotes, IconReschedule } from '@/components/icons/svgIcons'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import Notes from './sideSheetTabs/deal-activity/notes'


function AddNote({  activityDetails, contactFromParents }: { activityDetails: ActivityAccToEntity, contactFromParents: any }) {
    const [open, setOpen] = useState<boolean>(false)
    function yesDiscard(isAdd: boolean = false) {
        setOpen(false)
    }
    return (

        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                        <div>
                            <IconNotes color='#7F56D9' size={16} />
                        </div>
                        Add Note
                    </div>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className='p-0 '>
                <div className='w-fit p-0'>
                    <DialogHeader>
                        <DialogTitle className="px-[24px] pt-[30px] pb-[10px]">
                            <span className="text-lg">Add Note</span>
                        </DialogTitle>
                        <div className="bg-gray-200 h-[1px]  mt-8" />
                    </DialogHeader>
                    <div className='flex flex-col gap-[32px] min-w-[780px] '>
                        <div>
                            <Notes contactFromParents={contactFromParents} entityId={-1} isAccounts={false} key={activityDetails.id} activityDetails={activityDetails} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default AddNote