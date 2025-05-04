import React, { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CallMadeIcon from "@mui/icons-material/CallMade";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import { logout } from "../features/auth/authSlice.js";

export const InternalNavbar = () => {
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Analysis", path: "/analytics" },
    { label: "News", path: "/news" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const buttonRefs = useRef({});
  const pillRef = useRef(null);

  useEffect(() => {
    const activeItem = navItems.find((item) => location.pathname === item.path);
    if (activeItem) {
      const button = buttonRefs.current[activeItem.label];
      const pill = pillRef.current;

      if (button && pill) {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = button;
        pill.style.left = `${offsetLeft}px`;
        pill.style.top = `${offsetTop}px`;
        pill.style.width = `${offsetWidth}px`;
        pill.style.height = `${offsetHeight}px`;
      }
    }
  }, [location.pathname]);

  return (
    <div className="bg-white rounded-2xl shadow flex justify-between items-center px-12 py-5 max-w-[98%] mx-auto md:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="logo"
          className="h-10 w-auto object-contain"
        />

        {/* Nav Buttons */}
        <div className="relative flex gap-2 items-center">
          {/* Animated Blue Pill */}
          <div
            ref={pillRef}
            className="absolute h-9 bg-[#0F1E54] rounded-xl transition-all duration-300 ease-in-out"
            style={{ zIndex: 0 }}
          />

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                ref={(el) => (buttonRefs.current[item.label] = el)}
                onClick={() => navigate(item.path)}
                className={`relative z-10 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isActive ? "text-white" : "text-gray-700 hover:text-blue-700"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="text-gray-700 font-medium px-4 hover:text-blue-700">
            <button onClick={() => {
              window.open('https://huggingface.co/spaces/Samved24/EcoInvest', '_blank', 'noopener,noreferrer');
            }}>ESG Research</button>
          </div>
        </div>
      </div>

      {/* Right Toggle */}

      <div className="flex items-center gap-3 relative z-10">
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton
            onClick={handleLogout}
            color="error"
            aria-label="logout"
            sx={{ "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" } }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
        {/* <span className="text-gray-600 font-medium">Test Mode</span> */}
        {/* <Switch defaultChecked color="primary" /> */}
      </div>
    </div>
  );
};
