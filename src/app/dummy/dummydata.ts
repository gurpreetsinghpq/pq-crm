import { LeadInterface } from "@/components/custom/table/columns";

let data:LeadInterface[] = [
    {
        id: "728ed52f",
        budgetRange: "INR 1Cr - 2Cr",
        createdBy: "Varun Aggarwal",
        createdOn: "2023-08-24T03:00:00Z",
        owner: "Varun Aggarwal",
        region: "India",
        source: "Linkedin",
        status: "Unverified",
        title: "Swiggy - IND - CTO",
        role: "CTO"
    },
    {
        id: "932abde1",
        budgetRange: "Upto INR 1Cr",
        createdBy: "Ashok Kumar",
        createdOn: "2023-08-20T12:13:00Z",
        owner: "Rupesh Yadav",
        region: "USA",
        source: "Email Campaign",
        status: "Verified",
        title: "TechCorp - USA - CPTO",
        role: "CEO"
    },
    {
        id: "e9f4c25a",
        budgetRange: "INR 2 Cr to 3Cr",
        createdBy: "Rupesh Yadav",
        createdOn: "2023-08-26T10:45:00Z",
        owner: "Rupesh Yadav",
        region: "Europe",
        source: "Hoarding",
        status: "Unverified",
        title: "GlobalTech - EUR - CFO",
        role: "CPTO"
    },
    {
        id: "3b1c9d86",
        budgetRange: "Above INR 3 Cr",
        createdBy: "Sonu Kumar",
        createdOn: "2023-08-25T03:00:00Z",
        owner: "Sonu Kumar",
        region: "APAC",
        source: "Events",
        status: "Deferred",
        title: "SushiCo - JPN - Founder",
        role: "Founder"
    }
]

export function getData(): Promise<LeadInterface[]> {
    return new Promise<LeadInterface[]>((resolve, reject)=>{
        setTimeout(()=>{
            resolve(data)
        },Math.floor(Math.random()*3000))
        // setTimeout(()=>{
        //     reject(data)
        // },Math.floor(Math.random()*3000))

    })
}

export function setData(obj:LeadInterface): void {
    data = [...data, obj]
}
