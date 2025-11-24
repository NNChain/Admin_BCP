import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return errorResponse(res, "Not authorized, token missing", null, 401);

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    // ✅ only store the ID in req.admin
    req.admin = { id: decoded.id };

    next();
  } catch (err) {
    return errorResponse(res, "Not authorized", err.message, 401);
  }
};
