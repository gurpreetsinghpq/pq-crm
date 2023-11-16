import { LeadInterface } from '@/app/interfaces/interface'
import { IChildData } from '@/components/custom/leads'
import { columns } from '@/components/custom/table/columns'
import DataTable from '@/components/custom/table/datatable'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { columnsLeadRelatedEntities } from './columns-leads-related-entities'

const FormSchema = z.object({

})


function RelatedEntityLeads({ data }: { data: LeadInterface[] }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        }
    })
    const [childData, setChildData] = React.useState<IChildData>()
    const [isMultiSelectOn, setIsMultiSelectOn] = React.useState<boolean>(false)
    
    function setChildDataHandler(key: keyof IChildData, data: any) {
        setChildData((prev) => {
            return { ...prev, [key]: data }
        })
        if (!data) {
            // do something like fetching data
            // fetchLeadData()
        }
    }

    function setTableLeadRow(data: any) {
    }

    return (
        <div className='flex flex-col min-h-[75vh]'>
            <DataTable setTableLeadRow={setTableLeadRow} setIsMultiSelectOn={setIsMultiSelectOn} setChildDataHandler={setChildDataHandler} data={data} columns={columnsLeadRelatedEntities()} hidden={{ threeDots: true, multiCheckBoxes: true, paginationSelectedCount: true }} page='other' filterObj={form.getValues()} />
        </div>
    )
}

export default RelatedEntityLeads