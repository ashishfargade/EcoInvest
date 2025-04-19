import React from "react";

export const TrendsCard = ({ data }) => {
  if (!data || !data.info) return null;

  const info = data.info;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">
        Market & Stock Trends
      </h3>

      <ul className="text-sm text-gray-700 space-y-2">
        <li>
          <span className="font-medium text-purple-900">Sector:</span>{" "}
          {info.sector}
        </li>
        <li>
          <span className="font-medium text-purple-900">Industry:</span>{" "}
          {info.industry}
        </li>
        <li>
          <span className="font-medium text-purple-900">Current Price:</span> $
          {info.currentPrice}
        </li>
        <li>
          <span className="font-medium text-purple-900">50-Day Avg:</span> $
          {info.fiftyDayAverage}
        </li>
        <li>
          <span className="font-medium text-purple-900">50-Day Change:</span>{" "}
          {info.fiftyDayAverageChange}
        </li>
        <li>
          <span className="font-medium text-purple-900">52-Week High:</span> $
          {info.fiftyTwoWeekHigh}
        </li>
        <li>
          <span className="font-medium text-purple-900">52-Week Low:</span> $
          {info.fiftyTwoWeekLow}
        </li>
        <li>
          <span className="font-medium text-purple-900">Beta:</span> {info.beta}
        </li>
        <li>
          <span className="font-medium text-purple-900">Book Value:</span> $
          {info.bookValue}
        </li>
        <li>
          <span className="font-medium text-purple-900">Analyst Rating:</span>{" "}
          <span className="font-extrabold">{info.averageAnalystRating}</span>
        </li>
      </ul>
    </div>
  );
};
