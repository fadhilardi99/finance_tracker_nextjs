"use client";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <div className="flex w-full max-w-4xl min-h-[500px] shadow-2xl rounded-3xl overflow-hidden bg-white/60 backdrop-blur-md">
        {/* Left: Illustration & Quote (hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-400 to-purple-400 text-white p-10">
          <div className="text-7xl mb-6">💸</div>
          <div className="text-2xl font-bold mb-2 text-center">
            Welcome to Finance Tracker
          </div>
          <div className="text-lg font-light text-center opacity-90">
            &quot;Track your money, reach your dreams.&quot;
          </div>
        </div>
        {/* Right: Login Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <LoginForm onSuccess={() => router.push("/")} />
        </div>
      </div>
    </div>
  );
}
