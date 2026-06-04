import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, ArrowLeft, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import API from '../services/api';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [inquirySubmitted, setInquirySubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const { data } = await API.get(`/projects/${id}`);
                if (data.success) {
                    setProject(data.data);
                }
            } catch (err) {
                console.error('Error fetching project detail:', err);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);

    const handleSubmitInquiry = async (e) => {
        e.preventDefault();
        try {
            await API.post('/messages', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: `Project Estimate Inquiry: ${project?.title}`,
                message: formData.message || `I am interested in a construction budget assessment resembling the ${project?.title} project.`,
            });
            setInquirySubmitted(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            console.error('Error sending inquiry:', err);
            alert('Failed to send callback request. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <span className="text-luxury-textMuted font-medium text-sm">Loading project details...</span>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
                <h2 className="text-3xl font-bold text-luxury-text">Project Not Found</h2>
                <Link to="/projects" className="text-gold font-bold flex items-center justify-center gap-2 mt-4 hover:underline">
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-white text-luxury-text min-h-screen">
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-8">

                {/* Navigation Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-textMuted">
                    <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                    <ChevronRight size={10} />
                    <Link to="/projects" className="hover:text-gold transition-colors">Projects</Link>
                    <ChevronRight size={10} />
                    <span className="text-gold font-bold">{project.title}</span>
                </div>

                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-luxury-text hover:text-gold font-semibold text-sm transition-colors mb-6 cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back to Projects Portfolio
                </Link>

                {/* Project Header */}
                <div className="mb-10">
                    <span className="text-xs uppercase font-bold tracking-widest text-gold">{project.type}</span>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight font-poppins mt-2 text-luxury-text">
                        {project.title}
                    </h1>
                    <div className="flex items-center gap-2 text-luxury-textMuted text-sm mt-3">
                        <span>📍 {project.location}</span>
                    </div>
                </div>

                {/* Project Core Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Image Slideshow & Description */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Image */}
                        <div className="aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden shadow-md">
                            <img
                                src={project.images[activeImage] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000'}
                                alt={project.title}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                        </div>

                        {/* Thumbnail selector */}
                        {project.images.length > 1 && (
                            <div className="flex gap-4">
                                {project.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-24 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeImage === idx ? 'border-gold shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Project Overview */}
                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <h3 className="text-2xl font-bold tracking-tight mb-4 font-poppins">Project Overview</h3>
                            <p className="text-luxury-textMuted leading-relaxed text-base">
                                {project.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Parameters and Estimation Inquiry */}
                    <div className="space-y-8">
                        {/* Spec Card */}
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
                            <h3 className="font-bold text-lg border-b border-gray-200 pb-3">Project Details</h3>

                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div>
                                    <span className="text-luxury-textMuted block text-xs uppercase font-semibold">Budget Allocation</span>
                                    <div className="flex items-center gap-1 mt-1 font-bold text-luxury-text">
                                        <DollarSign size={16} className="text-gold shrink-0" />
                                        <span>{project.budget}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-luxury-textMuted block text-xs uppercase font-semibold">Time Horizon</span>
                                    <div className="flex items-center gap-1 mt-1 font-bold text-luxury-text">
                                        <Calendar size={16} className="text-gold shrink-0" />
                                        <span>{project.timeline}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-luxury-textMuted block text-xs uppercase font-semibold">Construction Status</span>
                                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider mt-2.5 text-white ${project.status === 'completed' ? 'bg-emerald-500' : 'bg-gold'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-luxury-textMuted block text-xs uppercase font-semibold">Location Region</span>
                                    <span className="font-bold text-luxury-text block mt-1.5 truncate">{project.location.split(',')[0]}</span>
                                </div>
                            </div>

                            {/* Progress bar if ongoing */}
                            {project.status === 'ongoing' && (
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className="text-luxury-textMuted uppercase tracking-wider">Completion Progress</span>
                                        <span className="text-gold">{project.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="bg-gold h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Booking Sidebar form */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="font-bold text-lg mb-2 font-poppins">Request Similar Project</h3>
                            <p className="text-xs text-luxury-textMuted mb-6 leading-relaxed">
                                Connect with our scheduling desk to design, budget, and estimate a similar project structure.
                            </p>

                            {inquirySubmitted ? (
                                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-xl text-center space-y-3">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                                    <h4 className="font-bold text-sm">Request Submitted</h4>
                                    <p className="text-xs text-emerald-700">An estimation consultant will call you back within 24 business hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. John Doe"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-xs outline-none text-luxury-text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="e.g. john@company.com"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-xs outline-none text-luxury-text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="e.g. +1 (555) 0123"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-xs outline-none text-luxury-text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Custom Notes</label>
                                        <textarea
                                            rows="3"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Specify size, location parameters..."
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-xs outline-none text-luxury-text resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                                    >
                                        Send Callback Request
                                        <Send size={12} />
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ProjectDetail;
