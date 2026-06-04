import React from 'react';
import { MessageSquare } from 'lucide-react';

const WhatsAppButton = () => {
    const phoneNumber = '94788788208'; // Replace with company number
    const message = 'Hello TitanCore Construction, I would like to get a quote for a construction project.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            {/* Icon */}
            <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.48 1.973 14.007.948 11.99.948 6.554.948 2.13 5.318 2.127 10.75c-.001 1.71.463 3.38 1.343 4.844l-.997 3.642 3.73-.974.001-.002zM15.89 12.53c-.23-.115-1.36-.672-1.57-.75-.21-.077-.36-.115-.51.115-.15.23-.58.73-.71.88-.13.15-.26.17-.49.055-.23-.115-.97-.357-1.85-1.142-.68-.606-1.14-1.355-1.27-1.586-.13-.23-.01-.354.1-.47.1-.1.23-.268.35-.4.12-.133.16-.23.24-.384.08-.154.04-.288-.02-.403-.06-.115-.51-1.23-.7-1.685-.18-.44-.37-.38-.51-.387h-.44c-.15 0-.39.056-.6.288-.21.23-.8.78-.8 1.902 0 1.12.82 2.202.93 2.356.11.154 1.61 2.46 3.91 3.454.55.236.98.377 1.32.484.55.174 1.05.15 1.44.093.44-.064 1.36-.556 1.55-1.094.19-.537.19-.997.13-1.094-.05-.093-.2-.154-.43-.269z" />
            </svg>
            {/* Tooltip */}
            <span className="absolute right-14 scale-0 group-hover:scale-100 transition-all duration-200 bg-black text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg">
                WhatsApp Support
            </span>
        </a>
    );
};

export default WhatsAppButton;
