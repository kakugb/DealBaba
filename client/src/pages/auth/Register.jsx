import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DealBabaImg from '../../assets/DealBabaimg.png';
const BASE_URL = import.meta.env.VITE_DEALBABA_URL;
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    gender: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Ensure the API URL is correct
      const response = await axios.post(
        `${BASE_URL}/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log(response.data);
      setMessage("Registration successful! Please verify your OTP.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      setMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-rose-800">
      <div className="w-full min-h-screen flex items-center justify-center dark:bg-gray-950">
        <div className="max-w-full dark:bg-gray-900 shadow-md rounded-lg px-6 py-6 bg-white shadow-slate-800">
          <div className="flex justify-center mb-4">
            <img
              src={DealBabaImg}
              alt="Company Logo"
              className="mb-5 object-cover"
            />
          </div>
          {message && <p className="text-green-400 font-bold">{message}</p>}

          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="customer">Customer</option>
                  <option value="shopowner">Shop Owner</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-rose-800 text-white rounded-lg hover:bg-rose-600"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="flex items-center justify-end mt-8">
            <Link
              to="/login"
              className="text-md text-indigo-500 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-end font-bold"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
