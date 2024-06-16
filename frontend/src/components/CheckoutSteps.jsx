import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="text-lg breadcrumbs">
      <ul>
        <li>
          {step1 ? (
            <Link to={userInfo ? "/shipping" : "/login"}>Sign In</Link>
          ) : (
            <Link className="text-gray-500 cursor-not-allowed no-underline hover:no-underline">
              Sign In
            </Link>
          )}
        </li>
        <li>
          {step2 ? (
            <Link to="/shipping">Shipping</Link>
          ) : (
            <Link className="text-gray-500 cursor-not-allowed no-underline hover:no-underline">
              Shipping
            </Link>
          )}
        </li>
        <li>
          {step3 ? (
            <Link to="/payment">Payment</Link>
          ) : (
            <Link className="text-gray-500 cursor-not-allowed no-underline hover:no-underline">
              Payment
            </Link>
          )}
        </li>
        <li>
          {step4 ? (
            <Link to="/placeorder">Place Order</Link>
          ) : (
            <Link className="text-gray-500 cursor-not-allowed no-underline hover:no-underline">
              Place Order
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default CheckoutSteps;
