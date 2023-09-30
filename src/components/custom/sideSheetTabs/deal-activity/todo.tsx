import React, { useEffect, useState } from 'react'
import CustomStepper from '../custom-stepper'
import { SIDESHEET_TAB_TYPE, STEPPER_STATUS } from '@/app/constants/constants'
import { Stepper, TodoListGetResponse } from '@/app/interfaces/interface'
import { getToken } from '../../commonFunctions'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

let dataFromApi: TodoListGetResponse[] = []

function Todo({ entityId }: { entityId: number }) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [todoList, setTodoList] = useState<TodoListGetResponse[]>()
    // const randomDetails: Stepper[] = []
    // for (let i = 0; i < 2; i++) {
    //     randomDetails.push(generateRandomStepper());
    // }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()

    async function fetchTodoList(noArchiveFilter: boolean = false) {
        setIsLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/activity/to_do/?lead=${entityId}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: TodoListGetResponse[] = structuredClone(result.data)
            // dataFromApi = addTitleToTodoList(data)
            let updatedData = data.map((val)=>{
                val.typeOfEntity="todo"
                return val
            })
            setTodoList(updatedData)
            setIsLoading(false)

        }
        catch (err) {
            setIsLoading(false)
            console.log("error", err)
        }
    }

    async function markStatusOfActivity(entityId:number, status:string){
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/activity/${entityId}/update_status/`, { method: "PATCH", body: JSON.stringify({status}), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            toast({
                title: `Activity Marked as ${status} Succesfully!`,
                variant: "dark"
            })
            fetchTodoList()
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchTodoList()
    }, [])

    return (
        <div>
            {
                todoList ? todoList.length>0? todoList.map((val, index) => {
                    return <div className='custom-stepper'>
                        <CustomStepper markStatusOfActivity={markStatusOfActivity} details={{ ...val, isLastChild: index === todoList.length - 1 ? true : false }} />
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

export default Todo