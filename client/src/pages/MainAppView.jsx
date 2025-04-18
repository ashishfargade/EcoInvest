import React from 'react'
import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';

import { InternalNavbar } from '../components/InternalNavbar.jsx';

export const MainAppView = () => {

    return (
      <div className="min-h-screen bg-gradient-to-r from-[#9FC1FF] via-[#D1DCEB] to-[#E6FFF5] pt-7 px-8">
        <InternalNavbar />
        
        <div className='pb-7'>
          <Outlet />
        </div>
      </div>
    );
}
