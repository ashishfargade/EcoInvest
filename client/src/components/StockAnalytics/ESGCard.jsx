import React from "react";

export const ESGCard = ({ data, ticker }) => {
    if (!data || !data.sustainability || !data.sustainability.esgScores)
    return null;

  const {
    environmentScore,
    socialScore,
    governanceScore,
    totalEsg,
    esgPerformance,
    highestControversy,
    peerGroup,
    peerEsgScorePerformance,
    peerEnvironmentPerformance,
    peerSocialPerformance,
    peerGovernancePerformance,
    relatedControversy = [],
  } = data.sustainability.esgScores;

  // Color mapping based on performance
  const colorMap = {
    LAG_PERF: "from-red-50 to-red-100 text-red-800",
    AVG_PERF: "from-yellow-50 to-yellow-100 text-yellow-800",
    LEAD_PERF: "from-green-50 to-green-100 text-green-800",
  };

  const bgClass = colorMap[esgPerformance] || "from-gray-50 to-gray-100 text-gray-800";

  return (
    <div className={`bg-gradient-to-br ${bgClass} rounded-xl p-5 shadow`}>
      {ticker && (
        <h2 className="text-lg font-semibold mb-2">
          {ticker} - ESG Overview
        </h2>
      )}
      <ul className="text-sm space-y-1">
        <li><strong>Environment Score:</strong> {environmentScore}</li>
        <li><strong>Social Score:</strong> {socialScore}</li>
        <li><strong>Governance Score:</strong> {governanceScore}</li>
        <li><strong>Total ESG Score:</strong> {totalEsg}</li>
        <li><strong>Performance:</strong> {esgPerformance}</li>
        <li><strong>Highest Controversy Level:</strong> {highestControversy ?? "N/A"}</li>
        <li><strong>Peer Group:</strong> {peerGroup}</li>
        <li>
          <strong>Controversies:</strong>{" "}
          {relatedControversy.length ? relatedControversy.join(", ") : "None reported"}
        </li>
      </ul>

      <div className="mt-4 text-xs">
        <p className="font-medium mb-1">Peer Comparison Averages:</p>
        <ul className="space-y-1">
          <li><strong>ESG Score Avg:</strong> {peerEsgScorePerformance?.avg?.toFixed(2)}</li>
          <li><strong>Environment Avg:</strong> {peerEnvironmentPerformance?.avg?.toFixed(2)}</li>
          <li><strong>Social Avg:</strong> {peerSocialPerformance?.avg?.toFixed(2)}</li>
          <li><strong>Governance Avg:</strong> {peerGovernancePerformance?.avg?.toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );
};
