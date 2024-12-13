import React, { useRef, useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [scanResult, setScanResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { handleNavbarVisibility } = useOutletContext();

  useEffect(() => {
    let qrScanner;

    if (isScanning && videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        async (result) => {
          handleQRCodeData(result.data);
        },
        {
          returnDetailedScanResult: true,
        }
      );

      qrScanner.start().catch((err) => {
        console.error("Failed to start QR Scanner:", err);
        setMessage("Failed to start QR scanner. Please try again.");
      });
    }

    return () => {
      if (qrScanner) qrScanner.stop();
    };
  }, [isScanning]);

  const handleQRCodeData = async (data) => {
  
    try {
    

      let parsedData;
      if (data.trim().startsWith("{") && data.trim().endsWith("}")) {
        parsedData = JSON.parse(data);
      } else {
        const matches = data.match(/User:\s*(\w+),\s*Email:\s*([\w@.]+)/);
        if (matches) {
          parsedData = { user: matches[1], email: matches[2] };
        } else {
          throw new SyntaxError("Invalid QR code data format.");
        }
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      try {
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() >= expirationTime) {
          throw new Error("Authentication token has expired. Please log in again.");
        }
      } catch (e) {
        console.error("Error decoding token:", e);
        throw new Error("Invalid authentication token. Please log in again.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-user",
        { name: parsedData.user, email: parsedData.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isVerified) {
        setMessage("User verified successfully!");
        handleNavbarVisibility(true);
      } else {
        setMessage("Verification failed. User not found.");
        handleNavbarVisibility(false);
      }
    } catch (error) {
      console.error("Error verifying QR Code data:", error);
      setMessage(error.message || "An error occurred during verification.");
      handleNavbarVisibility(false);

      if (error.response && error.response.status === 403) {
        setMessage("You do not have permission to access this resource.");
      }
    }

    setScanResult(data);
  };

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const generateQRCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));

      if (!token || !userData) {
        setMessage("Token or User data is missing. Please log in again.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const qrData = {
        user: userData.name || "Unknown User",
        email: userData.email || "No Email",
      };

      console.log("QR Data being sent:", qrData);

      const response = await axios.post(
        "http://localhost:5000/api/qr-code/send-qrcode",
        { userId: userData.id, qrData },
        { headers }
      );

      setMessage(response?.data?.message || "QR Code generated successfully!");
    } catch (error) {
      console.error("Error generating QR Code:", error);
      setMessage(error.response?.data?.message || "Failed to generate QR Code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-28">
      <h1 className="text-2xl font-bold mb-6">QR Code Scanner</h1>

      {isScanning && (
        <div className="relative w-72 h-72 border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
        </div>
      )}

      {!isScanning && (
        <button
          onClick={startScanning}
          className="mt-6 px-6 py-2 bg-rose-600 hover:bg-red-500 text-white font-semibold rounded-md"
        >
          Start Scanning
        </button>
      )}

      {isScanning && (
        <button
          onClick={stopScanning}
          className="mt-6 px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md"
        >
          Stop Scanning
        </button>
      )}

      <p className="mt-4 text-gray-600">Point your camera at a QR code to scan.</p>

      {scanResult && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          <p>Scanned Data:</p>
          <pre className="break-words">{scanResult}</pre>
        </div>
      )}

      <button
        onClick={generateQRCode}
        className="mt-6 px-6 py-2 bg-rose-600 hover:bg-red-500 text-white font-semibold rounded-md"
      >
        Generate QR Code
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("Failed") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Dashboard;
