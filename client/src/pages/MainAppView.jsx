import React from 'react'
import { Outlet } from 'react-router';

import { InternalNavbar } from '../components/InternalNavbar.jsx';

export const MainAppView = () => {
// CALL THE   useEffect(() => {
  //   const fetchHistory = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         "/portfolio/getPortfolioValue"
  //       );
  //       setHistory(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch portfolio history:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchHistory();
  // }, []);
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#9FC1FF] via-[#D1DCEB] to-[#E6FFF5] pt-7 px-8">
        <InternalNavbar />
        
        <div className='pb-7'>
          <Outlet />
        </div>
      </div>
    );
}
