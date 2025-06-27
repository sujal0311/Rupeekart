import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common/index';
import { Slider } from 'antd'; 
import 'antd/dist/reset.css'; 
import { CircularProgress } from '@mui/material';
import BackToTopButton from '../components/BackToTopButton';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  const [priceRange, setPriceRange] = useState([1, 100000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const brandOptions = ["Mi", "Samsung", "LG", "HP", "Sony","Nikon","Boat","Motorola","Realme","Canon"];
  
  const productCategory = [
    { id: 1, label: "Camera", value: "camera" },
    { id: 2, label: "Earphones", value: "earphones" },
    { id: 3, label: "Mobiles", value: "mobiles" },
    { id: 4, label: "Mouse", value: "Mouse" },
    { id: 5, label: "Printers", value: "printers" },
    { id: 6, label: "Refrigerator", value: "refrigerator" },
    { id: 7, label: "Trimmers", value: "trimmers" },
    { id: 8, label: "Televisions", value: "televisions" },
    { id: 9, label: "Watches", value: "watches" },
  ];

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach(el => {
    urlCategoryListObject[el] = true;
  });
  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    if (filterCategoryList.length === 0) return;
    console.log(priceRange)
    setLoading(true);
    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        category: filterCategoryList,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        brands: selectedBrands,
      }),
    });

    const dataResponse = await response.json();
    setData(dataResponse?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    const urlCategoryListObject = {};
    urlCategoryListinArray.forEach(el => {
      urlCategoryListObject[el] = true;
    });
    setSelectCategory(urlCategoryListObject);
  }, [location.search]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;

    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .map((categoryKeyName) => {
        if (selectCategory[categoryKeyName]) {
          return categoryKeyName;
        }
        return null;
      })
      .filter((el) => el);

    setFilterCategoryList(arrayOfCategory);

    const urlFormat = arrayOfCategory.map((el, index) => {
      if (arrayOfCategory.length - 1 === index) {
        return `category=${el}`;
      }
      return `category=${el}&&`;
    });
    navigate("/product-category?" + urlFormat.join(""));
  }, [selectCategory]);

  useEffect(() => {
    fetchData();
  }, [filterCategoryList, priceRange, selectedBrands]);

  const handleSelectBrand = (e) => {
    const { value, checked } = e.target;
  
    setSelectedBrands((prev) =>
      checked ? [...prev, value] : prev.filter((brand) => brand !== value)
    );
  };

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;

    setSortBy(value);

    if (value === 'asc') {
      setData((prev) => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice));
    }

    if (value === 'dsc') {
      setData((prev) => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice));
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='container mx-auto p-4 mt-20 lg:mt-24'>
      {/* Mobile Filter Button */}
      <div className='lg:hidden flex justify-end'>
        <button 
          onClick={toggleModal} 
          className='bg-blue-600 text-white p-4 rounded-md mx-auto'>
          Filter & Sort
        </button>
      </div>

      {/* Desktop and Tablet */}
      <div className='grid grid-cols-1 lg:grid-cols-[200px,1fr] gap-4'>
        {/* Left Side (Filters for Desktop/Tablet, Modal for Mobile) */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isModalOpen ? 'block' : 'hidden'} lg:block lg:relative lg:bg-transparent lg:inset-auto lg:z-auto mt-12 overflow-y-auto`}>
          <div className='bg-white p-4 lg:min-h-screen overflow-y-auto'>
            {/* Close Button for Mobile */}
            <div className='flex justify-end lg:hidden'>
              <button 
                onClick={handleCloseModal} 
                className='bg-red-600 text-white p-2 rounded-md'>
                Close
              </button>
            </div>

            {/* Sort by */}
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>
                Sort by
              </h3>
              <form className='text-sm flex flex-col gap-2 py-2'>
                <div className='flex items-center gap-3'>
                  <input
                    type='radio'
                    name='sortBy'
                    checked={sortBy === 'asc'}
                    onChange={handleOnChangeSortBy}
                    value={"asc"}
                  />
                  <label>Price - Low to High</label>
                </div>
                <div className='flex items-center gap-3'>
                  <input
                    type='radio'
                    name='sortBy'
                    checked={sortBy === 'dsc'}
                    onChange={handleOnChangeSortBy}
                    value={"dsc"}
                  />
                  <label>Price - High to Low</label>
                </div>
              </form>
            </div>

            {/* Filter by Category */}
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>
                Category
              </h3>
              <form className='text-sm flex flex-col gap-2 py-2'>
                {productCategory.map((categoryName, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      name={"category"}
                      checked={selectCategory[categoryName?.value]}
                      value={categoryName?.value}
                      id={categoryName?.value}
                      onChange={handleSelectCategory}
                    />
                    <label htmlFor={categoryName?.value}>
                      {categoryName?.label}
                    </label>
                  </div>
                ))}
              </form>
            </div>

            {/* Filter by Price Range */}
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>
                Price Range
              </h3>
              <div className='text-sm flex flex-col gap-2 py-2'>
                <Slider
                  range
                  min={1}
                  max={100000}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value)}
                  step={100}
                />
                <div className='flex justify-between'>
                  <span>{`Min: ₹${priceRange[0]}`}</span>
                  <span>{`Max: ₹${priceRange[1]}`}</span>
                </div>
              </div>
            </div>

            {/* Filter by Brand */}
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>
                Brand
              </h3>
              <form className='text-sm flex flex-col gap-2 py-2'>
                {brandOptions.map((brand, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      name={"brand"}
                      value={brand}
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={handleSelectBrand}
                    />
                    <label htmlFor={brand}>
                      {brand}
                    </label>
                  </div>
                ))}
              </form>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className='lg:col-span-1 mt-4 lg:mt-16'>
          {loading ? (
            <div className='flex justify-center items-center mt-40'><CircularProgress/></div>
          ) : (
           <> <VerticalCard data={data} />
            <BackToTopButton /></>
          )}
      
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
