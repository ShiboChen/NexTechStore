import express from "express";
import { protectRoute, admin } from "../middlewares/authMiddleware.js";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(protectRoute, addOrderItems)
  .get(protectRoute, admin, getOrders);
router.route("/mine").get(protectRoute, getMyOrders);
router.route("/:id").get(protectRoute, getOrderById);
router.route("/:id/pay").put(protectRoute, updateOrderToPaid);
router.route("/:id/deliver").put(protectRoute, admin, updateOrderToDelivered);

export default router;
