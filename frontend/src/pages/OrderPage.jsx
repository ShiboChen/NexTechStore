import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../redux/slices/ordersApiSlice";

const OrderPage = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      console.log(details)
      try {
        const response = await payOrder({ orderId, details });
        if (!response.isPaid) {
          toast.success("Failed to pay, try again");
          return;
        }
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Spinner />
  ) : error ? (
    <Alert type="3">{error.data.error}</Alert>
  ) : (
    <>
      <h1 className="text-2xl font-bold my-4 ml-6">Order #: {order._id}</h1>
      <div className="flex">
        <div className="w-[60%] py-2 px-6">
          <div className="mb-6">
            <h2 className="text-2xl my-4">Shipping Address</h2>
            <p>
              <strong>Name: </strong> {order.user.name}
            </p>
            <p>
              <strong>Email: </strong>{" "}
              <a href={`mailto:${order.user.email}`} className="underline">
                {order.user.email}
              </a>
            </p>
            <p className="mb-4">
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city},
              {order.shippingAddress.state}, {order.shippingAddress.postalCode}
            </p>
            {order.isDelivered ? (
              <Alert type="2">Delivered on {order.deliveredAt}</Alert>
            ) : (
              <Alert type="3">Not Delivered</Alert>
            )}
          </div>
          <div className="mb-6">
            <h2 className="text-2xl my-4">Payment Method</h2>
            <p className="mb-4">
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Alert type="2">Paid on {order.paidAt}</Alert>
            ) : (
              <Alert type="3">Not Paid</Alert>
            )}
          </div>
          <div>
            <h2 className="text-2xl my-4">Ordered Items</h2>
            {order.orderItems.length === 0 ? (
              <Alert type="1">Your cart is empty </Alert>
            ) : (
              order.orderItems.map((item) => (
                <div className="flex items-center mt-4" key={item._id}>
                  <div className="w-[15%] text-center">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-14 h-14 rounded-md inline-block"
                    />
                  </div>
                  <div className="w-[45%] truncate">
                    <Link to={`/products/${item._id}`} className="underline ">
                      {item.title}
                    </Link>
                  </div>
                  <div className="flex-grow ml-4 w-1/5">
                    {item.salePrice
                      ? `${item.qty} x $${item.salePrice} = $${
                          item.qty * item.salePrice
                        }`
                      : `${item.qty} x $${item.sellPrice} = $${
                          item.qty * item.sellPrice
                        }`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="w-1/5 my-4 mx-auto">
          <div className="w-full border border-gray-600 rounded-md p-3">
            <h2 className="text-2xl pb-4 border-b border-gray-400">
              Order Summary
            </h2>
            <div className="flex py-4 border-b border-gray-400">
              <strong className="flex-1">Subtotal:</strong>
              <span className="flex-1">${order.itemsPrice}</span>
            </div>
            <div className="flex py-4 border-b border-gray-400">
              <strong className="flex-1">Shipping:</strong>
              <span className="flex-1">${order.shippingPrice}</span>
            </div>
            <div>
              <div className="flex py-4 border-b border-gray-400">
                <strong className="flex-1">Tax:</strong>
                <span className="flex-1">${order.taxPrice}</span>
              </div>
              <div className="flex py-4 ">
                <strong className="flex-1">Total:</strong>
                <span className="flex-1">${order.totalPrice}</span>
              </div>
              {!order.isPaid && (
                <div>
                  {loadingPay && <Spinner />}

                  {isPending ? (
                    <Spinner />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                </div>
              )}

              {loadingDeliver && <Spinner />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <div className="mt-4">
                    <button
                      className="btn btn-neutral"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
