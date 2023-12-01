import { commonClasses, commonFontClasses, disabledClasses, selectFormMessageClasses } from "@/app/constants/classes";
import { IconBilling, IconBriefcase, IconContacts, IconEdit, IconEmail, IconEmail2, IconExportToZoho, IconGst, IconPackage, IconShield, IconShipping } from "@/components/icons/svgIcons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, ChevronDown, ChevronRight, Cross, CrossIcon, Phone, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { doesTypeIncludesMandatory, fetchAccountFromId, getToken, handleKeyPress, handleOnChangeNumericReturnNull } from "../../commonFunctions";
import { ClientGetResponse, ContactsGetResponse } from "@/app/interfaces/interface";
import { beforeCancelDialog } from "../../addLeadDetailedDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { COUNTRY_CODE, DESIGNATION, SET_VALUE_CONFIG } from "@/app/constants/constants";
import { Command } from "cmdk";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { PopoverClose } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { labelToValue, valueToLabel } from "../../sideSheet";
import { toast } from "@/components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import DataTable from "../../table/datatable";
import { columnsServiceContacts } from "../../table/columns-service-contract";

const FormSchema = z.object({
    registeredName: z.string(),
    billingAddress: z.string(),
    shippingAddress: z.string(),
    gstinVatGstNo: z.string(),
})

const FormSchema2 = z.object({
    name: z.string({
    }).min(2).max(30),
    designation: z.string({
    }),
    // type: z.string(),
    email: z.string({
    }).email(),
    phone: z.string({
    }).min(10).max(10),
    std_code: z.string({
    }),
    contactId: z.string().optional()
})


const form2Defaults = {
    name: "",
    email: "",
    phone: null,
    std_code: "+91"
}


function ServiceContract({ isDisabled = false, entityId, ids }: { isDisabled?: boolean, entityId: number, ids: { accountId: number, contactId: number | null } }) {

    const [contractDetailExpanded, setContractDetailExpanded] = useState<boolean>(false)

    const form = useForm<z.infer<typeof FormSchema>>({})
    const [formSchema2, setFormSchema2] = useState<any>(FormSchema2)
    const [isPhoneMandatory, setIsPhoneMandatory] = useState<boolean>(false)
    const [accountData, setAccountData] = useState<ClientGetResponse>()
    const [contactData, setContactData] = useState<ContactsGetResponse>()
    const [isAccountEditMode, setAccountEditMode] = useState<boolean>(false)
    const [isPayableEditMode, setPayableEditMode] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<{ name: string | null, size: number | null }>({ name: null, size: null });
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isContractDraft, setIsContractDraft] = useState<boolean>(false)
    const [contractDraft, setContractDraft] = useState<[]>([])

    const form2 = useForm<z.infer<typeof formSchema2>>({
        resolver: zodResolver(formSchema2),
        defaultValues: form2Defaults

    })

    const watcher2 = form2.watch()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()

    async function getAccountDetails() {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/${ids.accountId}/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: ClientGetResponse = structuredClone(result.data)
            setAccountData(data)
            // form.setValue("billingAddress", data.billing_address || "")
            // form.setValue("shippingAddress", data.shipping_address || "")
            // form.setValue("gstinVatGstNo", data.govt_id || "")
            // form.setValue("registeredName", data.registered_name || "")
            form.reset({
                billingAddress: data.billing_address || "",
                shippingAddress: data.shipping_address || "",
                gstinVatGstNo: data.govt_id || "",
                registeredName: data.registered_name || ""
            })
        }
        catch (err) {
            console.log("error", err)
        }

    }
    async function getContactDetails() {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/${ids.contactId}/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: ContactsGetResponse = structuredClone(result.data)
            setContactData(data)
            // form2.setValue("std_code", data.std_code)
            // form2.setValue("phone", data.phone)
            // form2.setValue("email", data.email)
            // form2.setValue("name", data.name)
            // form2.setValue("designation", labelToValue(data.designation, DESIGNATION))
            form2.reset({
                "name": data.name,
                "email": data.email,
                "phone": data.phone,
                "std_code": data.std_code,
                "designation": labelToValue(data.designation, DESIGNATION)
            })
        }
        catch (err) {
            console.log("error", err)
        }

    }
    useEffect(() => {
        getAccountDetails()
        changeStdCode()
        console.log("ids", ids)
        if (ids.contactId) {
            getContactDetails()
        }
    }, [])

    function changeStdCode() {
        const value = form2.getValues("std_code")
        let updatedSchema
        console.log("std_code", value, value != "+91")
        if (value != "+91" && value != "+1") {
            updatedSchema = FormSchema.extend({
                phone: z.string().min(4).max(13).optional().nullable()
            })
        } else {
            console.log("neh")
            updatedSchema = FormSchema
        }
        setFormSchema2(updatedSchema)
        console.log("updatedSchema", updatedSchema)
    }


    function resetForm2() {
        // form2.reset(form2Defaults)
    }

    function yesDiscard(): void {
        // form.reset()
        setAccountEditMode(false)
    }

    function yesDiscard2(): void {
        resetForm2()
        setPayableEditMode(false)
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf') {
                // Handle the selected PDF file here
                console.log('Selected file:', selectedFile.name);
                setSelectedFile({ name: selectedFile.name, size: selectedFile.size });
                const formData = new FormData()
                let maxVersion = 0
                let newTitle = "file"
                formData.append('file', selectedFile, newTitle)
                formData.append('prospect', entityId.toString())

                setIsUploading(true)
                // try {
                //     const dataResp = await fetch(`${baseUrl}/v1/api/`, { method: "POST", body: formData, headers: { "Authorization": `Token ${token_superuser}` } })
                //     const result = await dataResp.json()
                //     setIsUploading(false)
                //     if (result.message === "success") {
                //         toast({
                //             title: "File uploaded Succesfully!",
                //             variant: "dark"
                //         })

                //     } else {
                //         toast({
                //             title: "Something went wrong, Please try again later!",
                //             variant: "destructive"
                //         })
                //     }
                // }
                // catch (err) {
                //     console.log("error", err)
                //     setIsUploading(false)
                // }

            } else {
                alert('Please select a PDF file.');
                setIsUploading(false)
            }

        }
    };
    return (
        <>
            <div className="flex flex-col items-start gap-4 flex-1 self-stretch">
                <div className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex p-1 sm:p-4 justify-between items-center self-stretch rounded-md shadow-md">
                        <h2 className="text-gray-700 font-inter font-semibold text-base leading-6">Service Contract Status Tracking</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="default" className="gap-2">
                                    <Image src="/images/upload.svg" alt="upload image" height={20} width={20} />
                                    <div className="text-white font-inter text-base font-semibold leading-6">
                                        Upload Contract Draft
                                    </div>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="py-[30px] px-[24px]" onPointerDownOutside={(e) => e.preventDefault()} onKeyDown={(e) => {
                                if (e.key === "Escape") {

                                }
                            }}>
                                <DialogHeader>
                                    <DialogTitle className="  pb-[10px]">
                                        <div className="text-lg">Upload and attach files</div>
                                        <div className="text-gray-600 text-sm mt-[5px] font-normal w-[450px]">
                                            Upload and attach files to this project.
                                        </div>
                                    </DialogTitle>
                                </DialogHeader>
                                <div id="file-upload-div" onClick={handleDivClick} className="cursor-pointer my-[20px] rounded-[12px] border-[2px] border-purple-600 flex flex-col items-center px-[24px] py-[16px] gap-[10px]">
                                    <div className='rounded-[8px] p-[10px] border border-[1px] border-gray-200'>
                                        <AlertCircle color="black" />
                                    </div>
                                    <div className="flex flex-col gap-[5px] items-center">
                                        <div>
                                            <span className="text-purple-700 font-semibold text-sm">Click to upload</span>
                                        </div>
                                        <span className="text-xs font-normal">Word documents only (Docx)</span>
                                    </div>

                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    accept="application/msword"
                                />
                                <div className="flex flex-row gap-[10px] justify-center">
                                    <DialogClose asChild>
                                        <Button variant={"google"} className="flex-1">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button className="flex-1">Attach Files</Button>

                                </div>

                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <Dialog>

                </Dialog>
                {!isContractDraft ? <div className="flex flex-row w-full min-h-[300px]">
                    <DataTable columns={columnsServiceContacts()} data={contractDraft} filterObj={{}} page="service-contracts" setChildDataHandler={()=>{}} setIsMultiSelectOn={()=>{}} setTableLeadRow={()=>{}}/>
                </div>
                    : <div className="flex justify-center items-center self-stretch">
                        <div className="flex flex-col items-center gap-6">
                            <Image src="/images/no-contract.svg" alt="no contract" height={152} width={118} />
                            <p className="text-gray-900 text-center font-inter text-base font-medium leading-5">
                                No Contract Draft
                            </p>
                        </div>
                    </div>}
                <Separator className='mt-10' />
                <div className="flex flex-col w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-row gap-[5px] items-center cursor-pointer" onClick={() => setContractDetailExpanded(prev => !prev)}>
                            {contractDetailExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            <div className="text-md font-semibold">
                                Contract Details
                            </div>
                        </div>
                        <Button variant="default" className="gap-2">
                            <IconExportToZoho size={20} />
                            <div className="text-white font-inter text-base font-semibold leading-6">
                                Export to Zoho
                            </div>
                        </Button>
                    </div>
                    {contractDetailExpanded && <div className="flex flex-row gap-[16px] mt-[20px] mb-[20px]">
                        <Form {...form}>
                            <form className="flex flex-col flex-1 rounded-[5px] bg-white-900 ">
                                <div className="flex flex-row items-center justify-between p-[16px]">
                                    <div className="text-sm font-bold">Account Details</div>
                                    {
                                        // isAccountEditMode ? <div>
                                        //     <XCircleIcon size={20} className="text-error-500 cursor-pointer" onClick={(()=>setAccountEditMode(false))} />
                                        // </div> :
                                        <div className={`flex flex-row items-center gap-[5px] ${isAccountEditMode ? "cursor-not-allowed opacity-[0.5]" : "cursor-pointer "}`} onClick={(() => !isAccountEditMode && setAccountEditMode(true))}>
                                            <IconEdit size={20} color="#7F56D9" />
                                            <div className="text-purple-600 text-sm font-semibold">
                                                Edit
                                            </div>
                                        </div>}
                                </div>
                                <div className="h-[1px] bg-gray-300 ">
                                </div>
                                <div className="p-[16px] flex flex-col gap-[16px]">
                                    <div className="flex flex-row gap-[8px]">
                                        <IconShield size={20} />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-500 items-baseline">
                                                Registered Name
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="registeredName"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormControl>
                                                            <Input disabled={!isAccountEditMode} className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Registered Name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <IconBilling size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-500 items-baseline">
                                                Billing Address
                                            </div>
                                            <div className="text-md font-normal ">
                                                <FormField
                                                    control={form.control}
                                                    name="billingAddress"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormControl>
                                                                <Input disabled={!isAccountEditMode} className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Billing Address" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <IconPackage size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-500 items-baseline">
                                                Shipping Address
                                            </div>
                                            <div className="text-md font-normal">
                                                <FormField
                                                    control={form.control}
                                                    name="shippingAddress"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormControl>
                                                                <Input disabled={!isAccountEditMode} className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Shipping Address" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <IconGst size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-500 items-baseline">
                                                GSTIN/VAT/GST
                                            </div>
                                            <div className="text-md font-normal">
                                                <div className="text-md font-normal">
                                                    <FormField
                                                        control={form.control}
                                                        name="gstinVatGstNo"
                                                        render={({ field }) => (
                                                            <FormItem className='w-full'>
                                                                <FormControl>
                                                                    <Input disabled={!isAccountEditMode} className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="GSTIN/VAT/GST Number" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {isAccountEditMode &&
                                    <>
                                        <div className="h-[1px] bg-gray-300 ">
                                        </div>
                                        <div className="p-[20px]">
                                            <div className="flex flex-row gap-2 justify-end ">
                                                {/* <DialogClose asChild> */}
                                                {beforeCancelDialog(yesDiscard)}
                                                <Button >Save</Button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </form>
                        </Form>
                        <Form {...form2}>
                            <form className="flex flex-col flex-1 rounded-[5px] bg-white-900 ">
                                <div className="flex flex-row items-center justify-between p-[16px]">
                                    <div className="text-sm font-bold">Accounts Payable Contact Details</div>
                                    {
                                        // isAccountEditMode ? <div>
                                        //     <XCircleIcon size={20} className="text-error-500 cursor-pointer" onClick={(()=>setAccountEditMode(false))} />
                                        // </div> :
                                        <div className={`flex flex-row items-center gap-[5px] ${isPayableEditMode ? "cursor-not-allowed opacity-[0.5]" : "cursor-pointer "}`} onClick={(() => !isPayableEditMode && setPayableEditMode(true))}>
                                            <IconEdit size={20} color="#7F56D9" />
                                            <div className="text-purple-600 text-sm font-semibold">
                                                Edit
                                            </div>
                                        </div>}
                                </div>
                                <div className="h-[1px] bg-gray-300 ">
                                </div>
                                <div className="p-[16px] flex flex-col gap-[16px]">
                                    <div className="flex flex-row gap-[8px]">
                                        <IconShield size={20} />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-500 items-baseline">
                                                Name
                                            </div>
                                            <FormField
                                                control={form2.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormControl>
                                                            <Input disabled={!isPayableEditMode} className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder=" Name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <IconBriefcase size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-500 items-baseline">
                                                Title
                                            </div>
                                            <div className="text-md font-normal ">
                                                <FormField
                                                    control={form2.control}
                                                    name="designation"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full cursor-pointer'>
                                                            <Popover>
                                                                <PopoverTrigger asChild disabled={!isPayableEditMode} >
                                                                    <div className={`flex flex-row gap-[10px] py-[10px] items-center ${!isPayableEditMode ? `${disabledClasses} pointer-events-none cursor-not-allowed bg-gray-50 rounded-[8px] ` : ""}`}>
                                                                        <div className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                            <div className={`w-full flex-1 text-align-left text-md flex  ${commonClasses} ${commonFontClasses}`}>
                                                                                {DESIGNATION.find((val) => val.value === field.value)?.label || <span className={!isPayableEditMode ? ` ${disabledClasses} text-gray-400` : "text-muted-foreground"}>Designation</span>}
                                                                            </div>
                                                                            <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />
                                                                        </div>
                                                                    </div>

                                                                </PopoverTrigger>
                                                                <PopoverContent className="mt-[8px] p-0 w-[33vw]" >
                                                                    <Command>
                                                                        <CommandInput className='w-full' placeholder="Search Designation" />
                                                                        <CommandEmpty>Designation not found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                                {DESIGNATION.map((designation) => (
                                                                                    <CommandItem
                                                                                        value={designation.value}
                                                                                        key={designation.value}
                                                                                        onSelect={() => {
                                                                                            form2.setValue("designation", designation.value, SET_VALUE_CONFIG)
                                                                                        }}
                                                                                    >
                                                                                        <PopoverClose asChild>
                                                                                            <div className="flex flex-row items-center justify-between w-full">
                                                                                                {designation.label}
                                                                                                <Check
                                                                                                    className={cn(
                                                                                                        "mr-2 h-4 w-4 text-purple-600",
                                                                                                        field.value === designation.value
                                                                                                            ? "opacity-100"
                                                                                                            : "opacity-0"
                                                                                                    )}
                                                                                                />
                                                                                            </div>
                                                                                        </PopoverClose>
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </div>
                                                                        </CommandGroup>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <IconEmail2 size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-500 items-baseline">
                                                Email
                                            </div>
                                            <div className="text-md font-normal">
                                                <FormField
                                                    control={form2.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormControl>
                                                                <Input disabled={!isPayableEditMode} className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder="Shipping Address" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <Phone size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-500 items-baseline">
                                                Phone
                                            </div>
                                            <div className="text-md font-normal">
                                                <div className='flex flex-row flex-1 gap-2 items-center'>
                                                    <FormField
                                                        control={form2.control}
                                                        name="std_code"
                                                        render={({ field }) => (
                                                            <FormItem >
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button variant={"ghost"} className={`flex flex-row gap-2 ${!isPayableEditMode ? `${disabledClasses} cursor-not-allowed pointer-events-none bg-gray-50 rounded-[8px] ` : ""}`}>
                                                                                {/* {
                                                                field.value ? creators.find((creator) => creator.value === field.value)?.label : "Select creator"
                                                            } */}
                                                                                {COUNTRY_CODE.find((val) => val.value === field.value)?.value || <span className='text-muted-foreground '> STD Code</span>}
                                                                                <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-[200px] p-0 ml-[114px]">
                                                                        <Command>
                                                                            <CommandInput className='w-full' placeholder="Search Country Code" />
                                                                            <CommandEmpty>Country code not found.</CommandEmpty>
                                                                            <CommandGroup>
                                                                                <div className='flex flex-col max-h-[200px] overflow-y-auto'>
                                                                                    {COUNTRY_CODE.map((cc) => (
                                                                                        <CommandItem
                                                                                            value={cc.label}
                                                                                            key={cc.label}
                                                                                            onSelect={() => {
                                                                                                console.log("std_code", cc.value)
                                                                                                form2.setValue("std_code", cc.value, SET_VALUE_CONFIG)
                                                                                                changeStdCode()

                                                                                            }}
                                                                                        >
                                                                                            <PopoverClose asChild>

                                                                                                <div className="flex flex-row items-center justify-between w-full">
                                                                                                    {cc.label}
                                                                                                    <Check
                                                                                                        className={cn(
                                                                                                            "mr-2 h-4 w-4 text-purple-600",
                                                                                                            field.value?.includes(cc.value)
                                                                                                                ? "opacity-100"
                                                                                                                : "opacity-0"
                                                                                                        )}
                                                                                                    />
                                                                                                </div>
                                                                                            </PopoverClose>
                                                                                        </CommandItem>
                                                                                    ))}
                                                                                </div>
                                                                            </CommandGroup>
                                                                        </Command>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form2.control}
                                                        name="phone"
                                                        render={({ field }) => (
                                                            <FormItem className='flex-1 '>
                                                                <FormControl>
                                                                    <Input type="text" disabled={!isPayableEditMode} className={`border-none ${commonClasses} ${commonFontClasses} ${disabledClasses} `} placeholder={`Phone No ${!isPhoneMandatory ? "(Optional)" : "(Mandatory)"}`} {...field}
                                                                        onKeyPress={handleKeyPress}
                                                                        onChange={event => {
                                                                            const std_code = form2.getValues("std_code")
                                                                            const is13Digits = std_code != "+91" && std_code != "-1"
                                                                            return handleOnChangeNumericReturnNull(event, field, false, isPhoneMandatory, is13Digits ? 13 : 10)
                                                                        }} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {isPayableEditMode &&
                                    <>
                                        <div className="h-[1px] bg-gray-300 ">
                                        </div>
                                        <div className="p-[20px]">
                                            <div className="flex flex-row gap-2 justify-end ">
                                                {/* <DialogClose asChild> */}
                                                {beforeCancelDialog(yesDiscard2)}
                                                <Button >Save</Button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </form>
                        </Form>

                    </div>}
                </div>
            </div >

        </>
    )
}

export default ServiceContract;