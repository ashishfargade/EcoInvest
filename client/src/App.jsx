import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import "./App.css";
import { Home } from "./pages/Home.jsx";
import { LoginSignup } from "./pages/LoginSignup.jsx";
import { Login } from "./components/Login.jsx";
import { Signup } from "./components/Signup.jsx";
import ProtectedRoutes from "./app/utils/ProtectedRoutes.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { getLoggedUser } from "./features/auth/authSlice.js";
import Snackbar from "./components/Snackbar.jsx";
import { MainAppView } from "./pages/MainAppView.jsx";
import { StockAnalytics } from "./pages/StockAnalytics.jsx";
import { Trends } from "./pages/Trends.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLoggedUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<LoginSignup />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>

          <Route element={<MainAppView />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<StockAnalytics />} />
            <Route path="/trends" element={<Trends />} />
          </Route>
          
        </Route>
      </Routes>

      {/* Error display toast */}
      <Snackbar />
    </BrowserRouter>
  );
}

export default App;
