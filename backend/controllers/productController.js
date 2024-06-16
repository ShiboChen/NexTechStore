import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

export const getSearchProducts = asyncHandler(async (req, res) => {
  const checkOptions = {
    desc: -1,
    asc: 1,
  };

  const keyword = req.query.keyword || "";
  const categories = req.query.categories || "";
  const price = req.query.price || "";
  const countInStock = req.query.countInStock === "true" ? 0 : -1;
  const sort = req.query.sort || "createdAt_desc";
  const sortItem = sort.split("_")[0];
  const order = checkOptions[sort.split("_")[1]];
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const query = {};
  const orConditions = [];

  switch (price) {
    case "Below $100":
      orConditions.push(
        { sellPrice: { $lt: 100 } },
        { salePrice: { $lt: 100 } }
      );
      break;
    case "$100-500":
      orConditions.push(
        { sellPrice: { $gte: 100, $lte: 500 } },
        { salePrice: { $gte: 100, $lte: 500 } }
      );
      break;
    case "$1k-10k":
      orConditions.push(
        { sellPrice: { $gte: 1000, $lte: 10000 } },
        { salePrice: { $gte: 1000, $lte: 10000 } }
      );
      break;
    case "$10k-20k":
      orConditions.push(
        { sellPrice: { $gte: 10000, $lte: 20000 } },
        { salePrice: { $gte: 10000, $lte: 20000 } }
      );
      break;
    case "Above $20k":
      orConditions.push(
        { sellPrice: { $gt: 20000 } },
        { salePrice: { $gt: 20000 } }
      );
      break;
  }

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  if (keyword) {
    query.title = { $regex: keyword, $options: "i" };
  }

  const newCategories = Array.isArray(categories)
    ? categories.map((item) => item.toLowerCase())
    : categories && categories.toLowerCase();

  if (!newCategories.includes("all") && newCategories.length > 1) {
    query.category = { $in: newCategories };
  }

  if (countInStock == 0) {
    query.countInStock = { $gt: 0 };
  }

  const products = await Product.find(query)
    .sort({ [sortItem]: order })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const count = await Product.countDocuments(query).sort({
    [sortItem]: order,
  });

  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  res.json({ products });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  let { images } = req.body;

  const uploadedImages = await Promise.all(
    images.map(async (image) => {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      return uploadedResponse.secure_url;
    })
  );
  const createProduct = await Product.create({
    ...req.body,
    images: uploadedImages,
  });

  if (createProduct) {
    res.status(201).json(createProduct);
  } else {
    res.status(404);
    throw new Error("failed to create product");
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    images,
    category,
    sellPrice,
    salePrice,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const imagesToRemove = product.images.filter(
      (img) => !images.includes(img)
    );

    await Promise.all(
      imagesToRemove.map(async (image) => {
        const publicId = image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      })
    );

    product.title = title;
    product.description = description;
    product.images = images;
    product.category = category;
    product.countInStock = countInStock;
    product.sellPrice = sellPrice;
    product.salePrice = salePrice;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});


export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
