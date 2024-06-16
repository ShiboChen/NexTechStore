import React, { useState } from "react";
import { useGetSearchProductsQuery } from "../redux/slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import Meta from "../components/Meta";

const HomePage = () => {
  const [categoryType, setCategoryType] = useState("mobiles");
  const { data: categoryProducts, isLoading: isLoadingCategory } =
    useGetSearchProductsQuery(`categories=${categoryType}`);
  const { data: lastestProducts, isLoading: isLoadingLastest } =
    useGetSearchProductsQuery("sort=createdAt_desc");
  return (
    <>
      <Meta />
      <div>
        <img src="/cover.PNG" alt="cover image" className="w-full" />
      </div>
      <div className="w-[70%] mx-auto flex flex-col md:flex-row my-10 gap-4">
        <div className="w-[40%]">
          <img src="/record.PNG" alt="record image" className="w-full"/>
        </div>
        <div className="w-[60%]">
          <ul className="flex text-center border-b border-black">
            <li
              className={`basis-1/5 py-3 cursor-pointer ${
                categoryType == "mobiles" ? "bg-blue-700 text-white" : ""
              }`}
              onClick={() => setCategoryType("mobiles")}
            >
              MOBILES
            </li>
            <li
              className={`basis-1/5 py-3 cursor-pointer ${
                categoryType == "audio" ? "bg-blue-700 text-white" : ""
              }`}
              onClick={() => setCategoryType("audio")}
            >
              AUDIO
            </li>
            <li
              className={`basis-1/5 py-3 cursor-pointer ${
                categoryType == "computer" ? "bg-blue-700 text-white" : ""
              }`}
              onClick={() => setCategoryType("computer")}
            >
              COMPUTER
            </li>
            <li
              className={`basis-1/5 py-3 cursor-pointer ${
                categoryType == "household" ? "bg-blue-700 text-white" : ""
              }`}
              onClick={() => setCategoryType("household")}
            >
              HOUSEHOLD
            </li>
            <li
              className={`basis-1/5 py-3 cursor-pointer ${
                categoryType == "kitchen" ? "bg-blue-700 text-white" : ""
              }`}
              onClick={() => setCategoryType("kitchen")}
            >
              KITCHEN
            </li>
          </ul>
          <div>
            {!isLoadingCategory && (
              <ProductCard
                data={{
                  ...categoryProducts,
                  products: categoryProducts?.products.slice(0, 3),
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="bg-slate-200">
        <div className="w-[70%] mx-auto">
          <h2 className="text-center font-sembold text-xl py-10">
            New Products
          </h2>
          <div>
            {!isLoadingLastest && (
              <ProductCard
                data={{
                  ...lastestProducts,
                  products: lastestProducts?.products.slice(0, 6),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
