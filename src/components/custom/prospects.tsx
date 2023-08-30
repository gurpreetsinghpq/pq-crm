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
import { DropdownMenuCheckboxItemProps, RadioGroup, Separator } from "@radix-ui/react-dropdown-menu"
import DataTable from "./table/datatable"
// import { LeadInterface, columns } from "./table/columns"
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import AddLeadDialog from "./addLeadDialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronDownIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "../ui/use-toast"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { OWNERS as owners, CREATORS as creators, SOURCES as sources, REGIONS as regions, STATUSES as statuses } from "@/app/constants/constants"
import { cn } from "@/lib/utils"
import { IconProspects, Unverified } from "../icons/svgIcons"

type Checked = DropdownMenuCheckboxItemProps["checked"]

function getData() {
    return [{ 
        id: "728ed52f",
        budgetRange: "INR 1Cr - 2Cr",
        createdBy: "Varun Aggarwal",
        createdOn: "2023-08-24T03:00:00Z",
        owner: "Varun Aggarwal",
        region: "India",
        source: "Linkedin",
        status: "Unverified",
        title: "Swiggy - IND - CTO",
        role: "CTO",
        contacts: [
            {
                contactName: "Candice Wu",
                designation: "HR Executive",
                contactType: "Gate Keeper",
                email:"candice@untitiledui.com",
                countryCode: "+91",
                phoneNo: "7002383842",
                contactId: "5"
            },
            {
                contactName: "John Smith",
                designation: "Sales Manager",
                contactType: "Decision Maker",
                email: "john@example.com",
                countryCode: "+1",
                phoneNo: "5551234567",
                contactId: "6"
            },
            {
                contactName: "Emma Johnson",
                designation: "Marketing Director",
                contactType: "Influencer",
                email: "emma@companyxyz.com",
                countryCode: "+44",
                phoneNo: "7894561230",
                contactId: "7"
            },
        ]
    },]
}



const FormSchema = z.object({
    owners: z.string({
        required_error: "Please select a owner.",
    }),
    creators: z.string({
        required_error: "Please select a creator"
    }),
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one region.",
    }),
    sources: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one source.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    })
})

const Prospects = () => {
    const [showIndia, setshowIndia] = React.useState<boolean>(false);
    const [showUsa, setshowUsa] = React.useState<boolean>(false);
    const [showUk, setshowUk] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            regions: ["india", "usa"],
            sources: ["referral", "events"],
            statuses: ["junk"]
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    const [areThereAnyLeads, setAreThereAnyLeads] = React.useState<Checked>(false)
    const data = getData()

    return <div>


    </div>
}

export default Prospects