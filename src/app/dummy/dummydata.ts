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
        role: "CTO",
        contacts: [
            {
                contactName: "Candice Wu",
                designation: "HR Executive",
                contactType: "Gate Keeper",
                email:"candice@untitiledui.com",
                countryCode: "+91",
                phoneNo: "7002383842"
            },
            {
                contactName: "John Smith",
                designation: "Sales Manager",
                contactType: "Decision Maker",
                email: "john@example.com",
                countryCode: "+1",
                phoneNo: "5551234567"
            },
            {
                contactName: "Emma Johnson",
                designation: "Marketing Director",
                contactType: "Influencer",
                email: "emma@companyxyz.com",
                countryCode: "+44",
                phoneNo: "7894561230"
            },
        ]
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
        role: "CEO",
        contacts: [
            {
                contactName: "Carlos Rodriguez",
                designation: "Operations Manager",
                contactType: "Gate Keeper",
                email: "carlos@companyabc.com",
                countryCode: "+34",
                phoneNo: "612345678"
            },
        ]
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
        role: "CPTO",
        contacts: [
            {
                contactName: "Alice Johnson",
                designation: "Marketing Manager",
                contactType: "Gate Keeper",
                email: "alice@example.com",
                countryCode: "+1",
                phoneNo: "9876543210"
            },
            {
                contactName: "David Lee",
                designation: "CTO",
                contactType: "Decision Maker",
                email: "david@companyxyz.com",
                countryCode: "+44",
                phoneNo: "7418529630"
            },
            {
                contactName: "Maria Garcia",
                designation: "Finance Director",
                contactType: "Influencer",
                email: "maria@companyabc.com",
                countryCode: "+34",
                phoneNo: "635241789"
            },
        ]
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
        role: "Founder",
        contacts: [
            {
                contactName: "Alice Johnson",
                designation: "Marketing Manager",
                contactType: "Gate Keeper",
                email: "alice@example.com",
                countryCode: "+1",
                phoneNo: "9876543210"
            },
            {
                contactName: "David Lee",
                designation: "CTO",
                contactType: "Decision Maker",
                email: "david@companyxyz.com",
                countryCode: "+44",
                phoneNo: "7418529630"
            },
        ]
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
