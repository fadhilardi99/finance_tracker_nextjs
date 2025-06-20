"use client";
import Stats_Card from "@/components/Stats_Card";
import AddTransactionForm from "@/components/AddTransactionForm";
import Recent_Transactions from "@/components/Recent_Transactions";
import MonthlyTransactionsList from "@/components/MonthlyTransactionsList";
import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8ff] flex flex-col items-center py-10 px-2">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-black">Finance Tracker</h1>
        <p className="text-lg text-gray-500">Take control of your finances</p>
      </div>

      {/* Stat Cards */}
      <Stats_Card />

      {/* Add Transaction Button or Form */}
      <div className="mb-8 w-full max-w-md">
        {showForm ? (
          <AddTransactionForm onClose={() => setShowForm(false)} />
        ) : (
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform w-full"
            onClick={() => setShowForm(true)}
          >
            Add Transaction
          </button>
        )}
      </div>

      {/* Overview & Recent Transactions */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Recent_Transactions />
        <MonthlyTransactionsList />
      </div>
    </div>
  );
}
