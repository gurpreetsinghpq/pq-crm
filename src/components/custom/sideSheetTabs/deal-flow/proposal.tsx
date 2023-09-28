import { activeDarkToggleClasses, disabledSidebarItem, pdfFontStyle1, pdfFontStyle2, pdfFontStyle3, pdfFontStyle4, pdfFontStyle5, pdfInputClasses, pdfbg } from '@/app/constants/classes'
import { IconDarkToggle, IconDownload, IconLightToggle, IconPq2, IconPqName } from '@/components/icons/svgIcons'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { Manrope } from 'next/font/google'
import React, { useEffect, useRef, useState } from 'react'
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas"
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const manrope = Manrope({ subsets: ['latin'] })

type SearchInvestment = {
    field1: string,
    field2: string
}

type FormSchema = {
    organisationName: string,
    date: string,
    clientName: string,
    roleHiringFor: string,
    numberOfRoles: string,
    roleBudget: string,
    roleLocation: string,
    searchInvestment: SearchInvestment[],
    retainerAdvance: string,
    interimRetainerFees: string,
    finalRetainerFees: string

}

function Proposal() {
    const [isDarkMode, setDarkMode] = useState(true)
    const [isDownloadClicked, setIsDownloadClicked] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(100); // Initial zoom level is 100%

    const pdf1 = useRef<HTMLDivElement | null>(null)
    const pdf2 = useRef<HTMLDivElement | null>(null)
    const pdf3 = useRef<HTMLDivElement | null>(null)
    const pdf4 = useRef<HTMLDivElement | null>(null)
    const dateRef = useRef<HTMLDivElement | null>(null)
    const zoomContainer = useRef<HTMLDivElement | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
        getValues
    } = useForm<FormSchema>({
        defaultValues: {
            searchInvestment: [
                {
                    field1: "",
                    field2: ""
                }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "searchInvestment"
    })

    useEffect(() => {
        // addSearchInvestment()
    }, [])

    const addSearchInvestment = () => {
        append({
            field1: '',
            field2: ''
        });
    };

    useEffect(() => {
        if (isDownloadClicked) {
            makePdf()
        }
    }, [isDownloadClicked])



    function makePdf() {
        console.log("makepdf")
        // if(pdf1.current){
        //     console.log("makepdf if")
        //     html2canvas(pdf1.current,{
        //         allowTaint: true,
        //         useCORS: true,
        //         scale:1
        //     }).then(canvas=>{
        //         // document.body.appendChild(canvas)
        //         var img = canvas.toDataURL("image/png")
        //         var doc = new jsPDF()
        //         doc.setFont("Manrope")

        //         // doc.getFontSize(11)
        //         // doc.addImage(img, 'PNG', 7, 13, 195, 105)
        //         var imgData = canvas.toDataURL("image/png");
        //         var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
        //         var pdfWidth = pdf.internal.pageSize.getWidth();
        //         var pdfHeight = pdf.internal.pageSize.getHeight();
        //         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        //         pdf.save("mypdf.pdf");
        //         setIsDownloadClicked(false)
        //     })
        // }

        const divRefs = [pdf1, pdf2, pdf3];

        if (divRefs.length === 0) {
            return; // No divs to convert
        }

        if (zoomContainer.current) {
            zoomContainer.current.style.cssText = "transform:scale(1)"
            setZoomLevel(100)
        }


        // Create a promise for capturing each div's content as an image

        const promises = divRefs.map((divRef) => {
            if (divRef.current) {
                return html2canvas(divRef.current, {
                    allowTaint: true,
                    useCORS: true,
                    scale: 4,
                })
            }
        }
        );

        Promise.all(promises)
            .then((canvases) => {
                if (canvases && canvases?.length > 0 && canvases[0]) {

                    const pdf = new jsPDF('p', 'pt', [canvases[0].width, canvases[0].height]);

                    canvases.forEach((canvas, index) => {
                        if (canvas) {
                            const imgData = canvas.toDataURL("image/png");
                            if (index !== 0) {
                                pdf.addPage([canvas.width, canvas.height]);
                            }
                            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                        }
                    });

                    pdf.save("mypdf.pdf");
                    setIsDownloadClicked(false);
                }
            })
            .catch((error) => {
                console.error("Error generating PDF:", error);
            });

    }

    const handleZoomIn = () => {
        if (zoomLevel < 200) {
            setZoomLevel(zoomLevel + 10); // Increase zoom by 10%
        }
    };

    const handleZoomOut = () => {
        if (zoomLevel > 80) {
            setZoomLevel(zoomLevel - 10); // Decrease zoom by 10%
        }
    };

    const zoomStyle = {
        transform: `scale(${zoomLevel / 100})`, // Apply the scale transformation
    };

    return (
        <div className='relative h-full flex flex-col  w-full'>
            <div className={`pdf-container max-h-[70vh] overflow-y-scroll manrope items-center ${manrope.className}`}>
                <div ref={zoomContainer} className='flex flex-col justify-center items-center gap-[60px]' style={zoomStyle}>
                    <div ref={pdf1} className={`pdf-1 flex flex-col pdf-size  ${isDarkMode ? "pdf-bg-dark" : "pdf-bg-light"}`}>
                        <div className={`${isDarkMode ? "pdf-gradient-strip" : "pdf-gradient-strip-light"} to-opacity-40 h-[10px] w-full`}>

                        </div>
                        <div className='flex flex-row justify-between pt-[48px] pl-[41px] pr-[31px]'>
                            <div className='flex flex-col gap-[10px]'>
                                <div className={` ${isDarkMode ? "text-gray-400" : "text-purple-800"} ${pdfFontStyle1}`}>
                                    Posuere fermentum sit sed
                                </div>
                                <div className={` ${pdfFontStyle2} ${isDarkMode ? "text-gray-300" : "text-black-900"}`}>
                                    Purple Quarter <br /> Service Proposal for <br />
                                    {!isDownloadClicked ? <input placeholder="Enter Client Name" {...register("organisationName")} className={`${pdfInputClasses}`} /> : getValues("organisationName")}
                                </div>
                            </div>
                            <div className={`text-white-900 ${isDarkMode ? "text-[#3F3F3F]" : "text-[#D1C9C1]"} mt-[-40px] ${pdfFontStyle3}`}>
                                01
                            </div>
                        </div>
                        <div className={`flex bg-purple-300 flex-1 ${isDarkMode ? "bg-[url('/images/pdf-dark-bg.png')]" : "bg-[url('/images/pdf-light-bg.png')]"} bg-cover bg-no-repeat mt-[170px] flex flex-col justify-end items-end py-[19px] px-[17px]`}>
                            <div className={`${isDarkMode ? "text-gray-400" : "text-white-900"} ${pdfFontStyle4}`} ref={dateRef}>{new Date().toLocaleDateString()}</div>
                        </div>
                        <div className={`${isDarkMode ? "pdf-gradient-strip" : "pdf-gradient-strip-light"} to-opacity-40 h-[10px] w-full`}>

                        </div>
                    </div>
                    <div ref={pdf2} className={`pdf-1 flex flex-col pdf-size  ${isDarkMode ? "pdf-bg-dark" : "pdf-bg-light"}`}>
                        <div className={`${isDarkMode ? "pdf-gradient-strip" : "pdf-gradient-strip-light"} to-opacity-40 h-[10px] w-full`}>

                        </div>
                        <div className={`flex bg-purple-300  h-[250px] ${isDarkMode ? "bg-[url('/images/pdf-dark-bg.png')]" : "bg-[url('/images/pdf-light-bg.png')]"} bg-cover bg-no-repeat  px-[20px]`}>
                            {/* <div className={`${isDarkMode ? "text-gray-400" : "text-white-900"} ${pdfFontStyle4}`} ref={dateRef}>{new Date().toLocaleDateString()}</div> */}
                        </div>
                        <div className={`mt-[-120px] w-full py-[16px] px-[20px]`}>
                            <div className={` w-full pt-[20px] py-[24px] px-[24px] flex flex-col gap-[10px] ${isDarkMode ? "summary-gradient-dark" : "summary-gradient-light"} relative `}>
                                <div className={`font-bold text-[24px] ${isDarkMode ? "text-white-900" : "text-white-900"}`}>Executive Summary</div>
                                {/* <textarea className='w-full h-[100px] text-gray-200 focus:border-dotted-[1px]' style={{background:"none", resize:"none"}}>
                                    We are excited to present our competitive pricing proposal for executive search services to [Client's Company Name]  At Purple Quarter, we understand the importance of finding the right leaders to drive your organization's success. This proposal outlines our transparent pricing structure and terms to ensure a seamless partnership between our companies.
                                </textarea> */}
                                <div className='text-white-900 font-normal'>
                                    {!isDownloadClicked ? <div>We are excited to present our competitive pricing proposal for executive search services to
                                        <input {...register("clientName")} placeholder="[Client's Company Name]" className={`${pdfInputClasses}`} />
                                        At Purple Quarter, we understand the importance of finding the right leaders to drive your organization's success. This proposal outlines our transparent pricing structure and terms to ensure a seamless partnership between our companies.
                                    </div> : <div>
                                        We are excited to present our competitive pricing proposal for executive search services to
                                        &nbsp;{getValues("clientName")}&nbsp;
                                        At Purple Quarter, we understand the importance of finding the right leaders to drive your organization's success. This proposal outlines our transparent pricing structure and terms to ensure a seamless partnership between our companies.
                                    </div>

                                    }
                                </div>
                            </div>
                            <div className={`px-[24px] mt-[20px] ${isDarkMode ? "text-white-900" : "text-black-900"}  `}>
                                <div className={`text-[24px] font-medium`}>Need Summary</div>
                                <div className='grid grid-cols-2 gap-y-[10px] mt-[10px]'>
                                    <div>Role Hiring for </div>
                                    <div>
                                        {!isDownloadClicked ? <input placeholder="Enter" {...register("roleHiringFor")} className={`w-full ${pdfInputClasses}`} /> : getValues("roleHiringFor")}
                                    </div>
                                    <div>Number of Role(s)</div>
                                    <div>
                                        {!isDownloadClicked ? <input placeholder="Enter" {...register("numberOfRoles")} className={`w-full ${pdfInputClasses}`} /> : getValues("numberOfRoles")}
                                    </div>
                                    <div>Role Budget</div>
                                    <div>
                                        {!isDownloadClicked ? <input placeholder="Enter" {...register("roleBudget")} className={`w-full ${pdfInputClasses}`} /> : getValues("roleBudget")}
                                    </div>
                                    <div>Role Location</div>
                                    <div>
                                        {!isDownloadClicked ? <input placeholder="Enter" {...register("roleLocation")} className={`w-full ${pdfInputClasses}`} /> : getValues("roleLocation")}
                                    </div>
                                </div>
                            </div>
                            <div className={`px-[24px] mt-[20px] ${isDarkMode ? "text-white-900" : "text-black-900"}  `}>
                                <div className='flex flex-row gap-[20px] items-center'>
                                    <div className={`text-[24px] font-medium`}>Search Investment</div>
                                    {!isDownloadClicked ? <><div className={`${isDarkMode ? "bg-[#527BC2]" : "bg-[#964437]"} h-[2px] flex-1`}></div>
                                        <div className={`text-[#477BC6] text-[24px] font-semibold cursor-pointer ${fields.length === 2 && disabledSidebarItem}`} onClick={addSearchInvestment}>
                                            + Add
                                        </div></> : <></>}
                                </div>
                                <div className='grid grid-cols-2 gap-y-[10px] mt-[10px] gap-x-[10px]'>
                                    {
                                        fields.map((obj, index) => {
                                            return <>
                                                {!isDownloadClicked ? <input key={`searchInvestment.${index}.field1`} placeholder="Field1" {...register(`searchInvestment.${index}.field1`)} className={`${pdfInputClasses}`} /> : <div>{getValues(`searchInvestment.${index}.field1`)}</div>}
                                                {!isDownloadClicked ? <input key={`searchInvestment.${index}.field2`} placeholder="Field2" {...register(`searchInvestment.${index}.field2`)} className={`${pdfInputClasses}`} /> : <div>{getValues(`searchInvestment.${index}.field2`)}</div>}
                                            </>
                                        })
                                    }
                                </div>

                            </div>
                            <div className={`px-[24px] mt-[20px] ${isDarkMode ? "text-white-900" : "text-black-900"}  `}>
                                <div className='flex flex-row gap-[20px] items-center'>
                                    <div className={`text-[24px] font-medium`}>Terms and Payment Schedule</div>
                                    {/* {!isDownloadClicked ? <><div className='bg-gray-500 h-[2px] flex-1'></div>
                                        <div className={`text-[#477BC6] text-[24px] font-semibold cursor-pointer ${fields.length === 2 && disabledSidebarItem}`} onClick={addSearchInvestment}>
                                            + Add
                                        </div></> : <></>} */}
                                </div>
                                {!isDownloadClicked ? <div className='grid grid-cols-[1fr_1fr_2fr] gap-y-[10px] mt-[10px] gap-x-[20px]'>
                                    <div>Retainer Advance</div>
                                    <div>
                                        <input {...register("retainerAdvance")} placeholder="[% or Amount]" className={`${pdfInputClasses}`} />
                                    </div>
                                    <div className=''>
                                        due upon signing the agreement
                                    </div>
                                    <div>Interim Retainer Fees</div>
                                    <div>
                                        <input {...register("interimRetainerFees")} placeholder="[% or Amount]" className={`${pdfInputClasses}`} />
                                    </div>
                                    <div>
                                        due upon offer rollout to candidate
                                    </div>
                                    <div>Final Retainer Fees</div>
                                    <div>
                                        <input {...register("finalRetainerFees")} placeholder="[% or Amount]" className={`${pdfInputClasses}`} />
                                    </div>
                                    <div>
                                        due upon successful candidate onboarding
                                    </div>
                                </div> : <div className='flex grid grid-cols-2 gap-y-[10px] gap-x-[20px] mt-[10px]'>
                                    <div>
                                        Retainer Advance
                                    </div>
                                    <div>
                                        <span className='font-bold'>{getValues("retainerAdvance")}</span> due upon signing the agreement
                                    </div>
                                    <div>
                                        Interim Retainer Fees
                                    </div>
                                    <div>
                                        <span className='font-bold'>{getValues("retainerAdvance")}</span> due upon offer rollout to candidate
                                    </div>
                                    <div>
                                        Final Retainer Fees
                                    </div>
                                    <div>
                                        <span className='font-bold'>{getValues("finalRetainerFees")}</span> due upon successful candidate onboarding
                                    </div>
                                </div>}

                            </div>

                        </div>
                        <div className="flex flex-1 bg-cover bg-no-repeat  flex flex-col justify-end   py-[19px] px-[17px]">
                            {/* <div className={`text-gray-400 ${pdfFontStyle4}`} ref={dateRef}>{new Date().toLocaleDateString()}</div> */}
                            <div className={`flex flex-row gap-[16px] items-end border-t-[2px] pt-[20px] ${isDarkMode ? "border-[#527BC2]" : "border-[#964437]"}`}>
                                <div className='flex flex-row gap-2'>
                                    <IconPq2 />
                                    <IconPqName />
                                </div>
                                <div className={`text-[12px] font-normal ${isDarkMode ? "text-white-900" : ""}`}>
                                    © Purple Quarter - All rights reserved
                                </div>
                            </div>
                        </div>
                        <div className={`${isDarkMode ? "pdf-gradient-strip" : "pdf-gradient-strip-light"} to-opacity-40 h-[10px] w-full`}>

                        </div>
                    </div>
                    <div ref={pdf3} className={`pdf-1 flex flex-col pdf-size  ${isDarkMode ? "pdf-bg-dark" : "pdf-bg-light"}`}>
                        <div className={`${isDarkMode ? "pdf-gradient-strip" : "pdf-gradient-strip-light"} to-opacity-40 h-[10px] w-full`}>

                        </div>
                        <div className='flex flex-row gap-2 justify-center mt-[60px]'>
                            <IconPq2 size={57}/>
                            <IconPqName height={42} width={141}/>
                        </div>
                        <div className='flex flex-1 flex-col gap-[10px] justify-center items-center'>
                            <div className={`text-[60px] font-bold ${isDarkMode? "text-[#FEFDFF]" : ""}`}>THANK YOU</div>
                            <div className={`h-[18px] w-[400px] ${isDarkMode ? "thankyou-dark": "thankyou-light"}`}>

                            </div>
                        </div>

                        <div className="flex  bg-cover bg-no-repeat  flex flex-col justify-end   py-[19px] px-[17px]">
                            {/* <div className={`text-gray-400 ${pdfFontStyle4}`} ref={dateRef}>{new Date().toLocaleDateString()}</div> */}
                            <div className={`flex flex-row gap-[16px]  items-end border-t-[2px] pt-[20px] ${isDarkMode ? "border-[#527BC2]" : "border-[#964437]"}`}>
                                <div className={`flex flex-row justify-center w-full text-[12px] font-normal ${isDarkMode ? "text-white-900" : ""}`}>
                                    © Purple Quarter - All rights reserved
                                </div>
                            </div>
                        </div>
                        <div className={`${isDarkMode ? "pdf-gradient-strip" : "pdf-gradient-strip-light"} to-opacity-40 h-[10px] w-full`}>

                        </div>
                    </div>
                </div>

            </div>
            <div className='absolute bottom-[20px] left-0 flex flex-row w-full '>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row gap-[24px] '>
                        <div className='dark-light-toggle rounded-[8px] bg-gray-200 p-[8px] flex flex-row items-center gap-[8px]'>
                            <div onClick={() => setDarkMode(true)} className={`cursor-pointer flex flex-row gap-[8px] text-purple-700 text-md font-semibold py-[4px] px-[7px] ${isDarkMode ? activeDarkToggleClasses : ""}`}>
                                <IconDarkToggle />
                                Dark
                            </div>
                            <div onClick={() => setDarkMode(false)} className={`cursor-pointer flex flex-row gap-[8px] text-purple-700 text-md font-semibold py-[4px] px-[7px] ${!isDarkMode ? activeDarkToggleClasses : ""}`}>
                                <IconLightToggle />
                                Light
                            </div>
                        </div>
                        <div onClick={() => setIsDownloadClicked(true)} className={`rounded-[8px] bg-gray-200 py-[12px] px-[20px] flex flex-row items-center gap-[8px]`}>
                            <IconDownload />
                            <div className='cursor-pointer flex flex-row gap-[8px] text-purple-700 text-md font-semibold '>
                                Download
                            </div>
                        </div>
                    </div>
                    <div className={`rounded-[8px] bg-gray-600 py-[10px] px-[16px] flex flex-row items-center gap-[8px]`}>
                        <ZoomIn onClick={handleZoomIn} className='text-gray-25 cursor-pointer' size={20} />
                        <div className='h-full w-[1px] bg-gray-400'></div>
                        <ZoomOut onClick={handleZoomOut} className='text-gray-25 cursor-pointer' size={20} />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Proposal