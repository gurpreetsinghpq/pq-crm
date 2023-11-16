"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import AddLeadDetailedDialog from './addLeadDetailedDialog'
import { IconAccounts, IconAccounts2, IconBuildings } from '../icons/svgIcons'
import { ClientCompleteInterface, LeadInterface } from '@/app/interfaces/interface'
import AddAcountDetailedDialog from './addAccountDetailedDialog'
import AddContactDetailedDialog from './addContactDetailedDialog'
import { getToken } from './commonFunctions'
import { useDebounce } from '@/hooks/useDebounce'
import { Loader2 } from 'lucide-react'
import { Input } from '../ui/input'
import SearchableInput from './searchableInput'

// const dummySearchedItems = ["Swiggy", "Swish Bank"]

let dataFromApi: ClientCompleteInterface[] = []
let leadDataFromApi: LeadInterface[] = []
const dummySearchedItems: ClientCompleteInterface[] = [
    {
        "id": 1,
        "contacts": [],
        "created_by": "Anmol Goel",
        "updated_by": "Anmol Goel",
        "name": "Swiggy",
        "registered_name": null,
        "govt_id": null,
        "billing_address": null,
        "shipping_address": null,
        "industry": null,
        "domain": null,
        "size": null,
        "last_funding_stage": null,
        "last_funding_amount": null,
        "funding_currency": null,
        "segment": null,
        "archived": false
    }
]

const AddLeadDialog = ({ children, fetchLeadData, page }: { children: any, fetchLeadData: CallableFunction, page: string }) => {
    const [inputAccount, setInputAccount] = useState("")
    const [details, setDetails] = useState<ClientCompleteInterface>()
    const [filteredLeadData, setFilteredLeadData] = useState<LeadInterface[]>()
    const [accountData, setAccountData] = useState<ClientCompleteInterface[]>([])
    const [open, setOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [loading, setLoading] = useState(false)
    function onChangeHandler(data: string) {
        setInputAccount(data)
    }

    const debouncedSearchableFilters = useDebounce(inputAccount, 500)
    
    useEffect(() => {
        console.log("fetchclientdata", debouncedSearchableFilters)
        if(inputAccount.length===0){
            setAccountData([])
        }

        fetchClientData(debouncedSearchableFilters)

    }, [debouncedSearchableFilters])


    function dataFromChild(isCancelled?:boolean) {
        setIsExpanded(false)
        setOpen(false)
        setInputAccount("")
        if(!isCancelled){
            fetchLeadData()
        }
        setDetails(undefined)
        setFilteredLeadData([])
        setAccountData([])
        console.log("datafromchild")
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()
    async function fetchClientData(textToSearch: string) {
        const nameQueryParam = textToSearch ? `&name=${encodeURIComponent(textToSearch)}` : '';
        setLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/?page=1&limit=15${nameQueryParam}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" },cache:"no-store" })
            const result = await dataResp.json()
            setLoading(false)
            let data: ClientCompleteInterface[] = structuredClone(result.data)
            setAccountData(data)
            let fdata = data
            dataFromApi = fdata
        }
        catch (err) {
            console.log("error", err)
            setLoading(false)
        }
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/lead/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: LeadInterface[] = structuredClone(result.data)
            let fdata = data.map(val => {
                val.title = val.title === null ? "" : val.title
                return val
            })
            leadDataFromApi = fdata
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (open) {
        }
    }, [open])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "Enter" && inputAccount?.trim()?.length > 0 && doesInputOrgExists(inputAccount)) {
                e.preventDefault()
                setIsExpanded(true)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [inputAccount])


    function openExpanedWFilledDetails(details: ClientCompleteInterface) {
        setIsExpanded(true)
        setDetails(details)
        let data = leadDataFromApi.filter((val) => {
            return val.organisation.name.toLowerCase() === details.name.toLowerCase()
        })
        setFilteredLeadData(data)
    }


    const renderDetailedPage = () => {
        switch (page) {
            case "leads":
                return <AddLeadDetailedDialog dataFromChild={dataFromChild} inputAccount={inputAccount} details={details} filteredLeadData={filteredLeadData} />
            case "accounts":
                return <AddAcountDetailedDialog dataFromChild={dataFromChild} inputAccount={inputAccount} details={details} filteredLeadData={filteredLeadData} />
            case "contacts":
                return <AddContactDetailedDialog dataFromChild={dataFromChild} inputAccount={inputAccount} details={details} filteredLeadData={filteredLeadData} />
            default:
                return <></>
        }
    }

    function renderTitle() {
        switch (page) {
            case "leads":
                return "Add Lead"
            case "accounts":
                return "Add Account"
            case "contacts":
                return "Add Contact"
        }
    }

    function checkPageAndLink(details: ClientCompleteInterface) {
        switch (page) {
            case "leads":
            case "contacts":
                openExpanedWFilledDetails(details)
                break;
            case "accounts":
                break;
        }
    }

    function getClassAccToPage() {
        switch (page) {
            case "leads":
                return `max-h-[500px] 2xl:max-h-[800px] overflow-y-auto ${isExpanded ? 'w-[920px]' : 'w-[500px]'}`
            case "accounts":
                return `max-h-[500px] 2xl:max-h-[800px] overflow-y-auto ${isExpanded ? 'w-[920px]' : 'w-[500px]'}`
            case "contacts":
                return `max-h-[500px] 2xl:max-h-[800px] overflow-y-auto ${isExpanded ? 'w-[600px]' : 'w-[500px]'}`
            default:
                return ""
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0" onPointerDownOutside={(e) => e.preventDefault()} onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        console.log("this should not be called");
                        dataFromChild(true)
                    }
                }}>
                    <DialogHeader >
                        <DialogTitle className="px-[24px] pt-[30px] pb-[10px]">
                            <span className="text-lg">{renderTitle()}</span>
                        </DialogTitle>
                    </DialogHeader>
                    {/* <Separator className="bg-gray-200 h-[1px] " /> */}
                    <div className={`flex flex-col  ${getClassAccToPage()}`}>
                        {!isExpanded ?
                            // <div className="flex flex-col mx-6 gap-2">
                            //     <div className="flex flex-row gap-[10px] items-center">
                            //         <div className="h-[26px] w-[26px] text-gray-500 rounded flex flex-row justify-center">
                            //             <IconAccounts2 />
                            //         </div>
                            //         <span className="text-xs text-gray-700">ACCOUNT</span>
                            //         <div className="bg-gray-200 h-[1px] w-full" />
                            //     </div>
                            //     <Command className="hover:border-purple-300 hover:shadow-custom1 mt-[6px] rounded-[8px] border-[1px] border-gray-300 shadow-xs ">
                            //         <CommandInput onValueChange={(e) => { onChangeHandler(e) }} value={inputAccount} className="text-md" placeholder="Enter Organization Name" />
                            //         {inputAccount?.trim()?.length > 0 && <CommandList className='flex flex-col max-h-[200px] overflow-y-scroll '>
                            //             {accountData.length > 0 ? accountData.map((item: ClientCompleteInterface, index) => (
                            //                 <CommandItem key={index} className="flex flex-row  justify-between px-0 py-0" >
                            //                     <div className={`flex flex-row justify-between w-full items-center pointer px-4 py-4 ${page === 'leads' && 'cursor-pointer'}`} onClick={() => checkPageAndLink(item)}>
                            //                         <div className="flex flex-row gap-2">
                            //                             <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                            //                                 <IconBuildings size="20" />
                            //                             </div>
                            //                             <span>{item?.name}</span>
                            //                         </div>
                            //                         {page !== "accounts" && <span className='text-lg text-gray-700'>🡵</span>}
                            //                     </div>
                            //                 </CommandItem>
                            //             )) : <><CommandEmpty>No results found.</CommandEmpty></>
                            //             }

                            //         </CommandList>}
                            //         <Separator />
                            //         {
                            //             inputAccount && doesInputOrgExists(inputAccount) &&
                            //             <div onClick={() => setIsExpanded(true)}>
                            //                 <div className='flex flex-row order-last justify-between gap-2 px-4 py-4 items-center cursor-pointer'>
                            //                     <div className="flex flex-row gap-2 items-center">
                            //                         <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                            //                             <svg width="auto" height="auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            //                                 <g id="plus-square">
                            //                                     <path id="Icon" d="M8 5.33333V10.6667M5.33333 8H10.6667M5.2 14H10.8C11.9201 14 12.4802 14 12.908 13.782C13.2843 13.5903 13.5903 13.2843 13.782 12.908C14 12.4802 14 11.9201 14 10.8V5.2C14 4.0799 14 3.51984 13.782 3.09202C13.5903 2.71569 13.2843 2.40973 12.908 2.21799C12.4802 2 11.9201 2 10.8 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.0799 2 5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14Z" stroke="#7F56D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            //                                 </g>
                            //                             </svg>
                            //                         </div>
                            //                         <div className='flex flex-row'>
                            //                             <span className='text-purple-600 font-medium text-md '>Add <span className='font-semibold'>'{inputAccount}'</span> as new account</span>
                            //                         </div>
                            //                     </div>
                            //                     <span className='text-xs text-purple-600 font-normal'>↵ Enter</span>
                            //                 </div>
                            //             </div>
                            //         }
                            //     </Command>
                            //     {page === "accounts" && inputAccount && !doesInputOrgExists(inputAccount) && <div className='text-error-500 text-sm font-normal'>
                            //         Account with this name already exists.
                            //     </div>}
                            // </div>
                            <div>
                                <div className="flex flex-col mx-6 gap-2">
                                    <div className="flex flex-row gap-[10px] items-center">
                                        <div className="h-[26px] w-[26px] text-gray-500 rounded flex flex-row justify-center">
                                            <IconAccounts2 />
                                        </div>
                                        <span className="text-xs text-gray-700">ACCOUNT</span>
                                        <div className="bg-gray-200 h-[1px] w-full" />
                                    </div>
                                    <SearchableInput data={accountData} loading={loading} page={page} checkPageAndLink={checkPageAndLink} inputAccount={inputAccount} onChangeHandler={onChangeHandler} setIsExpanded={setIsExpanded} />
                                </div>
                            </div>
                            : <div>
                                {renderDetailedPage()}
                            </div>}
                        {!isExpanded && <><Separator className="bg-gray-200 h-[1px]  mt-8" />
                            <div className="flex flex-row gap-2 justify-end mx-6 my-6">
                                <DialogClose asChild>
                                    <Button variant={"google"} onClick={()=>dataFromChild(true)}>Cancel</Button>
                                </DialogClose>
                                <Button disabled>Save & Add</Button>
                            </div></>}
                    </div>

                </DialogContent >
            </Dialog >
        </>
    )
}

export default AddLeadDialog

export function doesInputOrgExists(inputAccount: string) {
    const res = !dataFromApi.find((data) => data.name.toLowerCase() === inputAccount.toLowerCase())
    console.log(res)
    return res
}
