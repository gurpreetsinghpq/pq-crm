"use client"

import { PROSPECT_STATUSES, STATUSES } from "@/app/constants/constants"
import { LeadInterface, Permission, ProspectsGetResponse } from "@/app/interfaces/interface"
import { IconArchive, IconArrowDown, IconEdit, IconInbox } from "@/components/icons/svgIcons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronDownIcon, MoreVertical } from "lucide-react"
import { getName } from "../commonFunctions"
import { multiLine } from "./columns"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"



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

function getClassOfStatus(statusName: string) {
    const status = PROSPECT_STATUSES.find((status) => status.label === statusName)
    const render = <div className={`flex flex-row gap-2 items-center  pl-2 pr-3 py-1 w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status?.class} `}>
        {status?.icon && <status.icon />}
        {status?.label}
    </div>
    return render
}

export function columnsProspects(setChildDataHandler: CallableFunction, patchArchiveProspectData: CallableFunction, isInbox: boolean, permissions: Permission): ColumnDef<ProspectsGetResponse>[] {
    return [
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
            accessorKey: "title",
            accessorFn: (originalRow, index) => originalRow.lead.title,
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
            accessorFn: (originalRow, index) => originalRow.lead.role.region,
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
            accessorFn: (originalRow, index) => originalRow.lead.source,
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
            accessorFn: (originalRow, index) => originalRow.status,
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
            accessorKey: "budget_range",
            accessorFn: (originalRow, index) => originalRow.lead.role.budget_range,
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
            cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("budget_range")}</div>
        },
        {
            accessorKey: "owner",
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Owned By
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{getName(row.getValue("owner")) || "—"}</div>,
            filterFn: (row, id, value) => {
                const rowData: any = row.getValue(id)
                return value.includes(rowData?.id?.toString())
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
            }, cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{getName(row.getValue("created_by")) || "—"}</div>,
            filterFn: (row, id, value) => {
                const rowData: any = row.getValue(id)
                return value.includes(rowData?.id?.toString())
            },
        },
        {
            accessorKey: "created_at",
            accessorFn: (originalRow, index) => originalRow.created_at,
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
            },
            sortingFn: (a, b) => {
                return +new Date(a.getValue("created_at")) - +new Date(b.getValue("created_at"));
            },
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
                            <DropdownMenuItem onClick={() => setChildDataHandler('row', row)}>
                                <div className="flex flex-row gap-2 items-center" >
                                    <IconEdit size={16} />
                                    Edit
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={!permissions?.change} onSelect={(e) => e.preventDefault()}>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="flex flex-row gap-2 items-center">
                                            {isInbox ? <IconArchive size={16} color={"#344054"} /> : <IconInbox size={16} color={"#344054"} />}
                                            {isInbox ? "Archive" : "Move to Inbox"}
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                                        <div className='w-fit'>
                                            <div className='flex flex-col gap-[32px] min-w-[380px] '>
                                                <div className='flex flex-col gap-[5px]'>
                                                    <div className='text-gray-900 text-lg'>Are you sure you want to continue?</div>
                                                    <div className='text-gray-600 font-normal font text-sm'> <span className="font-bold">1 Prospect </span> will be {isInbox ? "Archived" : "moved to Inbox"}</div>
                                                </div>
                                                <div className='flex flex-row gap-[12px] w-full'>
                                                    <DialogClose asChild>
                                                        <Button type="button" className='text-sm flex-1 font-semibold  px-[38px] py-[10px]' variant={'google'}>Cancel</Button>
                                                    </DialogClose>
                                                    <Button type="button" onClick={() => { patchArchiveProspectData([row.original.id]) }} className='flex-1 text-sm font-semibold px-[38px] py-[10px]'>{isInbox ? "Archive" : "Confirm"} </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </DropdownMenuItem>
                            {/* <DropdownMenuSeparator /> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },

    ]
}

