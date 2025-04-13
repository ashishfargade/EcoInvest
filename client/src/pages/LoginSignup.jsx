import { useSelector } from "react-redux";
import { Outlet, Link, Navigate } from "react-router";

import { selectIsAuthenticated, selectLoading } from "../features/auth/authSlice.js";

export const LoginSignup = () => {
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectLoading);

  if (loading) {
    return <p>Checking authentication...</p>; // replace with a proper loader
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <h1>Welcome to Auth</h1>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
      </nav>
      <Outlet />
    </div>
  );
};

