import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";

import { selectIsAuthenticated, selectLoading } from "../../features/auth/authSlice.js";

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectLoading);

  if(loading) return <p>Loading...</p>

  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} replace={true} />;
};

export default ProtectedRoutes;
