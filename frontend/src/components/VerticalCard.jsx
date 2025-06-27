import React, { useContext } from "react";
import Context from "../context/index";
import addToCart from "../common/addtocart";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

const VerticalCard = ({ loading, data = [] }) => {
  const user = useSelector((state) => state?.user?.user);
  const loadingList = new Array(13).fill(null);
  const { fetchUserAddToCart } = useContext(Context);
  console.log("data", data.length);
  const handleAddToCart = async (e, id) => {
    e.preventDefault(); // Prevent default link behavior
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    await addToCart(e, id);
    fetchUserAddToCart();
  };
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
    return formatter.format(num);
  };

  return (
    <div className=" grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all md:mx-2 ">
      {loading
        ? loadingList.map((product, index) => {
            return (
              <div className="w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow ">
                <div className="bg-blue-50 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse"></div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-blue-50"></h2>
                  <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-blue-50  py-2"></p>
                  <div className="flex gap-3">
                    <p className="text-blue-600 font-medium p-1 animate-pulse rounded-full bg-blue-50 w-full  py-2"></p>
                    <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-blue-50 w-full  py-2"></p>
                  </div>
                  <button className="text-sm  text-white px-3  rounded-full bg-blue-50  py-2 animate-pulse"></button>
                </div>
              </div>
            );
          })
        : data.map((product, index) => {
            return (
              <Link
                to={"/product/" + product?._id}
                className="w-full min-w-[280px]  md:min-w-[300px] max-w-[280px] md:max-w-[300px]  bg-white rounded-sm shadow my-2 xl:my-0"
                onClick={scrollTop}
              >
                <div className="bg-blue-50 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center ">
                  <img
                    src={product?.productImage[0]}
                    className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                  />
                </div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                    {product?.productName}
                  </h2>
                  <p className="capitalize text-slate-500">
                    {product?.category}
                  </p>
                  <div className="flex gap-3">
                    <p className="text-blue-600 font-medium">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>
                    <p className="text-slate-500 line-through">
                      {displayINRCurrency(product?.price)}
                    </p>
                  </div>
                  <button
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-0.5 rounded-full"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            );
          })}
    </div>
  );
};

export default VerticalCard;
