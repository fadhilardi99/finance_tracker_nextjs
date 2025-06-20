import { useState, useEffect } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase";
import { formatRupiah } from "@/utils/formatters";

export default function Stats_Card() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(firestore, "transactions"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let income = 0;
      let expense = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "income") {
          income += data.amount;
        } else {
          expense += data.amount;
        }
      });
      setTotalIncome(income);
      setTotalExpense(expense);
    });

    return () => unsubscribe();
  }, []);

  const balance = totalIncome - totalExpense;

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Income */}
      <div className="bg-green-100 text-green-800 rounded-lg p-6 flex flex-col justify-between shadow-md relative border border-green-200">
        <div className="font-semibold text-sm mb-2">Total Income</div>
        <div className="text-3xl font-bold">{formatRupiah(totalIncome)}</div>
        <span className="absolute top-4 right-4 text-2xl">📈</span>
      </div>
      {/* Total Expenses */}
      <div className="bg-red-100 text-red-800 rounded-lg p-6 flex flex-col justify-between shadow-md relative border border-red-200">
        <div className="font-semibold text-sm mb-2">Total Expenses</div>
        <div className="text-3xl font-bold">{formatRupiah(totalExpense)}</div>
        <span className="absolute top-4 right-4 text-2xl">📉</span>
      </div>
      {/* Balance */}
      <div className="bg-blue-100 text-blue-800 rounded-lg p-6 flex flex-col justify-between shadow-md relative border border-blue-200">
        <div className="font-semibold text-sm mb-2">Balance</div>
        <div className="text-3xl font-bold">{formatRupiah(balance)}</div>
        <span className="absolute top-4 right-4 text-2xl">💰</span>
      </div>
    </div>
  );
}
