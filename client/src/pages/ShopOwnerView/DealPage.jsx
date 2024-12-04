import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function DealPage() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUserId(user.id);
    } else {
      console.log('No user found in localStorage');
    }
  }, []);

  const fetchAll = () => {
    if (userId) { 
      axios
        .get(`http://localhost:5000/api/deals/dealbyUserId/${userId}`)
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
      .delete(`http://localhost:5000/api/deals/delete/${dealId}`)
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
    navigate(`/shopowner/updateDeal/${dealId}`); 
  };

  console.log(deals);

  return (
    <>
      <div className="w-full flex justify-end pt-20 ">
        <Link to="/shopowner/addDeal">
          <button
            type="button"
            className="focus:outline-none text-white mt-2 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Add Deals
          </button>
        </Link>
      </div>

      <div>
        <h1 className="text-4xl font-extrabold text-red-700 text-center font-serif">
          List of all deals
        </h1>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          

        <div className="mt-6 grid grid-cols-1 gap-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 ">
  {deals?.map((deal) => (
    <div key={deal.id} className="flex flex-col bg-white rounded-lg overflow-hidden w-full shadow-md shadow-slate-700">
      <div 
        className="h-52 w-full sm:w-72 lg:w-80 xl:w-96 bg-cover bg-center border border-spacing-2" 
        style={{ backgroundImage: `url(${deal.image})` }}
      >
        {/* Deal Image as background */}
      </div>
      <div className="flex flex-col justify-between p-4 h-40">
        <h3 className="text-xl font-semibold text-slate-800 truncate">{deal.dealName}</h3>
        <h5 className="text-xl font-semibold text-slate-800 truncate">{deal.shopName}</h5>
        <p className="mt-2 text-sm text-slate-500 truncate">{deal.description}</p>
        <p className="mt-2 text-lg font-semibold text-red-600">{deal.discount}% OFF</p>
      </div>
      <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-b-lg">
        {/* Update Button */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold shadow-md focus:outline-none"
          onClick={() => handleUpdate(deal.id)}  // Pass dealId to navigate
        >
          Update
        </button>

        {/* Delete Button */}
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow-md focus:outline-none"
          onClick={() => deleteDeal(deal.id)}  // Pass dealId to delete
        >
          Delete
        </button>
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
