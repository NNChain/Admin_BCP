use cosmwasm_std::StdError;
use thiserror::Error;
use cosmwasm_std::Uint128;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),
    
    #[error("Unauthorized")]
    Unauthorized {},
    
    #[error("No stake found")]
    NoStake {},
    
    #[error("Stake amount must be between {min} and {max}")]
    InvalidStakeAmount { min: Uint128, max: Uint128 },
    
    #[error("No funds sent")]
    NoFundsSent {},
    
    #[error("Invalid denom: expected {expected}, got {got}")]
    InvalidDenom { expected: String, got: String },
    
    #[error("Already staking")]
    AlreadyStaking {},
    
    #[error("Invalid APR (must be <= 1.0)")]
    InvalidApr {},
    
    #[error("Insufficient contract balance to pay {required}. Please contact admin to fund contract.")]
    InsufficientContractFunds { required: Uint128 },
}

