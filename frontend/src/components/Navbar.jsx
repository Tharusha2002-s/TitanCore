import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hammer, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout, openAuthModal } = useAuth();
    const location = useLocation();

    // Watch scroll positions
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile drawer on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Projects', path: '/projects' },
        { name: 'Careers', path: '/careers' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    const activeLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return isActive
            ? 'text-gold border-b-2 border-gold font-medium py-1 px-1 transition-all'
            : 'text-white hover:text-gold luxury-underline py-1 px-1 transition-all';
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
                ? 'bg-neutral-950/90 backdrop-blur-md shadow-md py-4 border-b border-white/5'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img src={logoImg} alt="TitanCore Logo" className="h-15 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                    <div>
                        <span className="text-xl font-bold tracking-wider text-white block leading-none">
                            TitanCore
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mt-0.5">
                            Construction
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className={activeLinkStyle(link.path)}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 text-white/95 hover:text-gold transition-colors font-medium cursor-pointer"
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-gold object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold">
                                        <User size={16} />
                                    </div>
                                )}
                                <span className="text-sm max-w-[100px] truncate">{user.name}</span>
                                <ChevronDown size={14} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-neutral-900 border border-white/10 rounded-lg shadow-xl py-2 z-50">
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => openAuthModal('login')}
                            className="text-white/95 hover:text-gold transition-colors font-medium text-sm flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                        >
                            <User size={16} />
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-white/95 hover:text-gold transition-colors"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="lg:hidden fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-neutral-950/95 backdrop-blur-md z-40 px-6 py-8 flex flex-col justify-between overflow-y-auto border-t border-white/10">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-xl font-medium text-white/90 hover:text-gold transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-gold" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center border border-gold">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-white">{user.name}</h4>
                                        <span className="text-xs uppercase text-gold font-bold tracking-wider">{user.role}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="w-full text-center border border-red-500/20 text-red-400 hover:bg-red-500/10 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => openAuthModal('login')}
                                className="w-full text-center border border-white/15 text-white hover:bg-white/5 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 bg-transparent cursor-pointer"
                            >
                                <User size={16} />
                                Login / Register
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
