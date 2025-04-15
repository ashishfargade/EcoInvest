import React from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../features/auth/authSlice.js";

export const Dashboard = () => {
  const user = useSelector(selectUser);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#9FC1FF] via-[#D1DCEB] to-[#E6FFF5]">
      Dashboard
    </div>
  );
};
