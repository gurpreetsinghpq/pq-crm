
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
    created_by: string;
    updated_by: string;
    owner: string;
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
    owner: string;
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
    token: string;
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
    organisation: number;
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
    created_by: string;
    updated_by: string;
    owner: string;
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
    archived: boolean;
    organisation: number;
}
