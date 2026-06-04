import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ZoomIn, Loader2 } from 'lucide-react';
import API, { getImageUrl } from '../services/api';
import galleryBg from '../assets/gallery/gallery.jpg';

const Gallery = () => {
    const [filter, setFilter] = useState('all');
    const [lightboxImg, setLightboxImg] = useState(null);
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await API.get('/gallery');
                if (data.success) {
                    setGalleryItems(data.data);
                }
            } catch (err) {
                console.error('Error fetching gallery items:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);


    const categories = [
        { value: 'all', label: 'All Showcase' },
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'interior', label: 'Interior Design' },
        { value: 'steel', label: 'Steel Work' }
    ];

    const filteredItems = filter === 'all'
        ? galleryItems
        : galleryItems.filter((item) => item.category === filter);

    return (
        <div className="w-full bg-white text-luxury-text min-h-screen">

            {/* Gallery Header */}
            <section className="relative pt-46 pb-46 bg-cover bg-center text-white" style={{ backgroundImage: `url(${galleryBg})`, backgroundPosition: "center 50%" }}>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block">Visual Showcase</span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-poppins text-white">
                        Project <span className="text-gold">Gallery</span>
                    </h1>
                </div>
            </section>

            {/* Filter Menu */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2 justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setFilter(cat.value)}
                            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${filter === cat.value
                                ? 'bg-gold text-white shadow-md'
                                : 'bg-gray-50 hover:bg-gray-100 text-luxury-text'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Masonry Image Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-gold" />
                            <p className="text-sm text-gray-500 font-medium">Loading gallery showcase...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-base">No items found in this category.</p>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
                        >
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item._id || item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="break-inside-avoid bg-gray-50 rounded-2xl overflow-hidden shadow-md relative group cursor-pointer"
                                    onClick={() => setLightboxImg(item)}
                                >
                                    <img
                                        src={getImageUrl(item.url)}
                                        alt={item.title}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-103"
                                    />

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                                        <div className="flex justify-end">
                                            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 shadow-sm">
                                                <ZoomIn size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold">{item.category}</span>
                                            <h3 className="text-white font-bold text-sm tracking-wide mt-1">{item.title}</h3>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Fullscreen Lightbox Overlay */}
            <AnimatePresence>
                {lightboxImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
                        onClick={() => setLightboxImg(null)}
                    >
                        <button
                            onClick={() => setLightboxImg(null)}
                            className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={28} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={getImageUrl(lightboxImg.url)}
                                alt={lightboxImg.title}
                                className="max-w-full max-h-[80vh] object-contain mx-auto"
                            />
                            <div className="bg-black/60 backdrop-blur-xs text-white p-4 text-center">
                                <span className="text-[9px] uppercase font-bold text-gold tracking-widest block">{lightboxImg.category}</span>
                                <h4 className="font-bold text-sm mt-1">{lightboxImg.title}</h4>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Gallery;
