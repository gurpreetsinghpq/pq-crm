import React, { useEffect, useState } from 'react'
import CustomStepper from '../custom-stepper'
import { SIDESHEET_TAB_TYPE, STEPPER_STATUS } from '@/app/constants/constants'
import { HistoryAllMode, NotesHistory, Stepper, } from '@/app/interfaces/interface'
import { getToken } from '../../commonFunctions'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'


function HistoryAll({ entityId, data }: { entityId: number, data: HistoryAllMode  | undefined }) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [historyNotesList, setHistoryNotesList] = useState<HistoryAllMode>()
    // const randomDetails: Stepper[] = []
    // for (let i = 0; i < 2; i++) {
    //     randomDetails.push(generateRandomStepper());
    // }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()


    useEffect(() => {
        setHistoryNotesList(data)
        console.log("history all list", data)
    }, [])

    return (
        <div>
            {
                historyNotesList ? historyNotesList.length>0? historyNotesList.map((val, index) => {
                    return <div className='custom-stepper'>
                        <CustomStepper details={{ ...val, isLastChild: index === historyNotesList.length - 1 ? true : false }} />
                    </div>
                }) : <> No data found </> : <> <Loader2 className="mr-2 h-4 w-4 animate-spin " size={80} /></>
            }
        </div>
    )


}

// function addTitleTohistoryNotesList(historyNotesList: historyNotesListGetResponse[]): historyNotesListGetResponse[] {
//     const typeCounts: Record<string, number> = {};


//     for (const todo of historyNotesList) {
//         const type = todo.type;

//         typeCounts[type] = (typeCounts[type] || 0) + 1;
//         todo.title = `${type} ${typeCounts[type]}`;
//     }

//     return historyNotesList;
// }

export default HistoryAll