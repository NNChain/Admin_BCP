#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Order, Addr,
};
use cw2::set_contract_version;
use cw_storage_plus::Bound;

use crate::error::ContractError;
use crate::msg::*;
use crate::state::*;

const CONTRACT_NAME: &str = "crates.io:admin-role";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let super_admin = deps.api.addr_validate(&msg.super_admin)?;

    let config = Config {
        super_admin: super_admin.clone(),
    };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("super_admin", super_admin.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;

    match msg {
        ExecuteMsg::GrantAdminRole { contract, address } => {
            execute_grant_role(deps, &config, info.sender, contract, address)
        }
        ExecuteMsg::RevokeAdminRole { contract, address } => {
            execute_revoke_role(deps, &config, info.sender, contract, address)
        }
        ExecuteMsg::RegisterContract { contract } => {
            execute_register_contract(deps, &config, info.sender, contract)
        }
    }
}

fn execute_grant_role(
    deps: DepsMut,
    config: &Config,
    sender: Addr,
    contract: String,
    address: String,
) -> Result<Response, ContractError> {
    let contract_key = contract.clone();

    if sender != config.super_admin {
        let is_admin = CONTRACT_ADMINS
            .may_load(deps.storage, contract_key.as_str())?
            .map(|ca| ca.admins.contains(&sender))
            .unwrap_or(false);

        if !is_admin {
            return Err(ContractError::NotAdmin { contract: contract_key });
        }
    }

    let addr = deps.api.addr_validate(&address)?;
    let mut admins = CONTRACT_ADMINS
        .may_load(deps.storage, contract_key.as_str())?
        .unwrap_or(ContractAdmins { admins: vec![] });

    if !admins.admins.contains(&addr) {
        admins.admins.push(addr.clone());
        CONTRACT_ADMINS.save(deps.storage, contract_key.as_str(), &admins)?;
    }

    Ok(Response::new()
        .add_attribute("action", "grant_admin_role")
        .add_attribute("contract", contract_key)
        .add_attribute("address", addr.to_string()))
}

fn execute_revoke_role(
    deps: DepsMut,
    config: &Config,
    sender: Addr,
    contract: String,
    address: String,
) -> Result<Response, ContractError> {
    let contract_key = contract.clone();

    if sender != config.super_admin {
        let is_admin = CONTRACT_ADMINS
            .may_load(deps.storage, contract_key.as_str())?
            .map(|ca| ca.admins.contains(&sender))
            .unwrap_or(false);

        if !is_admin {
            return Err(ContractError::NotAdmin { contract: contract_key });
        }
    }

    let addr = deps.api.addr_validate(&address)?;
    let mut admins = CONTRACT_ADMINS
        .may_load(deps.storage, contract_key.as_str())?
        .ok_or(ContractError::NotAdmin { contract: contract_key.clone() })?;

    admins.admins.retain(|a| a != &addr);
    CONTRACT_ADMINS.save(deps.storage, contract_key.as_str(), &admins)?;

    Ok(Response::new()
        .add_attribute("action", "revoke_admin_role")
        .add_attribute("contract", contract_key)
        .add_attribute("address", addr.to_string()))
}

fn execute_register_contract(
    deps: DepsMut,
    config: &Config,
    sender: Addr,
    contract: String,
) -> Result<Response, ContractError> {
    if sender != config.super_admin {
        return Err(ContractError::Unauthorized {});
    }

    let contract_key = contract.clone();
    REGISTERED_CONTRACTS.save(deps.storage, contract_key.as_str(), &true)?;

    Ok(Response::new()
        .add_attribute("action", "register_contract")
        .add_attribute("contract", contract_key))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Admins { contract, start_after, limit } => {
            to_json_binary(&query_admins(deps, contract, start_after, limit)?)
        }
        QueryMsg::IsAdmin { contract, address } => {
            to_json_binary(&query_is_admin(deps, contract, address)?)
        }
        QueryMsg::SuperAdmin {} => to_json_binary(&query_super_admin(deps)?),
        QueryMsg::Contracts { start_after, limit } => {
            to_json_binary(&query_contracts(deps, start_after, limit)?)
        }
    }
}

fn query_admins(
    deps: Deps,
    contract: String,
    _start_after: Option<String>,
    _limit: Option<u32>,
) -> StdResult<AdminsResponse> {
    let admins_data = CONTRACT_ADMINS
        .may_load(deps.storage, contract.as_str())?
        .unwrap_or(ContractAdmins { admins: vec![] });

    let admins: Vec<String> = admins_data
        .admins
        .iter()
        .map(|a| a.to_string())
        .collect();

    let total = admins.len() as u32;

    Ok(AdminsResponse { admins, total })
}

fn query_is_admin(deps: Deps, contract: String, address: String) -> StdResult<IsAdminResponse> {
    let addr = deps.api.addr_validate(&address)?;
    let admins_data = CONTRACT_ADMINS
        .may_load(deps.storage, contract.as_str())?
        .unwrap_or(ContractAdmins { admins: vec![] });

    let is_admin = admins_data.admins.contains(&addr);

    Ok(IsAdminResponse { is_admin })
}

fn query_super_admin(deps: Deps) -> StdResult<SuperAdminResponse> {
    let config = CONFIG.load(deps.storage)?;
    Ok(SuperAdminResponse {
        super_admin: config.super_admin.to_string(),
    })
}

fn query_contracts(
    deps: Deps,
    start_after: Option<String>,
    limit: Option<u32>,
) -> StdResult<ContractsResponse> {
    let limit = limit.unwrap_or(10).min(30) as usize;
    // use as_deref to get Option<&str> that lives long enough for Bound
    let start = start_after.as_deref().map(Bound::exclusive);

    let contracts: Vec<String> = REGISTERED_CONTRACTS
        .keys(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .collect::<StdResult<Vec<String>>>()?;

    Ok(ContractsResponse { contracts })
}
