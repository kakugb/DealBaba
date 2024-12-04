import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (!isAuthenticated && location.pathname === "/") {
    return <Navigate to="/login" />;
  }
  // Show a loading indicator until `isAuthenticated` and `user` are resolved
  if (isAuthenticated === undefined || user === undefined) {
    return <div>Loading...</div>; // Replace with a spinner or loading component
  }


  if (!isAuthenticated && (location.pathname === "/login" || location.pathname === "/register")) {
    return <>{children}</>;
  }
  if (!isAuthenticated && location.pathname === "/opt") {
    return <>{children}</>;
  }
  // Redirect if not authenticated and trying to access a protected route
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/login" />;
  }

  // Handle redirects for authenticated users based on roles
  if (
    (isAuthenticated && location.pathname.includes("/login")) ||
    location.pathname.includes("/register")
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "user") {
      return <Navigate to="/user/dashboard" />;
    } else if (user?.role === "shopowner") {
      return <Navigate to="/shopowner/dashboard" />;
    } else if (user?.role === "customer") {
      return <Navigate to="/customer/dashboard" />;
    }
  }


  // Handle root path redirection based on role
  if (isAuthenticated && location.pathname === "/") {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "user") {
      return <Navigate to="/user/dashboard" />;
    } else if (user?.role === "shopowner") {
      return <Navigate to="/shopowner/dashboard" />;
    } else if (user?.role === "customer") {
      return <Navigate to="/customer/dashboard" />;
    }
  }

  // Prevent unauthorized access to specific routes
  if (
    isAuthenticated &&
    ((user?.role === "admin" &&
      (location.pathname.includes("/shop") ||
        location.pathname.includes("/user") ||
        location.pathname.includes("/shopowner") ||
        location.pathname.includes("/customer"))) ||
      (user?.role === "shopowner" &&
        (location.pathname.includes("/admin") ||
          location.pathname.includes("/user") ||
          location.pathname.includes("/customer"))) ||
      (user?.role === "customer" &&
        (location.pathname.includes("/admin") ||
          location.pathname.includes("/user") ||
          location.pathname.includes("/shopowner"))) ||
      (user?.role === "user" &&
        (location.pathname.includes("/admin") ||
          location.pathname.includes("/shopowner") ||
          location.pathname.includes("/customer"))))
  ) {
    return <Navigate to={`/${user?.role}/dashboard`} />;
  }

  return <>{children}</>;
}

export default CheckAuth;
