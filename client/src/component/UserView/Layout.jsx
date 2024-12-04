import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
function AdminLayout() {
  return (
    <div>
        
        <Header/>
        <Footer/>
        <div>
            <Outlet/>
        </div>
        <div>
          <Link to='shop'>shop</Link>
        </div>
    </div>
  )
}

export default AdminLayout