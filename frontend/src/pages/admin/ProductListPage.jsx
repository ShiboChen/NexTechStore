import React from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../redux/slices/productsApiSlice";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const ProductListPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetProductsQuery();

  const createProductHandler = () => {
    navigate("/admin/products/create");
  };

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you wanna delete it?")) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center m-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div>
          <button className="btn" onClick={createProductHandler}>
            <FaPlus /> Create Product
          </button>
        </div>
      </div>
      {loadingDelete && <Spinner />}
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="4">{error?.data?.error || error.error}</Alert>
      ) : (
        <>
          <div className="w-full">
            <table className="table w-full">
              <thead className="w-full">
                <tr className="font-bold text-black text-center">
                  <th>PRODUCT IMAGE</th>
                  <th>ID</th>
                  <th>TITLE</th>
                  <th>CATEGORY</th>
                  <th>SELL PRICE</th>
                  <th>SALE PRICE</th>
                  <th>COUNT IN STOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id} className="text-center">
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="avatar mx-auto">
                          <div className="mask mask-circle w-16 h-16">
                            <img
                              src={product.images[0] || "/images/sample.jpg"}
                              alt={product.title}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{product._id}</td>
                    <td className="w-1/4">{product.title}</td>
                    <td>{product.category}</td>
                    <td>${product.sellPrice}</td>
                    <td>${product.salePrice}</td>
                    <td>{product.countInStock}</td>
                    <td>
                      <Link to={`/admin/products/${product._id}/edit`}>
                        <button className="btn btn-sm mx-2">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        className="btn btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default ProductListPage;
