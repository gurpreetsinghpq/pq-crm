import React from 'react'
import CustomStepper from '../custom-stepper'
import { SIDESHEET_TAB_TYPE, STEPPER_STATUS } from '@/app/constants/constants'
import { Stepper } from '@/app/interfaces/interface'

function Todo() {

    function generateRandomStepper(): Stepper {
        return {
            title: Math.random().toString(36).substring(7),
            contacts: ["Abhinav","Raj","Gurpreet", "Suganth", "Anmol"],
            email: Math.random().toString(36).substring(7) + "@example.com",
            date: new Date().toDateString(),
            roleStatus: Math.random() > 0.5 ? "Active" : "Inactive",
            roleUrgency: Math.random() > 0.5 ? "High" : "Low",
            openToRetainerModel: Math.random() > 0.5 ? "Yes" : "No",
            openToMinServiceFeeOrFlatFee: Math.random() > 0.5 ? "Yes" : "No",
            collateralShared: Math.random() > 0.5 ? "Yes" : "No",
            createdBy: Math.random().toString(36).substring(7),
            status:  Math.random() > 0.5 ? "In Progress" : "Over Due",
            assignedTo: Math.random().toString(36).substring(7),
            createdAt: new Date().toDateString(),
            type: Math.random() > 0.5 ? SIDESHEET_TAB_TYPE.ACTIVITY : SIDESHEET_TAB_TYPE.NOTES,

        };
    }
    const randomDetails: Stepper[] = []
    for (let i = 0; i < 2; i++) {
        randomDetails.push(generateRandomStepper());
    }

    return (
        <div>
            {
                randomDetails.map((val, index) => {
                    return <div className='custom-stepper'>
                        <CustomStepper details={{...val, isLastChild: index === randomDetails.length-1 ?true:false}} />
                    </div>
                })
            }
        </div>
    )
}

export default Todo