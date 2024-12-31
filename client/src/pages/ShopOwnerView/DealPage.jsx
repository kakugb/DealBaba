import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_DEALBABA_URL;

function DealPage() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserId(user.id);
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  const fetchAll = () => {
    if (userId) {
      axios
        .get(`${BASE_URL}/deals/dealbyUserId/${userId}`)
        .then((response) => {
          setDeals(response.data.deals);
        })
        .catch((error) => {
          console.error("Error fetching deals:", error);
        });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAll();
    }
  }, [userId]);

  const deleteDeal = (dealId) => {
    axios
      .delete(`${BASE_URL}/deals/delete/${dealId}`)
      .then((response) => {
        setDeals(deals.filter((deal) => deal._id !== dealId));
        console.log("Deal deleted successfully:", response.data);
        fetchAll();
      })
      .catch((error) => {
        console.error("Error deleting deal:", error);
      });
  };

  const handleUpdate = (dealId) => {
    navigate(`/shopowner/UpdateDeal/${dealId}`);
  };

  return (
    <>
     <div className="bg-rose-800">
      <Link to="/shopowner/addDeal" className="w-full flex justify-end pt-28 pr-6 ">
          <button
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2 overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-300 hover:translate-x-2"
          >
            Add Deals
          </button>
        </Link>
        <h1 className="text-4xl font-extrabold text-white text-center font-serif mb-8">
          List of all deals
        </h1>
      

      
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {deals?.map((deal) => (
              <div
                key={deal.id}
                 className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 relative"
              >
                <div
                  className="h-52 w-full bg-cover bg-center border border-gray-200"
                  style={{ backgroundImage: `url(${deal.image})` }}
                ></div>
                <div className="flex flex-col justify-between p-4">
                  <h3 className="text-xl font-semibold text-slate-800 truncate">
                    {deal.dealName}
                  </h3>
                  <h5 className="text-lg font-semibold text-slate-800 truncate">
                    {deal.shopName}
                  </h5>
                  <p className="mt-2 text-sm text-slate-500 truncate">
                    {deal.description}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-red-600">
                    {deal.discount}% OFF
                  </p>
                </div>
                <div className="absolute top-2 right-1">
                  <button
                    className=" rounded-full focus:outline-none"
                    onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle("hidden")}
                  >
                    <span className="text-3xl font-extrabold ">︙</span>
                
                  </button>
                  <div className="hidden absolute right-2 mt-2 bg-gray-200 shadow-lg rounded-lg overflow-hidden">
                    <ul>
                      <li>
                        <button
                          className="w-full px-8 py-2 text-left text-red-600 font-semibold hover:bg-gray-300"
                          onClick={() => handleUpdate(deal.id)}
                        >
                          Update
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full px-8 py-2 text-left text-red-600 font-semibold hover:bg-gray-300"
                          onClick={() => deleteDeal(deal.id)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DealPage;
