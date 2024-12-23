import React, { useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_DEALBABA_URL;

const EmailVerification = ({ userId }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerification = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/verify`, {
        userId,
        verificationCode,
      });

      setMessage(response.data.message);  
    } catch (error) {
      setMessage(error.response.data.message); 
    }
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerification}>Verify</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailVerification;
