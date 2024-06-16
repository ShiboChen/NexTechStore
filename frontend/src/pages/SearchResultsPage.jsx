import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetSearchProductsQuery } from "../redux/slices/productsApiSlice";
import ProductCard from "../components/ProductCard";

const SearchResultsPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const searchQuery = urlParams.get("keyword");

  const [keyword, setKeyword] = useState(searchQuery);
  const [categories, setCategories] = useState(["All"]);
  const [countInStock, setCountInStock] = useState(false);
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState("createdAt_desc");
  const [query, setQuery] = useState(search.split("?")[1]);

  const possibleCategories = [
    "All",
    "Mobiles",
    "Audio",
    "Computer",
    "Household",
    "Kitchen",
  ];

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setCategories((preCategories) =>
      checked
        ? [...preCategories, value]
        : preCategories.filter((category) => category !== value)
    );
  };

  const possiblePrices = [
    "All",
    "Below $100",
    "$100-500",
    "$1k-10k",
    "$10k-20k",
    "Above $20k",
  ];

  const handleSubmit = (e, num = 1) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    keyword && urlParams.set("keyword", keyword);
    countInStock && urlParams.set("countInStock", countInStock);
    price && urlParams.set("price", price);
    sort && urlParams.set("sort", sort);
    urlParams.set("pageNumber", num);

    let searchQuery;
    if (categories.length !== 0) {
      searchQuery =
        urlParams.toString() +
        "&" +
        categories
          .map((item) => `categories=${encodeURIComponent(item)}`)
          .join("&");
    } else {
      searchQuery = urlParams.toString();
    }

    setQuery(searchQuery);
    navigate(`/search?${searchQuery}`);
  };

  const { data, isLoading } = useGetSearchProductsQuery(query);

  return (
    <div className="w-[70%] mx-auto flex mt-8">
      <form className="basis-[30%] p-4 bg-slate-100" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <label className="whitespace-nowrap font-semibold">Keyword:</label>
          <input
            type="text"
            placeholder="Search..."
            className="focus:outline-none text-black rounded-md p-1"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.trim())}
          />
        </div>
        <div>
          <h2 className="font-semibold my-2">Categories</h2>
          {possibleCategories.map((category, index) => (
            <div
              key={`key + ${index}`}
              className="flex items-center ml-4 gap-2"
            >
              <input
                type="checkbox"
                value={category}
                id={category}
                name={category}
                checked={categories.includes(category)}
                onChange={handleCategoryChange}
                className="w-4 h-4"
              />
              <label htmlFor={category}> {category} </label>
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-semibold my-2">Availability</h2>
          <div className="flex items-center ml-4 gap-2">
            <input
              type="checkbox"
              id="countInStock"
              name="countInStock"
              className="w-4 h-4"
              value={countInStock}
              onChange={() =>
                countInStock ? setCountInStock(false) : setCountInStock(true)
              }
              checked={countInStock === true}
            />
            <label htmlFor="countInStock"> In Stock </label>
          </div>
        </div>
        <div>
          <h2 className="font-semibold my-2">Price</h2>
          {possiblePrices.map((priceItem, index) => (
            <div
              key={`key + ${index}`}
              className="flex items-center ml-4 gap-2"
            >
              <input
                type="radio"
                value={priceItem}
                id={priceItem}
                name="price"
                checked={price == priceItem}
                onChange={(e) => setPrice(e.target.id)}
                className="w-4 h-4"
              />
              <label htmlFor={priceItem}> {priceItem} </label>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button className="bg-blue-700 text-white p-2 rounded-lg uppercase hover:opacity-95 my-4 w-1/2">
            Search
          </button>
        </div>
      </form>
      <div className="grow pl-6">
        {!isLoading && (
          <>
            <div className="flex justify-between items-center">
              <div className="font-semibold text-base">Showing Results: </div>
              <div className="flex items-center gap-3">
                <label className="font-semibold text-base">Sort:</label>
                <select
                  value={sort}
                  id="sort_order"
                  className="border rounded-md p-1"
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="price_desc">Price high to low</option>
                  <option value="price_asc">Price low to hight</option>
                  <option value="createdAt_desc">Latest</option>
                  <option value="createdAt_asc">Oldest</option>
                </select>
              </div>
            </div>
            <div>
              <ProductCard data={data} />
            </div>
          </>
        )}
        {data?.pages > 1 && (
          <div className="join">
            {[...Array(data?.pages).keys()].map((x) => (
              <button
                key={x + 1}
                className={`join-item btn btn-sqaure ${
                  x + 1 === data?.page ? "btn-active" : ""
                }`}
                onClick={(e) => handleSubmit(e, x + 1)}
              >
                {x + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
