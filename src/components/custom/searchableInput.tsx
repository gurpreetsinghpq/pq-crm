import React from 'react'
import { Input } from '../ui/input'
import { ClientCompleteInterface } from '@/app/interfaces/interface'
import { IconBuildings } from '../icons/svgIcons'
import { Loader2 } from 'lucide-react'
import { doesInputOrgExists } from './addLeadDialog'
import { handleAlphaNumericKeyPress, handleAlphaNumericPaste } from './commonFunctions'

function SearchableInput({ data, loading, page, checkPageAndLink, onChangeHandler, setIsExpanded, inputAccount }: { data: ClientCompleteInterface[], loading: boolean, page: string, checkPageAndLink: (details: ClientCompleteInterface) => void, onChangeHandler: (data: string) => void, setIsExpanded: CallableFunction, inputAccount: string }) {
    
    return (
        <div className='flex flex-col relative h-fit'>
            <Input onKeyPress={handleAlphaNumericKeyPress} onPaste={handleAlphaNumericPaste} placeholder='Search Account' className='hover:border-purple-300 hover:shadow-custom1 focus:shadow-custom1' onChange={(e) => { onChangeHandler(e.currentTarget.value) }} />
            {inputAccount.length > 0 && <div className=' relative mt-[5px] z-[100] flex flex-col left-0 w-full bg-white-900 px-[0px] py-[0px] flex h-fit w-full rounded-[8px] border border-[1px] border-gray-300 border-solid shadow-xs bg-background p-[14px] text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:placeholder:text-gray-400'>
                {
                    loading ?
                        <div className='p-[16px] flex flex-row justify-center items-center min-h-[150px]'>
                            <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                        </div> :
                        <div className='max-h-[150px] overflow-y-scroll '>
                            {
                            inputAccount.length > 0 && data.length > 0 ? data.map((item: ClientCompleteInterface, index) => (
                                <div key={index} className="flex flex-row  justify-between px-0 py-0" >
                                    <div className={`flex flex-row justify-between w-full items-center pointer px-4 py-4 hover:bg-gray-100 ${page === 'leads' && 'cursor-pointer'}`} onClick={() => checkPageAndLink(item)}>
                                        <div className="flex flex-row gap-2">
                                            <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                                <IconBuildings size="20" />
                                            </div>
                                            <span>{item?.name}</span>
                                        </div>
                                        {page !== "accounts" && <span className='text-lg text-gray-700'>🡵</span>}
                                    </div>
                                </div>
                            ))
                             : 
                            <><div className='p-[16px] flex flex-row justify-center items-center'>No results found.</div></>
                            }
                        </div>
                }
                {
                    !loading &&
                    doesInputOrgExists(inputAccount) && inputAccount.length > 0 &&
                    <div onClick={() => setIsExpanded(true)} className=' rounded-[8px] bg-white-900 border-t-[1px] border-gray-200 h-fit'>
                        <div className='flex flex-row order-last justify-between gap-2 px-4 py-4 items-center cursor-pointer'>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="h-[20px] w-[20px] text-gray-500 rounded flex flex-row justify-center">
                                    <svg width="auto" height="auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="plus-square">
                                            <path id="Icon" d="M8 5.33333V10.6667M5.33333 8H10.6667M5.2 14H10.8C11.9201 14 12.4802 14 12.908 13.782C13.2843 13.5903 13.5903 13.2843 13.782 12.908C14 12.4802 14 11.9201 14 10.8V5.2C14 4.0799 14 3.51984 13.782 3.09202C13.5903 2.71569 13.2843 2.40973 12.908 2.21799C12.4802 2 11.9201 2 10.8 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.0799 2 5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14Z" stroke="#7F56D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </div>
                                <div className='flex flex-row'>
                                    <span className='text-purple-600 font-medium text-md '>Add <span className='font-semibold'>'{inputAccount}'</span> as new account</span>
                                </div>
                            </div>
                            <span className='text-xs text-purple-600 font-normal'>↵ Enter</span>
                        </div>
                    </div>
                }
            </div>}
            {page === "accounts" && inputAccount && !doesInputOrgExists(inputAccount) && <div className='mt-5 text-center text-error-500 text-sm font-normal'>
                Account with this name already exists.
            </div>}
        </div>
    )
}

export default SearchableInput