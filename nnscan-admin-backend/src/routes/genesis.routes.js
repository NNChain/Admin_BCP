import express from "express";
import { getGenesisData } from "../controllers/genesis.controller.js";

const genesisRoutes = express.Router();

genesisRoutes.get("/genesis", getGenesisData);

export default genesisRoutes;
