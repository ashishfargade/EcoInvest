import { useSelector } from "react-redux";
import { Outlet, Link, Navigate } from "react-router";

import {
  selectIsAuthenticated,
  selectLoading,
} from "../features/auth/authSlice.js";
import CustomLoader from "../components/CustomLoader.jsx";

export const LoginSignup = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectLoading);

  if (loading) {
    return <CustomLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 bg-slate-50 shadow-md border-b border-slate-200">
        <div className="flex items-center">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-wide">EcoInvest</h1>
        </div>
        <Link
          to="/about"
          className="text-sm sm:text-base font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
        >
          About Us
        </Link>
      </nav>

      {/* Page Content */}
      <div className="flex-grow flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};
