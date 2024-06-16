import React from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useGetMyOrdersQuery } from "../redux/slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const MyOrderListPage = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  return (
    <div>
      <h1 className="text-2xl font-bold m-4">My Orders</h1>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="4">{error?.data?.message || error.error}</Alert>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="font-bold text-black text-center">
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id} className="text-center">
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes className="text-red-400 inline-block" />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes className="text-red-400 inline-block" />
                    )}
                  </td>
                  <td>
                    <Link to={`/orders/${order._id}`}>
                      <button className="btn btn-ghost btn-sm">details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrderListPage;
