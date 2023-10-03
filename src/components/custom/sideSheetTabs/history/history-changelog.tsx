import React, { useEffect, useState } from 'react'
import CustomStepper from '../custom-stepper'
import { SIDESHEET_TAB_TYPE, STEPPER_STATUS } from '@/app/constants/constants'
import { ChangeLogHistory, NotesHistory, Stepper, } from '@/app/interfaces/interface'
import { getToken } from '../../commonFunctions'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'


function HistoryChangelog({ entityId, data }: { entityId: number, data: ChangeLogHistory[] | undefined }) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [historyChangelogList, setHistoryChangelogList] = useState<ChangeLogHistory[]>()
    // const randomDetails: Stepper[] = []
    // for (let i = 0; i < 2; i++) {
    //     randomDetails.push(generateRandomStepper());
    // }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()


    useEffect(() => {
        setHistoryChangelogList(data)
        console.log("history notes list", data)
    }, [])

    return (
        <div>
            {
                historyChangelogList && historyChangelogList.length>0? historyChangelogList.map((val, index) => {
                    return <div className='custom-stepper'>
                        <CustomStepper details={{ ...val, isLastChild: index === historyChangelogList.length - 1 ? true : false }} />
                    </div>
                }) : <> No data found </> 
            }
        </div>
    )


}

// function addTitleTohistoryChangelogList(historyChangelogList: historyChangelogListGetResponse[]): historyChangelogListGetResponse[] {
//     const typeCounts: Record<string, number> = {};


//     for (const todo of historyChangelogList) {
//         const type = todo.type;

//         typeCounts[type] = (typeCounts[type] || 0) + 1;
//         todo.title = `${type} ${typeCounts[type]}`;
//     }

//     return historyChangelogList;
// }

export default HistoryChangelog