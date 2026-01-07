import { getActiveRooms } from "../../api/room.js"
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Users, PlayCircle, Zap, RefreshCw, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getRooms } from "../../api/user.js"; 
import { useSocket } from "../../context/SocketContext";

const ITEMS_PER_PAGE = 5;

const DashboardRooms = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Helper to fetch and merge data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRoomsRes, activeRoomsRes] = await Promise.all([
        getRooms(),
        getActiveRooms()
      ]);

      const userRoomsData = userRoomsRes?.data || [];
      const activeRoomsData = activeRoomsRes?.data || [];

      const activeMap = new Map();
      activeRoomsData.forEach(([id, roomData]) => {
        activeMap.set(id, roomData);
      });

      const mergedRooms = userRoomsData.map((r) => {
        const activeData = activeMap.get(r._id);
        return {
          roomId: r._id,
          roomName: r.roomName,
          participantsCount: activeData ? activeData.participantsCount : (r.participants?.length || 0),
          isSessionActive: activeData ? activeData.isSessionActive : false,
          isOnline: !!activeData,
        };
      });

      setRooms(mergedRooms);
    } catch (err) {
      console.error("Failed to fetch dashboard rooms:", err);
      setError("Failed to load your rooms.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Initial Fetch ---------------- */
  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- Socket Listeners ---------------- */
  useEffect(() => {
    if (!socket) return;

    const onRoomUpdated = (payload) => {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.roomId === payload.roomId) {
            return {
              ...r,
              ...payload,
              participantsCount: payload.participantsCount ?? r.participantsCount,
              isSessionActive: payload.isSessionActive,
              isOnline: true,
            };
          }
          return r;
        })
      );
    };

    const onRoomClosed = ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.roomId === roomId) {
            return {
              ...r,
              isSessionActive: false,
              isOnline: false,
              participantsCount: 0
            };
          }
          return r;
        })
      );
    };

    socket.on("room-updated", onRoomUpdated);
    socket.on("room-closed", onRoomClosed);

    return () => {
      socket.off("room-updated", onRoomUpdated);
      socket.off("room-closed", onRoomClosed);
    };
  }, [socket]);

  /* ---------------- Filtering & Pagination ---------------- */

  // Reset page when filters change to avoid empty views
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, showActiveOnly]);

  // Compute Filtered List
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      // Filter by Search Query
      const matchesSearch = r.roomName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by Active Status
      const matchesStatus = showActiveOnly ? r.isOnline : true;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, searchQuery, showActiveOnly]);

  // Compute Paginated Slice
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const visibleRooms = filteredRooms.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // Pagination Handlers
  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  };

  /* ---------------- Render Logic ---------------- */
  const getRoomAction = (room) => {
    if (room.isSessionActive) {
      return {
        label: "Join Live",
        style: "bg-green-600 hover:bg-green-700 text-white shadow-green-100",
        icon: <PlayCircle size={16} />
      };
    }
    if (room.isOnline) {
      return {
        label: "Join Room",
        style: "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100",
        icon: <Zap size={16} />
      };
    }
    return {
      label: "Rejoin Room",
      style: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100",
      icon: null
    };
  };

  if (loading) return <div className="p-6 text-gray-500">Loading your rooms...</div>;
  if (error) return <div className="p-6 text-red-600 border border-red-100 bg-red-50 rounded-xl">{error}</div>;

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Rooms</h3>
          <p className="text-sm text-slate-500 font-medium">Recently visited study spaces</p>
        </div>
        
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search rooms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-full sm:w-64"
            />
          </div>
          
          <button
            onClick={() => setShowActiveOnly(!showActiveOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
              showActiveOnly 
                ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100" 
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Filter size={14} />
            {showActiveOnly ? "Live Only" : "All"}
          </button>

          <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-xl shadow-sm transition-all">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="inline-flex p-4 bg-slate-50 rounded-2xl text-slate-300 mb-4">
            <Users size={32} />
          </div>
          <p className="text-slate-500 font-bold">You haven't joined any rooms yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visibleRooms.map((room) => {
            const action = getRoomAction(room);
            return (
              <div
                key={room.roomId}
                className={`group bg-white border p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-xl hover:shadow-slate-200/50 ${
                  room.isSessionActive ? "border-green-200" : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    room.isSessionActive ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-500"
                  }`}>
                    {room.roomName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg leading-none mb-1">{room.roomName}</h4>
                    <div className="flex items-center gap-3">
                      {room.isOnline && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                          <Users size={12} />
                          {room.participantsCount} Member{room.participantsCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      {room.isSessionActive ? (
                        <span className="flex items-center gap-1.5 text-xs text-green-600 font-black uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
                          Session Live
                        </span>
                      ) : room.isOnline ? (
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-md">Online</span>
                      ) : (
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">Offline</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/room/${room.roomId}`)}
                  className={`flex items-center gap-2 px-6 py-2.5 text-sm font-black rounded-xl transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center uppercase tracking-widest ${action.style}`}
                >
                  {action.icon}
                  {action.label}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Page {currentPage + 1} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button onClick={prevPage} disabled={currentPage === 0} className="p-2 rounded-lg border border-slate-200 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-30 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextPage} disabled={currentPage >= totalPages - 1} className="p-2 rounded-lg border border-slate-200 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-30 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardRooms;