import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
function AdminLayout() {
  return (
    <div>
        
        <Header/>
        {/* <Footer/> */}
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default AdminLayout