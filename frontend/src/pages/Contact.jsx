import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import API from '../services/api';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
    });

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/messages', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error('Error submitting message:', err);
            alert('Failed to send query message. Please try again.');
        }
    };

    return (
        <div className="w-full bg-white text-luxury-text min-h-screen">

            {/* Page Header */}
            <section className="relative pt-46 pb-46 bg-cover bg-center text-white " style={{ backgroundImage: `url(src/assets/contact/contact.jpg)`, backgroundPosition: "center 20%" }}>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block">Connect With Us</span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-poppins text-white">
                        Contact Our <span className="text-gold">Offices</span>
                    </h1>
                </div>
            </section>

            {/* Main Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left Column: Details & Map */}
                    <div className="space-y-10">
                        <div>
                            <span className="text-xs uppercase tracking-wider text-gold font-bold">Contact Directory</span>
                            <h2 className="text-3xl font-bold tracking-tight mt-2 mb-4 font-poppins">Get in Touch</h2>
                            <p className="text-sm text-luxury-textMuted leading-relaxed">
                                Connect with our scheduling desk, billing department, or engineering consultants. Reach out directly or complete the form.
                            </p>
                        </div>

                        {/* Core Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                            <div className="flex gap-4 items-start p-5 bg-gray-50/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <MapPin size={22} className="text-gold shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold mb-1">Corporate HQ</h4>
                                    <p className="text-xs text-luxury-textMuted leading-relaxed">No. 45, TitanCore Plaza, Galle Road, Colombo 03, Sri Lanka</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start p-5 bg-gray-50/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <Clock size={22} className="text-gold shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold mb-1">Business Hours</h4>
                                    <p className="text-xs text-luxury-textMuted">Monday - Friday<br />8:00 AM - 6:00 PM EST</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start p-5 bg-gray-50/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <Phone size={22} className="text-gold shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold mb-1">Phone Desk</h4>
                                    <p className="text-xs text-luxury-textMuted">Primary: +94788788208<br />WhatsApp: +94788788208</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start p-5 bg-gray-50/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <Mail size={22} className="text-gold shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold mb-1">Email Support</h4>
                                    <p className="text-xs text-luxury-textMuted">sangeetht274@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact form */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col justify-center">
                        <h3 className="font-bold text-2xl mb-2 font-poppins">Send a Message</h3>
                        <p className="text-sm text-luxury-textMuted mb-8 leading-relaxed">
                            Have a project question? Complete our secure communication form to initiate contact.
                        </p>

                        {submitted ? (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-8 rounded-2xl text-center space-y-3">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                                <h4 className="font-bold text-base">Message Sent Successfully</h4>
                                <p className="text-xs text-emerald-700">We appreciate you contacting TitanCore Construction. A structural consultant will email you back within 12 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleMessageSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5 text-luxury-textMuted uppercase">Your Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Elena Rostova"
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-3 text-sm outline-none text-luxury-text transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1.5 text-luxury-textMuted uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="e.g. elena@company.com"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-3 text-sm outline-none text-luxury-text transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1.5 text-luxury-textMuted uppercase">Phone (Optional)</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="e.g. +1 (555) 0123"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-3 text-sm outline-none text-luxury-text transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1.5 text-luxury-textMuted uppercase">Select Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-3 text-sm outline-none text-luxury-text"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Residential Estimation">Residential Estimation</option>
                                        <option value="Commercial Development">Commercial Development</option>
                                        <option value="Drywall/Worker Sourcing">Drywall / Worker Sourcing</option>
                                        <option value="Career & Internships">Careers & Internships</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1.5 text-luxury-textMuted uppercase">Your Message</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Type details of your request here..."
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-3 text-sm outline-none text-luxury-text resize-none transition-all"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                                >
                                    Send Query Message
                                    <Send size={14} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;
