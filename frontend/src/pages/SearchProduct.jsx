import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common/index';
import VerticalCard from '../components/VerticalCard';
import BackToTopButton from "../components/BackToTopButton";

const SearchProduct = () => {
    const { search } = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("query", search);

    const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${SummaryApi.searchProduct.url}${search}`);
            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                const errorText = await response.text(); // Read the response as text
                console.error('Error Response:', errorText); // Log the error response
                throw new Error('Network response was not ok');
            }

            if (contentType && contentType.includes('application/json')) {
                const dataResponse = await response.json();
                console.log('JSON Response:', dataResponse.data);
                setData(dataResponse.data || []);
                console.log("data", data);
                setLoading(false);
            } else {
                const errorText = await response.text(); // Read the response as text
                console.error('Non-JSON Response:', errorText); // Log the non-JSON response
                throw new Error('Received non-JSON response');
            }
        } catch (error) {
            console.error("Fetch error: ", error);
            setError(error.message);
        } 
    };

    useEffect(() => {
        fetchProduct();
    }, [search]);

    return (
        <div className='container mx-auto p-4'>
            {loading && (
                <p className='text-lg text-center'>Loading ...</p>
            )}

            {!loading && error && (
                <p className='text-lg text-center text-red-500'>{error}</p>
            )}

           

            {!loading && data.length === 0 && !error && (
                <p className='bg-white text-lg text-center p-4'>No Data Found....</p>
            )}
           <div>  <p className='text-lg font-semibold mt-20 lg:mt-24 mb-4'>Search Results: {data.length}</p></div>
            {!loading && data.length !== 0 && (
                <VerticalCard data={data} />
            )}
            <BackToTopButton />
        </div>
    );
};

export default SearchProduct;
