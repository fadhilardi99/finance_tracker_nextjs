import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      newErrors.email = "Valid email is required";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        window.dispatchEvent(new Event("storage"));
        onSuccess();
      }, 1000);
    } catch (err: unknown) {
      setLoading(false);
      setErrors({ password: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-md text-black border border-blue-100 animate-fade-in"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="text-3xl font-extrabold text-blue-700 mb-1 tracking-tight">
          Finance Tracker
        </div>
        <div className="text-base text-gray-400 font-medium">
          Welcome back! Please login.
        </div>
      </div>
      {/* Email */}
      <div className="mb-6 relative">
        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none" />
        <input
          type="email"
          className={`peer w-full rounded-xl shadow bg-white/60 backdrop-blur border border-transparent pl-12 pr-3 py-4 text-base focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white transition placeholder-transparent ${
            errors.email ? "ring-2 ring-red-300" : ""
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <label className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600 bg-white/80 px-1 pointer-events-none">
          Email
        </label>
        <div className="text-xs text-red-500 mt-1 min-h-[18px]">
          {errors.email}
        </div>
      </div>
      {/* Password */}
      <div className="mb-6 relative">
        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-2xl pointer-events-none" />
        <input
          type="password"
          className={`peer w-full rounded-xl shadow bg-white/60 backdrop-blur border border-transparent pl-12 pr-3 py-4 text-base focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white transition placeholder-transparent ${
            errors.password ? "ring-2 ring-red-300" : ""
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <label className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-xs peer-focus:text-purple-600 bg-white/80 px-1 pointer-events-none">
          Password
        </label>
        <div className="text-xs text-red-500 mt-1 min-h-[18px]">
          {errors.password}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white py-3 rounded-lg font-semibold shadow hover:scale-[1.03] transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {success && (
        <div className="mt-4 text-green-600 text-center font-semibold">
          Login successful!
        </div>
      )}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-gray-400 text-xs">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <Link
        href="/register"
        className="text-blue-500 text-sm mt-4 block text-center"
      >
        Don&apos;t have an account? Register
      </Link>
    </form>
  );
}
