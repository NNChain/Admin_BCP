import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../controllers/admin.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/signup", upload.single("image"), registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/profile",protect, getAdminProfile);
adminRouter.patch("/update", protect, upload.single("image"), updateAdminProfile);
adminRouter.put("/change-password", protect, changeAdminPassword);



export default adminRouter;
