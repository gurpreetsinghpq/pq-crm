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
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import DataTable from "./table/datatable"
import { LeadInterface, columns } from "./table/columns"


type Checked = DropdownMenuCheckboxItemProps["checked"]

function getData(): LeadInterface[] {
    return [
      {
        id: "728ed52f",
        budgetRange: "INR 1cr - 2cr",
        createdBy: "Varun Aggarwal",
        createdOn: "December 20, 2021",
        owner:"Varun Aggarwal",
        region:"India",
        source: "Linkedin",
        status: "Unverified",
        title: "Swiggy - IND - CTO"
      },
      // ...
    ]
  }

const Leads =  () => {
    const [showIndia, setshowIndia] = React.useState<Checked>(true)
    const [showUsa, setshowUsa] = React.useState<Checked>(false)
    const [showUk, setshowUk] = React.useState<Checked>(false)
    const data = getData()

    return <div>
        <div className="flex flex-row place-content-between top px-6 py-5 border-b-2 border-gray-100">
            <div className="w-1/2 flex flex-row gap-4 items-center">
                <Command className="border w-2/3">
                    <CommandInput placeholder="Search" className="text-md" />
                </Command>
                <div className="flex flex-row gap-1">
                    <Button variant={"outline"}>
                        <Image src="/inbox.svg" alt="plus lead" sizes="100vw" width={0} height={0} style={{ width: '100%', height: 'auto', objectFit: "contain" }} />
                    </Button>
                    <Button variant={"outline"}>
                        <Image src="/archive.svg" alt="plus lead" width={0} height={0} style={{ width: '100%', height: 'auto', objectFit: "contain" }} />
                    </Button>
                </div>
            </div>
            <div className="right flex flex-row gap-4 ">
                <Button className="flex flex-row gap-2">
                    <Image src="/plus.svg" alt="plus lead" height={20} width={20} />
                    Add Lead
                </Button>
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Image className="cursor-pointer" src="/dots-vertical.svg" alt="plus lead" height={20} width={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuCheckboxItem
                            checked={showIndia}
                            onCheckedChange={setshowIndia}
                        >
                            India
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showUsa}
                            onCheckedChange={setshowUsa}
                        >
                            USA
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showUk}
                            onCheckedChange={setshowUk}
                        >
                            UK
                        </DropdownMenuCheckboxItem>

                    </DropdownMenuContent>
                </DropdownMenu>


            </div>
        </div>
        <div className="bottom">
            <div className="filters  px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
                <h2 className="text-sm w-1/3">No Leads</h2>
                <div className="w-2/3 flex flex-row gap-3 justify-end">
                    <Button variant={"google"}>
                        <Image width={20} height={20} alt="Refresh" src={"/refresh.svg"} />
                    </Button>
                    <div>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="google" className="flex flex-row gap-2">All Regions
                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={showIndia}
                                    onCheckedChange={setshowIndia}
                                >
                                    India
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUsa}
                                    onCheckedChange={setshowUsa}
                                >
                                    USA
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUk}
                                    onCheckedChange={setshowUk}
                                >
                                    UK
                                </DropdownMenuCheckboxItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="google" className="flex flex-row gap-2">All Owners
                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={showIndia}
                                    onCheckedChange={setshowIndia}
                                >
                                    India
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUsa}
                                    onCheckedChange={setshowUsa}
                                >
                                    USA
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUk}
                                    onCheckedChange={setshowUk}
                                >
                                    UK
                                </DropdownMenuCheckboxItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="google" className="flex flex-row gap-2">All Sources
                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={showIndia}
                                    onCheckedChange={setshowIndia}
                                >
                                    India
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUsa}
                                    onCheckedChange={setshowUsa}
                                >
                                    USA
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUk}
                                    onCheckedChange={setshowUk}
                                >
                                    UK
                                </DropdownMenuCheckboxItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="google" className="flex flex-row gap-2">All Time
                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={showIndia}
                                    onCheckedChange={setshowIndia}
                                >
                                    India
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUsa}
                                    onCheckedChange={setshowUsa}
                                >
                                    USA
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUk}
                                    onCheckedChange={setshowUk}
                                >
                                    UK
                                </DropdownMenuCheckboxItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="google" className="flex flex-row gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <circle cx="5" cy="5" r="4" fill="#17B26A" />
                                    </svg>
                                    All Statuses
                                    <Image width={20} height={20} alt="Refresh" src={"/chevron-down.svg"} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={showIndia}
                                    onCheckedChange={setshowIndia}
                                >
                                    India
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUsa}
                                    onCheckedChange={setshowUsa}
                                >
                                    USA
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUk}
                                    onCheckedChange={setshowUk}
                                >
                                    UK
                                </DropdownMenuCheckboxItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <div className="table w-full">
                <DataTable columns={columns} data={data}/>
            </div>
        </div>


    </div>
}

export default Leads