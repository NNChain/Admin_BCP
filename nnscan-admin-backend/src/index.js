import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import adminRouter from "./routes/admin.routes.js";
import cors from "cors";
import auth_router from "./routes/auth.routes.js";
import Nft_router from "./routes/nft.routes.js";
import Validator_router from "./routes/validator.routes.js";
import axios from "axios"
import nftMetadataRoutes from "./routes/nftMetadata.routes.js";
import genesisRoutes from "./routes/genesis.routes.js";




dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  credentials: false, // must be false when origin is '*'
}));


app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/auth", auth_router);
app.use("/api/nft", Nft_router);
app.use("/api", Validator_router);
app.use("/api/metadata", nftMetadataRoutes);
app.use("/api", genesisRoutes);

app.get("/proxy/:contract/:encoded", async (req, res) => {
  const { contract, encoded } = req.params;
  const url = `http://155.133.26.60:1317/cosmwasm/wasm/v1/contract/${contract}/smart/${encoded}`;
  // console.log("Proxying request to:", url);
// curl -s "http://155.133.26.60:1317/cosmwasm/wasm/v1/contract/nnc14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9scu7ase/smart/$(echo -n '{"all_tokens":{}}' | base64)" | jq

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
});

connectDB();

export default app;
