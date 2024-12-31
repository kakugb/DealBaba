import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTag, FaStore, FaPercent } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_DEALBABA_URL;

function ViewAllDeals() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/deals/getAll`);
        setDeals(response.data.deals);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();
  }, []);

  const viewDealDetail = (id) => {
    navigate(`/customer/viewDetail/${id}`);
  };

  return (
    <div className="h-full min-h-screen p-12 mt-14 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 ">
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-rose-700 mb-10">
        All Deals
      </h1>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="group relative bg-white rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-48">
              <img
                src={deal.image}
                alt={deal.dealName}
                className="w-full h-full object-cover rounded-t-xl"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>

            {/* Glass Content */}
            <div className="p-6 bg-white backdrop-blur-md rounded-b-xl shadow-inner relative">
              <div className="mb-4">
                <h4 className="text-gray-600 flex items-center gap-2">
                  <FaTag className="text-purple-500" />
                  Deal Name
                </h4>
                <h3 className="text-lg font-bold text-gray-900">{deal.dealName}</h3>
              </div>

              <div className="mb-4">
                <h4 className="text-gray-600 flex items-center gap-2">
                  <FaStore className="text-rose-500" />
                  Shop Name
                </h4>
                <p className="text-md text-gray-800">{deal.shopName}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-600 flex items-center gap-2">
                  <FaPercent className="text-yellow-500" />
                  Discount
                </h4>
                <p className="text-lg font-bold text-green-600">{deal.discount}% OFF</p>
              </div>

              {/* View Details Button */}
              <button
                onClick={() => viewDealDetail(deal.id)}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-rose-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
