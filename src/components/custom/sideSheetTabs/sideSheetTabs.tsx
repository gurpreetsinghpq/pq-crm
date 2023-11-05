import { ActivityHistory, HistoryAllMode, HistoryDataGetResponse, IValueLabel, NotesHistory, Permission } from '@/app/interfaces/interface';
import React, { useEffect, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { SIDE_SHEET_TABS } from '@/app/constants/constants';
import { commonTabListClasses, commonTabTriggerClasses } from '@/app/constants/classes';
import Notes from './deal-activity/notes';
import Activity from './deal-activity/activity';
import Todo from './deal-activity/todo';
import { ArrowLeft, ArrowLeftCircle, ArrowRight, ArrowRightCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Proposal from './deal-flow/proposal';
import HistoryNotes from './history/history-notes';
import HistoryActivity from './history/history-activity';
import { getToken } from '../commonFunctions';
import HistoryAll from './history/history-all';
import HistoryChangelog from './history/history-changelog';
import RequirementDeck from './deal-flow/requirementDeck';

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
  NOTES: "Notes",
  ACTIVITY: "Activities",
  CHANGE_LOG: "Changelog"
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

interface DisabledProps{
  proposal?:boolean
  requirementDeck?:boolean
}

function SideSheetTabs({ currentParentTab, contactFromParents, entityId, permissions, disable = {proposal:false, requirementDeck:false}, dealId }: { currentParentTab: string, contactFromParents: any, entityId: number, permissions: Permission, disable?: DisabledProps, dealId?:number}) {
  const [parentTab, setCurrentParentTab] = useState("")
  const [currentActiveTab, setCurrentActiveTab] = useState("")
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [historyList, setHistoryList] = useState<HistoryDataGetResponse>()
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
        fetchHistoryList()
        return HISTORY_TABS.ALL;
      } else {
        return "";
      }
    }

    // tabref.current = 

  }, [currentParentTab])
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const token_superuser = getToken()

  async function fetchHistoryList() {
    setIsLoading(true)
    try {
      const dataResp = await fetch(`${baseUrl}/v1/api/history/activity/?lead=${entityId}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
      const result = await dataResp.json()

      let data: HistoryDataGetResponse = structuredClone(result.data)
      let notesData = data.notes.map((val) => {
        val.typeOfEntity = "notes"
        return val
      })
      let activityData = data.activity.map((val) => {
        val.typeOfEntity = "activity"
        return val
      })
      let changeLogData = data.changelog.map((val) => {
        val.typeOfEntity = "changelog"
        return val
      }) 

      const flattenedData: HistoryAllMode  = [
        ...data.notes,
        ...data.activity,
        ...data.changelog
      ]
      flattenedData.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

      const dataToSet: HistoryDataGetResponse = {
        ...data,
        notes: notesData,
        activity: activityData,
        changelog: changeLogData,
        all: flattenedData
      }

      setHistoryList(dataToSet)
      setIsLoading(false)

    }
    catch (err) {
      setIsLoading(false)
      console.log("error", err)
    }
  }
  const containerRef = useRef<HTMLDivElement | null>(null);
console.log("isloading", isLoading)


  const scrollLeft = () => {
    if (containerRef.current) {
      smoothScroll(containerRef.current.scrollLeft - 100, 300);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      smoothScroll(containerRef.current.scrollLeft + 100, 300);
    }
  };

  const checkScrollPosition = () => {
    if (containerRef.current) {
      setIsLeftVisible(containerRef.current.scrollLeft + containerRef.current.clientWidth <
        containerRef.current.scrollWidth);
      setIsRightVisible(
        containerRef.current.scrollLeft + containerRef.current.clientWidth <
        containerRef.current.scrollWidth
      );
    }
  };

  useEffect(() => {
    // Initial check
    checkScrollPosition();

    // Add a window resize event listener to update arrow visibility
    window.addEventListener('resize', checkScrollPosition);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  useEffect(() => {
    // Call checkScrollPosition again after the component mounts
    checkScrollPosition();
  }, []); // Empty dependency array ensures it only runs once on mount



  const smoothScroll = (targetX: number, duration: number) => {
    const element = containerRef.current;
    if (!element) return;

    const start = element.scrollLeft;
    const distance = targetX - start;
    const startTime = performance.now();

    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        element.scrollLeft = start + distance * easeInOutQuad(elapsedTime / duration);
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollLeft = targetX;
      }
    };

    requestAnimationFrame(animateScroll);
  };
  function getFormattedLabel(text:string){
    const activityLength = historyList?.activity.length 
    const notesLength = historyList?.notes.length 
    const changelogLength = historyList?.changelog.length 
    const allLength = Number(activityLength || 0) + Number(notesLength || 0) + Number(changelogLength || 0)
    if(text==="Activities"){
      return `${text} (${activityLength})`
    }
    else if(text==="Changelog"){
      return `${text} (${changelogLength})`
    }
    else if(text==="Notes"){
      return `${text} (${notesLength})`
    }else if(text==="All"){
      return `${text} (${allLength})`
    }
    // else if(text==="Change log"){
    //   return `${text} (${historyList?.notes.length})`
    // }
    else{
      return text
    }
  }
  return (
    <div className='w-full'>
      {parentTab === SIDE_SHEET_TABS.DEAL_FLOW && <Tabs defaultValue={DEAL_FLOW_TABS.PROPOSAL} className="flex flex-col flex-1 h-full">
        <div className="flex flex-row  py-[24px] border-gray-100">
          <div className='flex flex-row items-center w-full gap-[8px]'>
            {isLeftVisible && <div><ChevronLeft className='cursor-pointer' onClick={scrollLeft} /></div>}
            <TabsList className={`${commonTabListClasses} overflow-hidden `} ref={containerRef}>
              {dealFlowTab.map((tab) => {
                return <TabsTrigger className={commonTabTriggerClasses} disabled={tab.value !== "Proposal" && (tab.value==="Requirement Deck" ? disable.requirementDeck : true)} key={tab.value} value={tab.value} ><div >{tab.label}</div></TabsTrigger>
              })}
            </TabsList>
            {isRightVisible && <div><ChevronRight className='cursor-pointer' onClick={scrollRight} /></div>}
          </div>
        </div>
        <div className="bottom flex-1 flex flex-col  ">
          <TabsContent value={DEAL_FLOW_TABS.PROPOSAL} className="flex flex-col flex-1">
            <Proposal isDisabled={disable.proposal} entityId={entityId}/>
          </TabsContent>
          <TabsContent value={DEAL_FLOW_TABS.REQUIREMENT_DECK} className="flex flex-col flex-1">
            {dealId && <RequirementDeck entityId={dealId}/>}
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
            <Notes contactFromParents={contactFromParents} entityId={entityId} />
          </TabsContent>
          <TabsContent value={DEAL_ACTIVITY_TABS.ACTIVITY} className="flex flex-col flex-1">
            <Activity contactFromParents={contactFromParents} entityId={entityId} />
          </TabsContent>
          <TabsContent value={DEAL_ACTIVITY_TABS.TODO} className="flex flex-col flex-1">
            <Todo entityId={entityId} />
          </TabsContent>
        </div>
      </Tabs>}
      {parentTab === SIDE_SHEET_TABS.HISTORY && <Tabs defaultValue={HISTORY_TABS.ALL} className="flex flex-col flex-1">
        <div className="flex flex-row  py-[24px] border-gray-100">
          <TabsList className={commonTabListClasses}>
            {historyTab.map((tab) => {
              return <TabsTrigger className={commonTabTriggerClasses} key={tab.value} value={tab.value} ><div >{getFormattedLabel(tab.label)}</div></TabsTrigger>
            })}
          </TabsList>
        </div>
        <div className="bottom flex-1 flex flex-col  ">
          <TabsContent value={HISTORY_TABS.NOTES} className="flex flex-col flex-1">
            {!isLoading ? <HistoryNotes data={historyList?.notes} entityId={entityId} /> : <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </TabsContent>
          <TabsContent value={HISTORY_TABS.ACTIVITY} className="flex flex-col flex-1">
            <HistoryActivity data={historyList?.activity} entityId={entityId} />
          </TabsContent>
          <TabsContent value={HISTORY_TABS.CHANGE_LOG} className="flex flex-col flex-1">
            {!isLoading ? <HistoryChangelog data={historyList?.changelog} entityId={entityId} /> :<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </TabsContent>
          <TabsContent value={HISTORY_TABS.ALL} className="flex flex-col flex-1">
            {!isLoading ? <HistoryAll data={historyList?.all} entityId={entityId} /> : <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </TabsContent>
        </div>
      </Tabs>}
    </div>
  )
}

export default SideSheetTabs