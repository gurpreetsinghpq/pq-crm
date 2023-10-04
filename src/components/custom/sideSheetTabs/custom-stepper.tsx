import { ALL_STATUS_MERGED, SIDESHEET_TAB_TYPE, STATUSES, STEPPER_STATUS } from '@/app/constants/constants'
import { ActivityAccToEntity, ActivityHistory, ChangeLogHistory, NotesHistory, Permission, Stepper, TodoListGetResponse } from '@/app/interfaces/interface'
import { IconActivity, IconCalendar, IconChangeLog, IconCheckCircle, IconClock, IconContacts, IconEmail, IconNotes, IconUserEdit, IconUserRight } from '@/components/icons/svgIcons'
import React from 'react'
import { valueToLabel } from '../sideSheet'
import { multiLine, multiLineStyle2 } from '../table/columns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowRight, Ban, CheckCircle, MoreVertical } from 'lucide-react'
import { backendkeyToTitle, changeBooleanToYesOrNo } from '../commonFunctions'


type DetailsType = Partial<TodoListGetResponse> & Partial<ActivityHistory> & Partial<NotesHistory> & Partial<ChangeLogHistory>;


function CustomStepper({ details, markStatusOfActivity, permissions }: {
    details: DetailsType
    , markStatusOfActivity?: (entityId: number, status: string) => Promise<void>,
    permissions?: Permission
}) {

    const status = STEPPER_STATUS.find(val => val.label === details?.status)


    const isFirstForm = (details?.activity_type?.toLowerCase() === "cold outreach") && (details?.mode?.toLowerCase() === "call" || details?.mode?.toLowerCase() === "video call" || details?.mode?.toLowerCase() === "in-person")
    const isSecondForm = (details?.activity_type?.toLowerCase() === "cold outreach") && (details?.mode?.toLowerCase() === "email" || details?.mode?.toLowerCase() === "linkedin")
    const isThirdForm = (details?.activity_type?.toLowerCase() === "exploratory discussion")
    const isFourthForm = (details?.activity_type?.toLowerCase() === "follow-up")
    const isFifthForm = (details?.activity_type?.toLowerCase() === "negotiation")
    const isSixthForm = (details?.activity_type?.toLowerCase() === "inbound lead verification") && (details?.mode?.toLowerCase() === "call" || details?.mode?.toLowerCase() === "video call" || details?.mode?.toLowerCase() === "in-person")
    const isSeventhForm = (details?.activity_type?.toLowerCase() === "inbound lead verification") && (details?.mode?.toLowerCase() === "email" || details?.mode?.toLowerCase() === "linkedin")
    console.log("details", details.activity_type?.toLowerCase(), "mode", details?.mode?.toLowerCase(), "isFirstForm, isSecondForm, isThirdForm, isFourthForm, isFifthForm, isSixthForm, isSeventhForm", isFirstForm, isSecondForm, isThirdForm, isFourthForm, isFifthForm, isSixthForm, isSeventhForm)

    return (
        <div className='custom-stepper-parent flex flex-row gap-[16px]'>
            <div className='custom-stepper-child flex flex-col items-center'>
                <div className='h-[48px] w-[48px] rounded-[10px] border-[1px] border-gray-200 bg-white-900 shadow-xs flex flex-row justify-center items-center'>
                    {details.typeOfEntity === "changelog" && <IconChangeLog />}
                    {(details.typeOfEntity === "todo" || details.typeOfEntity === "activity") && <IconActivity />}
                    {details.typeOfEntity === "notes" && <IconNotes />}
                </div>
                {!details?.isLastChild && <div className='custom-stepper-grandchild w-[2px] bg-gray-200 rounded-[2px] flex-1'>
                </div>}
            </div>
            <div className={`mb-[20px] p-[16px] rounded-[10px] xl:min-w-[650px]  2xl:min-w-[800px] ${details.typeOfEntity != "changelog" && "border-[1px] border-gray-200 bg-white-900 shadow-xs"}`}>
                {(details.typeOfEntity === "todo" || details.typeOfEntity === "activity") && <div className='flex flex-col gap-[18px]'>
                    <div className='flex flex-row justify-between'>
                        <div className='text-md font-semibold text-gray-700'>
                            {details?.title}
                        </div>
                        <div className='flex flex-row gap-[12px]'>
                            <div className={`flex flex-row items-center gap-[6px] ${status?.class} rounded-[20px]`}>
                                {status?.icon && <status.icon />}
                                {status?.label}
                            </div>
                            {details.typeOfEntity === "todo" && permissions?.change && <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => markStatusOfActivity && details.id && markStatusOfActivity(details.id, "Completed")}>
                                            <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                                                <div>
                                                    <CheckCircle className='text-success-700' size={16} />
                                                </div>
                                                Mark as Completed
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => markStatusOfActivity && details.id && markStatusOfActivity(details.id, "Cancelled")}>
                                            <div className="text-gray-700 text-sm font-medium flex flex-row items-center gap-[8px]" >
                                                <div>
                                                    <Ban className='text-error-600' size={16} />
                                                </div>
                                                Mark as Cancelled
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>}
                        </div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        {details?.contacts && <div className='flex flex-row gap-[4px] items-center'>
                            <div className='flex flex-row gap-[4px]'>
                                <IconContacts size="20px" color="#98A2B3" />
                            </div>
                            <div className='text-sm font-medium'>
                                {getContacts(details.contacts.map(val => val.name))}
                            </div>
                        </div>}
                        {details?.mode && <div className='flex flex-row gap-[4px]'>
                            <div className='flex flex-row gap-[4px]'>
                                {/* <IconEmail size="20px" color="#98A2B3" /> */}
                                <IconUserRight color="#98A2B3" />
                            </div>
                            <div className='text-sm font-medium text-gray-700'>
                                {details?.mode}
                            </div>
                        </div>}
                        {details?.created_at && <div className='flex flex-row gap-[4px]'>
                            <div className='flex flex-row gap-[4px]'>
                                <IconCalendar size="20px" color="#98A2B3" />
                            </div>
                            <div className='text-sm font-medium text-gray-700'>
                                {multiLineStyle2(details?.due_date)}
                            </div>
                        </div>}
                    </div>
                    <div className="bg-gray-200 h-[1px] w-full" ></div>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-col flex-1'>
                            <div className='text-sm text-gray-600 font-normal'>
                                Assigned to
                            </div>
                            <div className='text-sm text-gray-700 font-medium'>
                                {details?.assigned_to?.name}

                            </div>
                        </div>
                        <div className='flex flex-col flex-1'>
                            <div className='text-sm text-gray-600 font-normal'>
                                Created by
                            </div>
                            <div className='text-sm text-gray-700 font-medium'>
                                {details?.created_by?.name}
                            </div>
                        </div>
                        <div className='flex flex-col flex-1'>
                            <div className='text-sm text-gray-600 font-normal'>
                                Created at
                            </div>
                            <div className='text-sm text-gray-700 font-medium'>
                                {multiLineStyle2(details?.created_at)}
                            </div>
                        </div>

                    </div>
                </div>}
                {details.typeOfEntity === "notes" && <div className='flex flex-col gap-[18px]'>
                    <div className='flex flex-row justify-between'>
                        <div className='text-md font-semibold text-gray-700'>
                            {details?.activity_type}
                        </div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        {details?.contacts && <div className='flex flex-row gap-[4px] items-center'>
                            <div className='flex flex-row gap-[4px]'>
                                <IconContacts size="20px" color="#98A2B3" />
                            </div>
                            <div className='text-sm font-medium'>
                                {getContacts(details.contacts.map(val => val.name))}
                            </div>
                        </div>}
                        {details?.mode && <div className='flex flex-row gap-[4px]'>
                            <div className='flex flex-row gap-[4px]'>
                                {/* <IconEmail size="20px" color="#98A2B3" /> */}
                                <IconUserRight color="#98A2B3" />
                            </div>
                            <div className='text-sm font-medium text-gray-700'>
                                {details?.mode}
                            </div>
                        </div>}
                        {details?.created_at && <div className='flex flex-row gap-[4px]'>
                            <div className='flex flex-row gap-[4px]'>
                                <IconClock size="20px" color="#98A2B3" />
                            </div>
                            <div className='text-sm font-medium text-gray-700'>
                                {multiLineStyle2(details?.created_at)}
                            </div>
                        </div>}
                    </div>
                    <div className="bg-gray-200 h-[1px] w-full" ></div>
                    <div className='grid grid-cols-2 gap-y-[16px]'>
                        {(isSecondForm || isSeventhForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Response Received
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {changeBooleanToYesOrNo(details?.is_response_shared)}
                            </div>
                        </div>}
                        {(isFirstForm || isSecondForm || isThirdForm || isFourthForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Role Status
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.role_status || "—"}
                            </div>
                        </div>}
                        {(isFifthForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Deal Status
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.deal_status || "—"}
                            </div>
                        </div>}
                        {(isFirstForm || isSixthForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Role Urgency
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.role_urgency || "—"}
                            </div>
                        </div>}
                        {(isThirdForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Role Clarity
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {changeBooleanToYesOrNo(details?.is_role_clear)}
                            </div>
                        </div>}
                        {(isFifthForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Negotiation Blocker
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.negotiation_broker || "—"}
                            </div>
                        </div>}
                        {(isThirdForm || isFourthForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Willing to Pay Retainer Advance
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.is_willing_pay_ra || "—"}
                            </div>
                        </div>}
                        {(isThirdForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Proposal Shared
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {changeBooleanToYesOrNo(details?.is_proposal_shared)}
                            </div>
                        </div>}
                        {(isFifthForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Service Contract Draft Shared
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {changeBooleanToYesOrNo(details?.is_contract_draft_shared)}
                            </div>
                        </div>}
                        {(isThirdForm || isFourthForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Expected Service Fee Range
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.exp_service_fee || "—"}
                            </div>
                        </div>}
                        {(isFourthForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Prospect Status
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.prospect_status || "—"}
                            </div>
                        </div>}
                        {(isFirstForm || isSixthForm || isSeventhForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Open to Retainer Model
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.is_retainer_model || "—"}
                            </div>
                        </div>}
                        {(isFirstForm || isSixthForm || isSeventhForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Open to Min Service Fee or Flat Fee
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.is_min_flat_Service || "—"}
                            </div>
                        </div>}
                        {(isFirstForm || isSecondForm || isSixthForm || isSeventhForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Collateral Shared
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {changeBooleanToYesOrNo(details?.is_collateral_shared)}
                            </div>
                        </div>}
                        {(isSecondForm) && <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Open to Engage
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.is_open_engange || "—"}
                            </div>
                        </div>}
                        {<div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Next Step
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.next_step || "—"}
                            </div>
                        </div>}
                        <div className='flex flex-col gap-[2px]'>
                            <div className='text-gray-600 text-sm font-normal'>
                                Created By
                            </div>
                            <div className='text-gray-700 text-sm font-medium'>
                                {details?.created_by?.name}
                            </div>
                        </div>

                    </div>
                </div>}
                {
                    details.typeOfEntity === "changelog" && <div className=''>
                        <div className='flex flex-col gap-[16px]'>
                            <div className='flex flex-row text-sm font-normal items-center gap-[5px]'>
                                <div className='text-gray-700 font-medium'>
                                    {/* {details.field_name !== "is_created"? <div> */}
                                    {/* {backendkeyToTitle(details.field_name || "—")}: */}
                                    {details.description}
                                    {/* </div>:<div >{details.description} </div>} */}
                                </div>
                                {!(details.field_name === "is_created" || details.field_name === "is_converted_to_prospect") && <div className='font-semibold flex flex-row gap-[5px] items-center'>
                                    :
                                    <div className='flex flex-row'>
                                        {fetchStatusOrDescription(details.changed_from, details.field_name?.toLowerCase() === "status")}
                                    </div>
                                    <div> <ArrowRight size={16} /> </div>
                                    <div className='flex flex-row'>
                                        {fetchStatusOrDescription(details.changed_to, details.field_name?.toLowerCase() === "status")}
                                    </div>
                                </div>}
                            </div>
                            <div className='flex flex-row gap-[24px]'>
                                <div className='flex flex-row gap-[5px]'>
                                    <IconClock size="20px" color="#98A2B3" />
                                    <div className='text-gray-700 text-sm font-normal'>{multiLineStyle2(details.created_at)}</div>
                                </div>
                                <div className='flex flex-row gap-[5px]'>
                                    <IconUserEdit size="20px" color="#98A2B3" />
                                    <div className='text-gray-700 text-sm font-normal'>{details.changed_by?.name}</div>
                                </div>
                            </div>

                        </div>

                    </div>
                }

            </div>

        </div>
    )
}
export function getContacts(data: string[]) {
    return <div className='flex flex-row gap-[8px] items-center'>
        <span className='text-gray-700'>
            {data[0]} {data.length > 1 && <>,</>}
        </span>
        {data.length > 1 && <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className='text-purple-700 text-sm font-medium underline cursor-pointer'>+{data.length - 1}</span>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <div className='flex flex-col gap-[5px] py-[8px]'>{data.slice(1).map((contact) => {
                        return <div>
                            {contact}
                        </div>
                    })}</div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>}

    </div>

}

function fetchStatusOrDescription(text: string | null | undefined, isStatus: boolean = false) {
    if (isStatus) {
        const status = ALL_STATUS_MERGED.find((status) => status.label.toLowerCase() === text?.toLowerCase())
        const render = <div className={`flex flex-row gap-2 items-center  pl-2 pr-3 py-1 w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status?.class} `}>
            {status?.icon && <status.icon />}
            {status?.label}
        </div>
        return render
    } else {
        return text || "Empty"
    }
}
export default CustomStepper