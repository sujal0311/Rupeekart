import { toast } from 'react-toastify';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Context from '../context/index';
import SummaryApi from '../common/index';
import addToCart from '../common/addtocart';
import { useSelector } from 'react-redux';

const HorizontalCardProduct = ({ category, heading }) => {
    const user = useSelector((state) => state?.user?.user);
    const displayINRCurrency = (num) => {
        const formatter = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        });
        return formatter.format(num);
    };

    const fetchCategoryWiseProduct = async (category) => {
        const response = await fetch(SummaryApi.categoryWiseProduct.url, {
            method: SummaryApi.categoryWiseProduct.method,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ category })
        });

        const dataResponse = await response.json();
        return dataResponse;
    };

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(13).fill(null);
    const scrollElement = useRef();

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        e.preventDefault(); // Prevent default link behavior
        if (!user) {
            toast.error("Please login to add to cart");
            return;
        }
        await addToCart(e, id);
        fetchUserAddToCart();
    };

    const fetchData = async () => {
        setLoading(true);
        const categoryProduct = await fetchCategoryWiseProduct(category);
        setLoading(false);
        setData(categoryProduct?.data);
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    const scrollRight = () => {
        scrollElement.current.scrollTo({
            left: scrollElement.current.scrollLeft + 300,
            behavior: 'smooth'
        });
    };

    const scrollLeft = () => {
        scrollElement.current.scrollTo({
            left: scrollElement.current.scrollLeft - 300,
            behavior: 'smooth'
        });
    };

    const calculateDiscount = (originalPrice, sellingPrice) => {
        return ((originalPrice - sellingPrice) / originalPrice * 100).toFixed(2);
    };

    return (
        <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
            <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all' ref={scrollElement}>
                <button aria-label="Scroll Left" className='bg-white shadow-md rounded-full p-1 absolute left-[-20px] text-lg hidden md:block' onClick={scrollLeft}>
                    <FaAngleLeft />
                </button>
                <button aria-label="Scroll Right" className='bg-white shadow-md rounded-full p-1 absolute right-[-20px] text-lg hidden md:block mx-2' onClick={scrollRight}>
                    <FaAngleRight />
                </button>
                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
                            <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse'></div>
                            <div className='p-4 grid w-full gap-2'>
                                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full'></h2>
                                <p className='capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full'></p>
                                <div className='flex gap-3 w-full'>
                                    <p className='text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                                    <p className='text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                                </div>
                                <button className='text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse'></button>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product) => (
                        <Link key={product?._id} to={"product/" + product?._id} className='w-full min-w-[300px] md:min-w-[340px] max-w-[320px] md:max-w-[340px] h-44 bg-white rounded-sm shadow flex'>
                            <div className='bg-blue-50 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                                <img src={product.productImage[0]} alt={product.productName} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                            </div>
                            <div className='px-2 grid'>
                                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                                <p className='capitalize text-slate-500'>{product?.category}</p>
                                <p className='text-blue-600 text-lg font-bold mb-1'>{displayINRCurrency(product?.sellingPrice)}</p>
                                <div className='flex gap-3 '>
                                    <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                                    <p className='text-green-600 font-medium'>{calculateDiscount(product?.price, product?.sellingPrice)}% off</p>
                                </div>
                                <button className='text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full mb-1 ' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default HorizontalCardProduct;
