// src/components/dashboard/DashboardStats.jsx
import React, { useState, useEffect } from "react";
import { getSessions } from "../../api/user.js";
import { Target, Clock, Trophy, Flame } from "lucide-react";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    sessionCount: 0,
    totalSessionDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getSessions();
        const data = res?.data;

        // console.log(data)
        if (data) {
          setStats({
            sessionCount: data.sessionCount || 0,
            totalSessionDuration: data.totalSessionDuration
              ? Math.round(data.totalSessionDuration / 60)
              : 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user sessions:", err);
        setError("Failed to fetch user sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading stats...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  return (
    <section>
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Today's Focus</h3>
        <p className="text-sm text-slate-500 font-medium">Your personal growth metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Sessions" 
          value={stats.sessionCount} 
          icon={<Target className="text-indigo-500" />} 
          trend="Target Achieved"
        />
        <StatCard 
          label="Focus Time" 
          value={`${stats.totalSessionDuration}m`} 
          icon={<Clock className="text-purple-500" />} 
          trend="Time well spent"
        />
        {/* <StatCard 
          label="Daily Streak" 
          value="-- d" 
          icon={<Flame className="text-orange-500" />} 
          trend="Coming soon"
        /> */}
        {/* <StatCard 
          label="Level" 
          value="Bronze" 
          icon={<Trophy className="text-amber-500" />} 
          trend="Keep going!"
        /> */}
      </div>
    </section>
  );
};

const StatCard = ({ label, value, icon, trend }) => (
  <div className="bg-white border border-slate-100 rounded-4xl p-6 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">
        {icon}
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{trend}</span>
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
  </div>
);

export default DashboardStats;
