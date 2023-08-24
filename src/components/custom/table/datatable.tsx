"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "./data-table-pagination"
import { CREATORS, OWNERS, REGIONS, SOURCES, STATUSES } from "@/app/constants/constants"
import { IValueLabel } from "@/app/interfaces/interface"
import { TableContext } from "@/app/helper/context"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterObj: {
    regions: string[]
    sources: string[]
    statuses: string[]
    creators: string[]
    owners: string[],
    search: string
  },
  setTableLeadLength: CallableFunction,
  setChildDataHandler: CallableFunction
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  filterObj,
  setTableLeadLength,
  setChildDataHandler
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  // const { tableLeadLength, setTableLeadLength } = useContext(TableContext)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,

    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 8
      }
    },

  })

  useEffect(() => {
    if (filterObj.regions.includes("allRegions")) {
      table.getColumn("region")?.setFilterValue("")
    }
    else {
      const regionsFilter = valueToLabel("regions", REGIONS)
      table.getColumn("region")?.setFilterValue(regionsFilter)
    }

    if (filterObj.sources.includes("allSources")) {
      table.getColumn("source")?.setFilterValue("")
    }
    else {
      const sourcesFilter = valueToLabel("sources", SOURCES)
      table.getColumn("source")?.setFilterValue(sourcesFilter)
    }

    if (filterObj.statuses.includes("allStatuses")) {
      table.getColumn("status")?.setFilterValue("")
    }
    else {
      const statusFilter = valueToLabel("statuses", STATUSES)
      table.getColumn("status")?.setFilterValue(statusFilter)
    }

    if (filterObj.owners.includes("allOwners")) {
      table.getColumn("owner")?.setFilterValue("")
    }
    else {
      const ownerFilter = valueToLabel("owners", OWNERS)
      table.getColumn("owner")?.setFilterValue(ownerFilter)
    }

    if (filterObj.creators.includes("allCreators")) {
      table.getColumn("createdBy")?.setFilterValue("")
    }
    else {
      const creatorFilter = valueToLabel("creators", CREATORS)
      table.getColumn("createdBy")?.setFilterValue(creatorFilter)
    }

    table.getColumn("title")?.setFilterValue(filterObj.search)


  }, [filterObj])


  function handleTableChange() {
    console.log("hey")
  }

  function valueToLabel(key: Exclude<keyof typeof filterObj, "search">, arr: IValueLabel[]) {
    return filterObj[key].map((val) => arr.find((item) => item.value === val)?.label)
  }

  return (
    <div className="flex flex flex-col">
      <div className="border border-[1px] border-gray-200 flex flex-col h-[60vh] overflow-y-scroll">
        <Table className="" onChange={handleTableChange}>
          <TableHeader className="bg-gray-50 sticky top-0 left-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  style={{ borderWidth: "1px" }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (<TableCell key={cell.id} onClick={()=>{
                      cell.column.id!=='select' && setChildDataHandler('row', row)
                    }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>)
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4 px-5">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
      <div className="px-4 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
