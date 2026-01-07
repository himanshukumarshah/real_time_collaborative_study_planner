import React from 'react'
import { Link } from 'react-router'
import { Globe, Twitter, ShieldCheck, RefreshCcw } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-slate-100 pt-15 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

                    {/* 1. Brand & Value Proposition */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3 group no-underline">
                            <div className="relative shrink-0">
                                <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-all duration-300">
                                    <RefreshCcw  size={22} strokeWidth={2.9} />
                                </div>
                            </div>
                            <div className="flex flex-col -space-y-1 gap-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-2xl font-black text-slate-900 tracking-tighter">Zync</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2"></span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                    Stay Focused • Stay Synced
                                </span>
                            </div>
                        </div>
                        
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                            The world's first real-time collaborative study environment designed to eliminate procrastination through social accountability.
                        </p>

                        {/* <div className="flex items-center gap-4 pt-2">
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Globe size={18} />} />
                        </div> */}
                    </div>

                    {/* 2. Navigation Columns */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Platform</h4>
                            <ul className="space-y-4">
                                <FooterLink to="/rooms" label="Browse Rooms" />
                                <FooterLink to="/dashboard" label="Study Dashboard" />
                                <FooterLink to="/create" label="Host a Session" />
                                {/* <FooterLink to="/community" label="Leaderboard" /> */}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Support</h4>
                            <ul className="space-y-4">
                                <FooterLink to="/#how-it-works" label="Getting Started" />
                                <FooterLink to="/#features" label="Features" />
                                {/* <FooterLink to="/faq" label="Help Center" /> */}
                                {/* <FooterLink to="/security" label="Trust & Safety" /> */}
                                {/* <FooterLink to="/contact" label="Contact Us" /> */}
                            </ul>
                        </div>
                    </div>

                    {/* 3. Status Widget */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-50 rounded-4xl p-8 border border-slate-100 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Network Status</span>
                                </div>
                                <p className="text-[13px] font-medium text-slate-600 leading-snug">
                                    All global study clusters are operational and in-sync.
                                </p>
                            </div>
                            <ShieldCheck className="absolute -right-4 -bottom-4 text-slate-200/50 group-hover:text-indigo-500/10 transition-colors" size={100} />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium text-slate-400">
                        © {new Date().getFullYear()} Zync. Built for deep focus.
                    </p>
                    {/* <div className="flex items-center gap-8">
                        <Link to="/privacy" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Privacy</Link>
                        <Link to="/terms" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Terms</Link>
                        <Link to="/security" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Security</Link>
                    </div> */}
                </div>
            </div>
        </footer>
    )
}

const FooterLink = ({ to, label }) => (
    <li>
        <Link to={to} className="text-[13px] font-medium text-slate-500 hover:text-indigo-600 hover:translate-x-1 transition-all inline-block">
            {label}
        </Link>
    </li>
)

const SocialIcon = ({ icon }) => (
    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-white transition-all">
        {icon}
    </button>
)

export default Footer