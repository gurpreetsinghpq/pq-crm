import { commonClasses, commonFontClasses, commonFontClassesAddDialog, disabledClassesBorderNone, selectFormMessageClasses } from "@/app/constants/classes";
import { IconBilling, IconBriefcase, IconContacts, IconEdit, IconEmail, IconEmail2, IconExportToZoho, IconGst, IconMinus, IconPackage, IconPlus, IconShield, IconShipping } from "@/components/icons/svgIcons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarIcon, Check, ChevronDown, ChevronRight, Cross, CrossIcon, Loader2, Phone, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { areBillingAndShippingEqual, doesTypeIncludesMandatory, fetchAccountFromId, formatAddresses, getToken, handleKeyPress, handleOnChangeNumericReturnNull } from "../../commonFunctions";
import { ClientGetResponse, Contact, ContactsGetResponse, PatchOrganisation, ServiceContractGetResponse } from "@/app/interfaces/interface";
import { beforeCancelDialog } from "../../addLeadDetailedDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { COUNTRY_CODE, DESIGNATION, DOCUMENT_TYPE, SET_VALUE_CONFIG } from "@/app/constants/constants";
import { Command } from "cmdk";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { PopoverClose } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { labelToValue, valueToLabel } from "../../sideSheet";
import { toast, useToast } from "@/components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import DataTable from "../../table/datatable";
import { columnsServiceContacts } from "../../table/columns-service-contract";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const FormSchema = z.object({
    registeredName: z.string().min(1),
    gstinVatGstNo: z.string().min(1),
    billingCountry: z.string().min(1),
    billingL1: z.string().min(1),
    billingL2: z.string().min(1),
    billingCity: z.string().min(1),
    billingState: z.string().min(1),
    billingZip: z.string().min(1),
    shippingCountry: z.string().min(1),
    shippingL1: z.string().min(1),
    shippingL2: z.string().min(1),
    shippingCity: z.string().min(1),
    shippingState: z.string().min(1),
    shippingZip: z.string().min(1),
    sameAsBillingAddress: z.boolean().optional()
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

const FormSchema3 = z.object({
    document_type: z.string({}),
    event_date: z.date()
})

const form2Defaults = {
    name: "",
    email: "",
    phone: null,
    std_code: "+91"
}


function ServiceContract({ isDisabled = false, entityId, ids, title }: { isDisabled?: boolean, entityId: number, ids: { accountId: number }, title: string }) {

    const [contractDetailExpanded, setContractDetailExpanded] = useState<boolean>(false)

    const form = useForm<z.infer<typeof FormSchema>>({ mode: "all" })

    const [formSchema2, setFormSchema2] = useState<any>(FormSchema2)
    const [isPhoneMandatory, setIsPhoneMandatory] = useState<boolean>(false)
    const [accountData, setAccountData] = useState<ClientGetResponse>()
    const [contactData, setContactData] = useState<ContactsGetResponse>()
    const [isAccountEditMode, setAccountEditMode] = useState<boolean>(false)
    const [isPayableEditMode, setPayableEditMode] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<{ name: string | null, size: number | null }>({ name: null, size: null });
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [contractDraft, setContractDraft] = useState<ServiceContractGetResponse[]>([])
    const [contractDraftLoading, setContractDraftLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<FormData>()
    const [isDocumentLoading, setDocumentLoading] = useState<boolean>()
    const [open, setOpen] = useState<boolean>(false)
    const [isESignUploading, setESignUploading] = useState<boolean>(false)
    const [isBillingExplanded, setBillingExpanded] = useState<boolean>(true)
    const [isShippingExplanded, setShippingExpanded] = useState<boolean>(false)
    const [payableAccountId, setPayableAccountId] = useState<number | null>()
    const [isSameAsBillingAddress, setSameAsBillingAddress] = useState<boolean>(false)
    const [areAccountDetailsValid, setAccountDetailsValid] = useState<boolean>(false)
    const [areAccountPayableDetailsValid, setAccountPayableDetailsValid] = useState<boolean>(false)

    const form2 = useForm<z.infer<typeof formSchema2>>({
        resolver: zodResolver(formSchema2),
        defaultValues: form2Defaults,
    })
    const form3 = useForm<z.infer<typeof FormSchema3>>({ defaultValues: { document_type: "Draft Contract" }, mode: "all" })
    const { toast } = useToast()
    const watcher2 = form2.watch()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token_superuser = getToken()

    async function sendESign(id: number) {
        setESignUploading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/contract/${id}/docu_esign/`, { method: "POST", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            if (result.status == "1") {
                let data = structuredClone(result.data)
                toast({
                    title: "E-Sign Successful!",
                    variant: "dark"
                })
                getServiceContractsDataTable()
            } else {
                toast({
                    title: `Sorry some error have occured: ${result.message}`,
                    variant: "destructive"
                })
            }
            setESignUploading(false)
        }
        catch (err) {
            console.log("error", err)
            setESignUploading(false)
            toast({
                title: "Sorry some error have occured!",
                variant: "destructive"
            })
        }
    }

    async function viewDocument(id: number) {
        setDocumentLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/contract/${id}/docu_view_document/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.blob()
            const url = URL.createObjectURL(result);
            window.open(url)
            setDocumentLoading(false)
        }
        catch (err) {
            setDocumentLoading(false)
            console.log("error", err)
        }
    }

    async function getAccountDetails() {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/${ids.accountId}/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            let data: ClientGetResponse = structuredClone(result.data)
            setAccountData(data)
            form.reset({
                billingL1: data.billing_address || "",
                billingL2: data.billing_address_l2 || "",
                billingCity: data.billing_city || "",
                billingCountry: data.billing_country || "",
                billingState: data.billing_state || "",
                billingZip: data.billing_zipcode || "",
                shippingL1: data.shipping_address || "",
                shippingL2: data.shipping_address_l2 || "",
                shippingCity: data.shipping_city || "",
                shippingCountry: data.shipping_country || "",
                shippingState: data.shipping_state || "",
                shippingZip: data.shipping_zipcode || "",
                gstinVatGstNo: data.govt_id || "",
                registeredName: data.registered_name || ""
            })

            const contactId = data.contacts.find((val) => val.type === "Accounts Payable")?.id || null

            const addressesAreEqual = areBillingAndShippingEqual(data);

            console.log("isequal", addressesAreEqual)
            form.setValue("sameAsBillingAddress", addressesAreEqual ? true : undefined)
            setPayableAccountId(contactId)

        }
        catch (err) {
            console.log("error", err)
        }

    }
    async function getServiceContractsDataTable() {
        setContractDraftLoading(true)
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/contract/?deal=${entityId}`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()
            setContractDraftLoading(false)
            if (result.status == "1") {
                let data = structuredClone(result)
                let dataToSave: ServiceContractGetResponse[] = data.data
                console.log(dataToSave)
                let sortedData = dataToSave.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
                setContractDraft(sortedData)
            } else {
                toast({
                    title: "Sorry some error have occured!",
                    variant: "destructive"
                })
            }

        }
        catch (err) {
            console.log("error", err)
            setContractDraftLoading(false)
            toast({
                title: "Sorry some error have occured!",
                variant: "destructive"
            })
        }

    }

    async function getContactDetails() {
        if (payableAccountId) {
            try {
                const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/${payableAccountId}/`, { method: "GET", headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
                const result = await dataResp.json()
                let data: ContactsGetResponse = structuredClone(result.data)
                setContactData(data)
                // form2.setValue("std_code", data.std_code)
                // form2.setValue("phone", data.phone)
                // form2.setValue("email", data.email)
                // form2.setValue("name", data.name)
                // form2.setValue("designation", labelToValue(data.designation, DESIGNATION))
                form2.reset({
                    "name": data.name || "",
                    "email": data.email || "",
                    "phone": data.phone || "",
                    "std_code": data.std_code || undefined,
                    "designation": labelToValue(data.designation, DESIGNATION)
                })

            }
            catch (err) {
                console.log("error", err)
            }
        }

    }
    useEffect(() => {
        getAccountDetails()
        changeStdCode()
        getServiceContractsDataTable()

    }, [])

    useEffect(() => {

        if (payableAccountId) {
            getContactDetails()
        }
    }, [payableAccountId])
    function changeStdCode() {
        const value = form2.getValues("std_code")
        let updatedSchema

        if (value != "+91" && value != "+1") {
            updatedSchema = FormSchema.extend({
                phone: z.string().min(4).max(13).optional().nullable()
            })
        } else {

            updatedSchema = FormSchema
        }
        setFormSchema2(updatedSchema)

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
                let maxVersion = 0;
                contractDraft.map((pdf) => {
                    const name = pdf.file_name
                    if (name) {
                        const match = name.match(/V(\d+)/);
                        if (match) {
                            const version = parseInt(match[1], 10);
                            maxVersion = Math.max(maxVersion, version);
                        }
                    }
                })
                const newVersion = maxVersion + 1;
                const newTitle = `${title.replace(/\s/g, '')}_Contract_V${newVersion}.pdf`


                const formDataLocal = new FormData()
                setSelectedFile({ name: newTitle, size: selectedFile.size });
                formDataLocal.append('file', selectedFile, newTitle)
                formDataLocal.append('deal', entityId.toString())
                const document_type = form3.getValues("document_type")
                formDataLocal.append('document_type', document_type)
                if (document_type === "Signed Contract") {
                    const date_iso = form3.getValues("event_date").toISOString()
                    formDataLocal.append('event_date', date_iso)
                    console.log("event_date", date_iso)
                }
                setFormData(formDataLocal)
            } else {
                alert('Please select a PDF file.');
                setIsUploading(false)
            }

        }
    };


    useEffect(() => {


    }, [formData])

    async function uploadFile() {
        setIsUploading(true)

        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/contract/`, { method: "POST", body: formData, headers: { "Authorization": `Token ${token_superuser}` } })
            const result = await dataResp.json()
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            if (result.status == "1") {
                toast({
                    title: "File uploaded Succesfully!",
                    variant: "dark"
                })
                getServiceContractsDataTable()
                setOpen(false)
                setSelectedFile({ name: "", size: null })
                setFormData(undefined)

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
    }

    function saveAccountDetails() {
        const formData = form.getValues()

        const dataToSend: Partial<PatchOrganisation> = {
            billing_address: formData.billingL1,
            billing_address_l2: formData.billingL2,
            billing_country: formData.billingCountry,
            billing_city: formData.billingCity,
            billing_state: formData.billingState,
            billing_zipcode: formData.billingZip,
            shipping_address: formData.shippingL1,
            shipping_address_l2: formData.shippingL2,
            shipping_country: formData.shippingCountry,
            shipping_city: formData.shippingCity,
            shipping_state: formData.shippingState,
            shipping_zipcode: formData.shippingZip,
            registered_name: formData.registeredName,
            govt_id: formData.gstinVatGstNo

        }
        patchOrgData(ids.accountId, dataToSend)
    }

    function saveContactDetails() {
        const formData2 = form2.getValues()

        const dataToSend: Partial<Contact> = {
            name: formData2.name,
            designation: valueToLabel(formData2.designation, DESIGNATION),
            email: formData2.email,
            phone: formData2.phone,
            std_code: formData2.std_code,
            type: "Accounts Payable"
        }

        if (payableAccountId) {
            patchContactData(payableAccountId, dataToSend)
        } else {
            dataToSend["organisation"] = ids.accountId
            patchContactData(null, dataToSend)
        }
    }

    async function patchOrgData(orgId: number, orgData: Partial<PatchOrganisation>) {
        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/${orgId}/`, { method: "PATCH", body: JSON.stringify(orgData), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()

            if (result.status == "1") {
                toast({
                    title: "Account details upadted!",
                    variant: "dark"
                })
                getAccountDetails()
            } else {
                toast({
                    title: "Something went wrong, Please try again later!",
                    variant: "destructive"
                })
            }
        }
        catch (err) {
            console.log("error", err)
            toast({
                title: "Something went wrong, Please try again later!",
                variant: "destructive"
            })
        }
    }

    async function patchContactData(id: number | null, contactData: Partial<Contact>) {

        try {
            const dataResp = await fetch(`${baseUrl}/v1/api/client/contact/${id ? id : ''}/`, { method: `${!id ? "POST" : "PATCH"}`, body: JSON.stringify(contactData), headers: { "Authorization": `Token ${token_superuser}`, "Accept": "application/json", "Content-Type": "application/json" } })
            const result = await dataResp.json()

            if (result.status == "1") {
                toast({
                    title: `Contact details ${!id ? "Added" : "Upadted"}!`,
                    variant: "dark"
                })
                getContactDetails()
                getAccountDetails()
            } else {
                toast({
                    title: "Something went wrong, Please try again later!",
                    variant: "destructive"
                })
            }
        }
        catch (err) {
            console.log("error", err)
            toast({
                title: "Something went wrong, Please try again later!",
                variant: "destructive"
            })
        }
    }

    useEffect(() => {

    }, [contractDraft])

    const watcher = form.watch()
    useEffect(() => {

        if (watcher.sameAsBillingAddress == true) {
            form.setValue("shippingCity", watcher.billingCity || "")
            form.setValue("shippingCountry", watcher.billingCountry || "")
            form.setValue("shippingL1", watcher.billingL1 || "")
            form.setValue("shippingL2", watcher.billingL2 || "")
            form.setValue("shippingState", watcher.billingState || "")
            form.setValue("shippingZip", watcher.billingZip || "")
        } else if (watcher.sameAsBillingAddress == false) {
            form.setValue("shippingCity", "")
            form.setValue("shippingCountry", "")
            form.setValue("shippingL1", "")
            form.setValue("shippingL2", "")
            form.setValue("shippingState", "")
            form.setValue("shippingZip", "")
        }
    }, [watcher.sameAsBillingAddress, watcher.billingCity, watcher.billingCountry, watcher.billingL1, watcher.billingL2, watcher.billingState, watcher.billingZip, watcher.billingCountry])
    useEffect(() => {
        const result = FormSchema.safeParse(form.getValues())
        setAccountDetailsValid(result.success)
    }, [watcher])
    useEffect(() => {
        // console.log(form2.getValues())
        form2.formState.isValid

    }, [watcher2])

    return (
        <>
            <div className="flex flex-col items-start gap-4 flex-1 self-stretch">
                <div className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex p-1 sm:p-4 justify-between items-center self-stretch rounded-md shadow-md">
                        <div className="flex flex-row gap-[10px]">
                            <h2 className="text-gray-700 font-inter font-semibold text-base leading-6">Service Contract Status Tracking</h2>

                            <Image width={20} height={20} alt="Refresh" src={"/images/refresh.svg"} className="cursor-pointer" onClick={() => getServiceContractsDataTable()} />
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" variant="default" className="gap-2">
                                    <Image src="/images/upload.svg" alt="upload image" height={20} width={20} />
                                    <div className="text-white font-inter text-base font-semibold leading-6">
                                        Upload Document
                                    </div>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="py-[30px] px-[24px]" onPointerDownOutside={(e) => e.preventDefault()} onKeyDown={(e) => {
                                if (e.key === "Escape") {

                                }
                            }}>
                                <DialogHeader>
                                    <DialogTitle className="  pb-[10px]">
                                        <div className="text-lg">Upload and attach file</div>
                                        <div className="text-gray-600 text-sm mt-[5px] font-normal w-[450px]">
                                            Upload and attach file to this project.
                                        </div>
                                    </DialogTitle>
                                </DialogHeader>
                                <Form {...form3}>
                                    <form className="flex flex-col">
                                        <div className="text-sm font-medium text-gray-700">
                                            Document Type
                                        </div>
                                        <div className='flex flex-col mt-3 w-full'>
                                            <FormField
                                                control={form3.control}
                                                name="document_type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={(value) => {
                                                            return field.onChange(value)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={`${commonFontClassesAddDialog} ${commonClasses}`}>
                                                                    <SelectValue placeholder="Select Region" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent >
                                                                {
                                                                    DOCUMENT_TYPE.map((documentType, index) => {
                                                                        return <SelectItem key={index} value={documentType.value} >
                                                                            <div className="text-gray-900 text-md font-medium">
                                                                                {documentType.label}
                                                                            </div>
                                                                        </SelectItem>
                                                                    })
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {form3.getValues("document_type") === "Signed Contract" && <>
                                            <div className="text-sm mt-[16px] font-medium text-gray-700">
                                                Signed Date
                                            </div>
                                            <div className='flex flex-col mt-3 w-full'>
                                                <FormField
                                                    control={form3.control}
                                                    name="event_date"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"google"}
                                                                            className="text-md px-[13px]"
                                                                        >
                                                                            {field.value ? (
                                                                                format(field.value, "PPP")
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-full p-0" align="center">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) =>
                                                                            date > new Date() || date < new Date("1900-01-01")
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </>}

                                    </form>
                                </Form>
                                <div id="file-upload-div" onClick={handleDivClick} className="cursor-pointer my-[20px] rounded-[12px] border-[2px] border-purple-600 flex flex-col items-center px-[24px] py-[16px] gap-[10px]">
                                    {formData === undefined ?
                                        <>
                                            <div className='rounded-[8px] p-[10px] border border-[1px] border-gray-200'>
                                                <AlertCircle color="black" />
                                            </div>
                                            <div className="flex flex-col gap-[5px] items-center">
                                                <div>
                                                    <span className="text-purple-700 font-semibold text-sm">Click to upload</span>
                                                </div>
                                                <span className="text-xs font-normal">PDF only</span>
                                            </div>
                                        </>
                                        : <div className="flex flex-col">
                                            {/* {formData.get("file")} */}
                                            <div className="flex flex-row items-center gap-[10px]">
                                                <img src="/images/pdf-icon.png" />
                                                {selectedFile.name}
                                            </div>
                                        </div>}

                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                />
                                {/* application/msword */}
                                <div className="flex flex-row gap-[10px] justify-center">
                                    <DialogClose asChild>
                                        <Button type="button" variant={"google"} className="flex-1" onClick={() => {
                                            setFormData(undefined)
                                            setSelectedFile({ name: "", size: null })
                                        }}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="button" className="flex-1" disabled={formData === undefined} onClick={() => uploadFile()}>Attach File</Button>

                                </div>

                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                {contractDraft.length > 0 ? <div className="flex flex-row w-full min-h-[200px]">
                    <DataTable columns={columnsServiceContacts(sendESign, viewDocument)} data={contractDraft} filterObj={{}} page="serviceContracts" setChildDataHandler={() => { }} setIsMultiSelectOn={() => { }} setTableLeadRow={() => { }} manualPageSize={contractDraft.length} />
                </div>
                    : <div className="flex justify-center items-center self-stretch">
                        <div className="flex flex-col items-center gap-6">
                            <Image src="/images/no-contract.svg" alt="no contract" height={152} width={118} />
                            <p className="text-gray-900 text-center font-inter text-base font-medium leading-5">
                                No Contract Draft
                            </p>
                        </div>
                    </div>}
                <Separator />
                <div className="flex flex-col w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-row gap-[5px] items-center cursor-pointer" onClick={() => setContractDetailExpanded(prev => !prev)}>
                            {contractDetailExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            <div className="text-md font-semibold">
                                Contract Details
                            </div>
                        </div>
                        <Button disabled type="button" variant="default" className="gap-2">
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
                                    <div className="flex flex-row gap-[10px]">
                                        <div className="text-sm font-bold">Account Details</div>
                                    </div>
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
                                            <div className="text-xs font-bold text-gray-600 items-baseline">
                                                Registered Name
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="registeredName"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormControl>
                                                            <Input disabled={!isAccountEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Registered Name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <IconGst size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="text-xs font-bold text-gray-600 items-baseline">
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
                                                                    <Input disabled={!isAccountEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="GSTIN/VAT/GST Number" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <IconBilling size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            {isAccountEditMode ? <div className="flex flex-row items-center gap-[10px] cursor-pointer" onClick={() => setBillingExpanded(prev => !prev)}>
                                                <div className="text-xs font-bold text-gray-600 items-baseline">
                                                    Billing Address
                                                </div>
                                                <div className="h-[2px] bg-gray-200 flex-1 w-full">
                                                </div>
                                                <div>
                                                    {isBillingExplanded ? <IconMinus /> : <IconPlus />}
                                                </div>
                                            </div> :
                                                <div className="flex flex-col gap-[10px]">
                                                    <div className="text-xs font-bold text-gray-600 items-baseline">
                                                        Billing Address
                                                    </div>
                                                    <div className={`${commonClasses} ${commonFontClasses} px-[14px]`}>{accountData ? formatAddresses(accountData).billing : "—"} </div>
                                                </div>
                                            }
                                            {(isAccountEditMode && isBillingExplanded) &&
                                                <div className="flex flex-col gap-[16px] mt-[10px]">
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">Country / Region</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="billingCountry"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={!isAccountEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Country / Region" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">Address line 1</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="billingL1"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={!isAccountEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Address line 1" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">Address line 2</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="billingL2"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={!isAccountEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Address line 2" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">City</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="billingCity"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={!isAccountEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="City" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">State</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="billingState"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={!isAccountEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="State" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">Zip Code</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="billingZip"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={!isAccountEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Zip Code" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-[8px]">
                                        <IconPackage size="20" color="#98A2B3" />
                                        <div className="flex flex-col gap-[5px] w-full">
                                            {isAccountEditMode ? <div className="flex flex-row items-center gap-[10px] cursor-pointer" onClick={() => setShippingExpanded(prev => !prev)}>
                                                <div className="text-xs font-bold text-gray-600 items-baseline">
                                                    Shipping Address
                                                </div>
                                                <div className="h-[2px] bg-gray-200 flex-1 w-full">
                                                </div>
                                                <div>
                                                    {isShippingExplanded ? <IconMinus /> : <IconPlus />}
                                                </div>
                                            </div> : <div className="flex flex-col gap-[10px]">
                                                <div className="text-xs font-bold text-gray-600 items-baseline">
                                                    Shipping Address
                                                </div>
                                                <div className={`${commonClasses} ${commonFontClasses} px-[14px]`}>{accountData ? formatAddresses(accountData).shipping : "—"} </div>
                                            </div>}
                                            {(isAccountEditMode && isShippingExplanded) &&
                                                <div className="flex flex-col gap-[16px] ">
                                                    <div className='flex flex-row  gap-[8px]'>
                                                        <FormField
                                                            control={form.control}
                                                            name="sameAsBillingAddress"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-center gap-[8px]">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value}
                                                                            onCheckedChange={(val) => {
                                                                                setSameAsBillingAddress(val === "indeterminate" ? false : val)
                                                                                field.onChange(val)
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel >
                                                                        <div className="text-sm mb-[6px] font-medium text-gray-700 ">
                                                                            Same as Billing Address
                                                                        </div>
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">Country / Region</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="shippingCountry"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={(!isAccountEditMode) || isSameAsBillingAddress} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Country / Region" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">Address line 1</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="shippingL1"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={(!isAccountEditMode) || isSameAsBillingAddress} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Address line 1" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">Address line 2</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="shippingL2"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={(!isAccountEditMode) || isSameAsBillingAddress} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Address line 2" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">City</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="shippingCity"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={(!isAccountEditMode) || isSameAsBillingAddress} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="City" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">State</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="shippingState"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={(!isAccountEditMode) || isSameAsBillingAddress} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="State" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-[4px]">
                                                        <div className="text-xs font-bold text-gray-500">Zip Code</div>
                                                        <div className="text-md font-normal ">
                                                            <FormField
                                                                control={form.control}
                                                                name="shippingZip"
                                                                render={({ field }) => (
                                                                    <FormItem className='w-full'>
                                                                        <FormControl>
                                                                            <Input disabled={(!isAccountEditMode) || isSameAsBillingAddress} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Zip Code" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            }
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
                                                <Button type="button" disabled={!areAccountDetailsValid} onClick={() => saveAccountDetails()}>Save</Button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </form>
                        </Form>
                        <Form {...form2}>
                            <form className="flex flex-col flex-1 rounded-[5px] bg-white-900 sticky top-0 h-fit">
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
                                            <div className="text-xs font-bold text-gray-600 items-baseline">
                                                Name
                                            </div>
                                            <FormField
                                                control={form2.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormControl>
                                                            <Input disabled={!isPayableEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder=" Name" {...field} />
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
                                            <div className="text-xs font-bold text-gray-600 items-baseline">
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
                                                                    <div className={`border border-[1px] border-gray-300 flex flex-row gap-[10px] py-[10px] items-center ${!isPayableEditMode ? `border-none pointer-events-none cursor-not-allowed ` : "rounded-[8px]"}`}>
                                                                        <div className="flex  flex-row gap-2 w-full px-[14px] ">
                                                                            <div className={`w-full  flex-1 text-align-left text-md flex  ${commonClasses} ${commonFontClasses} `}>
                                                                                {DESIGNATION.find((val) => val.value === field.value)?.label || <span className={!isPayableEditMode ? ` ${disabledClassesBorderNone} text-gray-400` : "text-muted-foreground"}>Designation</span>}
                                                                            </div>
                                                                            {isPayableEditMode && <ChevronDown className="h-4 w-4 opacity-50" color="#344054" />}
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
                                            <div className="text-xs font-bold text-gray-600 items-baseline">
                                                Email
                                            </div>
                                            <div className="text-md font-normal">
                                                <FormField
                                                    control={form2.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormControl>
                                                                <Input disabled={!isPayableEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder="Email" {...field} />
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
                                            <div className="text-xs font-bold text-gray-600 items-baseline">
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
                                                                            <Button type="button" variant={`${isPayableEditMode ? "google" : "ghost"}`} className={`flex flex-row gap-2 ${!isPayableEditMode ? `border-none cursor-not-allowed pointer-events-none ` : "rounded-[8px]"}`}>
                                                                                {COUNTRY_CODE.find((val) => val.value === field.value)?.value || <span className='text-muted-foreground '> STD Code</span>}
                                                                                {isPayableEditMode && <Image width={20} height={20} alt="Refresh" src={"/images/chevron-down.svg"} />}
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
                                                                    <Input type="text" disabled={!isPayableEditMode} className={` ${commonClasses} ${commonFontClasses} ${disabledClassesBorderNone} `} placeholder={`Phone No (Mandatory)`} {...field}
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
                                                <Button type="button" onClick={() => saveContactDetails()}>Save</Button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </form>
                        </Form>

                    </div>}
                </div>
                {/* <Dialog open={open} onOpenChange={setOpen}>
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
                                <div className="text-lg">Get e-Signature</div>
                                <div className="text-gray-600 text-sm mt-[5px] font-bold w-[450px]">
                                    {selectedFile.name}
                                </div>
                                <div className="text-gray-600 text-sm mt-[5px] font-normal">
                                    {selectedFile.name}
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-row gap-[10px] justify-center">
                            <DialogClose asChild>
                                <Button variant={"google"} className="flex-1" onClick={() => {
                                    setFormData(undefined)
                                    setSelectedFile({ name: "", size: null })
                                }}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button className="flex-1" disabled={formData === undefined} onClick={() => uploadFile()}>Open in DocuSign</Button>

                        </div>

                    </DialogContent>
                </Dialog> */}
            </div >
            {(isUploading || isDocumentLoading || isESignUploading || contractDraftLoading) && <div className='absolute top-0 left-0 w-full h-full flex flex-row justify-center items-center'>
                <Loader2 className="mr-2 h-20 w-20 animate-spin" color='#7F56D9' />
            </div>}

        </>
    )
}

export default ServiceContract;