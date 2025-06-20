"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { firestore, auth } from "@/lib/firebase";
import { formatRupiah } from "@/utils/formatters";
import { FiChevronLeft, FiChevronRight, FiFileText } from "react-icons/fi";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  date: string;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  salary: "💼",
  gift: "🎁",
  investment: "📈",
  bonus: "🏆",
  food: "🍔",
  transport: "🚌",
  shopping: "🛒",
  rent: "🏠",
  bills: "💡",
  entertainment: "🎬",
  health: "💊",
  education: "🎓",
  other: "🔖",
};

export default function MonthlyTransactionsList() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        setTransactions([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const q = query(
      collection(firestore, "transactions"),
      where("userId", "==", user.uid),
      where("date", ">=", firstDay.toISOString().split("T")[0]),
      where("date", "<=", lastDay.toISOString().split("T")[0]),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const transactionsData: Transaction[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          transactionsData.push({ id: doc.id, ...data } as Transaction);
        });

        setTransactions(transactionsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching monthly transactions:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, currentDate]);

  const handleMonthChange = (offset: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      {/* Header and Navigation */}
      <div className="flex items-center justify-between mb-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Monthly Transactions
          </h2>
          <p className="text-sm text-gray-500">
            All transactions for {monthName}
          </p>
        </div>
        <div className="flex items-center gap-2 text-black text-2xl">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft />
          </button>
          <span className="font-semibold w-32 text-center text-black">
            {monthName}
          </span>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No transactions found for this month.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {new Date(tx.date.split("-").join("/")).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "short" }
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm flex items-center gap-2 text-gray-700">
                    <span className="text-lg">
                      {categoryIcons[tx.category] || <FiFileText />}
                    </span>
                    <span className="capitalize">{tx.category}</span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-bold">
                    <span
                      className={
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {tx.type === "income" ? "+" : "-"}{" "}
                      {formatRupiah(tx.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span
                      className={`font-semibold ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {tx.description || (
                      <span className="italic text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
