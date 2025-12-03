use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub target_tokens: Vec<String>,
    pub paused: bool,
    pub transfers_enabled: bool,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const BLACKLIST: Map<&str, bool> = Map::new("blacklist");
