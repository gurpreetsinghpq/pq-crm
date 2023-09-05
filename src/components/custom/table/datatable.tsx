"use client"

import {
  Cell,
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
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
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
    search: string,
    dateRange?: any,
    queryParamString: string
  },
  setTableLeadRow: CallableFunction,
  setChildDataHandler: CallableFunction,
  setIsMultiSelectOn: CallableFunction
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  filterObj,
  setTableLeadRow,
  setChildDataHandler,
  setIsMultiSelectOn
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )


  const tbl: any = useRef(null)

  // const { tableLeadLength, setTableLeadRow } = useContext(TableContext)

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
      table.getColumn("created_by")?.setFilterValue("")
    }
    else {
      const creatorFilter = valueToLabel("creators", CREATORS)
      table.getColumn("created_by")?.setFilterValue(creatorFilter)
    }


    // table.getColumn("id")?.setFilterValue(filterObj.ids)

    table.getColumn("title")?.setFilterValue(filterObj.search)
    table.getColumn("created_at")?.setFilterValue(filterObj.dateRange)
  
  console.log(filterObj)

  }, [filterObj])
  useEffect(() => {
    setTableLeadRow(table.getFilteredRowModel())
  }, [table.getFilteredRowModel().rows.length, table.getSelectedRowModel()])


  function handleTableChange() {
    console.log("hey")
  }

  function valueToLabel(key: Exclude<keyof typeof filterObj, "search" | "dateRange" | "queryParamString">, arr: IValueLabel[]) {
    return filterObj[key].map((val) => arr.find((item) => item.value === val)?.label)
  }

  
  return (
    <div className="flex flex-col flex-1">
      <div className="border-[1px] border-gray-200 flex-1 " ref={tbl}>
        {tbl.current?.offsetHeight && (<div style={{ height: `${tbl.current?.offsetHeight - 3}px` }} className={` overflow-y-scroll`}>
          <Table className="flex-1 " onChange={handleTableChange} >
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
                      return (<TableCell key={cell.id} onClick={() => {
                        console.log("from datatable ", cell)
                        cell.column.id !== 'select' && cell.column.id !== 'actions'  && setChildDataHandler('row', row) 
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
        </div>)}
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
      <div className="pl-[16px] pr-[16px] py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}


