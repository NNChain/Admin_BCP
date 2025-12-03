#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Uint128, Coin, CosmosMsg, BankMsg,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::*;
use crate::state::*;

const CONTRACT_NAME: &str = "crates.io:payment-router";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

// ========================== INIT ===========================

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let admin = deps.api.addr_validate(&msg.admin)?;
    let treasury = deps.api.addr_validate(&msg.treasury)?;

    if !(1..=5).contains(&msg.fee_percent) {
        return Err(ContractError::InvalidFee {});
    }

    CONFIG.save(
        deps.storage,
        &Config {
            admin,
            fee_percent: msg.fee_percent,
            treasury,
            total_volume: Uint128::zero(),
            total_fees: Uint128::zero(),
        },
    )?;

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender)
        .add_attribute("fee_percent", msg.fee_percent.to_string()))
}

// ========================== EXECUTE ===========================

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::RoutePayment { denom } =>
            execute_route_payment(deps, env, info, denom),

        ExecuteMsg::UpdateConfig { fee_percent, treasury } =>
            execute_update_config(deps, info, fee_percent, treasury),
    }
}

fn execute_route_payment(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    denom: String,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;

    let sent_fund = info.funds
        .into_iter()
        .find(|c| c.denom == denom)
        .ok_or(ContractError::NoFunds { denom: denom.clone() })?;

    let amount = sent_fund.amount;

    // fee = amount * percent / 100
    let fee = amount * Uint128::from(config.fee_percent) / Uint128::new(100);
    let principal = amount.saturating_sub(fee);

    // ------------- Update Stats -------------
    config.total_volume += amount;
    config.total_fees += fee;
    CONFIG.save(deps.storage, &config)?;

    let mut msgs: Vec<CosmosMsg> = vec![];

    // send fee → treasury
    if !fee.is_zero() {
        msgs.push(CosmosMsg::Bank(BankMsg::Send {
            to_address: config.treasury.to_string(),
            amount: vec![Coin::new(fee.u128(), denom.clone())],
        }));
    }

    // refund or forward main amount → sender
    if !principal.is_zero() {
        msgs.push(CosmosMsg::Bank(BankMsg::Send {
            to_address: info.sender.to_string(),
            amount: vec![Coin::new(principal.u128(), denom.clone())],
        }));
    }

    Ok(Response::new()
        .add_attribute("action", "route_payment")
        .add_attribute("denom", denom)
        .add_attribute("amount", amount.to_string())
        .add_attribute("fee", fee.to_string())
        .add_attribute("principal", principal.to_string())
        .add_messages(msgs))
}

// ----------------- CONFIG UPDATE -----------------

fn execute_update_config(
    deps: DepsMut,
    info: MessageInfo,
    fee_percent: Option<u8>,
    treasury: Option<String>,
) -> Result<Response, ContractError> {
    let mut cfg = CONFIG.load(deps.storage)?;

    if info.sender != cfg.admin {
        return Err(ContractError::Unauthorized {});
    }

    if let Some(fp) = fee_percent {
        if !(1..=5).contains(&fp) {
            return Err(ContractError::InvalidFee {});
        }
        cfg.fee_percent = fp;
    }

    if let Some(t) = treasury {
        cfg.treasury = deps.api.addr_validate(&t)?;
    }

    CONFIG.save(deps.storage, &cfg)?;

    Ok(Response::new()
        .add_attribute("action", "update_config")
        .add_attribute("fee_percent", cfg.fee_percent.to_string())
        .add_attribute("treasury", cfg.treasury.to_string()))
}

// ========================== QUERY ===========================

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_json_binary(&query_config(deps)?),
        QueryMsg::TotalFees {} => to_json_binary(&query_total_fees(deps)?),
    }
}

fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let cfg = CONFIG.load(deps.storage)?;
    Ok(ConfigResponse {
        admin: cfg.admin.to_string(),
        fee_percent: cfg.fee_percent,
        treasury: cfg.treasury.to_string(),
        total_volume: cfg.total_volume,
        total_fees: cfg.total_fees,
    })
}

fn query_total_fees(deps: Deps) -> StdResult<TotalFeesResponse> {
    let cfg = CONFIG.load(deps.storage)?;
    Ok(TotalFeesResponse {
        total_fees: cfg.total_fees,
        treasury_balance: Coin::new(0u128, "nnc"),
    })
}
