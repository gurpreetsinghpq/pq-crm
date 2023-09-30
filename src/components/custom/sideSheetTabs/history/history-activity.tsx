import React, { useEffect, useState } from 'react'
import CustomStepper from '../custom-stepper'
import { SIDESHEET_TAB_TYPE, STEPPER_STATUS } from '@/app/constants/constants'
import { ActivityAccToEntity, ActivityHistory, Stepper, TodoListGetResponse } from '@/app/interfaces/interface'
import { getToken } from '../../commonFunctions'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

let dataFromApi: TodoListGetResponse[] = []

function HistoryActivity({ entityId, data }: { entityId: number, data:ActivityHistory[] | undefined}) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [activityList, setActivityList] = useState<ActivityHistory[]>()
    // const randomDetails: Stepper[] = []
    // for (let i = 0; i < 2; i++) {
    //     randomDetails.push(generateRandomStepper());
    // }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()

   

    useEffect(() => {
        
        setActivityList(data)
        console.log("history activity list",data)
    }, [])

    return (
        <div>
            {
                activityList ? activityList.length>0? activityList.map((val, index) => {
                    return <div className='custom-stepper'>
                        <CustomStepper details={{ ...val, isLastChild: index === activityList.length - 1 ? true : false }} />
                    </div>
                }) : <> No data found </> : <> <Loader2 className="mr-2 h-4 w-4 animate-spin " size={80} /></>
            }
        </div>
    )


}

// function addTitleToTodoList(todoList: TodoListGetResponse[]): TodoListGetResponse[] {
//     const typeCounts: Record<string, number> = {};


//     for (const todo of todoList) {
//         const type = todo.type;

//         typeCounts[type] = (typeCounts[type] || 0) + 1;
//         todo.title = `${type} ${typeCounts[type]}`;
//     }

//     return todoList;
// }

export default HistoryActivity