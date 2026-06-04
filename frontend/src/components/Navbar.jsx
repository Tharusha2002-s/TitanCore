import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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
        if (isActive) {
            return 'text-gold border-b-2 border-gold font-bold uppercase tracking-wider text-xs py-1 px-1 transition-all';
        }
        return `font-bold uppercase tracking-wider text-xs py-1 px-1 transition-all luxury-underline ${
            isScrolled ? 'text-neutral-800 hover:text-gold' : 'text-white hover:text-gold'
        }`;
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md'
                : 'bg-transparent'
                }`}
        >
            {/* Top Contact Bar */}
            <div className={`py-1.5 text-[11px] select-none hidden lg:block transition-colors duration-500 ${
                isScrolled ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-end items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <span className="text-gold font-medium">Email:</span>
                        <a href="mailto:sangeetht274@gmail.com" className={`transition-colors font-medium duration-500 ${isScrolled ? 'text-neutral-800 hover:text-gold' : 'text-neutral-300 hover:text-gold'}`}>
                            sangeetht274@gmail.com
                        </a>
                    </div>
                    <span className={`transition-colors duration-500 ${isScrolled ? 'text-neutral-200' : 'text-neutral-800'}`}>|</span>
                    <a href="tel:+94788788208" className={`flex items-center gap-1.5 transition-colors font-medium duration-500 ${isScrolled ? 'text-neutral-800 hover:text-gold' : 'text-neutral-300 hover:text-gold'}`}>
                        <Phone size={11} className="text-gold" />
                        Call Us
                    </a>
                </div>
            </div>

            <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500 lg:mt-3 ${
                isScrolled ? 'py-3' : 'py-4'
            }`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img src={logoImg} alt="TitanCore Logo" className="h-15 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                    <div>
                        <span className={`text-xl font-bold tracking-wider block leading-none transition-colors duration-500 ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
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

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`lg:hidden transition-colors duration-500 ${
                        isScrolled ? 'text-neutral-800 hover:text-gold' : 'text-white/95 hover:text-gold'
                    }`}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="lg:hidden fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-neutral-950/95 backdrop-blur-md z-40 px-6 py-8 flex flex-col gap-6 overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-xl font-bold uppercase tracking-wider text-white/90 hover:text-gold transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
