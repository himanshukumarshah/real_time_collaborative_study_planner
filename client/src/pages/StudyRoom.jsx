import React, { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate, useParams, useBlocker, Link } from "react-router";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext.jsx";
import Participants from "../components/room/Participants";
import Timer from "../components/room/Timer";
import Navbar from "../components/common/Navbar";
import toast from "react-hot-toast";
import BlockerUI from "../components/common/blockerUI.jsx"
import { Notification } from "../utils/Notification.jsx";
import Footer from "../components/common/footer.jsx";
import { Monitor, Check, LogOut, Users, Play, Loader2, Info, AlertCircle, Copy, Settings2, Zap, Trophy, TimerIcon, ShieldAlert, CheckCircle2 } from "lucide-react";
import { WelcomeNotification } from "../utils/WelcomeNotification.jsx";
import { SessionCompleteNotification } from "../utils/SessionCompleteNotification.jsx";

export default function StudyRoom() {
  const { id: roomId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const joinedRef = useRef(false);

  const { socket, connected, joinRoom, leaveRoom, startSession, endSession } = useSocket();

  const [participants, setParticipants] = useState([]);
  const [session, setSession] = useState(null); // { startTime, duration }
  const [sessionEnded, setSessionEnded] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ownerId, setOwnerId] = useState(null);
  const [isOwnerTmp, setIsOwnerTmp] = useState(false);
  const [roomName, setRoomName] = useState("My Room");
  const [copied, setCopied] = useState(false);
  const [customDuration, setCustomDuration] = useState("25");
  const [change, setChange] = useState(false);

  // ---- socket handlers ----

  const handlePresence = ({ users, ownerId, isOwnerTemp, userUpdate }) => {
    let cng;

    setParticipants(users || []);
    setOwnerId(ownerId || null);

    if (isOwnerTemp) {
      cng = setTimeout(() => {
        setChange(!change);
      }, 8000);
    } else if (cng) clearTimeout(cng);

    setIsOwnerTmp(isOwnerTemp);

    if (userUpdate.userId !== user?.id) {
      Notification(userUpdate);
    } else {
      WelcomeNotification(userUpdate?.userName);
    }

    // Notification({state: 'ownerChanged'});
    // console.log("users:", users, "owner:", ownerId, "tmpOwner:", isOwnerTmp)
  };

  const handleSessionStarted = ({ startTime, duration }) => {
    const startMs = new Date(startTime).getTime();
    setSession({ startMs, duration });
    setStarting(false);
    toast.success("Session started");
    // console.log("start:", session)

  };

  const handleSessionSync = ({ startTime, duration }) => {
    const startMs = new Date(startTime).getTime();
    // console.log("starttime in sync:", startMs)
    setSession({ startMs, duration });
    // console.log("sync:", session)

  };

  const handleSessionEnded = () => {
    setSession(null);
    setSessionEnded(true);
    SessionCompleteNotification(customDuration);
    // toast("Session ended");
    // console.log("hi from handleSessionEnded fn")
  };

  // ---- join room ----

  useEffect(() => {
    if (!socket || !roomId || !user || joinedRef.current) return;
    // console.log("StudyRoom: useEffect running")

    joinedRef.current = true;

    socket.on("presence-update", handlePresence);
    socket.on("session-started", handleSessionStarted);
    socket.on("session-sync", handleSessionSync);
    socket.on("session-ended", handleSessionEnded);

    joinRoom(roomId, user.name, (ack) => {
      if (ack?.status !== 200) {
        toast.error("Failed to join room");
        joinedRef.current = false;
      } else {
        // console.log("userId:", user.id, "ownerId:", ack?.ownerId)
        setRoomName(ack?.roomName);
        // console.log("roomName:", roomName);
        // if(isOwner) console.log("You are owner.")
      }
      // console.log("joinRoom ack", ack);

    });

    return () => {
      socket.off("presence-update", handlePresence);
      socket.off("session-started", handleSessionStarted);
      socket.off("session-sync", handleSessionSync);
      socket.off("session-ended", handleSessionEnded);

      // socket.emit("leave-room", { roomId });
      joinedRef.current = false;
    };
  }, [socket, roomId, user, joinRoom, change]);

  // ---- actions ----

  const handleSessionStart = (e) => {
    if (starting || session) return;
    e.preventDefault();

    setStarting(true);
    setSessionEnded(false);
    const durationSec = parseInt(customDuration) * 60;
    // const durationSec = 4;  //! ====================

    startSession(roomId, durationSec, (ack) => {
      if (ack?.status !== 200) {
        toast.error("Failed to start session");
        setStarting(false);
        // console.log(ack.status, ack.message)
      }
    });
  };

  const handleLeaveRoom = () => {
    const leaveConfirm = window.confirm("Leave Study Room?");
    if (!leaveConfirm) return;

    leaveRoom(roomId, () => { });
    joinedRef.current = false;
    navigate("/rooms", { replace: true });
  };

  const handleSessionEnd = () => {
    if (ownerId !== user.id) return;

    setStarting(false);
    const endTime = Date.now();
    endSession(roomId, endTime, (ack) => {
      if (ack?.status !== 200) {
        toast.error("Failed to end session");
        setStarting(true);
      }
    });
  };

  const handleCopy = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Failed to copy.", err);
      toast.error("Could not copy link.");
    }
  }

  // Blocker

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    joinedRef.current && currentLocation.pathname !== nextLocation.pathname
  );

  const handleBlockerProceed = () => {
    leaveRoom(roomId, () => { });
    joinedRef.current = false;

    const destination = blocker.location?.pathname;
    blocker.reset();
    navigate(destination, { replace: true });
  }

  // ---- auth guard ----

  if (!isAuthenticated) {
    return (
      <>
        <Loader2 size={18} className="animate-spin mr-2" />
        <Navigate to="/auth/login" replace />
      </>
    );
  }

  // ---- UI ----

  return (

    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Navigation Blocker Notification */}
      {blocker.state === "blocked" && (
        <BlockerUI
          proceedHandler={handleBlockerProceed}
          resetHandler={() => blocker.reset()}
        />
      )}

      <main className="max-w-6xl mx-auto p-4 md:p-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 p-1">

          {/* LEFT: Room Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <Monitor size={24} strokeWidth={2.5} />
              </div>
              {/* Status Indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                {roomName}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                  {sessionEnded ? ("Live Room") : ("Live Session")}
                </span>
                <span className="text-xs text-slate-400 font-medium italic">
                  Public Room
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Action Groups */}
          <div className="flex items-center gap-3 w-full md:w-auto">

            {/* Secondary Action: Copy Link with Feedback */}
            <button
              onClick={handleCopy}
              title="Copy invite link"
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all active:scale-95 ${copied
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30"
                }`}
            >
              {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
              <span>{copied ? "Copied!" : "Invite Link"}</span>
            </button>

            {/* Destructive Action: Leave */}
            <button
              onClick={handleLeaveRoom}
              title="Click to leave room"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-100 text-red-600 text-sm font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 group"
            >
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Leave</span>
            </button>

          </div>
        </div>

        {connected ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Session Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all">
                <div className="p-6 md:p-12">
                  {session ? (
                    <Timer
                      startTime={session.startMs}
                      duration={session.duration}
                      onEnd={handleSessionEnd}
                    />
                  ) : starting ? (
                    /* LOADING STATE */
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                      <div className="relative mb-6">
                        <Loader2 size={48} className="text-indigo-600 animate-spin" />
                        <div className="absolute inset-0 bg-indigo-200 blur-2xl opacity-20 rounded-full"></div>
                      </div>
                      <p className="text-xl font-black text-gray-900 tracking-tight">Synchronizing Room...</p>
                      <p className="text-sm text-gray-500 mt-2">Connecting everyone to the same frequency.</p>
                    </div>
                  ) : (
                    /* IDLE / ENDED STATE */
                    <div className="flex flex-col items-center justify-center py-12 text-center">

                      {/* Visual Icon Anchor */}
                      <div className="mb-8 relative">
                        <div className={`h-20 w-20 rounded-3xl flex items-center justify-center transition-colors duration-500 ${sessionEnded ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                          {sessionEnded ? <Trophy size={36} /> : <Zap size={36} />}
                        </div>
                        {sessionEnded && (
                          <div className="absolute -top-2 -right-2 bg-white shadow-sm border border-emerald-100 rounded-full p-1.5 text-emerald-500">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>

                      {sessionEnded ? (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                          <h3 className="text-3xl font-black text-slate-900 mb-2">Great Work!</h3>
                          <p className="text-sm text-slate-500 mb-10 max-w-75 leading-relaxed">
                            Your previous session is complete. Ready for another round of deep focus?
                          </p>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-3xl font-black text-slate-900 mb-2">Ready to focus?</h3>
                          <p className="text-sm text-slate-500 mb-10 max-w-[320px] leading-relaxed">
                            Set your duration and lead the way. Everyone in this room will follow your timer.
                          </p>
                        </div>
                      )}

                      <form onSubmit={handleSessionStart} className="w-full max-w-xs space-y-4">
                        <div className="group bg-slate-50 border border-slate-200 p-2 rounded-2xl flex items-center transition-all focus-within:ring-4 focus-within:ring-indigo-50 focus-within:border-indigo-200">
                          <div className="flex-1 flex items-center px-4 gap-3">
                            <TimerIcon size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                            <input
                              type="number"
                              value={customDuration}
                              onChange={(e) => setCustomDuration(e.target.value)}
                              className="w-full bg-transparent text-lg font-bold text-slate-800 outline-none placeholder:text-slate-300"
                              placeholder="25"
                              min="1"
                              max="360"
                            />
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Minutes</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={starting || !customDuration}
                          className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 active:scale-[0.97]"
                        >
                          <Play size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                          <span>{`Start ${customDuration || '...'} Min Session`}</span>
                        </button>
                      </form>

                      <div className="mt-8 flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Room Sync Ready</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Status Bar */}
                <div className="bg-slate-50/50 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="p-1.5 bg-white rounded-md border border-gray-200 shadow-sm">
                      <ShieldAlert size={14} className="text-amber-500" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-gray-700 uppercase tracking-tighter block mb-0.5">Strict Session Mode</span>
                      <p className="font-medium opacity-80">Once started, the timer cannot be paused or reset.</p>
                      {!sessionEnded && (
                        <p className="font-medium opacity-80">Your progress won't be save if left mid-session.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Live</span>
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6 text-gray-900">
                  <Users size={20} className="text-indigo-600" />
                  <h3 className="font-bold">Study Group</h3>
                  <span className="ml-auto bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {participants.length}
                  </span>
                </div>

                <Participants participants={participants} ownerId={ownerId} isOwnerTemp={isOwnerTmp} />
              </div>
            </div>

          </div>
        ) : (
          /* Disconnected State */
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-2xl mx-auto mt-12">
            <div className="h-14 w-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-lg font-bold text-red-900 mb-2">Connection Terminated</h2>
            <p className="text-sm text-red-700 leading-relaxed">
              You've been disconnected because you joined another room on a different tab or device.
              FocusRoom only supports one active session at a time.
            </p>
            <button
              onClick={() => window.close()}
              className="mt-6 text-sm font-bold text-red-600 hover:underline"
            >
              Close this tab
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>

  );
}
