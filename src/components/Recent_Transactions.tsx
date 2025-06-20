import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase";
import { formatRupiah } from "@/utils/formatters";
import { FiFileText } from "react-icons/fi";

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

export default function Recent_Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener untuk perubahan status otentikasi
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Query hanya jika user sudah login
        const q = query(
          collection(firestore, "transactions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const transactionsData: Transaction[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              transactionsData.push({
                id: doc.id,
                type: data.type,
                amount: data.amount,
                category: data.category,
                description: data.description,
                date: data.date,
              });
            });
            setTransactions(transactionsData);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching transactions: ", error);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } else {
        // Jika tidak ada user (logout), reset state
        setTransactions([]);
        setLoading(false);
      }
    });

    return () => authUnsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-h-[300px] flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Transactions
        </h2>
        <p className="text-sm text-gray-500">
          Your last 5 financial activities
        </p>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-center">
          No transactions yet. Add your first transaction to get started!
        </div>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                    tx.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <span className="text-xl">
                    {categoryIcons[tx.category] || <FiFileText />}
                  </span>
                </div>
                <div>
                  <p className="font-semibold capitalize text-gray-700">
                    {tx.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div
                className={`font-semibold ${
                  tx.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatRupiah(tx.amount)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
