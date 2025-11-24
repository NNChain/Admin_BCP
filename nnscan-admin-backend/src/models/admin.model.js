import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    image: { type: String, default: null },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
