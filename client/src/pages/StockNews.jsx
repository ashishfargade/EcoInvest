import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

import axiosInstance from "../app/api/axiosInstance.js";
import { StockNewsCard } from "../components/StockNews/StockNewsCard.jsx";

export const StockNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await axiosInstance.post("/stock/getNews", {
        ticker: searchTerm,
      });

      console.log(response);

      setNewsList(response.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  // Default Market News
  useEffect(() => {
    const fetchMarketNews = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get("/stock/getMarketNews");

        // console.log(response);

        const articles = (response?.data || []).map((item) => ({
          ...item,
          image: item.urlToImage, //remap to match expected card props
        }));
        setNewsList(articles);

      } catch (err) {
        console.error("Error loading default news:", err);
        setNewsList([]);
      }finally {
        setLoading(false);
      }
    };

    fetchMarketNews();
  }, []);

  return (
    <div className="w-full px-4 pt-4">
      {/* Search Bar - max width and centered */}
      <form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto flex items-center gap-4 mb-8 bg-white p-2 rounded-full shadow-md"
      >
        <input
          type="text"
          placeholder="Enter ticker (e.g., AAPL) to search for related news"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 bg-white text-gray-800 placeholder-gray-400 rounded-full focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow"
        >
          Search
        </button>
      </form>

      {/* Results Section */}
      {loading ? (
        <div className="text-center">
          <CircularProgress />
        </div>
      ) : newsList.length > 0 ? (
        <div className="flex flex-col gap-6 w-full">
          {newsList.map((news, idx) => (
            <StockNewsCard key={idx} article={news} />
          ))}
        </div>
      ) : searched ? (
        <p className="text-gray-500 text-center">
          No news found for "{searchTerm}".
        </p>
      ) : (
        <div className="text-center text-gray-400 italic py-10">
          Start by searching for a stock ticker to view the latest news.
        </div>
      )}
    </div>
  );
};
