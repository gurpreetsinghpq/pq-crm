"use client"

import { LAST_FUNDING_STAGE, SEGMENT, STATUSES } from "@/app/constants/constants"
import { ClientGetResponse, LeadInterface } from "@/app/interfaces/interface"
import { IconArchive, IconArrowDown, IconEdit } from "@/components/icons/svgIcons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronDownIcon, MoreVertical } from "lucide-react"
import { getActive, getName } from "../commonFunctions"
import { multiLine } from "./columns"



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

function getClassOfSegment(segmentName: string) {
    const segment = SEGMENT.find((segment) => segment.label === segmentName)
    const render = <div className={`flex flex-row gap-2 items-center text-sm font-medium justify-center items-center pl-[8px] pr-[10px] py-[4px]  w-fit ${!segment?.isDefault && 'border border-[1.5px] rounded-[8px]'} ${segment?.class} `}>
        {segment?.label}
    </div>
    if(segment?.label){
        return render
    }else{
        return "—"
    }
}
function getIcon(segmentName: string) {
    const lastFundingStage = LAST_FUNDING_STAGE.find((status) => status.acronym === segmentName)
    const render = <>{lastFundingStage?.icon && <lastFundingStage.icon /> || "—"}</>
        
    
    return render
}

export function columnsClient(setChildDataHandler:CallableFunction): ColumnDef<ClientGetResponse>[] { return [
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
    // {
    //     accessorKey: "id",
    //     header: ({ column }) => {
    //         return (
    //             <div
    //                 // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //                 className="text-xs text-gray-600 flex flex-row gap-2 items-center"
    //             >
    //                 Id
    //                 {/* <IconArrowDown size={20} /> */}
    //             </div>
    //         )
    //     },

    //     cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("id")}</div>,
    //     filterFn: (row, id, value) => {
    //         console.log(row,id,value)
    //         return value.includes(row.getValue(id))
    //     },        
    //     enableHiding:true,


    // },    
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Name
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <span className="text-gray-900 text-sm">{row.getValue("name")}</span>
    },
    {
        accessorKey: "industry",
        accessorFn: (originalRow, index) => originalRow.industry,
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Industry
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal ">{row.getValue("industry") ||  "—" }</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "domain",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Domain
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("domain") || "—"}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "segment",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Segment
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 font-normal">{getClassOfSegment(row.getValue("segment"))}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "size",
        accessorFn: (originalRow, index) => originalRow.size,
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Size
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("size") || "—"}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "last_funding_stage",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Last Funding Round
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("last_funding_stage") || "—"}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "created_by",
        header: ({ column }) => {
            return (
                <div
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Created By
                </div>
            )
        }, cell: ({ row }) => <div className={`${ getActive(row.getValue("created_by")) ? "text-gray-600": "text-gray-400"}  text-sm font-normal`}>{ getName(row.getValue("created_by"), "API") || "API"}</div>,
        filterFn: (row, id, value) => {
            const rowData:any = row.getValue(id)
            return value.includes(rowData?.id?.toString())
        },
    },
    {
        accessorKey: "created_at",
        
        header: ({ column }) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center cursor-pointer"
                >
                    Created On
                    <IconArrowDown size={20} />
                    
                </div>
            )
        },
        cell: ({ row }) => <div className=" font-normal">
            {multiLine(row.getValue("created_at"))}

        </div>,
        filterFn: (row, id, value) => {
            const { range } = value
            if (range) {
                const startDate = range?.from;
                const endDate = range?.to;
                if (startDate && endDate) {
                    const createdOnDate = new Date(row.getValue(id));
                    endDate.setHours(23, 59, 0, 0)

                    if (!startDate || !endDate) {
                        return true; // No date range specified, don't apply filtering
                    }


                    return createdOnDate >= startDate && createdOnDate <= endDate;
                }
                return true
            }
            return true
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row, cell }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={()=>setChildDataHandler('row',row)}>
                            <div className="flex flex-row gap-2 items-center" >
                                <IconEdit size={16} />
                                Edit
                            </div>
                        </DropdownMenuItem>
                        {/* <DropdownMenuSeparator /> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]}

function capitalizeFirstLetters(inputString: string) {
    return inputString.replace(/\b\w/g, char => char.toUpperCase());
}