import { LeadInterface } from "@/components/custom/table/columns";

let data:LeadInterface[] = [
    {
        id: "728ed52f",
        budgetRange: "INR 1cr - 2cr",
        createdBy: "Varun Aggarwal",
        createdOn: "December 20, 2021",
        owner: "Varun Aggarwal",
        region: "India",
        source: "Linkedin",
        status: "Unverified",
        title: "Swiggy - IND - CTO"
    },
    {
        id: "932abde1",
        budgetRange: "USD 500k - 1M",
        createdBy: "Emily Johnson",
        createdOn: "January 5, 2022",
        owner: "John Smith",
        region: "USA",
        source: "Email Campaign",
        status: "Verified",
        title: "TechCorp - USA - CEO"
    },
    {
        id: "e9f4c25a",
        budgetRange: "EUR 2M - 3M",
        createdBy: "Sophia Lee",
        createdOn: "February 15, 2022",
        owner: "Sophia Lee",
        region: "Europe",
        source: "Hoarding",
        status: "Unverified",
        title: "GlobalTech - EUR - CFO"
    },
    {
        id: "3b1c9d86",
        budgetRange: "JPY 100M - 150M",
        createdBy: "Taro Yamada",
        createdOn: "March 8, 2022",
        owner: "Taro Yamada",
        region: "APAC",
        source: "Events",
        status: "Deferred",
        title: "SushiCo - JPN - Founder"
    },
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
