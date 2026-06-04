import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user, logout } = useAuth();
    const navigate = useNavigate();

    // If already logged in as admin, redirect immediately
    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setErrMsg('');
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.user.role !== 'admin') {
                // Log them back out if they are not an admin
                logout();
                setErrMsg('Access Denied: This panel is reserved for administrators only.');
                setIsSubmitting(false);
            } else {
                navigate('/admin');
            }
        } else {
            setErrMsg(result.message || 'Invalid administrator credentials.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black flex items-center justify-center py-20 px-6 font-inter select-none">

            {/* Decorative background grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

            <div className="relative w-full max-w-md">

                {/* Glow effect in background */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Login Box */}
                <div className="backdrop-blur-xl bg-neutral-900/60 border border-white/[0.08] rounded-3xl w-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] p-8 sm:p-10 relative overflow-hidden">

                    {/* Top Gold Accent strip */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gold/50 via-gold to-gold/50"></div>

                    {/* Logo & Headings */}
                    <div className="flex flex-col items-center mb-10 text-center">
                        <Link to="/" className="flex items-center gap-2.5 group mb-6 transition-transform duration-300 hover:scale-[1.02]">
                            <div className="w-11 h-11 rounded-xl bg-gold flex items-center justify-center text-black font-extrabold text-xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                <ShieldAlert size={22} className="text-white" />
                            </div>
                            <div className="text-left">
                                <span className="text-xl font-bold tracking-wider text-white block leading-none font-poppins">
                                    TITANCORE
                                </span>
                                <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-gold block mt-1">
                                    ADMIN CONSOLE
                                </span>
                            </div>
                        </Link>

                        <h2 className="text-2xl font-bold tracking-tight text-white font-poppins">System Authentication</h2>
                        <p className="text-xs text-neutral-400 mt-2 font-light">Please enter your administrative credentials to log in.</p>
                    </div>

                    {/* Error Message Box */}
                    {errMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs flex gap-3 items-center mb-6 animate-shake">
                            <ShieldAlert size={18} className="shrink-0 text-red-500" />
                            <p className="font-medium leading-relaxed">{errMsg}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleAdminSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold mb-2 text-neutral-400 uppercase tracking-widest">Admin Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@titancore.com"
                                    className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-2xl py-3.5 pl-11 pr-4 text-xs outline-none text-white transition-all duration-300 font-light"
                                />
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-gold transition-colors duration-300" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Password</label>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-2xl py-3.5 pl-11 pr-12 text-xs outline-none text-white transition-all duration-300 font-light"
                                />
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-gold transition-colors duration-300" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors duration-300 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-4 rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.25)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer text-xs uppercase tracking-widest mt-8"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Verify Credentials
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Back Link */}
                    <div className="border-t border-white/[0.05] pt-6 mt-8 text-center">
                        <Link to="/" className="text-[11px] font-medium text-neutral-400 hover:text-gold transition-colors duration-300">
                            ← Return to Client Homepage
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
