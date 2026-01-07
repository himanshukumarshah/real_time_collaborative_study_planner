import React from "react";
import { Navigate } from "react-router";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/formatDate";
import { User, Mail, Calendar, Settings } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (

    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header Area */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6 px-1">My Profile</h1>

          {/* Main Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Top Banner Accent */}
            <div className="h-24 bg-linear-to-r from-indigo-500 to-indigo-600"></div>

            <div className="p-8 pt-0">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-10 mb-8">
                <div className="h-24 w-24 rounded-2xl bg-indigo-600 border-4 border-white text-white flex items-center justify-center text-3xl font-black shadow-md">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-center sm:text-left pb-1">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {user.name}
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    Zync Member
                  </p>
                </div>
              </div>

              {/* User details Grid */}
              <div className="grid gap-y-6 pt-2">
                <ProfileField
                  icon={<User size={18} />}
                  label="Full Name"
                  value={user.name}
                />

                <ProfileField
                  icon={<Mail size={18} />}
                  label="Email Address"
                  value={user.email}
                />

                {user.createdAt && (
                  <ProfileField
                    icon={<Calendar size={18} />}
                    label="Joined On"
                    value={formatDate(user.createdAt)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Account Security (Visual Polish) */}
          <div className="mt-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between">
            <p className="text-sm text-indigo-700 font-medium px-2">
              Your account is secure and active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-gray-400">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-base font-semibold text-gray-800 break-all leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );
}