import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
    const { isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal, login, register, loginWithGoogle } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Clear states when modal toggles or opens/closes
    useEffect(() => {
        setEmail('');
        setPassword('');
        setName('');
        setErrMsg('');
        setShowPassword(false);
    }, [isAuthModalOpen, authModalTab]);

    // Google Sign In integration
    useEffect(() => {
        if (isAuthModalOpen && window.google) {
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1089201934988-n9a2g6ldv7o33v2u6o1o123456789abc.apps.googleusercontent.com';
            try {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: async (response) => {
                        setErrMsg('');
                        setIsSubmitting(true);
                        const result = await loginWithGoogle(response.credential);
                        setIsSubmitting(false);
                        if (result.success) {
                            closeAuthModal();
                        } else {
                            setErrMsg(result.message);
                        }
                    }
                });

                setTimeout(() => {
                    const loginBtnDiv = document.getElementById('google-login-btn');
                    if (loginBtnDiv) {
                        window.google.accounts.id.renderButton(loginBtnDiv, {
                            theme: 'outline',
                            size: 'large',
                            width: 320,
                            shape: 'rectangular',
                            text: 'signin_with',
                        });
                    }

                    const registerBtnDiv = document.getElementById('google-register-btn');
                    if (registerBtnDiv) {
                        window.google.accounts.id.renderButton(registerBtnDiv, {
                            theme: 'outline',
                            size: 'large',
                            width: 320,
                            shape: 'rectangular',
                            text: 'signup_with',
                        });
                    }
                }, 150);
            } catch (err) {
                console.error('Google client initialization error:', err);
            }
        }
    }, [isAuthModalOpen, authModalTab]);

    if (!isAuthModalOpen) return null;

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrMsg('');
        setIsSubmitting(true);

        const result = await login(email, password);
        setIsSubmitting(false);

        if (result.success) {
            closeAuthModal();
        } else {
            setErrMsg(result.message);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrMsg('');
        setIsSubmitting(true);

        const result = await register({
            name,
            email,
            password,
            role: 'user', // only registers standard clients
        });
        setIsSubmitting(false);

        if (result.success) {
            closeAuthModal();
        } else {
            setErrMsg(result.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
                onClick={closeAuthModal}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-row w-full max-w-4xl h-[620px] max-h-[90vh] border border-gray-100/50 transform transition-all duration-300 scale-100 z-10 animate-scale-up">

                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition-colors z-20 cursor-pointer"
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                {/* LEFT SIDE: Premium Brand Image */}
                <div className="w-1/2 h-full relative overflow-hidden hidden md:block select-none">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000"
                        alt="Luxury Architectural Structure"
                        className="w-full h-full object-cover"
                    />
                    {/* Rich luxury gold-tinted dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gold/10 mix-blend-color"></div>

                    {/* Branding Content Overlay */}
                    <div className="absolute inset-0 p-12 flex flex-col justify-between text-white z-10">
                        <div>
                            <div className="flex items-center gap-2">
                                <img src="src\assets\logo.png" alt="" className="h-12 w-auto object-contain" />

                                <div>
                                    <span className="font-poppins font-bold tracking-wider block text-sm">TITANCORE</span>
                                    <span className="text-[9px] uppercase font-bold tracking-widest text-gold mt-0.5">Construction</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-3xl font-bold font-poppins leading-tight">
                                Shaping the Skyline with <span className="text-gold">Precision</span>
                            </h3>
                            <p className="text-xs text-gray-300 font-light leading-relaxed max-w-sm">
                                Join our premium ecosystem to manage architectural plans, browse luxury residential builds, and trace high-end project budgets.
                            </p>

                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Authentication Form */}
                <div className="w-full md:w-1/2 h-full p-8 sm:p-12 flex flex-col justify-center bg-white relative font-inter">
                    {errMsg && (
                        <div className="absolute top-8 left-8 right-8 bg-red-50 border border-red-100 text-red-700 p-3.5 rounded-xl text-xs flex gap-2.5 items-center z-10 animate-shake">
                            <AlertCircle size={16} className="shrink-0 text-red-500" />
                            <p className="font-semibold">{errMsg}</p>
                        </div>
                    )}

                    {authModalTab === 'login' ? (
                        /* LOGIN TAB */
                        <div className="animate-fade-in space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-luxury-text font-poppins">Welcome Back</h2>
                                <p className="text-xs text-luxury-textMuted mt-1">Sign in to access your client dashboard.</p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold mb-1.5 text-luxury-textMuted uppercase tracking-wider">Email Address</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="e.g. name@company.com"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl py-3 pl-10 pr-4 text-xs outline-none text-luxury-text transition-all duration-300"
                                        />
                                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors duration-300" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-[10px] font-bold text-luxury-textMuted uppercase tracking-wider">Password</label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl py-3 pl-10 pr-12 text-xs outline-none text-luxury-text transition-all duration-300"
                                        />
                                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors duration-300" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-luxury-text transition-colors duration-300"
                                        >
                                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3.5 rounded-xl shadow-md shadow-gold/10 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-6"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Sign In to Account
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="relative flex py-1 items-center my-1.5">
                                <div className="flex-grow border-t border-gray-150"></div>
                                <span className="flex-shrink mx-4 text-[9px] text-gray-400 uppercase tracking-widest">Or Sign In With</span>
                                <div className="flex-grow border-t border-gray-150"></div>
                            </div>

                            <div className="flex justify-center w-full mb-3">
                                <div id="google-login-btn"></div>
                            </div>

                            <div className="border-t border-gray-100 pt-5 text-center text-xs text-luxury-textMuted">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => openAuthModal('register')}
                                    className="text-gold font-bold hover:underline bg-transparent border-none cursor-pointer p-0"
                                >
                                    Register here
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* REGISTER TAB */
                        <div className="animate-fade-in space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-luxury-text font-poppins">Register Client</h2>
                                <p className="text-xs text-luxury-textMuted mt-1">Get started with our luxury construction site.</p>
                            </div>

                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold mb-1.5 text-luxury-textMuted uppercase tracking-wider">Full Name</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. John Doe"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none text-luxury-text transition-all duration-300"
                                        />
                                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors duration-300" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold mb-1.5 text-luxury-textMuted uppercase tracking-wider">Email Address</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="e.g. john@company.com"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none text-luxury-text transition-all duration-300"
                                        />
                                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors duration-300" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold mb-1.5 text-luxury-textMuted uppercase tracking-wider">Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="•••••••• (Min. 6 characters)"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl py-2.5 pl-10 pr-12 text-xs outline-none text-luxury-text transition-all duration-300"
                                        />
                                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors duration-300" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-luxury-text transition-colors duration-300"
                                        >
                                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3.5 rounded-xl shadow-md shadow-gold/10 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-6"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Register Account
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="relative flex py-1 items-center my-1.5">
                                <div className="flex-grow border-t border-gray-150"></div>
                                <span className="flex-shrink mx-4 text-[9px] text-gray-400 uppercase tracking-widest">Or Register With</span>
                                <div className="flex-grow border-t border-gray-150"></div>
                            </div>

                            <div className="flex justify-center w-full mb-3">
                                <div id="google-register-btn"></div>
                            </div>

                            <div className="border-t border-gray-100 pt-5 text-center text-xs text-luxury-textMuted">
                                Already have an account?{' '}
                                <button
                                    onClick={() => openAuthModal('login')}
                                    className="text-gold font-bold hover:underline bg-transparent border-none cursor-pointer p-0"
                                >
                                    Login here
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AuthModal;
