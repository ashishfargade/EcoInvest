import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const InvestmentSummary = ({ portfolio, setSelectedTicker }) => {
  const { labels, data, bgColors } = useMemo(() => {
    const labels = [];
    const data = [];
    const bgColors = [];

    portfolio.forEach((stock, index) => {
      const investment = stock.shares * stock.averageBuyPrice;
      labels.push(stock.ticker);
      data.push(investment);

      // Harmonize with InvestmentChart colors
      const colors = [
        "rgba(15, 30, 84, 0.6)",   // dark navy (like investment line)
        "rgba(74, 222, 128, 0.6)", // soft green (like value line)
        "#60a5fa",                 // sky-400
        "#34d399",                 // emerald-400
        "#a78bfa",                 // violet-400
        "#f87171",                 // red-400
        "#fbbf24",                 // amber-400
      ];
      bgColors.push(colors[index % colors.length]);
    });

    return { labels, data, bgColors };
  }, [portfolio]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Investment ($)",
        data,
        backgroundColor: bgColors,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: bgColors.map(color =>
          color.replace("0.6", "0.8")
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (evt, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const selected = labels[index];
        setSelectedTicker(selected);
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `$${context.raw.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}`,
        },
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f3f4f6",
        bodyColor: "#e5e7eb",
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6B7280", // gray-500
        },
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#6B7280",
          callback: (value) =>
            "$" + value.toLocaleString("en-US", { maximumFractionDigits: 0 }),
        },
        title: {
          display: true,
          text: "Investment ($)",
          color: "#374151", // gray-700
        },
        grid: {
          color: "rgba(209, 213, 219, 0.2)", // matches line chart
        },
      },
    },
  };

  return (
    <div className="w-full h-full px-6 py-10">
      <Bar data={chartData} options={options} />
    </div>
  );
};
