import { useState, useRef, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase";

const incomeCategories = [
  { value: "salary", label: "💼 Salary" },
  { value: "gift", label: "🎁 Gift" },
  { value: "investment", label: "📈 Investment" },
  { value: "bonus", label: "🏆 Bonus" },
  { value: "other", label: "🔖 Other" },
];
const expenseCategories = [
  { value: "food", label: "🍔 Food" },
  { value: "transport", label: "🚌 Transport" },
  { value: "shopping", label: "🛒 Shopping" },
  { value: "rent", label: "🏠 Rent" },
  { value: "bills", label: "💡 Bills" },
  { value: "entertainment", label: "🎬 Entertainment" },
  { value: "health", label: "💊 Health" },
  { value: "education", label: "🎓 Education" },
  { value: "other", label: "🔖 Other" },
];

export default function AddTransactionForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  // Auto-focus
  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!amount || Number(amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!category) newErrors.category = "Category is required";
    if (!date) newErrors.date = "Date is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setErrors({ amount: "You must be logged in to add a transaction." });
        setLoading(false);
        return;
      }
      await addDoc(collection(firestore, "transactions"), {
        userId: user.uid,
        type,
        amount: Number(amount),
        category,
        description,
        date,
        createdAt: new Date(),
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setLoading(false);
      setErrors({ amount: err instanceof Error ? err.message : String(err) });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    // Format ke rupiah jika ada nilai
    if (value && !isNaN(Number(value))) {
      setFormattedAmount(
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(Number(value))
      );
    } else {
      setFormattedAmount("");
    }
  };

  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative text-black animate-fade-in"
      autoComplete="off"
    >
      <h2 className="text-2xl font-bold mb-6">Add Transaction</h2>
      {/* Type */}
      <div className="mb-5">
        <label className="block mb-1 font-medium">Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 py-2 rounded border transition font-semibold ${
              type === "expense"
                ? "bg-red-50 border-red-400 text-red-600"
                : "bg-gray-100 border-gray-300"
            }`}
            onClick={() => {
              setType("expense");
              setCategory("");
            }}
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded border transition font-semibold ${
              type === "income"
                ? "bg-green-50 border-green-400 text-green-600"
                : "bg-gray-100 border-gray-300"
            }`}
            onClick={() => {
              setType("income");
              setCategory("");
            }}
          >
            Income
          </button>
        </div>
      </div>
      {/* Amount */}
      <div className="mb-5">
        <div className="relative">
          <input
            ref={amountRef}
            type="number"
            className={`peer w-full border rounded px-3 py-3 bg-transparent focus:outline-none focus:border-blue-500 transition placeholder-transparent ${
              errors.amount ? "border-red-400" : "border-gray-300"
            }`}
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs bg-white px-1 pointer-events-none">
            Amount
          </label>
        </div>
        <div className="text-xs text-gray-500 mt-1 min-h-[18px]">
          {formattedAmount && `Format: ${formattedAmount}`}
        </div>
        <div className="text-xs text-red-500 mt-1 min-h-[18px]">
          {errors.amount}
        </div>
      </div>
      {/* Category */}
      <div className="mb-5">
        <label className="block mb-1 font-medium">Category</label>
        <select
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 transition ${
            errors.category ? "border-red-400" : "border-gray-300"
          }`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <div className="text-xs text-red-500 mt-1 min-h-[18px]">
          {errors.category}
        </div>
      </div>
      {/* Description */}
      <div className="mb-5">
        <label className="block mb-1 font-medium">
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 transition border-gray-300"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note..."
          rows={2}
        />
      </div>
      {/* Date */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 transition ${
            errors.date ? "border-red-400" : "border-gray-300"
          }`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="text-xs text-red-500 mt-1 min-h-[18px]">
          {errors.date}
        </div>
      </div>
      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Transaction"}
        </button>
        <button
          type="button"
          className="flex-1 border border-gray-300 py-2 rounded font-semibold hover:bg-gray-100 transition"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
      {/* Success message */}
      {success && (
        <div className="mt-4 text-green-600 text-center font-semibold animate-fade-in">
          Transaction added successfully!
        </div>
      )}
    </form>
  );
}
