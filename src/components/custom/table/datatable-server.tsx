"use client"

import {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
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
import { use, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "./data-table-pagination"
import { ALL_DESIGNATIONS, ALL_FUNCTIONS, ALL_LAST_FUNDING_STAGE, ALL_PROFILES, ALL_PROSPECT_STATUSES, ALL_SEGMENTS, ALL_SIZE_OF_COMPANY, ALL_TYPES, CREATORS, DEAL_STATUSES, DOMAINS, INDUSTRIES, OWNERS, PROSPECT_STATUSES, REGIONS, SIZE_OF_COMPANY, SOURCES, STATUSES } from "@/app/constants/constants"
import { ContactsGetResponse, FilterQuery, IValueLabel } from "@/app/interfaces/interface"
import { TableContext } from "@/app/helper/context"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"
import { arrayToCsvString } from "../commonFunctions"
import useCreateQueryString from "@/hooks/useCreateQueryString"
import { useCreateFilterQueryString } from "@/hooks/useCreateFilterQueryString"

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

interface DealsInterfaceFilter {
  // regions?: string[]
  sources?: string[]
  statuses?: string[]
  fulfilledBy?: string[]
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

type FilterObject = LeadInterfaceFilter & ProspectInterfaceFilter & DealsInterfaceFilter & AccountInterfaceFilter & ContactInterfaceFilter & UsersInterfaceFilter & TeamsInterfaceFilter

interface HiddenIf {
  threeDots?: boolean,
  multiCheckBoxes?:boolean,
}

const emptyFilterQuery: FilterQuery = { filterFieldName: '', value: null }

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterObj: FilterObject,
  setTableLeadRow: CallableFunction,
  setChildDataHandler: CallableFunction,
  setIsMultiSelectOn: CallableFunction,
  pageName: string,
  hidden?: HiddenIf,
  pageCount?: number
}
let accountFilteredData: FilterQuery[] = []
  
export default function DataTableServer<TData, TValue>({
  columns,
  data,
  filterObj,
  setTableLeadRow,
  setChildDataHandler,
  setIsMultiSelectOn,
  pageName,
  hidden = {
    threeDots: false
  },
  pageCount
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Search params
  const pg = searchParams?.get("page") ?? "1"
  const pageAsNumber = Number(pg)
  const fallbackPage =
  isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  const per_page = searchParams?.get("limit") ?? "10"
  const perPageAsNumber = Number(per_page)
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
  const createdAtSort = searchParams?.get("created_at")
  const dueDateSort = searchParams?.get("due_date")
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "created_at" ?? "",
      desc: createdAtSort === "1",
    },
    {
      id: "due_date" ?? "",
      desc: dueDateSort === "1",
    },
  ])


  const createQueryString = useCreateQueryString()
    const createFilterQueryString = useCreateFilterQueryString()

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    useState<PaginationState>({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage,
    })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  useEffect(() => {
    setPagination({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage,
    })
  }, [fallbackPage, fallbackPerPage])

  useEffect(()=>{
    const createdAt = sorting.find(val=>val.id==="created_at")
    if(createdAt){
      router.push(
        `${pathname}?${createQueryString({
          page:pageIndex+1,
          created_at: createdAt.id ? createdAt?.desc ? "1": "0" : null
        })}`
      )
    }

    const duedate = sorting.find(val=>val.id==="due_date")
    if(duedate){
      router.push(
        `${pathname}?${createQueryString({
          page:pageIndex+1,
          due_date: duedate.id ? duedate?.desc ? "1": "0" : null
        })}`
      )
    }
  },[sorting])

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize,
      })}`,
      {
        scroll: false,
      }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize])

  // Handle server-side sorting
  //  const [sorting, setSorting] = useState<SortingState>([
  //   {
  //     id: column ?? "",
  //     desc: order === "desc",
  //   },
  // ])





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
    onPaginationChange: setPagination,
    pageCount: pageCount ?? -1,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    getRowId,
  })


  useEffect(() => {
    setTableLeadRow(table.getFilteredRowModel())
  }, [table.getFilteredRowModel().rows.length, table.getSelectedRowModel()])

  // useEffect(() => {
  //   console.log(table.getFilteredRowModel())
  // }, [table.getFilteredRowModel()])

  useEffect(() => {
    if (hidden?.threeDots) {
      setColumnVisibility(() => {
        return {
          "actions": false
        }
      })
    }
    if(hidden?.multiCheckBoxes){
      setColumnVisibility(()=>{
        return {
          "select":false
        }
      })
    }
  }, [])

  

  useEffect(()=>{
    // createFilterQueryString(accountFilteredData)
  },[JSON.stringify(accountFilteredData)])

  
  function handleTableChange() {

  }

  function valueToLabel(key: Exclude<keyof FilterObject, "search" | "dateRange" | "queryParamString">, arr: IValueLabel[]) {
    return filterObj[key]?.map((val) => arr.find((item) => item.value === val)?.label)
  }



  return (
    <div className="flex flex-col flex-1">
      <div className="border-[1px] border-gray-200 flex-1 " ref={tbl}>
        {tbl.current?.offsetHeight && (<div style={{ height: pageName === 'teamsDialog' ? "200px" : `${tbl.current?.offsetHeight - 3}px`}} className={` overflow-y-scroll`}>
          <Table className="flex-1 " onChange={handleTableChange}>
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
      {pageName !== "teamsDialog" && <div className="pl-[16px] pr-[16px] py-4">
        <DataTablePagination table={table} />
      </div>}
    </div>
  )
}


