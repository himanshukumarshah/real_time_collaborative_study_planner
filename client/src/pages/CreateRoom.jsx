import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";
import { nanoid } from "nanoid";
import API from "../api/auth";
import { LayoutGrid, AlertCircle, Loader2 } from "lucide-react";

export default function CreateRoom() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect unauthenticated users safely
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    const trimmed = roomName.trim();
    if (trimmed && trimmed.length < 3) {
      setError("Room name must be at least 3 characters");
      return;
    }

    const roomId = nanoid();

    try {
      setLoading(true);
      const res = await API.post("/room/create", {
        roomId,
        roomName: trimmed || "My Room",
      });

      if (res.status === 201) {
        navigate(`/room/${roomId}`, { replace: true });  //! ------------
      } else {
        setError("Unable to create room. Please try again.");
      }
    } catch (err) {
      console.error("Create room failed:", err);
      setError(
        err?.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (

    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">Create Study Room</h1>
            <p className="text-sm text-gray-500 mt-1">Set up a new space for collaborative focus.</p>
          </div>

          {/* User Info Badge */}
          <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg mb-8">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {user?.name?.charAt(0)}
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Room Owner:</span>
              <span className="ml-1 font-bold text-gray-900">{user?.name}</span>
            </div>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Room Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <LayoutGrid size={18} />
                </div>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. DSA Night Study"
                  maxLength={50}
                  autoFocus
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 italic">
                Optional. Leave empty to auto-generate a name.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in duration-200">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Creating Room...
                </>
              ) : (
                "Create Room"
              )}
            </button>
          </form>
        </div>
      </main>

      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={40} className="text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-gray-600">Building your room...</p>
          </div>
        </div>
      )}
    </div>
  );
}
