import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Hammer, Briefcase, FileText, Mail, Plus, Trash2, Edit3, Check, X,
    TrendingUp, Settings, BarChart2, ShieldCheck, LogOut, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import adminAvatar from '../assets/admin/avatar.jpg';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('metrics');

    // Database lists
    const [projects, setProjects] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [projectForm, setProjectForm] = useState({
        title: '', type: 'Residential Construction', status: 'ongoing', budget: '', location: '', description: '', progress: 0, images: '', timeline: ''
    });
    const [jobForm, setJobForm] = useState({
        title: '', description: '', requirements: '', salary: '', type: 'Full-time', location: 'On-site'
    });

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
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setProjects([]);
            setJobs([]);
            setApplications([]);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Redirect if not admin
        if (!user || user.role !== 'admin') {
            navigate('/admin/login');
            return;
        }
        fetchDashboardData();
    }, [user, navigate]);

    // Project managers
    const handleProjectCreate = async (e) => {
        e.preventDefault();
        try {
            const imgArray = projectForm.images ? projectForm.images.split(',').map((img) => img.trim()) : [];
            await API.post('/projects', { ...projectForm, images: imgArray });
            setProjectForm({ title: '', type: 'Residential Construction', status: 'ongoing', budget: '', location: '', description: '', progress: 0, images: '', timeline: '' });
            fetchDashboardData();
        } catch (e) {
            console.error('Error creating project:', e);
            alert('Failed to create project. Please try again.');
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

    // Job managers
    const handleJobCreate = async (e) => {
        e.preventDefault();
        try {
            const reqArray = jobForm.requirements ? jobForm.requirements.split(',').map((r) => r.trim()) : [];
            await API.post('/jobs', { ...jobForm, requirements: reqArray });
            setJobForm({ title: '', description: '', requirements: '', salary: '', type: 'Full-time', location: 'On-site' });
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
        <div className="min-h-screen bg-gray-50 flex text-luxury-text">

            {/* Sidebar Navigation */}
            <aside className="w-64 bg-luxury-darkBg text-white shrink-0 hidden md:flex flex-col justify-between p-6">
                <div className="space-y-8">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-6">
                        <img src="./src/assets/logo.png" alt="Logo image" className="w-20 h-auto" />
                        <div>
                            <span className="font-bold tracking-wider block text-sm">Admin Panel</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold mt-0.5">TitanCore HQ</span>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {[
                            { id: 'metrics', label: 'Dashboard Home', icon: <BarChart2 size={16} /> },
                            { id: 'projects', label: 'Manage Projects', icon: <Hammer size={16} /> },
                            { id: 'jobs', label: 'Career Listings', icon: <Briefcase size={16} /> },
                            { id: 'applications', label: 'Applications', icon: <FileText size={16} /> },
                            { id: 'messages', label: 'Inbox Messages', icon: <Mail size={16} /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab.id
                                    ? 'bg-gold text-white shadow-lg shadow-gold/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full cursor-pointer"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </aside>

            {/* Main Body */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-[calc(100vw-256px)] md:max-w-full">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-5">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-poppins">Console Dashboard</h1>
                        <p className="text-xs text-luxury-textMuted mt-1">Logged in as {user?.name} (Systems Administrator).</p>
                    </div>

                    <img src={user?.avatar && !user.avatar.includes('unsplash') ? user.avatar : adminAvatar} alt="Admin" className="w-12 h-12 rounded-full border-2 border-gold object-cover shadow-sm" />
                </div>

                {/* METRICS / MAIN HOME TAB */}
                {activeTab === 'metrics' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Total Projects', count: projects.length, icon: <Hammer size={20} className="text-gold" />, bg: 'bg-white' },
                                { title: 'Open Listings', count: jobs.length, icon: <Briefcase size={20} className="text-gold" />, bg: 'bg-white' },
                                { title: 'Pending Resumes', count: applications.filter(a => a.status === 'Pending').length, icon: <FileText size={20} className="text-gold" />, bg: 'bg-white' },
                                { title: 'Unread Messages', count: messages.filter(m => m.status === 'Unread').length, icon: <Mail size={20} className="text-gold" />, bg: 'bg-white' }
                            ].map((card) => (
                                <div key={card.title} className={`${card.bg} border border-gray-150 p-6 rounded-2xl shadow-sm flex items-center justify-between`}>
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-luxury-textMuted">{card.title}</span>
                                        <span className="text-3xl font-bold block mt-1">{card.count}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                                        {card.icon}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick action shortcuts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-lg mb-4">Quick Links Console</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setActiveTab('projects')} className="bg-gray-50 hover:bg-gold/5 border hover:border-gold p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all">Add Projects</button>
                                    <button onClick={() => setActiveTab('jobs')} className="bg-gray-50 hover:bg-gold/5 border hover:border-gold p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all">Post Careers</button>
                                    <button onClick={() => setActiveTab('applications')} className="bg-gray-50 hover:bg-gold/5 border hover:border-gold p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all">Review Resumes</button>
                                    <button onClick={() => setActiveTab('messages')} className="bg-gray-50 hover:bg-gold/5 border hover:border-gold p-4 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-all">Inbox Messages</button>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
                                    <TrendingUp size={28} />
                                </div>
                                <h3 className="font-bold text-lg">Performance Matrix</h3>
                                <p className="text-xs text-luxury-textMuted max-w-sm mt-2 leading-relaxed">
                                    System logs indicate excellent database connectivity. All seed variables are mapped. Active tokens are set to expire in 30 days.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROJECTS MANAGEMENT */}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Create Project Form */}
                        <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm h-fit">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Plus size={18} className="text-gold" />
                                Add New Project
                            </h3>
                            <form onSubmit={handleProjectCreate} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Project Title</label>
                                    <input type="text" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. Skyline residences" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Category Type</label>
                                        <select value={projectForm.type} onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })} className="w-full bg-gray-50 border border-gray-250 rounded-xl px-3 py-2.5 outline-none text-luxury-text">
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
                                        <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Status</label>
                                        <select value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })} className="w-full bg-gray-50 border border-gray-250 rounded-xl px-3 py-2.5 outline-none text-luxury-text">
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Budget Allocated</label>
                                        <input type="text" required value={projectForm.budget} onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })} placeholder="e.g. $12.5M" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Time Horizon</label>
                                        <input type="text" required value={projectForm.timeline} onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })} placeholder="e.g. 24 Months" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Location</label>
                                        <input type="text" required value={projectForm.location} onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })} placeholder="e.g. New York, USA" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Progress Percentage</label>
                                        <input type="number" min="0" max="100" value={projectForm.progress} onChange={(e) => setProjectForm({ ...projectForm, progress: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Images URLs (Comma-separated)</label>
                                    <input type="text" value={projectForm.images} onChange={(e) => setProjectForm({ ...projectForm, images: e.target.value })} placeholder="e.g. https://images.com/1.jpg" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Description details</label>
                                    <textarea rows="3" required value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Provide project scope overview..." className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text resize-none"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer uppercase tracking-wider">Save Project</button>
                            </form>
                        </div>

                        {/* Project List */}
                        <div className="lg:col-span-2 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm overflow-x-auto">
                            <h3 className="font-bold text-lg mb-6">Active Portfolio</h3>
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-gray-150 text-luxury-textMuted font-bold uppercase tracking-wider">
                                        <th className="pb-3">Project Title</th>
                                        <th className="pb-3">Category</th>
                                        <th className="pb-3">Budget</th>
                                        <th className="pb-3">Progress</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {projects.map((proj) => (
                                        <tr key={proj._id}>
                                            <td className="py-4 font-bold">{proj.title}</td>
                                            <td className="py-4 text-luxury-textMuted">{proj.type}</td>
                                            <td className="py-4 font-semibold">{proj.budget}</td>
                                            <td className="py-4 font-bold text-gold">{proj.progress}%</td>
                                            <td className="py-4 text-right">
                                                <button onClick={() => handleProjectDelete(proj._id)} className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer">
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

                {/* WORKERS DIRECTORY REMOVED */}

                {/* CAREERS/JOBS MANAGEMENT */}
                {activeTab === 'jobs' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Create Job Form */}
                        <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm h-fit">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Plus size={18} className="text-gold" />
                                Post Career Role
                            </h3>
                            <form onSubmit={handleJobCreate} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Job Title</label>
                                    <input type="text" required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Senior Civil Engineer" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Contract Type</label>
                                        <select value={jobForm.type} onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })} className="w-full bg-gray-50 border border-gray-250 rounded-xl px-3 py-2.5 outline-none text-luxury-text">
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Location</label>
                                        <input type="text" required value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="e.g. New York, NY" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Salary Estimate Range</label>
                                    <input type="text" required value={jobForm.salary} onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })} placeholder="e.g. $110,000 - $140,000 / year" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Requirements (Comma-separated)</label>
                                    <input type="text" required value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} placeholder="e.g. OSHA 30, 4+ years safety experience" className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text" />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-luxury-textMuted uppercase">Description overview</label>
                                    <textarea rows="3" required value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Provide main duties..." className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 outline-none text-luxury-text resize-none"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer uppercase tracking-wider">Post Career</button>
                            </form>
                        </div>

                        {/* Job Listings List */}
                        <div className="lg:col-span-2 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm overflow-x-auto">
                            <h3 className="font-bold text-lg mb-6">Open Career Listings</h3>
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-gray-150 text-luxury-textMuted font-bold uppercase tracking-wider">
                                        <th className="pb-3">Job Title</th>
                                        <th className="pb-3">Contract Type</th>
                                        <th className="pb-3">Location</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {jobs.map((job) => (
                                        <tr key={job._id}>
                                            <td className="py-4 font-bold">{job.title}</td>
                                            <td className="py-4"><span className="bg-gold/10 text-gold text-[9px] font-bold px-2 py-0.5 rounded">{job.type}</span></td>
                                            <td className="py-4 text-luxury-textMuted">{job.location}</td>
                                            <td className="py-4 text-right">
                                                <button onClick={() => handleJobDelete(job._id)} className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer">
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
                    <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm overflow-x-auto animate-fade-in">
                        <h3 className="font-bold text-lg mb-6">Submitted Candidate Resumes</h3>
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-gray-150 text-luxury-textMuted font-bold uppercase tracking-wider">
                                    <th className="pb-3">Candidate</th>
                                    <th className="pb-3">Job Title</th>
                                    <th className="pb-3">CV Resume</th>
                                    <th className="pb-3">Decision Status</th>
                                    <th className="pb-3 text-right">Resolve Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.map((app) => (
                                    <tr key={app._id}>
                                        <td className="py-4">
                                            <div className="font-bold">{app.applicantName || app.userId?.name || 'Candidate'}</div>
                                            <div className="text-[10px] text-luxury-textMuted">{app.applicantEmail || app.userId?.email}</div>
                                        </td>
                                        <td className="py-4 font-bold text-luxury-text">{app.jobId?.title || 'Open Position'}</td>
                                        <td className="py-4">
                                            <a href={app.cv} target="_blank" rel="noreferrer" className="text-gold font-bold hover:underline">View PDF Resume</a>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-block px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                                                app.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                                                    app.status === 'Reviewed' ? 'bg-indigo-50 text-indigo-700' :
                                                        'bg-amber-50 text-amber-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right space-x-1.5">
                                            <a
                                                href={`mailto:${app.applicantEmail || app.userId?.email}?subject=TitanCore Construction - Job Application Update&body=Hi ${app.applicantName || app.userId?.name || 'Candidate'},%0D%0A%0D%0AThank you for applying for the ${app.jobId?.title || 'Open Position'} position at TitanCore Construction.%0D%0A%0D%0A`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded transition-colors inline-flex cursor-pointer"
                                                title="Email Candidate"
                                            >
                                                <Mail size={14} />
                                            </a>
                                            <button onClick={() => handleAppStatusChange(app._id, 'Accepted')} className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded transition-colors inline-flex cursor-pointer" title="Accept Candidate">
                                                <Check size={14} />
                                            </button>
                                            <button onClick={() => handleAppStatusChange(app._id, 'Rejected')} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors inline-flex cursor-pointer" title="Reject Candidate">
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
                    <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm overflow-x-auto animate-fade-in">
                        <h3 className="font-bold text-lg mb-6">Inbox Messages & Inquiries</h3>
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-gray-150 text-luxury-textMuted font-bold uppercase tracking-wider">
                                    <th className="pb-3">Sender Details</th>
                                    <th className="pb-3">Subject / Topic</th>
                                    <th className="pb-3">Query Message</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {messages.map((msg) => (
                                    <tr key={msg._id} className={msg.status === 'Unread' ? 'bg-amber-500/5' : ''}>
                                        <td className="py-4">
                                            <div className="font-bold">{msg.name}</div>
                                            <div className="text-[10px] text-luxury-textMuted">{msg.email}</div>
                                            <div className="text-[10px] text-luxury-textMuted">{msg.phone}</div>
                                        </td>
                                        <td className="py-4 font-bold text-luxury-text">{msg.subject}</td>
                                        <td className="py-4 text-luxury-textMuted max-w-xs">{msg.message}</td>
                                        <td className="py-4">
                                            <span className={`inline-block px-1.5 py-0.5 rounded-[3px] font-bold text-[9px] uppercase tracking-wider ${msg.status === 'Read' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700 animate-pulse'
                                                }`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {msg.status === 'Unread' && (
                                                <button onClick={() => handleMessageRead(msg._id)} className="bg-gold hover:bg-gold-dark text-white font-bold text-[10px] uppercase tracking-wider px-2 py-1.5 rounded transition-colors cursor-pointer">
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
