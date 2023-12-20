"use client"

import { ACTIVITY_STATUSES, STATUSES } from "@/app/constants/constants"
import { ActivityAccToEntity, ActivityPatchBody, LeadInterface, Permission } from "@/app/interfaces/interface"
import { IconArchive, IconArrowDown, IconEdit, IconInbox, IconNotes } from "@/components/icons/svgIcons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUp, ArrowUpDown, Ban, CheckCircle, ChevronDown, ChevronDownIcon, MoreVertical, MoveUp } from "lucide-react"
import { TIMEZONE, getActive, getName, markStatusOfActivity, rescheduleActivity } from "../commonFunctions"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { multiLine } from "./columns"
import { getContacts, getContactsV2 } from "../sideSheetTabs/custom-stepper"
import RescheduleActivity from "../sideSheetTabs/deal-activity/reschedule-activity"
import AddNote from "../add-note"


function getClassOfStatus(statusName: string) {
    const status = ACTIVITY_STATUSES.find((status) => status.label === statusName)
    const render = <div className={`flex flex-row gap-2 items-center  pl-2 pr-3 py-1 w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status?.class} `}>
        {status?.icon && <status.icon />}
        {status?.label}
    </div>
    return render
}

export function columnsActivities(markStatus: (entityId: number, status: string) => Promise<void>, rescheduleActivity: (entityId: number, data: ActivityPatchBody) => Promise<void>, fetchData: CallableFunction, setChildDataHandler?: CallableFunction): ColumnDef<ActivityAccToEntity>[] {
    return [
        {
            accessorKey: "entity",
            accessorFn: (originalRow, index) => originalRow?.lead?.entity_name || originalRow?.organisation?.entity_name,
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Entity

                    </div>
                )
            },
            cell: ({ row }) => {
                const record = row.original
                return <div className="text-sm w-fit flex flex-col">
                    <div className="text-gray-900 font-medium">
                        {/* <div className="text-gray-600">
                            {`(${record.entity_type})`}
                        </div> */}
                        {record.entity_type}
                    </div>
                    <div className="text-gray-600 font-normal">
                        {row.getValue("entity") || <span className="text-gray-400">—</span>}
                    </div>
                </div>
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "title",
            accessorFn: (originalRow) => originalRow.title,
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Activity
                    </div>
                )
            },
            cell: ({ row }) => <span className="text-gray-600 font-normal text-sm w-fit">{row.getValue("title") || <span className="text-gray-400">—</span>}</span>
        },
       
        {
            accessorKey: "mode",
            accessorFn: (originalRow) => originalRow.mode,
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center min-w-[100px]"
                    >
                        Mode
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{row.getValue("mode")}</div>,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "contacts",
            accessorFn: (originalRow, index) => originalRow.contacts,
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Contact
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-gray-600 text-sm font-normal">{getContactsV2(row.getValue("contacts"))}</div>
        },
        {
            accessorKey: "assigned_to",
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Assigned to
                    </div>
                )
            },
            cell: ({ row }) => <div className={`${getActive(row.getValue("assigned_to")) ? "text-gray-600" : "text-gray-400"}  text-sm font-normal`}>{getName(row.getValue("assigned_to")) || "—"}</div>,
            filterFn: (row, id, value) => {
                const rowData: any = row.getValue(id)
                return value.includes(rowData?.id?.toString())
            },
        },
        {
            accessorKey: "status",
            accessorFn: (originalRow) => originalRow.status,
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center w-[150px]"
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
            accessorKey: "created_by",
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Created By
                    </div>
                )
            }, cell: ({ row }) => <div className={`${getActive(row.getValue("created_by")) ? "text-gray-600" : "text-gray-400"}  text-sm font-normal`}>{getName(row.getValue("created_by"), "API") || "API"}</div>,
            filterFn: (row, id, value) => {
                const rowData: any = row.getValue(id)
                return value.includes(rowData?.id?.toString())
            },
        },
        {
            accessorKey: "due_date",
            accessorFn: (originalRow) => originalRow.due_date,
            header: ({ column }) => {
                return (
                    <div
                        onClick={() => {
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }}
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center cursor-pointer"
                    >
                        Due Date/Time
                        <IconArrowDown size={20} />
                    </div>
                )
            },
            cell: ({ row }) => <div className=" font-normal">
                {multiLine(row.getValue("due_date"))}

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
                            return true;
                        }


                        return createdOnDate >= startDate && createdOnDate <= endDate;
                    }
                    return true
                }
                return true
            },
            sortingFn: (a, b) => {
                return +new Date(a.getValue("due_date")) - +new Date(b.getValue("due_date"));
            },

        },
        {
            accessorKey: "next_step",
            accessorFn: (originalRow) => originalRow?.notes?.next_step || null,
            header: ({ column }) => {
                return (
                    <div
                        className="text-xs text-gray-600 flex flex-row gap-2 items-center"
                    >
                        Next Step
                    </div>
                )
            }, cell: ({ row }) => <div className={`text-gray-600  text-sm font-normal`}>{row.getValue("next_step") ?
                <div className="flex flex-row gap-[20px] items-center cursor-pointer">
                    <div className="shrink-0">
                        {row.original.notes && <IconNotes color='#7F56D9' size={16} />}
                    </div>
                    {row.getValue("next_step")}
                </div>
                : "—"}</div>,
            filterFn: (row, id, value) => {
                const rowData: any = row.getValue(id)
                return value.includes(rowData?.id?.toString())
            },
        },
        {
            id: "actions",
            enableHiding: true,
            cell: ({ row, cell }) => {
                const details = row.original
                return (
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {(details.status === "Over Due" || details.status === "In Progress") && <>
                                {
                                    (details.id && details.status === "In Progress")  && <>
                                        <RescheduleActivity rescheduleActivity={rescheduleActivity} key={details.id} data={details} entityId={details.id} contactFromParents={details.contacts} isReassign={true}/>
                                    </>
                                }
                                {
                                    details.id && <>
                                        <RescheduleActivity rescheduleActivity={rescheduleActivity} key={details.id} data={details} entityId={details.id} contactFromParents={details.contacts} />
                                    </>
                                }
                                <DropdownMenuItem onClick={() => markStatus && details.id && markStatus(details.id, "Completed")}>
                                    <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                                        <div>
                                            <CheckCircle className='text-success-700' size={16} />
                                        </div>
                                        Mark as Completed
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => markStatus && details.id && markStatus(details.id, "Cancelled")}>
                                    <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                                        <div>
                                            <Ban className='text-error-600' size={16} />
                                        </div>
                                        Mark as Cancelled
                                    </div>
                                </DropdownMenuItem>
                            </>}
                            {
                                (details.status === "Completed" || details.status === "Cancelled") && <>
                                    {
                                        !details.notes ? <>
                                            <AddNote activityDetails={{ details, fetchData }} contactFromParents={details.contacts} />
                                        </> : <>
                                            <DropdownMenuItem onClick={() => setChildDataHandler && setChildDataHandler('row', row)}>
                                                <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                                                    <div>
                                                        <IconNotes color='#7F56D9' size={16} />
                                                    </div>
                                                    View Notes
                                                </div>
                                            </DropdownMenuItem>
                                        </>
                                    }
                                </>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },

        },


    ]
}
