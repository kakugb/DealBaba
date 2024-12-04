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
      
      // Ensure the response contains the userId
      const userId = response.data.userId;
      if (userId) {
        setFormData((prev) => ({ ...prev, userId })); // Set userId in formData
        setOtpSent(true); // Enable OTP sending
        setStep(2); // Proceed to OTP verification step
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
      
      {/* Step 1: Signup Form */}
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

      {/* Step 2: OTP Verification */}
      {step === 2 && otpSent && (
        <div>
          <h3>Verify OTP</h3>
          
          {/* Email OTP verification */}
          <form onSubmit={(e) => handleVerifyOtp(e, "email")}>
            <input
              type="text"
              placeholder="Enter Email OTP"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
            />
            <button type="submit">Verify Email OTP</button>
          </form>
          
          {/* Phone OTP verification */}
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








// import React from 'react'

// function signupForm() {
//   return (
//     <div>
//       <form>
//       <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
//         <div class="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
//           <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
//             <p class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
//               Create an account
            
            
//               </p><div>
//                 <label class="block mb-2 text-sm font-medium text-gray-900">
//                   Your username
//                 </label>
//                 <input placeholder="JohnDoe" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" id="username" type="text"/>
//               </div>
//               <div>
//                 <label class="block mb-2 text-sm font-medium text-gray-900">
//                   Password
//                 </label>
//                 <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" placeholder="••••••••" id="password" type="password"/>
//               </div>
//               <div>
//                 <label class="block mb-2 text-sm font-medium text-gray-900">
//                   Confirm password
//                 </label>
//                 <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" placeholder="••••••••" id="confirmPassword" type="password"/>
//               </div>
//               <div class="flex items-start">
//                 <div class="flex items-center h-5">
//                   <input class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800" type="checkbox" aria-describedby="terms" id="terms"/>
//                 </div>
//                 <div class="ml-3 text-sm">
//                   <label class="font-light text-gray-500 text-gray-300">
//                     I accept the
//                     <a href="#" class="font-medium text-primary-600 hover:underline text-primary-500">
//                       Terms and Conditions
//                     </a>
//                   </label>
//                 </div>
//               </div>

//               <button class="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:ring-blue-800 text-white" type="submit">
//                 Create an account
//               </button>
            
//           </div>
//         </div>
//       </div></form>
//     </div>
//   )
// }

// export default signupForm

