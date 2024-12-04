import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // Updated to use a select dropdown
    phoneNumber: "",
    gender: "", // Updated to use a select dropdown
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
     
      const response = await axios.post("http://localhost:5000/api/users", formData);
      setSuccessMessage("User created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phoneNumber: "",
        gender: "",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("Failed to create user. Please try again.");
    }
  };

 

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 overflow-x-auto pt-20">

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
      <div className="w-full max-w-lg bg-gray-200 rounded-lg shadow-md p-6 shadow-slate-700">
        <h2 className="text-2xl font-bold text-center text-rose-800 mb-3">Create User</h2>
        {successMessage && (
          <p className="text-green-600 text-center font-medium mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center font-medium mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
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
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="user">User</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-red-700 text-white font-medium py-2 px-4 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

     
    </div>
  );
};

export default CreateUser;
