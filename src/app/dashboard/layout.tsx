"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#0B874F] text-xl font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-[#001F1D] to-black opacity-40 z-0"></div>
      <div className="fixed inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(11,135,79,0.05)_25%,rgba(11,135,79,0.05)_26%,transparent_27%,transparent_74%,rgba(11,135,79,0.05)_75%,rgba(11,135,79,0.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(11,135,79,0.05)_25%,rgba(11,135,79,0.05)_26%,transparent_27%,transparent_74%,rgba(11,135,79,0.05)_75%,rgba(11,135,79,0.05)_76%,transparent_77%,transparent)] bg-[size:30px_30px] z-0"></div>
      
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-64">
          <Topbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}