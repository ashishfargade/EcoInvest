import React from "react";

const BASE_URL = import.meta.env.VITE_FLASK_SERVER_URL;

export const FinancialReportsCard = ({ data }) => {
  if (!data || !data.pdf_reports) return null;

  const {
    income_statement_pdf,
    quarterly_balance_sheet_pdf,
    quarterly_cashflow_pdf,
    quarterly_financials_pdf,
  } = data.pdf_reports;

  const reports = [
    { label: "Income Statement", url: income_statement_pdf },
    { label: "Quarterly Balance Sheet", url: quarterly_balance_sheet_pdf },
    { label: "Quarterly Cash Flow", url: quarterly_cashflow_pdf },
    { label: "Quarterly Financials", url: quarterly_financials_pdf },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 shadow min-h-[300px]">
      <h3 className="text-lg font-semibold text-indigo-800 mb-4">
        Financial Reports
      </h3>
      <ul className="text-sm text-gray-700 space-y-3">
        {reports.map((report, idx) => (
          <li key={idx}>
            <span className="font-medium text-indigo-900">{report.label}:</span>{" "}
            <a
              href={`${BASE_URL}${report.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline ml-1"
            >
              View PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
