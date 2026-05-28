import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Send, CheckCircle2, ShieldCheck, User, X, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appLoading, setAppLoading] = useState(false);
    const { user, openAuthModal } = useAuth();
    const navigate = useNavigate();

    // Application Modal States
    const [selectedJob, setSelectedJob] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [appSubmitted, setAppSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        cv: '',
        coverLetter: '',
    });

    const fetchJobsAndApps = async () => {
        try {
            const { data } = await API.get('/jobs');
            if (data.success) {
                setJobs(data.data);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setJobs([]);
        }

        if (user) {
            try {
                setAppLoading(true);
                const { data } = await API.get('/applications/my');
                if (data.success) {
                    setMyApplications(data.data);
                }
            } catch (err) {
                console.error('Error fetching my applications');
            } finally {
                setAppLoading(false);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchJobsAndApps();
    }, [user]);

    const handleApplyClick = (job) => {
        if (!user) {
            openAuthModal('login');
            return;
        }
        setSelectedJob(job);
        setModalOpen(true);
        setAppSubmitted(false);
    };

    const handleAppSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/applications', {
                jobId: selectedJob._id,
                cv: formData.cv || 'https://cloudinary.com/dummy-cv-resume.pdf',
                coverLetter: formData.coverLetter,
            });
            setAppSubmitted(true);
            setTimeout(() => {
                setModalOpen(false);
                fetchJobsAndApps(); // Refresh tracking list
            }, 3000);
        } catch (err) {
            console.error('Error submitting application:', err);
            alert('Failed to submit application. Please try again.');
        }
    };

    return (
        <div className="w-full bg-white text-luxury-text min-h-screen">

            {/* Page Header */}
            <section className="relative pt-36 pb-24 bg-cover bg-center text-white" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600')` }}>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block">Corporate Careers</span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-poppins text-white">
                        Careers & <span className="text-gold">Internships</span>
                    </h1>
                </div>
            </section>

            {/* Main Container */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Columns: Job Listings */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-bold font-poppins mb-6">Open Opportunities</h2>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-luxury-textMuted text-xs">Scanning active listings...</span>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                                <p className="text-luxury-textMuted text-sm">No career postings listed at this time.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {jobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                    >
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                            <div>
                                                <span className="bg-gold/10 text-gold text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                                                    {job.type}
                                                </span>
                                                <h3 className="font-bold text-xl mt-2 group-hover:text-gold transition-colors">{job.title}</h3>
                                            </div>

                                            <div className="flex gap-4 text-xs text-luxury-textMuted">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-gold" /> {job.location}
                                                </span>
                                                <span className="flex items-center gap-1 font-semibold text-luxury-text">
                                                    <DollarSign size={14} className="text-gold" /> {job.salary}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-luxury-textMuted text-sm leading-relaxed mb-4">
                                            {job.description}
                                        </p>

                                        {/* Requirements Bullets */}
                                        <div className="mb-6">
                                            <span className="text-xs font-semibold text-luxury-text block mb-2 uppercase">Requirements:</span>
                                            <ul className="list-disc list-inside text-xs text-luxury-textMuted space-y-1">
                                                {job.requirements.map((req, idx) => (
                                                    <li key={idx}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            onClick={() => handleApplyClick(job)}
                                            className="bg-gold hover:bg-gold-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                                        >
                                            Apply For Position
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Application Tracking Panel */}
                    <div className="space-y-8">
                        <div className="bg-gray-50 border border-gray-150 p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-4 font-poppins">Application Tracking</h3>

                            {!user ? (
                                <div className="text-center py-6">
                                    <p className="text-xs text-luxury-textMuted mb-4">Log in to track your job applications and check reviewing outcomes.</p>
                                    <button
                                        onClick={() => openAuthModal('login')}
                                        className="w-full bg-luxury-text hover:bg-gold text-white font-bold text-xs py-3 rounded-lg border border-gold/15 transition-colors cursor-pointer"
                                    >
                                        Login / Register
                                    </button>
                                </div>
                            ) : appLoading ? (
                                <div className="flex items-center justify-center py-6 gap-2">
                                    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-luxury-textMuted">Syncing applications...</span>
                                </div>
                            ) : myApplications.length === 0 ? (
                                <p className="text-xs text-luxury-textMuted text-center py-6">You haven't submitted any job applications yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {myApplications.map((app) => (
                                        <div key={app._id} className="bg-white p-4 border border-gray-200 rounded-xl shadow-xs">
                                            <h4 className="font-bold text-sm truncate">{app.jobId?.title || 'Position Applied'}</h4>
                                            <span className="text-[9px] uppercase font-bold text-gold">{app.jobId?.type}</span>

                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-[10px]">
                                                <span className="text-luxury-textMuted">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                                <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                                                        app.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                                                            app.status === 'Reviewed' ? 'bg-indigo-50 text-indigo-700' :
                                                                'bg-amber-50 text-amber-700'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>

            {/* Application Modal Overlay */}
            {modalOpen && selectedJob && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-gray-150 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-scale-up my-8">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute right-4 top-4 text-luxury-textMuted hover:text-luxury-text transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-gold font-bold">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">Apply for Role</h3>
                                <p className="text-xs text-luxury-textMuted">{selectedJob.title} - {selectedJob.location}</p>
                            </div>
                        </div>

                        {appSubmitted ? (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-8 rounded-xl text-center space-y-3">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                                <h4 className="font-bold text-base">Application Submitted</h4>
                                <p className="text-xs text-emerald-700">
                                    Your CV and details have been logged in our tracking database. You can inspect updates in the tracking panel.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleAppSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Upload CV / Resume Link</label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            required
                                            value={formData.cv}
                                            onChange={(e) => setFormData({ ...formData, cv: e.target.value })}
                                            placeholder="e.g. https://my-portfolio.com/cv.pdf"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl py-2.5 pl-9 pr-4 text-xs outline-none text-luxury-text"
                                        />
                                        <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] text-luxury-textMuted block mt-1">Provide a direct link to your PDF CV (Google Drive, Dropbox, Cloudinary).</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Cover Letter / Pitch</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.coverLetter}
                                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                        placeholder="Briefly state your qualifications and alignment with the role..."
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-xs outline-none text-luxury-text resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-luxury-text border border-gray-250 font-bold py-3.5 rounded-xl text-xs transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gold hover:bg-gold-dark text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Careers;
