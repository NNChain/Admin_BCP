import NftMetadata from "../models/nftMetadata.model.js";

export const createBulkMetadata = async (req, res) => {
  try {
    // Get the last token_id (e.g., V110 → start from next)
    const lastMeta = await NftMetadata.findOne().sort({ createdAt: -1 });
    let tokenCounter = lastMeta
      ? parseInt(lastMeta.token_id.replace("V", "")) + 1
      : 1;

    // Configuration for each type
    const validatorTypes = [
      { type: "Z", count: 10, image: "https://nnscan.org/validatorz.png" },
      { type: "I", count: 50, image: "https://nnscan.org/validator1.png" },
      { type: "II", count: 30, image: "https://nnscan.org/validator2.png" },
      { type: "III", count: 20, image: "https://nnscan.org/validator3.png" },
    ];

    const allMetadata = [];

    for (const { type, count, image } of validatorTypes) {
      for (let i = 1; i <= count; i++) {
        const tokenId = `V${tokenCounter}`;
        const metadata = {
          token_id: tokenId,
          name: `Validator Type ${type} #${i}`,
          description: `Validator NFT representing Core Validator #${i} in the NNTerra network.`,
          image: image,
          attributes: [
            { trait_type: "Token ID", value: tokenId },
            { trait_type: "Edition", value: `${i}` },
            { trait_type: "Validator Type", value: type },
            { trait_type: "Validator Moniker", value: `NNC Core Validator ${tokenCounter}` },
            { trait_type: "Validator Address", value: "" },
            { trait_type: "Account Address", value: "" },
            { trait_type: "Network", value: "NNTerra" },
          ],
        };
        allMetadata.push(metadata);
        tokenCounter++;
      }
    }

    const inserted = await NftMetadata.insertMany(allMetadata);

    res.status(201).json({
      success: true,
      message: `${inserted.length} metadata documents created successfully.`,
      total_inserted: inserted.length,
    });
  } catch (error) {
    console.error("Error creating metadata:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getAllMetadata = async (req, res) => {
  try {
    const metadata = await NftMetadata.find();
    res.status(200).json({
      success: true,
      count: metadata.length,
      data: metadata,
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};