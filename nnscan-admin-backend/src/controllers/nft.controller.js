import { Nft } from "../models/nft.model.js";
import axios from "axios";
import NftMetadata from "../models/nftMetadata.model.js";


export const createNft = async (req, res) => {
  try {
    const { name, description, image, is_minting, transaction_hash, minter_address } = req.body;
    console.log(req.admin, "req.admin")
    const created_by = req.admin.id || null;


    if (!name || !description || !image) {
      return res.status(400).json({ success: false, message: "Name, description, and image are required." });
    }

    const newNft = await Nft.create({
      name,
      description,
      image,
      is_minting,
      transaction_hash,
      minter_address,
      created_by,
    });

    res.status(201).json({
      success: true,
      message: "NFT created successfully",
      data: newNft,
    });
  } catch (err) {
    console.error("Error creating NFT:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const getAllNfts = async (req, res) => {
  try {
    const nfts = await Nft.find()
    console.log(nfts,"nft")
    res.status(200).json({
      success: true,
      total: nfts.length,
      data: nfts,
    });
  } catch (err) {
    console.error("Error fetching NFTs:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


 // adjust the path if needed

// export const getAllNfts = async (req, res) => {
//   try {  
//     const nfts = await Nft.find();
//     const validatorResponse = await axios.get(
//       `${process.env.VALIDATOR_API_URL}`
//     );
//     const validators = validatorResponse.data?.validators || [];
//     const nftPromises = nfts.map(async (nft) => {
//       const owner = nft.owner_address;

//       if (!owner) {
//         return {
//           ...nft._doc,
//           validator_moniker: "No owner address",
//         };
//       }

//       try {
//         // Get address info to find bech32_val
//         const checkUrl = `${process.env.NFT_MT_URL}/${owner}`;
//         const checkResponse = await axios.get(checkUrl, { timeout: 8000 });
//         const bech32_val = checkResponse.data?.bech32_val;

//         // Match validator by operator_address
//         const matchedValidator = validators.find(
//           (v) => v.operator_address === bech32_val
//         );

//         if (matchedValidator) {
//           const { description, status, tokens, commission,jailed } = matchedValidator;

//           return {
//             ...nft._doc,
//             bech32_val,
//             validator_moniker: description?.moniker || "Not Found",
//             validator_status: status || "Unknown",
//             validator_tokens: tokens || "0",
//             validator_commission: commission?.commission_rates?.rate || "0",
//             validator_jailed: jailed ?? false,
//           };
//         } else {
//           return {
//             ...nft._doc,          
//             bech32_val,
//             validator_moniker: "Not Found",
//           };
//         }
//       } catch (err) {
//         console.error(`Error fetching data for owner ${owner}:`, err.message);
//         return {
//           ...nft._doc,
//           validator_moniker: "Error fetching data",
//         };
//       } 
//     });

//     // 4️⃣ Wait for all requests to finish (parallel)
//     const result = await Promise.allSettled(nftPromises);

//     // 5️⃣ Extract fulfilled results only
//     const data = result.map((r) =>
//       r.status === "fulfilled" ? r.value : { validator_moniker: "Error" }
//     );

//     // 6️⃣ Return final response
//     res.status(200).json({
//       success: true,
//       total: data.length,
//       data,
//     });
//   } catch (err) {
//     console.error("Error processing NFTs:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err.message,
//     });
//   }
// };



// export const createBulkNFTs = async (req, res) => {
//   try {
//     const lastNft = await Nft.findOne().sort({ nft_id: -1 });
//     const startId = lastNft ? lastNft.nft_id + 1 : 1;

//     const nftData = {
//       name: "Validator Z",
//       description: "Validator NFT representing Core Validators in NNTerra Z.",
//       image: "https://nnscan.org/nft/validatorz.png",
//       is_minted: false,
//       transaction_hash: "null",
//       minter_address: "null",
//       minted_hash: "null",
//       owner_address: "null"

//     };

//     const nftArray = Array.from({ length: 10 }, (_, i) => ({
//       ...nftData,
//       nft_id: startId + i,
//     }));
//     const savedNFTs = await Nft.insertMany(nftArray);
//     res.status(201).json({
//       success: true,
//       message: "10 NFTs inserted successfully",
//       data: savedNFTs,
//     });
//   } catch (error) {
//     console.error("Error inserting NFTs:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const createBulkNFTs = async (req, res) => {
//   try {
//     const lastNft = await Nft.findOne().sort({ nft_id: -1 });
//     let startId = 1;
//     if (lastNft && lastNft.nft_id) {
//       const lastNumeric = parseInt(lastNft.nft_id.replace(/^V/, ""));
//       startId = lastNumeric + 1;
//     }

//     const nftData = {
//       name: "Validator I",
//       description: "Validator NFT representing Core Validators in NNTerra I.",
//       image: "https://nnscan.org/nft/validator1.png",
//       is_minted: false,
//       transaction_hash: "null",
//       minter_address: "null",
//       minted_hash: "null",
//       owner_address: "null",
//     };

//     const nftArray = Array.from({ length: 50 }, (_, i) => ({
//       ...nftData,
//       nft_id: `V${startId + i}`, // string id like V1, V2, ...
//     }));

//     const savedNFTs = await Nft.insertMany(nftArray);

//     res.status(201).json({
//       success: true,
//       message: "10 NFTs inserted successfully",
//       data: savedNFTs,
//     });
//   } catch (error) {
//     console.error("Error inserting NFTs:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

export const createBulkNFTs = async (req, res) => {
  try {
    const totalNFTs = await Nft.countDocuments();

    const startId = totalNFTs + 1;

    const count = 20;

    // const nftData = {
    //   name: "Validator III",
    //   description: "Validator NFT representing Core Validators in NNTerra III.",
    //   image: "https://nnscan.org/nft/validator3.png",
    //   is_minted: false,
    //   transaction_hash: "null",
    //   minter_address: "null",
    //   minted_hash: "null",
    //   owner_address: "null",
    // };

    // 🧩 Create array of NFTs starting from the correct next ID
    const nftArray = Array.from({ length: count }, (_, i) => ({
      // ...nftData,
      nft_id: `V${startId + i}`,
    }));

    // 🧩 Insert NFTs
    const savedNFTs = await Nft.insertMany(nftArray);

    res.status(201).json({
      success: true,
      message: `${savedNFTs.length} NFTs inserted successfully (V${startId} to V${startId + count - 1})`,
      data: savedNFTs,
    });
  } catch (error) {
    console.error("Error inserting NFTs:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



function encodeQuery(queryObj) {
  return Buffer.from(JSON.stringify(queryObj)).toString("base64");
}

/**
 * @route GET /api/nft/:tokenId
 * @desc Get info for a specific NFT by tokenId
 */
export const getNftById = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const query = encodeQuery({
      all_nft_info: { token_id: tokenId },
    });

    const url = `${process.env.BASE_URL}/${process.env.CONTRACT_ADDRESS}/smart/${query}`;
    const { data } = await axios.get(url);

    res.status(200).json({
      success: true,
      token_id: tokenId,
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching NFT info:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching NFT info",
      error: error.response?.data || error.message,
    });
  }
};

/**
 * @route GET /api/nfts
 * @desc Get info for multiple NFTs (loop 1–N)
 */
export const getAllNfts_by_url = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const start = parseInt(req.query.start) || 1;

    const nftResults = [];

    for (let i = start; i < start + limit; i++) {
      const query = encodeQuery({
        all_nft_info: { token_id: `V${i}` },
      });

      const url = `${process.env.BASE_URL}/${process.env.CONTRACT_ADDRESS}/smart/${query}`;

      try {
        const { data } = await axios.get(url);
        nftResults.push({ token_id: `V${i}`, data });
      } catch (err) {
        console.warn(`⚠️ Skipping token_id V${i}: ${err.message}`);
      }
    }

    res.status(200).json({
      success: true,
      count: nftResults.length,
      data: nftResults,
    });
  } catch (error) {
    console.error("❌ Error fetching NFTs:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching all NFTs",
      error: error.message,
    });
  }
};

export const mintApi = async (req, res) => {
  try {
    const { nft_id, owner_address, transaction_hash, minted_hash } = req.body;

    if (!nft_id) {
      return res.status(400).json({ success: false, message: "nft_id is required" });
    }

    const nft = await Nft.findOne({ nft_id });

    if (!nft) {
      return res.status(404).json({ success: false, message: "NFT not found" });
    }

    nft.is_minted = true;
    if (owner_address) nft.owner_address = owner_address;
    if (transaction_hash) nft.transaction_hash = transaction_hash;
    if (minted_hash) nft.minted_hash = minted_hash;

    await nft.save();

    res.status(200).json({
      success: true,
      message: `NFT ${nft_id} updated as minted successfully`,
      data: nft,
    });
  } catch (error) {
    console.error("Error updating NFT:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// curl
export const fetchNFTInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${process.env.NFT_MT_URL}/nft/${id}`);
    res.status(200).json({
      success: true,
      message: "NFT data fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching NFT info:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch NFT info",
      error: error.message,
    });
  }
};

// POST Mint NFT
// ==========================
export const mintNFT = async (req, res) => {
  try {
    console.log("Incoming mint request body:", req.body);
    const { token_id } = req.body;
    if (!token_id) {
      return res.status(400).json({
        success: false,
        message: "token_id and token_uri are required",
      });
    }
    let token_uri = process.env.NFT_BASE_URL + token_id;
    // Call remote mint API
    const response = await axios.post(`${process.env.NFT_MT_URL}/mint`, {
      token_id,
      token_uri,
    });

    const match = response.data.stdout.match(/txhash:\s*([A-F0-9]+)/i);
    const txHash = match ? match[1] : null;

    if (txHash) {

      const updatedNFT = await Nft.findOneAndUpdate(
        { nft_id: token_id },
        { $set: { is_minted: true, transaction_hash: txHash, minted_hash: txHash, trx_confirmations: 1 } },
        { new: true }
      );
    }
    return res.status(200).json({
      success: true,
      message: "NFT transferred successfully, Please click to update transaction status",
      data: response.data?.data || response.data,
    });
  } catch (error) {
    console.error("Minting NFT failed:", error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to mint NFT",
      error: error.message,
    });
  }
};

// export const transferNFT = async (req, res) => {
//   try {
//     const { token_id, new_owner } = req.body;

//     if (!token_id || !new_owner) {
//       return res.status(400).json({
//         success: false,
//         message: "token_id and new_owner are required",
//       });
//     }

//     const checkUrl = `http://155.133.26.60:3000/api/${new_owner}`;
//     const checkResponse = await axios.get(checkUrl);

//     const { address_hex, bech32_acc, bech32_val, bech32_con } = checkResponse.data;

//     if (!address_hex && !bech32_acc && !bech32_val && !bech32_con) {
//       return res.status(400).json({
//         success: false,
//         message: "This validator address is not a valid address",
//       });
//     }

//     const existingOwner = await Nft.findOne({
//       owner_address: { $regex: new RegExp(`^${new_owner}$`, "i") },
//     });

//     if (existingOwner) {
//       return res.status(200).json({
//         success: false,
//         message: "The Validator address is already activated with another NFT",
//       });
//     }

//     const response = await axios.post(`http://155.133.26.60:3000/api/transfer`, {
//       token_id,
//       new_owner,
//     });
//     // console.log(response.data, "response.data")

//     //update api 
//     const match = response.data.stdout.match(/txhash:\s*([A-F0-9]+)/i);
//     const txHash = match ? match[1] : null;
//     // setTimeout(async () => {  
//     // console.log(" Extracted txHash:", txHash);
//     //   const url = `http://155.133.26.60:1317/cosmos/tx/v1beta1/txs/${txHash}`;
//     // const txResponse = await axios.get(url);
//     // console.log(" Transaction response:", txResponse.data);
//     // }, 5000); // 5 seconds delay
//     // const updatedNFT = await Nft.findOneAndUpdate(
//     //   { nft_id: token_id },
//     //   { $set: { is_minted: true, owner_address: new_owner, transaction_hash: txHash, trx_confirmations : 1 } },
//     //   { new: true }
//     // );
//     if (response.status === 200 && txHash) {
//       const updatedNFT = await Nft.findOneAndUpdate(
//         { nft_id: token_id },
//         {
//           $set: {
//             is_minted: true,
//             owner_address: new_owner,
//             transaction_hash: txHash,
//             trx_confirmations: 1,
//           },
//         },
//         { new: true }
//       );
//     }

//     res.status(200).json({
//       success: true,
//       message: "NFT transferred successfully, Please click to check transaction status",
//       data: response.data?.data || response.data,
//     });
//   } catch (error) {
//     console.error("Transfer NFT failed:", error.message);
//     res.status(error.response?.status || 500).json({
//       success: false,
//       message: "Failed to transfer NFT",
//       error: error.message,
//     });
//   }
// };

export const transferNFT = async (req, res) => {
  try {
    const { token_id, new_owner } = req.body;

    if (!token_id || !new_owner) {
      return res.status(400).json({
        success: false,
        message: "token_id and new_owner are required",
      });
    }

    const checkUrl = `${process.env.NFT_MT_URL}/${new_owner}`;
    console.log(checkUrl,"checkUrl")
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const checkResponse = await axios.get(checkUrl, { timeout: 10000 });

    const { address_hex, bech32_acc, bech32_val, bech32_con } = checkResponse.data || {};

    if (!address_hex && !bech32_acc && !bech32_val && !bech32_con) {
      return res.status(200).json({
        success: false,
        message: "This validator address is not a valid address",
      });
    }

    const existingOwner = await Nft.findOne({
      owner_address: { $regex: new RegExp(`^${new_owner}$`, "i") },
    });

    if (existingOwner) {
      return res.status(200).json({
        success: false,
        message: "The Validator address is already activated with another NFT",
      });
    }

    // ✅ Transfer request
    const response = await axios.post(`${process.env.NFT_MT_URL}/transfer`, {
      token_id,
      new_owner,
    });

    // ✅ Extract transaction hash safely
    const match = response?.data?.stdout?.match(/txhash:\s*([A-F0-9]+)/i);
    const txHash = match ? match[1] : null;

    if (response.status === 200 && txHash) {
      await Nft.findOneAndUpdate(
        { nft_id: token_id },
        {
          $set: {
            is_minted: true,
            owner_address: new_owner,
            transaction_hash: txHash,
            trx_confirmations: 1,
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "NFT transferred successfully, Please click to check transaction status",
      data: response.data,
    });
  } catch (error) {
    console.error("Transfer NFT failed:", error?.response?.data || error.message);

    return res.status(error?.response?.status || 500).json({
      success: false,
      message:
        error?.response?.data?.message ||
        "Failed to transfer NFT",
      error: error.message,
    });
  }
};


export const getAllNFTs = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.NFT_MT_URL}/nfts`);

    res.status(200).json({
      success: true,
      message: "All NFTs fetched successfully",
      data: response.data?.data || response.data,
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to fetch NFTs",
      error: error.message,
    });
  }
}


export const getNftByIdondata = async (req, res) => {
  try {
    const { nft_id } = req.params;

    if (!nft_id) {
      return res.status(400).json({
        success: false,
        message: "NFT ID is required",
      });
    }

    const nft = await Nft.findOne({ nft_id });

    if (!nft) {
      return res.status(404).json({
        success: false,
        message: `NFT with ID ${nft_id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "NFT fetched successfully",
      data: nft,
    });
  } catch (error) {
    console.error("Error fetching NFT:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NFT",
      error: error.message,
    });
  }
};

export const getNftMetaDataBynftId = async (req, res) => {
  try {
    const { nft_id } = req.params;


    if (!nft_id) {
      return res.status(400).json({
        success: false,
        message: "NFT ID is required",
      });
    }

    const nft = await NftMetadata.findOne({ token_id: nft_id });

    if (!nft) {
      return res.status(404).json({
        success: false,
        message: `NFT with ID ${nft_id} not found`,
      });
    }
    const metadata = {
      name: nft.name,
      description: nft.description,
      image: nft.image,
    };


    res.status(200).json(nft);
  } catch (error) {
    console.error("Error fetching NFT:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch NFT",
      error: error.message,
    });
  }
};



export const checkAndUpdateTransaction = async (req, res) => {
  try {
    const { trx } = req.params;
    const url = `http://155.133.26.60:1317/cosmos/tx/v1beta1/txs/${trx}`;

    const txResponse = await axios.get(url);
    const txData = txResponse.data;
    console.log(txData, "txData nik")


    // If no tx_response found
    if (!txData || !txData.tx_response) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found on blockchain",
      });
    }

    const { code, raw_log } = txData.tx_response;

    // ✅ Check if confirmed
    const isConfirmed = code == 0 && raw_log == "";


    // Update NFT in DB if found
    const nft = await Nft.findOne({ transaction_hash: trx });
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: "NFT not found for this transaction hash",
      });
    }
    if (isConfirmed) {
      nft.trx_confirmations = 2;
    } else {
      nft.trx_confirmations = 3;
      if (!nft.owner_address) {
        nft.is_minted = false;
      } else {
        nft.owner_address = "";
      }

    }

    await nft.save();

    if (nft.trx_confirmations == 2) {
      return res.status(200).json({
        success: true,
        message: "Transaction confirmed successfully",
        data: {
          nft_id: nft.nft_id,
          trx_confirmations: nft.trx_confirmations,
          transaction_hash: nft.transaction_hash,
        },
      });
    } else if (nft.trx_confirmations == 3) {
      return res.status(200).json({
        success: false,
        message: "Transaction failed :" + raw_log,
        data: {
          nft_id: nft.nft_id,
          trx_confirmations: nft.trx_confirmations,
          transaction_hash: nft.transaction_hash,
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: "⏳ Transaction still pending",
      data: {
        nft_id: nft.nft_id,
        trx_confirmations: nft.trx_confirmations,
        transaction_hash: nft.transaction_hash,
      },
    });

  } catch (error) {
    console.error("Error checking transaction:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};