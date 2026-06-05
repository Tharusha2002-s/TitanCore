import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Hammer, Briefcase, FileText, Mail, Plus, Trash2, Edit3, Check, X,
    TrendingUp, Settings, BarChart2, ShieldCheck, LogOut, CheckCircle2, ChevronRight,
    Image, Loader2, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API, { getImageUrl } from '../services/api';
import adminAvatar from '../assets/admin/avatar.jpg';
import logoImg from '../assets/logo.png';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('metrics');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

        // Database lists
    const [projects, setProjects] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [projectForm, setProjectForm] = useState({
        title: '', type: 'Residential Construction', status: 'ongoing', budget: '', location: '', description: '', progress: '', images: '', timelineValue: '', timelineUnit: 'Months'
    });
    
    // Inline editing states for projects
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editForm, setEditForm] = useState({
        status: 'ongoing',
        progress: '',
        timelineValue: '',
        timelineUnit: 'Months'
    });
    const [jobForm, setJobForm] = useState({
        title: '', description: '', requirements: '', salaryMin: '', salaryMax: '', salaryPeriod: 'year', type: 'Full-time', location: 'On-site'
    });

    const [uploadingProjImages, setUploadingProjImages] = useState(false);
    const [projectImagePreviews, setProjectImagePreviews] = useState([]);

    const [galleryForm, setGalleryForm] = useState({
        title: '', category: 'residential', url: ''
    });
    const [uploadingGalleryImg, setUploadingGalleryImg] = useState(false);
    const [galleryImagePreview, setGalleryImagePreview] = useState('');

    const fetchDashboardData = async () => {
        try {
            const resProj = await API.get('/projects');
            if (resProj.data?.success) setProjects(resProj.data.data);

            const resJobs = await API.get('/jobs');
            if (resJobs.data?.success) setJobs(resJobs.data.data);

            const resApps = await API.get('/applications');
            if (resApps.data?.success) setApplications(resApps.data.data);

            const resMsgs = await API.get('/messages');
            if (resMsgs.data?.success) setMessages(resMsgs.data.data);

            const resGallery = await API.get('/gallery');
            if (resGallery.data?.success) setGalleryItems(resGallery.data.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setProjects([]);
            setJobs([]);
            setApplications([]);
            setMessages([]);
            setGalleryItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/admin/login');
        } else if (user.role === 'admin') {
            fetchDashboardData();
        }
    }, [user, navigate]);

    // Project managers
    const handleProjectCreate = async (e) => {
        e.preventDefault();
        try {
            const imgArray = projectForm.images ? projectForm.images.split(',').map((img) => img.trim()) : [];
            const payload = {
                title: projectForm.title,
                type: projectForm.type,
                status: projectForm.status,
                budget: `$${projectForm.budget}M`,
                location: projectForm.location,
                description: projectForm.description,
                progress: projectForm.progress === '' ? 0 : Number(projectForm.progress),
                images: imgArray,
                timeline: `${projectForm.timelineValue} ${projectForm.timelineUnit}`
            };
            await API.post('/projects', payload);
            setProjectForm({ title: '', type: 'Residential Construction', status: 'ongoing', budget: '', location: '', description: '', progress: '', images: '', timelineValue: '', timelineUnit: 'Months' });
            setProjectImagePreviews([]);
            fetchDashboardData();
        } catch (e) {
            console.error('Error creating project:', e);
            alert('Failed to create project. Please try again.');
        }
    };

    const handleStartEdit = (proj) => {
        setEditingProjectId(proj._id);
        
        let val = '';
        let unit = 'Months';
        if (proj.timeline) {
            const parts = proj.timeline.split(' ');
            if (parts.length >= 2) {
                val = parts[0];
                unit = parts[1];
            } else {
                val = proj.timeline;
            }
        }
        
        setEditForm({
            status: proj.status,
            progress: proj.progress,
            timelineValue: val,
            timelineUnit: unit
        });
    };

    const handleInlineSave = async (id) => {
        try {
            const payload = {
                status: editForm.status,
                progress: editForm.progress === '' ? 0 : Number(editForm.progress),
                timeline: `${editForm.timelineValue} ${editForm.timelineUnit}`
            };
            await API.put(`/projects/${id}`, payload);
            setEditingProjectId(null);
            fetchDashboardData();
        } catch (err) {
            console.error('Error updating project inline:', err);
            alert('Failed to update project. Please try again.');
        }
    };

    const handleProjectDelete = async (id) => {
        if (window.confirm('Delete this project?')) {
            try {
                await API.delete(`/projects/${id}`);
                fetchDashboardData();
            } catch (e) {
                console.error('Error deleting project:', e);
                alert('Failed to delete project. Please try again.');
            }
        }
    };

    const handleProjectImagesUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingProjImages(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            const { data } = await API.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                const uploadedPaths = data.filePaths || [data.filePath];
                setProjectForm(prev => ({
                    ...prev,
                    images: uploadedPaths.join(',')
                }));
                setProjectImagePreviews(uploadedPaths);
            }
        } catch (err) {
            console.error('Error uploading images:', err);
            alert('Failed to upload images. Please try again.');
        } finally {
            setUploadingProjImages(false);
        }
    };

    const handleGalleryImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingGalleryImg(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await API.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                setGalleryForm(prev => ({
                    ...prev,
                    url: data.filePath
                }));
                setGalleryImagePreview(data.filePath);
            }
        } catch (err) {
            console.error('Error uploading gallery image:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingGalleryImg(false);
        }
    };

    const handleGalleryCreate = async (e) => {
        e.preventDefault();
        if (!galleryForm.url) {
            alert('Please upload an image first.');
            return;
        }
        try {
            await API.post('/gallery', galleryForm);
            setGalleryForm({ title: '', category: 'residential', url: '' });
            setGalleryImagePreview('');
            fetchDashboardData();
        } catch (err) {
            console.error('Error creating gallery item:', err);
            alert('Failed to create gallery item. Please try again.');
        }
    };

    const handleGalleryDelete = async (id) => {
        if (window.confirm('Delete this gallery item?')) {
            try {
                await API.delete(`/gallery/${id}`);
                fetchDashboardData();
            } catch (err) {
                console.error('Error deleting gallery item:', err);
                alert('Failed to delete gallery item. Please try again.');
            }
        }
    };


    // Job managers
    const handleJobCreate = async (e) => {
        e.preventDefault();
        try {
            const reqArray = jobForm.requirements ? jobForm.requirements.split(',').map((r) => r.trim()) : [];
            const formatSalary = (val) => {
                const num = Number(val);
                return isNaN(num) ? val : num.toLocaleString();
            };
            const salaryStr = `$${formatSalary(jobForm.salaryMin)} - $${formatSalary(jobForm.salaryMax)} / ${jobForm.salaryPeriod}`;
            await API.post('/jobs', { 
                title: jobForm.title, 
                description: jobForm.description, 
                requirements: reqArray, 
                salary: salaryStr, 
                type: jobForm.type, 
                location: jobForm.location 
            });
            setJobForm({ title: '', description: '', requirements: '', salaryMin: '', salaryMax: '', salaryPeriod: 'year', type: 'Full-time', location: 'On-site' });
            fetchDashboardData();
        } catch (e) {
            console.error('Error creating job:', e);
            alert('Failed to create job posting. Please try again.');
        }
    };

    const handleJobDelete = async (id) => {
        if (window.confirm('Delete this job posting?')) {
            try {
                await API.delete(`/jobs/${id}`);
                fetchDashboardData();
            } catch (e) {
                console.error('Error deleting job:', e);
                alert('Failed to delete job posting. Please try again.');
            }
        }
    };

    // App handlers
    const handleAppStatusChange = async (appId, newStatus) => {
        try {
            await API.put(`/applications/${appId}`, { status: newStatus });
            fetchDashboardData();
        } catch (e) {
            console.error('Error updating application status:', e);
            alert('Failed to update application status. Please try again.');
        }
    };

    // Message handlers
    const handleMessageRead = async (msgId) => {
        try {
            await API.put(`/messages/${msgId}`, { status: 'Read' });
            fetchDashboardData();
        } catch (e) {
            console.error('Error reading message:', e);
            alert('Failed to update message status. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <span className="text-luxury-textMuted font-medium text-sm">Opening administration portal...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row text-white font-inter">

            {/* Mobile Top Navigation Header */}
            <div className="flex md:hidden items-center justify-between p-4 bg-[#111111] border-b border-white/5 sticky top-0 z-30 w-full shrink-0">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={logoImg} alt="Logo image" className="w-8 h-auto" />
                        <div>
                            <span className="font-bold tracking-wider block text-xs font-poppins">Admin Panel</span>
                            <span className="text-[8px] uppercase font-bold tracking-widest text-gold mt-0.5">TitanCore HQ</span>
                        </div>
                    </div>
                </div>
                <img src={user?.avatar && !user.avatar.includes('unsplash') ? user.avatar : adminAvatar} alt="Admin" className="w-8 h-8 rounded-full border border-gold object-cover shadow-sm" />
            </div>

            {/* Mobile Sidebar Backdrop Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-luxury-darkBg text-white flex flex-col justify-between p-6 border-r border-white/5 transition-transform duration-300 ease-in-out transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:relative md:translate-x-0 md:flex shrink-0`}
            >
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                        <div className="flex items-center gap-2">
                            <img src={logoImg} alt="Logo image" className="w-16 h-auto" />
                            <div>
                                <span className="font-bold tracking-wider block text-sm font-poppins">Admin Panel</span>
                                <span className="text-[9px] uppercase font-bold tracking-widest text-gold mt-0.5">TitanCore HQ</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1.5 md:hidden text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {[
                            { id: 'metrics', label: 'Dashboard Home', icon: <BarChart2 size={16} /> },
                            { id: 'projects', label: 'Manage Projects', icon: <Hammer size={16} /> },
                            { id: 'gallery', label: 'Manage Gallery', icon: <Image size={16} /> },
                            { id: 'jobs', label: 'Career Listings', icon: <Briefcase size={16} /> },
                            { id: 'applications', label: 'Applications', icon: <FileText size={16} /> },
                            { id: 'messages', label: 'Inbox Messages', icon: <Mail size={16} /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab.id
                                    ? 'bg-gold text-black shadow-lg shadow-gold/10'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={() => {
                        logout();
                        setIsSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full cursor-pointer"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </aside>

            {/* Main Body */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full max-w-full md:max-w-[calc(100vw-256px)]">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-5">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-poppins">Console Dashboard</h1>
                        <p className="text-xs text-neutral-400 mt-1">Logged in as Systems Administrator.</p>
                    </div>

                    <img src={user?.avatar && !user.avatar.includes('unsplash') ? user.avatar : adminAvatar} alt="Admin" className="w-12 h-12 rounded-full border-2 border-gold object-cover shadow-sm" />
                </div>

                {/* METRICS / MAIN HOME TAB */}
                {activeTab === 'metrics' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { title: 'Total Projects', count: projects.length, icon: <Hammer size={18} className="text-gold" />, bg: 'bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md' },
                                { title: 'Gallery Items', count: galleryItems.length, icon: <Image size={18} className="text-gold" />, bg: 'bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md' },
                                { title: 'Open Listings', count: jobs.length, icon: <Briefcase size={18} className="text-gold" />, bg: 'bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md' },
                                { title: 'Pending Resumes', count: applications.filter(a => a.status === 'Pending').length, icon: <FileText size={18} className="text-gold" />, bg: 'bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md' },
                                { title: 'Unread Messages', count: messages.filter(m => m.status === 'Unread').length, icon: <Mail size={18} className="text-gold" />, bg: 'bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md' }
                            ].map((card) => (
                                <div key={card.title} className={`${card.bg} p-6 rounded-2xl shadow-sm flex items-center justify-between`}>
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-neutral-400">{card.title}</span>
                                        <span className="text-3xl font-bold block mt-1 text-white">{card.count}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                                        {card.icon}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick action shortcuts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-white font-poppins">Quick Links Console</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <button onClick={() => setActiveTab('projects')} className="bg-neutral-950/30 hover:bg-gold/5 border border-white/[0.08] hover:border-gold/50 p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all text-white cursor-pointer">Add Projects</button>
                                    <button onClick={() => setActiveTab('gallery')} className="bg-neutral-950/30 hover:bg-gold/5 border border-white/[0.08] hover:border-gold/50 p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all text-white cursor-pointer">Manage Gallery</button>
                                    <button onClick={() => setActiveTab('jobs')} className="bg-neutral-950/30 hover:bg-gold/5 border border-white/[0.08] hover:border-gold/50 p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all text-white cursor-pointer">Post Careers</button>
                                    <button onClick={() => setActiveTab('applications')} className="bg-neutral-950/30 hover:bg-gold/5 border border-white/[0.08] hover:border-gold/50 p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all text-white cursor-pointer">Review Resumes</button>
                                    <button onClick={() => setActiveTab('messages')} className="bg-neutral-950/30 hover:bg-gold/5 border border-white/[0.08] hover:border-gold/50 p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all text-white cursor-pointer">Inbox Messages</button>
                                </div>
                            </div>

                            <div className="bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
                                    <TrendingUp size={28} />
                                </div>
                                <h3 className="font-bold text-lg text-white font-poppins">Performance Matrix</h3>
                                <p className="text-xs text-neutral-400 max-w-sm mt-2 leading-relaxed">
                                    System logs indicate excellent database connectivity. All seed variables are mapped. Active tokens are set to expire in 30 days.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROJECTS MANAGEMENT */}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-xs">
                        {/* Create Project Form */}
                        <div className="bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm h-fit">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white font-poppins">
                                <Plus size={18} className="text-gold" />
                                Add New Project
                            </h3>
                            <form onSubmit={handleProjectCreate} className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Project Title</label>
                                    <input type="text" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. Skyline residences" className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white transition-all font-light" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Category Type</label>
                                        <select value={projectForm.type} onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })} className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-3 py-2.5 outline-none text-white transition-all font-light">
                                            <option value="Residential Construction">Residential</option>
                                            <option value="Commercial Buildings">Commercial</option>
                                            <option value="Renovation">Renovation</option>
                                            <option value="Interior Design">Interior Design</option>
                                            <option value="Road Construction">Roads</option>
                                            <option value="Steel Structure Work">Steel Work</option>
                                            <option value="Architecture Planning">Architecture</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Status</label>
                                        <select value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })} className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-3 py-2.5 outline-none text-white transition-all font-light">
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Budget Allocated</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3.5 text-neutral-400 font-semibold">$</span>
                                            <input 
                                                type="number" 
                                                step="any"
                                                required 
                                                value={projectForm.budget} 
                                                onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })} 
                                                placeholder="e.g. 12.5" 
                                                className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl pl-8 pr-10 py-2.5 outline-none text-white transition-all font-light" 
                                            />
                                            <span className="absolute right-3.5 text-neutral-400 font-semibold">M</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Time Horizon</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="number" 
                                                required 
                                                value={projectForm.timelineValue} 
                                                onChange={(e) => setProjectForm({ ...projectForm, timelineValue: e.target.value })} 
                                                placeholder="e.g. 24" 
                                                className="w-1/2 bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white transition-all font-light text-center" 
                                            />
                                            <select 
                                                value={projectForm.timelineUnit} 
                                                onChange={(e) => setProjectForm({ ...projectForm, timelineUnit: e.target.value })} 
                                                className="w-1/2 bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-3 py-2.5 outline-none text-white transition-all font-light"
                                            >
                                                <option value="Months">Months</option>
                                                <option value="Years">Years</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Location</label>
                                        <input type="text" required value={projectForm.location} onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })} placeholder="e.g. New York, USA" className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white transition-all font-light" />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Progress %</label>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            max="100" 
                                            value={projectForm.progress} 
                                            onChange={(e) => setProjectForm({ ...projectForm, progress: e.target.value === '' ? '' : Number(e.target.value) })} 
                                            className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white transition-all font-light" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Project Images</label>
                                    <div className="mt-1 flex flex-col gap-3">
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-gold/30 rounded-xl p-4 bg-neutral-950/30 hover:bg-neutral-950/50 transition-all cursor-pointer">
                                            <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                {uploadingProjImages ? (
                                                    <Loader2 className="w-6 h-6 animate-spin text-gold mb-2" />
                                                ) : (
                                                    <Plus className="w-6 h-6 text-gold mb-2" />
                                                )}
                                                <p className="text-xs font-bold text-neutral-300">
                                                    {uploadingProjImages ? "Uploading files..." : "Click to select multiple images"}
                                                </p>
                                                <p className="text-[10px] text-neutral-500 mt-1">PNG, JPG, JPEG, WEBP (Max 10MB)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="image/*" 
                                                className="hidden" 
                                                disabled={uploadingProjImages}
                                                onChange={handleProjectImagesUpload} 
                                            />
                                        </label>

                                        {projectImagePreviews.length > 0 && (
                                            <div className="flex flex-wrap gap-2 p-2 border border-white/5 rounded-xl bg-neutral-950/40">
                                                {projectImagePreviews.map((url, idx) => (
                                                    <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 group">
                                                        <img src={getImageUrl(url)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Description details</label>
                                    <textarea rows="3" required value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Provide project scope overview..." className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white resize-none transition-all font-light"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-3.5 rounded-xl transition-colors cursor-pointer uppercase tracking-wider font-poppins">Save Project</button>
                            </form>
                        </div>

                        {/* Project List */}
                        <div className="lg:col-span-2 bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm overflow-x-auto">
                            <h3 className="font-bold text-lg mb-6 text-white font-poppins">Active Portfolio</h3>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                                        <th className="pb-3">Project Title</th>
                                        <th className="pb-3">Category</th>
                                        <th className="pb-3">Budget</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Progress</th>
                                        <th className="pb-3">Time Horizon</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-neutral-300">
                                    {projects.map((proj) => {
                                        const isEditing = editingProjectId === proj._id;
                                        return isEditing ? (
                                            <tr key={proj._id} className="bg-white/5">
                                                <td className="py-4 font-bold">{proj.title}</td>
                                                <td className="py-4 text-neutral-400">{proj.type}</td>
                                                <td className="py-4 font-semibold">{proj.budget}</td>
                                                <td className="py-4">
                                                    <select 
                                                        value={editForm.status} 
                                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                        className="bg-neutral-950 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-gold/50 cursor-pointer"
                                                    >
                                                        <option value="ongoing">Ongoing</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 font-bold text-gold">
                                                    <div className="flex items-center gap-1.5">
                                                        <input 
                                                            type="number" 
                                                            min="0" 
                                                            max="100" 
                                                            value={editForm.progress} 
                                                            onChange={(e) => setEditForm({ ...editForm, progress: e.target.value === '' ? '' : Number(e.target.value) })}
                                                            className="w-16 bg-neutral-950 border border-white/10 rounded px-2 py-1 text-xs text-white text-center outline-none focus:border-gold/50"
                                                        />
                                                        <span>%</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-1">
                                                        <input 
                                                            type="number" 
                                                            required 
                                                            value={editForm.timelineValue} 
                                                            onChange={(e) => setEditForm({ ...editForm, timelineValue: e.target.value })}
                                                            className="w-12 bg-neutral-950 border border-white/10 rounded px-1.5 py-1 text-xs text-white text-center outline-none focus:border-gold/50"
                                                            placeholder="Val"
                                                        />
                                                        <select 
                                                            value={editForm.timelineUnit} 
                                                            onChange={(e) => setEditForm({ ...editForm, timelineUnit: e.target.value })}
                                                            className="bg-neutral-950 border border-white/10 rounded px-1.5 py-1 text-xs text-white outline-none focus:border-gold/50 cursor-pointer"
                                                        >
                                                            <option value="Months">Months</option>
                                                            <option value="Years">Years</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right space-x-2">
                                                    <button onClick={() => handleInlineSave(proj._id)} className="text-emerald-400 hover:text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded transition-all cursor-pointer inline-flex items-center" title="Save">
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={() => setEditingProjectId(null)} className="text-neutral-400 hover:text-neutral-500 hover:bg-neutral-500/10 p-1.5 rounded transition-all cursor-pointer inline-flex items-center" title="Cancel">
                                                        <X size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={proj._id}>
                                                <td className="py-4 font-bold">{proj.title}</td>
                                                <td className="py-4 text-neutral-400">{proj.type}</td>
                                                <td className="py-4 font-semibold">{proj.budget}</td>
                                                <td className="py-4">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-white ${proj.status === 'completed' ? 'bg-emerald-500' : 'bg-gold'}`}>
                                                        {proj.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 font-bold text-gold">{proj.progress}%</td>
                                                <td className="py-4 text-neutral-300">{proj.timeline}</td>
                                                <td className="py-4 text-right space-x-2">
                                                    <button onClick={() => handleStartEdit(proj)} className="text-blue-400 hover:text-blue-500 hover:bg-blue-500/10 p-1.5 rounded transition-all cursor-pointer inline-flex items-center" title="Edit">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleProjectDelete(proj._id)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-all cursor-pointer inline-flex items-center" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* GALLERY MANAGEMENT */}
                {activeTab === 'gallery' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-xs">
                        {/* Create Gallery Form */}
                        <div className="bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm h-fit">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white font-poppins">
                                <Plus size={18} className="text-gold" />
                                Add Gallery Showcase
                            </h3>
                            <form onSubmit={handleGalleryCreate} className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Showcase Title</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={galleryForm.title} 
                                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} 
                                        placeholder="e.g. Bespoke Villa Dining Lounge" 
                                        className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white transition-all font-light" 
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Category</label>
                                    <select 
                                        value={galleryForm.category} 
                                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} 
                                        className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-3 py-2.5 outline-none text-white transition-all font-light"
                                    >
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="interior">Interior Design</option>
                                        <option value="steel">Steel Work</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Showcase Image</label>
                                    <div className="mt-1 flex flex-col gap-3">
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-gold/30 rounded-xl p-4 bg-neutral-950/30 hover:bg-neutral-950/50 transition-all cursor-pointer">
                                            <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                {uploadingGalleryImg ? (
                                                    <Loader2 className="w-6 h-6 animate-spin text-gold mb-2" />
                                                ) : (
                                                    <Plus className="w-6 h-6 text-gold mb-2" />
                                                )}
                                                <p className="text-xs font-bold text-neutral-300">
                                                    {uploadingGalleryImg ? "Uploading image..." : "Select image file"}
                                                </p>
                                                <p className="text-[10px] text-neutral-500 mt-1">PNG, JPG, JPEG, WEBP (Max 10MB)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                disabled={uploadingGalleryImg}
                                                onChange={handleGalleryImageUpload} 
                                            />
                                        </label>

                                        {galleryImagePreview && (
                                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-sm bg-neutral-950/40">
                                                <img src={getImageUrl(galleryImagePreview)} alt="Showcase preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={uploadingGalleryImg || !galleryForm.url}
                                    className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-3.5 rounded-xl transition-colors cursor-pointer uppercase tracking-wider font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save Showcase Item
                                </button>
                            </form>
                        </div>

                        {/* Gallery List Grid */}
                        <div className="lg:col-span-2 bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-6 text-white font-poppins">Gallery Collection</h3>
                            {galleryItems.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-neutral-400 text-sm">No items in the gallery yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
                                    {galleryItems.map((item) => (
                                        <div key={item._id} className="relative group border border-white/[0.06] rounded-xl overflow-hidden shadow-sm bg-neutral-900/30 flex flex-col justify-between">
                                            <div className="relative aspect-video overflow-hidden bg-neutral-950">
                                                <img 
                                                    src={getImageUrl(item.url)} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-fade-in" 
                                                />
                                                <button 
                                                    onClick={() => handleGalleryDelete(item._id)}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                                                    title="Delete Item"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <div className="p-3">
                                                <span className="text-[9px] uppercase font-bold text-gold tracking-wider block">{item.category}</span>
                                                <h4 className="font-bold text-xs truncate mt-0.5 text-white" title={item.title}>{item.title}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* WORKERS DIRECTORY REMOVED */}

                {/* CAREERS/JOBS MANAGEMENT */}
                {activeTab === 'jobs' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-xs">
                        {/* Create Job Form */}
                        <div className="bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm h-fit">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white font-poppins">
                                <Plus size={18} className="text-gold" />
                                Post Career Role
                            </h3>
                            <form onSubmit={handleJobCreate} className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Job Title</label>
                                    <input type="text" required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Senior Civil Engineer" className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white transition-all font-light" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Contract Type</label>
                                        <select value={jobForm.type} onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })} className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-3 py-2.5 outline-none text-white transition-all font-light">
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Location</label>
                                        <input type="text" required value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="e.g. New York, NY" className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white transition-all font-light" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Salary Estimate Range</label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="flex-1 flex gap-2">
                                            <div className="relative flex-1 flex items-center">
                                                <span className="absolute left-3.5 text-neutral-400 font-semibold">$</span>
                                                <input 
                                                    type="number" 
                                                    required 
                                                    value={jobForm.salaryMin} 
                                                    onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })} 
                                                    placeholder="Min" 
                                                    className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl pl-8 pr-3 py-2.5 outline-none text-white transition-all font-light text-center" 
                                                />
                                            </div>
                                            <span className="text-neutral-500 self-center font-bold font-poppins">-</span>
                                            <div className="relative flex-1 flex items-center">
                                                <span className="absolute left-3.5 text-neutral-400 font-semibold">$</span>
                                                <input 
                                                    type="number" 
                                                    required 
                                                    value={jobForm.salaryMax} 
                                                    onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })} 
                                                    placeholder="Max" 
                                                    className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl pl-8 pr-3 py-2.5 outline-none text-white transition-all font-light text-center" 
                                                />
                                            </div>
                                        </div>
                                        <select 
                                            value={jobForm.salaryPeriod} 
                                            onChange={(e) => setJobForm({ ...jobForm, salaryPeriod: e.target.value })} 
                                            className="w-full sm:w-1/3 bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-3 py-2.5 outline-none text-white transition-all font-light cursor-pointer"
                                        >
                                            <option value="month">per month</option>
                                            <option value="year">per year</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Requirements (Comma-separated)</label>
                                    <input type="text" required value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} placeholder="e.g. OSHA 30, 4+ years safety experience" className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white transition-all font-light" />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-neutral-400 uppercase tracking-wider">Description overview</label>
                                    <textarea rows="3" required value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Provide main duties..." className="w-full bg-neutral-950/50 border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/25 rounded-xl px-4 py-2.5 outline-none text-white resize-none transition-all font-light"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-3.5 rounded-xl transition-colors cursor-pointer uppercase tracking-wider font-poppins">Post Career</button>
                            </form>
                        </div>

                        {/* Job Listings List */}
                        <div className="lg:col-span-2 bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm overflow-x-auto">
                            <h3 className="font-bold text-lg mb-6 text-white font-poppins">Open Career Listings</h3>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                                        <th className="pb-3">Job Title</th>
                                        <th className="pb-3">Contract Type</th>
                                        <th className="pb-3">Location</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-neutral-300">
                                    {jobs.map((job) => (
                                        <tr key={job._id}>
                                            <td className="py-4 font-bold">{job.title}</td>
                                            <td className="py-4"><span className="bg-gold/10 text-gold text-[9px] font-bold px-2 py-0.5 rounded border border-gold/20">{job.type}</span></td>
                                            <td className="py-4 text-neutral-400">{job.location}</td>
                                            <td className="py-4 text-right">
                                                <button onClick={() => handleJobDelete(job._id)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-all cursor-pointer">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* CANDIDATE APPLICATIONS */}
                {activeTab === 'applications' && (
                    <div className="bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm overflow-x-auto animate-fade-in text-xs">
                        <h3 className="font-bold text-lg mb-6 text-white font-poppins">Submitted Candidate Resumes</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Candidate</th>
                                    <th className="pb-3">Job Title</th>
                                    <th className="pb-3">CV Resume</th>
                                    <th className="pb-3">Decision Status</th>
                                    <th className="pb-3 text-right">Resolve Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-neutral-300">
                                {applications.map((app) => (
                                    <tr key={app._id}>
                                        <td className="py-4">
                                            <div className="font-bold">{app.applicantName || app.userId?.name || 'Candidate'}</div>
                                            <div className="text-[10px] text-neutral-500">{app.applicantEmail || app.userId?.email}</div>
                                        </td>
                                        <td className="py-4 font-bold text-neutral-200">{app.jobId?.title || 'Open Position'}</td>
                                        <td className="py-4">
                                            <a href={app.cv} target="_blank" rel="noreferrer" className="text-gold font-bold hover:underline font-poppins">View PDF Resume</a>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-block px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                                                app.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                app.status === 'Reviewed' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right space-x-1.5">
                                            <a
                                                href={`mailto:${app.applicantEmail || app.userId?.email}?subject=TitanCore Construction - Job Application Update&body=Hi ${app.applicantName || app.userId?.name || 'Candidate'},%0D%0A%0D%0AThank you for applying for the ${app.jobId?.title || 'Open Position'} position at TitanCore Construction.%0D%0A%0D%0A`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded transition-colors inline-flex cursor-pointer"
                                                title="Email Candidate"
                                            >
                                                <Mail size={14} />
                                            </a>
                                            <button onClick={() => handleAppStatusChange(app._id, 'Accepted')} className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded transition-colors inline-flex cursor-pointer" title="Accept Candidate">
                                                <Check size={14} />
                                            </button>
                                            <button onClick={() => handleAppStatusChange(app._id, 'Rejected')} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-colors inline-flex cursor-pointer" title="Reject Candidate">
                                                <X size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* INBOX MESSAGES */}
                {activeTab === 'messages' && (
                    <div className="bg-neutral-900/40 border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl shadow-sm overflow-x-auto animate-fade-in text-xs">
                        <h3 className="font-bold text-lg mb-6 text-white font-poppins">Inbox Messages & Inquiries</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3">Sender Details</th>
                                    <th className="pb-3">Subject / Topic</th>
                                    <th className="pb-3">Query Message</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-neutral-300">
                                {messages.map((msg) => (
                                    <tr key={msg._id} className={msg.status === 'Unread' ? 'bg-amber-500/5' : ''}>
                                        <td className="py-4">
                                            <div className="font-bold">{msg.name}</div>
                                            <div className="text-[10px] text-neutral-500">{msg.email}</div>
                                            <div className="text-[10px] text-neutral-500">{msg.phone}</div>
                                        </td>
                                        <td className="py-4 font-bold text-neutral-200">{msg.subject}</td>
                                        <td className="py-4 text-neutral-400 max-w-xs leading-relaxed">{msg.message}</td>
                                        <td className="py-4">
                                            <span className={`inline-block px-1.5 py-0.5 rounded-[3px] font-bold text-[9px] uppercase tracking-wider ${
                                                msg.status === 'Read' ? 'bg-white/5 text-neutral-400 border border-white/10' : 
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                                            }`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {msg.status === 'Unread' && (
                                                <button onClick={() => handleMessageRead(msg._id)} className="bg-gold hover:bg-gold-dark text-black font-bold text-[10px] uppercase tracking-wider px-2 py-1.5 rounded transition-colors cursor-pointer font-poppins">
                                                    Mark Read
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;
