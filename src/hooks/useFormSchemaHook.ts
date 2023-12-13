import { FilterQuery } from "@/app/interfaces/interface";
import { usePathname, useRouter } from "next/navigation";
import useCreateQueryString from "./useCreateQueryString";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllTime, getLast7Days } from "@/components/ui/date-range-picker";
import { TITLES } from "@/components/dashboard";
import { useCurrentTabStore, useSettingStore } from "@/store/store";

const LeadFormSchema = z.object({
    owners: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Owner.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one region.",
    }),
    sources: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one source.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

const ProspectFormSchema = z.object({
    owners: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Owner.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one region.",
    }),
    sources: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one source.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

const DealsFormSchema = z.object({
    owners: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Owner.",
    }),
    fulfilledBy: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Fulfiller.",
    }),
    // regions: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one region.",
    // }),
    sources: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one source.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string(),
    dateRangeCummulative: z.any(),
    statusCummulative: z.string()

})


const AccountFormSchema = z.object({
    industries: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    accounts: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    domains: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    segments: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    sizes: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    fundingStages: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    // owners: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one Owner.",
    // }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})


const ContactsFormSchema = z.object({
    designations: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    accounts: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    types: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

const UsersFormSchema = z.object({
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    functions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    profiles: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})


const TeamsFormSchema = z.object({
    teamLeaders: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

const ProfilesFormSchema = z.object({
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

const ActivityFormSchema = z.object({
    assignees: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Assignee.",
    }),
    creators: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Creator.",
    }),
    modes: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one Mode.",
    }),
    statuses: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one status.",
    }),
    search: z.string(),
    dateRange: z.any(),
    queryParamString: z.string()
})

export function useFormSchemaHook(){

    const { from, to } = getLast7Days()
    const { fromAllTime, toAllTime } = getAllTime()
    const {currentTab, setCurrentTab} = useCurrentTabStore()
    const {isSettingsClicked, setSettingsClicked} = useSettingStore()

    const LeadForm = useForm<z.infer<typeof LeadFormSchema>>({
        resolver: zodResolver(LeadFormSchema),
        defaultValues: {
            regions: ["allRegions"],
            sources: ["allSources"],
            statuses: ["allStatuses"],
            owners: ['allOwners'],
            creators: ['allCreators'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

    const ProspectForm = useForm<z.infer<typeof ProspectFormSchema>>({
        resolver: zodResolver(ProspectFormSchema),
        defaultValues: {
            regions: ["allRegions"],
            sources: ["allSources"],
            statuses: ["allStatuses"],
            owners: ['allOwners'],
            creators: ['allCreators'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

    const DealsForm = useForm<z.infer<typeof DealsFormSchema>>({
        resolver: zodResolver(DealsFormSchema),
        defaultValues: {
            // regions: ["allRegions"],
            sources: ["allSources"],
            statuses: ["allStatuses"],
            owners: ['allOwners'],
            fulfilledBy: ['allFulfillers'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            },
            dateRangeCummulative: "Current FY",
            statusCummulative: "in-progress",
        }
    })

    const AccountsForm = useForm<z.infer<typeof AccountFormSchema>>({
        resolver: zodResolver(AccountFormSchema),
        defaultValues: {
            industries: ["allIndustries"],
            accounts: ["allAccounts"],
            domains: ["allDomains"],
            segments: ["allSegments"],
            sizes: ['allSizes'],
            fundingStages: ['allFundingStages'],
            creators: ['allCreators'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

    const ContactsForm = useForm<z.infer<typeof ContactsFormSchema>>({
        resolver: zodResolver(ContactsFormSchema),
        defaultValues: {
            designations: ["allDesignations"],
            types: ["allTypes"],
            accounts: ["allAccounts"],
            creators: ['allCreators'],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

    const UsersForm = useForm<z.infer<typeof UsersFormSchema>>({
        resolver: zodResolver(UsersFormSchema),
        defaultValues: {
            functions: ["allFunctions"],
            profiles: ["allProfiles"],
            regions: ["allRegions"],
            statuses: ["allStatuses"],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

    const TeamsForm = useForm<z.infer<typeof TeamsFormSchema>>({
        resolver: zodResolver(TeamsFormSchema),
        defaultValues: {
            teamLeaders: ["allTeamLeaders"],
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })

    const ProfilesForm = useForm<z.infer<typeof ProfilesFormSchema>>({
        resolver: zodResolver(ProfilesFormSchema),
        defaultValues: {
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            }
        }
    })
    
    const ActivitiesForm = useForm<z.infer<typeof ActivityFormSchema>>({
        resolver: zodResolver(ActivityFormSchema),
        defaultValues: {
            search: "",
            queryParamString: undefined,
            dateRange: {
                "range": {
                    "from": fromAllTime,
                    "to": toAllTime
                },
                rangeCompare: undefined
            },
            assignees: ["allAssignees"],
            creators: ["allCreators"],
            modes: ["allModes"],
            statuses: ["In Progress"]
        }
    })

    const router = useRouter();

    function setTab(tabName: string, doCustomRoute?:boolean) {
        
        
        LeadForm.reset()
        ProspectForm.reset()
        DealsForm.reset()
        AccountsForm.reset()
        ContactsForm.reset()
        ActivitiesForm.reset()

        setCurrentTab(tabName)
        
        if(doCustomRoute){
            if(tabName===TITLES.LEADS){
                router.push(`/dashboard/leads`)
            }
            else if(tabName===TITLES.PROSPECTS){
                router.push(`/dashboard/prospects`)
            }
            else if(tabName===TITLES.DEALS){
                router.push(`/dashboard/deals`)
            }
            else if(tabName===TITLES.ACCOUNTS){
                router.push(`/dashboard/accounts`)
            }
            else if(tabName===TITLES.CONTACTS){
                router.push(`/dashboard/contacts`)
            }
            else if(tabName===TITLES.USER_MANAGEMENT){
                setSettingsClicked(isSettingsClicked+1)
                router.push(`/dashboard/settings`)
            }
            else if(tabName===TITLES.My_DASHBOARD){
                router.push(`/dashboard/my-dashboard`)
            }
            else if(tabName===TITLES.MY_ACCOUNT){
                router.push(`/dashboard/my-account`)
            }
            else if(tabName===TITLES.ACTIVITIES){
                router.push(`/dashboard/activity`)
            }
        }
        
    }

    return {LeadForm, ProspectForm, DealsForm, AccountsForm, ContactsForm, UsersForm, TeamsForm, ProfilesForm, ActivitiesForm, setTab}
}