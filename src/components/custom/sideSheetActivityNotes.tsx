import React, { useEffect, useState } from 'react'
import { IconCross } from '../icons/svgIcons'
import { IChildData } from './leads'
import CustomStepper from './sideSheetTabs/custom-stepper'
import { ActivityHistory, HistoryAllMode, NotesHistory } from '@/app/interfaces/interface'

function SideSheetActivityNotes({ parentData }: { parentData: { childData: IChildData, setChildDataHandler: CallableFunction } }) {
    const { childData: { row }, setChildDataHandler } = parentData
    function closeSideSheet() {
        setChildDataHandler('row', undefined)
    }
    console.log("row.original", row.original)
    const [historyNotesList, setHistoryNotesList] = useState<HistoryAllMode>()

    useEffect(() => {
        const activity: ActivityHistory = row.original
        const notes: NotesHistory = row.original.notes
        notes["typeOfEntity"] = "notes"
        notes["title"] = activity.title
        notes["activity_type"] = activity.type
        notes["mode"] = activity.mode
        activity["typeOfEntity"] = "activity"
        const data: HistoryAllMode = [activity, notes]
        setHistoryNotesList(data)
        console.log("data",data)

    }, [])



    return (
        <div className={`fixed flex flex-row z-[50] right-0 top-0 h-[100vh] w-[100vw] `} >
            <div className='w-full bg-gray-900 opacity-70 backdrop-blur-[8px] fade-in' onClick={closeSideSheet}>

            </div>
            <div className='absolute right-0 top-0 bottom-0 lg:min-w-[700px] xl:min-w-[800px]  2xl:min-w-[900px] max-w-[900px]  bg-white-900 opacity-100 slide-left'>
                <div className='absolute top-0 right-[100%] bg-white-900 p-[16px] rounded-l-[8px] cursor-pointer' onClick={closeSideSheet} >
                    <IconCross size={20} color={"#667085"} />
                </div>
                <div className='pt-[24px] h-full flex flex-col w-full'>
                    <div className='sticky top-0 bg-white-900 z-50'>
                        <div className='px-[24px] text-gray-900 text-xl font-semibold '>
                            {row.original.title}
                        </div>
                    </div>
                    <div className='flex flex-col p-[24px] w-full'>
                        {
                            historyNotesList && historyNotesList.length > 0 ? historyNotesList.map((val, index) => {
                                console.log("historyAllMode", val)
                                return <div className='custom-stepper w-full'>
                                    <CustomStepper details={{ ...val, isLastChild: index === historyNotesList.length - 1 ? true : false }} />
                                </div>
                            }) : <> No data found </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideSheetActivityNotes