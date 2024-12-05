import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    userId: null,
  });
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/auth/signup", formData);
      
      
      const userId = response.data.userId;
      if (userId) {
        setFormData((prev) => ({ ...prev, userId })); 
        setOtpSent(true);
        setStep(2); 
                alert("Signup successful. Verify your email and phone.");
      } else {
        alert("Signup successful, but no userId received.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      console.error("Signup error:", errorMessage);
      alert(errorMessage);
    }
  };

  const handleVerifyOtp = async (e, type) => {
    e.preventDefault();
    const otp = type === "email" ? otpEmail : otpPhone;
    try {
      const userId = formData.userId;

      await axios.post("http://localhost:8000/api/auth/verify-otp", {
        otp,
        userId,
        type,
      });

      alert(`${type === "email" ? "Email" : "Phone"} OTP Verified Successfully`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during OTP verification.";
      console.error(`Error verifying OTP for ${type}:`, errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div>
      <h2>Signup Form</h2>
      
      
      {step === 1 && (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleInputChange}
          />
          <button type="submit">Signup</button>
        </form>
      )}

      
      {step === 2 && otpSent && (
        <div>
          <h3>Verify OTP</h3>
          
        
          <form onSubmit={(e) => handleVerifyOtp(e, "email")}>
            <input
              type="text"
              placeholder="Enter Email OTP"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
            />
            <button type="submit">Verify Email OTP</button>
          </form>
          
        
          <form onSubmit={(e) => handleVerifyOtp(e, "phone")}>
            <input
              type="text"
              placeholder="Enter Phone OTP"
              value={otpPhone}
              onChange={(e) => setOtpPhone(e.target.value)}
            />
            <button type="submit">Verify Phone OTP</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignupForm;






