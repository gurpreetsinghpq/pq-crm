"use client"

import { STATUSES } from "@/app/constants/constants"
import { IconArchive, IconArrowDown, IconEdit } from "@/components/icons/svgIcons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronDownIcon, MoreVertical } from "lucide-react"



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type LeadInterface = {
    id: string
    title: string
    region: string
    source: string,
    status: string,
    budgetRange: string,
    createdBy: string,
    owner: string,
    createdOn: string,
    role: string
}

function getClassOfStatus(statusName: string) {
    const status = STATUSES.find((status) => status.label === statusName)
    const render = <div className={`flex flex-row gap-2 items-center  pl-2 pr-3 py-1 w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status?.class} `}>
        {status?.icon && <status.icon />}
        {status?.label}
    </div>
    return render
}

export const columns: ColumnDef<LeadInterface>[] = [
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
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Title
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <span className="text-gray-900 text-sm">{row.getValue("title")}</span> 
    },
    {
        accessorKey: "region",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Region
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("region")}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "source",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Source
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("source")}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Status
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div>{getClassOfStatus(row.getValue("status"))}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "budgetRange",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Budget Range
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("budgetRange")}</div>
    },
    {
        accessorKey: "owner",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Owned By
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("owner")}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "createdBy",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Created By
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        }, cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("createdBy")}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "createdOn",
        header: ({ column }) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center cursor-pointer"
                >
                    Created On
                    <IconArrowDown size={20} />
                    {/* <ChevronDownIcon size={20}/> */}
                    {/* <IconDropdown/> */}
                </div>
            )
        },
        cell: ({ row }) => <div className=" font-normal">
            <div className="text-gray-900 text-sm ">
                {row.getValue("createdOn")}
            </div>
            <div className="text-gray-600 text-xs ">

            </div>

        </div>
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
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
                        <DropdownMenuItem onClick={()=>{console.log(row)}}>
                            <div className="flex flex-row gap-2 items-center" >
                                <IconEdit size={16} />
                                Edit
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <div className="flex flex-row gap-2 items-center">
                                <IconArchive size={16} color={"#344054"} />
                                Archive
                            </div>
                        </DropdownMenuItem>
                        {/* <DropdownMenuSeparator /> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]
