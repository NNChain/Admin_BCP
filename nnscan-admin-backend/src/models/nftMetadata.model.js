import mongoose from "mongoose";

const nftMetadataSchema = new mongoose.Schema({
  token_id: { type: String, required: true, unique: true },
  name: String,
  description: String,
  image: String,
  attributes: [
    {
      trait_type: String,
      value: String,
    },
  ],
}, { timestamps: true });

const NftMetadata = mongoose.model("NftMetadata", nftMetadataSchema);
export default NftMetadata;
