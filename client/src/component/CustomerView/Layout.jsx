import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";

function AdminLayout() {
  const [showNavbar, setShowNavbar] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname === "/customer/dashboard";

  useEffect(() => {
    if (location.pathname === "/customer/dashboard") {
      const qrCodeScan = localStorage.getItem("qrCodeScan");

      if (qrCodeScan === "true") {
        navigate("/customer/allDeals");
      }
    }
  }, [location.pathname, navigate]);


  const handleNavbarVisibility = (isVisible) => {
    setShowNavbar(isVisible);

    if (!isVisible) {
      localStorage.removeItem("user");
      localStorage.setItem("isAuthenticated", "false");
      localStorage.setItem("qrCodeScan", "false");
      navigate("/register");
    } else {
      localStorage.setItem("qrCodeScan", "true");
      navigate("/customer/allDeals");
    }
  };

  return (
    <div>
    
      {showNavbar || !isDashboard ? <Header /> : null}

      <div>
        
        <Outlet context={{ handleNavbarVisibility }} />
      </div>
    </div>
  );
}

export default AdminLayout;
