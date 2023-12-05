import React, { useEffect, useState } from 'react'
import { CURRENT_OPTION } from './settings'
import { Button } from '../ui/button'
import { getCookie } from 'cookies-next'
import { IntegrationStatus } from '@/app/interfaces/interface'
import { useToast } from '../ui/use-toast'

function Integrations({ currentOption }: { currentOption: string }) {

    const [docuSignStatusData, setDocuSignStatus] = useState<IntegrationStatus>()
    const [windowState, setWindowState] = useState<any>()
    const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus[]>()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getCookie("token")
    const { toast } = useToast()

    useEffect(() => {
        if (windowState) {
            if (windowState.status == "1") {
                // toast({
                //     title: `Connected!`,
                //     variant: "dark"
                // })
                getIntegrationStatus()
                // setDocuSignConnect(true)
            } else {
                console.log(windowState)
                toast({
                    title: `Some error!`,
                    variant: "destructive"
                })
            }
        }
    }, [windowState])

    useEffect(() => {
        getIntegrationStatus()
    }, [])
    function connectDocusign() {
        // remove -d on prod
        let windowPopup: any = window.open(`https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature&client_id=f98519f3-cf54-44a6-b12b-33d1a030513e&redirect_uri=${process.env.NEXT_PUBLIC_DOCUSIGN_URL}/authorize`, "mozillaWindow", "popup")
        // console.log(windowPopup)
        if (windowPopup) {
            windowPopup.setWindowState = setWindowState

        }
    }
    async function getIntegrationStatus() {
        // /v1/api/integrations/
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/integrations/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.data && result.status == "1") {
                const data: IntegrationStatus[] = result.data
                setIntegrationStatus(data)
                const docuSignStatusData = data.reverse().find((val) => val.service_name === "docusign")
                if (docuSignStatusData) {
                    console.log("isDocuSignConnected", docuSignStatusData)
                    setDocuSignStatus(docuSignStatusData)
                }
            } else {
                toast({
                    title: `Some error!`,
                    variant: "destructive"
                })
            }

        }
        catch (err: any) {
            toast({
                title: `Some error!`,
                variant: "destructive"
            })
        }
    }

    async function disconnectDocusign() {
        let docusignObj: IntegrationStatus | undefined = docuSignStatusData

        if (docusignObj) {
            try {
                const dataResp = await fetch(`${baseUrl}/v1/api/integrations/${docusignObj.id}/`, { method: "PATCH", body: JSON.stringify({ archived: true }), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
                const result = await dataResp.json()
                if (result.status=="1") {
                    toast({
                        title: `Disconnected!`,
                        variant: "dark"
                    })
                    getIntegrationStatus()
                    setDocuSignStatus(undefined)
                } else {
                    toast({
                        title: `Some error!`,
                        variant: "destructive"
                    })
                }

            }
            catch (err: any) {
                toast({
                    title: `Some error!`,
                    variant: "destructive"
                })
            }
        }

    }
    return (
        <div className='p-[24px]'>
            {currentOption === CURRENT_OPTION.APPS && <div className='grid grid-cols-2 gap-[20px]'>
                <div className='p-[24px] border-[1px] border-gray-300 flex items-start flex-row gap-[10px]'>
                    <div className='w-[82px] h-[82px] flex flex-row items-center justify-center p-[5px] mt-[10px]'>
                        <img src="./images/docusign-icon.svg" className='object-contain object-top  h-full w-full' />
                    </div>
                    <div className='flex flex-col gap-[32px]'>
                        <div className='flex flex-col gap-[12px]'>
                            <div className='flex flex-row items-center justify-between'>
                                <div className='text-gray-600 text-lg font-semibold'>
                                    DocuSign
                                </div>
                                {docuSignStatusData?.id && <div className='flex flex-row gap-[5px] bg-success-200 rounded-[38px] text-success-600 p-[8px] text-sm font-semibold'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.92905 2.43082C7.41759 2.86668 6.78166 3.13009 6.1118 3.18355C4.54861 3.30829 3.30731 4.54959 3.18257 6.11278C3.12912 6.78264 2.86571 7.41856 2.42984 7.93003C1.41271 9.12357 1.41271 10.879 2.42984 12.0726C2.86571 12.584 3.12912 13.22 3.18257 13.8898C3.30731 15.453 4.54861 16.6943 6.1118 16.8191C6.78166 16.8725 7.41759 17.1359 7.92905 17.5718C9.1226 18.5889 10.8781 18.5889 12.0716 17.5718C12.5831 17.1359 13.219 16.8725 13.8889 16.8191C15.452 16.6943 16.6933 15.453 16.8181 13.8898C16.8715 13.22 17.1349 12.584 17.5708 12.0726C18.5879 10.879 18.5879 9.12357 17.5708 7.93003C17.1349 7.41856 16.8715 6.78264 16.8181 6.11278C16.6933 4.54959 15.452 3.30829 13.8889 3.18355C13.219 3.13009 12.5831 2.86668 12.0716 2.43082C10.8781 1.41369 9.1226 1.41369 7.92905 2.43082Z" fill="#079455" />
                                        <path d="M6 10L8.5 12.5L14 7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Connected
                                </div>}
                            </div>
                            <div className='text-sm font-normal text-gray-900'>
                                DocuSign allows Elixir documents signed electronically, easily and securely. Connect your Elixir! account with DocuSign so you can send and track the signature status or documents without leaving Elixir!
                            </div>
                        </div>
                        <div>
                            {!docuSignStatusData?.id ? <Button onClick={() => connectDocusign()} >Connect</Button> : <Button className="bg-error-600 hover:bg-error-400" onClick={() => disconnectDocusign()}>Disconnect</Button>}
                        </div>
                    </div>
                </div>

            </div>}

        </div>
    )
}

export default Integrations