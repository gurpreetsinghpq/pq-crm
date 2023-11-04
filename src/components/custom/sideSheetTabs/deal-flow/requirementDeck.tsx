import { IconAlert, IconPencil2 } from '@/components/icons/svgIcons'
import { Button } from '@/components/ui/button'
import { AlertCircle, Eye, Loader2, Trash2Icon, XCircle } from 'lucide-react'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { extractFileNameFromUrl, formatBytes } from '../../commonFunctions'
import { getCookie } from 'cookies-next'
import { useToast } from '@/components/ui/use-toast'
import { UploadedFile } from '@/app/interfaces/interface'
import { multiLineStyle2 } from '../../table/columns'

function RequirementDeck({ entityId }: { entityId: number }) {

    const [isAnyDocument, setIsAnyDocument] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<{ name: string | null, size: number | null }>({ name: null, size: null });
    const [isUploading, setIsUploading] = useState<boolean>(false)

    const [data, setData] = useState<UploadedFile[]>([])

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const { toast } = useToast()

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getCookie("token")

    useEffect(() => {
        getAllPdf()
    }, [])
    async function getAllPdf() {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/rdcapsule/?prospect=${entityId}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()

            if (result.status == "1") {
                setData(result.data)
                if (result.data.length === 0) {
                    setIsAnyDocument(false)
                } else {
                    setIsAnyDocument(true)
                }
            } else {
                toast({
                    title: "File uploaded Succesfully!",
                    variant: "destructive"
                })
            }


        } catch (e) {

        }

    }

    function removeSelectedFile() {
        setSelectedFile({ name: null, size: null })
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf') {
                // Handle the selected PDF file here
                console.log('Selected file:', selectedFile.name);
                setSelectedFile({ name: selectedFile.name, size: selectedFile.size });

                const formData = new FormData()
                formData.append('file', selectedFile)
                formData.append('prospect', entityId.toString())
                setIsUploading(true)
                try {
                    const dataResp = await fetch(`${baseUrl}/v1/api/rdcapsule/`, { method: "POST", body: formData, headers: { "Authorization": `Token ${token_superuser}` } })
                    const result = await dataResp.json()
                    setIsUploading(false)
                    if (result.message === "success") {
                        toast({
                            title: "File uploaded Succesfully!",
                            variant: "dark"
                        })

                    } else {
                        toast({
                            title: "Something went wrong, Please try again later!",
                            variant: "destructive"
                        })
                    }
                }
                catch (err) {
                    console.log("error", err)
                    setIsUploading(false)
                }

            } else {
                alert('Please select a PDF file.');
                setIsUploading(false)
            }

        }
    };
    return (
        <div className='relative p-[16px] flex flex-row h-full'>
            <div className='flex-1 flex flex-col gap-[80px]'>
                <div className='top'>
                    <div className='text-md font-semibold flex flex-row justify-center'>
                        Open document editor
                    </div>
                    <div className='my-[16px] font-medium text-gray-700 flex flex-row justify-center text-center'>
                        Click the Open Editor button to begin creating a requirement deck.
                    </div>
                    <div className='flex flex-row justify-center'>
                        <Button className='flex flex-row gap-[8px]' onClick={() => window.open('https://pq-capsule-rajgopaljakhmola1-gmailcom.vercel.app/')}>
                            <IconPencil2 />
                            Open Editor
                        </Button>
                    </div>
                </div>
                {isAnyDocument ? <>
                    <div>
                        {
                            <div className='flex flex-col gap-[12px] items-center'>
                                <div>
                                    <img src="images/pdf-front.png"/>

                                </div>
                                <div className='text-gray-700 text-lg font-medium'>
                                    {extractFileNameFromUrl(data[0].file)}
                                </div>
                                <div className='flex flex-row text-gray-700 text-sm'>
                                    <div className='font-medium'>Uploaded on:&nbsp; </div>
                                    <div className='font-bold'>{multiLineStyle2(data[0].uploaded_at)}</div>
                                </div>
                                <div className='flex flex-row text-gray-700 text-sm'>
                                    <div className='font-medium'>Uploaded By:&nbsp; </div>
                                    <div className='font-bold'>{data[0].uploaded_by.name}</div>
                                </div>
                            </div>
                        }
                    </div>
                </> : <div className='flex flex-col gap-[12px] items-center'>
                    <div className='w-[292px] h-[260px] flex flex-row justify-center w-full'>
                        <img src="./images/empty-pdf-bg.png" className='object-cover' />
                    </div>
                    <div className='text-gray-700 text-lg font-medium'>
                        No Document
                    </div>
                    <div className='text-gray-700 text-sm font-medium'>
                        You haven't uploaded any document yet.
                    </div>
                </div>}

            </div>
            <div className='mx-[24px] bg-[#EAECF0] w-[1px] h-full'>

            </div>
            <div className='flex flex-col flex-1'>
                {!selectedFile.name ? <div id="file-upload-div" onClick={handleDivClick} className='px-[24px] py-[16px] rounded-[12px] bg-white-900 border border-gray-200 border-[1px] h-fit flex flex-col gap-[12px] items-center w-full cursor-pointer' >
                    <div className='rounded-[8px] p-[10px] border border-[1px] border-gray-200'>
                        <AlertCircle color="black" />
                    </div>
                    <div className='flex flex-col items-center '>
                        <div className='text-purple-700 text-sm font-semibold9'>
                            Click to upload
                        </div>
                        <div className='text-xs text-gray-600 font-normal'>
                            Only PDF document
                        </div>
                    </div>
                </div> : <div className='relative px-[24px] py-[16px] rounded-[12px] bg-white-900 border border-gray-200 border-[1px] h-fit gap-[12px] items-center w-full ' >
                    <div className='flex flex-row items-center gap-[12px]'>
                        <img src="images/pdf-icon.png" />
                        <div className='flex flex-col text-sm'>
                            <div className='text-gray-700 font-medium'>
                                {selectedFile.name}
                            </div>
                            <div className='text-gray-600 font-normal'>
                                {formatBytes(selectedFile.size || 0, 2)}
                            </div>
                        </div>
                    </div>
                    <div className='absolute top-4 right-4 cursor-pointer' onClick={() => removeSelectedFile()}><XCircle color='red' /></div>
                </div>}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept="application/pdf"
                />
                <div className='text-gray-600 text-xs font-normal mt-[8px] px-[16px]'>
                    <div className='underline font-medium'>
                        Notes:
                    </div>
                    <div>
                        A document that has been uploaded cannot be modified/open in document editor.
                    </div>
                </div>
                <div className='mt-[33px]'>
                    <div className='text-[#101828] font-semibold mb-[12px]'>
                        Documents history
                    </div>
                    {
                        data.length > 0 ? <div className='flex flex-col 2xl:max-h-[500px] overflow-y-auto gap-[10px]'>
                            {data.map((file) => <div className='flex flex-row p-[16px] gap-[16px] items-center border-[1px] border-gray-200 rounded-[12px]'>
                                <img src="images/pdf-2.png" className='w-[32px] h-[40px]' />
                                <div className='flex flex-col gap-[8px] flex-1'>
                                    <div className='flex flex-col text-gray-700 text-sm font-semibold'>
                                        {extractFileNameFromUrl(file.file)}
                                    </div>
                                    <div>
                                        <span className='text-xs font-medium text-gray-600'>Uploaded On:</span> <span className='text-xs text-gray-600 font-semibold'> {multiLineStyle2(file.uploaded_at, true)}</span> | <span className='text-xs font-medium text-gray-600'>By:</span> <span className='text-xs text-gray-600 font-semibold'>{file.uploaded_by.name} </span>
                                    </div>
                                </div>
                                <div className='cursor-pointer' onClick={() => window.open(file.file)}>
                                    <Eye color="#7F56D9" />
                                </div>

                            </div>)}
                        </div> : <div>No Data</div>
                    }

                </div>
            </div>
            {isUploading && <div className='absolute top-0 left-0 w-full h-full flex flex-row justify-center items-center'>
                <Loader2 className="mr-2 h-20 w-20 animate-spin" color='#7F56D9' />
            </div>}
        </div>
    )
}

export default RequirementDeck