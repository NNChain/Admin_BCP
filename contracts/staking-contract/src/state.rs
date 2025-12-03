use cosmwasm_std::{Addr, Decimal, Timestamp, Uint128};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub apr: Decimal,
    pub min_stake: Uint128,
    pub max_stake: Uint128,
    pub denom: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct StakeInfo {
    pub staker: Addr,
    pub amount: Uint128,
    pub staked_at: Timestamp,
    pub last_claim: Timestamp,
    pub total_claimed: Uint128,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const STAKES: Map<String, StakeInfo> = Map::new("stakes");  
pub const TOTAL_STAKED: Item<Uint128> = Item::new("total_staked");