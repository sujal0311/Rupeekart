import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common/index";
import AdminProductCard from "../components/AdminProductCard";
import { Typography, CircularProgress } from "@mui/material";
import BackToTopButton from "../components/BackToTopButton";

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();

    console.log("product data", dataResponse);

    setAllProduct(dataResponse?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div>
      <div className=" py-2 px-4 flex justify-between items-center">
        <div className="flex justify-center">
          <Typography variant="h4" component="h1" gutterBottom>
            All Products
          </Typography>
        </div>
        <button
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full "
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/**all product */}
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>):(<div className="flex items-center flex-wrap gap-5 py-4  overflow-auto">
        {allProduct.map((product, index) => {
          return (
            <AdminProductCard
              data={product}
              key={index + "allProduct"}
              fetchdata={fetchAllProduct}
            />
          );
        })}
      </div>)}

      {/**upload prouct component */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
      <BackToTopButton />
    </div>
  );
};

export default AllProducts;
