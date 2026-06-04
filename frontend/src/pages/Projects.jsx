import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Calendar } from 'lucide-react';
import API from '../services/api';
import projectBg from '../assets/project/Project.jpg';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await API.get('/projects');
                if (data.success) {
                    setProjects(data.data);
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Filter projects logic
    const filteredProjects = projects.filter((proj) => {
        const matchesSearch = proj.title.toLowerCase().includes(search.toLowerCase()) ||
            proj.location.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || proj.type === filterType;
        const matchesStatus = filterStatus === 'all' || proj.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const categories = [
        'all',
        'Residential Construction',
        'Commercial Buildings',
        'Renovation',
        'Interior Design',
        'Road Construction',
        'Steel Structure Work',
        'Architecture Planning'
    ];

    return (
        <div className="w-full bg-white text-luxury-text min-h-screen">

            {/* Portfolio Header */}
            <section className="relative pt-46 pb-46 bg-cover bg-center text-white" style={{ backgroundImage: `url(${projectBg})`, backgroundPosition: "center 20%" }}>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block">Bespoke Infrastructure</span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-poppins text-white">
                        Our Latest <span className="text-gold">Projects</span>
                    </h1>
                </div>
            </section>

            {/* Filter and Search Bar */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 justify-between items-center">
                    {/* Search bar */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects or locations..."
                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all text-luxury-text"
                        />
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 items-center justify-center">
                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none text-luxury-text"
                        >
                            <option value="all">All Project Statuses</option>
                            <option value="completed">Completed Projects</option>
                            <option value="ongoing">Ongoing Projects</option>
                        </select>

                        {/* Type Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none text-luxury-text max-w-xs"
                        >
                            <option value="all">All Service Categories</option>
                            {categories.slice(1).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Project Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-luxury-textMuted font-medium text-sm">Fetching projects portfolio...</span>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                            <h3 className="font-bold text-xl text-luxury-text mb-2">No Projects Found</h3>
                            <p className="text-sm text-luxury-textMuted">Try checking your search criteria or toggling active filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((proj) => (
                                <motion.div
                                    key={proj._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-2xl overflow-hidden jetwing-card group flex flex-col justify-between"
                                >
                                    <Link to={`/projects/${proj._id}`} className="block relative aspect-[16/10] overflow-hidden group bg-neutral-900 flex items-center justify-center">
                                        {proj.images && proj.images[0] ? (
                                            <img
                                                src={proj.images[0]}
                                                alt={proj.title}
                                                className="w-full h-full object-cover img-zoom"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-center p-4 select-none">
                                                <svg className="w-8 h-8 text-gold/60 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 21h18M9 21V10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11M5 21V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v15" />
                                                </svg>
                                                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gold/80 block">TitanCore Showcase</span>
                                                <span className="text-[8px] uppercase tracking-widest text-neutral-500 mt-1">Image coming soon</span>
                                            </div>
                                        )}
                                        <div className={`absolute top-4 right-4 text-white font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded shadow-sm z-10 ${proj.status === 'completed' ? 'bg-emerald-500' : 'bg-gold'
                                            }`}>
                                            {proj.status}
                                        </div>
                                    </Link>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold">{proj.type}</span>
                                            <Link to={`/projects/${proj._id}`} className="block mt-1">
                                                <h3 className="text-xl font-bold text-luxury-text jetwing-card-title">{proj.title}</h3>
                                            </Link>
                                            <p className="text-luxury-textMuted text-xs mt-3 leading-relaxed line-clamp-3">
                                                {proj.description}
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 space-y-4">
                                            {/* Progress bar if ongoing */}
                                            {proj.status === 'ongoing' && (
                                                <div>
                                                    <div className="flex justify-between text-[10px] font-bold mb-1">
                                                        <span className="text-luxury-textMuted uppercase tracking-wider">Completion Progress</span>
                                                        <span className="text-gold">{proj.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="bg-gold h-full rounded-full transition-all duration-500" style={{ width: `${proj.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="grid grid-cols-3 gap-2 text-xs text-luxury-textMuted">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} className="text-gold shrink-0" />
                                                    <span className="truncate">{proj.location.split(',')[0]}</span>
                                                </div>
                                                <div className="flex items-center gap-1 justify-center">
                                                    <DollarSign size={12} className="text-gold shrink-0" />
                                                    <span className="font-semibold text-luxury-text">{proj.budget}</span>
                                                </div>
                                                <div className="flex items-center gap-1 justify-end">
                                                    <Calendar size={12} className="text-gold shrink-0" />
                                                    <span>{proj.timeline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
};

export default Projects;
