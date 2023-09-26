
export interface IValueLabel {
    value: string
    label: string
    isDefault?: boolean
    icon?: any
    class?: string
    acronym?: string
}


export interface Client {
    organisation: Organisation;
    role_details: RoleDetails;
    source: string;
    title: string;
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
    created_by:  {
        id: number;
        name: string
    };
    updated_by: string;
    owner: {
        id: number;
        name: string
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
    owner: number;
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
    segment: string;
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
    created_by:  {
        id: number;
        name: string
    };
    updated_by: string;
    owner: {
        id: number;
        name: string
    };
    lead: {
        id: number;
        created_by: string;
        updated_by: string;
        owner: string;
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

}

export interface PatchProspect {
    status: string,
    reason: string,
    is_converted_to_deal: boolean,
    archived: boolean
    owner: boolean
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
    // time_zone: string | null;
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
    region: string
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
}
export interface Stepper {
    title?: string;
    contacts?: string[];
    email?: string;
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
    isLastChild?:boolean
    
  }
  
