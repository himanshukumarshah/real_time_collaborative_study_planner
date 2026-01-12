import React from "react";
import { Navigate, useNavigate } from "react-router";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";
import DashboardRooms from "../components/dashboard/DashboardRooms";
import DashboardStats from "../components/dashboard/DashboardStats";
import { PlusCircle, DoorOpen, Sparkles, Loader2 } from "lucide-react";
import Footer from "../components/common/Footer";

const Dashboard = () => {
  const { user, isAuthenticated, initialized } = useAuth();
  const navigate = useNavigate();

  if (!initialized) return <Loader2 size={18} className="animate-spin mr-2" />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <span className="text-2xl animate-wave">👋</span>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            Ready to crush your goals? Join or create a study room.
          </p>
        </header>

        {/* Primary Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <ActionCard
            title="Create Study Room"
            subtitle="Start a focused session as room owner"
            icon={<PlusCircle size={24} />}
            onClick={() => navigate("/create")}
            primary
          />
          <ActionCard
            title="Join Study Room"
            subtitle="Study with your fellow learners"
            icon={<DoorOpen size={24} />}
            onClick={() => navigate("/rooms")}
          />
        </section>

        <div className="space-y-12">
          <DashboardStats />
          <DashboardRooms />
        </div>
      </main>

      <Footer />
    </div>

  );
};

/* ---------- Reusable Action Card ---------- */
const ActionCard = ({ title, subtitle, onClick, primary, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden group p-8 rounded-4xl text-left transition-all duration-300 active:scale-[0.98] border-2 ${primary
          ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 hover:shadow-indigo-200"
          : "bg-white border-slate-100 text-slate-900 hover:border-indigo-100 hover:bg-indigo-50/10 shadow-sm"
        }`}
    >
      <div className={`mb-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${primary ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
        }`}>
        {icon}
      </div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className={`text-sm mt-1 font-medium ${primary ? "text-indigo-100" : "text-slate-500"}`}>
        {subtitle}
      </p>

      {/* Decorative background element */}
      <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 ${primary ? "text-white" : "text-indigo-600"
        }`}>
        {icon && React.cloneElement(icon, { size: 100 })}
      </div>
    </button>
  );
};

export default Dashboard;