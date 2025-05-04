"use client";

import CalendarView from "@/components/calendar/CalendarView";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { token, setToken, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [token, isLoading, router]);

  if (isLoading) return <div>Đang tải...</div>;
  if (!token) return null; // Chờ redirect

  const handleLogout = () => {
    setToken(null);
    router.push("/login");
  };

  return (
    <div className="p-6">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 float-right"
      >
        Đăng xuất
      </button>
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <CalendarView />
    </div>
  );
}
