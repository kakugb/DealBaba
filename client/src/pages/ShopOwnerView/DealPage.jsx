import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaTag, FaStore, FaPercent } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
const BASE_URL = import.meta.env.VITE_DEALBABA_URL;

function DealPage() {
  const [deals, setDeals] = useState([]);
  const [userId, setUserId] = useState("");
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null); // Track the deal being updated
  const [updatedDeal, setUpdatedDeal] = useState({});
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

  const openUpdatePopup = (deal) => {
    setCurrentDeal(deal);
    setUpdatedDeal(deal);
    setIsUpdatePopupOpen(true);
  };

  const closeUpdatePopup = () => {
    setIsUpdatePopupOpen(false);
    setCurrentDeal(null);
  };
  const handleChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setUpdatedDeal({ ...updatedDeal, image: file }); // Update the `image` property in the state
    }
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    const formData = new FormData();
    Object.keys(updatedDeal).forEach((key) => {
      formData.append(key, updatedDeal[key]);
    });

    axios
      .put(`${BASE_URL}/deals/update/${currentDeal.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then((response) => {
        console.log("Deal updated successfully:", response.data);
        fetchAll();
        closeUpdatePopup();
      })
      .catch((error) => {
        console.error("Error updating deal:", error);
      });
  };

  return (
    <>
      <div className="h-full min-h-screen p-4  bg-white ">
        <Link
          to="/shopowner/addDeal"
          className="w-full flex justify-end pt-28 pr-6"
        >
          <button
            type="button"
            className="focus:outline-none text-white bg-rose-700 hover:bg-rose-500 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2 overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-300 hover:translate-x-2"
          >
            Add Deals
          </button>
        </Link>
        <h1 className="text-4xl font-extrabold text-rose-700 text-center font-serif mb-12">
          List of all deals
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {deals?.map((deal) => (
            <div
              key={deal.id}
              className="group relative bg-white rounded-xl shadow-xl shadow-slate-400 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
            >
              {/* Image Section */}
              <div className="h-52 w-full bg-cover bg-center border border-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={deal.image}
                  alt="deal-image"
                  className="w-full h-full object-cover rounded-t-xl"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-between p-4">
                <div className="mb-3">
                  <h4 className="text-gray-600 flex items-center gap-2">
                    <FaTag className="text-purple-500" />
                    Deal Name
                  </h4>
                  <h3 className="text-lg font-bold text-gray-900 pl-10">
                    {deal.dealName}
                  </h3>
                </div>
                <div className="mb-3">
                  <h4 className="text-gray-600 flex items-center gap-2">
                    <FaStore className="text-rose-500" />
                    Shop Name
                  </h4>
                  <p className="text-md text-gray-800 pl-10">{deal.shopName}</p>
                </div>
                <div className="mb-3">
                  <h4 className="text-gray-600 flex items-center gap-2">
                    <FaPercent className="text-yellow-500" />
                    Discount
                  </h4>
                  <p className="text-lg font-bold text-green-600 pl-10">
                    {deal.discount}% OFF
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="text-gray-600 flex items-center gap-2">
                    <MdOutlineDescription size={20} color="blue" />
                    description
                  </h4>
                  <p className="text-lg font-bold text-green-600 pl-10">
                    {deal.description}
                  </p>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute top-2 right-2">
                <button
                  className="rounded-full focus:outline-none p-1 bg-gray-100 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from propagating to the document
                    const dropdown = e.currentTarget.nextElementSibling;
                    dropdown.classList.toggle("hidden");

                    const hideDropdown = (event) => {
                      if (!dropdown.contains(event.target)) {
                        dropdown.classList.add("hidden");
                        document.removeEventListener("click", hideDropdown);
                      }
                    };

                    // Add the event listener if the dropdown is being shown
                    if (!dropdown.classList.contains("hidden")) {
                      document.addEventListener("click", hideDropdown);
                    }
                  }}
                >
                  <span className="text-xl font-extrabold text-gray-700">
                    ︙
                  </span>
                </button>

                <div className="w-32 hidden absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                  <ul className="py-1">
                    <li className="flex items-center space-x-2">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-800 font-semibold hover:bg-gray-100"
                        onClick={() => openUpdatePopup(deal)}
                      >
                        <span className="mr-2">✏️</span> Update
                      </button>
                    </li>
                    <li className="flex items-center space-x-2">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 font-semibold hover:bg-gray-100"
                        onClick={() => deleteDeal(deal.id)}
                      >
                        <span className="mr-2">🗑️</span> Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isUpdatePopupOpen && (
          <div className="fixed inset-0 top-16 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white  rounded-lg p-4 w-full max-w-md shadow-md shadow-slate-700">
              <h1
                className="text-right font-bold text-xl cursor-pointer"
                onClick={() => setIsUpdatePopupOpen(false)}
              >
                X
              </h1>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Update Deal
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label
                    htmlFor="shopName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Shop Name
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={updatedDeal.shopName}
                    onChange={(e) =>
                      setUpdatedDeal({
                        ...updatedDeal,
                        shopName: e.target.value
                      })
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter shop name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="dealName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Deal Name
                  </label>
                  <input
                    type="text"
                    id="dealName"
                    name="dealName"
                    value={updatedDeal.dealName}
                    onChange={(e) =>
                      setUpdatedDeal({
                        ...updatedDeal,
                        dealName: e.target.value
                      })
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter deal name"
                    required
                  />
                </div>

                {/* Discount */}
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    min="1"
                    max="100"
                    value={updatedDeal.discount}
                    onChange={(e) =>
                      setUpdatedDeal({
                        ...updatedDeal,
                        discount: e.target.value
                      })
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter discount percentage"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={updatedDeal.description}
                    onChange={(e) =>
                      setUpdatedDeal({
                        ...updatedDeal,
                        description: e.target.value
                      })
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a brief description"
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-red-700 hover:bg-red-500 text-white font-semibold py-2 rounded-md"
                  >
                    Update Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DealPage;
