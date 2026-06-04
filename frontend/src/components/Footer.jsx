import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    return (
        <footer className="bg-[#0e0e0e] border-t border-white/10 pt-16 pb-8 text-neutral-400 font-inter">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                {/* Company Info */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <img src="src\assets\logo.png" alt="" className="h-12 w-auto object-contain" />
                        <div>
                            <span className="text-xl font-bold tracking-wider text-white block leading-none font-poppins">
                                TitanCore
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mt-0.5">
                                Construction
                            </span>
                        </div>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed mt-2 font-light">
                        We build more than structures, we build trust. Delivering high-end residential, commercial, and structural engineering projects with precision and speed.
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-black hover:border-gold flex items-center justify-center transition-all duration-300">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                            </svg>
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-black hover:border-gold flex items-center justify-center transition-all duration-300">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-black hover:border-gold flex items-center justify-center transition-all duration-300">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                            </svg>
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-black hover:border-gold flex items-center justify-center transition-all duration-300">
                            <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold text-white text-base tracking-wider uppercase mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold font-poppins">
                        Quick Links
                    </h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li>
                            <Link to="/about" className="text-neutral-400 hover:text-gold transition-colors font-light">
                                Company History
                            </Link>
                        </li>
                        <li>
                            <Link to="/services" className="text-neutral-400 hover:text-gold transition-colors font-light">
                                Our Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/projects" className="text-neutral-400 hover:text-gold transition-colors font-light">
                                Featured Projects
                            </Link>
                        </li>
                        <li>
                            <Link to="/careers" className="text-neutral-400 hover:text-gold transition-colors font-light">
                                Careers
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="font-bold text-white text-base tracking-wider uppercase mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold font-poppins">
                        Get In Touch
                    </h3>
                    <ul className="flex flex-col gap-4 text-sm text-neutral-400 font-light">
                        <li className="flex items-start gap-3">
                            <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                            <span>No. 45, TitanCore Plaza, Galle Road, Colombo 03, Sri Lanka</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-gold shrink-0" />
                            <span>+94788788208</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-gold shrink-0" />
                            <span>sangeetht274@gmail.com</span>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="font-bold text-white text-base tracking-wider uppercase mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold font-poppins">
                        Newsletter
                    </h3>
                    <p className="text-neutral-400 text-sm mb-4 leading-relaxed font-light">
                        Subscribe to receive construction industry updates and our seasonal project showcases.
                    </p>
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="w-full bg-white/5 border border-white/10 focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-lg py-3 pl-4 pr-12 text-sm outline-none transition-all text-white font-light placeholder-neutral-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-gold hover:bg-gold-dark text-black flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <Send size={14} className="text-white" />
                            </button>
                        </div>
                        {subscribed && (
                            <span className="text-xs text-green-400 font-semibold mt-1">
                                Subscribed successfully! Thank you.
                            </span>
                        )}
                    </form>
                </div>

            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
                <span>© {new Date().getFullYear()} TitanCore Construction. All Rights Reserved.</span>

            </div>
        </footer>
    );
};

export default Footer;
