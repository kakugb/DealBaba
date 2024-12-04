import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { login } from "../../../store/authSlice.js";
import DealBabaImg from '../../assets/DealBabaimg.png'
function Login() {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the user is already authenticated from localStorage
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedIsAuthenticated && storedUser) {
      dispatch(login(storedUser));
      navigate(`/${storedUser.role}/dashboard`);  // Redirect to the correct dashboard
    }
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      setLoading(false);

      const { user, token } = response.data;

      // Store user info and token in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // Dispatch the login action to store user info in Redux
      dispatch(login(user));

      // Redirect to role-based dashboard
      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950 bg-rose-800">
      <div className="w-full bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md shadow-slate-800">
        <div className="flex justify-center mb-4">
          <img
            src={DealBabaImg}
            alt="Company Logo"
            className="mb-5 object-cover"
          />
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          <div className="flex items-center justify-end mb-4">
            <Link
              to="/register"
              className="text-md text-indigo-500 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-end font-bold"
            >
              Create Account
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center bg-rose-800 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-rose-600">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* <div className="flex items-center justify-end mt-8">
            <Link
              to="/otp"
              className="text-sm hover:underline text-indigo-500 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-end font-bold"
            >
              Verify phone Number & Email Address
            </Link>
          </div> */}
      </div>
      
    </div>
  );
}

export default Login;
