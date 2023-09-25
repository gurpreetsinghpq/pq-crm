import { IValueLabel } from '@/app/interfaces/interface';
import React, { useEffect, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { SIDE_SHEET_TABS } from '@/app/constants/constants';
import { commonTabListClasses, commonTabTriggerClasses } from '@/app/constants/classes';
import Notes from './deal-activity/notes';
import Activity from './deal-activity/activity';
import Todo from './deal-activity/todo';

const DEAL_ACTIVITY_TABS: {
  [key: string]: string
} = {
  TODO: "To-Do",
  ACTIVITY: "Activity",
  NOTES: "Notes"
}

const HISTORY_TABS: {
  [key: string]: string
} = {
  ALL: "All",
  ACTIVITY: "Activity",
  NOTES: "Notes",
  CHANGE_LOG: "Change log"
}

const DEAL_FLOW_TABS: {
  [key: string]: string
} = {
  PROPOSAL: "Proposal",
  SERVICE_CONTRACT: "Service Contract",
  REQUIREMENT_DECK: "Requirement Deck",
  PROFILE_MAPPING: "Profile Mapping",
  INTERVIEWS: "Interviews",
  OFFER_ROLLOUT: "Offer Rollout",
  ONBOARDING: "Onboarding",
  REPLACEMENT: "Replacement"
};


const dealActivityTab: IValueLabel[] = Object.keys(DEAL_ACTIVITY_TABS).map((tab) => ({
  value: DEAL_ACTIVITY_TABS[tab] as string, // Specify the type as string
  label: DEAL_ACTIVITY_TABS[tab] as string,
  isDefault: DEAL_ACTIVITY_TABS[tab] === DEAL_ACTIVITY_TABS.TODO
}));

const historyTab: IValueLabel[] = Object.keys(HISTORY_TABS).map((tab) => ({
  value: HISTORY_TABS[tab] as string, // Specify the type as string
  label: HISTORY_TABS[tab] as string, // Specify the type as string,

}));

const dealFlowTab: IValueLabel[] = Object.keys(DEAL_FLOW_TABS).map((tab) => ({
  value: DEAL_FLOW_TABS[tab] as string, // Specify the type as string
  label: DEAL_FLOW_TABS[tab] as string, // Specify the type as string

}));


function SideSheetTabs({ currentParentTab, contactFromParents }: { currentParentTab: string, contactFromParents: any }) {
  const [parentTab, setCurrentParentTab] = useState("")
  const [currentActiveTab, setCurrentActiveTab] = useState("")
  useEffect(() => {
    let currentTab = getCurrentActiveTab()
    setCurrentActiveTab(currentTab)
    setCurrentParentTab(currentParentTab)
    // console.log("getCurrentActiveTab",currentActiveTab )
    function getCurrentActiveTab() {
      if (currentParentTab === SIDE_SHEET_TABS.DEAL_ACTIVITY) {
        return DEAL_ACTIVITY_TABS.TODO;
      } else if (currentParentTab === SIDE_SHEET_TABS.DEAL_FLOW) {
        return DEAL_FLOW_TABS.PROPOSAL;
      } else if (currentParentTab === SIDE_SHEET_TABS.HISTORY) {
        return HISTORY_TABS.ALL;
      } else {
        return "";
      }
    }
    // tabref.current = 

  }, [currentParentTab])
  console.log("currentActiveTab", currentActiveTab)
  return (
    <div className='w-full'>
      {parentTab === SIDE_SHEET_TABS.DEAL_FLOW && <Tabs defaultValue={DEAL_FLOW_TABS.PROPOSAL} className="flex flex-col flex-1">
        <div className="flex flex-row  py-[24px] border-gray-100">
          <TabsList className={commonTabListClasses}>
            {dealFlowTab.map((tab) => {
              return <TabsTrigger disabled={tab.value !== "Proposal"} key={tab.value} value={tab.value} ><div >{tab.label}</div></TabsTrigger>
            })}
          </TabsList>
        </div>
        <div className="bottom flex-1 flex flex-col  ">
          <TabsContent value={DEAL_ACTIVITY_TABS.USERS} className="flex flex-col flex-1">

          </TabsContent>
          <TabsContent value={DEAL_ACTIVITY_TABS.TEAMS} className="flex flex-col flex-1">

          </TabsContent>
          <TabsContent value={DEAL_ACTIVITY_TABS.PROFILES} className="flex flex-col flex-1">

          </TabsContent>
        </div>
      </Tabs>}
      {parentTab === SIDE_SHEET_TABS.DEAL_ACTIVITY && <Tabs defaultValue={DEAL_ACTIVITY_TABS.NOTES} className="flex flex-col flex-1  ">
        <div className="flex flex-row  py-[24px] border-gray-100">
          <TabsList className={commonTabListClasses} >
            {dealActivityTab.map((tab) => {
              return <TabsTrigger className={commonTabTriggerClasses} key={tab.value} value={tab.value} ><div >{tab.label}</div></TabsTrigger>
            })}
          </TabsList>
        </div>
        <div className="bottom flex-1 flex flex-col  ">
          <TabsContent value={DEAL_ACTIVITY_TABS.NOTES} className="flex flex-col flex-1">
            <Notes contactFromParents={contactFromParents} />
          </TabsContent>
          <TabsContent value={DEAL_ACTIVITY_TABS.ACTIVITY} className="flex flex-col flex-1">
            <Activity contactFromParents={contactFromParents} />
          </TabsContent>
          <TabsContent value={DEAL_ACTIVITY_TABS.TODO} className="flex flex-col flex-1">
            <Todo/>
          </TabsContent>
        </div>
      </Tabs>}
      {parentTab === SIDE_SHEET_TABS.HISTORY && <Tabs defaultValue={HISTORY_TABS.ALL} className="flex flex-col flex-1">
        <div className="flex flex-row  py-[24px] border-gray-100">
          <TabsList className={commonTabListClasses}>

            {historyTab.map((tab) => {
              return <TabsTrigger className={commonTabTriggerClasses} key={tab.value} value={tab.value} ><div >{tab.label}</div></TabsTrigger>
            })}
          </TabsList>
        </div>
        <div className="bottom flex-1 flex flex-col  ">
          <TabsContent value={DEAL_ACTIVITY_TABS.USERS} className="flex flex-col flex-1">

          </TabsContent>
          <TabsContent value={DEAL_ACTIVITY_TABS.TEAMS} className="flex flex-col flex-1">

          </TabsContent>
          <TabsContent value={DEAL_ACTIVITY_TABS.PROFILES} className="flex flex-col flex-1">

          </TabsContent>
        </div>
      </Tabs>}
    </div>
  )
}

export default SideSheetTabs