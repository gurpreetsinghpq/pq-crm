"use client"
import Image from "next/image"
import Leads from "../../components/custom/leads"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import Prospects from "@/components/custom/prospects"
import { IconHome, IconLeads, IconPq, IconProspects } from "@/components/icons/svgIcons"

const Dashboard = () => {
    const [currentTab, setCurrentTab] = useState("Leads")
    console.log(currentTab)
    return <div className="flex flex-row min-h-screen">
        <div className="left flex flex-col w-24 px-1  items-center py-6 border-r-2  border-gray-100 border-solid bg-purple-900">
            <div className="h-10 w-10  flex flex-row justify-center">
                {/* <Image alt="pq search" src={"/pq-logo-warm.svg"} sizes="100vw" width={0} height={0} style={{ width: '100%', height: 'auto', objectFit: "contain" }} /> */}
                {/* <Image alt="pq search" src={"/pq-search.png"} sizes="100vw" width={0} height={0} style={{ width: '100%', height: 'auto', objectFit: "contain" }} /> */}
                <IconPq size={32}/>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="h-12 w-12 hover:cursor-pointer mt-10 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center">
                            <IconHome size={24} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Home
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div onClick={() => setCurrentTab("Leads")} className={`h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === "Leads" && 'bg-purple-600'}`}>
                            <IconLeads size={24} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Leads
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div onClick={() => setCurrentTab("Prospects")} className={`h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center ${currentTab === "Prospects" && 'bg-purple-600'}`}>
                            <IconProspects size={24} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Prospects
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 25 24" fill="none">
                    <g id="wallet-06">
                        <path id="Icon" d="M12.5001 6.5H8.96437C8.44341 6.5 7.94379 6.28929 7.57541 5.91421C7.20704 5.53914 7.00009 5.03043 7.00009 4.5C7.00009 3.96957 7.20704 3.46086 7.57541 3.08579C7.94379 2.71071 8.44341 2.5 8.96437 2.5C11.7144 2.5 12.5001 6.5 12.5001 6.5ZM12.5001 6.5H16.0358C16.5568 6.5 17.0564 6.28929 17.4248 5.91421C17.7931 5.53914 18.0001 5.03043 18.0001 4.5C18.0001 3.96957 17.7931 3.46086 17.4248 3.08579C17.0564 2.71071 16.5568 2.5 16.0358 2.5C13.2858 2.5 12.5001 6.5 12.5001 6.5ZM19.5001 10L21.3642 13.1069C21.782 13.8032 21.9909 14.1514 22.0994 14.5262C22.1955 14.8582 22.2335 15.2045 22.2117 15.5495C22.1871 15.9389 22.0587 16.324 21.802 17.0944L21.5941 17.7179C21.2007 18.8981 21.004 19.4882 20.6392 19.9245C20.317 20.3098 19.9032 20.608 19.4358 20.7918C18.9066 21 18.2845 21 17.0404 21L7.95973 21C6.71566 21 6.09362 21 5.56435 20.7918C5.09696 20.608 4.68321 20.3098 4.36102 19.9245C3.99617 19.4882 3.79946 18.8981 3.40605 17.7179L3.19822 17.0944C2.94144 16.324 2.81304 15.9389 2.78844 15.5495C2.76664 15.2044 2.80464 14.8582 2.90078 14.5261C3.00926 14.1514 3.21815 13.8032 3.63593 13.1069L5.50009 10L5.08282 8.53955C4.88499 7.84717 4.78608 7.50097 4.86378 7.22708C4.93185 6.98715 5.08711 6.78132 5.29911 6.64996C5.54112 6.5 5.90116 6.5 6.62126 6.5L18.3789 6.5C19.099 6.5 19.4591 6.5 19.7011 6.64996C19.9131 6.78132 20.0683 6.98715 20.1364 7.22708C20.2141 7.50097 20.1152 7.84717 19.9174 8.53955L19.5001 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path id="Icon_2" d="M14.5 10.5498H12C11.1716 10.5498 10.5 11.2214 10.5 12.0498C10.5 12.8782 11.1716 13.5498 12 13.5498H13C13.8284 13.5498 14.5 14.2214 14.5 15.0498C14.5 15.8782 13.8284 16.5498 13 16.5498H10.5M12.5 9.5498V10.5498M12.5 16.5498V17.5498" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>
            </div>
            <div className="h-1 w-2/3 mt-4 border-t-2 border-purple-800"></div>
            <div className="h-12 w-12 hover:cursor-pointer mt-4  p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center">
                <svg width="auto" height="auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="building-07">
                        <path id="Icon" d="M7.5 11H4.6C4.03995 11 3.75992 11 3.54601 11.109C3.35785 11.2049 3.20487 11.3578 3.10899 11.546C3 11.7599 3 12.0399 3 12.6V21M16.5 11H19.4C19.9601 11 20.2401 11 20.454 11.109C20.6422 11.2049 20.7951 11.3578 20.891 11.546C21 11.7599 21 12.0399 21 12.6V21M16.5 21V6.2C16.5 5.0799 16.5 4.51984 16.282 4.09202C16.0903 3.71569 15.7843 3.40973 15.408 3.21799C14.9802 3 14.4201 3 13.3 3H10.7C9.57989 3 9.01984 3 8.59202 3.21799C8.21569 3.40973 7.90973 3.71569 7.71799 4.09202C7.5 4.51984 7.5 5.0799 7.5 6.2V21M22 21H2M11 7H13M11 11H13M11 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>
            </div>
            <div className="h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center">
                <svg width="auto" height="auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="user-square">
                        <path id="Icon" d="M4.00002 21.8174C4.6026 22 5.41649 22 6.8 22H17.2C18.5835 22 19.3974 22 20 21.8174M4.00002 21.8174C3.87082 21.7783 3.75133 21.7308 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H17.2C18.8802 2 19.7202 2 20.362 2.32698C20.9265 2.6146 21.3854 3.07354 21.673 3.63803C22 4.27976 22 5.11984 22 6.8V17.2C22 18.8802 22 19.7202 21.673 20.362C21.3854 20.9265 20.9265 21.3854 20.362 21.673C20.2487 21.7308 20.1292 21.7783 20 21.8174M4.00002 21.8174C4.00035 21.0081 4.00521 20.5799 4.07686 20.2196C4.39249 18.6329 5.63288 17.3925 7.21964 17.0769C7.60603 17 8.07069 17 9 17H15C15.9293 17 16.394 17 16.7804 17.0769C18.3671 17.3925 19.6075 18.6329 19.9231 20.2196C19.9948 20.5799 19.9996 21.0081 20 21.8174M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>

            </div>
            <div className="h-1 w-2/3 mt-4 border-t-2 border-purple-800"></div>

            <div className="h-12 w-12 hover:cursor-pointer mt-4 p-3 hover:bg-purple-600 hover:fill-current text-white-900 hover:text-white-900 rounded flex flex-row justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 25 24" fill="none">
                    <g id="users-02">
                        <path id="Icon" d="M16.5 3.46776C17.9817 4.20411 19 5.73314 19 7.5C19 9.26686 17.9817 10.7959 16.5 11.5322M18.5 16.7664C20.0115 17.4503 21.3725 18.565 22.5 20M2.5 20C4.44649 17.5226 7.08918 16 10 16C12.9108 16 15.5535 17.5226 17.5 20M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>

            </div>

        </div>
        <div className="right flex flex-col w-full">
            <div className="top w-full flex flex-row justify-between items-center px-6 py-5 border-b-2 border-gray-100 ">
                <div className="text-xl text-gray-900  ">
                    {currentTab}
                </div>
                <div className="flex flex-row ">
                    <div className="flex flex-row items-center gap-6">
                        <div className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g id="bell-01">
                                    <path id="Icon" d="M7.79514 17.5001C8.38275 18.0187 9.15462 18.3334 10 18.3334C10.8454 18.3334 11.6172 18.0187 12.2048 17.5001M15 6.66675C15 5.34067 14.4732 4.0689 13.5355 3.13121C12.5978 2.19353 11.3261 1.66675 10 1.66675C8.67391 1.66675 7.40214 2.19353 6.46446 3.13121C5.52678 4.0689 5 5.34067 5 6.66675C5 9.2419 4.35039 11.005 3.62472 12.1713C3.0126 13.155 2.70654 13.6468 2.71777 13.784C2.73019 13.936 2.76238 13.9939 2.88481 14.0847C2.99538 14.1667 3.49382 14.1667 4.49071 14.1667H15.5093C16.5062 14.1667 17.0046 14.1667 17.1152 14.0847C17.2376 13.9939 17.2698 13.936 17.2822 13.784C17.2934 13.6468 16.9874 13.155 16.3753 12.1713C15.6496 11.005 15 9.2419 15 6.66675Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </svg>
                        </div>
                        <Avatar className="cursor-pointer">
                            {/* <AvatarImage src="https://lh3.googleusercontent.com/fife/AKsag4PuJvHZYJVO6hbNSv00i_B1H96LB-DKlh4GKF6rDt7vLX-udzJEaRvBcWAafSe9pxUk_xJvUD_YSdBGPLmakTmmov4pj3f2ZrvkMRVEp92iwln3pCY-zDTZK2kW-ImLpTURo0JOFMVwVjpY44qQHLiMiYiY1VXOf29hN14tO_iTnwLMW8KGFJTtVRDUd7kUkcNO56JXdeLjrL5Ad4e2C11BOSu3aJOr0CaM3lStwe7pPGrWWcZOGgEl8XTcS_2no5aVv0F3TZs7wkOMsNhnDjSF69Khz34M4tstXGYiaHW41mlPc1OMYPAo58st9476ahuaBDfzyD_v8aLZhB3pb4oQ4udwp-XrEBiwRMZPHfXw0DnjNtSt_rTTN2PFHBcUysh1IvglGDzKsuUMvCviLFdQ1Qoga9tvoh2kQELo_voGZ77t9yI-IFJezDGNDO2Q22EnBpirqOiIU7cakCLwmEUsGd2Eq5TvwYYVk1zIo0UhT07mnGf6Y9jUFKBdVS-vqjqA8D-GBtlTeqaKRt9qqOiqMtEsMUnZPkdGm73sCGC6t3Un7EqcNk8LYdSrCsujkgMhW9x_cNyrjXphaJdPA_Rqupg59a_cEHBNZrXzNKOggYe2KisNPZsQYkvl0kAShif2O22AKKdDPLEEl7PG5MsYu82AhvTADxWOKzavNOS2wnkDFQ88pszjEPL9cQGPIHEenp4VGC42np3Fesd3QJLZnAaQXYNtq3-FzZRXKDLxuY8ipq4E02Ljuxs9VJWIaS4d7CyuQWzQRAPyhJjvaq8a2ME4KTDI-URUNNwOvehwQlC8sqrTj74IibbSFkIKZJFbATRQSuPA5zO0n60I_xB8kBM14gQc_g7KUMvSYv7tDQPxmy8sUQEo3x6QPSeJTdMGnfMO4qpoK7DJQSRJ73nUjuD-assmMxPNOvH5SdNqY3lN6SpZJmUT5SCJkKLfQRISxIzf1qq-ylQSQeWUh-4A4NB6B7tTL3YgleuqJCL65rbzHkbNDONI0hDV1_RQoL234w5ZrzKDJkXn1HP2qaR1l4lh17uP36zxf3cxfKDv3dG40s8t8peyH-8eYWmvVvf5uzF3tdEEO8t3QqzZq8ACScu9pGL6jrggwMDjTqQceYahOSWp2WqpN7X6mr66Um2fUzD9f0x94mns_O4r62WvkYeDHym_i14vJIg5-lMcNPOxg26sr2sspI0UjaSy1g6S3Ct_Ji5XRTTADgt-KrGDYHkAfTf-6Fqf6Dp3Q5eGu99vQdxO8UuLijQ4LeXt1NhWW9XNHIDyMf2bVgvkYLeirfHzLnu40s4i8wA-ehGmuRR1obIpsHP6TvJAUwmhhApiaEygwcxF0U9_WXz2Thb_uDng69jBQ02rYnKtpBg4iOFm9w=s32-c" alt="@shadcn" /> */}
                            <AvatarImage />
                            <AvatarFallback className="text-md font-semibold bg-gray-100 border border-gray-300">RG</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
            <div className="bottom">
                {currentTab === 'Leads' && <Leads />}
                {currentTab === 'Prospects' && <Prospects />}

            </div>
        </div>
    </div>
}
export default Dashboard