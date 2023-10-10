"use client"

import { LAST_FUNDING_STAGE, STATUSES, TYPE } from "@/app/constants/constants"
import { ClientGetResponse, ContactsGetResponse, LeadInterface, UsersGetResponse } from "@/app/interfaces/interface"
import { IconArchive, IconArrowDown, IconEdit } from "@/components/icons/svgIcons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronDownIcon, MoreVertical } from "lucide-react"



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type LeadInterface = {
//     id: string
//     title: string
//     region: string
//     source: string,
//     status: string,
//     budgetRange: string,
//     createdBy: string,
//     owner: string,
//     createdOn: string,
//     role: string,
//     contacts: Contact[],
// }

// export type Contact = {
//     contactName: string,
//     designation: string,
//     contactType: string,
//     email: string,
//     countryCode: string,
//     phoneNo: string,
//     contactId: string
// }

function getClassOfType(typeName: string) {
    const status = TYPE.find((type) => type.label === typeName)
    const render = <div className={`flex flex-row gap-2 items-center px-[10px] py-[4px] w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[8px]'} ${status?.class} `}>
        {status?.label}
    </div>
    return render
}
function getIcon(segmentName: string) {
    const lastFundingStage = TYPE.find((status) => status.acronym === segmentName)
    const render = <>{lastFundingStage?.icon && <lastFundingStage.icon /> || "—"}</>
        
    
    return render
}


export const columnsTeamsDialog: ColumnDef<UsersGetResponse>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        accessorFn: (row) => `${row.first_name} ${row.last_name} {} ${row.email}`,
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Name & Email
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div><span className="text-gray-900 text-sm">{getTextMultiLine(row.getValue("name"))}</span></div>
    },
    {
        accessorKey: "mobile",
        accessorFn: (originalRow, index) => originalRow.mobile,
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Mobile
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal ">{row.getValue("mobile") ||  "—" }</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
]
const getTextMultiLine = (text: any) => {
    const [name, email] = text.split("{}");
    return <>
        <div className="text-gray-900 text-sm font-normal">{name}</div>
        <div className="text-gray-600 text-xs font-normal">{email}</div>
    </>
}


function capitalizeFirstLetters(inputString: string) {
    return inputString.replace(/\b\w/g, char => char.toUpperCase());
}