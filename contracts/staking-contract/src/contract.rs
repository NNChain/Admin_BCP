#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, BankMsg, Binary, Coin, Decimal, Deps, DepsMut, Env, MessageInfo, Response,
    StdResult, Uint128, Timestamp,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::*;
use crate::state::*;

const CONTRACT_NAME: &str = "crates.io:nnc-staking";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
const SECONDS_PER_YEAR: u64 = 31_536_000;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    if msg.apr > Decimal::one() {
        return Err(ContractError::InvalidApr {});
    }

    let config = Config {
        admin: info.sender.clone(),
        apr: msg.apr,
        min_stake: msg.min_stake,
        max_stake: msg.max_stake,
        denom: msg.denom,
    };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONFIG.save(deps.storage, &config)?;
    TOTAL_STAKED.save(deps.storage, &Uint128::zero())?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Stake {} => try_stake(deps, env, info),
        ExecuteMsg::Unstake {} => try_unstake(deps, env, info),
        ExecuteMsg::ClaimRewards {} => try_claim(deps, env, info),
        ExecuteMsg::UpdateApr { apr } => try_update_apr(deps, info, apr),
        ExecuteMsg::UpdateLimits { min_stake, max_stake } => try_update_limits(deps, info, min_stake, max_stake),
        ExecuteMsg::TransferAdmin { new_admin } => try_transfer_admin(deps, info, new_admin),
    }
}

fn try_stake(deps: DepsMut, env: Env, info: MessageInfo) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    
    let coin = info.funds.iter()
        .find(|c| c.denom == config.denom)
        .ok_or(ContractError::NoFundsSent {})?;
    
    let amount = coin.amount;
    if amount < config.min_stake || amount > config.max_stake {
        return Err(ContractError::InvalidStakeAmount { 
            min: config.min_stake, 
            max: config.max_stake 
        });
    }
    
    let sender_str = info.sender.to_string();
    if STAKES.may_load(deps.storage, sender_str.clone())?.is_some() {
        return Err(ContractError::AlreadyStaking {});
    }
    
    let stake = StakeInfo {
        staker: info.sender.clone(),
        amount,
        staked_at: env.block.time,
        last_claim: env.block.time,
        total_claimed: Uint128::zero(),
    };
    
    STAKES.save(deps.storage, sender_str, &stake)?;
    let total = TOTAL_STAKED.load(deps.storage)? + amount;
    TOTAL_STAKED.save(deps.storage, &total)?;

    Ok(Response::new()
        .add_attribute("action", "stake")
        .add_attribute("staker", info.sender.to_string())
        .add_attribute("amount", amount.to_string()))
}

fn try_unstake(deps: DepsMut, env: Env, info: MessageInfo) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let sender_str = info.sender.to_string();
    let stake = STAKES.load(deps.storage, sender_str.clone())?;
    
    let rewards = calculate_rewards_simple(&config, &stake, env.block.time);
    let payout = stake.amount + rewards;

    // Check contract has sufficient balance
    let contract_balance = deps.querier.query_balance(
        &env.contract.address,
        config.denom.as_str(),
    )?;
    
    if contract_balance.amount < payout {
        return Err(ContractError::InsufficientContractFunds { 
            required: payout 
        });
    }    

    // Remove stake and update total
    STAKES.remove(deps.storage, sender_str);
    let total = TOTAL_STAKED.load(deps.storage)? - stake.amount;
    TOTAL_STAKED.save(deps.storage, &total)?;

    Ok(Response::new()
        .add_message(BankMsg::Send {
            to_address: info.sender.to_string(),
            amount: vec![Coin { 
                denom: config.denom, 
                amount: payout 
            }],
        })
        .add_attribute("action", "unstake")
        .add_attribute("staker", info.sender.to_string())
        .add_attribute("principal", stake.amount.to_string())
        .add_attribute("rewards", rewards.to_string())
        .add_attribute("total_payout", payout.to_string()))
}

fn try_claim(deps: DepsMut, env: Env, info: MessageInfo) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let sender_str = info.sender.to_string();
    let mut stake = STAKES.load(deps.storage, sender_str.clone())?;
    
    let rewards = calculate_rewards_simple(&config, &stake, env.block.time);
    if rewards.is_zero() {
        return Ok(Response::new()
            .add_attribute("action", "claim")
            .add_attribute("staker", info.sender.to_string())
            .add_attribute("rewards", "0")
            .add_attribute("message", "No rewards to claim yet"));
    }

    // Check contract has sufficient balance
    let contract_balance = deps.querier.query_balance(
        &env.contract.address,
        config.denom.as_str(),
    )?;
    
    if contract_balance.amount < rewards {
        return Err(ContractError::InsufficientContractFunds { 
            required: rewards 
        });
    }    

    // Update stake info
    stake.last_claim = env.block.time;
    stake.total_claimed += rewards;
    STAKES.save(deps.storage, sender_str, &stake)?;

    Ok(Response::new()
        .add_message(BankMsg::Send {
            to_address: info.sender.to_string(),
            amount: vec![Coin { 
                denom: config.denom.clone(), 
                amount: rewards 
            }],
        })
        .add_attribute("action", "claim")
        .add_attribute("staker", info.sender.to_string())
        .add_attribute("rewards", rewards.to_string())
        .add_attribute("total_claimed", stake.total_claimed.to_string()))
}

fn try_update_apr(deps: DepsMut, info: MessageInfo, apr: Decimal) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }
    if apr > Decimal::one() {
        return Err(ContractError::InvalidApr {});
    }
    
    let old_apr = config.apr;
    config.apr = apr;
    CONFIG.save(deps.storage, &config)?;
    
    Ok(Response::new()
        .add_attribute("action", "update_apr")
        .add_attribute("old_apr", old_apr.to_string())
        .add_attribute("new_apr", apr.to_string()))
}

fn try_update_limits(
    deps: DepsMut,
    info: MessageInfo,
    min_stake: Uint128,
    max_stake: Uint128,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }
    
    config.min_stake = min_stake;
    config.max_stake = max_stake;
    CONFIG.save(deps.storage, &config)?;
    
    Ok(Response::new()
        .add_attribute("action", "update_limits")
        .add_attribute("min_stake", min_stake.to_string())
        .add_attribute("max_stake", max_stake.to_string()))
}

fn try_transfer_admin(
    deps: DepsMut,
    info: MessageInfo,
    new_admin: String,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }
    
    let old_admin = config.admin.clone();
    config.admin = deps.api.addr_validate(&new_admin)?;
    CONFIG.save(deps.storage, &config)?;
    
    Ok(Response::new()
        .add_attribute("action", "transfer_admin")
        .add_attribute("old_admin", old_admin.to_string())
        .add_attribute("new_admin", config.admin.to_string()))
}

// Accurate rewards calculation
fn calculate_rewards_simple(config: &Config, stake: &StakeInfo, now: Timestamp) -> Uint128 {
    let time_diff = now.seconds().saturating_sub(stake.last_claim.seconds());
    if time_diff == 0 {
        return Uint128::zero();
    }
    
    // Formula: principal * APR * (time_diff / year)
    let time_fraction = Decimal::from_ratio(time_diff as u128, SECONDS_PER_YEAR as u128);
    let rate = config.apr * time_fraction;
    
    // Apply rate to principal (safe Decimal math)
    let principal_dec = Decimal::from_atomics(stake.amount, 0).unwrap_or(Decimal::zero());
    let rewards_dec = principal_dec * rate;
    
    // Return whole tokens (floor division removes fractional parts)
    rewards_dec.atomics()
        .checked_div(Uint128::from(10u128.pow(18)))
        .unwrap_or(Uint128::zero())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_json_binary(&query_config(deps)?),
        QueryMsg::StakeInfo { address } => to_json_binary(&query_stake(deps, address)?),
        QueryMsg::PendingRewards { address } => to_json_binary(&query_rewards(deps, env, address)?),
        QueryMsg::TotalStaked {} => to_json_binary(&query_total(deps)?),
    }
}

fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let config = CONFIG.load(deps.storage)?;
    Ok(ConfigResponse {
        admin: config.admin.to_string(),
        apr: config.apr,
        min_stake: config.min_stake,
        max_stake: config.max_stake,
        denom: config.denom,
    })
}

fn query_stake(deps: Deps, address: String) -> StdResult<StakeInfoResponse> {
    let stake = STAKES.load(deps.storage, address)?;
    Ok(StakeInfoResponse {
        staker: stake.staker.to_string(),
        amount: stake.amount,
        staked_at: stake.staked_at.seconds(),
        last_claim: stake.last_claim.seconds(),
        total_claimed: stake.total_claimed,
    })
}

fn query_rewards(deps: Deps, env: Env, address: String) -> StdResult<RewardsResponse> {
    let config = CONFIG.load(deps.storage)?;
    let stake = STAKES.load(deps.storage, address)?;
    let rewards = calculate_rewards_simple(&config, &stake, env.block.time);
    Ok(RewardsResponse { pending_rewards: rewards })
}

fn query_total(deps: Deps) -> StdResult<TotalStakedResponse> {
    let total = TOTAL_STAKED.load(deps.storage)?;
    Ok(TotalStakedResponse { total_staked: total })
}