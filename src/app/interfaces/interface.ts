
export interface IValueLabel {
    value: string
    label: string
    isDefault?: boolean
    icon?: any
    class?: string
    acronym?: string
    mandatory?: boolean
    currency?: string
}

export interface Client {
    organisation: Organisation;
    role_details: RoleDetails;
    source: string;
    title: string | null;
}

export interface Organisation {
    id?: number
    name?: string;
    contact_details: ContactDetail[];
}

export interface ContactDetail {
    name: string;
    email: string;
    std_code: string;
    phone: string;
    designation: string;
    type: string;
}

export interface RoleDetails {
    region: string;
    role_type: string;
    budget_range: string;
}


export interface LeadInterface {
    id: number;
    created_by: {
        id: number;
        name: string
    };
    updated_by: string;
    owner: {
        id: number;
        name: string;
        is_active: boolean;
    };
    role: {
        id: number;
        role_type: string;
        budget_range: string;
        fixed_budget: string | null;
        fixed_budget_ul: string | null;
        esop_rsu: string | null;
        region: string;
        location: string | null;
        time_To_fill: string | null;
        archived: boolean;
    };
    organisation: {
        id: number;
        contacts: {
            id: number;
            name: string;
            email: string;
            std_code: string;
            phone: string;
            designation: string;
            type: string;
            archived: boolean;
            organisation: number;
        }[];
        created_by: string;
        updated_by: string;
        name: string;
        registered_name: string | null;
        govt_id: string | null;
        billing_address: string | null;
        shipping_address: string | null;
        industry: string | null;
        domain: string | null;
        size: string | null;
        last_funding_stage: string | null;
        last_funding_amount: number | null;
        funding_currency: string | null;
        segment: string | null;
        archived: boolean;

    };
    title: string | null;
    currency: string | null;
    service_fee: number | null;
    service_fee_range: string | null;
    flat_fee: string | null,
    equity_fee: string | null,
    retainer_advance: boolean | null;
    exclusivity: boolean | null;
    source: string;
    status: string;
    is_converted_to_prospect: boolean;
    archived: boolean;
    created_at: string;
    updated_at: string;
    reason: string;
};

export interface ClientCompleteInterface {
    id: number;
    contacts: {
        id: number;
        name: string;
        email: string;
        std_code: string;
        phone: string;
        designation: string;
        type: string;
        archived: boolean;
        organisation: number;
    }[];
    created_by: string;
    updated_by: string;
    name: string;
    registered_name: string | null;
    govt_id: string | null;
    billing_address: string | null;
    shipping_address: string | null;
    industry: string | null;
    domain: string | null;
    size: string | null;
    last_funding_stage: string | null;
    last_funding_amount: number | null;
    funding_currency: string | null;
    segment: string | null;
    archived: boolean;
}
export interface Signin {
    email: string
    password: string
}

export interface PatchLead {
    id: number;
    readOnly: true;
    created_by: string;
    updated_by: string;
    owner: number | null;
    role: string;
    organisation: string;
    title?: string | null;
    currency?: string | null;
    service_fee?: number | null;
    service_fee_range?: string | null;
    retainer_advance?: boolean | null;
    exclusivity?: boolean | null;
    source: string;
    status: string;
    is_converted_to_prospect?: boolean;
    archived: boolean;
    created_at: string;
    updated_at: string;
    reason: string
    closed_by?: number | null,
    fullfilled_by?: number | null,
    flat_fee: string | null,
    equity_fee: string | null,
}

export interface PatchDeal {
    id: number;
    status: string;
    deal_value: string;
    owner: number | null;
}

export interface PatchOrganisation {
    id: number;
    contacts: any[];
    created_by: string;
    updated_by: string;
    lead_count: string;
    name: string;
    registered_name?: string | null;
    govt_id?: string | null;
    billing_address?: string | null;
    shipping_address?: string | null;
    industry?: string | null;
    domain?: string | null;
    size?: string | null;
    last_funding_stage?: string | null;
    last_funding_amount?: string | null;
    funding_currency?: string | null;
    segment?: string | null;
    archived: boolean;
}

export interface PatchRoleDetails {
    id: number;
    role_type: string;
    budget_range: string;
    fixed_budget?: string | null;
    fixed_budget_ul?: string | null;
    esop_rsu?: string | null;
    region: string;
    location?: string | null;
    time_To_fill?: string | null;
    archived: boolean;
}

export interface User {
    email: string;
    first_name: string;
    last_name: string;
    profile: {
        id: number;
        name: string;
    };
    function: string;
}

export interface Contact {
    name: string
    email: string
    std_code: string
    phone: string
    designation: string
    type: string
    archived: boolean
    organisation: number
}

export interface ClientGetResponse {

    id: number;
    contacts: {
        id: number;
        name: string;
        email: string;
        std_code: string;
        phone: string;
        designation: string;
        type: string;
        archived: boolean;
        organisation: number;
    }[];
    created_by: string;
    updated_by: string;
    lead_count: number;
    name: string;
    registered_name: string | null;
    govt_id: string | null;
    billing_address: string | null;
    shipping_address: string | null;
    industry: string;
    domain: string;
    size: string;
    last_funding_stage: string;
    last_funding_amount: string;
    funding_currency: string | null;
    segment: string | null;
    archived: boolean;

}

export interface ContactsGetResponse {
    id: number;
    name: string;
    email: string;
    std_code: string;
    phone: string;
    designation: string;
    type: string;
    archived: boolean;
    organisation: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
}

export interface ClientPostBody {
    name: string;
    govt_id: string;
    registered_name: string;
    billing_address: string;
    shipping_address: string;
    industry: string;
    domain: string;
    size: string;
    last_funding_stage: string;
    last_funding_amount: string;
    funding_currency?: string;
    contact_details: ClientContactDetailPostBody[];
    segment: string | null;
}

interface ClientContactDetailPostBody {
    name: string;
    email: string;
    std_code: string;
    phone: string;
    designation: string;
    type: string;
}

export interface ProspectsGetResponse {
    id: number;
    created_by: {
        id: number;
        name: string
    };
    updated_by: {
        id: number,
        name: string
    };
    owner: {
        id: number;
        name: string;
        is_active: boolean;
    };
    lead: {
        id: number;
        created_by: {
            id: number,
            name: string
        };
        updated_by: {
            id: number,
            name: string
        };
        owner: {
            id: number,
            name: string
        };
        role: {
            id: number;
            role_type: string;
            budget_range: string;
            fixed_budget: null | any; // Replace 'any' with appropriate type
            fixed_budget_ul: null | any; // Replace 'any' with appropriate type
            esop_rsu: null | any; // Replace 'any' with appropriate type
            region: string;
            location: string;
            time_To_fill: null | any; // Replace 'any' with appropriate type
            archived: boolean;
        };
        organisation: {
            id: number;
            contacts: {
                id: number;
                name: string;
                email: string;
                std_code: string;
                phone: string;
                designation: string;
                type: string;
                archived: boolean;
                organisation: number;
            }[];
            created_by: string;
            updated_by: string;
            lead_count: number;
            name: string;
            registered_name: null | string;
            govt_id: null | string;
            billing_address: null | string;
            shipping_address: null | string;
            industry: string;
            domain: string;
            size: string;
            last_funding_stage: string;
            last_funding_amount: string;
            funding_currency: null | string;
            segment: string;
            archived: boolean;
            created_at: string;
            updated_at: string;
        };
        title: string;
        currency: null | string;
        service_fee: null | any; // Replace 'any' with appropriate type
        service_fee_range: null | any; // Replace 'any' with appropriate type
        retainer_advance: boolean;
        exclusivity: boolean;
        flat_fee: string | null;
        equity_fee: string | null;
        source: string;
        status: string;
        reason: null | string;
        is_converted_to_prospect: boolean;
        archived: boolean;
        created_at: string;
        updated_at: string;
    };
    status: string;
    reason: null | string;
    is_converted_to_deal: boolean;
    archived: boolean;
    created_at: string;
}

export interface PatchProspect {
    status: string,
    reason: string,
    is_converted_to_deal: boolean,
    archived: boolean
    owner: number | null
    lead: Partial<PatchLead>
}

export interface ContactPostBody {
    name: string;
    email: string;
    std_code: string;
    phone: string;
    designation: string;
    type: string;
    organisation?: number;
    organisation_name?: string;

}

export interface UsersGetResponse {
    id: number;
    // last_login: string | null;
    // is_superuser: boolean;
    first_name: string;
    last_name: string;
    // is_staff: boolean;
    is_active: boolean;
    // date_joined: string;
    mobile: string;
    email: string;
    region: string | null;
    function: string;
    time_zone: string | null;
    // gauth: Record<string, any>;
    is_email_verified: boolean;
    // gender: string;
    // archived: boolean;
    created_at: string;
    updated_at: string;
    profile: {
        id: number,
        name: string
    };
    reporting_to: {
        id: number,
        name: string
    };
    created_by: {
        id: number,
        name: string
    };
    // updated_by: number;
    // groups: number[];
    // user_permissions: number[];
}
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface IErrors {
    requiredErrors: number,
    invalidErrors: number
}

export interface TeamsPostBody {
    name: string;
    leader: number;
    members: number[];
}
export interface TeamGetResponse {
    id: number;
    created_by: string;
    updated_by: string;
    leader: {
        id: number;
        email: string;
        mobile: string;
        first_name: string;
        last_name: string;
        profile: number | null;
    };
    members: {
        id: number;
        email: string;
        mobile: string;
        first_name: string;
        last_name: string;
        profile: number | null;
    }[];
    name: string;
    archived: boolean;
    created_at: string;
    updated_at: string;
}
export interface AccessCategoryGetResponse {
    id: number;
    name: string;
    code: string;
    url_frontend: string;
    type: string;
    default_access: {
        add: boolean;
        view: boolean;
        access: boolean;
        change: boolean;
    };
    // parent: null | AccessCategoryGetResponse; // It can be either null or a MenuItem itself
    parent: any;
}
export interface ProfilePostBody {
    group_details: {
        name: string;
    };
    permissions: {
        access_category: number;
        access: boolean;
        view: boolean;
        change: boolean;
        add: boolean;
    }[];
}


export interface ProfileGetResponse {
    id: number;
    permissions: {
        id: number;
        access_category: {
            id: number;
            name: string;
            code: string;
            url_frontend: null | string;
            type: string;
            default_access: {
                add: boolean;
                view: boolean;
                access: boolean;
                change: boolean;
            };
            content_type: any[]; // You may want to define a more specific type for this property
            parent: null | number; // It can be either null or a number (parent's id)
        };
        access: boolean;
        view: boolean;
        add: boolean;
        change: boolean;
        group: number;
    }[];
    users: {
        id: number;
        email: string;
        mobile: string;
        first_name: string;
        last_name: string;
        profile: {
            id: number;
            name: string;
        };
        reporting_to: {
            name: string;
            id: number;
        };
        created_by: {
            name: string;
            id: number;
        };
        function: string;
        region: null | string;
        is_email_verified: boolean;
        is_active: boolean;
        created_at: string;
    }[]
    created_by: string;
    updated_by: string;
    name: string;
    created_at: string;
    updated_at: string;
}


export interface SpecificProfileGetResponse {
    id: number;
    name: string;
    created_by: string;
    updated_by: string;
    permissions: {
        id: number;
        access_category: {
            id: number;
            name: string;
            code: string;
            url_frontend: null | string;
            type: string;
            default_access: {
                add: boolean;
                view: boolean;
                access: boolean;
                change: boolean;
            };
            content_type: any[]; // You may want to define a more specific type for this property
            parent: null | number; // It can be either null or a number (parent's id)
        };
        access: boolean;
        view: boolean;
        add: boolean;
        change: boolean;
        group: number;
    }[];
    created_at: string;
    updated_at: string;
    users: any[]; // You may want to define a more specific type for this property
}
export interface UserPostBody {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    mobile?: string;
    function: string;
    profile: number;
    reporting_to: number;
    region: string;
    time_zone: string;
}
export interface UserPatchBody {
    first_name: string;
    last_name: string;
    email: string;
    mobile?: string;
    function: string;
    profile: number;
    reporting_to: number
    active: boolean;
    region: string
    time_zone: string;
}
export interface PasswordPatchBody {
    old_password: string,
    new_password: string
}
export interface ContactPatchBody {
    name: string;
    designation: string;
    type: string;
    std_code: string;
    phone: string;
    email: string;
    organisation: number;
}

export interface GoogleUserInfo {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    hd: string;
    email: string;
    email_verified: boolean;
    nbf: number;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    iat: number;
    exp: number;
    jti: string;
}

export interface PermissionResponse {
    id: number;
    access_category: {
        id: number;
        name: string;
        code: string;
        url_frontend: null | string;
        type: string;
        default_access: {
            add: boolean;
            view: boolean;
            access: boolean;
            change: boolean;
        };
        content_type: number[]; // You may want to define a more specific type for this property
        parent: null | number; // It can be either null or a number (parent's id)
    };
    access: boolean;
    view: boolean;
    add: boolean;
    change: boolean;
    group: number;
}

export interface Permission {
    access: boolean;
    view: boolean;
    add: boolean;
    change: boolean;
}

export interface UserProfile {
    id: number;
    email: string;
    mobile: string;
    first_name: string;
    last_name: string;
    profile: {
        id: number;
        name: string;
    };
    reporting_to: {
        name: string;
        id: number;
    } | null;
    created_by: {
        name: string;
        id: number;
    };
    function: string;
    region: string | null;
    is_email_verified: boolean;
    is_active: boolean;
    created_at: string;
    time_zone: string | null;
}
export interface Stepper {
    title?: string;
    contacts?: string[];
    mode?: string;
    date?: string;
    roleStatus?: string;
    roleUrgency?: string;
    openToRetainerModel?: string;
    openToMinServiceFeeOrFlatFee?: string;
    collateralShared?: string;
    createdBy?: string;
    status?: string;
    assignedTo?: string;
    createdAt?: string;
    type: string;
    isLastChild?: boolean

}

export interface ActivityPostBody {
    organisation?: number;
    lead?: number;
    type: string;
    contact: number[];
    mode: string;
    due_date: string;
    reminder: number | null;
    assigned_to: number
}

export interface TodoListGetResponse {
    id: number;
    contacts: {
        name: string;
        email: string;
        std_code: string;
        phone: string;
        designation: string;
    }[];
    created_by: {
        name: string;
        id: number;
    };
    status: string;
    type: string;
    mode: string;
    due_date: string;
    reminder: number;
    created_at: string;
    closed_at: string | null;
    lead: number;
    contact: number[];
    isLastChild?: boolean
    title?: string
    assigned_to: {
        name: string;
        id: number;
    };
    typeOfEntity?: string

}

export interface ActivityAccToEntity {
    id: number;
    contacts: {
        id: number
        name: string;
        email: string;
        std_code: string;
        phone: string;
        designation: string;
    }[];
    created_by: {
        name: string;
        id: number;
    };
    assigned_to: null;
    status: null;
    title: string;
    type: string;
    mode: string;
    due_date: string;
    reminder: number;
    created_at: string;
    closed_at: string | null;
    lead: number;
    contact: number[];
    isLastChild?: boolean;
    typeOfEntity?: string
}

export interface ActivityAccToEntityOrganisation {
    id: number;
    contacts: {
        id: number
        name: string;
        email: string;
        std_code: string;
        phone: string;
        designation: string;
    }[];
    created_by: {
        name: string;
        id: number;
    };
    assigned_to: null;
    status: null;
    title: string;
    type: string;
    mode: string;
    due_date: string;
    reminder: number;
    created_at: string;
    closed_at: string | null;
    organisation: number;
    contact: number[];
    isLastChild?: boolean;
    typeOfEntity?: string
}

export interface NotesPostBody {
    activity: number;
    role_status: string | null;
    role_urgency: string | null;
    is_retainer_model: string | null;
    is_min_flat_Service: string | null;
    is_collateral_shared: boolean | null;
    is_response_shared: string | null;
    is_open_engange: string | null;
    is_role_clear: boolean | null;
    is_willing_pay_ra: string | null;
    exp_service_fee: string | null;
    is_proposal_shared: boolean | null;
    related_to: string | null;
    prospect_status: string | null;
    deal_status: string | null;
    negotiation_broker: string | null;
    is_contract_draft_shared: boolean | null;
    next_step: string | null;
    remarks?: string | null;
}

export interface HistoryDataGetResponse {
    notes: NotesHistory[],
    activity: ActivityHistory[]
    changelog: ChangeLogHistory[]
    all: HistoryAllMode
}

export type HistoryAllMode = (NotesHistory | ActivityHistory | ChangeLogHistory)[]

export interface ChangeLogHistory {
    id: number;
    changed_by: {
        name: string;
        id: number;
    };
    type: string;
    field_name: string;
    changed_from: string;
    changed_to: string;
    description: string;
    created_at: string;
    isLastChild?: boolean
    typeOfEntity?: string
}

export interface NotesHistory {
    id: number;
    activity_type: string;
    mode: string;
    contacts: {
        name: string;
        email: string;
        std_code: string;
        phone: string;
        designation: string;
    }[];
    role_status: string | null;
    role_urgency: string | null;
    is_retainer_model: string;
    is_min_flat_Service: string;
    is_collateral_shared: boolean;
    is_response_shared: boolean;
    is_open_engange: string | null;
    is_role_clear: boolean | null;
    is_willing_pay_ra: string | null;
    exp_service_fee: string | null;
    is_proposal_shared: boolean;
    related_to: string | null;
    prospect_status: string | null;
    deal_status: string | null;
    negotiation_broker: string | null;
    is_contract_draft_shared: boolean | null;
    next_step: string;
    created_at: string;
    activity: number;
    title: string
    created_by: {
        name: string;
        id: number;
    }
    isLastChild?: boolean
    typeOfEntity?: string
    remarks?: string | null
    due_date: string
}

export interface ActivityHistory {
    id: number;
    contacts: {
        name: string;
        email: string;
        std_code: string;
        phone: string;
        designation: string;
    }[];
    created_by: {
        name: string;
        id: number;
    };
    assigned_to: null | any;
    status: string;
    title: string;
    type: string;
    mode: string;
    due_date: string;
    reminder: number;
    created_at: string;
    closed_at: string | null;
    lead: number;
    contact: number[];
    isLastChild?: boolean
    typeOfEntity?: string

}
export interface ActivityPatchBody {
    reminder: number,
    due_date: string
}
export interface MyDetailsGetResponse {
    id: number;
    email: string;
    mobile: string;
    first_name: string;
    last_name: string;
    profile: {
        id: number;
        name: string;
    };
    reporting_to: {
        name: string;
        id: number;
    };
    created_by: {
        name: string;
        id: number;
    };
    function: string;
    region: string | null;
    time_zone: string;
    is_email_verified: boolean;
    is_active: boolean;
    created_at: string;
}

export interface NotificationGetResponse {
    id: number;
    data: {
        id: number;
        contacts: {
            id: number;
            name: string;
            email: string;
            std_code: string;
            phone: string;
            designation: string;
        }[];
        created_by: {
            name: string;
            id: number;
        };
        assigned_to: {
            name: string;
            id: number;
        };
        organisation?: {
            name: string,
            id: number
        };
        lead?: number | {
            id: number;
            owner: {
                name: string;
                id: number;
                is_active: boolean;
            };
            organisation: {
                name: string;
                id: number;
            };
            title: string;
            currency: null | string;
            service_fee: null | string;
            service_fee_range: string;
            retainer_advance: boolean;
            exclusivity: boolean;
            source: string;
            status: string;
            reason: string;
            is_converted_to_prospect: boolean;
            archived: boolean;
            created_at: string;
            updated_at: string;
            verification_time: string;
            closure_time: string;
            role: number;
            fullfilled_by: null | string;
            closed_by: null | string;
            created_by: number;
            updated_by: number;
        }
        owner?: {
            name: string,
            id: number,
            is_active: boolean
        },
        status: string | null;
        title: string;
        type: string;
        mode: string;
        due_date: string;
        reminder: number;
        rescheduled: number;
        created_at: string;
        closed_at: string | null;

        contact: number[];
    };
    type: string;
    is_viewed: boolean;
    archived: boolean;
    description: string;
    model_name: string;
    object_id: number;
    created_at: string;
    user: number;

}

export interface DuplicateError {
    phone: boolean,
    email: boolean
}

export interface DealsGetResponse {
    id: number;
    created_by: {
        name: string;
        id: number;
        is_active: boolean;
    };
    updated_by: {
        name: string;
        id: number;
        is_active: boolean;
    };
    owner: {
        name: string;
        id: number;
        is_active: boolean;
    };
    prospect: {
        id: number;
        created_by: {
            name: string;
            id: number;
            is_active: boolean;
        };
        updated_by: {
            name: string;
            id: number;
            is_active: boolean;
        };
        owner: {
            name: string;
            id: number;
            is_active: boolean;
        };
        lead: {
            id: number;
            created_by: {
                name: string;
                id: number;
                is_active: boolean;
            };
            updated_by: {
                name: string;
                id: number;
                is_active: boolean;
            };
            owner: {
                name: string;
                id: number;
                is_active: boolean;
            };
            role: {
                id: number;
                role_type: string;
                budget_range: string;
                fixed_budget: string;
                fixed_budget_ul: string;
                esop_rsu: string;
                region: string;
                location: string;
                time_To_fill: string;
                archived: boolean;
            };
            organisation: {
                id: number;
                contacts: {
                    id: number;
                    created_by: {
                        name: string;
                        id: number;
                        is_active: boolean;
                    };
                    updated_by: {
                        name: string;
                        id: number;
                        is_active: boolean;
                    };
                    organisation: {
                        name: string;
                        id: number;
                    };
                    name: string;
                    email: string;
                    std_code: string;
                    phone: string;
                    designation: string;
                    type: string;
                    archived: boolean;
                    created_at: string;
                    updated_at: string;
                }[];
                created_by: {
                    name: string;
                    id: number;
                    is_active: boolean;
                };
                updated_by: {
                    name: string;
                    id: number;
                    is_active: boolean;
                };
                lead_count: number;
                name: string;
                registered_name: string;
                govt_id: string;
                billing_address: string;
                shipping_address: string;
                industry: string;
                domain: string;
                size: string;
                last_funding_stage: string;
                last_funding_amount: string;
                funding_currency: string | null;
                segment: string;
                archived: boolean;
                created_at: string;
                updated_at: string;
            };
            title: string;
            currency: string | null;
            service_fee: string;
            service_fee_range: string;
            retainer_advance: boolean;
            exclusivity: boolean;
            source: string;
            flat_fee: string | null;
            equity_fee: string | null;
            status: string;
            reason: string;
            is_converted_to_prospect: boolean;
            archived: boolean;
            created_at: string;
            updated_at: string;
            verification_time: string;
            closure_time: string;
            fullfilled_by: any; // You might want to specify the correct type
            closed_by: any; // You might want to specify the correct type
        };
        status: string;
        reason: string | null;
        is_converted_to_deal: boolean;
        archived: boolean;
        created_at: string;
    };
    deal_value: string;
    status: string;
    reason: string | null;
    archived: boolean;
    created_at: string;
}
export interface UploadedFile {
    id: number;
    uploaded_by: {
        name: string;
        id: number;
        is_active: boolean;
    };
    file: string;
    uploaded_at: string;
    sent_on: string | null;
    prospect: number;
}

export type FilterQuery = { filterFieldName: string, value: string | null }

export interface RelatedEntitiesGetResponse {
    leads: LeadInterface[],
    prospects: ProspectsGetResponse[],
    deal: DealsGetResponse[]
}