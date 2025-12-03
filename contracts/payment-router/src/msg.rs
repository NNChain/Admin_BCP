use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Uint128, Coin};

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: String,
    pub fee_percent: u8,        // 1-5%
    pub treasury: String,       // Fee destination
}

#[cw_serde]
pub enum ExecuteMsg {
    RoutePayment { denom: String },
    UpdateConfig {
        fee_percent: Option<u8>,
        treasury: Option<String>,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ConfigResponse)]
    Config {},
    #[returns(TotalFeesResponse)]
    TotalFees {},
}

#[cw_serde]
pub struct ConfigResponse {
    pub admin: String,
    pub fee_percent: u8,
    pub treasury: String,
    pub total_volume: Uint128,
    pub total_fees: Uint128,
}

#[cw_serde]
pub struct TotalFeesResponse {
    pub total_fees: Uint128,
    pub treasury_balance: Coin,
}
