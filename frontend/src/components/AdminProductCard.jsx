import React, { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);

  const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });

    return formatter.format(num);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-[23%] h-[23%]">
      <div className="w-full flex flex-col items-center">
        <div className="w-40 h-40 flex justify-center items-center mb-4">
          <img
            src={data?.productImage[0]}
            alt={data.productName}
            className="rounded-lg object-contain h-full w-full"
          />
        </div>
        <h1 className="text-lg font-semibold text-gray-800 text-center mb-2 line-clamp-2">
          {data.productName}
        </h1>
        <p className="text-lg font-bold text-blue-600 mb-4">
          {displayINRCurrency(data.sellingPrice)}
        </p>
        <button
          className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
          onClick={() => setEditProduct(true)}
        >
          <MdModeEditOutline size={20} />
        </button>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
