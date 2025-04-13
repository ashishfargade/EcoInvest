import React from "react";
import { Link } from "react-router";

export const Home = () => {
  return (
    <div
      className="hero bg-gradient-to-r from-green-200 via-white to-blue-200 min-h-screen flex flex-col items-center justify-center text-center p-4"
      style={{
        backgroundSize: "200% 200%",
        animation: "breathingGradient 10s ease-in-out infinite",
        backgroundPosition: "0% 50%",
      }}
    >
      <style>
        {`
      @keyframes breathingGradient {
        0%, 100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
    `}
      </style>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-800">
        EcoInvest
      </h1>
      <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-700 max-w-3xl">
        Analyze and optimize your stock portfolio for a sustainable future. Make
        eco-friendly investments with confidence.
      </p>
      <button className="bg-green-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-600 transition duration-300 shadow-md">
        <Link to="/signup" className="text-white hover:text-blue-300">
          Get Started
        </Link>
      </button>
    </div>
  );
};
