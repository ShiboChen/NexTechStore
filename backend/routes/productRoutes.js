import express from "express";
import { protectRoute, admin } from "../middlewares/authMiddleware.js";
import checkObjectId from "../middlewares/checkObjectId.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSearchProducts,
  createProductReview
} from "../controllers/productController.js";

const router = express.Router();

router.route("/search").get(getSearchProducts);
router.route("/").get(getProducts);
router.route("/create").post(protectRoute, admin, createProduct);
router
  .route("/:id")
  .get(checkObjectId, getProductById)
  .put(protectRoute, admin, checkObjectId, updateProduct)
  .delete(protectRoute, admin, checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protectRoute, checkObjectId, createProductReview);


export default router;
