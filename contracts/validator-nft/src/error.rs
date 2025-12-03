use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),
    
    #[error("Unauthorized")]
    Unauthorized {},
    
    #[error("Validator NFT already exists: {validator_id}")]
    ValidatorExists { validator_id: String },
    
    #[error("Validator NFT not found: {validator_id}")]
    ValidatorNotFound { validator_id: String },
    
    #[error("Invalid validator type. Must be 0, I, II, or III")]
    InvalidValidatorType {},
    
    #[error("Transfer disabled for this validator")]
    TransferDisabled {},
    
    #[error("Validator is frozen")]
    ValidatorFrozen {},
}