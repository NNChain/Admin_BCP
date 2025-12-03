use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Decimal, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: String,
    pub denom: String,  // "nusd"
    pub base_uri: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    // Admin only
    MintRwa {
        rwa_id: String,
        name: String,
        description: String,
        price_usd: Uint128,
        max_supply: u32,
        transfers_enabled: bool,
        active: bool,
    },
    UpdateRwaPrice { rwa_id: String, price_usd: Uint128 },
    UpdateRwaStatus {
        rwa_id: String,
        transfers_enabled: Option<bool>,
        active: Option<bool>,
        frozen: Option<bool>,
    },
    AddVaultCollateral { rwa_id: String, amount: Uint128 },
    
    // RWA Owner
    TransferRwa { rwa_id: String, new_owner: String },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ConfigResponse)]
    Config {},
    #[returns(RwaInfoResponse)]
    RwaInfo { rwa_id: String },
    #[returns(RwasListResponse)]
    RwasList { start_after: Option<String>, limit: Option<u32> },
    #[returns(TotalMarketCapResponse)]
    TotalMarketCap {},
    #[returns(TotalVaultValueResponse)]
    TotalVaultValue {},
}

#[cw_serde]
pub struct ConfigResponse {
    pub admin: String,
    pub denom: String,
    pub base_uri: String,
}

#[cw_serde]
pub struct RwaInfoResponse {
    pub rwa_id: String,
    pub owner: String,
    pub name: String,
    pub description: String,
    pub price_usd: Uint128,
    pub max_supply: u32,
    pub minted_count: u32,
    pub vault_balance: Uint128,
    pub transfers_enabled: bool,
    pub active: bool,          // <-- MADE PUBLIC
    pub frozen: bool,          // <-- MADE PUBLIC
    pub market_cap_usd: Uint128, // <-- MADE PUBLIC
}


#[cw_serde]
pub struct RwasListResponse {
    pub rwas: Vec<RwaListItem>,
}

#[cw_serde]
pub struct RwaListItem {
    pub rwa_id: String,
    pub name: String,
    pub owner: String,
    pub price_usd: Uint128,
    pub vault_balance: Uint128,
    pub active: bool,
}

#[cw_serde]
pub struct TotalMarketCapResponse {
    pub total_market_cap_usd: Uint128,
}

#[cw_serde]
pub struct TotalVaultValueResponse {
    pub total_vault_value: Uint128,
}
