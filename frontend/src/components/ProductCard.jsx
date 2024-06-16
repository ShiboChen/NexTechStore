import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import Rating from "./Rating";

const ProductCard = ({ data }) => {
  const dispatch = useDispatch();
  
  const addToCartHandler = (index) => {
    dispatch(addToCart({ ...data?.products[index], qty: 1 }));
  };

  return (
    <div className="flex items-center flex-wrap">
      {data?.products.map((product, index) => (
        <div className="w-[33%] p-4" key={product._id}>
          <Link to={`/products/${product._id}`}>
            <img
              src={product?.images[0]}
              alt={product?.title}
              className="h-[200px] w-full"
            />
          </Link>
          <h2 className="text-red-400 truncate my-2 text-center">
            {product?.title}
          </h2>
          <div className="flex justify-center items-center">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
              className="my-2"
            />
          </div>

          <p className="flex justify-center gap-3 my-2">
            <strike>${product.sellPrice}</strike>
            <strong>${product.salePrice}</strong>
          </p>
          <div className="flex justify-center items-center">
            <button
              className="btn btn-sm hover:bg-blue-700 hover:text-white"
              disabled={product.countInStock === 0}
              onClick={() => addToCartHandler(index)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
