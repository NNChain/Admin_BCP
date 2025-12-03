#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response,
    StdResult, Uint128, Decimal, Order,
};
use cw2::set_contract_version;
use cw_storage_plus::Bound;

use crate::error::ContractError;
use crate::msg::*;
use crate::state::*;

const CONTRACT_NAME: &str = "crates.io:validator-nft";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {

    let admin = deps.api.addr_validate(&msg.admin)?;
    let config = Config { admin, base_uri: msg.base_uri };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONFIG.save(deps.storage, &config)?;
    TOTAL_MARKET_CAP.save(deps.storage, &Uint128::zero())?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::MintValidator { validator_id, validator_type, price_usd, max_supply, commission_rate, transfers_enabled, active } => {
            try_mint_validator(deps, info, validator_id, validator_type, price_usd, max_supply, commission_rate, transfers_enabled, active)
        }
        ExecuteMsg::UpdateValidator { validator_id, price_usd, commission_rate, transfers_enabled, active, frozen } => {
            try_update_validator(deps, info, validator_id, price_usd, commission_rate, transfers_enabled, active, frozen)
        }
        ExecuteMsg::TransferValidator { validator_id, new_owner } => {
            try_transfer_validator(deps, info, validator_id, new_owner)
        }
    }
}


// ---------------------- MINT VALIDATOR --------------------------

fn try_mint_validator(
    deps: DepsMut,
    info: MessageInfo,
    validator_id: String,
    validator_type: u8,
    price_usd: Uint128,
    max_supply: u32,
    commission_rate: Decimal,
    transfers_enabled: bool,
    active: bool,
) -> Result<Response, ContractError> {

    let config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin { return Err(ContractError::Unauthorized {}); }
    if validator_type > 3 { return Err(ContractError::InvalidValidatorType {}); }

    if VALIDATORS.has(deps.storage, validator_id.as_str()) {
        return Err(ContractError::ValidatorExists { validator_id: validator_id.clone() });
    }

    let validator = ValidatorNFT {
        owner: info.sender.clone(),
        validator_type,
        price_usd,
        max_supply,
        minted_count: 1,
        commission_rate,
        transfers_enabled,
        active,
        frozen: false,
    };

    VALIDATORS.save(deps.storage, validator_id.as_str(), &validator)?;

    Ok(Response::new()
        .add_attribute("action", "mint_validator")
        .add_attribute("validator_id", validator_id)
        .add_attribute("price_usd", price_usd.to_string()))
}


// ---------------------- UPDATE VALIDATOR ------------------------

fn try_update_validator(
    deps: DepsMut,
    info: MessageInfo,
    validator_id: String,
    price_usd: Option<Uint128>,
    commission_rate: Option<Decimal>,
    transfers_enabled: Option<bool>,
    active: Option<bool>,
    frozen: Option<bool>,
) -> Result<Response, ContractError> {

    let config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin { return Err(ContractError::Unauthorized {}); }

    let mut validator = VALIDATORS.load(deps.storage, validator_id.as_str())?;

    if let Some(new_price) = price_usd {
        validator.price_usd = new_price;
    }
    if let Some(rate) = commission_rate { validator.commission_rate = rate; }
    if let Some(enabled) = transfers_enabled { validator.transfers_enabled = enabled; }
    if let Some(status) = active { validator.active = status; }
    if let Some(freeze_status) = frozen { validator.frozen = freeze_status; }

    VALIDATORS.save(deps.storage, validator_id.as_str(), &validator)?;

    Ok(Response::new()
        .add_attribute("action", "update_validator")
        .add_attribute("validator_id", validator_id))
}


// ---------------------- TRANSFER VALIDATOR ----------------------

fn try_transfer_validator(
    deps: DepsMut,
    _info: MessageInfo,
    validator_id: String,
    new_owner_str: String,
) -> Result<Response, ContractError> {

    let mut validator = VALIDATORS.load(deps.storage, validator_id.as_str())?;

    if !validator.transfers_enabled { return Err(ContractError::TransferDisabled {}); }
    if validator.frozen { return Err(ContractError::ValidatorFrozen {}); }

    let new_owner = deps.api.addr_validate(&new_owner_str)?;
    let old_owner = validator.owner.to_string();

    validator.owner = new_owner.clone();
    VALIDATORS.save(deps.storage, validator_id.as_str(), &validator)?;

    Ok(Response::new()
        .add_attribute("action","transfer_validator")
        .add_attribute("from", old_owner)
        .add_attribute("to", new_owner.to_string()))
}


// ---------------------- QUERY HANDLER --------------------------

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_json_binary(&query_config(deps)?),
        QueryMsg::ValidatorInfo { validator_id } => to_json_binary(&query_validator(deps, validator_id)?),
        QueryMsg::ValidatorsList { start_after, limit } => to_json_binary(&query_validators_list(deps, start_after, limit)?),
        QueryMsg::TotalMarketCap {} => to_json_binary(&query_market_cap(deps)?),
    }
}

// Return Config
fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let config = CONFIG.load(deps.storage)?;
    Ok(ConfigResponse {
        admin: config.admin.to_string(),
        base_uri: config.base_uri,
    })
}

// Single validator details w/ market cap
fn query_validator(deps: Deps, validator_id: String) -> StdResult<ValidatorInfoResponse> {
    let v = VALIDATORS.load(deps.storage, validator_id.as_str())?;
    Ok(ValidatorInfoResponse {
        validator_id,
        owner: v.owner.to_string(),
        validator_type: v.validator_type,
        price_usd: v.price_usd,
        max_supply: v.max_supply,
        commission_rate: v.commission_rate,
        transfers_enabled: v.transfers_enabled,
        active: v.active,
        frozen: v.frozen,
        minted_count: v.minted_count,
        market_cap_usd: v.price_usd * Uint128::from(v.max_supply as u128),
    })
}

// List all validators
fn query_validators_list(deps: Deps, start_after: Option<String>, limit: Option<u32>)
-> StdResult<ValidatorsListResponse> {

    let limit = limit.unwrap_or(10).min(30) as usize;
    let start_bound = start_after.as_ref().map(|s| Bound::exclusive(s.as_str()));

    let validators: StdResult<Vec<_>> = VALIDATORS
        .range(deps.storage,start_bound,None,Order::Ascending)
        .take(limit)
        .map(|item| {
            let (k, v) = item?;
            Ok(ValidatorListItem {
                validator_id: k,
                validator_type: v.validator_type,
                owner: v.owner.to_string(),
                price_usd: v.price_usd,
                active: v.active,
                transfers_enabled: v.transfers_enabled,
            })
        }).collect();

    Ok(ValidatorsListResponse { validators: validators? })
}


// ---------------------- FIXED TOTAL MARKET CAP ------------------

fn calculate_total_market_cap(storage: &dyn cosmwasm_std::Storage) -> StdResult<Uint128> {
    let mut total = Uint128::zero();
    for item in VALIDATORS.range(storage,None,None,Order::Ascending) {
        let (_, v) = item?;
        total += v.price_usd * Uint128::from(v.max_supply as u128);
    }
    Ok(total)
}

fn query_market_cap(deps: Deps) -> StdResult<MarketCapResponse> {
    Ok(MarketCapResponse {
        total_market_cap_usd: calculate_total_market_cap(deps.storage)?,
    })
}