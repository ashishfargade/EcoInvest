import React from "react";

export const TrendsCard = ({ data }) => {
  if (!data || !data.info) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow">
      <h3 className="text-lg font-semibold text-purple-800 mb-2">
        Trend
      </h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>
          <strong>Sector:</strong> {data.info.sector}
        </li>
        <li>
          <strong>Industry:</strong> {data.info.industry}
        </li>
        <li>
          <strong>Current Price:</strong> {data.info.currentPrice}
        </li>
        <li>
          <strong>Fifty Day Average:</strong> {data.info.fiftyDayAverage}
        </li>
        <li>
          <strong>Fifty Day Average Change:</strong> {data.info.fiftyDayAverageChange}
        </li>
        <li>
          <strong>52W High:</strong> ${data.info.fiftyTwoWeekHigh}
        </li>
        <li>
          <strong>52W Low:</strong> ${data.info.fiftyTwoWeekLow}
        </li>
        <li>
          <strong>Beta:</strong> {data.info.beta}
        </li>
        <li>
          <strong>Book value:</strong> {data.info.bookValue}
        </li>
        <li>
          <strong>Average Analyst Rating:</strong> {data.info.averageAnalystRating}
        </li>
      </ul>
    </div>
  );
};
