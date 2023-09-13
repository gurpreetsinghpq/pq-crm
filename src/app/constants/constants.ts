import { Deferred, Junk, Lost, Unverified, Verified } from "../../components/icons/svgIcons"
import { IValueLabel } from "../interfaces/interface"
import { GODFATHER_CLASS, GodfatherIcon, HUSTLER_CLASS, HustlerIcon, ROCKSTAR_CLASS, RockstarIcon, SEGEMENT_COMMON_CLASS } from "../../components/icons/labels"
const REGION = [
    {
        value: "india",
        label: "India",
        acronym: "IND"

    },
    {
        value: "usa",
        label: "USA",
        acronym: "USA"

    },
    {
        value: "apac",
        label: "APAC",
        acronym: "APAC"

    },
    {
        value: "mena",
        label: "MENA",
        acronym: "MENA"

    },
    {
        value: "europe",
        label: "Europe",
        acronym: "EU"

    },
]

const ROLETYPE: IValueLabel[] = [
    {
        value: "cto",
        label: "CTO",
        acronym: "CTO"
    },
    {
        value: "cpto",
        label: "CPTO",
        acronym: "CPTO"
    },
    {
        value: "headOfEngineering",
        label: "Head of Engineering",
        acronym: "HOE"
    },
    {
        value: "svp_vp_avpOfEngineering",
        label: "SVP / VP / AVP of Engineering",
        acronym: "VPOE"
    },
    {
        value: "srDirector_directorOfEngineering",
        label: "Sr. Director / Director of Engineering",
        acronym: "DOE"
    },
    {
        value: "siteLead",
        label: "Site Lead",
        acronym: "SL"
    },
    {
        value: "headOfAi_DataScience",
        label: "Head of AI / Data Science",
        acronym: "HODS"
    },
    {
        value: "ciso",
        label: "CISO",
        acronym: "ciso"
    },
    {
        value: "chief_PrincipalArchitect",
        label: "Chief / Principal Architect",
        acronym: "PA"
    },
    {
        value: "principal_engineer",
        label: "Principal Engineer",
        acronym: "PE"
    },
]
const USA_MENA_APAC_BUDGET: IValueLabel[] = [
    {
        value: "uptoUsd250k",
        label: "Upto USD 250k"
    },
    {
        value: "usd250Kto500k",
        label: "USD 250k to 500K"
    },
    {
        value: "aboveUsd500k",
        label: "Above USD 500k"
    }
]
interface IBudgetRange {
    [key: string]: IValueLabel[];
}

const BUDGET_RANGE: IBudgetRange = {
    "india": [
        {
            value: "uptoInr1cr",
            label: "Upto INR 1Cr",
        },
        {
            value: "inr1CrTo2Cr",
            label: "INR 1Cr to 2Cr",
        },
        {
            value: "inr2CrTo3Cr",
            label: "INR 2Cr to 3Cr",
        },
        {
            value: "aboveInr3Cr",
            label: "Above INR 3Cr",
        }
    ],
    "usa": USA_MENA_APAC_BUDGET,
    "apac": USA_MENA_APAC_BUDGET,
    "mena": USA_MENA_APAC_BUDGET,
    "europe": [
        {
            value: "Upto_Eur_250k",
            label: "Upto EUR 250k"
        },
        {
            value: "eur250To500k",
            label: "EUR 250k to 500k"
        },
        {
            value: "aboveEur500k",
            label: "Above EUR 500k"
        }
    ]

}

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
        value: "chro",
        label: "CHRO",
    },
    {
        value: "managingDirector",
        label: "Managing Director",
    },
    {
        value: "cto",
        label: "CTO",
    },
    {
        value: "siteLead",
        label: "Site Lead",
    },
    {
        value: "taHead",
        label: "TA Head",
    },
    {
        value: "hRExecutive",
        label: "HR Executive",
    },
    {
        value: "consultant",
        label: "Consultant",
    },
    {
        value: "manager",
        label: "Manager",
    },
    {
        value: "executive",
        label: "Executive",
    },
]

const ALL_DESIGNATIONS:IValueLabel[] = [
    {
        value: "allDesignations",
        label: "All Designations"
    },
    ...DESIGNATION
]

const TYPE: IValueLabel[] = [
    {
        value: "influencer",
        label: "Influencer",
        class: " px-[10px] py-[4px] border border-[1px] text-sm font-medium text-purple-700 bg-purple-50 border-purple-600"
    },
    {
        value: "decisionMaker",
        label: "Decision Maker",
        class: " px-[10px] py-[4px] border border-[1px] text-sm font-medium text-success-700 bg-success-50 border-success-600"
    },
    {
        value: "gatekeeper",
        label: "Gatekeeper",
        class: " px-[10px] py-[4px] border border-[1px] text-sm font-medium text-error-700 bg-error-50 border-error-600"
    },
    {
        value: "investor",
        label: "Investor",
        class: " px-[10px] py-[4px] border border-[1px] text-sm font-medium text-success-700 bg-success-50 border-success-600"
    },
    {
        value: "legal",
        label: "Legal",
        class: " px-[10px] py-[4px] border border-[1px] text-sm font-medium text-warning-700 bg-warning-50 border-warning-500"
    },
    {
        value: "accountsPayable",
        label: "Accounts Payable",
        class: " px-[10px] py-[4px] border border-[1px] text-sm font-medium text-warning-700 bg-warning-50 border-warning-500"
    },
    {
        value: "budgetHolder",
        label: "Budget Holder",
        class: " px-[10px] py-[4px] border border-[1px] text-sm font-medium text-success-700 bg-success-50 border-success-600"
    },
]

const ALL_TYPES:IValueLabel[] = [
    {
        value :"allTypes",
        label: "All Types",
        isDefault: true
    },
    ...TYPE
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
        value: "horadings_billboards",
        label: "Hoardings/Billboards"
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
        value: "socialMedia",
        label: "Social Media"
    },
    {
        value: "ra_bda",
        label: "RA/BDA"
    },
    {
        value: "vc_pe",
        label: "VC/PE"
    },
    {
        value: "leadGenPartner",
        label: "Lead Gen Partner"
    },

]

const OWNERS: IValueLabel[] = [
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
    {
        value: "anmolGoel",
        label: "Anmol Goel"
    },
    {
        value: "rajgopaljakhmola",
        label: "rajgopal jakhmola"
    },
    {
        value: "rajjakh",
        label: "Raj Jakh"
    },
]

const CLOSEDBY: IValueLabel[] = [
    ...OWNERS
]
const CREATORS: IValueLabel[] = [
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
    {
        value: "anmolGoel",
        label: "Anmol Goel"
    },
    {
        value: "rajgopaljakhmola",
        label: "rajgopal jakhmola"
    },
    {
        value: "rajjakh",
        label: "Raj Jakh"
    },
]

const TEAM_LEADERS: IValueLabel[] = [
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
    {
        value: "anmolGoel",
        label: "Anmol Goel"
    },
    {
        value: "rajgopaljakhmola",
        label: "rajgopal jakhmola"
    },
    {
        value: "rajjakh",
        label: "Raj Jakh"
    },
]
const ALL_TEAM_LEADERS: IValueLabel[] = [
    {
        value: "allTeamLeaders",
        label: "All Team Leaders"
    },
    ...TEAM_LEADERS
]

const REPORTING_MANAGERS: IValueLabel[] = [
    
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
    {
        value: "anmolGoel",
        label: "Anmol Goel"
    },
    {
        value: "rajgopaljakhmola",
        label: "rajgopal jakhmola"
    },
    {
        value: "rajjakh",
        label: "Raj Jakh"
    },
]

const CURRENCIES: IValueLabel[] = [
    "INR", "USD", "EUR", "SGD", "AED", "AUD", "CAD", "JPY", "GBP"
].map(currency => ({ value: currency, label: currency }));


const STATUSES: IValueLabel[] = [
    {
        value: "allStatuses",
        label: "All Statuses",
        isDefault: true
    },
    {
        value: "unverified",
        label: "Unverified",
        icon: Unverified,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-gray-600 bg-gray-50 text-gray-700 "
    },
    {
        value: "verified",
        label: "Verified",
        icon: Verified,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-success-600 bg-success-50 text-success-600"
    },
    {
        value: "deferred",
        label: "Deferred",
        icon: Deferred,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-warning-600 bg-warning-50 text-warning-500"
    },
    {
        value: "lost",
        label: "Lost",
        icon: Lost,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-error-600 bg-error-50 text-error-700"
    },
    {
        value: "junk",
        label: "Junk",
        icon: Junk,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-yellow-700 bg-yellow-25 text-yelow-800"
    },
]

const PROSPECT_STATUSES: IValueLabel[] = [
    {
        value: "qualified",
        label: "Qualified",
        icon: Verified,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-success-600 bg-success-50 text-success-600"
    },
    {
        value: "disqualified",
        label: "Disqualified",
        icon: Unverified,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-gray-600 bg-gray-50 text-gray-700"
    },
    {
        value: "deferred",
        label: "Deferred",
        icon: Deferred,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-warning-600 bg-warning-50 text-warning-500"
    },
    {
        value: "lost",
        label: "Lost",
        icon: Lost,
        class: "border border-[1px] py-[4px] pl-[10px] pr-[12px] text-sm font-medium border-error-600 bg-error-50 text-error-700"
    }
    
]
const ALL_PROSPECT_STATUSES:IValueLabel[] = [
    {
        value: "allStatuses",
        label:"All Statuses",
        isDefault: true
    },
    ...PROSPECT_STATUSES
]
const SOURCES: IValueLabel[] = [
    {
        value: "allSources",
        label: "All Sources",
        isDefault: true
    },
    ...LEAD_SOURCE

]

const REGIONS: IValueLabel[] = [
    {
        value: "allRegions",
        label: "All Regions",
        isDefault: true
    },
    ...REGION
]

const COUNTRY_CODE: IValueLabel[] = [
    {
        "value": "+213",
        "label": "+213 Algeria"
    },
    {
        "value": "+376",
        "label": "+376 Andorra"
    },
    {
        "value": "+244",
        "label": "+244 Angola"
    },
    {
        "value": "+1264",
        "label": "+1264 Anguilla"
    },
    {
        "value": "+1268",
        "label": "+1268 Antigua & Barbuda"
    },
    {
        "value": "+54",
        "label": "+54 Argentina"
    },
    {
        "value": "+374",
        "label": "+374 Armenia"
    },
    {
        "value": "+297",
        "label": "+297 Aruba"
    },
    {
        "value": "+61",
        "label": "+61 Australia"
    },
    {
        "value": "+43",
        "label": "+43 Austria"
    },
    {
        "value": "+994",
        "label": "+994 Azerbaijan"
    },
    {
        "value": "+1242",
        "label": "+1242 Bahamas"
    },
    {
        "value": "+973",
        "label": "+973 Bahrain"
    },
    {
        "value": "+880",
        "label": "+880 Bangladesh"
    },
    {
        "value": "+1246",
        "label": "+1246 Barbados"
    },
    {
        "value": "+375",
        "label": "+375 Belarus"
    },
    {
        "value": "+32",
        "label": "+32 Belgium"
    },
    {
        "value": "+501",
        "label": "+501 Belize"
    },
    {
        "value": "+229",
        "label": "+229 Benin"
    },
    {
        "value": "+1441",
        "label": "+1441 Bermuda"
    },
    {
        "value": "+975",
        "label": "+975 Bhutan"
    },
    {
        "value": "+591",
        "label": "+591 Bolivia"
    },
    {
        "value": "+387",
        "label": "+387 Bosnia Herzegovina"
    },
    {
        "value": "+267",
        "label": "+267 Botswana"
    },
    {
        "value": "+55",
        "label": "+55 Brazil"
    },
    {
        "value": "+673",
        "label": "+673 Brunei"
    },
    {
        "value": "+359",
        "label": "+359 Bulgaria"
    },
    {
        "value": "+226",
        "label": "+226 Burkina Faso"
    },
    {
        "value": "+257",
        "label": "+257 Burundi"
    },
    {
        "value": "+855",
        "label": "+855 Cambodia"
    },
    {
        "value": "+237",
        "label": "+237 Cameroon"
    },
    {
        "value": "+1",
        "label": "+1 Canada"
    },
    {
        "value": "+238",
        "label": "+238 Cape Verde Islands"
    },
    {
        "value": "+1345",
        "label": "+1345 Cayman Islands"
    },
    {
        "value": "+236",
        "label": "+236 Central African Republic"
    },
    {
        "value": "+56",
        "label": "+56 Chile"
    },
    {
        "value": "+86",
        "label": "+86 China"
    },
    {
        "value": "+57",
        "label": "+57 Colombia"
    },
    {
        "value": "+269",
        "label": "+269 Comoros"
    },
    {
        "value": "+242",
        "label": "+242 Congo"
    },
    {
        "value": "+682",
        "label": "+682 Cook Islands"
    },
    {
        "value": "+506",
        "label": "+506 Costa Rica"
    },
    {
        "value": "+385",
        "label": "+385 Croatia"
    },
    {
        "value": "+53",
        "label": "+53 Cuba"
    },
    {
        "value": "+90392",
        "label": "+90392 Cyprus North"
    },
    {
        "value": "+357",
        "label": "+357 Cyprus South"
    },
    {
        "value": "+42",
        "label": "+42 Czech Republic"
    },
    {
        "value": "+45",
        "label": "+45 Denmark"
    },
    {
        "value": "+253",
        "label": "+253 Djibouti"
    },
    {
        "value": "+1809",
        "label": "+1809 Dominica"
    },
    {
        "value": "+1809",
        "label": "+1809 Dominican Republic"
    },
    {
        "value": "+593",
        "label": "+593 Ecuador"
    },
    {
        "value": "+20",
        "label": "+20 Egypt"
    },
    {
        "value": "+503",
        "label": "+503 El Salvador"
    },
    {
        "value": "+240",
        "label": "+240 Equatorial Guinea"
    },
    {
        "value": "+291",
        "label": "+291 Eritrea"
    },
    {
        "value": "+372",
        "label": "+372 Estonia"
    },
    {
        "value": "+251",
        "label": "+251 Ethiopia"
    },
    {
        "value": "+500",
        "label": "+500 Falkland Islands"
    },
    {
        "value": "+298",
        "label": "+298 Faroe Islands"
    },
    {
        "value": "+679",
        "label": "+679 Fiji"
    },
    {
        "value": "+358",
        "label": "+358 Finland"
    },
    {
        "value": "+33",
        "label": "+33 France"
    },
    {
        "value": "+594",
        "label": "+594 French Guiana"
    },
    {
        "value": "+689",
        "label": "+689 French Polynesia"
    },
    {
        "value": "+241",
        "label": "+241 Gabon"
    },
    {
        "value": "+220",
        "label": "+220 Gambia"
    },
    {
        "value": "+995",
        "label": "+995 Georgia"
    },
    {
        "value": "+49",
        "label": "+49 Germany"
    },
    {
        "value": "+233",
        "label": "+233 Ghana"
    },
    {
        "value": "+350",
        "label": "+350 Gibraltar"
    },
    {
        "value": "+30",
        "label": "+30 Greece"
    },
    {
        "value": "+299",
        "label": "+299 Greenland"
    },
    {
        "value": "+1473",
        "label": "+1473 Grenada"
    },
    {
        "value": "+590",
        "label": "+590 Guadeloupe"
    },
    {
        "value": "+671",
        "label": "+671 Guam"
    },
    {
        "value": "+502",
        "label": "+502 Guatemala"
    },
    {
        "value": "+224",
        "label": "+224 Guinea"
    },
    {
        "value": "+245",
        "label": "+245 Guinea - Bissau"
    },
    {
        "value": "+592",
        "label": "+592 Guyana"
    },
    {
        "value": "+509",
        "label": "+509 Haiti"
    },
    {
        "value": "+504",
        "label": "+504 Honduras"
    },
    {
        "value": "+852",
        "label": "+852 Hong Kong"
    },
    {
        "value": "+36",
        "label": "+36 Hungary"
    },
    {
        "value": "+354",
        "label": "+354 Iceland"
    },
    {
        "value": "+91",
        "label": "+91 India"
    },
    {
        "value": "+62",
        "label": "+62 Indonesia"
    },
    {
        "value": "+98",
        "label": "+98 Iran"
    },
    {
        "value": "+964",
        "label": "+964 Iraq"
    },
    {
        "value": "+353",
        "label": "+353 Ireland"
    },
    {
        "value": "+972",
        "label": "+972 Israel"
    },
    {
        "value": "+39",
        "label": "+39 Italy"
    },
    {
        "value": "+1876",
        "label": "+1876 Jamaica"
    },
    {
        "value": "+81",
        "label": "+81 Japan"
    },
    {
        "value": "+962",
        "label": "+962 Jordan"
    },
    {
        "value": "+7",
        "label": "+7 Kazakhstan"
    },
    {
        "value": "+254",
        "label": "+254 Kenya"
    },
    {
        "value": "+686",
        "label": "+686 Kiribati"
    },
    {
        "value": "+850",
        "label": "+850 Korea North"
    },
    {
        "value": "+82",
        "label": "+82 Korea South"
    },
    {
        "value": "+965",
        "label": "+965 Kuwait"
    },
    {
        "value": "+996",
        "label": "+996 Kyrgyzstan"
    },
    {
        "value": "+856",
        "label": "+856 Laos"
    },
    {
        "value": "+371",
        "label": "+371 Latvia"
    },
    {
        "value": "+961",
        "label": "+961 Lebanon"
    },
    {
        "value": "+266",
        "label": "+266 Lesotho"
    },
    {
        "value": "+231",
        "label": "+231 Liberia"
    },
    {
        "value": "+218",
        "label": "+218 Libya"
    },
    {
        "value": "+417",
        "label": "+417 Liechtenstein"
    },
    {
        "value": "+370",
        "label": "+370 Lithuania"
    },
    {
        "value": "+352",
        "label": "+352 Luxembourg"
    },
    {
        "value": "+853",
        "label": "+853 Macao"
    },
    {
        "value": "+389",
        "label": "+389 Macedonia"
    },
    {
        "value": "+261",
        "label": "+261 Madagascar"
    },
    {
        "value": "+265",
        "label": "+265 Malawi"
    },
    {
        "value": "+60",
        "label": "+60 Malaysia"
    },
    {
        "value": "+960",
        "label": "+960 Maldives"
    },
    {
        "value": "+223",
        "label": "+223 Mali"
    },
    {
        "value": "+356",
        "label": "+356 Malta"
    },
    {
        "value": "+692",
        "label": "+692 Marshall Islands"
    },
    {
        "value": "+596",
        "label": "+596 Martinique"
    },
    {
        "value": "+222",
        "label": "+222 Mauritania"
    },
    {
        "value": "+269",
        "label": "+269 Mayotte"
    },
    {
        "value": "+52",
        "label": "+52 Mexico"
    },
    {
        "value": "+691",
        "label": "+691 Micronesia"
    },
    {
        "value": "+373",
        "label": "+373 Moldova"
    },
    {
        "value": "+377",
        "label": "+377 Monaco"
    },
    {
        "value": "+976",
        "label": "+976 Mongolia"
    },
    {
        "value": "+1664",
        "label": "+1664 Montserrat"
    },
    {
        "value": "+212",
        "label": "+212 Morocco"
    },
    {
        "value": "+258",
        "label": "+258 Mozambique"
    },
    {
        "value": "+95",
        "label": "+95 Myanmar"
    },
    {
        "value": "+264",
        "label": "+264 Namibia"
    },
    {
        "value": "+674",
        "label": "+674 Nauru"
    },
    {
        "value": "+977",
        "label": "+977 Nepal"
    },
    {
        "value": "+31",
        "label": "+31 Netherlands"
    },
    {
        "value": "+687",
        "label": "+687 New Caledonia"
    },
    {
        "value": "+64",
        "label": "+64 New Zealand"
    },
    {
        "value": "+505",
        "label": "+505 Nicaragua"
    },
    {
        "value": "+227",
        "label": "+227 Niger"
    },
    {
        "value": "+234",
        "label": "+234 Nigeria"
    },
    {
        "value": "+683",
        "label": "+683 Niue"
    },
    {
        "value": "+672",
        "label": "+672 Norfolk Islands"
    },
    {
        "value": "+670",
        "label": "+670 Northern Marianas"
    },
    {
        "value": "+47",
        "label": "+47 Norway"
    },
    {
        "value": "+968",
        "label": "+968 Oman"
    },
    {
        "value": "+92",
        "label": "+92 Pakistan"
    },
    {
        "value": "+680",
        "label": "+680 Palau"
    },
    {
        "value": "+507",
        "label": "+507 Panama"
    },
    {
        "value": "+675",
        "label": "+675 Papua New Guinea"
    },
    {
        "value": "+595",
        "label": "+595 Paraguay"
    },
    {
        "value": "+51",
        "label": "+51 Peru"
    },
    {
        "value": "+63",
        "label": "+63 Philippines"
    },
    {
        "value": "+48",
        "label": "+48 Poland"
    },
    {
        "value": "+351",
        "label": "+351 Portugal"
    },
    {
        "value": "+1787",
        "label": "+1787 Puerto Rico"
    },
    {
        "value": "+974",
        "label": "+974 Qatar"
    },
    {
        "value": "+262",
        "label": "+262 Reunion"
    },
    {
        "value": "+40",
        "label": "+40 Romania"
    },
    {
        "value": "+7",
        "label": "+7 Russia"
    },
    {
        "value": "+250",
        "label": "+250 Rwanda"
    },
    {
        "value": "+378",
        "label": "+378 San Marino"
    },
    {
        "value": "+239",
        "label": "+239 Sao Tome & Principe"
    },
    {
        "value": "+966",
        "label": "+966 Saudi Arabia"
    },
    {
        "value": "+221",
        "label": "+221 Senegal"
    },
    {
        "value": "+381",
        "label": "+381 Serbia"
    },
    {
        "value": "+248",
        "label": "+248 Seychelles"
    },
    {
        "value": "+232",
        "label": "+232 Sierra Leone"
    },
    {
        "value": "+65",
        "label": "+65 Singapore"
    },
    {
        "value": "+421",
        "label": "+421 Slovak Republic"
    },
    {
        "value": "+386",
        "label": "+386 Slovenia"
    },
    {
        "value": "+677",
        "label": "+677 Solomon Islands"
    },
    {
        "value": "+252",
        "label": "+252 Somalia"
    },
    {
        "value": "+27",
        "label": "+27 South Africa"
    },
    {
        "value": "+34",
        "label": "+34 Spain"
    },
    {
        "value": "+94",
        "label": "+94 Sri Lanka"
    },
    {
        "value": "+290",
        "label": "+290 St.Helena"
    },
    {
        "value": "+1869",
        "label": "+1869 St.Kitts"
    },
    {
        "value": "+1758",
        "label": "+1758 St.Lucia"
    },
    {
        "value": "+249",
        "label": "+249 Sudan"
    },
    {
        "value": "+597",
        "label": "+597 Suriname"
    },
    {
        "value": "+268",
        "label": "+268 Swaziland"
    },
    {
        "value": "+46",
        "label": "+46 Sweden"
    },
    {
        "value": "+41",
        "label": "+41 Switzerland"
    },
    {
        "value": "+963",
        "label": "+963 Syria"
    },
    {
        "value": "+886",
        "label": "+886 Taiwan"
    },
    {
        "value": "+7",
        "label": "+7 Tajikstan"
    },
    {
        "value": "+66",
        "label": "+66 Thailand"
    },
    {
        "value": "+228",
        "label": "+228 Togo"
    },
    {
        "value": "+676",
        "label": "+676 Tonga"
    },
    {
        "value": "+1868",
        "label": "+1868 Trinidad & Tobago"
    },
    {
        "value": "+216",
        "label": "+216 Tunisia"
    },
    {
        "value": "+90",
        "label": "+90 Turkey"
    },
    {
        "value": "+993",
        "label": "+993 Turkmenistan"
    },
    {
        "value": "+1649",
        "label": "+1649 Turks & Caicos Islands"
    },
    {
        "value": "+688",
        "label": "+688 Tuvalu"
    },
    {
        "value": "+256",
        "label": "+256 Uganda"
    },
    {
        "value": "+44",
        "label": "+44 UK"
    },
    {
        "value": "+380",
        "label": "+380 Ukraine"
    },
    {
        "value": "+971",
        "label": "+971 United Arab Emirates"
    },
    {
        "value": "+598",
        "label": "+598 Uruguay"
    },
    {
        "value": "+1",
        "label": "+1 USA"
    },
    {
        "value": "+7",
        "label": "+7 Uzbekistan"
    },
    {
        "value": "+678",
        "label": "+678 Vanuatu"
    },
    {
        "value": "+379",
        "label": "+379 Vatican City"
    },
    {
        "value": "+58",
        "label": "+58 Venezuela"
    },
    {
        "value": "+84",
        "label": "+84 Vietnam"
    },
    {
        "value": "+1284",
        "label": "+1284 Virgin Islands - British"
    },
    {
        "value": "+1340",
        "label": "+1340 Virgin Islands - US"
    },
    {
        "value": "+681",
        "label": "+681 Wallis & Futuna"
    },
    {
        "value": "+969",
        "label": "+969 Yemen North"
    },
    {
        "value": "+967",
        "label": "+967 Yemen South"
    },
    {
        "value": "+260",
        "label": "+260 Zambia"
    },
    {
        "value": "+263",
        "label": "+263 Zimbabwe"
    }
]

const TIME_TO_FILL: IValueLabel[] = [
    {
        value: "lessThan30Days",
        label: "Less than 30 days"
    },
    {
        value: "30_to_60_days",
        label: "30 to 60 days"
    },
    {
        value: "60_to_90_days",
        label: "60 to 90 days"
    },
    {
        value: "above_90_days",
        label: "Above 90 days"
    }
]



const INDUSTRY: IValueLabel[] = [
    {
        value: "finTech",
        label: "FinTech"
    },
    {
        value: "healthTech",
        label: "HealthTech"
    },
    {
        value: "enterpriseTech_and_saaS",
        label: "EnterpriseTech & SaaS"
    },
    {
        value: "consumer_services",
        label: "Consumer Services"
    },
    {
        value: "adTech",
        label: "AdTech"
    },
    {
        value: "travelTech",
        label: "TravelTech"
    },
    {
        value: "transportTech",
        label: "TransportTech"
    },
    {
        value: "edTech",
        label: "EdTech"
    },
    {
        value: "hRTech",
        label: "HRTech"
    },
    {
        value: "propTech",
        label: "PropTech"
    },
    {
        value: "deepTech",
        label: "DeepTech"
    },
    {
        value: "agriTech",
        label: "AgriTech"
    },
    {
        value: "ecommerce",
        label: "Ecommerce"
    },
    // {
    //     value: "supplyChain",
    //     label: "Supply Chain"
    // },
    {
        value: "logistics",
        label: "Logistics"
    },
    {
        value: "gaming",
        label: "Gaming"
    },
    {
        value: "media_and_entertainment",
        label: "Media & Entertainment"
    },
    {
        value: "technologyServices",
        label: "Technology Services"
    },
    // {
    //     value: "enterprise_services",
    //     label: "Enterprise Services"
    // },
    {
        value: "telecommunications",
        label: "Telecommunications"
    },
    {
        value: "lifesciences",
        label: "Lifesciences"
    },
    {
        value: "bfsi",
        label: "BFSI"
    },
    
    {
        value: "energy_and_utilities",
        label: "Energy & Utilities"
    },
    {
        value: "vc_pe",
        label: "VC/PE"
    },
]

const INDUSTRIES: IValueLabel[] = [
    {
        value: "allIndustries",
        label: "All Industries"
    },
    ...INDUSTRY
]

const DOMAINS: IValueLabel[] = [
    {
        value: "b2b",
        label: "B2B"
    },
    {
        value: "b2c",
        label: "B2C"
    }
]

const ALL_DOMAINS: IValueLabel[] = [
    {
        value: "allDomains",
        label: "All Domains"
    },
    ...DOMAINS
]



const SIZE_OF_COMPANY: IValueLabel[] = [
    { value: "1_to_10", label: "1 to 10" },
    { value: "11_to_50", label: "11 to 50" },
    { value: "51_to_100", label: "51 to 100" },
    { value: "101_to_500", label: "101 to 500" },
    { value: "501_to_1000", label: "501 to 1000" },
    { value: "1001_to_5000", label: "1001 to 5000" },
    { value: "5001_to_10000", label: "5001 to 10000" },
    { value: "10001_plus", label: "10001+" }
]
const ALL_SIZE_OF_COMPANY: IValueLabel[] = [
    {value: "allSizes", label: "All Sizes"},
    ...SIZE_OF_COMPANY
]

const segmentnames = {
    hustler: "Hustler",
    rockstar: "Rockstar",
    godfather: "Godfather"
}

const SEGMENT: IValueLabel[] = [
    {value:"hustler", label: segmentnames.hustler, icon: HustlerIcon, class: `${SEGEMENT_COMMON_CLASS} ${HUSTLER_CLASS}`},
    {value:"rockstar", label: segmentnames.rockstar, icon: RockstarIcon, class: `${SEGEMENT_COMMON_CLASS} ${ROCKSTAR_CLASS}`},
    {value:"godfather", label: segmentnames.godfather, icon: GodfatherIcon,class: `${SEGEMENT_COMMON_CLASS} ${GODFATHER_CLASS}`},
]
const ALL_SEGMENTS: IValueLabel[] = [
    {value: "allSegments", label: "All Segments", isDefault:true},
    ...SEGMENT
]

const LAST_FUNDING_STAGE: IValueLabel[] = [
    { value: "pre_seed", label: "Pre-Seed", icon: HustlerIcon, acronym: segmentnames.hustler },
    { value: "seed", label: "Seed", icon: HustlerIcon, acronym: segmentnames.hustler },
    { value: "series_a", label: "Series A", icon: HustlerIcon, acronym: segmentnames.hustler },
    { value: "series_b", label: "Series B", icon: HustlerIcon, acronym: segmentnames.hustler },
    { value: "debt_financing", label: "Debt Financing", icon: HustlerIcon, acronym: segmentnames.hustler },
    { value: "convertible_note", label: "Convertible Note", icon: HustlerIcon, acronym: segmentnames.hustler },
    { value: "series_c", label: "Series C", icon: RockstarIcon, acronym: segmentnames.rockstar },
    { value: "series_d", label: "Series D", icon: RockstarIcon, acronym: segmentnames.rockstar },
    { value: "private_equity", label: "Private Equity", icon: RockstarIcon, acronym: segmentnames.rockstar },
    { value: "corporate_round", label: "Corporate Round", icon: RockstarIcon, acronym: segmentnames.rockstar },
    { value: "series_e_and_above", label: "Series E & Above", icon: RockstarIcon, acronym: segmentnames.rockstar },
    { value: "ipo", label: "IPO", icon: GodfatherIcon, acronym: segmentnames.godfather },
    { value: "post_ipo_equity", label: "Post-IPO Equity", icon: GodfatherIcon, acronym: segmentnames.godfather },
    { value: "post_ipo_debt", label: "Post-IPO Debt", icon: GodfatherIcon, acronym: segmentnames.godfather },
    { value: "seondary_market", label: "Secondary Market", icon: GodfatherIcon, acronym: segmentnames.godfather },
    { value: "unknown", label: "Unknown", icon: HustlerIcon, acronym: segmentnames.hustler },
    { value: "notApplicable", label: "Not Applicable", icon: HustlerIcon, acronym: segmentnames.hustler },
];

const ALL_LAST_FUNDING_STAGE: IValueLabel[] = [
    { value: "allFundingStages", label: "All Funding Stages"},
    ...LAST_FUNDING_STAGE
];

const LAST_FUNDING_AMOUNT = [
    {
        value: "less_than_2mm",
        label: "Less than 2MM USD"
    },
    {
        value: "2mm_to_4mm",
        label: "2MM USD to 4MM USD"
    },
    {
        value: "5mm_to_10mm",
        label: "5MM USD to 10 MM USD"
    },
    {
        value: "11mm_to_50mm",
        label: "11 MM USD to 50 MM USD"
    },
    {
        value: "51mm_to_100mm",
        label: "51 MM USD to 100 MM USD"
    },
    {
        value: "above_100mm",
        label: "Above 100 MM USD"
    },
    {
        value: "undisclosed",
        label: "Undisclosed"
    },
    { value: "notApplicable", label: "Not Applicable" },
];

const RETAINER_ADVANCE: IValueLabel[] = [
    {
        value: "yes",
        label: "Yes"
    },
    {
        value: "no",
        label: "No"
    }
]
const EXCLUSIVITY: IValueLabel[] = [
    {
        value: "yes",
        label: "Yes"
    },
    {
        value: "no",
        label: "No"
    }
]
const SERVICE_FEE_RANGE: IValueLabel[] = [
    {
        value: "lt20",
        label: "Less than 20%"
    },
    {
        value: "20to25",
        label: "20% to 25%"
    },
    {
        value: "25to30",
        label: "25% to 30%"
    },
    {
        value: "gt30",
        label: "Above 30%"
    }
]
;
const FUNCTION: IValueLabel[] = [
    {
        value: "ra",
        label: "RA"
    },
    {
        value: "sales",
        label: "Sales"
    },
    {
        value: "fulfillment",
        label: "Fulfillment"
    },
    {
        value: "finance",
        label: "Finance"
    },
    {
        value: "hr",
        label: "HR"
    },
    {
        value: "tech",
        label: "Tech"
    },
    {
        value: "leadership",
        label: "Leadership"
    },
    {
        value: "marketing",
        label: "Marketing"
    },
];
const PROFILE: IValueLabel[] = [
    {
        value: "admin",
        label: "Admin"
    },
    {
        value: "teamLeader",
        label: "Team Leader"
    },
    {
        value: "teamMember",
        label: "Team Member"
    },
];

const ALL_PROFILES: IValueLabel[] = [
    {
        value: "allProfiles",
        label: "All Profiles"
    },
    ...PROFILE
]

const ALL_FUNCTIONS: IValueLabel[] = [
    {
        value: "allFunctions",
        label: "All Functions"
    },
    ...FUNCTION
]

export { ROLETYPE, REGION, DESIGNATION, BUDGET_RANGE, TYPE, LEAD_SOURCE, OWNERS, CREATORS, STATUSES, SOURCES, REGIONS, COUNTRY_CODE, TIME_TO_FILL, INDUSTRY, INDUSTRIES, DOMAINS, ALL_DOMAINS, SIZE_OF_COMPANY,ALL_SIZE_OF_COMPANY, LAST_FUNDING_STAGE, ALL_LAST_FUNDING_STAGE, RETAINER_ADVANCE, LAST_FUNDING_AMOUNT, EXCLUSIVITY, SERVICE_FEE_RANGE, CURRENCIES, SEGMENT, ALL_SEGMENTS, ALL_DESIGNATIONS, ALL_TYPES, PROSPECT_STATUSES, ALL_PROSPECT_STATUSES, CLOSEDBY, PROFILE, FUNCTION, ALL_PROFILES, ALL_FUNCTIONS, TEAM_LEADERS, ALL_TEAM_LEADERS, REPORTING_MANAGERS }