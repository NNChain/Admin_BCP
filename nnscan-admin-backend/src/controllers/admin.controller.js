import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model.js";
import { generateToken } from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/response.js";


export const registerAdmin = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !email || !phone || !password)
            return errorResponse(res, "All fields are required", null, 400);

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin)
            return errorResponse(res, "Admin already exists with this email", null, 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            name,
            email,
            phone,
            image,
            password: hashedPassword,
        });

        return successResponse(res, "Admin registered successfully", {
            id: newAdmin._id,
            name: newAdmin.name,
            email: newAdmin.email,
            phone: newAdmin.phone,
            image: newAdmin.image,
        }, 201);

    } catch (err) {
        return errorResponse(res, "Server error during registration", err.message, 500);
    }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return errorResponse(res, "Email and password required", null, 400);

    const admin = await Admin.findOne({ email });
    if (!admin) return errorResponse(res, "Not found", null, 404);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return errorResponse(res, "Invalid credentials", null, 401);

    const token = generateToken({ id: admin._id, email: admin.email, role: "admin" });

    return successResponse(res, "Login successful", {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        image: admin.image,
      },
    });
  } catch (err) {
    return errorResponse(res, "Server error during login", err.message, 500);
  }
};

// export const loginAdmin = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) return errorResponse(res, "Email is required", null, 400);

//     // ✅ Option 1: Check in DB
//     const admin = await Admin.findOne({ email });

//     // ✅ Option 2 (optional): Or check allowed email from .env
//     // if (email !== process.env.ADMIN_EMAIL) {
//     //   return errorResponse(res, "Unauthorized admin email", null, 403);
//     // }

//     if (!admin)
//       return errorResponse(res, "Admin not found or unauthorized", null, 404);

//     // ✅ Generate token
//     const token = generateToken({
//       id: admin._id,
//       email: admin.email,
//       role: "admin",
//     });

//     return successResponse(res, "Login successful", {
//       token,
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         phone: admin.phone,
//         image: admin.image,
//       },
//     });
//   } catch (err) {
//     return errorResponse(res, "Server error during login", err.message, 500);
//   }
// };


export const getAdminProfile = async (req, res) => {
    try {
        console.log("Decoded Admin from Token:", req.admin);
        const adminId = req.admin.id || req.admin._id;
        console.log("Admin ID Used:", adminId);
        const admin = await Admin.findById(adminId).select("-password");
        if (!admin) return errorResponse(res, "Admin not found", null, 404);
        return successResponse(res, "Profile fetched successfully", admin);
    } catch (err) {
        return errorResponse(res, "Error fetching profile", err.message);
    }
};


export const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (req.file) updateData.image = req.file.filename; 

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedAdmin) return errorResponse(res, "Admin not found", null, 404);

    return successResponse(res, "Profile updated successfully", updatedAdmin);
  } catch (err) {
    return errorResponse(res, "Error updating profile", err.message, 500);
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return errorResponse(res, "Both passwords are required", null, 400);

    const admin = await Admin.findById(req.admin.id);
    if (!admin) return errorResponse(res, "Admin not found", null, 404);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return errorResponse(res, "Current password is incorrect", null, 401);

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    return successResponse(res, "Password changed successfully", null);
  } catch (err) {
    return errorResponse(res, "Error changing password", err.message, 500);
  }
};
