import express from "express";
import { createBulkMetadata, getAllMetadata } from "../controllers/nftMetadata.controller.js";

const router = express.Router();

router.post("/create-bulk", createBulkMetadata);
router.get("/metadata", getAllMetadata);

export default router;
