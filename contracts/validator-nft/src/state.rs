use cosmwasm_std::{Addr, Decimal, Uint128};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub base_uri: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct ValidatorNFT {
    pub owner: Addr,
    pub validator_type: u8,  // 0,1,2,3
    pub price_usd: Uint128,  // USD value
    pub max_supply: u32,
    pub minted_count: u32,
    pub commission_rate: Decimal,
    pub transfers_enabled: bool,
    pub active: bool,
    pub frozen: bool,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const VALIDATORS: Map<&str, ValidatorNFT> = Map::new("validators");
pub const TOTAL_MARKET_CAP: Item<Uint128> = Item::new("total_market_cap");