use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Decimal, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
    pub apr: Decimal,
    pub min_stake: Uint128,
    pub max_stake: Uint128,
    pub denom: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    Stake {},
    Unstake {},
    ClaimRewards {},
    UpdateApr { apr: Decimal },
    UpdateLimits { min_stake: Uint128, max_stake: Uint128 },
    TransferAdmin { new_admin: String },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ConfigResponse)]
    Config {},
    #[returns(StakeInfoResponse)]
    StakeInfo { address: String },
    #[returns(RewardsResponse)]
    PendingRewards { address: String },
    #[returns(TotalStakedResponse)]
    TotalStaked {},
}

#[cw_serde]
pub struct ConfigResponse {
    pub admin: String,
    pub apr: Decimal,
    pub min_stake: Uint128,
    pub max_stake: Uint128,
    pub denom: String,
}

#[cw_serde]
pub struct StakeInfoResponse {
    pub staker: String,
    pub amount: Uint128,
    pub staked_at: u64,
    pub last_claim: u64,
    pub total_claimed: Uint128,
}

#[cw_serde]
pub struct RewardsResponse {
    pub pending_rewards: Uint128,
}

#[cw_serde]
pub struct TotalStakedResponse {
    pub total_staked: Uint128,
}
