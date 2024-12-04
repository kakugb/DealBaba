import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";

function AdminLayout() {
  const [showNavbar, setShowNavbar] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current path is the dashboard
  const isDashboard = location.pathname === "/customer/dashboard";

  // Effect hook to run once on page load
  useEffect(() => {
    const qrCodeScan = localStorage.getItem("qrCodeScan");

    if (qrCodeScan === "true") {
      navigate("/customer/allDeals");
    }
  }, [navigate]);

  // Handle visibility of navbar and redirection
  const handleNavbarVisibility = (isVisible) => {
    setShowNavbar(isVisible);

    if (!isVisible) {
      // Clear the user data from localStorage when navbar is hidden
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
      {/* Show Header if the Navbar is allowed or the route is not /customer/dashboard */}
      {showNavbar || !isDashboard ? <Header /> : null}

      <div>
        {/* Provide a way for children to toggle Header visibility */}
        <Outlet context={{ handleNavbarVisibility }} />
      </div>
    </div>
  );
}

export default AdminLayout;
