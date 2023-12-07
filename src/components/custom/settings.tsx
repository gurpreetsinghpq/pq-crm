import React, { useEffect, useState } from 'react'
import UserManagement from './userManagement'
import { Permission } from '@/app/interfaces/interface';
import { UseFormReturn } from 'react-hook-form';
import { IconGrid, IconHomeLine, IconWebHook } from '../icons/svgIcons';

import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Integrations from './integrations';
import { disabledSidebarItem } from '@/app/constants/classes';

export const CURRENT_OPTION = {
    USER_MANAGEMENT: "User Management",
    INTEGRATION: "Integration",
    APPS: "Apps",
    WEBHOOKS: "Webhooks",
}

function Settings({ usersForm, teamsForm, profilesForm, permissions, clicked }: {
    usersForm: UseFormReturn<{
        regions: string[];
        functions: string[];
        profiles: string[];
        statuses: string[];
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>, teamsForm: UseFormReturn<{
        teamLeaders: string[];
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>,
    profilesForm: UseFormReturn<{
        search: string;
        queryParamString: string;
        dateRange?: any;
    }, any, undefined>,
    permissions: Permission,
    clicked: number
}) {
    const [currentOption, setCurrentOption] = useState(CURRENT_OPTION.USER_MANAGEMENT)
    const [isSettingPanelOpen, setSettingPanelOpen] = useState<boolean>(true)

    useEffect(()=>{
        setSettingPanelOpen(true)
    },[clicked])

    return (
        <div className='flex flex-row relative flex-1'>
            {isSettingPanelOpen && <div className='absolute flex flex-col min-w-[250px] gap-[16px] h-[100vh]  top-0 left-0 bottom-0 z-[1] px-[16px] py-[36px] bg-gray-50 border-[1px] border-gray-200'>
                <div className='text-gray-900 text-md font-medium'>Settings</div>
                <div className='flex flex-col gap-[4px] cursor-pointer rounded-[6px]'>
                    <div onClick={() => setCurrentOption(CURRENT_OPTION.USER_MANAGEMENT)} className='flex flex-row gap-[12px]'>
                        <div className={`w-full flex flex-row items-center gap-[12px] px-[16px] py-[8px] hover:cursor-pointer hover:bg-purple-600 hover:fill-current text-gray-900 hover:text-white-900 rounded flex flex-row ${currentOption === CURRENT_OPTION.USER_MANAGEMENT && 'bg-purple-600 text-white-900'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14.6666 14V12.6667C14.6666 11.4241 13.8168 10.38 12.6666 10.084M10.3333 2.19384C11.3106 2.58943 12 3.54754 12 4.66667C12 5.78579 11.3106 6.7439 10.3333 7.13949M11.3333 14C11.3333 12.7575 11.3333 12.1362 11.1303 11.6462C10.8597 10.9928 10.3405 10.4736 9.68714 10.203C9.19708 10 8.57582 10 7.33331 10H5.33331C4.0908 10 3.46955 10 2.97949 10.203C2.32608 10.4736 1.80695 10.9928 1.5363 11.6462C1.33331 12.1362 1.33331 12.7575 1.33331 14M8.99998 4.66667C8.99998 6.13943 7.80607 7.33333 6.33331 7.33333C4.86055 7.33333 3.66665 6.13943 3.66665 4.66667C3.66665 3.19391 4.86055 2 6.33331 2C7.80607 2 8.99998 3.19391 8.99998 4.66667Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div className='text-sm font-semibold'>
                                User Management
                            </div>
                        </div>
                    </div>
                    <div className='relative flex flex-col gap-[12px] text-sm font-semibold'>
                        <div className={`w-full flex flex-row items-center gap-[12px] px-[16px] py-[8px] hover:bg-purple-600 hover:fill-current text-gray-700 hover:text-white-900 rounded flex flex-row ${(currentOption === CURRENT_OPTION.APPS || currentOption === CURRENT_OPTION.WEBHOOKS) && 'bg-purple-100 text-purple-600'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.99967 2L5.33301 5.33333M10.6663 2L9.99967 5.33333M14.6663 5.33333H1.33301M4.53301 14H11.4663C12.5864 14 13.1465 14 13.5743 13.782C13.9506 13.5903 14.2566 13.2843 14.4484 12.908C14.6663 12.4802 14.6663 11.9201 14.6663 10.8V5.2C14.6663 4.0799 14.6663 3.51984 14.4484 3.09202C14.2566 2.71569 13.9506 2.40973 13.5743 2.21799C13.1465 2 12.5864 2 11.4663 2H4.53301C3.4129 2 2.85285 2 2.42503 2.21799C2.0487 2.40973 1.74274 2.71569 1.55099 3.09202C1.33301 3.51984 1.33301 4.0799 1.33301 5.2V10.8C1.33301 11.9201 1.33301 12.4802 1.55099 12.908C1.74274 13.2843 2.0487 13.5903 2.42503 13.782C2.85285 14 3.4129 14 4.53301 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div >
                                Integration
                            </div>
                        </div>
                        <div className='flex flex-col bg-white-900 rounded-[5px] py-[8px] mx-[12px] gap-[8px]'>
                            <div className={`flex flex-col`}>
                                <img src="" alt="" />
                                <div className={`w-[160px] flex mx-[10px] flex-row items-center gap-[12px] px-[12px] py-[8px] hover:cursor-pointer hover:bg-purple-600 hover:fill-current text-gray-700 hover:text-white-900 rounded flex flex-row ${currentOption === CURRENT_OPTION.APPS && 'bg-purple-600 text-white-900'}`} onClick={() => setCurrentOption(CURRENT_OPTION.APPS)}>
                                    <div>
                                        <IconGrid />
                                    </div>
                                    <div>
                                        Apps
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <img src="" alt="" />
                                <div className={`w-full flex mx-[10px] flex-row items-center gap-[12px] px-[12px] py-[8px] hover:cursor-pointer hover:bg-purple-600 hover:fill-current text-gray-700 hover:text-white-900 rounded flex flex-row ${disabledSidebarItem} ${currentOption === CURRENT_OPTION.WEBHOOKS && 'bg-purple-600 text-white-900'}`} onClick={() => setCurrentOption(CURRENT_OPTION.WEBHOOKS)}>
                                    <div>
                                        <IconWebHook />
                                    </div>
                                    <div>
                                        Webhooks
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>}
            <div className='flex flex-col flex-1' >
                <div className='flex flex-row '>
                    <div className='top flex flex-row items-center gap-[8px] px-[16px] py-[22px] border-b-[1px] border-gray-200 w-full'>
                        <div className='p-[4px] ml-[15px]' >
                            <IconHomeLine size="20" />
                        </div>
                        <ChevronRight size={16} className='text-gray-300' />
                        <div className='text-sm font-medium text-gray-600 px-[8px] py-[4px] cursor-pointer hover:font-bold' onClick={()=>setSettingPanelOpen(true)}>
                            Settings
                        </div>
                        {currentOption != CURRENT_OPTION.USER_MANAGEMENT && <>
                            <ChevronRight size={16} className='text-gray-300' />
                            <div className='text-sm font-medium text-gray-600 px-[8px] py-[4px]'>
                                {"Integration"}
                            </div>
                        </>}
                        <ChevronRight size={16} className='text-gray-300' />
                        <div className='text-sm font-semibold text-gray-600 px-[16px] py-[8px] rounded-[6px] bg-gray-50'>
                            {currentOption}
                        </div>
                    </div>

                </div>
                <div className='flex flex-col flex-1' onClick={()=>setSettingPanelOpen(false)}>
                    {currentOption === CURRENT_OPTION.USER_MANAGEMENT && <UserManagement usersForm={usersForm} teamsForm={teamsForm} profilesForm={profilesForm} permissions={permissions} />}
                    {(currentOption === CURRENT_OPTION.APPS || currentOption === CURRENT_OPTION.INTEGRATION) && <Integrations currentOption={currentOption} />}
                </div>
            </div>
        </div>
    )
}

export default Settings