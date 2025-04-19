// StockAnalytics.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router";

import axiosInstance2 from "../app/api/axiosInstance2.js";
import { selectUser } from "../features/auth/authSlice.js";
import { ESGCard } from "../components/StockAnalytics/ESGCard.jsx";
import { SentimentCard } from "../components/StockAnalytics/SentimentCard.jsx";
import { TrendsCard } from "../components/StockAnalytics/TrendsCard.jsx";
import { CircularProgress } from "@mui/material";
import { FinancialReportsCard } from "../components/StockAnalytics/FinancialReportsCard.jsx";

export const StockAnalytics = () => {
  const [selectedTicker, setSelectedTicker] = useState("All");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const [searchParams] = useSearchParams();

  const user = useSelector(selectUser);
  const portfolio = user.portfolio;
  const listOfTickers = portfolio.map((stock) => stock.ticker);
  // console.log(listOfTickers)

  useEffect(() => {
    if (searchParams.size !== 0) {
      const ticker = searchParams.get("ticker");
      if (ticker) setSelectedTicker(ticker);
    } else {
      setSelectedTicker("All");
    }

    setInitialized(true);
  }, [searchParams]);

  useEffect(() => {
    if (!initialized || selectedTicker === null) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const tickers =
          selectedTicker === "All" ? listOfTickers : [selectedTicker];

        const response = await axiosInstance2.post("/analytics", { tickers });
        setAnalyticsData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTicker, portfolio, initialized]);

  useEffect(() => {
    if (analyticsData !== null) {
      console.log("Updated analyticsData:", analyticsData);
    }
  }, [analyticsData]);

  if (loading) {
    return (
      <div className="text-center pt-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-5 px-3 auto-rows-fr">
      {selectedTicker === "All" ? (
        listOfTickers.map((ticker) => (
          <ESGCard key={ticker} ticker={ticker} data={analyticsData[ticker]} />
        ))
      ) : (
        <>
          <ESGCard
            ticker={selectedTicker}
            data={analyticsData[selectedTicker]}
          />
          <SentimentCard data={analyticsData[selectedTicker]} />
          <TrendsCard data={analyticsData[selectedTicker]} />
          <FinancialReportsCard data={analyticsData[selectedTicker]} />
        </>
      )}
    </div>
  );
};
