import { Deferred, Junk, Lost, Unverified, Verified } from "../../components/icons/svgIcons"
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

const OWNERS = [
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

const CREATORS = [
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

const STATUSES = [
    {
        value: "allStatuses",
        label: "All Statuses",
    },
    {
        value: "unverified",
        label: "Unverified",
        icon: Unverified
    },
    {
        value: "verified",
        label: "Verified",
        icon: Verified
    },
    {
        value: "deferred",
        label: "Deferred",
        icon: Deferred
    },
    {
        value: "lost",
        label: "Lost",
        icon: Lost
    },
    {
        value: "junk",
        label: "Junk",
        icon: Junk
    },
]

const SOURCES = [
    {
        value: "allSources",
        label: "All Sources"
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

const REGIONS = [
    {
        value: "allRegions",
        label: "All Regions"
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

export { ROLETYPE, REGION, DESIGNATION, BUDGET_RANGE, TYPE, LEAD_SOURCE, OWNERS, CREATORS, STATUSES, SOURCES, REGIONS }