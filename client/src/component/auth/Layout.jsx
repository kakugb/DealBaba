import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className='w-full max-h-max flex'>
        <Outlet />
    </div>
  );
}

export default AuthLayout;
