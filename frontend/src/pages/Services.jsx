import React from 'react';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Building2, Paintbrush, HardHat, ShieldAlert, Compass, Hammer } from 'lucide-react';
import servicesBg from '../assets/services/services.jpg';

const Services = () => {
    const services = [
        { icon: <HomeIcon size={32} />, title: 'Residential Construction', desc: 'Custom luxury estates, modular apartments, and eco-friendly smart housing systems incorporating high-grade insulations and automation.' },
        { icon: <Building2 size={32} />, title: 'Commercial Buildings', desc: 'A-grade skyscrapers, column-free office structures, retail malls, and industrial warehouses built with high structural efficiency.' },
        { icon: <Compass size={32} />, title: 'Architecture Planning', desc: 'Exquisite 3D modeling, blueprint drafting, landscaping, and space optimization services matching corporate requirements.' },
        { icon: <Paintbrush size={32} />, title: 'Interior Design', desc: 'Bespoke marble fittings, premium wood wall panels, luxury light planning, and kitchen/bathroom cabinetry overhauls.' },
        { icon: <HardHat size={32} />, title: 'Road Construction', desc: 'Prestressed concrete highways, multi-lane flyover bridges, and structural concrete viaducts designed to support high volume transits.' },
        { icon: <Hammer size={32} />, title: 'Steel Structure Work', desc: 'Heavy load structural steel framework fabrication, custom trusses, high strength welding, and composite decks.' },
        { icon: <ShieldAlert size={32} />, title: 'Renovation & Retrofitting', desc: 'Reinforcing legacy foundations, modern facade updates, seismic retrofits, and energy efficient mechanical replacements.' }
    ];

    return (
        <div className="w-full bg-white text-luxury-text">

            {/* Services Header */}
            <section className="relative pt-46 pb-46 bg-cover bg-center text-white" style={{ backgroundImage: `url(${servicesBg})`, backgroundPosition: "center 0%" }}>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block">Engineering Capabilities</span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-poppins text-white">
                        Our Construction <span className="text-gold">Services</span>
                    </h1>
                    <p className="text-gray-300 max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
                        Professional general contracting and specialized engineering divisions built to handle complex design requirements.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((srv, index) => (
                        <motion.div
                            key={srv.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="p-8 bg-white border border-gray-150/60 rounded-2xl shadow-sm hover:shadow-xl hover:border-gold/25 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {srv.icon}
                                </div>
                                <h3 className="text-xl font-bold text-luxury-text mb-4 group-hover:text-gold transition-colors">
                                    {srv.title}
                                </h3>
                                <p className="text-sm text-luxury-textMuted leading-relaxed">
                                    {srv.desc}
                                </p>
                            </div>

                            <div className="border-t border-gray-100/60 pt-6 mt-8 flex items-center justify-between text-xs text-gold font-bold uppercase tracking-wider">
                                <span>Certified Division</span>
                                <span className="text-gray-300 group-hover:text-gold transition-colors font-light">★ ★ ★ ★ ★</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-gray-50 border-t border-gray-150">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">Workflow Blueprint</span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 mb-16">
                        How We Execute <span className="text-gold">Projects</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                        {[
                            { step: '01', title: 'Consultation & Drafts', desc: 'Aligning structural needs, budgeting estimates, and initial architectural sketches.' },
                            { step: '02', title: 'Engineering & Modeling', desc: 'Executing 3D BIM models, load math, safety planning, and local permitting.' },
                            { step: '03', title: 'Site Work & Construction', desc: 'Excavation, framing, pouring concrete, erecting steel, and installing core utilities.' },
                            { step: '04', title: 'Inspection & Finishing', desc: 'Conducting electrical/plumbing safety audits, facade detailing, and handover audits.' }
                        ].map((item) => (
                            <div key={item.step} className="p-6 bg-white border border-gray-200/60 rounded-xl relative shadow-sm">
                                <span className="text-5xl font-bold text-gold/10 absolute top-4 right-4">{item.step}</span>
                                <h3 className="font-bold text-lg text-luxury-text mb-3">{item.title}</h3>
                                <p className="text-xs text-luxury-textMuted leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Services;
