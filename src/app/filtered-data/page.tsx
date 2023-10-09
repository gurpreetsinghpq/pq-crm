"use client"
import { columns } from '@/components/custom/table/columns'
import DataTable from '@/components/custom/table/datatable'
import React, { useEffect } from 'react'
import { IValueLabel, LeadInterface } from '../interfaces/interface'
import { IChildData, formatData } from '@/components/custom/leads'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DateRangePicker, getAllTime, getThisMonth } from '@/components/ui/date-range-picker'
import { fetchUserDataList, getToken, setToken } from '@/components/custom/commonFunctions'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Check, Loader2 } from 'lucide-react'
import { REGIONS, SOURCES, STATUSES } from '../constants/constants'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Command } from 'cmdk'
import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getCookie } from 'cookies-next'
import { useSearchParams } from 'next/navigation'


const LeadFormSchema = z.object({
  owners: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one Owner.",
  }),
  creators: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one Creator.",
  }),
  regions: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one region.",
  }),
  sources: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one source.",
  }),
  statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one status.",
  }),
  search: z.string(),
  dateRange: z.any(),
  queryParamString: z.string()
})

let dataFromApi: LeadInterface[] = []

function filteredData() {
  const [data, setLeadData] = React.useState<LeadInterface[]>([])
  const [isMultiSelectOn, setIsMultiSelectOn] = React.useState<boolean>(false)
  const [childData, setChildData] = React.useState<IChildData>()
  const [selectedRowIds, setSelectedRowIds] = React.useState<[]>()
  const [tableLeadLength, setTableLength] = React.useState<any>()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isUserDataLoading, setIsUserDataLoading] = React.useState<boolean>(true)
  const [isNetworkError, setIsNetworkError] = React.useState<boolean>(false)
  const [userList, setUserList] = React.useState<IValueLabel[]>([])

  function setTableLeadRow(data: any) {
    const selectedRows = data.rows.filter((val: any) => val.getIsSelected())
    setIsMultiSelectOn(selectedRows.length !== 0)
    const ids = selectedRows.map((val: any) => val.original.id)
    setSelectedRowIds(ids)
    setTableLength(data.rows.length)
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token_superuser = getCookie("token")

  const { from, to } = getThisMonth()
  const { fromAllTime, toAllTime } = getAllTime()
  const form = useForm<z.infer<typeof LeadFormSchema>>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      regions: ["allRegions"],
      sources: ["allSources"],
      statuses: ["allStatuses"],
      owners: ['allOwners'],
      creators: ['allCreators'],
      search: "",
      queryParamString: undefined,
      dateRange: {
        "range": {
          "from": fromAllTime,
          "to": toAllTime
        },
        rangeCompare: undefined
      }
    }
  })

  function setChildDataHandler(key: keyof IChildData, data: any) {
    setChildData((prev) => {
      return { ...prev, [key]: data }
    })
    if (!data) {
      fetchLeadData()
    }
  }

  async function fetchLeadData(noArchiveFilter: boolean = false) {
    setIsLoading(true)
    try {
      const dataResp = await fetch(`${baseUrl}/v1/api/lead/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()
      let data: LeadInterface[] = structuredClone(result.data)
      let fdata = data.map(val => {
        val.title = val.title === null ? "" : val.title
        return val
      })
      dataFromApi = fdata
      setLeadData(dataFromApi)
      setIsLoading(false)
      if (filteredData.length == 0) {
        setTableLength(0)
        setIsMultiSelectOn(false)
        setSelectedRowIds([])
      }
    }
    catch (err) {
      setIsLoading(false)
      setIsNetworkError(true)
      console.log("error", err)
    }
    getUserList()
  }

  const searchParams = useSearchParams()

  async function checkQueryParam() {
    const queryParamIds = searchParams.get("ids")
    if (queryParamIds && queryParamIds?.length > 0) {
        form.setValue("search", queryParamIds)
        form.setValue("queryParamString", queryParamIds)

        const { from, to } = getThisMonth(queryParamIds)
        form.setValue("dateRange", {
            "range": {
                "from": from,
                "to": to
            },
            rangeCompare: undefined
        })
        await fetchLeadData(true)
    } else {
        fetchLeadData()
    }
}

  async function getUserList() {
    setIsUserDataLoading(true)
    try {
      const userList: any = await fetchUserDataList()
      setIsUserDataLoading(false)
      setUserList(userList)
    } catch (err) {
      setIsUserDataLoading(false)
      console.error("user fetch error", err)
    }

  }

  useEffect(() => {
    checkQueryParam()
    const token = getCookie("token")
    const tokenAsString = String(token)
    setToken(tokenAsString)

  }, [])

  return (
    <div className='flex flex-col h-[100vh]'>
      <Form {...form}>
        <form className='flex flex-col '>
          <div className="flex flex-row place-content-between top px-6 py-5 border-b-2 border-gray-100">
            <div className="w-1/2 flex flex-row gap-4 items-center">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormControl>
                      <Input placeholder="Search" className="text-md border" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="filters px-6 py-3 border-b-2 border-gray-100 flex flex-row space-between items-center ">
            <div className=" flex items-center flex-row gap-2">
              <span className="text-sm ">{isLoading ? "Loading..." : data?.length === 0 ? "No Leads" : isMultiSelectOn ? <span>Selected {selectedRowIds?.length} out of {tableLeadLength} {tableLeadLength > 1 ? "Leads" : "Lead"}</span> : tableLeadLength > 0 ? `Showing ${tableLeadLength} ${tableLeadLength > 1 ? "Leads" : "Lead"}` : "No Leads"}</span>
              {/* {form.getValues("queryParamString") && <div
                                onClick={() => {
                                    window.history.replaceState(null, '', '/dashboard')
                                    location.reload()
                                }}
                                className="rounded-[16px] bg-gray-50 border-[1px] border-gray-200 mix-blend-multiply text-sm px-[12px] py-[4px] flex flex-row gap-[6px] items-center hover:shadow-lg hover:cursor-pointer">
                                {form.getValues("queryParamString")}
                                <IconCross size={14} color={"#98A2B3"} />
                            </div>} */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"google"} className="p-[8px]" type="button" onClick={() => {
                      fetchLeadData()
                    }}>
                      <Image width={20} height={20} alt="Refresh" src={"/images/refresh.svg"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Refresh
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex-1 flex flex-row gap-3 justify-end">
              <div>
                <DateRangePicker
                  onUpdate={(values) => form.setValue("dateRange", values)}
                  initialDateFrom={form.getValues("dateRange").range.from}
                  initialDateTo={form.getValues("dateRange").range.to}
                  queryParamString={form.getValues("queryParamString")}
                  align="start"
                  locale="en-GB"
                  showCompare={false}
                />

              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="regions"
                  render={({ field }) => {

                    return <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Regions', REGIONS)}
                          <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[160px]">
                        {
                          REGIONS.map((region) => {
                            return <DropdownMenuCheckboxItem
                              key={region.value}
                              checked={region.isDefault && field.value.length === 0 ? true : field.value?.includes(region.value)}
                              onCheckedChange={(checked) => {
                                if ((!checked && field.value.length === 1) || region.value === 'allRegions') {
                                  return field.onChange(['allRegions'])
                                } else if (checked && field.value.includes('allRegions') && region.value !== 'allRegions') {
                                  return field.onChange([...field.value?.filter((value: string) => value != 'allRegions'), region.value])
                                }
                                return checked ? field.onChange([...field.value, region.value]) : field.onChange(field.value?.filter((value: string) => value != region.value))
                              }}
                            >
                              {region.label}
                            </DropdownMenuCheckboxItem>
                          })
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="sources"
                  render={({ field }) => {
                    return <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Sources', SOURCES)}
                          <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[200px]">
                        {
                          SOURCES.map((source) => {
                            return <DropdownMenuCheckboxItem
                              key={source.value}
                              checked={source.isDefault && field.value.length === 0 ? true : field.value?.includes(source.value)}
                              onCheckedChange={(checked) => {
                                if ((!checked && field.value.length === 1) || source.value === 'allSources') {
                                  return field.onChange(['allSources'])
                                } else if (checked && field.value.includes('allSources') && source.value !== 'allSources') {
                                  return field.onChange([...field.value?.filter((value: string) => value != 'allSources'), source.value])
                                }
                                return checked ? field.onChange([...field.value, source.value]) : field.onChange(field.value?.filter((value: string) => value != source.value))
                              }}
                            >
                              {source.label}
                            </DropdownMenuCheckboxItem>
                          })
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }}
                />
              </div>

              <div className="text-md font-medium">
                <FormField
                  control={form.control}
                  name="statuses"
                  render={({ field }) => {
                    return <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <Button variant="google" className="flex flex-row gap-2">{formatData(field.value, 'Statuses', STATUSES)}
                          <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[160px]">
                        {
                          STATUSES.map((status) => {
                            return <DropdownMenuCheckboxItem
                              key={status.value}
                              checked={status.isDefault && field.value.length === 0 ? true : field.value?.includes(status.value)}
                              onCheckedChange={(checked) => {
                                if ((!checked && field.value.length === 1) || status.value === 'allStatuses') {
                                  return field.onChange(['allStatuses'])
                                } else if (checked && field.value.includes('allStatuses') && status.value !== 'allStatuses') {
                                  return field.onChange([...field.value?.filter((value: string) => value != 'allStatuses'), status.value])
                                }
                                return checked ? field.onChange([...field.value, status.value]) : field.onChange(field.value?.filter((value: string) => value != status.value))
                              }}
                            >
                              <div className="">
                                <div className={`flex flex-row gap-2 items-center ${!status.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status.class}`}>
                                  {status.icon && <status.icon />}
                                  {status.label}
                                </div>
                              </div>
                            </DropdownMenuCheckboxItem>
                          })
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }}
                />

              </div>
              <div className='flex flex-col  '>
                {/* <FormField
                                    control={form.control}
                                    name="owners"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"google"} className="flex flex-row gap-2">
                                                            {
                                                                field.value ? owners.find((owner) => owner.value === field.value)?.label : "Select Owner"
                                                            }
                                                            <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search owner..." />
                                                        <CommandEmpty>No owners found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {owners.map((owner) => (
                                                                <CommandItem
                                                                    value={owner.label}
                                                                    key={owner.value}
                                                                    onSelect={() => {
                                                                        form.setValue("owners", owner.value)
                                                                    }}
                                                                >
                                                                    <div className="flex flex-row items-center justify-between w-full">
                                                                        {owner.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4 text-purple-600",
                                                                                owner.value === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                /> */}

                <FormField
                  control={form.control}
                  name="owners"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"google"} className="flex flex-row gap-2">
                              {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                              {isUserDataLoading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />  </> : userList && userList?.length > 0 && formatData(field.value, 'Owners', [{ value: "allOwners", label: "All Owners" }, ...userList])}
                              <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[230px] p-0">
                          <Command>
                            <CommandInput placeholder="Search Owner" />
                            <CommandEmpty>No Owner found.</CommandEmpty>
                            <CommandGroup>
                              <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                {userList && userList?.length > 0 && [{ value: "allOwners", label: "All Owners" }, ...userList].map((owner) => (
                                  <CommandItem
                                    value={owner.value}
                                    key={owner.value}
                                    onSelect={() => {
                                      if (field.value.length > 0 && field.value.includes("allOwners") && owner.value !== 'allOwners') {
                                        form.setValue("owners", [...field.value.filter((value: string) => value !== 'allOwners'), owner.value])
                                      }
                                      else if ((field.value?.length === 1 && field.value?.includes(owner.value) || owner.value == 'allOwners')) {
                                        form.setValue("owners", ["allOwners"])

                                      }
                                      else if (field.value?.includes(owner.value)) {
                                        form.setValue("owners", field.value?.filter((val: string) => val !== owner.value))
                                      } else {
                                        form.setValue("owners", [...field.value, owner.value])
                                      }
                                    }}
                                  >
                                    <div className="flex flex-row items-center justify-between w-full">
                                      {owner.label}
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 text-purple-600",
                                          field.value?.includes(owner.value)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </div>
                                  </CommandItem>
                                ))}
                              </div>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

              </div>


              <div className='flex flex-col  '>
                <FormField
                  control={form.control}
                  name="creators"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"google"} className="flex flex-row gap-2">
                              {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                              {isUserDataLoading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />  </> : userList && userList?.length > 0 && formatData(field.value, 'Creators', [{ value: "allCreators", label: "All Creators" }, ...userList])}
                              <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[230px] p-0">
                          <Command>
                            <CommandInput placeholder="Search Creator" />
                            <CommandEmpty>No Creator found.</CommandEmpty>
                            <CommandGroup>
                              <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                {userList && userList?.length > 0 && [{ value: "allCreators", label: "All Creators" }, ...userList].map((creator) => (
                                  <CommandItem
                                    value={creator.value}
                                    key={creator.value}
                                    onSelect={() => {
                                      if (field.value.length > 0 && field.value.includes("allCreators") && creator.value !== 'allCreators') {
                                        form.setValue("creators", [...field.value.filter((value: string) => value !== 'allCreators'), creator.value])
                                      }
                                      else if ((field.value?.length === 1 && field.value?.includes(creator.value) || creator.value == 'allCreators')) {
                                        form.setValue("creators", ["allCreators"])

                                      }
                                      else if (field.value?.includes(creator.value)) {
                                        form.setValue("creators", field.value?.filter((val: string) => val !== creator.value))
                                      } else {
                                        form.setValue("creators", [...field.value, creator.value])
                                      }
                                    }}
                                  >
                                    <div className="flex flex-row items-center justify-between w-full">
                                      {creator.label}
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 text-purple-600",
                                          field.value?.includes(creator.value)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </div>
                                  </CommandItem>
                                ))}
                              </div>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

              </div>

              <div className='flex flex-col  '>


              </div>
            </div>
          </div>

        </form>
      </Form>
      <DataTable columns={columns()} data={data} filterObj={form.getValues()} setTableLeadRow={setTableLeadRow} setChildDataHandler={setChildDataHandler} setIsMultiSelectOn={setIsMultiSelectOn} page={"leads"} hidden={{threeDots:true}}/>
    </div>
  )
}

export default filteredData