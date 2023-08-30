
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
        fixed_budget: number | null;
        fixed_budget_ul: number | null;
        esop_rsu: number | null;
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
    retainer_advance: number | null;
    exclusivity: string | null;
    source: string;
    status: string;
    is_converted_to_prospect: boolean;
    archived: boolean;
    created_at: string;
    updated_at: string;

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