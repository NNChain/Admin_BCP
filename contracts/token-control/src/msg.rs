use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Uint128;

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: String,
    pub target_tokens: Vec<String>, // ["nnc", "nusd"]
}

#[cw_serde]
pub enum ExecuteMsg {
    // Admin only
    UpdateConfig {
        paused: Option<bool>,
        transfers_enabled: Option<bool>,
    },
    AddBlacklist { addresses: Vec<String> },
    RemoveBlacklist { addresses: Vec<String> },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ConfigResponse)]
    Config {},
    #[returns(BlacklistResponse)]
    Blacklist { start_after: Option<String>, limit: Option<u32> },
    #[returns(StatusResponse)]
    Status {},
    #[returns(TransferCheckResponse)]
    TransferCheck { from: String, to: String, amount: Uint128 },
}

#[cw_serde]
pub struct ConfigResponse {
    pub admin: String,
    pub target_tokens: Vec<String>,
    pub paused: bool,
    pub transfers_enabled: bool,
}

#[cw_serde]
pub struct BlacklistResponse {
    pub addresses: Vec<String>,
}

#[cw_serde]
pub struct StatusResponse {
    pub paused: bool,
    pub transfers_enabled: bool,
    pub blacklist_count: u32,
}

#[cw_serde]
pub struct TransferCheckResponse {
    pub approved: bool,
    pub reason: Option<String>,
}
