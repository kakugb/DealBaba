import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_DEALBABA_URL; 
const OptForm = () => {
  const [emailOtp, setOtpEmail] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email');
  const phoneNumber = params.get('phoneNumber');

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const verificationData = {
      otpEmail: emailOtp,
      otpPhone,
      email,
      phoneNumber,
    };

    try {
               
      const response = await axios.post(
        `${BASE_URL}/auth/verified`,
        verificationData
      );
      setLoading(false);
      setMessage(response.data.message);

      if (response.data.isVerified) {
        navigate('/login')
      }
    } catch (error) {
      setLoading(false);
      setMessage(
        error.response?.data?.message || "OTP verification failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify OTP
        </h2>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label
              htmlFor="emailOtp"
              className="block text-sm font-medium text-gray-700"
            >
              Email OTP
            </label>
            <input
              type="text"
              id="emailOtp"
              placeholder="Enter Email OTP"
              value={emailOtp}
              onChange={(e) => setOtpEmail(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="otpPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone OTP
            </label>
            <input
              type="text"
              id="otpPhone"
              placeholder="Enter Phone OTP"
              value={otpPhone}
              onChange={(e) => setOtpPhone(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg ${
              loading
                ? "bg-rose-800 cursor-not-allowed"
                : "bg-rose-600 hover:bg-rose-400 focus:ring-4 focus:ring-blue-300"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        {message && (
          <p
            className={`text-center mt-4 text-sm ${
              message.includes("failed")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default OptForm;
