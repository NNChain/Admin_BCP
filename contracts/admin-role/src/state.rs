use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub super_admin: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct ContractAdmins {
    pub admins: Vec<Addr>,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const CONTRACT_ADMINS: Map<&str, ContractAdmins> = Map::new("contract_admins");
pub const REGISTERED_CONTRACTS: Map<&str, bool> = Map::new("contracts");