'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { withToken } from "@/lib/api/zodios";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { setToken } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      withToken(token);
      router.push("/dashboard");
    }
  }, [searchParams, setToken, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

      setToken(data.token);
      withToken(data.token);
      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3001/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Đăng nhập</h2>

        {error && (
          <div className="bg-red-100 text-red-600 border border-red-300 px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded py-2 hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} />
          <span>Đăng nhập bằng Google</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="flex-1 border-t border-gray-300" />
          <span className="text-gray-400 text-sm">hoặc</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-600 hover:underline"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
