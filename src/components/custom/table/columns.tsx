"use client"

import { STATUSES } from "@/app/constants/constants"
import { LeadInterface } from "@/app/interfaces/interface"
import { IconArchive, IconArrowDown, IconEdit } from "@/components/icons/svgIcons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
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
        accessorFn:(originalRow, index) => originalRow.role.region,
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
        accessorKey: "budget_range",
        accessorFn:(originalRow, index) => originalRow.role.budget_range,
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
        accessorKey: "created_by",
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
        }, cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("created_by")}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
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
                        <DropdownMenuItem onClick={() => { }}>
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
const multiLine = (dateStr: any) => {
    const formattedDate = formatUtcDateToLocal(dateStr);
    const [date, time] = formattedDate.split("@");
    return <>
        <div className="text-gray-900 text-sm font-normal">{date}</div>
        <div className="text-gray-600 text-xs font-normal">{time}</div>
    </>
}


function formatUtcDateToLocal(backendUtcDate: any) {


    const inputString = new Date(backendUtcDate).toLocaleString('en-US', { hour12: false })
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [datePart, timePart] = inputString.split(', ');
    const [month, date, year] = datePart.split('/');
    const timeString = timePart;

    const formattedDate = `${months[parseInt(month) - 1]} ${parseInt(date)}, ${year}`;
    const [hours, minutes] = timeString.split(':');
    const numericHours = parseInt(hours);
    const period = numericHours >= 12 ? 'pm' : 'am';
    const formattedHours = numericHours === 0 ? 12 : (numericHours > 12 ? numericHours - 12 : numericHours);
    const formattedTime = `${formattedHours}:${minutes}${period}`;

    

    return `${formattedDate}@${formattedTime}`;
}
