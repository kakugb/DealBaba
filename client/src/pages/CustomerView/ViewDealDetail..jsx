import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaFacebookF,
  FaEnvelope,
  FaTimes
} from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_DEALBABA_URL;
function ViewDealDetail() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [isDiscountApproved, setIsDiscountApproved] = useState(false);
  const [showMobileIcons, setShowMobileIcons] = useState(false);
  const [showDesktopIcons, setShowDesktopIcons] = useState(false);
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/deals/deal/${id}`);
        setDeal(response.data.deal);
      } catch (error) {
        console.error("Error fetching deal details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDiscountStatus = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/deals/getDiscountDealStatus?dealId=${id}`
        );
        setIsDiscountApproved(response.data.isApproved);
      } catch (error) {
        console.error("Error fetching discount status:", error);
      }
    };

    const userIdFromLocalStorage = localStorage.getItem("user");
    const userObject = JSON.parse(userIdFromLocalStorage);
    setUserId(userObject.id);

    fetchDeal();
    fetchDiscountStatus();
  }, [id]);

  const handleRequestDiscount = async (dealId) => {
    try {
      const response = await axios.post(`${BASE_URL}/deals/requestDiscount`, {
        dealId,
        userId
      });

      if (response.status === 201) {
        alert("Discount request sent successfully!");
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert(
          err.response.data.message ||
            "An error occurred while processing your request."
        );
      } else {
        alert("Failed to send discount request. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!deal) {
    return <div>Error: Deal not found!</div>;
  }
  const handleShare = (platform) => {
    const shareLink = `${BASE_URL}/auth/login`;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareLink)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareLink
          )}`,
          "_blank"
        );
        break;
      case "instagram":
        alert(
          "Instagram sharing is not directly supported via links. Please copy the link to share."
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareLink
          )}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=Check this out&body=${encodeURIComponent(
          shareLink
        )}`;
        break;
      default:
        alert("Unsupported platform.");
    }
  };

  return (
    <div className=" md:h-screen bg-rose-700">
      <h1 className="w-full  text-white text-4xl font-bold text-center py-5 mt-16 font-mono">
        Deal Detail Page
      </h1>
      <div className="flex items-center justify-center  p-4 ">
        {/* Bottom Buttons */}
        <div className="fixed top-20 left-4 flex justify-between px-4 hover:-translate-x-2 transform transition-transform duration-300">
          {/* Go Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        </div>
        <div className=" rounded-xl max-w-2xl w-full shadow-md shadow-slate-700 hover:-translate-y-2 transform transition-transform duration-300 bg-gray-100">
          {/* Image Section */}
          <div className="h-52 bg-gray-200 flex items-center justify-center rounded-t-xl">
            <img
              src={deal.image}
              alt={deal.dealName}
              className="w-full h-52 object-cover rounded-t-xl"
            />
          </div>

          {/* Content Section */}
          <div className="p-6">
            <p className="text-xl font-bold text-black mt-3 ">
              Deal Name :
              <span className="text-black font-light px-1">
                {" "}
                {deal.dealName}
              </span>
            </p>
            <p className="text-xl font-bold text-black mt-3">
              Shop Name :
              <strong className="text-black font-light px-1">
                {deal.shopName}
              </strong>
            </p>
            <p className="text-xl font-bold text-black mt-3">
              Discount :
              <strong className="text-black font-light px-1">
                {deal.discount}% OFF
              </strong>
            </p>
            <p className="text-xl font-bold text-black mt-3">
              Discription :
              <strong className="text-black font-light px-1">
                {deal.description || "No description available"}
              </strong>
            </p>

            <div className="flex justify-self-end">
              <button
                onClick={() => handleRequestDiscount(deal.id)}
                className={`flex justify-end py-2 px-4 mt-2 rounded-lg hover:translate-x-2 transform transition-transform duration-300 ${
                  isDiscountApproved ? "bg-green-600" : "bg-red-600"
                } text-white hover:${
                  isDiscountApproved ? "bg-green-700" : "bg-red-700"
                }`}
              >
                {isDiscountApproved
                  ? "Discount Approved"
                  : "Request for Discount"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-4 md:hidden ">
            <button
              onClick={() => navigate(-1)} // Go back to the previous page
              className="bg-rose-700 text-white py-2 px-4 rounded-lg hover:bg-rose-500 hover:text-black hover:translate-y-2 transform transition-transform duration-300"
            >
              Back
            </button>

            <button
              onClick={() => setShowMobileIcons(!showMobileIcons)}
              className="bg-rose-700 text-white py-2 px-4 rounded-lg hover:bg-rose-500 hover:text-black hover:translate-y-2 transform transition-transform duration-300"
            >
              Refer Us
            </button>
            {showMobileIcons && (
              <div className="w-full flex justify-center space-x-4 mt-2">
                <FaWhatsapp
                  className="text-3xl text-green-500 cursor-pointer"
                  onClick={() => handleShare("whatsapp")}
                />
                <FaInstagram
                  className="text-3xl text-pink-500 cursor-pointer"
                  onClick={() => handleShare("instagram")}
                />
                <FaTimes
                  onClick={() => setShowMobileIcons(false)} // Close icons
                  className="text-3xl text-red-600 cursor-pointer"
                />
                <FaLinkedin
                  className="text-3xl text-blue-700 cursor-pointer"
                  onClick={() => handleShare("linkedin")}
                />
                <FaEnvelope
                  className="text-3xl text-gray-700 cursor-pointer"
                  onClick={() => handleShare("email")}
                />
                <FaFacebookF
                  className="text-3xl text-blue-600 cursor-pointer"
                  onClick={() => handleShare("facebook")}
                />
              </div>
            )}

            <button
              onClick={() => alert("Follow Us functionality to be added")}
              className="bg-rose-700 text-white py-2 px-4 rounded-lg hover:bg-rose-500 hover:text-black mb-2 hover:translate-y-2 transform transition-transform duration-300"
            >
              Follow Us
            </button>
          </div>
        </div>

        {/* Button Section */}
        <div className="hidden md:flex md:flex-col space-y-3 p-4">
          <button
            onClick={() => setShowDesktopIcons(!showDesktopIcons)}
            className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-400 hover:translate-x-2 transform transition-transform duration-300"
          >
            Refer Us
          </button>
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-400 hover:translate-x-2 transform transition-transform duration-300"
          >
            Back
          </button>

          {showDesktopIcons && (
            <div className="flex flex-col items-end absolute ml-28 mt-12 space-y-4">
              <FaTimes
                onClick={() => setShowDesktopIcons(false)}
                className="text-3xl text-red-600 cursor-pointer"
              />
              <FaWhatsapp
                className="text-3xl text-green-500 cursor-pointer"
                onClick={() => handleShare("whatsapp")}
              />
              <FaInstagram
                className="text-3xl text-pink-500 cursor-pointer"
                onClick={() => handleShare("instagram")}
              />
              <FaLinkedin
                className="text-3xl text-blue-700 cursor-pointer"
                onClick={() => handleShare("linkedin")}
              />
              <FaEnvelope
                className="text-3xl text-gray-700 cursor-pointer"
                onClick={() => handleShare("email")}
              />
              <FaFacebookF
                className="text-3xl text-blue-600 cursor-pointer"
                onClick={() => handleShare("facebook")}
              />
            </div>
          )}

          <button
            onClick={() => alert("Follow Us functionality to be added")}
            className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-400 hover:translate-x-2 transform transition-transform duration-300"
          >
            Follow Us
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewDealDetail;
