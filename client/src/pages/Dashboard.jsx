import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import "../app/utils/Fonts.css";
import { selectUser } from "../features/auth/authSlice.js";
import { InvestmentChart } from "../components/Dashboard/InvestmentChart.jsx";
import { CurrentInvestmentTable } from "../components/Dashboard/CurrentInvestmentTable.jsx";
import { InvestmentSummary } from "../components/Dashboard/InvestmentSummary.jsx";
import axiosInstance from "../app/api/axiosInstance.js";

export const Dashboard = () => {
  const [selectedTicker, setSelectedTicker] = useState("Total");

  const user = useSelector(selectUser);
  const portfolio = user.portfolio;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get(
          "/portfolio/getPortfolioValue"
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch portfolio history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl px-8 py-6 mt-6 w-full max-w-[98%] mx-auto flex flex-col gap-6">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between px-1">
        <h2 className="font-roboto text-2xl font-semibold text-slate-700 animate-pulse">
          Hello {user.name}, how are we doing today!
        </h2>
        <button
          onClick={() => setSelectedTicker("Total")}
          className="font-roboto text-sm md:text-base px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md shadow-sm transition duration-200"
        >
          Reset Chart
        </button>
      </div>

      {/* Chart + Summary Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 min-h-[60vh] px-4">
        {/* Chart Card */}
        <div className="bg-white rounded-xl shadow-md col-span-2 p-4">
          <InvestmentChart
            selectedTicker={selectedTicker}
            loading={loading}
            history={history}
          />
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-md col-span-1">
          <InvestmentSummary
            portfolio={portfolio}
            setSelectedTicker={setSelectedTicker}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mx-4 min-h-[60vh]">
        <CurrentInvestmentTable portfolio={portfolio} loading={loading} history={history}/>
      </div>
    </div>
  );
};
