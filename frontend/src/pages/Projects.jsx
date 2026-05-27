import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Calendar } from 'lucide-react';
import API from '../services/api';

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
                console.error('Error fetching projects, loading mock portfolio...');
                setProjects([
                    { _id: '1', title: 'Skyline Residences', type: 'Residential Construction', status: 'completed', budget: '$12.5M', location: 'New York, USA', description: 'A 24-story residential tower offering premium glass facades, modern amenities, and integrated solar cladding for self-sustained energy.', progress: 100, images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], timeline: '24 Months' },
                    { _id: '2', title: 'Green Valley Complex', type: 'Residential Construction', status: 'ongoing', budget: '$8.2M', location: 'California, USA', description: 'A collection of eco-friendly luxury townhouses integrated with smart home IoT networks and localized greywater filtration systems.', progress: 72, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], timeline: '18 Months' },
                    { _id: '3', title: 'Modern Office Tower', type: 'Commercial Buildings', status: 'completed', budget: '$45.0M', location: 'Texas, USA', description: 'State of the art column-free workspace tower employing high-strength composite steel trusses and LEED platinum HVAC frameworks.', progress: 100, images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'], timeline: '36 Months' },
                    { _id: '4', title: 'City Center Mall', type: 'Commercial Buildings', status: 'ongoing', budget: '$22.0M', location: 'Miami, Florida', description: 'A retail hub hosting over 120 luxury brands, featuring a giant 200m custom glass dome roof and smart geothermal climate control.', progress: 65, images: ['https://images.unsplash.com/photo-1555636222-cae831e87094?w=800'], timeline: '20 Months' },
                    { _id: '5', title: 'Highway Viaduct Bridge', type: 'Road Construction', status: 'ongoing', budget: '$32.0M', location: 'Atlanta, Georgia', description: 'An advanced prestressed concrete segmental flyover bridge bridging crucial city transit arteries to reduce peak congestion by 40%.', progress: 80, images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'], timeline: '15 Months' },
                    { _id: '6', title: 'Steel Fabrication Hub', type: 'Steel Structure Work', status: 'completed', budget: '$14.0M', location: 'Ohio, USA', description: 'High-strength steel framing manufacturing plant containing computerized CNC plasma cutters and advanced girder welders.', progress: 100, images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=800'], timeline: '10 Months' }
                ]);
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
            <section className="relative pt-36 pb-24 bg-cover bg-center text-white" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600')` }}>
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
            <section className="py-8 bg-white border-b border-gray-100">
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
                                    className="bg-white border border-gray-150/60 hover:border-gold/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                >
                                    <Link to={`/projects/${proj._id}`} className="block relative aspect-[16/10] overflow-hidden group">
                                        <img
                                            src={proj.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'}
                                            alt={proj.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className={`absolute top-4 right-4 text-white font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${proj.status === 'completed' ? 'bg-emerald-500' : 'bg-gold'
                                            }`}>
                                            {proj.status}
                                        </div>
                                    </Link>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold">{proj.type}</span>
                                            <Link to={`/projects/${proj._id}`} className="block mt-1">
                                                <h3 className="text-xl font-bold text-luxury-text hover:text-gold transition-colors">{proj.title}</h3>
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
