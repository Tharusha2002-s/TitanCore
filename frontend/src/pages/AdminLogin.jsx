import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import adminLoginBg from '../assets/admin/admin_login_bg.png';
import logoImg from '../assets/logo.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user, logout, loading } = useAuth();
    const navigate = useNavigate();

    // If already logged in as admin, redirect immediately
    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    // Show loading spinner while verifying session on startup
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 text-white font-inter">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <span className="text-neutral-400 font-medium text-sm tracking-wider uppercase">Verifying session...</span>
            </div>
        );
    }

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
        <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row font-inter select-none relative overflow-hidden text-white">
            {/* Left Panel: Hero Graphic Showcase (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-neutral-950 p-12 overflow-hidden border-r border-white/5">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
                    style={{ backgroundImage: `url(${adminLoginBg})` }}
                ></div>
                {/* Gold Radial Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/85 to-gold/10"></div>

                {/* Brand Overlay Content */}
                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gold">TitanCore Systems Secure Node</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight font-poppins">
                        Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-500 to-amber-600 font-extrabold">Visionary</span> Infrastructure.
                    </h1>

                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        Authorized access only. System logs are continuously monitored. Unauthorised attempts to access this administration portal are subject to cybersecurity overrides.
                    </p>


                </div>
            </div>

            {/* Right Panel: Login Credentials Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 min-h-screen relative z-10 bg-gradient-to-b from-neutral-900 to-neutral-950">
                {/* Decorative background grid pattern for right side */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

                {/* Glow effects */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative w-full max-w-md animate-fade-in">
                    {/* Login Box */}
                    <div className="backdrop-blur-xl bg-neutral-900/40 border border-white/[0.06] rounded-3xl w-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] p-8 sm:p-10 relative overflow-hidden">

                        {/* Top Gold Accent strip */}
                        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gold/50 via-gold to-gold/50"></div>

                        {/* Logo & Headings */}
                        <div className="flex flex-col items-center mb-10 text-center">
                            <Link to="/" className="flex items-center gap-2.5 group mb-6 transition-transform duration-300 hover:scale-[1.02]">
                                <img src={logoImg} alt="TitanCore Logo" className='w-25' />
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
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs flex gap-3 items-center mb-6">
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
        </div>
    );
};

export default AdminLogin;
