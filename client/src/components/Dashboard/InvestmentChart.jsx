import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { CircularProgress } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

export const InvestmentChart = ({ selectedTicker, history, loading}) => {

  const { labels, investmentData, valueData } = useMemo(() => {
    const labels = [];
    const investmentData = [];
    const valueData = [];

    history.forEach(({ date, stocks }) => {
      labels.push(date);
      let investment = 0;
      let value = 0;

      stocks.forEach((stock) => {
        if (selectedTicker === "Total" || stock.ticker === selectedTicker) {
          investment += stock.investment;
          value += stock.value;
        }
      });

      investmentData.push(investment);
      valueData.push(value);
    });

    return { labels, investmentData, valueData };
  }, [history, selectedTicker]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Investment",
        data: investmentData,
        fill: true,
        backgroundColor: "rgba(15, 30, 84, 0.1)",
        borderColor: "rgba(15, 30, 84, 0.6)",
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: "Current Valuation",
        data: valueData,
        fill: true,
        backgroundColor: "rgba(74, 222, 128, 0.1)", // green-400 with opacity
        borderColor: "rgba(74, 222, 128, 0.6)",
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    animation: {
      duration: 1500,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#374151",
          boxWidth: 12,
          boxHeight: 12,
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        ticks: {
          color: "#6B7280",
        },
        grid: {
          color: "rgba(209, 213, 219, 0.2)", // soft gray
        },
        title: {
          display: true,
          text: "Date",
          color: "#374151",
        },
      },
      y: {
        ticks: {
          color: "#6B7280",
        },
        grid: {
          color: "rgba(209, 213, 219, 0.2)", // soft gray
        },
        title: {
          display: true,
          text: "Amount ($)",
          color: "#374151",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};
