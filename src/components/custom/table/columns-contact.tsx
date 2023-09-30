"use client"

import { LAST_FUNDING_STAGE, STATUSES, TYPE } from "@/app/constants/constants"
import { ClientGetResponse, ContactsGetResponse, LeadInterface } from "@/app/interfaces/interface"
import { IconArchive, IconArrowDown, IconEdit } from "@/components/icons/svgIcons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronDownIcon, MoreVertical } from "lucide-react"
import { getName } from "../commonFunctions"
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


export function columnsContacts(setChildDataHandler:CallableFunction): ColumnDef<ContactsGetResponse>[] {return [
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
        accessorFn: (row) => `${row.name}{}${row.email}`,
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
        accessorKey: "organisation",
        accessorFn: (originalRow, index) => originalRow.organisation.name,
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Account
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal ">{row.getValue("organisation") ||  "—" }</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "designation",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Designation
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("designation") || "—"}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "phone",
        accessorFn: (row) => `${row.std_code} ${row.phone}`,
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
        cell: ({ row }) =>  <div className="text-gray-600 text-sm font-normal">{` ${row.getValue("phone")}` || "—"}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <div
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                >
                    Type
                    {/* <IconArrowDown size={20} /> */}
                </div>
            )
        },
        cell: ({ row }) => <div className="text-gray-600 font-normal">{getClassOfType(row.getValue("type"))}</div>,
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
        }, cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{ getName(row.getValue("created_by")) || "—"}</div>,
        filterFn: (row, id, value) => {
            const rowData:any = row.getValue(id)
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
        sortingFn: (a,b)=>{
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

const getTextMultiLine = (text: any) => {
    const [name, email] = text.split("{}");
    return <>
        <div className="text-gray-900 text-sm font-normal">{name}</div>
        <div className="text-gray-600 text-xs font-normal">{email}</div>
    </>
}




function formatUtcDateToLocal(backendUtcDate: any) {


    const inputString = new Date(backendUtcDate).toLocaleString('en-US', { hour12: false })
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
function capitalizeFirstLetters(inputString: string) {
    return inputString.replace(/\b\w/g, char => char.toUpperCase());
}