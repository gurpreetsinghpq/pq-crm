"use client"

import { STATUSES } from "@/app/constants/constants"
import { LeadInterface, Permission, ServiceContractGetResponse } from "@/app/interfaces/interface"
import { IconArchive, IconArrowDown, IconEdit, IconInbox } from "@/components/icons/svgIcons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronDownIcon, MoreVertical } from "lucide-react"
import { TIMEZONE, getActive, getName } from "../commonFunctions"
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
    const status = STATUSES.find((status) => status.label === statusName)
    const render = <div className={`flex flex-row gap-2 items-center  pl-2 pr-3 py-1 w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status?.class} `}>
        {status?.icon && <status.icon />}
        {status?.label}
    </div>
    return render
}

export function columnsServiceContacts(setChildDataHandler?: CallableFunction): ColumnDef<ServiceContractGetResponse>[] {
    return [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected()}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Select all"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Select row"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Name
                    </div>
                )
            },
            cell: ({ row }) => <span className="text-gray-900 text-sm">{row.getValue("name")}</span>
        },
        {
            accessorKey: "file_size",
            accessorFn: (originalRow, index) => originalRow.file_size,
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        File Size
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("file_size")}</div>,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "file_type",
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        File Type
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("file_type")}</div>,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "event_date",
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Event Date
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("event_date")}</div>,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Status
                    </div>
                )
            },
            cell: ({ row }) => <div>{getClassOfStatus(row.getValue("status"))}</div>,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            id: "actions",
            enableHiding: true,
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
                            <DropdownMenuItem onClick={() => setChildDataHandler && setChildDataHandler('row', row)}>
                                <div className="flex flex-row gap-2 items-center" >
                                    <IconEdit size={16} />
                                    Edit
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },

        },


    ]
}
export const multiLine = (dateStr: any) => {
    const formattedDate = formatUtcDateToLocal(dateStr);
    const [date, time] = formattedDate.split("@");
    return <>
        <div className="text-gray-900 text-sm font-normal">{date}</div>
        <div className="text-gray-600 text-xs font-normal">{time}</div>
    </>
}
export const multiLineStyle2 = (dateStr: any, displayInline:boolean=false) => {
    const formattedDate = formatUtcDateToLocal(dateStr, true);
    const [date, time] = formattedDate.split("@");
    return <>
        <div className={`${displayInline ? "inline" :"block"}`}>{date}, {time}</div>
    </>
}


function formatUtcDateToLocal(backendUtcDate: any, removeCommaAfterDay?:boolean) {

    const inputString = new Date(backendUtcDate).toLocaleString('en-US', { timeZone: TIMEZONE, hour12: false })
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const [datePart, timePart] = inputString.split(', ');
    const [month, date, year] = datePart.split('/');
    const timeString = timePart;

    const formattedDate = `${months[parseInt(month) - 1]} ${parseInt(date)}${removeCommaAfterDay?"":","} ${year}`;
    const [hours, minutes] = timeString.split(':');
    const numericHours = parseInt(hours);
    const period = numericHours >= 12 ? 'pm' : 'am';
    const formattedHours = numericHours === 0 ? 12 : (numericHours > 12 ? numericHours - 12 : numericHours);
    const formattedTime = `${formattedHours}:${minutes}${period}`;



    return `${formattedDate}@${formattedTime}`;
}
function capitalizeFirstLetters(inputString: string) {
    return inputString.replace(/\b\w/g, char => char.toUpperCase());
}