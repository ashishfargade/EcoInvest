import React from "react";

export const SentimentCard = ({ data }) => {
  if (!data || !data.recommendations || !data.recommendations.strongBuy)
    return null;

  const sentiment = data.recommendations;
  const periods = Object.keys(sentiment.period || {});

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-1 py-5 shadow">
      <h3 className="text-lg font-semibold text-blue-800 mb-4 pl-4">
        Analyst Sentiment
      </h3>

      <div className="overflow-x-auto pt-3">
        <table className="min-w-full text-sm text-left text-blue-900">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-2 py-2">Period</th>
              <th className="px-2 py-2">Buy</th>
              <th className="px-2 py-2">Hold</th>
              <th className="px-2 py-2">Sell</th>
              <th className="px-2 py-2 text-center">Strong Buy</th>
              <th className="px-3 py-2 text-center">Strong Sell</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((key) => (
              <tr
                key={key}
                className={key % 2 === 0 ? "bg-white" : "bg-blue-50"}
              >
                <td className="px-4 py-2 font-medium">
                  {sentiment.period[key]}
                </td>
                <td className="px-4 py-2 text-center">{sentiment.buy[key]}</td>
                <td className="px-4 py-2 text-center">{sentiment.hold[key]}</td>
                <td className="px-4 py-2 text-center">{sentiment.sell[key]}</td>
                <td className="px-4 py-2 text-center text-green-600 font-semibold">
                  {sentiment.strongBuy[key]}
                </td>
                <td className="px-4 py-2 text-center text-red-600 font-semibold">
                  {sentiment.strongSell[key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
