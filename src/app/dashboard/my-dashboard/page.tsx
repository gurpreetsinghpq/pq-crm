"use client"
import { activeTabSideSheetClasses, commonFontClasses, commonTabListClasses, commonTabTriggerClasses } from '@/app/constants/classes';
import { LEAD_PROSPECT_STATUS } from '@/app/constants/constants';
import { DashboardLeads, DashboardProspect, DashboardSidebarLead, DashboardSidebarProspect, IValueLabel } from '@/app/interfaces/interface';
import { calculatePercentageChange, replaceHyphenWithEmDash, timeSince } from '@/components/custom/commonFunctions';
import MainSidebar from '@/components/custom/main-sidebar'
import { IconCalendar, IconHourGlass, IconLeads, IconPercent2, IconProspects, IconStopWatch } from '@/components/icons/svgIcons';
import { getDateDetails } from '@/components/ui/date-range-picker';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectIcon } from '@radix-ui/react-select';
import { getCookie } from 'cookies-next';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Tooltip as TooltipRe, Cell } from 'recharts';
import { z } from 'zod';

const TABS = {
  LEADS: "Leads",
  PROSPECTS: "Prospects"
}

function getClassOfStatus(statusName: string) {
  const status = LEAD_PROSPECT_STATUS.find((status) => status.label === statusName)
  const render = <div className={`flex flex-row gap-2 items-center w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status?.class} pl-[8px] pr-[10px] py-[1px]`}>
    {status?.icon && <status.icon />}
    {status?.label}
  </div>
  return render
}

const tabs: IValueLabel[] = [
  { value: "Leads", label: TABS.LEADS },
  { value: "Prospects", label: TABS.PROSPECTS },
];


function aggregateStatusData(status: string, data: any): number[] {
  const result: any[] = data.map((item: any) => ({ [status]: item[status] }));
  console.log("result", result)
  return result;
}


const DateRange: IValueLabel[] = [
  {
    value: "weekly",
    label: `This Week: ${getDateDetails("thisWeek")} `,
    acronym: "from last week"
  },
  {
    value: "monthly",
    label: `This Month: ${getDateDetails("thisMonth")} `,
    acronym: "from last month"
  },
  {
    value: "quarterly",
    label: `This Quarter: ${getDateDetails("thisQuarter")} `,
    acronym: "from last quarter"
  },
  {
    value: "yearly",
    label: `This Year: ${getDateDetails("thisFiscalYear")} `,
    acronym: "from last year"
  }
]

const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, payload, value } = props;

  return <>
    <svg x={cx - 4} y={cy - 4} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
      <rect x="0.75" y="0.75" width="6" height="6" rx="5" fill="white" />
      <rect x="0.75" y="0.75" width="6" height="6" rx="5" stroke="#475467" stroke-width="1.5" />
    </svg>
  </>
};

const ChartCard = ({ title, numberOfEntity, percentage, data, fromCompare }: { title: string, numberOfEntity: number, percentage: string, data: any[], fromCompare: string }) => {
  const dataForChart = data.slice(1).map((val) => ({ [title]: val })).reverse()
  console.log(title, dataForChart)
  const compare = DateRange.find((val) => val.value === fromCompare)?.acronym
  const isDataForChartEmpty = dataForChart.every((val) => val[title] === 0)
  return (
    <div className='w-[300px] xl:w-[330px] px-[24px] py-[20px] flex flex-col  gap-[8px] border-[1px] border-gray-300 rounded-[16px] min-h-[214px]'>
      <div className='text-sm text-gray-600 font-medium'>{title}</div>
      <div className='text-2xl text-black-100'>{numberOfEntity}</div>
      <div className='flex flex-row text-xs font-normal gap-[5px]'>
        <div className='text-black-100'>{percentage}</div>
        <div className='text-gray-500'>{compare}</div>
      </div>
      <ResponsiveContainer width="100%" height="100%" className={`py-[10px]`}>
        <LineChart width={300} height={100} data={dataForChart}>
          <Line type="monotone" dataKey={title} stroke="#475467" strokeWidth={2} strokeDasharray={isDataForChartEmpty ? "5 5" : "0"} dot={<CustomizedDot />} />
          {/* <TooltipRe /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const SideBarCard = ({ icon, title, value = "", subtitle }: { icon: any, title: string, value: string | undefined, subtitle?: string }) => {
  return <div className='py-[16px] px-[24px] border-[1px] border-gray-300 rounded-[16px]'>
    <div className='flex flex-row gap-[12px] '>
      <div className='flex flex-row justify-center items-center rounded-full bg-gray-200 p-[4px] w-[35px] h-[35px] shrink-0'>
        {icon}
      </div>
      <div className='flex flex-col'>
        <div className='text-sm font-medium'>
          {title}
        </div>
        <div className='flex flex-row items-baseline gap-[5px]'>
          <div className='text-[24px] text-black-100 font-semibold'>
            {value === "-" ? "—" : value}
          </div>
          {subtitle && <div className='text-gray-500 text-xs font-normal'>
            {subtitle === "-" ? "—" : subtitle}
          </div>}
        </div>
      </div>
    </div>
  </div>
}

const renderColorfulLegendText = (value: string, entry: any) => {
  return (
    <span style={{ padding: "6px", }} className='text-sm font-normal text-black-100'>
      <span className='w-[80px] xl:w-[100px] inline-block'>
        {value}
      </span>
      <span className='ml-auto'>
        {`${(parseFloat(`${entry.payload.percent * 100}`)).toFixed(1)}%`}
      </span>
    </span>
  );
};




const FormSchema = z.object({
  dateRange: z.string()
})

type PieChartCustom = {
  name: string,
  value: number,
  fill: any
}


function doesPiechartContainsDataToViz(pieChartData: PieChartCustom[]) {
  pieChartData.some((val) => { val.value !== 0 })
  return pieChartData.some((val) => val.value != 0)
}

function page() {

  const [currentTab, setCurrentTab] = useState<string>(TABS.LEADS)

  const [sidebarLeads, setSidebarLeads] = useState<DashboardSidebarLead>()
  const [sidebarProspects, setSidebarProspects] = useState<DashboardSidebarProspect>()
  const [dashboardLeads, setDashboardLeads] = useState<DashboardLeads>()
  const [dashboardProspects, setDashboardProspect] = useState<DashboardProspect>()
  const [piechartLead, setPieChartLead] = useState<PieChartCustom[]>()
  const [piechartProspect, setPieChartProspect] = useState<PieChartCustom[]>()
  const [leadLoading, setLeadLoading] = useState<boolean>(false)
  const [prospectLoading, setProspectLoading] = useState<boolean>(false)
  const [sidebarLeadLoading, setSidebarLeadLoading] = useState<boolean>(false)
  const [sidebarProspectLoading, setSidebarProspectLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateRange: DateRange[0].value
    }
  })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token_superuser = getCookie("token")

  const watch = form.watch()


  useEffect(() => {
    fetchDashboardLeads(watch.dateRange)
    fetchDashboardProspects(watch.dateRange)
  }, [watch.dateRange])

  const unverifiedColor = { start: "#FF7A00", end: "#FFD439" }
  const verifiedColor = { start: "#F49062", end: "#FD371F" }
  const junkColor = { start: "#4B73FF", end: "#7CF7FF" }
  const deferredColor = { start: "#6A11CB", end: "#2575FC" }
  const lostColor = { start: "#C7EAFD", end: "#E8198B" }

  const COLORS = {
    Unverified: unverifiedColor,
    Disqualified: unverifiedColor,
    Verified: verifiedColor,
    Qualified: verifiedColor,
    Junk: junkColor,
    Deferred: deferredColor,
    Lost: lostColor,
  }



  // old fill colors for piechart
  // function getFillColor(status: string) {
  //   switch (status) {
  //     case "Verified":
  //     case "Qualified":
  //       return "#BAEDBD"

  //       break;
  //     case "Unverified":
  //     case "Disqualified":
  //       return "#95A4FC"
  //       break;
  //     case "Junk":
  //       return "#B1E3FF"
  //       break;
  //     case "Lost":
  //       return "#FF999B"
  //       break;
  //     case "Deferred":
  //       return "#A8C5DA"
  //       break;
  //     default:
  //       return ""
  //   }

  // }
  function getFillColor(status: string) {
    switch (status) {
      case "Verified":
      case "Qualified":
        return "#079455"

        break;
      case "Unverified":
      case "Disqualified":
        return "#475467"
        break;
      case "Junk":
        return "#7F56D9"
        break;
      case "Lost":
        return "#D92D20"
        break;
      case "Deferred":
        return "#DC6803"
        break;
      default:
        return ""
    }
  }

  async function fetchDashboardLeads(dateRange: string) {
    setLeadLoading(true)
    try {
      const dataResp = await fetch(`${baseUrl}/v1/api/dashboard/lead/mydashboard_lead/?date_filter=${dateRange}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()
      let data: DashboardLeads = structuredClone(result.data)
      setDashboardLeads(data)
      setLeadLoading(false)
      const pieChartData: PieChartCustom[] = Object.keys(data.status[0]).map((k) => {
        const d = data.status[0]
        const fillColor = getFillColor(k)
        // const fillColor = COLORS[k as keyof typeof COLORS]
        const dx = {
          name: k,
          value: Number(d[k as keyof typeof data.status[0]]),
          fill: fillColor
        }
        return dx
      })
      setPieChartLead(pieChartData)
      console.log("pieChartData lead", pieChartData)
      console.log("dashboard leads", data)
    }
    catch (err) {
      setLeadLoading(false)
      console.log("error", err)
      return err
    }
  }
  async function fetchDashboardProspects(dateRange: string) {
    setProspectLoading(true)
    try {
      const dataResp = await fetch(`${baseUrl}/v1/api/dashboard/prospect/mydashboard_prospect/?date_filter=${dateRange}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()
      let data: DashboardProspect = structuredClone(result.data)
      setDashboardProspect(data)
      setProspectLoading(false)
      const pieChartData: PieChartCustom[] = Object.keys(data.status[0]).map((k) => {
        const d = data.status[0]
        const fillColor = COLORS[k as keyof typeof COLORS]
        const dx = {
          name: k,
          value: Number(d[k as keyof typeof data.status[0]]),
          fill: fillColor
        }
        return dx
      })
      setPieChartProspect(pieChartData)
      console.log("pieChartData PROSPECTS", pieChartData)
      console.log("dashboard prospects", data)
    }
    catch (err) {
      setProspectLoading(false)
      console.log("error", err)
      return err
    }
  }

  async function fetchDashboardSidebarLeads() {
    setSidebarLeadLoading(true)
    try {
      const dataResp = await fetch(`${baseUrl}/v1/api/dashboard/lead/summary_with_recent_leads/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()
      let data: DashboardSidebarLead = structuredClone(result.data)
      setSidebarLeads(data)
      setSidebarLeadLoading(false)
    }
    catch (err) {
      console.log("error", err)
      setSidebarLeadLoading(false)
      return err
    }
  }


  async function fetchDashboardSidebarProspects() {
    setSidebarProspectLoading(true)
    try {
      const dataResp = await fetch(`${baseUrl}/v1/api/dashboard/prospect/summary_with_recent_prospects/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()
      let data: DashboardSidebarProspect = structuredClone(result.data)
      setSidebarProspects(data)
      setSidebarProspectLoading(false)
    }
    catch (err) {
      console.log("error", err)
      setSidebarProspectLoading(false)
      return err
    }
  }


  async function getSidebarData() {
    fetchDashboardSidebarLeads()
    fetchDashboardSidebarProspects()
  }

  useEffect(() => {
    getSidebarData()
  }, [])

  // + {{number}} , - {{number}} when showing comparision
  // daterange picker
  // roundoff to to one decimal point


  useEffect(() => {
    console.log("currentTab", currentTab)
  }, [currentTab])
  return (
    <>
      <div className='flex flex-row w-full flex-1 min-h-[100vh] '>
        <div className='flex flex-col left flex-1 p-[24px] mb-[40px] overflow-auto '>
          <Tabs onValueChange={(val) => setCurrentTab(val)} defaultValue={TABS.LEADS} className="flex flex-col w-fit  ">
            <TabsList className={`${commonTabListClasses} overflow-hidden w-fit`}>
              {tabs.map((tab) => {
                return <TabsTrigger className={commonTabTriggerClasses} key={tab.value} value={tab.value} ><div >{tab.label}</div></TabsTrigger>
              })}
            </TabsList>
            <Form {...form}>
              <form className='flex flex-col gap-[16px] mt-[20px]'>
                <div className='px-[8px] text-black-100 font-semibold text-sm'>Overview</div>
                <div className='flex flex-col'>
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem className='w-fit min-w-[200px]'>
                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                          <FormControl>
                            <SelectTrigger className={`${commonFontClasses} `}>
                              <SelectValue placeholder={"Date Range"} />

                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {
                              DateRange?.map((dateRange, index) => {
                                return <SelectItem key={index} value={dateRange.value}>
                                  {dateRange.label}
                                </SelectItem>
                              })
                            }
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                </div>
              </form>
            </Form>
            <TabsContent value={TABS.LEADS} className="flex flex-col w-full py-[20px] gap-[20px]">
              <div className='flex flex-row flex-1 gap-[24px]'>
                {dashboardLeads?.created && <ChartCard title='Leads Created' numberOfEntity={dashboardLeads?.created[0]} percentage={calculatePercentageChange(dashboardLeads?.created)} data={dashboardLeads.created} fromCompare={watch.dateRange} />}
                {dashboardLeads?.owned && <ChartCard title='Leads Owned' numberOfEntity={dashboardLeads?.owned[0]} percentage={calculatePercentageChange(dashboardLeads?.owned)} data={dashboardLeads.owned} fromCompare={watch.dateRange} />}
              </div>
              <div className='flex flex-row flex-1 gap-[24px]'>
                <div className='w-[330px] xl:w-[360px] px-[24px] py-[20px] shrink-0 flex flex-col gap-[8px] border-[1px] border-gray-300 rounded-[16px] '>
                  <div className='text-black-100 font-semibold'>Leads State Breakdown</div>
                  <div className='flex flex-col gap-[24px] py-[10px]'>
                    {
                      dashboardLeads?.status && Object.keys(dashboardLeads.status[0]).map((key: any) => {
                        const data = dashboardLeads.status[0]
                        const dataForChart = aggregateStatusData(key, dashboardLeads.status.slice(1).reverse())
                        const isDataForChartEmpty = dataForChart.every((val: any) => val[key] === 0)
                        return <>
                          <div className='flex flex-row justify-between items-center'>
                            <div>
                              {getClassOfStatus(key)}
                            </div>
                            <div className='flex flex-row gap-[20px]'>
                              <div className='text-[24px] font-medium'>
                                {data[key as keyof typeof data]}
                              </div>
                              <div className='min-w-[100px]'>
                                <ResponsiveContainer width="100%" height="100%" >
                                  <LineChart width={300} height={100} data={dataForChart}>
                                    <Line type="monotone" dataKey={key} stroke="#475467" strokeWidth={2} strokeDasharray={isDataForChartEmpty ? "5 5" : "0"} dot={<CustomizedDot />} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        </>
                      })
                    }
                  </div>
                </div>
                <div className='min-w-[420px] xl:min-w-[448px] px-[24px] py-[20px] flex flex-col flex-1 gap-[8px] border-[1px] border-gray-300 rounded-[16px] flex-1'>
                  <div className='text-black-100 font-semibold'>Leads State Distribution</div>
                  <div className='w-full h-full'>
                    {(piechartLead && doesPiechartContainsDataToViz(piechartLead)) ? <div className='w-full h-full'>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart >
                          {/* gradient color start */}
                          {/* <defs>
                            {piechartLead.map((entry, index) => (
                              <linearGradient id={`myGradient${index}`}>
                                <stop
                                  offset="0%"
                                  stopColor={entry.fill.start}
                                />
                                <stop
                                  offset="100%"
                                  stopColor={entry.fill.end}
                                />
                              </linearGradient>
                            ))}
                          </defs> */}
                          {/* <Pie data={piechartLead} dataKey="value">
                            {piechartLead.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`url(#myGradient${index})`} />
                              ))}
                            </Pie> */}
                          {/* gradient color end */}
                          <Pie
                            dataKey="value"
                            data={piechartLead}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                          />
                          <Legend
                            iconType="circle"
                            layout="vertical"
                            verticalAlign='middle'
                            align='right'
                            iconSize={6}
                            formatter={renderColorfulLegendText}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div> : <div className='text-gray-900 text-md font-semibold h-full w-full flex flex-col justify-center items-center'>No Data to Viz.</div>}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value={TABS.PROSPECTS} className="flex flex-col flex-1 py-[20px] gap-[20px]">
              <div className='flex flex-row flex-1 gap-[24px]'>
                {dashboardProspects?.created && <ChartCard title='Prospects Created' numberOfEntity={dashboardProspects?.created[0]} percentage={calculatePercentageChange(dashboardProspects?.created)} data={dashboardProspects.created} fromCompare={watch.dateRange} />}
                {dashboardProspects?.owned && <ChartCard title='Prospects Owned' numberOfEntity={dashboardProspects?.owned[0]} percentage={calculatePercentageChange(dashboardProspects?.owned)} data={dashboardProspects.owned} fromCompare={watch.dateRange} />}
              </div>
              <div className='flex flex-row flex-1 gap-[24px]'>
                <div className='w-[330px] xl:w-[360px] px-[24px] py-[20px] shrink-0 flex flex-col gap-[8px] border-[1px] border-gray-300 rounded-[16px] '>
                  <div className='text-black-100 font-semibold'>Prospects State Breakdown</div>
                  <div className='flex flex-col gap-[24px] py-[10px]'>
                    {
                      dashboardProspects?.status && Object.keys(dashboardProspects.status[0]).map((key: any) => {
                        const data = dashboardProspects.status[0]
                        const dataForChart = aggregateStatusData(key, dashboardProspects.status.slice(1).reverse())
                        const isDataForChartEmpty = dataForChart.every((val: any) => val[key] === 0)
                        return <>
                          <div className='flex flex-row justify-between items-center'>
                            <div>
                              {getClassOfStatus(key)}
                            </div>
                            <div className='flex flex-row gap-[20px]'>
                              <div className='text-[24px] font-medium'>
                                {data[key as keyof typeof data]}
                              </div>
                              <div className='min-w-[100px]'>
                                <ResponsiveContainer width="100%" height="100%" >
                                  <LineChart width={300} height={100} data={dataForChart}>
                                    <Line type="monotone" dataKey={key} stroke="#475467" strokeWidth={2} strokeDasharray={isDataForChartEmpty ? "5 5" : "0"} dot={<CustomizedDot />} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        </>
                      })
                    }
                  </div>
                </div>
                <div className='min-w-[420px] xl:min-w-[448px] px-[24px] py-[20px] flex flex-col flex-1 gap-[8px] border-[1px] border-gray-300 rounded-[16px] flex-1'>
                  <div className='text-black-100 font-semibold'>Prospects State Distribution</div>
                  {(piechartProspect && doesPiechartContainsDataToViz(piechartProspect)) ? <div className='w-full h-full'>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart >
                        {/* gradient color start */}
                        {/* <defs>
                          {piechartProspect.map((entry, index) => (
                            <linearGradient id={`myGradient${index}`}>
                              <stop
                                offset="0%"
                                stopColor={entry.fill.start}
                              />
                              <stop
                                offset="100%"
                                stopColor={entry.fill.end}
                              />
                            </linearGradient>
                          ))}
                        </defs> */}
                        {/* <Pie data={piechartProspect} dataKey="value">
                          {piechartProspect.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#myGradient${index})`} />
                          ))}
                        </Pie> */}
                        {/* gradient color end */}
                        <Pie
                          dataKey="value"
                          data={piechartLead}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                        />
                        <Legend
                          iconType="circle"
                          layout="vertical"
                          verticalAlign='middle'
                          align='right'
                          iconSize={6}
                          formatter={renderColorfulLegendText}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div> : <div className='text-gray-900 text-md font-semibold h-full w-full flex flex-col justify-center items-center'>No Data to Viz.</div>}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className='w-[1px] h-full bg-gray-200'>

        </div>
        <div className='flex flex-col right xl:w-[330px] 2xl:w-[400px] p-[24px] mb-[60px] overflow-y-auto'>
          {currentTab === TABS.LEADS && <>
            <div className='flex flex-col gap-[16px]'>
              {
                <>
                  <SideBarCard icon={<IconStopWatch />} title='Avg. Lead Verification Time' value={sidebarLeads?.avt} subtitle='Days/Lead' />
                  <SideBarCard icon={<IconHourGlass />} title='Avg. Lead Closure Time' value={sidebarLeads?.act} subtitle='Days/Lead' />
                  <SideBarCard icon={<IconPercent2 size="16" color="#667085" />} title='Prospect Conversion Rate' value={`${replaceHyphenWithEmDash(sidebarLeads?.lpcr, true)}`} />
                </>
              }
            </div>
            <div className='mt-[24px] flex flex-col gap-[16px]'>
              <div className='text-sm font-semibold'>
                Recent Leads
              </div>
              <div className='px-[16px] py-[24px] border-[1px] border-gray-300 rounded-[16px] flex flex-col gap-[20px] '>
                {(sidebarLeads?.recent_leads && sidebarLeads?.recent_leads.length > 0) ? sidebarLeads?.recent_leads.map((recentLead) => {
                  return <div className='flex flex-row justify-between text-xs text-black-100 font-medium'>
                    <div className='flex flex-col gap-[6px]'>
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className='w-[140px] 2xl:w-[180px] truncate text-ellipsis overflow-hidden'>
                                {recentLead.title}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {recentLead.title}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div>
                        {getClassOfStatus(recentLead.status)}
                      </div>
                    </div>
                    <div>
                      {timeSince(recentLead.created_at)}
                    </div>
                  </div>
                }) : <div className='flex flex-col justify-center items-center gap-[10px] text-gray-900 text-md font-semibold'>
                  <div className="h-12 w-12 mt-4 p-3  text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                    <IconLeads size="20" />
                  </div>
                  No Leads
                </div>}
              </div>
            </div>
          </>}
          {currentTab === TABS.PROSPECTS && <>
            <div className='flex flex-col gap-[16px]'>
              {
                <>
                  <SideBarCard icon={<IconHourGlass />} title='Avg. Prospect Closure Time' value={sidebarProspects?.act} subtitle='Days/Prospect' />
                  <SideBarCard icon={<IconPercent2 size="16" color="#667085" />} title='Deal Conversion Rate' value={`${replaceHyphenWithEmDash(sidebarProspects?.pdcr, true)}`} />
                </>
              }
            </div>
            <div className='mt-[24px] flex flex-col gap-[16px]'>
              <div className='text-sm font-semibold'>
                Recent Prospects
              </div>
              <div className='px-[16px] py-[24px] border-[1px] border-gray-300 rounded-[16px] flex flex-col gap-[20px]'>
                {(sidebarProspects?.recent_prospects && sidebarProspects?.recent_prospects.length > 0) ? sidebarProspects.recent_prospects.map((recentProspect) => {
                  return <div className='flex flex-row justify-between text-xs text-black-100 font-medium'>
                    <div className='flex flex-col gap-[6px]'>
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className='w-[180px] truncate text-ellipsis overflow-hidden'>
                                {recentProspect.title}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {recentProspect.title}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className='text-xs font-medium text-black-100'>
                        <div>
                          {getClassOfStatus(recentProspect.status)}
                        </div>
                      </div>
                    </div>
                    <div>
                      {timeSince(recentProspect.created_at)}
                    </div>
                  </div>
                }) : <div className='flex flex-col justify-center items-center gap-[10px] text-gray-900 text-md font-semibold'>
                  <div className="h-12 w-12 mt-4 p-3  text-gray-700 border-[1px] rounded-[10px] border-gray-200 flex flex-row justify-center">
                    <IconProspects size="20" />
                  </div>
                  No Prospects
                </div>}
              </div>
            </div>
          </>}
        </div>
      </div>
      {(leadLoading || prospectLoading || sidebarLeadLoading || sidebarProspectLoading) && <div className='absolute top-0 left-0 w-full h-full flex flex-row justify-center items-center'>
        <Loader2 className="mr-2 h-20 w-20 animate-spin" color='#7F56D9' />
      </div>}
    </>
  )
}

export default page
