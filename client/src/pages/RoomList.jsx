import React, { useEffect, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router";
import Navbar from "../components/common/Navbar";
import { getActiveRooms } from "../api/room";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Loader2, RefreshCw, Users, PlayCircle, Clock } from "lucide-react";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { socket } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ---- fetch snapshot ----
  useEffect(() => {
    let alive = true;

    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getActiveRooms();
        if (!alive) return;

        setRooms(
          res.data.map(([roomId, r]) => ({
            roomId,
            roomName: r.roomName,
            participantsCount: r.participantsCount,
            isSessionActive: r.isSessionActive,
            roomStatus: r.roomStatus,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        if (alive) setError("Failed to load rooms");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchRooms();
    return () => {
      alive = false;
    };
  }, []);

  // ---- live updates (socket) ----
  useEffect(() => {
    if (!socket) return;

    const onRoomUpdated = (p) => {
      setRooms((prev) => {
        const idx = prev.findIndex((r) => r.roomId === p.roomId);
        const updated = {
          roomId: p.roomId,
          roomName: p.roomName,
          participantsCount: p.participantsCount,
          isSessionActive: p.isSessionActive,
          roomStatus: p.roomStatus,
        };

        if (idx === -1) return [updated, ...prev];

        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      });
    };

    const onRoomClosed = ({ roomId }) => {
      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    };

    socket.on("room-updated", onRoomUpdated);
    socket.on("room-closed", onRoomClosed);

    return () => {
      socket.off("room-updated", onRoomUpdated);
      socket.off("room-closed", onRoomClosed);
    };
  }, [socket]);

  // ---- actions ----
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await getActiveRooms();
      setRooms(
        res.data.map(([roomId, r]) => ({
          roomId,
          roomName: r.roomName,
          participantsCount: r.participantsCount,
          isSessionActive: r.isSessionActive,
          roomStatus: r.roomStatus,
        }))
      );
    } catch (err) {
      console.error("Refresh failed:", err);
      toast.error("Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  // ---- auth guard ----
  if (!isAuthenticated) {
    return (
      <>
        <Loader2 size={35} className="animate-spin mr-2" />
        <Navigate to="/auth/login" replace />
      </>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Rooms</h1>
            <p className="text-sm text-gray-500 mt-1">
              Join a study session.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Signed in as</span>
              <span className="text-sm font-semibold text-gray-700">{user?.name ?? "User"}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              title="Click to refresh"
              className="inline-flex items-center gap-2 px-2.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-all shadow-sm"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* State Management Views */}
        {loading && rooms.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
            <Loader2 size={32} className="text-indigo-600 animate-spin mb-4" />
            <span className="text-gray-600 font-medium">Scanning for active rooms…</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
            <p className="text-sm text-red-600 font-semibold">{error}</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center ">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No rooms found</h3>
            <p className="text-sm text-gray-500">Why not create the first one yourself and be the owner?</p>
            <div className="w-full max-w-50 mx-auto mt-4">
              <Link
                to="/create"
                className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                Create a room
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid gap-4">
            {rooms.map((r) => (
              <li
                key={r.roomId}
                className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                      {r.roomName.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-bold text-gray-900 truncate text-lg">
                      {r.roomName}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users size={16} className="text-gray-400" />
                      <span>
                        {r.participantsCount} {r.participantsCount === 1 ? "student" : "students"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 bg-gray-300 rounded-full" />
                      {r.isSessionActive ? (
                        <div className="flex items-center gap-1.5 text-green-600 font-bold">
                          <PlayCircle size={16} />
                          <span>Session running</span>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                          <Clock size={16} />
                          <span>Waiting...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleJoin(r.roomId)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100"
                >
                  Join Room
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
