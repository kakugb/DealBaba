import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./component/auth/Layout.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

// Admin
import AdminLayout from "./component/AdminView/Layout.jsx";
import AdminDashboard from "./pages/AdminView/Dashboard.jsx";

// ShopOwner
import ShopOnwerLayout from "./component/shopOwnerView/Layout.jsx";
import ShopOwnerDashboard from "./pages/ShopOwnerView/Dashboard.jsx";
import ScanQr from "./pages/ShopOwnerView/ScanQr.jsx";

// CustomerView
import ShoppingLayout from "./component/CustomerView/Layout.jsx";
import CustomerDashboard from "./pages/CustomerView/Dashbaord.jsx";

// Not-found
import NotFound from "./pages/not-found";

// UserView
import UserLayout from "./component/UserView/Layout.jsx";
import UserDashoard from "./pages/UserView/Dashboard.jsx";
import Shop from "./pages/UserView/Shop.jsx";

import CheckAuth from "./component/Common/CheckAuth.jsx";
import UnauthPage from "./pages/unauth-page";
import OptForm from "./pages/auth/OptForm.jsx";
import { useSelector } from "react-redux";
import DealPage from "./pages/ShopOwnerView/DealPage.jsx";
import AddDeal from "./pages/ShopOwnerView/AddDeal.jsx";
import { Navigate } from "react-router-dom";
import UpdateDeal from "./pages/ShopOwnerView/UpdateDeal.jsx";
import CreateUser from "./pages/AdminView/CreateUser.jsx";
import UpdateUser from "./pages/AdminView/UpdateUser.jsx";
import QrCodeScan from "./pages/CustomerView/QrCodeScan.jsx";
import ViewAllDeals from "./pages/CustomerView/ViewAllDeals.jsx";
import ViewDealDetail from "./pages/CustomerView/ViewDealDetail..jsx";
import CustomerCard from "./pages/CustomerView/CustomerCard.jsx";
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Routes>
       <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OptForm />} />

        <Route
          path="/admin"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="admin"
            >
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="addUser" element={<CreateUser/>}/>
          <Route path="updateUser/:userId" element={<UpdateUser/>}/>
        </Route>

        <Route
          path="/shopowner"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="shopOwner"
            >
              <ShopOnwerLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<ShopOwnerDashboard />} />
          <Route path="scanQR" element={<ScanQr />} />
          <Route path="dealPage" element={<DealPage />} />
          <Route path="addDeal" element={<AddDeal />} />
          <Route path="updateDeal/:id" element={<UpdateDeal/>}/>
        </Route>

        <Route
          path="/customer"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="customer"
            >
              <ShoppingLayout user="karmat"/>
            </CheckAuth>
          }
        >
          <Route path="QRcodeScan" element={<QrCodeScan />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="allDeals" element={<ViewAllDeals/>}/>
          <Route path="customerCart" element={<CustomerCard/>}/>
          <Route path="viewDetail/:id" element={<ViewDealDetail/>}/>
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="user"
            >
              <UserLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<UserDashoard />} />
          <Route path="shop" element={<Shop />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
        {/* Unauthenticated page */}
        <Route path="unauth-page" element={<UnauthPage />} />
      </Routes>
    </>
  );
}

export default App;
