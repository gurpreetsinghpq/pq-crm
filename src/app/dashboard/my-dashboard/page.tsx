"use client"
import { activeTabSideSheetClasses, commonTabListClasses, commonTabTriggerClasses } from '@/app/constants/classes';
import { LEAD_PROSPECT_STATUS } from '@/app/constants/constants';
import { IValueLabel } from '@/app/interfaces/interface';
import { timeSince } from '@/components/custom/commonFunctions';
import MainSidebar from '@/components/custom/main-sidebar'
import { IconHourGlass, IconPercent2, IconStopWatch } from '@/components/icons/svgIcons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';

const TABS = {
  LEADS: "Leads",
  PROSPECTS: "Prospects"
}

function getClassOfStatus(statusName: string) {
  const status = LEAD_PROSPECT_STATUS.find((status) => status.label === statusName)
  const render = <div className={`flex flex-row gap-2 items-center  pl-2 pr-3 py-1 w-fit ${!status?.isDefault && 'border border-[1.5px] rounded-[16px]'} ${status?.class} `}>
    {status?.icon && <status.icon />}
    {status?.label}
  </div>
  return render
}

const tabs: IValueLabel[] = [
  { value: "Leads", label: TABS.LEADS },
  { value: "Prospects", label: TABS.PROSPECTS },
];

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
];

const pieChartData = [
  { name: 'Unverfied', value: 400, fill: "#95A4FC" },
  { name: 'Verified', value: 300, fill: "#BAEDBD" },
  { name: 'Junk', value: 300, fill: "#B1E3FF" },
  { name: 'Deferred', value: 200, fill: "#A8C5DA" },
  { name: 'Lost', value: 278, fill: "#FF999B" },
];


const ChartCard = ({ title, numberOfEntity, percentage, data }: { title: string, numberOfEntity: number, percentage: number, data: any }) => (
  <div className='w-[300px] xl:w-[330px] px-[24px] py-[20px] flex flex-col  gap-[8px] border-[1px] border-gray-300 rounded-[16px] min-h-[214px]'>
    <div className='text-sm text-gray-600 font-medium'>{title}</div>
    <div className='text-2xl text-black-100'>{numberOfEntity}</div>
    <div className='flex flex-row text-xs font-normal gap-[5px]'>
      <div className='text-black-100'>{`${percentage}%`}</div>
      <div className='text-gray-500'>from last week</div>
    </div>
    <ResponsiveContainer width="100%" height="100%" className={`py-[10px]`}>
      <LineChart width={300} height={100} data={data}>
        <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

const SideBarCard = ({ icon, title, value, subtitle }: { icon: any, title: string, value: string, subtitle?: string }) => {
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
            {value}
          </div>
          {subtitle && <div className='text-gray-500 text-xs font-normal'>
            {subtitle}
          </div>}
        </div>
      </div>
    </div>
  </div>
}

const LEAD_BREAKDOWN = [
  {
    "Unverified": {
      value: 10,
      data: data
    }
  },
  {
    "Verified": {
      value: 10,
      data: data
    }
  },
  {
    "Junk": {
      value: 10,
      data: data
    }
  },
  {
    "Deferred": {
      value: 10,
      data: data
    }
  },
  {
    "Lost": {
      value: 10,
      data: data
    }
  },
]

const renderColorfulLegendText = (value: string, entry: any) => {
  return (
    <span style={{ padding: "6px" }} className='text-sm font-normal text-black-100 w-[200px]'>
      <span>
        {value}
      </span>
      <span className='ml-auto'>
        {` - ${parseInt(`${entry.payload.percent * 100}`)}%`}
      </span>
    </span>
  );
};

function page() {

  const [currentTab, setCurrentTab] = useState<string>(TABS.LEADS)


  return (
    <div className='flex flex-row w-full flex-1 min-h-[100vh] '>
      <div className='flex flex-col left flex-1 p-[24px] mb-[40px] overflow-y-auto '>
        <Tabs defaultValue={TABS.LEADS} className="flex flex-col w-fit  ">
          <TabsList className={`${commonTabListClasses} overflow-hidden w-fit`}>
            {tabs.map((tab) => {
              return <TabsTrigger className={commonTabTriggerClasses} key={tab.value} value={tab.value} ><div >{tab.label}</div></TabsTrigger>
            })}
          </TabsList>
          <TabsContent value={TABS.LEADS} className="flex flex-col w-full py-[20px] gap-[20px]">
            <div className='flex flex-row flex-1 gap-[24px]'>
              <ChartCard title='Leads Created' numberOfEntity={10} percentage={20} data={data} />
              <ChartCard title='Leads Owned' numberOfEntity={10} percentage={20} data={data} />
            </div>
            <div className='flex flex-row flex-1 gap-[24px]'>
              <div className='w-[300px] xl:w-[330px] px-[24px] py-[20px] shrink-0 flex flex-col gap-[8px] border-[1px] border-gray-300 rounded-[16px] '>
                <div className='text-black-100 font-semibold'>Leads State Breakdown</div>
                <div className='flex flex-col gap-[16px] py-[10px]'>
                  {
                    LEAD_BREAKDOWN.map((data) => {
                      const key = Object.keys(data)[0] as keyof typeof LEAD_BREAKDOWN[number]
                      return <>
                        <div className='flex flex-row justify-between'>
                          <div>
                            {getClassOfStatus(key)}
                          </div>
                          <div className='flex flex-row gap-[10px]'>
                            <div className='text-[24px] font-medium'>
                              {data[key]?.value}
                            </div>
                            <div className='min-w-[100px]'>
                              <ResponsiveContainer width="100%" height="100%" >
                                <LineChart width={300} height={100} data={data[key]?.data}>
                                  <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
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
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart >
                      <Pie
                        dataKey="value"
                        data={pieChartData}
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
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value={TABS.PROSPECTS} className="flex flex-col flex-1 py-[20px]">

          </TabsContent>
        </Tabs>
      </div>
      <div className='w-[1px] h-full bg-gray-200'>

      </div>
      <div className='flex flex-col right w-[360px] xl:w-[400px] p-[24px] mb-[60px] overflow-y-auto'>
        <div className='flex flex-col gap-[16px]'>
          <SideBarCard icon={<IconStopWatch />} title='Avg. Lead Verification Time' value={'1'} subtitle='Days/Lead' />
          <SideBarCard icon={<IconHourGlass />} title='Avg. Lead Closure Time' value={'1'} subtitle='Days/Lead' />
          <SideBarCard icon={<IconPercent2 size="16" color="#667085" />} title='Prospect Conversion Rate' value={'23.5%'} />
        </div>
        <div className='mt-[24px] flex flex-col gap-[16px]'>
          <div className='text-sm font-semibold'>
            Recent Leads
          </div>
          <div className='px-[16px] py-[24px] border-[1px] border-gray-300 rounded-[16px] flex flex-col gap-[20px]'>
            <div className='flex flex-row justify-between text-xs text-black-100 font-medium'>
              <div className='flex flex-col gap-[6px]'>
                <div className='w-[180px] truncate text-ellipsis overflow-hidden'>
                  SkyScanner - MENA - CPTO - 1
                </div>
                <div>
                  {getClassOfStatus("Verified")}
                </div>
              </div>
              <div>
                {timeSince(new Date().toISOString())}
              </div>
            </div>
            <div className='flex flex-row justify-between text-xs text-black-100 font-medium'>
              <div className='flex flex-col gap-[6px]'>
                <div className='w-[180px] truncate text-ellipsis overflow-hidden'>
                  SkyScanner - MENA - CPTO - 1
                </div>
                <div>
                  {getClassOfStatus("Verified")}
                </div>
              </div>
              <div>
                {timeSince(new Date().toISOString())}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default page