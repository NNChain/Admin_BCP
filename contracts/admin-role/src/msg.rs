use cosmwasm_schema::{cw_serde, QueryResponses};

#[cw_serde]
pub struct InstantiateMsg {
    pub super_admin: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    // Super Admin only
    GrantAdminRole { contract: String, address: String },
    RevokeAdminRole { contract: String, address: String },
    // Contract owners call this
    RegisterContract { contract: String },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(AdminsResponse)]
    Admins { contract: String, start_after: Option<String>, limit: Option<u32> },
    #[returns(IsAdminResponse)]
    IsAdmin { contract: String, address: String },
    #[returns(SuperAdminResponse)]
    SuperAdmin {},
    #[returns(ContractsResponse)]
    Contracts { start_after: Option<String>, limit: Option<u32> },
}

#[cw_serde]
pub struct AdminsResponse {
    pub admins: Vec<String>,
    pub total: u32,
}

#[cw_serde]
pub struct IsAdminResponse {
    pub is_admin: bool,
}

#[cw_serde]
pub struct SuperAdminResponse {
    pub super_admin: String,
}

#[cw_serde]
pub struct ContractsResponse {
    pub contracts: Vec<String>,
}