import { toast } from "react-toastify";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaStar, FaStarHalf } from "react-icons/fa";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../common/addtocart";
import Context from "../context";
import { useSelector } from "react-redux";
import BackToTopButton from "../components/BackToTopButton";
import { FaShare } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
const ProductDetails = () => {
  const user = useSelector((state) => state?.user?.user);
  const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });

    return formatter.format(num);
  };

  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const location = useLocation();
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);

  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });
    setLoading(false);
    const dataReponse = await response.json();

    setData(dataReponse?.data);
    setActiveImage(dataReponse?.data?.productImage[0]);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleshare = () => {
    const currentURL = "https://rupeekart2024.netlify.app" + location.pathname;
    const message = `Hi I am shopping this product at Rupeekart.Check out this product:\n${currentURL}`;

    // Encode the message for use in the WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    // Open WhatsApp with the pre-filled message
    window.open(whatsappUrl, '_blank');
};

  const handleZoomImage = useCallback(
    (e) => {
      setZoomImage(true);
      const { left, top, width, height } = e.target.getBoundingClientRect();

      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      setZoomImageCoordinate({
        x,
        y,
      });
    },
    [zoomImageCoordinate]
  );

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    if (!user) {
      toast.error("Please login to buy it");
      return;
    }
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  const calculateDiscount = (price, sellingPrice) => {
    if (!price || !sellingPrice || price <= sellingPrice) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

  const discount = calculateDiscount(data.price, data.sellingPrice);

  return (
    <div className="container mx-auto p-4 mt-20 lg:mt-24">
      <div className="mt-8 lg:mt-0 min-h-[200px] flex flex-col lg:flex-row gap-4">
        {/***product Image */}
        <div className="h-96 flex flex-col lg:flex-row-reverse gap-4">
          <div className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-blue-50 relative p-2">
            <img
              src={activeImage}
              className="h-full w-full object-scale-down mix-blend-multiply"
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
            />

            {/**product zoom */}
            {zoomImage && (
              <div className="hidden lg:block absolute min-w-[450px] overflow-hidden min-h-[400px] bg-blue-50 p-1 -right-[520px] top-0">
                <div
                  className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"
                  style={{
                    background: `url(${activeImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                      zoomImageCoordinate.y * 100
                    }% `,
                  }}
                ></div>
              </div>
            )}
          </div>

          <div className="h-full">
            {loading ? (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {productImageListLoading.map((el, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-blue-50 rounded animate-pulse"
                      key={"loadingImage" + index}
                    ></div>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {data?.productImage?.map((imgURL, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-blue-50 rounded p-1"
                      key={imgURL}
                    >
                      <img
                        src={imgURL}
                        className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer"
                        onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                        onClick={() => handleMouseEnterProduct(imgURL)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/***product details */}
        {loading ? (
          <div className="grid gap-1 w-full">
            <p className="bg-blue-50 animate-pulse h-6 lg:h-8 w-full rounded-full inline-block"></p>
            <h2 className="text-2xl lg:text-4xl font-medium h-6 lg:h-8 bg-blue-50 animate-pulse w-full"></h2>
            <p className="capitalize text-slate-400 bg-blue-50 min-w-[100px] animate-pulse h-6 lg:h-8 w-full"></p>

            <div className="text-blue-600 bg-blue-50 h-6 lg:h-8 animate-pulse flex items-center gap-1 w-full"></div>

            <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8 animate-pulse w-full">
              <p className="text-blue-600 bg-blue-50 w-full"></p>
              <p className="text-slate-400 line-through bg-blue-50 w-full"></p>
            </div>

            <div className="flex items-center gap-3 my-2 w-full">
              <button className="h-6 lg:h-8 bg-blue-50 rounded animate-pulse w-full"></button>
              <button className="h-6 lg:h-8 bg-blue-50 rounded animate-pulse w-full"></button>
            </div>

            <div className="w-full">
              <p className="text-slate-600 font-medium my-1 h-6 lg:h-8 bg-blue-50 rounded animate-pulse w-full"></p>
              <p className="bg-blue-50 rounded animate-pulse h-10 lg:h-12 w-full"></p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="bg-blue-200 text-blue-600 px-2 rounded-full inline-block w-fit mt-4">
              {data?.brandName}
            </p>
            <h2 className="text-2xl lg:text-4xl font-medium">
              {data?.productName}
            </h2>
            <p className="capitalize text-slate-400">{data?.category}</p>

            <div className="text-blue-600 flex items-center gap-1">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
            </div>

            <div className="flex items-center gap-2 text-xl lg:text-2xl font-medium my-1">
              <p className="text-blue-600">
                {displayINRCurrency(data.sellingPrice)}
              </p>
              <p className="text-slate-400 line-through">
                {displayINRCurrency(data.price)}
              </p>
              {discount > 0 && (
                <p className="text-green-600">({discount}% off)</p>
              )}
            </div>

            <div className="flex items-center gap-3 my-2">
              <button
                className="border-2 border-blue-600 rounded px-3 py-1 min-w-[120px] text-blue-600 font-medium hover:bg-blue-600 hover:text-white"
                onClick={(e) => handleBuyProduct(e, data?._id)}
              >
                Buy
              </button>
              <button
                className="border-2 border-blue-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-blue-600 hover:text-blue-600 hover:bg-white"
                onClick={(e) => handleAddToCart(e, data?._id)}
              >
                Add To Cart
              </button>
            </div>
            <div>
              <button className="bg-blue-600 text-white p-2 rounded absolute top-20 right-8 lg:right-16 lg:top-28 font-semibold flex items-center justify-center" onClick={handleshare}>
                <div className="mr-2"><FaShare /></div> Share product
              </button>
            </div>
            <div>
              <p className="text-white-600 font-medium my-1">Description : </p>
              <p>{data?.description}</p>
            </div>
          </div>
        )}
      </div>

      {data.category && (
        <CategoryWiseProductDisplay
          category={data?.category}
          heading={"Recommended Products"}
        />
      )}
      <BackToTopButton />
    </div>
  );
};

export default ProductDetails;
