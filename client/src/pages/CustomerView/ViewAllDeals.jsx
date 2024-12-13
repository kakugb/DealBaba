import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function ViewAllDeals() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    
    const fetchDeals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/deals/getAll');
        setDeals(response.data.deals); 
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();
  }, []);

  const viewDealDetail = (id) => {
    console.log(id); // Logs the id for debugging
    navigate(`/customer/viewDetail/${id}`); // Navigates to the specified route with the id
  };
  

  return (
    <div className="p-24">
  <h1 className="text-4xl font-bold mb-8 text-center text-rose-700">All Deals</h1>

  {/* Grid container for cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
    {deals.map((deal) => (
      
      <div
        key={deal.id}
        className="group relative bg-white  rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-md shadow-slate-700"
      >
        {/* Image */}
        <img
          src={deal.image}
          alt={deal.dealName}
          className="w-10/12 h-48 object-cover transition-all duration-500 group-hover:opacity-90"
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-2">{deal.dealName}</h3>
          <p className="text-sm text-gray-200 mb-4">{deal.shopName}</p>
          <p className="text-lg font-bold text-yellow-400">{deal.discount}% OFF</p>

          {/* View Details Button */}
          <button
            onClick={() => viewDealDetail(deal.id)}
            className="mt-4 w-full px-4 py-2 bg-rose-700 text-white font-semibold rounded-lg hover:bg-rose-500 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}

export default ViewAllDeals;
