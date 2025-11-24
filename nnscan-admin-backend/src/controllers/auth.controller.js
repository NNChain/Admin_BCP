import jwt from "jsonwebtoken";
import { ethers } from "ethers";

let nonces = {};

export const ledgerNonce = (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ message: "Address required" });

  const nonce = `Sign this message to login: ${Math.floor(Math.random() * 1000000)}`;
  nonces[address.toLowerCase()] = nonce;

  res.json({ message: nonce });
}; 

export const ledgerVerify = (req, res) => {
  const { address, signature } = req.body;
  if (!address || !signature)    
    return res.status(400).json({ message: "Address and signature required" });

  const nonce = nonces[address.toLowerCase()];
  if (!nonce) return res.status(400).json({ message: "No nonce found" });

  try {
    const recovered = ethers.verifyMessage(nonce, signature);
    if (recovered.toLowerCase() === address.toLowerCase()) {      
      const token = jwt.sign({ address }, "SECRET_KEY", { expiresIn: "1h" });
      delete nonces[address.toLowerCase()];
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};
