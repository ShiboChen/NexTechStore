import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../redux/slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("PayPal or Credit Card");

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="my-6">
          <CheckoutSteps step1 step2 step3 />
        </div>

        <form className="w-1/3 p-5" onSubmit={submitHandler}>
          <h2 className="text-2xl mb-4 text-center">Payment Method</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select a Method</span>
            </label>
            <label>
              <input
                type="radio"
                value="PayPal or Credit Card"
                onChange={(e) => setPaymentMethod(e.target.value)}
                checked={paymentMethod === "PayPal or Credit Card"}
                className="mr-2"
              />
              PayPal or Credit Card
            </label>
          </div>
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentPage;
