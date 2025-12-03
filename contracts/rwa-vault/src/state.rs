use cosmwasm_std::{Addr, Decimal, Uint128};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub denom: String,  // "nusd"
    pub base_uri: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct RwaInfo {
    pub owner: Addr,
    pub name: String,
    pub description: String,
    pub price_usd: Uint128,
    pub max_supply: u32,
    pub minted_count: u32,
    pub transfers_enabled: bool,
    pub active: bool,
    pub frozen: bool,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const RWAS: Map<&str, RwaInfo> = Map::new("rwas");
pub const VAULT_BALANCES: Map<&str, Uint128> = Map::new("vault_balances");