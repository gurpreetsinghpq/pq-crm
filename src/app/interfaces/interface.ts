
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
    retainer_advance: number | null;
    exclusivity: string | null;
    source: string;
    status: string;
    is_converted_to_prospect: boolean;
    archived: boolean;
    created_at: string;
    updated_at: string;
    reason: string
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

export interface PatchLead  {
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