use cosmwasm_std::{StdError, Uint128};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("RWA already exists: {rwa_id}")]
    RwaExists { rwa_id: String },

    #[error("RWA not found: {rwa_id}")]
    RwaNotFound { rwa_id: String },

    #[error("Invalid denom: expected {expected}")]
    InvalidDenom { expected: String },

    #[error("Insufficient vault balance")]
    InsufficientVault {},

    #[error("Transfer disabled")]
    TransferDisabled {},

    #[error("RWA frozen")]
    RwaFrozen {},
}
