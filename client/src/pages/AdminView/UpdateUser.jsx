import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_DEALBABA_URL;
const UpdateUser = () => {
  const [user, setUser] = useState({

    email: "",
    phoneNumber: "",
    name:"",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userId } = useParams(); 

  useEffect(() => {
   
    const fetchUser = async () => {
      try {
       
        const response = await axios.get(
          `${BASE_URL}/users/${userId}`
        );
        console.log(response.data)
        setUser(response.data.user); 
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };
  
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/users/${userId}`, user);
      setLoading(false);
      navigate("/admin/dashboard"); 
    } catch (err) {
      setLoading(false);
      setError("Failed to update user data");
    }
  };
  const showAlert = () => {
    alert("This is an alert!");
  };

  console.log(user)
  return (
    <>
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="fixed top-20 left-4 flex justify-between px-4">
        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className=" bg-rose-700 p-3 text-white py-2 rounded-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
           Go Back
        </button>

       
      </div>
      <div className="w-full max-w-lg bg-white rounded-lg  p-6 shadow-md shadow-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-700">Update User</h2>
        {error && (
          <p className="text-red-600 text-center font-medium mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
       

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

         

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-red-700 text-white font-medium py-2 px-4 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Updating..." : "Update "}
            </button>
          </div>
        </form>
      </div>
    </div>
    
   </>
  );
};

export default UpdateUser;
