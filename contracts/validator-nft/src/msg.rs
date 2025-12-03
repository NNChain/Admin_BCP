use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Decimal, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: String,
    pub base_uri: String,  // IPFS for validator images/MP4s
}

#[cw_serde]
pub enum ExecuteMsg {
    // Admin only
    MintValidator { 
        validator_id: String, 
        validator_type: u8,  // 0,1,2,3
        price_usd: Uint128,  // USD value (e.g., 1000 = $1000)
        max_supply: u32,
        commission_rate: Decimal,  // Validator commission (e.g., 0.05 = 5%)
        transfers_enabled: bool,
        active: bool,
    },
    UpdateValidator {
        validator_id: String,
        price_usd: Option<Uint128>,
        commission_rate: Option<Decimal>,
        transfers_enabled: Option<bool>,
        active: Option<bool>,
        frozen: Option<bool>,
    },
    
    // Validator Owner
    TransferValidator { validator_id: String, new_owner: String },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ConfigResponse)]
    Config {},
    #[returns(ValidatorInfoResponse)]
    ValidatorInfo { validator_id: String },
    #[returns(ValidatorsListResponse)]
    ValidatorsList { start_after: Option<String>, limit: Option<u32> },
    #[returns(MarketCapResponse)]
    TotalMarketCap {},
}

#[cw_serde]
pub struct ConfigResponse {
    pub admin: String,
    pub base_uri: String,
}

#[cw_serde]
pub struct ValidatorInfoResponse {
    pub validator_id: String,
    pub owner: String,
    pub validator_type: u8,  // 0,1,2,3
    pub price_usd: Uint128,
    pub max_supply: u32,
    pub commission_rate: Decimal,
    pub transfers_enabled: bool,
    pub active: bool,
    pub frozen: bool,
    pub minted_count: u32,
    pub market_cap_usd: Uint128,
}

#[cw_serde]
pub struct ValidatorsListResponse {
    pub validators: Vec<ValidatorListItem>,
}

#[cw_serde]
pub struct ValidatorListItem {
    pub validator_id: String,
    pub validator_type: u8,
    pub owner: String,
    pub price_usd: Uint128,
    pub active: bool,
    pub transfers_enabled: bool,
}

#[cw_serde]
pub struct MarketCapResponse {
    pub total_market_cap_usd: Uint128,
}