use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub fee_percent: u8,
    pub treasury: Addr,
    pub total_volume: Uint128,
    pub total_fees: Uint128,
}

pub const CONFIG: Item<Config> = Item::new("config");