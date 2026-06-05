import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, CheckCircle2, X, FileText, User, Mail } from 'lucide-react';
import API, { getBackendUrl } from '../services/api';
import careersBg from '../assets/careers/careers.jpg';

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Application Modal States
    const [selectedJob, setSelectedJob] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [appSubmitted, setAppSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cv: '',
        coverLetter: '',
    });

    const fetchJobs = async () => {
        try {
            const { data } = await API.get('/jobs');
            if (data.success) {
                setJobs(data.data);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setJobs([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setModalOpen(true);
        setAppSubmitted(false);
        setFileName('');
        setUploading(false);
        setFormData({
            name: '',
            email: '',
            cv: '',
            coverLetter: '',
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setUploading(true);

        const fileData = new FormData();
        fileData.append('cv', file);

        try {
            const { data } = await API.post('/upload', fileData, {
                headers: {
                    'Content-Type': undefined,
                },
            });
            if (data.success) {
                const uploadedPath = data.filePath;
                const finalCvUrl = (uploadedPath.startsWith('http://') || uploadedPath.startsWith('https://'))
                    ? uploadedPath
                    : getBackendUrl() + (uploadedPath.startsWith('/') ? uploadedPath : `/${uploadedPath}`);
                setFormData((prev) => ({
                    ...prev,
                    cv: finalCvUrl,
                }));
            }
        } catch (err) {
            console.error('File upload error:', err);
            alert(err.response?.data?.message || 'Failed to upload file. Please try again.');
            setFileName('');
        } finally {
            setUploading(false);
        }
    };

    const handleAppSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cv) {
            alert('Please wait for the resume to finish uploading.');
            return;
        }
        try {
            await API.post('/applications', {
                applicantName: formData.name,
                applicantEmail: formData.email,
                jobId: selectedJob._id,
                cv: formData.cv,
                coverLetter: formData.coverLetter,
            });
            setAppSubmitted(true);
            setTimeout(() => {
                setModalOpen(false);
            }, 3000);
        } catch (err) {
            console.error('Error submitting application:', err);
            const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
            alert(msg);
        }
    };

    return (
        <div className="w-full bg-white text-luxury-text min-h-screen">

            {/* Page Header */}
            <section className="relative pt-46 pb-46 bg-cover bg-center text-white" style={{ backgroundImage: `url(${careersBg})`, backgroundPosition: "center 20%" }}>
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
                <div className="max-w-4xl mx-auto px-6 space-y-8">
                    <h2 className="text-2xl font-bold font-poppins mb-6 text-center">Open Opportunities</h2>

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
                                    className="bg-white rounded-2xl p-6 jetwing-card group relative overflow-hidden"
                                >
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div>
                                            <span className="bg-gold/10 text-gold text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                                                {job.type}
                                            </span>
                                            <h3 className="font-bold text-xl mt-2 jetwing-card-title">{job.title}</h3>
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
            </section>

            {/* Application Modal Overlay */}
            {modalOpen && selectedJob && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-scale-up my-8">
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
                                    Your CV and details have been logged in our database. We will review your application and contact you if there is a match.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleAppSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                             
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl py-2.5 pl-9 pr-4 text-xs outline-none text-luxury-text"
                                        />
                                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                             
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl py-2.5 pl-9 pr-4 text-xs outline-none text-luxury-text"
                                        />
                                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1 text-luxury-textMuted uppercase">Upload CV / Resume (PDF, DOC, DOCX)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            required
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl py-2.5 px-4 text-xs outline-none text-luxury-text cursor-pointer"
                                        />
                                    </div>
                                    {uploading && (
                                        <span className="text-[10px] text-gold block mt-1 animate-pulse">Uploading resume to server...</span>
                                    )}
                                    {!uploading && fileName && (
                                        <span className="text-[10px] text-emerald-600 block mt-1">✓ File uploaded: {fileName}</span>
                                    )}
                                    <span className="text-[10px] text-luxury-textMuted block mt-1">Please select and upload your resume file (max 10MB).</span>
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
                                        disabled={uploading || !formData.cv}
                                        className="flex-1 bg-gold hover:bg-gold-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer"
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
