#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Uint128, Order,
};
use cw2::set_contract_version;
use cw_storage_plus::Bound;

use crate::error::ContractError;
use crate::msg::*;
use crate::state::*;

const CONTRACT_NAME: &str = "crates.io:rwa-vault";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

//==========================================================
// INSTANTIATE
//==========================================================

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {

    let admin = deps.api.addr_validate(&msg.admin)?;

    CONFIG.save(deps.storage, &Config {
        admin,
        denom: msg.denom,
        base_uri: msg.base_uri,
    })?;

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender))
}

//==========================================================
// EXECUTE
//==========================================================

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {

    let config = CONFIG.load(deps.storage)?;

    match msg {

        ExecuteMsg::MintRwa { rwa_id, name, description, price_usd, max_supply, transfers_enabled, active } =>
            execute_mint_rwa(deps, info, &config, rwa_id, name, description, price_usd, max_supply, transfers_enabled, active),

        ExecuteMsg::UpdateRwaPrice { rwa_id, price_usd } =>
            execute_update_price(deps, info, &config, rwa_id, price_usd),

        ExecuteMsg::UpdateRwaStatus { rwa_id, transfers_enabled, active, frozen } =>
            execute_update_status(deps, info, &config, rwa_id, transfers_enabled, active, frozen),

        ExecuteMsg::AddVaultCollateral { rwa_id, amount } =>
            execute_add_collateral(deps, env, info, &config, rwa_id, amount),

        ExecuteMsg::TransferRwa { rwa_id, new_owner } =>
            execute_transfer_rwa(deps, info, &config, rwa_id, new_owner),
    }
}

//==========================================================
// MINT
//==========================================================

fn execute_mint_rwa(
    deps: DepsMut,
    info: MessageInfo,
    config: &Config,
    rwa_id: String,
    name: String,
    description: String,
    price_usd: Uint128,
    max_supply: u32,
    transfers_enabled: bool,
    active: bool,
) -> Result<Response, ContractError> {

    if info.sender != config.admin { return Err(ContractError::Unauthorized {}); }

    if RWAS.has(deps.storage, &rwa_id) {
        return Err(ContractError::RwaExists { rwa_id });
    }

    RWAS.save(deps.storage, &rwa_id, &RwaInfo {
        owner: info.sender.clone(),
        name: name.clone(),
        description,
        price_usd,
        max_supply,
        minted_count: 1,
        transfers_enabled,
        active,
        frozen: false,
    })?;

    VAULT_BALANCES.save(deps.storage, &rwa_id, &Uint128::zero())?;

    Ok(Response::new()
        .add_attribute("action", "mint_rwa")
        .add_attribute("rwa_id", rwa_id)
        .add_attribute("name", name))
}

//==========================================================
// UPDATE PRICE
//==========================================================

fn execute_update_price(
    deps: DepsMut,
    info: MessageInfo,
    config: &Config,
    rwa_id: String,
    price_usd: Uint128,
) -> Result<Response, ContractError> {

    if info.sender != config.admin { return Err(ContractError::Unauthorized {}); }

    let mut rwa = RWAS.load(deps.storage, &rwa_id)?;
    rwa.price_usd = price_usd;

    RWAS.save(deps.storage, &rwa_id, &rwa)?;

    Ok(Response::new()
        .add_attribute("action", "update_price")
        .add_attribute("rwa_id", rwa_id))
}

//==========================================================
// UPDATE STATUS
//==========================================================

fn execute_update_status(
    deps: DepsMut,
    info: MessageInfo,
    config: &Config,
    rwa_id: String,
    transfers_enabled: Option<bool>,
    active: Option<bool>,
    frozen: Option<bool>,
) -> Result<Response, ContractError> {

    if info.sender != config.admin { return Err(ContractError::Unauthorized {}); }

    let mut rwa = RWAS.load(deps.storage, &rwa_id)?;

    if let Some(v) = transfers_enabled { rwa.transfers_enabled = v; }
    if let Some(v) = active { rwa.active = v; }
    if let Some(v) = frozen { rwa.frozen = v; }

    RWAS.save(deps.storage, &rwa_id, &rwa)?;

    Ok(Response::new()
        .add_attribute("action", "update_status")
        .add_attribute("rwa_id", rwa_id))
}

//==========================================================
// ADD COLLATERAL
//==========================================================

fn execute_add_collateral(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    config: &Config,
    rwa_id: String,
    amount: Uint128,
) -> Result<Response, ContractError> {

    // Validate funds received
    let sent = info.funds.iter()
        .find(|c| c.denom == config.denom)
        .ok_or(ContractError::InvalidDenom { expected: config.denom.clone() })?;

    if sent.amount < amount {
        return Err(ContractError::InsufficientVault {});
    }

    // Load existing vault balance then update
    let current = VAULT_BALANCES.may_load(deps.storage, &rwa_id)?.unwrap_or_default();
    let new_balance = current + sent.amount;

    VAULT_BALANCES.save(deps.storage, &rwa_id, &new_balance)?;

    Ok(Response::new()
        .add_attribute("action", "add_collateral")
        .add_attribute("rwa_id", rwa_id)
        .add_attribute("added", sent.amount)
        .add_attribute("new_balance", new_balance))
}

//==========================================================
// TRANSFER
//==========================================================

fn execute_transfer_rwa(
    deps: DepsMut,
    info: MessageInfo,
    config: &Config,
    rwa_id: String,
    new_owner: String,
) -> Result<Response, ContractError> {

    let mut rwa = RWAS.load(deps.storage, &rwa_id)?;

    if !rwa.transfers_enabled { return Err(ContractError::TransferDisabled {}); }
    if rwa.frozen { return Err(ContractError::RwaFrozen {}); }
    if info.sender != rwa.owner { return Err(ContractError::Unauthorized {}); }

    rwa.owner = deps.api.addr_validate(&new_owner)?;
    RWAS.save(deps.storage, &rwa_id, &rwa)?;

    Ok(Response::new()
        .add_attribute("action", "transfer_rwa")
        .add_attribute("rwa_id", rwa_id))
}

//==========================================================
// QUERY
//==========================================================

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(
    deps: Deps,
    _env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {

    match msg {
        QueryMsg::Config {} => to_json_binary(&query_config(deps)?),
        QueryMsg::RwaInfo { rwa_id } => to_json_binary(&query_rwa(deps, rwa_id)?),
        QueryMsg::RwasList { start_after, limit } => to_json_binary(&query_rwas_list(deps, start_after, limit)?),
        QueryMsg::TotalMarketCap {} => to_json_binary(&query_total_market_cap(deps)?),
        QueryMsg::TotalVaultValue {} => to_json_binary(&query_total_vault_value(deps)?),
    }
}

fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let c = CONFIG.load(deps.storage)?;
    Ok(ConfigResponse { admin:c.admin.to_string(), denom:c.denom, base_uri:c.base_uri })
}

fn query_rwa(deps: Deps, rwa_id:String) -> StdResult<RwaInfoResponse> {

    let rwa = RWAS.load(deps.storage,&rwa_id)?;
    let vault = VAULT_BALANCES.may_load(deps.storage,&rwa_id)?.unwrap_or_default();

    Ok(RwaInfoResponse {
        rwa_id,
        owner:rwa.owner.to_string(),
        name:rwa.name,
        description:rwa.description,
        price_usd:rwa.price_usd,
        max_supply:rwa.max_supply,
        minted_count:rwa.minted_count,
        vault_balance:vault,
        transfers_enabled:rwa.transfers_enabled,
        active:rwa.active,
        frozen:rwa.frozen,
        market_cap_usd:rwa.price_usd * Uint128::from(rwa.max_supply as u128),
    })
}

fn query_rwas_list(
    deps:Deps,
    start_after:Option<String>,
    limit:Option<u32>
)->StdResult<RwasListResponse>{

    let start = start_after.as_ref().map(|v| Bound::exclusive(v.as_str()));
    let limit = limit.unwrap_or(10).min(30) as usize;

    let result:StdResult<Vec<_>> = RWAS
        .range(deps.storage,start,None,Order::Ascending)
        .take(limit)
        .map(|item|{
            let(k,v)=item?;
            let vault=VAULT_BALANCES.may_load(deps.storage,&k)?.unwrap_or_default();

            Ok(RwaListItem{
                rwa_id:k,
                name:v.name,
                owner:v.owner.to_string(),
                price_usd:v.price_usd,
                vault_balance:vault,
                active:v.active,
            })
        }).collect();

    Ok(RwasListResponse{ rwas:result? })
}

fn query_total_market_cap(deps:Deps)->StdResult<TotalMarketCapResponse>{
    let mut total=Uint128::zero();

    for item in RWAS.range(deps.storage,None,None,Order::Ascending){
        let(_,rwa)=item?;
        total += rwa.price_usd * Uint128::from(rwa.max_supply as u128);
    }

    Ok(TotalMarketCapResponse{ total_market_cap_usd:total })
}

fn query_total_vault_value(deps:Deps)->StdResult<TotalVaultValueResponse>{
    let mut total=Uint128::zero();

    for item in VAULT_BALANCES.range(deps.storage,None,None,Order::Ascending){
        let(_,bal)=item?;
        total+=bal;
    }

    Ok(TotalVaultValueResponse{ total_vault_value:total })
}