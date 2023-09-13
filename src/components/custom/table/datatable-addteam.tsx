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
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "./data-table-pagination"
import { ALL_DESIGNATIONS, ALL_FUNCTIONS, ALL_LAST_FUNDING_STAGE, ALL_PROFILES, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_TYPES, CREATORS, DOMAINS, INDUSTRIES, OWNERS, REGIONS, SIZE_OF_COMPANY, SOURCES, STATUSES } from "@/app/constants/constants"
import { ContactsGetResponse, IValueLabel } from "@/app/interfaces/interface"
import { TableContext } from "@/app/helper/context"

interface LeadInterfaceFilter {
  regions?: string[]
  sources?: string[]
  statuses?: string[]
  creators?: string[]
  owners?: string[],
  search?: string,
  dateRange?: any,
  queryParamString?: string
}
interface ProspectInterfaceFilter {
  regions?: string[]
  sources?: string[]
  statuses?: string[]
  creators?: string[]
  owners?: string[],
  search?: string,
  dateRange?: any,
  queryParamString?: string
}
interface AccountInterfaceFilter {
  industries?: string[]
  domains?: string[]
  segments?: string[]
  sizes?: string[]
  fundingStages?: string[],
  creators?: string[],
  accounts?: string[],
  search?: string,
  dateRange?: any,
  queryParamString?: string
}

interface ContactInterfaceFilter {
  designations?: string[]
  types?: string[]
  search?: string,
  dateRange?: any,
  queryParamString?: string
}

interface UsersInterfaceFilter {
  functions?: string[]
  profiles?: string[]
  regions?: string[]
  statuses?: string[]
  search?: string,
  dateRange?: any,
  queryParamString?: string
}

interface TeamsInterfaceFilter {
  teamLeaders?: string[]
  search?: string,
  dateRange?: any,
  queryParamString?: string
}

type FilterObject = LeadInterfaceFilter & ProspectInterfaceFilter & AccountInterfaceFilter & ContactInterfaceFilter & UsersInterfaceFilter & TeamsInterfaceFilter

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterObj: FilterObject,
  setTableLeadRow: CallableFunction,
  setTable: CallableFunction,
  setChildDataHandler: CallableFunction,
  setIsMultiSelectOn: CallableFunction,
  page: string
}

export default function DataTableAddTeamDialog<TData, TValue>({
  columns,
  data,
  filterObj,
  setTableLeadRow,
  setChildDataHandler,
  setIsMultiSelectOn,
  page,
  setTable
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )


  const tbl: any = useRef(null)

  // const { tableLeadLength, setTableLeadRow } = useContext(TableContext)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const getRowId = useCallback((row: any) => {
    return row.id
  }, [])

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
    getRowId,
  })


  useEffect(() => {
    switch (page) {
      case "teamsDialog":
        setTeamsDialogFilter()
        break;

    }


    console.log(filterObj)

  }, [filterObj])
  useEffect(() => {
    setTableLeadRow(table.getFilteredRowModel())
  }, [table.getFilteredRowModel().rows.length, table.getSelectedRowModel()])
  useEffect(() => {
    setTable(table)
    
  }, [])

  function setTeamsDialogFilter() {
    console.log(filterObj.search)
    table.getColumn("name")?.setFilterValue(filterObj.search)
  }

  function valueToLabel(key: Exclude<keyof FilterObject, "search" | "dateRange" | "queryParamString">, arr: IValueLabel[]) {
    return filterObj[key]?.map((val) => arr.find((item) => item.value === val)?.label)
  }


  return (
    <div className="flex flex-col flex-1">
      <div className="border-[1px] border-gray-200 flex-1 " ref={tbl}>
        {tbl.current?.offsetHeight && (<div style={{  height: page==='teamsDialog' ? "200px": `${tbl.current?.offsetHeight - 3}px` }} className={` overflow-y-scroll`}>
          <Table className="flex-1 " >
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
                        cell.column.id !== 'select' && cell.column.id !== 'actions' && setChildDataHandler('row', row)
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
    </div>
  )
}


