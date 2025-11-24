import express from "express";
import { ledgerNonce, ledgerVerify } from "../controllers/auth.controller.js";
const auth_router = express.Router();

auth_router.post("/ledger-nonce", ledgerNonce);
auth_router.post("/ledger-verify", ledgerVerify);

export default auth_router;
