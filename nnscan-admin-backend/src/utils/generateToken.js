import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in .env");

  return jwt.sign(payload, secret, { expiresIn: "1d" });
};
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in .env");

  return jwt.verify(token, secret);
};

