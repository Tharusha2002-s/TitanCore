import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, ChevronLeft, ChevronRight, Award, Shield, Cpu, Clock, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920',

            title: 'Building The Future With Strength & Innovation',
            desc: 'Trusted construction company delivering world-class residential and commercial projects.'
        },
        {
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920',

            title: 'Precision Design & Structural Mastery',
            desc: 'Delivering landmark commercial office towers and smart urban infrastructures.'
        },
        {
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920',

            title: 'Custom Residential Smart Communities',
            desc: 'Creating sustainable, high-end modular smart homes tailored to modern lifestyles.'
        }
    ];

    // Auto-play timer for hero slideshow
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 9000);
        return () => clearInterval(timer);
    }, []);

    // Load home page data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resProj = await API.get('/projects');
                if (resProj.data?.success) setProjects(resProj.data.data);
            } catch (e) {
                console.error('Error fetching projects:', e);
                setProjects([]);
            }

            // Workers logic removed

            try {
                const resJobs = await API.get('/jobs');
                if (resJobs.data?.success) setJobs(resJobs.data.data.slice(0, 2));
            } catch (e) {
                console.error('Error fetching jobs:', e);
                setJobs([]);
            }
        };

        fetchData();
    }, []);

    const testimonials = [
        { name: 'Sarah Jenkins', role: 'CEO, Horizon Ventures', quote: 'TitanCore delivered our headquarters on budget and three weeks ahead of schedule. The engineering design and finishing details are spectacular.', rating: 5 },
        { name: 'Marcus Sterling', role: 'Managing Director, Apex Retail', quote: 'Their structural team executed the complex glass vault roofing system flawlessly. Highly professional, responsive, and detail-oriented.', rating: 5 },
        { name: 'David Cho', role: 'Real Estate Developer', quote: 'A luxury build calls for high craftsmanship standards. TitanCore\'s team exceeded our expectations in every single category.', rating: 5 }
    ];

    const handleNextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrevTestimonial = () => {
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const completedProjects = projects.filter((p) => p.status === 'completed');
    const ongoingProjects = projects.filter((p) => p.status === 'ongoing');

    // Animation constants
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    return (
        <div className="w-full bg-white overflow-hidden">

            {/* 1. CINEMATIC HERO SECTION */}
            <section className="relative w-full min-h-screen flex items-center justify-center text-white bg-black overflow-hidden py-24">
                {/* Slides */}
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-60 scale-100 z-0' : 'opacity-0 scale-105 -z-10'
                            }`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Dark luxury gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent"></div>
                    </div>
                ))}

                {/* Hero Content */}
                <div className="relative max-w-7xl mx-auto px-6 text-center z-10 flex flex-col items-center pt-24">
                    {heroSlides[currentSlide].subtitle && (
                        <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-4 block animate-fade-in">
                            {heroSlides[currentSlide].subtitle}
                        </span>
                    )}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-white font-poppins min-h-[120px] sm:min-h-[160px] md:min-h-[220px] flex items-center justify-center">
                        {heroSlides[currentSlide].title}
                    </h1>
                    <p className="text-base sm:text-xl text-gray-300 max-w-2xl font-inter font-light leading-relaxed mb-6 min-h-[60px] flex items-center justify-center">
                        {heroSlides[currentSlide].desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            to="/projects"
                            className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-4 rounded-lg shadow-xl hover:shadow-gold/20 flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer"
                        >
                            Explore Projects
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/careers"
                            className="border border-white/40 hover:border-gold hover:text-gold bg-white/5 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
                        >
                            Join Our Team
                        </Link>
                    </div>

                    {/* Slider Indicators (dots) */}
                    <div className="flex gap-2.5 mt-8 z-20">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? 'bg-gold w-8 shadow-md' : 'bg-white/40 hover:bg-white/70'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>

                    {/* Quick stats floating in Hero bottom */}
                    <div className="hidden md:grid grid-cols-4 gap-8 border-t border-white/10 w-full max-w-5xl mt-10 pt-8 text-left">
                        <div>
                            <h3 className="text-3xl font-bold text-gold">25+</h3>
                            <p className="text-xs uppercase text-gray-400 tracking-wider mt-1">Years Experience</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gold">650+</h3>
                            <p className="text-xs uppercase text-gray-400 tracking-wider mt-1">Projects Completed</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gold">100%</h3>
                            <p className="text-xs uppercase text-gray-400 tracking-wider mt-1">Quality Standards</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gold">95%</h3>
                            <p className="text-xs uppercase text-gray-400 tracking-wider mt-1">Client Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. ABOUT COMPANY */}
            <section className="py-24 bg-white text-luxury-text">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="flex flex-col gap-6"
                    >
                        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">About Company</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                            Building Better, Building <span className="text-gold">Stronger</span>
                        </h2>
                        <p className="text-luxury-textMuted leading-relaxed text-base">
                            With over 25 years of experience, TitanCore Construction has been delivering exceptional construction services to our clients. We specialize in general contracting, project management, and design-build services.
                        </p>

                        {/* Core Values Bullets */}
                        <div className="space-y-4 my-2">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                                    <Award size={22} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Quality Construction</h4>
                                    <p className="text-sm text-luxury-textMuted">We use the best materials and latest technology for superior structural finishes.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                                    <Shield size={22} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Expert Team</h4>
                                    <p className="text-sm text-luxury-textMuted">Our certified engineers and builders ensure high quality compliance at all times.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                                    <Clock size={22} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">On-Time Delivery</h4>
                                    <p className="text-sm text-luxury-textMuted">We utilize advanced workflow modeling to ensure timeline commitments are met.</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 text-gold font-bold text-sm tracking-wider uppercase border-b-2 border-gold/0 hover:border-gold py-1 self-start transition-all"
                        >
                            Learn More About Us <ArrowRight size={16} />
                        </Link>
                    </motion.div>

                    {/* Premium Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1000"
                                alt="Architectural Blueprint Design"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Experience badge */}
                        <div className="absolute -bottom-6 -left-6 bg-luxury-text text-white p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center border border-gold/20">
                            <span className="text-5xl font-bold text-gold block leading-none">25+</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300 block mt-2 text-center">
                                Years of<br />Experience
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. SERVICES SECTION */}
            <section className="py-24 bg-gray-50 text-luxury-text">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                        <div>
                            <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Our Services</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3">
                                Our Construction <span className="text-gold">Services</span>
                            </h2>
                        </div>
                        <Link
                            to="/services"
                            className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors text-sm"
                        >
                            View All Services
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Residential Construction', desc: 'Building high-end, customized smart homes, apartments, and residential estates.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600' },
                            { title: 'Commercial Buildings', desc: 'State of the art workspaces, shopping centers, corporate parks, and urban developments.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600' },
                            { title: 'Renovation & Overhauls', desc: 'Injecting modern features, structures, and systems to elevate legacy spaces.', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600' }
                        ].map((srv, index) => (
                            <motion.div
                                key={srv.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white border border-gray-150/60 rounded-2xl overflow-hidden shadow-md group hover:shadow-2xl hover:-translate-y-2 hover:border-gold/20 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img src={srv.image} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-luxury-text group-hover:text-gold transition-colors">{srv.title}</h3>
                                        <p className="text-luxury-textMuted text-sm leading-relaxed">{srv.desc}</p>
                                    </div>
                                    <Link to="/services" className="text-gold font-bold text-xs uppercase tracking-wider mt-6 inline-flex items-center gap-1 hover:gap-2 transition-all">
                                        Explore Details <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. COMPLETED PROJECTS */}
            <section className="py-24 bg-white text-luxury-text">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                        <div>
                            <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Featured Projects</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3">
                                Our Latest <span className="text-gold">Projects</span>
                            </h2>
                        </div>
                        <Link
                            to="/projects"
                            className="border border-gold text-gold hover:bg-gold hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 text-sm"
                        >
                            All Projects
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {completedProjects.slice(0, 3).map((proj, index) => (
                            <motion.div
                                key={proj._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white border border-gray-150/60 rounded-2xl overflow-hidden shadow-md group hover:shadow-2xl hover:-translate-y-2 hover:border-gold/20 transition-all duration-300"
                            >
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img
                                        src={proj.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'}
                                        alt={proj.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded">
                                        Completed
                                    </div>
                                </div>
                                <div className="p-6">
                                    <span className="text-xs uppercase tracking-wider text-gold font-semibold">{proj.type}</span>
                                    <h3 className="text-xl font-bold mt-1 text-luxury-text">{proj.title}</h3>
                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-sm">
                                        <span className="text-luxury-textMuted">{proj.location}</span>
                                        <span className="font-bold text-luxury-text">{proj.budget}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. ONGOING PROJECTS */}
            <section className="py-24 bg-gray-50 text-luxury-text border-t border-gray-150">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Ongoing Works</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3">
                            Building Today, Shaping <span className="text-gold">Tomorrow</span>
                        </h2>
                        <p className="text-luxury-textMuted mt-4">
                            We are working on some amazing projects. Here is a glimpse of our ongoing works.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {ongoingProjects.slice(0, 2).map((proj, index) => (
                            <motion.div
                                key={proj._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white border border-gray-150/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5 hover:border-gold/20 transition-all duration-300 p-6 flex flex-col md:flex-row gap-6 items-center"
                            >
                                <div className="w-full md:w-2/5 aspect-[4/3] rounded-xl overflow-hidden shrink-0">
                                    <img src={proj.images[0]} alt={proj.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-gold font-semibold">{proj.type}</span>
                                            <h3 className="text-xl font-bold mt-1">{proj.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-luxury-textMuted text-xs mt-3 leading-relaxed line-clamp-2">{proj.description}</p>

                                    {/* Progress bar */}
                                    <div className="mt-6">
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-luxury-textMuted">Project Progress</span>
                                            <span className="text-gold">{proj.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="bg-gold h-full rounded-full transition-all duration-1000" style={{ width: `${proj.progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-xs text-luxury-textMuted">
                                        <span>📍 {proj.location}</span>
                                        <span>Budget: <span className="font-bold text-luxury-text">{proj.budget}</span></span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. WHY CHOOSE US */}
            <section className="py-24 bg-white text-luxury-text">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Key Advantages</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3">
                            Why Corporate Partners <span className="text-gold">Choose Us</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Award size={28} />, title: 'Premium Materials', desc: 'We source exclusively from ISO certified quarries and suppliers for top tier durability.' },
                            { icon: <Shield size={28} />, title: 'Perfect Safety Record', desc: 'Stringent zero incident policies and certified site safety audits ensure seamless execution.' },
                            { icon: <Cpu size={28} />, title: 'Smart Engineering', desc: 'Leveraging modern architectural models and smart systems to futureproof every structure.' },
                            { icon: <Clock size={28} />, title: 'Guaranteed Timelines', desc: 'Advanced Gantt mapping and rapid logistical backups keep projects aligned to timelines.' }
                        ].map((adv, index) => (
                            <motion.div
                                key={adv.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-8 bg-gray-50 hover:bg-white border border-gray-150/60 hover:border-gold/20 hover:shadow-2xl hover:-translate-y-2 rounded-2xl transition-all duration-300 flex flex-col items-center text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-6">
                                    {adv.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-3">{adv.title}</h3>
                                <p className="text-sm text-luxury-textMuted leading-relaxed">{adv.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Worker section removed */}

            {/* 8. STATISTICS COUNTER */}
            <section className="py-20 bg-luxury-text text-white relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div>
                        <span className="text-4xl sm:text-5xl font-bold text-gold block">25+</span>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-widest block mt-2">Years of Service</span>
                    </div>
                    <div>
                        <span className="text-4xl sm:text-5xl font-bold text-gold block">650+</span>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-widest block mt-2">Projects Completed</span>
                    </div>
                    <div>
                        <span className="text-4xl sm:text-5xl font-bold text-gold block">100%</span>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-widest block mt-2">Quality Standards</span>
                    </div>
                    <div>
                        <span className="text-4xl sm:text-5xl font-bold text-gold block">95%</span>
                        <span className="text-xs uppercase text-gray-400 font-bold tracking-widest block mt-2">Client Success Rate</span>
                    </div>
                </div>
            </section>

            {/* 9. TESTIMONIALS SLIDER */}
            <section className="py-24 bg-white text-luxury-text relative">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Testimonials</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3 mb-16">
                        What Our Clients <span className="text-gold">Say</span>
                    </h2>

                    <div className="relative bg-gray-50 border border-gray-150/60 p-8 sm:p-12 rounded-3xl min-h-[250px] flex flex-col justify-center shadow-md">
                        <p className="text-base sm:text-xl text-luxury-text italic leading-relaxed font-light mb-8">
                            "{testimonials[activeTestimonial].quote}"
                        </p>
                        <div>
                            <h4 className="font-bold text-lg text-luxury-text">{testimonials[activeTestimonial].name}</h4>
                            <span className="text-xs uppercase font-bold tracking-wider text-gold mt-1 block">
                                {testimonials[activeTestimonial].role}
                            </span>
                        </div>

                        {/* Slide Arrows */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={handlePrevTestimonial}
                                className="w-10 h-10 rounded-full border border-gray-200 hover:border-gold text-luxury-text hover:text-gold flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNextTestimonial}
                                className="w-10 h-10 rounded-full border border-gray-200 hover:border-gold text-luxury-text hover:text-gold flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 10. CAREERS PREVIEW */}
            <section className="py-24 bg-gray-50 text-luxury-text border-t border-gray-150">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Join Our Team</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3 mb-6">
                            Build Your Career With <span className="text-gold">TitanCore</span>
                        </h2>
                        <p className="text-luxury-textMuted leading-relaxed text-base mb-8">
                            We look for enthusiastic thinkers, safety-oriented operators, and structural visionaries to execute top-end projects globally. Learn about internships and permanent openings.
                        </p>
                        <Link
                            to="/careers"
                            className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3.5 rounded-lg shadow-md transition-colors text-sm inline-block"
                        >
                            Browse Open Positions
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="p-6 bg-white border border-gray-150/60 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-gold/20 transition-all duration-300"
                            >
                                <span className="bg-gold/10 text-gold text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                    {job.type}
                                </span>
                                <h3 className="font-bold text-lg mt-2 text-luxury-text">{job.title}</h3>
                                <div className="flex justify-between items-center text-xs text-luxury-textMuted mt-4">
                                    <span>📍 {job.location}</span>
                                    <span className="font-semibold text-luxury-text">{job.salary}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 11. CONTACT CTA */}
            <section className="py-24 bg-white text-luxury-text border-t border-gray-100">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-gray-50 border border-gray-150/60 rounded-3xl p-8 sm:p-16 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl relative overflow-hidden">
                        {/* Background design elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl"></div>

                        <div className="relative flex flex-col gap-3">
                            <span className="text-xs uppercase tracking-wider text-gold font-bold">Have A Project In Mind?</span>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-luxury-text">
                                Let's Build Something Great Together
                            </h2>
                            <p className="text-sm text-luxury-textMuted max-w-md mt-1 leading-relaxed">
                                Contact our estimation experts today to schedule a site analysis and get a free comprehensive quote.
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="bg-gold hover:bg-gold-dark text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-gold/20 flex items-center justify-center gap-2 group transition-all shrink-0 cursor-pointer"
                        >
                            Get A Free Quote
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
