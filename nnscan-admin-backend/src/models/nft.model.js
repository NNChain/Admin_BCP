


import mongoose from "mongoose";

const nftSchema = new mongoose.Schema(
  {
    nft_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    is_minting: {
      type: Boolean,
      default: false,
    },
    is_minted: {
      type: Boolean,
      default: false,
    },
    transaction_hash: {
      type: String,
      default: null,
    },
    minter_address: {
      type: String,
      default: null,
    },
    minted_hash: {
      type: String,
      default: null,
    },
    owner_address: {
      type: String,
      default: null,
    },
    created_by: {
      type: String,
      default: null,
    },
    updated_by: {
      type: String,
      default: null,
    },
    trx_confirmations: {
      type: Number,
      enum: [0, 1, 2,3], 
      default: 0, 
    },
  },
  {
    timestamps: true,
  }
);

export const Nft = mongoose.model("Nft", nftSchema);
