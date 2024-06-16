import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../redux/slices/cartSlice";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../redux/slices/productsApiSlice";
import Rating from "../components/Rating";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import Meta from "../components/Meta";

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [currentImage, setCurrentImage] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  useEffect(() => {
    if (product?.images) {
      setCurrentImage(product.images[0]);
    }
  }, [product?.images]);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="3"> {error?.data?.error || error.error}</Alert>
      ) : (
        <>
          <Meta title={product?.title} description={product?.description} />
          <div className="flex mt-4">
            <div className="flex basis-[70%]">
              <div className="w-[55%] h-[420px]">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="h-3/4 mx-auto"
                />
                <ul className="flex p-1 gap-2 bg-slate-100 justify-center">
                  {product?.images !== 0 &&
                    product?.images.map((img, index) => (
                      <li key={`image + ${index}`} className="w-[16%] h-[100px]">
                        <img
                          src={img}
                          alt={`preview-${index}`}
                          onClick={() => setCurrentImage(img)}
                          className={
                            currentImage == img
                              ? "border-4 border-green-400 w-full h-full"
                              : "w-full h-full"
                          }
                        />
                      </li>
                    ))}
                </ul>
              </div>
              <div className="w-[45%] p-4">
                <h2 className="text-red-400 font-bold text-xl truncate my-4">
                  {product.title}
                </h2>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                <div className="flex gap-8 my-4">
                  <strike>${product.sellPrice}</strike>
                  <strong>${product.salePrice}</strong>
                </div>
                <p>
                  <span className="font-bold text-black">Description:</span>{" "}
                  {product.description}
                </p>

                <button
                  className="btn btn-neutral btn-sm my-4"
                  onClick={() =>
                    document.getElementById("review_section").showModal()
                  }
                >
                  Write Review
                </button>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-[60%] mx-auto p-4 mt-6 border border-gray-600 rounded-md">
                <div className="flex">
                  <strong className="flex-1">Price:</strong>
                  <span className="flex-1">
                    {product.salePrice !== 0
                      ? `$${product.salePrice}`
                      : `$${product.sellPrice}`}
                  </span>
                </div>
                <div className="flex py-4 my-4 border-y border-gray-400">
                  <strong className="flex-1">Status:</strong>
                  <span className="flex-1">
                    {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                  </span>
                </div>
                {product.countInStock > 0 && (
                  <div className="flex pb-4 border-b border-gray-400">
                    <span className="flex-1 font-medium">Quantity:</span>
                    <select
                      className="flex-1 h-8 border border-black rounded-md"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    className="btn btn-neutral"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[50%] px-4 mt-[8%]">
            <h2 className="font-bold p-4 bg-slate-400 text-white inline-block text-center rounded-md">
              Reviews
            </h2>
            {product?.reviews &&
              product.reviews.map((review, index) => (
                <div
                  key={`key + ${index}`}
                  className="my-3 border-2 border-grey-400 rounded-md"
                >
                  <div className="flex w-1/10 p-2">
                    <div className="p-4 text-center">{review.name}</div>
                    <div className="grow">
                      <div className="flex justify-between items-center">
                        <Rating value={review.rating} />
                        <span>{review.createdAt.substring(0, 10)}</span>
                      </div>
                      <div className="mt-4">{review.comment}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {userInfo ? (
        <dialog
          id="review_section"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Write a Customer Review</h3>
            {loadingProductReview && <Spinner />}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Rating</span>
              </label>
              <select
                className="input input-bordered"
                required
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="0">Select...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Comment</span>
              </label>
              <input
                type="textarea"
                aria-rowspan={4}
                className="input input-bordered"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
            </div>
            <button
              className="btn btn-primary"
              disabled={loadingProductReview}
              onClick={submitHandler}
            >
              Submit
            </button>
          </div>
        </dialog>
      ) : (
        <dialog
          id="review_section"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box flex items-center">
            <Alert type="1">
              Please
              <Link to="/login" className="px-2 underline">
                Sign In
              </Link>
              to write a review
            </Alert>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default ProductPage;
