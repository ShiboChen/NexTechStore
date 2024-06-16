import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser
} from "../controllers/userController.js";
import { protectRoute, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/allusers").get(protectRoute, admin, getAllUsers);
router.route("/register").post(registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile/:id")
  .get(protectRoute, getUserProfile)
  .put(protectRoute, updateUserProfile);

router
  .route("/:id")
  .delete(protectRoute, admin, deleteUser)
  .get(protectRoute, admin, getUserById)
  .put(protectRoute, admin, updateUser);

export default router;
