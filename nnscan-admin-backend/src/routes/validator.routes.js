import express from "express";
import { getValidatorList } from "../controllers/validator.controller.js";

const Validator_router = express.Router();

Validator_router.get("/validators", getValidatorList);

export default Validator_router;
