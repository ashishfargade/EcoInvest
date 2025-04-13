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

function App() {

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getLoggedUser());
  }, [dispatch])

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
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
