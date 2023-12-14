import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { ActivityPatchBody, Permission } from '@/app/interfaces/interface'
import { IconReschedule } from '@/components/icons/svgIcons'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Activity from './sideSheetTabs/deal-activity/activity'
import Image from 'next/image'


function AddActivity({fetchActivityData}:{fetchActivityData:CallableFunction}) {
    const [open, setOpen] = useState<boolean>(false)
    function yesDiscard(isAdd: boolean = false) {
        setOpen(false)
    }
    return (

        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button className="flex flex-row gap-2">
                    <Image src="/images/plus.svg" alt="plus lead" height={20} width={20} />
                    Add Activity
                </Button>
            </DialogTrigger>
            <DialogContent className='p-0 '>
                <div className='w-fit p-0'>
                    <DialogHeader>
                        <DialogTitle className="px-[24px] pt-[30px] pb-[10px]">
                            <span className="text-lg">Create Activity</span>
                        </DialogTitle>
                        <div className="bg-gray-200 h-[1px]  mt-8" />
                    </DialogHeader>
                    <div className='flex flex-col gap-[32px] min-w-[780px] '>
                        <div>
                            <Activity contactFromParents={null} entityId={-1} addDialog={{isAddDialog:true, yesDiscard, fetchActivityData}} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default AddActivity