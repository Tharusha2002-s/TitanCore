import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Eye, ShieldCheck, Target, Users } from 'lucide-react';
import aboutBg from '../assets/about/about.jpg';
import ceoImg from '../assets/about/CEO Elena Rostova.jpg';
import elenaImg from '../assets/about/Elena Rostova.jpg';
import marcusImg from '../assets/about/Marcus Sterling.jpg';
import danielImg from '../assets/about/Daniel Park.jpg';

const About = () => {
    const timeline = [
        { year: '2001', title: 'Company Founding', desc: 'TitanCore was founded with three builders and a single commercial concrete mixers truck.' },
        { year: '2008', title: 'Expansion to Commercial', desc: 'Acquired state contracts and built our first major ten-story corporate office hub.' },
        { year: '2015', title: 'Sustainable Cladding Launch', desc: 'Pioneered eco-friendly construction models incorporating smart solar facades.' },
        { year: '2026', title: 'Global Recognition', desc: 'Awarded the LEED Platinum certification for excellence in smart urban design.' }
    ];

    const team = [
        { name: 'Elena Rostova', role: 'CEO & Founder', image: elenaImg },
        { name: 'Marcus Sterling', role: 'Chief Structural Architect', image: marcusImg },
        { name: 'Daniel Park', role: 'Director of Engineering', image: danielImg }
    ];

    return (
        <div className="w-full bg-white text-luxury-text">

            {/* Page Header */}
            <section className="relative pt-46 pb-46 bg-cover bg-center text-white" style={{ backgroundImage: `url(${aboutBg})` }}>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block">Corporate Profile</span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-poppins text-white">
                        About Our <span className="text-gold">Company</span>
                    </h1>
                    <p className="text-gray-300 max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
                        Delivering landmark construction and infrastructure developments across the globe for over two decades.
                    </p>
                </div>
            </section>

            {/* CEO Message */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={ceoImg}
                            alt="CEO Elena Rostova"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col gap-6">
                        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Leadership Message</span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-luxury-text font-poppins">
                            Building Trust Through <span className="text-gold">Precision</span>
                        </h2>
                        <p className="text-luxury-text italic text-base sm:text-lg leading-relaxed text-gray-700 font-light">
                            "We believe that a structure is only as strong as the integrity of the people who build it. For 25 years, TitanCore has stood for transparency, engineering perfection, and safety on site."
                        </p>
                        <div className="text-sm">
                            <h4 className="font-bold text-luxury-text">Elena Rostova</h4>
                            <span className="text-xs text-gold uppercase font-bold tracking-wider">CEO & Founder, TitanCore</span>
                        </div>
                        <p className="text-sm text-luxury-textMuted leading-relaxed">
                            Elena Rostova started TitanCore with a focus on smart design. Today, the firm employs over 480 specialized builders and has successfully completed high-rises, residential communities, and major flyovers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Mission */}
                    <div className="bg-white p-8 rounded-2xl jetwing-card group flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                            <Target size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-3 jetwing-card-title">Our Mission</h3>
                            <p className="text-sm text-luxury-textMuted leading-relaxed">
                                To engineer secure, high-value, and ecological structures using premier materials, satisfying architectural design requests while maintaining zero incidence safety standards.
                            </p>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="bg-white p-8 rounded-2xl jetwing-card group flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                            <Eye size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-3 jetwing-card-title">Our Vision</h3>
                            <p className="text-sm text-luxury-textMuted leading-relaxed">
                                To define modern luxury construction globally, leading transitions toward self-powered solar cladded workspaces and smart green housing networks.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Company Timeline */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Historical Milestones</span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-luxury-text mt-3">
                            Our Journey Over the <span className="text-gold">Years</span>
                        </h2>
                    </div>

                    <div className="relative border-l border-gold/30 pl-8 space-y-12">
                        {timeline.map((item, index) => (
                            <div key={item.year} className="relative">
                                {/* Gold Circle Indicator */}
                                <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-gold flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gold"></div>
                                </div>
                                <span className="text-xl font-bold text-gold">{item.year}</span>
                                <h3 className="text-lg font-bold text-luxury-text mt-1">{item.title}</h3>
                                <p className="text-sm text-luxury-textMuted mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Executive Team */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Executive Board</span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3">
                            Meet Our <span className="text-gold">Leaders</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member) => (
                            <div key={member.name} className="bg-white rounded-2xl overflow-hidden jetwing-card group">
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover img-zoom" />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="font-bold text-lg text-luxury-text jetwing-card-title">{member.name}</h3>
                                    <span className="text-xs uppercase text-gold font-semibold tracking-wider block mt-1">{member.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Awards & Certifications */}
            <section className="py-20 bg-white text-luxury-text">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
                    <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
                        <Award className="text-gold w-10 h-10" />
                        <h4 className="font-bold text-sm mt-2">LEED Platinum</h4>
                        <span className="text-[10px] text-luxury-textMuted uppercase tracking-wider">Sustainable Design</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
                        <Users className="text-gold w-10 h-10" />
                        <h4 className="font-bold text-sm mt-2">OSHA Safety Star</h4>
                        <span className="text-[10px] text-luxury-textMuted uppercase tracking-wider">Site Safety Excellence</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
                        <ShieldCheck className="text-gold w-10 h-10" />
                        <h4 className="font-bold text-sm mt-2">ISO 9001:2015</h4>
                        <span className="text-[10px] text-luxury-textMuted uppercase tracking-wider">Quality Audited</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
                        <Compass className="text-gold w-10 h-10" />
                        <h4 className="font-bold text-sm mt-2">Green Build Award</h4>
                        <span className="text-[10px] text-luxury-textMuted uppercase tracking-wider">Best Ecological Cladding</span>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
