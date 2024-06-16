import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/slices/usersApiSlice";
import { logout } from "../redux/slices/authSlice";
import { resetCart } from "../redux/slices/cartSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const keywordFromQuery = urlParams.get("keyword");
    if (keywordFromQuery) {
      setKeyword(keywordFromQuery);
    } else {
      setKeyword("")
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("keyword", keyword.trim());
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const numItems = cartItems.reduce((a, c) => a + c.qty, 0);
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-blue-400 text-white">
      <div className="flex-1">
        <Link to="/" className="text-xl">
          NexTechStore
        </Link>
        {/* <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <details>
                <summary className="text-base">PRODUCTS</summary>
                <ul className="p-2 text-black">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <Link>ABOUT US</Link> */}
      </div>
      <div className="flex flex-none">
        <form
          className="bg-slate-100 p-3 rounded-lg flex items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-48 text-black"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button>
            <FaSearch className="text-xl text-slate-600" />
          </button>
        </form>
        <div className="dropdown dropdown-end ml-3">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaShoppingCart className="text-3xl" />
              <span className="badge badge-sm indicator-item">
                {cartItems.length > 0 ? numItems : 0}
              </span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-48 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg text-black">
                {cartItems.length > 0 ? numItems : 0} Items
              </span>
              <span className="text-info">
                Subtotal: $
                {cartItems
                  .reduce(
                    (acc, item) =>
                      item.salePrice !== 0
                        ? acc + item.salePrice * item.qty
                        : acc + item.sellPrice * item.qty,
                    0
                  )
                  .toFixed(2)}
              </span>
              <div className="card-actions">
                <Link to="/cart" className="btn btn-primary btn-block">
                  View cart
                </Link>
              </div>
            </div>
          </div>
        </div>
        {userInfo && userInfo.isAdmin ? (
          <div className="dropdown dropdown-hover bg-blue-400">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-blue-400 border-none hover:bg-white"
            >
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={userInfo.profileImg || "/avatar.png"} />
                </div>
              </div>
              {userInfo.name}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 text-gray-400"
            >
              <li>
                <Link to={`/profile/${userInfo._id}`}>Profile</Link>
              </li>
              <li>
                <Link to="/admin/userlist">Users</Link>
              </li>
              <li>
                <Link to="/admin/orderlist">Orders</Link>
              </li>
              <li>
                <Link to="/admin/productlist">Products</Link>
              </li>
              <li>
                <Link onClick={logoutHandler}>Logout</Link>
              </li>
            </ul>
          </div>
        ) : userInfo ? (
          <div className="dropdown dropdown-hover bg-blue-400">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-blue-400 border-none hover:bg-white"
            >
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={userInfo.profileImg || "/avatar.png"} />
                </div>
              </div>
              {userInfo.name}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 text-gray-400"
            >
              <li>
                <Link to={`/profile/${userInfo._id}`}>Profile</Link>
              </li>
              <li>
                <Link to={`/myorderlist`}>My Orders</Link>
              </li>
              <li>
                <Link onClick={logoutHandler}>Logout</Link>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <Link to="/login" className="flex items-center text-xl">
              <FaUser className="text-xl mx-2" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
