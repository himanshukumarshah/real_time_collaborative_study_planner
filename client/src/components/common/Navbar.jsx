import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import { LayoutDashboard, DoorOpen, PlusCircle, LogOut, User as UserIcon, Menu, X, RefreshCcw  } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    socket?.disconnect();
    navigate("/", { replace: true });
  };

  // prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-60 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* 1. BRAND */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center gap-3 no-underline group active:scale-95 transition-all duration-200"
              >
                {/* Modern Icon Container */}
                <div className="relative shrink-0">
                  <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <RefreshCcw  size={22} strokeWidth={2.9} />
                  </div>
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>

                {/* Brand Text Wrapper */}
                <div className="flex flex-col justify-center -space-y-1 gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                      Zync
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2"></span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Stay Focused • Stay Synced
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. DESKTOP CENTER NAV (Hidden on Mobile) */}
            <div className="hidden md:flex items-center bg-slate-50/50 p-1 rounded-full border border-slate-100">
              {isAuthenticated ? (
                <div className="flex items-center">
                  {[
                    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={16} /> },
                    { label: 'Join Room', to: '/rooms', icon: <DoorOpen size={16} /> },
                    { label: 'Create Room', to: '/create', icon: <PlusCircle size={16} /> }
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-center gap-2 px-5 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-full transition-all font-bold"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center px-2">
                  <a href="#features" className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-indigo-600">Features</a>
                  <a href="#how-it-works" className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-indigo-600">Process</a>
                </div>
              )}
            </div>

            {/* 3. RIGHT SECTION (Profile/Toggle) */}
            <div className="flex items-center gap-2">
              {!isAuthenticated && (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/auth/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 px-4">Log in</Link>
                  <Link to="/auth/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-indigo-600 transition-all font-bold shadow-lg shadow-slate-200">
                    Get Started
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                  >
                    <div className="h-9 w-9 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
                      {userInitial}
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">{user?.name?.split(' ')[0]}</span>
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-0.5">Online</span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu (Desktop Only) */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95" onMouseLeave={() => setMenuOpen(false)}>
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl">
                        <UserIcon size={18} /> Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl mt-1">
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MOBILE TOGGLE BUTTON - Always on top */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-900 active:scale-90 transition-all z-80 relative"
              >
                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER - Independent Full Screen Layer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 w-full h-full bg-white z-70 flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="mt-24 space-y-8 pb-10">
            {/* User Profile Header */}
            {isAuthenticated && (
              <div className="bg-indigo-50 p-6 rounded-4xl flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-lg">
                  {userInitial}
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{user?.name}</h4>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Active Member</p>
                </div>
              </div>
            )}

            {/* Menu Links */}
            <div className="space-y-3">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Navigation</p>
              {isAuthenticated ? (
                <>
                  {[
                    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard /> },
                    { label: 'Browse Rooms', to: '/rooms', icon: <DoorOpen /> },
                    { label: 'Create Room', to: '/create', icon: <PlusCircle /> },
                    { label: 'My Profile', to: '/profile', icon: <UserIcon /> }
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-bold active:bg-indigo-600 active:text-white transition-all shadow-sm"
                    >
                      <span className="text-indigo-600">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : (
                <div className="space-y-3 pt-6">
                  <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="block w-full py-5 text-center font-black text-slate-700 rounded-2xl bg-slate-50 border border-slate-100">Log In</Link>
                  <Link to="/auth/register" onClick={() => setMobileOpen(false)} className="block w-full py-5 text-center font-black text-white rounded-2xl bg-indigo-600 shadow-xl">Get Started</Link>
                </div>
              )}
            </div>

            {/* Logout Option */}
            {isAuthenticated && (
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="w-full flex items-center justify-center gap-3 py-5 text-red-500 font-black uppercase tracking-widest text-xs border-2 border-red-50 rounded-2xl"
              >
                <LogOut size={18} /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
