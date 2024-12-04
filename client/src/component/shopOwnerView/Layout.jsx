import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
function ShopOwnerLayout() {
  return (
    <div>
      <Header />
      {/* <Footer /> */}
      <div>
        <Outlet />
      </div>
      
    </div>
  );
}

export default ShopOwnerLayout;
