"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { IconAccounts2, IconActivity, IconContacts, IconDashboard, IconDealsHome, IconLeads, IconLineChart, IconPq, IconProspects, IconSettings } from '../icons/svgIcons'
import { TITLES } from '../dashboard';
import { useCurrentTabStore, usePermissionStore, useSettingStore } from '@/store/store';
import { disabledSidebarItem } from '@/app/constants/classes';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useFormSchemaHook } from '@/hooks/useFormSchemaHook';
import Link from 'next/link';

function MainSidebar() {
    const { setTab } = useFormSchemaHook()
    const [showScrollButton, setShowScrollButton] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= 1560 : false
    )

    const { currentTab, setCurrentTab } = useCurrentTabStore()
    const { permissions, setPermissions } = usePermissionStore()
    const { isSettingsClicked, setSettingsClicked } = useSettingStore()
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 1280)
        }

        window.addEventListener('resize', handleResize)
        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const handleHover = (isHovering: boolean) => {
        if (sidebarRef.current) {
            //   Show/hide the scrollbars on hover/unhover
            sidebarRef.current.style.overflow = isHovering ? 'auto' : 'hidden';
        }
    };

    function scrollDown() {
        if (sidebarRef.current) {
            sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
            setShowScrollButton(false)
        };
    }
    function scrollUp() {
        if (sidebarRef.current) {
            sidebarRef.current.scrollTop = 0;
            setShowScrollButton(true)
        }
    }

    const handleScroll = () => {
        if (sidebarRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;

            // Show the "Scroll to Bottom" button when not at the bottom
            setShowScrollButton(scrollTop + clientHeight < scrollHeight - 20);
        }
    };



    useEffect(() => {
        if (sidebarRef.current) {
            sidebarRef.current.addEventListener('scroll', handleScroll);

            // Cleanup the event listener on unmount
            return () => {
                sidebarRef?.current?.removeEventListener('scroll', handleScroll);
            };
        }
    }, [sidebarRef.current]);


    return (
        <div className="sticky top-0 left-0 left z-[1] h-full flex flex-col px-1  xl:w-20 2xl:w-24  items-center py-6 border-r-2  border-gray-100 border-solid bg-purple-900">
            <div className="h-10 w-10  flex flex-row justify-center  xl:px-1 2xl:px-[0px]">
                <IconPq size={32} />
            </div>
            <div className="flex flex-col overflow-y-auto  pq-sidebar  items-center  xl:px-1 2xl:px-[0px]" ref={sidebarRef} onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={`h-12 w-12 hover:cursor-pointer mt-10 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${disabledSidebarItem}`}>
                                <IconLineChart size={24} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Insights
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={'/dashboard/my-dashboard'} onClick={() => setTab(TITLES.My_DASHBOARD)} className={`h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.My_DASHBOARD && 'bg-purple-600'} ${!(permissions["Dashboard"]?.access && permissions["Dashboard"]?.view) && disabledSidebarItem}`}>
                            {/* <Link href={'/dashboard/my-dashboard'} onClick={() => setTab(TITLES.My_DASHBOARD)} className={`h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.My_DASHBOARD && 'bg-purple-600'} `}> */}
                            {/* <div onClick={() => setTab(TITLES.My_DASHBOARD)} className={`h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${disabledSidebarItem}`}> */}
                                <IconDashboard size={24} />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Dashboard
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="h-1 w-2/3 my-[24px] border-t-2 border-purple-800"></div>

                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={'/dashboard/leads'} onClick={() =>
                                setTab(TITLES.LEADS)
                            } className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.LEADS && 'bg-purple-600'} ${!(permissions["Lead"]?.access && permissions["Lead"]?.view) && disabledSidebarItem}`}>
                                <IconLeads size={24} />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Leads
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}

                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={'/dashboard/prospects'} onClick={() =>
                                setTab(TITLES.PROSPECTS)
                            } className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.PROSPECTS && 'bg-purple-600'} ${!(permissions["Prospect"]?.access && permissions["Prospect"]?.view) && disabledSidebarItem}`}>
                                <IconProspects size={24} />
                            </Link>
                        </TooltipTrigger>
                        <div className="overflow-visible">
                            <TooltipContent side="right" sideOffset={5}>
                                <div >
                                    Prospects
                                </div>
                            </TooltipContent>
                        </div>
                    </Tooltip>
                </TooltipProvider>}
                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={'/dashboard/deals'}
                                onClick={() => setTab(TITLES.DEALS)}
                                className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.DEALS && 'bg-purple-600'} ${!(permissions["Deal"]?.access && permissions["Deal"]?.view) && disabledSidebarItem}`}>
                                <IconDealsHome size={24} />
                            </Link>
                        </TooltipTrigger>
                        <div className="overflow-visible">
                            <TooltipContent side="right" sideOffset={5}>
                                <div >
                                    Deal
                                </div>
                            </TooltipContent>
                        </div>
                    </Tooltip>
                </TooltipProvider>}
                <div className="h-1 w-2/3 my-[24px] border-t-2 border-purple-800"></div>
                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={'/dashboard/accounts'}
                                onClick={() => setTab(TITLES.ACCOUNTS)}
                                className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.ACCOUNTS && 'bg-purple-600'} ${!(permissions["Organisation"]?.access && permissions["Organisation"]?.view) && disabledSidebarItem}`}>
                                <IconAccounts2 size={24} />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Accounts
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={'/dashboard/contacts'}
                                onClick={() => setTab(TITLES.CONTACTS)}
                                className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.CONTACTS && 'bg-purple-600'} ${!(permissions["Contact"]?.access && permissions["Contact"]?.view) && disabledSidebarItem}`}>
                                <IconContacts />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Contacts
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={'/dashboard/activity'}
                                onClick={() => setTab(TITLES.ACTIVITIES)}
                                className={`h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.ACTIVITIES && 'bg-purple-600'}`}>
                                <IconActivity color="#F4EBFF" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Activities
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
                <div className="h-1 w-2/3 my-[24px] border-t-2 border-purple-800"></div>

                {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href={'/dashboard/settings'}
                                onClick={() => {
                                    setTab(TITLES.USER_MANAGEMENT)
                                    setSettingsClicked(isSettingsClicked + 1)
                                }} className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.USER_MANAGEMENT && 'bg-purple-600'} ${!(permissions["User Management"]?.access && permissions["User Management"]?.view) && disabledSidebarItem}`}>
                                <IconSettings />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Settings
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
                {/* {<TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div onClick={() => setTab(TITLES.USER_MANAGEMENT, true)} className={`h-12 w-12 hover:cursor-pointer p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === TITLES.USER_MANAGEMENT && 'bg-purple-600'} ${!(permissions["User Management"]?.access && permissions["User Management"]?.view) && disabledSidebarItem}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 25 24" fill="none">
                                    <g id="users-02">
                                        <path id="Icon" d="M16.5 3.46776C17.9817 4.20411 19 5.73314 19 7.5C19 9.26686 17.9817 10.7959 16.5 11.5322M18.5 16.7664C20.0115 17.4503 21.3725 18.565 22.5 20M2.5 20C4.44649 17.5226 7.08918 16 10 16C12.9108 16 15.5535 17.5226 17.5 20M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>

                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            User Management
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>} */}

                {isSmallScreen && <div className="sticky bottom-0 rounded-full h-[40px] w-[40px] bg-purple-700 flex-row justify-center w-full">
                    {showScrollButton && <div onClick={() => scrollDown()} className="cursor-pointer flex flex-row justify-center"><ArrowDown size={20} color="white" /></div>}
                    {!showScrollButton && <div onClick={() => scrollUp()} className="cursor-pointer flex flex-row justify-center"><ArrowUp size={20} color="white" /></div>}
                </div>}
            </div>

        </div>
    )
}

export default MainSidebar