import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaWhatsapp, FaInstagram, FaLinkedin, FaFacebookF, FaEnvelope, FaTimes } from 'react-icons/fa';
function ViewDealDetail() {
  const { id } = useParams(); 
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 
  const [userId , setUserId] = useState('');
  const [isDiscountApproved, setIsDiscountApproved] = useState(false); 
  const [showMobileIcons, setShowMobileIcons] = useState(false);
  const [showDesktopIcons, setShowDesktopIcons] = useState(false);
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        console.log("Fetching deal details for ID:", id); 
        const response = await axios.get(`http://localhost:5000/api/deals/deal/${id}`);
        setDeal(response.data.deal); 
      } catch (error) {
        console.error("Error fetching deal details:", error);
      } finally {
        setLoading(false); 
      }
    };

    const fetchDiscountStatus = async () => {
      try {
       
        const response = await axios.get(`http://localhost:5000/api/deals/getDiscountDealStatus?dealId=${id}`);
        setIsDiscountApproved(response.data.isApproved); 
      } catch (error) {
        console.error("Error fetching discount status:", error);
      }
    };

    const userIdFromLocalStorage = localStorage.getItem('user');
    const userObject = JSON.parse(userIdFromLocalStorage);
    setUserId(userObject.id);

    fetchDeal();
    fetchDiscountStatus(); 

  }, [id]);

  const handleRequestDiscount = async (dealId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/deals/requestDiscount`,
        { dealId, userId }
      );
 
      if (response.status === 201) { 
        alert("Discount request sent successfully!");
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.message || "An error occurred while processing your request.");
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
    const shareLink = "http://localhost:5000/api/auth/login";
  
    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareLink)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, "_blank");
        break;
      case "instagram":
        alert("Instagram sharing is not directly supported via links. Please copy the link to share.");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=Check this out&body=${encodeURIComponent(shareLink)}`;
        break;
      default:
        alert("Unsupported platform.");
    }
  };
  
  return (
    <>
      <h1 className='w-full  text-rose-700 text-4xl font-bold text-center py-5 mt-16'>Deal Detail Page</h1>
      <div className="flex items-center justify-center  p-4 ">
              {/* Bottom Buttons */}
       <div className="fixed top-20 left-4 flex justify-between px-4">
        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className=" bg-rose-700 p-3 text-white py-2 rounded-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
           Go Back
        </button>

       
      </div>
        <div className=" rounded-lg  max-w-2xl w-full shadow-md shadow-slate-700">
          {/* Image Section */}
          <div className="h-52 bg-gray-200 flex items-center justify-center">
            <img
              src={deal.image}
              alt={deal.dealName}
              className="w-full h-52 object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 "><span>Deal Name: {deal.dealName}</span></h1>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Shop Name:</strong> {deal.shopName}
            </p>
            <p className="text-lg font-bold text-blue-600 mb-4">{deal.discount}% OFF</p>
            <p className="text-lg font-bold mb-4">Description</p>
            <p className="text-sm text-gray-600 mb-4">
              {deal.description || "No description available"}
            </p>

            <div className='flex justify-self-end'>
              <button
                onClick={() => handleRequestDiscount(deal.id)}
                className={`flex justify-end py-2 px-4 rounded-lg ${isDiscountApproved ? 'bg-green-600' : 'bg-red-600'} text-white hover:${isDiscountApproved ? 'bg-green-700' : 'bg-red-700'}`}
              >
                {isDiscountApproved ? 'Discount Approved' : 'Request for Discount'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-4 md:hidden ">
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Back
          </button>
         
          <button
            onClick={() => setShowMobileIcons(!showMobileIcons)}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
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
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Follow Us
          </button>
        </div>
       
      </div>
       {/* Button Section */}
        <div className="hidden md:flex md:flex-col space-y-3 p-4 ">
        <button
            onClick={() => setShowDesktopIcons(!showDesktopIcons)}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Refer Us
          </button>
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
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
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Follow Us
          </button>
        </div>
      </div>
    </>
  );
}

export default ViewDealDetail;
