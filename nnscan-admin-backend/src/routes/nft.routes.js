import express from "express";
import { checkAndUpdateTransaction, createBulkNFTs, createNft, fetchNFTInfo, getAllNFTs, getAllNfts, getAllNfts_by_url, getNftById, getNftByIdondata, getNftMetaDataBynftId, mintApi, mintNFT, transferNFT } from "../controllers/nft.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const Nft_router = express.Router();

Nft_router.post("/create", protect, createNft);
Nft_router.get("/get-all", getAllNfts);
Nft_router.post("/bulk-insert", createBulkNFTs);
Nft_router.get("/nft/:tokenId", getNftById);
Nft_router.get("/nfts", getAllNfts_by_url);
Nft_router.patch("/mint", mintApi);
Nft_router.get("/:id", fetchNFTInfo);
Nft_router.post("/mintCurl", mintNFT);
Nft_router.post("/transferCurl", transferNFT);
Nft_router.get("/getAll", getAllNFTs);
Nft_router.get("/get/:nft_id",getNftByIdondata );

Nft_router.get("/metadata/:nft_id",getNftMetaDataBynftId);
Nft_router.post("/check-transaction/:trx", checkAndUpdateTransaction);
export default Nft_router;
