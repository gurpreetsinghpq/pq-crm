"use client"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

import * as React from "react"
import { DropdownMenuCheckboxItemProps, RadioGroup } from "@radix-ui/react-dropdown-menu"
import DataTable from "./table/datatable"
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import AddLeadDialog from "./addLeadDialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronDownIcon, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "../ui/use-toast"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses, INDUSTRIES, ALL_DOMAINS, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_LAST_FUNDING_STAGE, DESIGNATION, ALL_DESIGNATIONS, ALL_TYPES, ALL_FUNCTIONS, ALL_PROFILES } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconArchive, IconArchive2, IconArrowSquareRight, IconContacts, IconCross, IconInbox, IconUserCheck, IconUserCross, IconUsers, Unverified } from "../icons/svgIcons"
import { DateRangePicker, getLastWeek } from "../ui/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { ClientGetResponse, ContactsGetResponse, IValueLabel, LeadInterface, PatchLead, User, UsersGetResponse } from "@/app/interfaces/interface"
// import { getData } from "@/app/dummy/dummydata"
import Loader from "./loader"
import { TableContext } from "@/app/helper/context"
import SideSheet from "./sideSheet"
import { useRouter, useSearchParams } from "next/navigation"

import { Router } from "next/router"
import { RowModel } from "@tanstack/react-table"
import { columnsClient } from "./table/columns-client"
import { columnsContacts } from "./table/columns-contact"
import SideSheetContacts from "./sideSheetContacts"
import AddUserDialogBox from "./addUserDialogBox"
import { columnsUsers } from "./table/columns-users"
import Users from "./users"
import Teams from "./teams"
import { COMMON_TAB_CLASSES, SELECTED_TAB_CLASSES } from "@/app/constants/classes"
import { UseFormReturn } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import Profiles from "./profiles"

type Checked = DropdownMenuCheckboxItemProps["checked"]



const FormSchema = z.object({
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    functions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    profiles: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    // owners: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one Owner.",
    // }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

// let tableLeadLength = 0

export interface IChildData {
    row: any
}
let dataFromApi: UsersGetResponse[] = []

const TABS = {
    USERS: "Users",
    TEAMS: "Teams",
    PROFILES: "Profiles"
}

const tabs: IValueLabel[] = [
    { value: TABS.USERS, label: TABS.USERS },
    { value: TABS.TEAMS, label: TABS.TEAMS },
    { value: TABS.PROFILES, label: TABS.PROFILES }
];


const UserManagement = ({ usersForm, teamsForm, profilesForm }: {
    usersForm: UseFormReturn<{
        regions: string[];
        functions: string[];
        profiles: string[];
        statuses: string[];
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>, teamsForm: UseFormReturn<{
        teamLeaders: string[];
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>,
    profilesForm: UseFormReturn<{
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>
}) => {
    const { toast } = useToast()

    const [currentTab, setCurrentTab] = React.useState<string>(TABS.USERS)

    return <div className="flex flex-col flex-1">
        {/* <div onClick={() => setCurrentTab(TABS.USERS)} className={`${COMMON_TAB_CLASSES} ${currentTab === TABS.USERS && SELECTED_TAB_CLASSES}`}>{TABS.USERS}</div>
            <div onClick={() => setCurrentTab(TABS.TEAMS)} className={`${COMMON_TAB_CLASSES} ${currentTab === TABS.TEAMS && SELECTED_TAB_CLASSES}`}>{TABS.TEAMS}</div>
        <div onClick={() => setCurrentTab(TABS.PROFILES)} className={`${COMMON_TAB_CLASSES} ${currentTab === TABS.PROFILES && SELECTED_TAB_CLASSES}`}>{TABS.PROFILES}</div> */}
        <Tabs defaultValue={TABS.PROFILES} className="flex flex-col flex-1">
            <div className="flex flex-row px-6 py-3 border-b-2 border-gray-100">
                <TabsList className=' justify-start px-[12px] py-[2px] gap-[12px]' >
                    {tabs.map((tab) => {
                        return <TabsTrigger key={tab.value} value={tab.value} ><div >{tab.label}</div></TabsTrigger>
                    })}
                </TabsList>
            </div>
            <div className="bottom flex-1 flex flex-col  ">
                <TabsContent value={TABS.USERS} className="flex flex-col flex-1">
                    <Users form={usersForm} />
                </TabsContent>
                <TabsContent value={TABS.TEAMS} className="flex flex-col flex-1">
                    <Teams form={teamsForm} />
                </TabsContent>
                <TabsContent value={TABS.PROFILES} className="flex flex-col flex-1">
                    <Profiles form={profilesForm} />
                </TabsContent>
            </div>
        </Tabs>
    </div>
}

export default UserManagement