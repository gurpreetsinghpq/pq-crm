import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function ServiceContract({ isDisabled = false, entityId }: { isDisabled?: boolean, entityId: number }) {

    return (
        <>
            <div className="flex flex-col items-start gap-4 flex-1 self-stretch">
                <div className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex p-1 sm:p-4 justify-between items-center self-stretch rounded-md shadow-md">
                        <h2 className="text-gray-700 font-inter font-semibold text-base leading-6">Service Contract Status Tracking</h2>
                        <Button variant="default" className="gap-2">
                            <Image src="/images/upload.svg" alt="upload image" height={20} width={20} />
                            <div className="text-white font-inter text-base font-semibold leading-6">
                                Upload Contract Draft
                            </div>
                        </Button>
                    </div>
                </div>
                <Dialog>

                </Dialog>
                <div className="flex justify-center items-center self-stretch">
                    <div className="flex flex-col items-center gap-6">
                        <Image src="/images/no-contract.svg" alt="no contract" height={152} width={118} />
                        <p className="text-gray-900 text-center font-inter text-base font-medium leading-5">
                            No Contract Draft
                        </p>
                    </div>
                </div>
                <Separator className='mt-10' />
            </div>

        </>
    )
}

export default ServiceContract;