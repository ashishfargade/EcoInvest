import React from "react";

const BASE_URL = import.meta.env.VITE_FLASK_SERVER_URL;

export const FinancialReportsCard = ({ data }) => {
  if (!data || !data.pdf_reports) return null;

  // Construct the full URLs by appending the relative paths from data
  const incomeStatementUrl = `${BASE_URL}${data.pdf_reports.income_statement_pdf}`;
  const quarterlyBalanceSheetUrl = `${BASE_URL}${data.pdf_reports.quarterly_balance_sheet_pdf}`;
  const quarterlyCashFlowUrl = `${BASE_URL}${data.pdf_reports.quarterly_cashflow_pdf}`;
  const quarterlyFinancialsUrl = `${BASE_URL}${data.pdf_reports.quarterly_financials_pdf}`;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow min-h-[300px]">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        Financial Reports
      </h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>
          <strong>Income Statement:</strong>{" "}
          <a
            href={incomeStatementUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View PDF
          </a>
        </li>
        <li>
          <strong>Quarterly Balance Sheet:</strong>{" "}
          <a
            href={quarterlyBalanceSheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View PDF
          </a>
        </li>
        <li>
          <strong>Quarterly Cash Flow:</strong>{" "}
          <a
            href={quarterlyCashFlowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View PDF
          </a>
        </li>
        <li>
          <strong>Quarterly Financials:</strong>{" "}
          <a
            href={quarterlyFinancialsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View PDF
          </a>
        </li>
      </ul>
    </div>
  );
};
