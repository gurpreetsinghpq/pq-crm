import { Deferred, Junk, Lost, Unverified, Verified } from "../../components/icons/svgIcons"
import { IValueLabel } from "../interfaces/interface"
const REGION = [
    {
        value: "mena",
        label: "MENA",
    },
    {
        value: "apac",
        label: "APAC",
    },
    {
        value: "us",
        label: "US",
    },
    {
        value: "europe",
        label: "Europe",
    },
    {
        value: "india",
        label: "India",
    },
]

const ROLETYPE = [
    {
        value: "Founder",
        label: "Founder"

    },
    {
        value: "cto",
        label: "CTO",
    },
    {
        value: "cpto",
        label: "CPTO",
    },
    {
        value: "headOfEngineering",
        label: "Head of Engineering",
    },
    {
        value: "svp_vp_avpOfEngineering",
        label: "SVP / VP / AVP of Engineering",
    },
    {
        value: "srDirector_directorOfEngineering",
        label: "Sr. Director / Director of Engineering",
    },
    {
        value: "siteLead",
        label: "Site Lead",
    },
    {
        value: "headOfAi_DataScience",
        label: "Head of AI / Data Science",
    },
]
const BUDGET_RANGE = [
    {
        value: "uptoInr1cr",
        label: "Upto INR 1Cr",
    },
    {
        value: "inr1CrTo2Cr",
        label: "INR 1Cr to 2 Cr",
    },
    {
        value: "inr2CrTo3Cr",
        label: "INR 2 Cr to 3Cr",
    },
    {
        value: "aboveInr3Cr",
        label: "Above INR 3 Cr",
    },

]

const DESIGNATION = [
    {
        value: "founder",
        label: "Founder",
    },
    {
        value: "CoFounder",
        label: "Co-Founder",
    },
    {
        value: "ceo",
        label: "CEO",
    },
    {
        value: "coo",
        label: "COO",
    },
    {
        value: "siteHead",
        label: "Site Head",
    },
]

const TYPE = [
    {
        value: "influencer",
        label: "Influencer",
    },
    {
        value: "decisionMaker",
        label: "Decision Maker",
    },
    {
        value: "gatekeeper",
        label: "Gatekeeper",
    },
    {
        value: "investor",
        label: "Investor",
    },
    {
        value: "legal",
        label: "Legal",
    },
]

const LEAD_SOURCE = [
    {
        value: "emailCampaign",
        label: "Email Campaign"
    },
    {
        value: "referral",
        label: "Referral"
    },
    {
        value: "events",
        label: "Events"
    },
    {
        value: "linkedin",
        label: "LinkedIn"
    },
    {
        value: "youtube",
        label: "Youtube"
    }
]

const OWNERS:IValueLabel[] = [
    {
        value: "allOwners",
        label: "All Owners",
        isDefault: true
    },
    {
        value: "ashokKumar",
        label: "Ashok Kumar"
    },
    {
        value: "varunAggarwal",
        label: "Varun Aggarwal"
    },
    {
        value: "rupeshYadav",
        label: "Rupesh Yadav"
    },
    {
        value: "sonuKumar",
        label: "Sonu Kumar"
    },
    {
        value: "rupangkanKalita",
        label: "Rupangkan Kalita"
    },
]

const CREATORS:IValueLabel[] = [
    {
        value: "allCreators",
        label: "All Creators"
    },
    {
        value: "ashokKumar",
        label: "Ashok Kumar"
    },
    {
        value: "varunAggarwal",
        label: "Varun Aggarwal"
    },
    {
        value: "rupeshYadav",
        label: "Rupesh Yadav"
    },
    {
        value: "sonuKumar",
        label: "Sonu Kumar"
    },
    {
        value: "rupangkanKalita",
        label: "Rupangkan Kalita"
    },
]

const STATUSES:IValueLabel[] = [
    {
        value: "allStatuses",
        label: "All Statuses",
        isDefault : true
    },
    {
        value: "unverified",
        label: "Unverified",
        icon: Unverified,
        class: "border-gray-600 bg-gray-50 text-gray-700"
    },
    {
        value: "verified",
        label: "Verified",
        icon: Verified,
        class: "border-success-600 bg-success-50 text-success-600"
    },
    {
        value: "deferred",
        label: "Deferred",
        icon: Deferred,
        class: "border-warning-600 bg-warning-50 text-warning-500"
    },
    {
        value: "lost",
        label: "Lost",
        icon: Lost,
        class: "border-error-600 bg-error-50 text-error-700"
    },
    {
        value: "junk",
        label: "Junk",
        icon: Junk,
        class: "border-yellow-700 bg-yellow-25 text-yelow-800"
    },
]

const SOURCES:IValueLabel[] = [
    {
        value: "allSources",
        label: "All Sources",
        isDefault: true
    },
    {
        value: "emailCampaign",
        label: "Email Campaign"
    },
    {
        value: "referral",
        label: "Referral"
    },
    {
        value: "hoarding",
        label: "Hoarding"
    },
    {
        value: "events",
        label: "Events"
    },
    {
        value: "linkedin",
        label: "Linkedin"
    },

]

const REGIONS:IValueLabel[] = [
    {
        value: "allRegions",
        label: "All Regions",
        isDefault : true
    },
    {
        value: "india",
        label: "India"
    },
    {
        value: "usa",
        label: "USA"
    },
    {
        value: "europe",
        label: "Europe"
    },
    {
        value: "apac",
        label: "APAC"
    },
]

const COUNTRY_CODE = [
    {
        value: "+91",
        label: "IND +91"
    },
    {
        value: "+1",
        label: "USA +1"
    },
    {
        value: "+44",
        label: "UK +44"
    },
    {
        value: "+33",
        label: "FRA +33"
    },
    {
        value: "+81",
        label: "JPN +81"
    },
    {
        value: "+86",
        label: "CHN +86"
    },
    {
        value: "+7",
        label: "RUS +7"
    },

    {
        value: "+61",
        label: "AUS +61"
    },
    {
        value: "+20",
        label: "EGY +20"
    },
    {
        value: "+234",
        label: "NGA +234"
    },
    {
        value: "+27",
        label: "ZAF +27"
    },
    {
        value: "+82",
        label: "KOR +82"
    },
    {
        value: "+972",
        label: "ISR +972"
    },
    {
        value: "+49",
        label: "AUT +49"
    },
    {
        value: "+357",
        label: "CYP +357"
    },
    {
        value: "+55",
        label: "CHL +55"
    },
    {
        value: "+57",
        label: "COL +57"
    },
    {
        value: "+45",
        label: "DNK +45"
    },
    // Add more entries as needed
];


export { ROLETYPE, REGION, DESIGNATION, BUDGET_RANGE, TYPE, LEAD_SOURCE, OWNERS, CREATORS, STATUSES, SOURCES, REGIONS, COUNTRY_CODE }