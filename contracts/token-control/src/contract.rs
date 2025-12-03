#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Order,
};
use cw2::set_contract_version;
use cw_storage_plus::Bound;

use crate::error::ContractError;
use crate::msg::*;
use crate::state::*;

const CONTRACT_NAME: &str = "crates.io:token-control";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

//////////////////////////////////////////////////////
// INSTANTIATE
//////////////////////////////////////////////////////

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let admin = deps.api.addr_validate(&msg.admin)?;

    CONFIG.save(
        deps.storage,
        &Config {
            admin,
            target_tokens: msg.target_tokens,
            paused: false,
            transfers_enabled: true,
        },
    )?;

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender))
}

//////////////////////////////////////////////////////
// EXECUTE
//////////////////////////////////////////////////////

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;

    match msg {
        ExecuteMsg::UpdateConfig { paused, transfers_enabled } =>
            execute_update_config(deps, info, &mut config, paused, transfers_enabled),

        ExecuteMsg::AddBlacklist { addresses } =>
            execute_add_blacklist(deps, info, &config, addresses),

        ExecuteMsg::RemoveBlacklist { addresses } =>
            execute_remove_blacklist(deps, info, &config, addresses),
    }
}

fn execute_update_config(
    deps: DepsMut,
    info: MessageInfo,
    config: &mut Config,
    paused: Option<bool>,
    transfers_enabled: Option<bool>,
) -> Result<Response, ContractError> {
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }

    if let Some(p) = paused { config.paused = p; }
    if let Some(t) = transfers_enabled { config.transfers_enabled = t; }

    CONFIG.save(deps.storage, config)?;

    Ok(Response::new()
        .add_attribute("action", "update_config")
        .add_attribute("paused", config.paused.to_string())
        .add_attribute("transfers_enabled", config.transfers_enabled.to_string()))
}

fn execute_add_blacklist(
    deps: DepsMut,
    info: MessageInfo,
    config: &Config,
    addresses: Vec<String>,
) -> Result<Response, ContractError> {
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }

    for addr in &addresses {
        let validated = deps.api.addr_validate(addr)?;
        BLACKLIST.save(deps.storage, validated.as_str(), &true)?;
    }

    Ok(Response::new()
        .add_attribute("action", "blacklist_add")
        .add_attribute("count", addresses.len().to_string()))
}

fn execute_remove_blacklist(
    deps: DepsMut,
    info: MessageInfo,
    config: &Config,
    addresses: Vec<String>,
) -> Result<Response, ContractError> {
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }

    for addr in &addresses {
        BLACKLIST.remove(deps.storage, addr.as_str());
    }

    Ok(Response::new()
        .add_attribute("action", "blacklist_remove")
        .add_attribute("count", addresses.len().to_string()))
}

//////////////////////////////////////////////////////
// QUERY
//////////////////////////////////////////////////////

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_json_binary(&query_config(deps)?),
        QueryMsg::Blacklist { start_after, limit } => to_json_binary(&query_blacklist(deps, start_after, limit)?),
        QueryMsg::Status {} => to_json_binary(&query_status(deps)?),
        QueryMsg::TransferCheck { from, to, amount: _ } => to_json_binary(&query_transfer_check(deps, from, to)?),
    }
}

fn query_transfer_check(deps: Deps, from: String, to: String) -> StdResult<TransferCheckResponse> {
    let cfg = CONFIG.load(deps.storage)?;

    if cfg.paused {
        return Ok(TransferCheckResponse { approved: false, reason: Some("Token paused".into()) });
    }
    if !cfg.transfers_enabled {
        return Ok(TransferCheckResponse { approved: false, reason: Some("Transfers disabled".into()) });
    }

    let from = deps.api.addr_validate(&from)?;
    let to = deps.api.addr_validate(&to)?;

    if BLACKLIST.has(deps.storage, from.as_str()) {
        return Ok(TransferCheckResponse { approved: false, reason: Some("Sender blacklisted".into()) });
    }
    if BLACKLIST.has(deps.storage, to.as_str()) {
        return Ok(TransferCheckResponse { approved: false, reason: Some("Receiver blacklisted".into()) });
    }

    Ok(TransferCheckResponse { approved: true, reason: None })
}

fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let cfg = CONFIG.load(deps.storage)?;
    Ok(ConfigResponse {
        admin: cfg.admin.to_string(),
        target_tokens: cfg.target_tokens,
        paused: cfg.paused,
        transfers_enabled: cfg.transfers_enabled,
    })
}

fn query_blacklist(
    deps: Deps,
    start_after: Option<String>,
    limit: Option<u32>,
) -> StdResult<BlacklistResponse> {
    let limit = limit.unwrap_or(20) as usize;
    let start = start_after.as_ref().map(|s| Bound::exclusive(s.as_str()));

    let addresses: Vec<String> = BLACKLIST
        .keys(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|k| k.map_err(Into::into))
        .collect::<StdResult<Vec<_>>>()?;

    Ok(BlacklistResponse { addresses })
}

fn query_status(deps: Deps) -> StdResult<StatusResponse> {
    let cfg = CONFIG.load(deps.storage)?;
    let count = BLACKLIST.keys(deps.storage, None, None, Order::Ascending).count() as u32;

    Ok(StatusResponse {
        paused: cfg.paused,
        transfers_enabled: cfg.transfers_enabled,
        blacklist_count: count,
    })
}
