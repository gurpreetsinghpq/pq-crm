"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreVertical} from "lucide-react"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type LeadInterface = {
    id: string
    title: String
    region: String
    source: string,
    status: String,
    budgetRange: String,
    createdBy: String,
    owner: String,
    createdOn: String
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
        header: "Title",
    },
    {
        accessorKey: "region",
        header: "Region",
    },
    {
        accessorKey: "source",
        header: "Source",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "budgetRange",
        header: "Budget Range",
    },
    {
        accessorKey: "createdBy",
        header: "Created By",
    },
    {
        accessorKey: "owner",
        header: "Owner",
    },
    {
        accessorKey: "createdOn",
        header: "Created On",
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
                <DropdownMenuItem>Promote to Propect</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },

]
