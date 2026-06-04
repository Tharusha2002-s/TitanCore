import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to TitanCore Construction! How can I help you today?", isBot: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: inputText,
            isBot: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Mock bot responses based on keyword analysis
        setTimeout(() => {
            let replyText = "Thank you for reaching out! A representative will connect with you shortly. You can also contact us directly at sangeetht274@gmail.com.";
            const inputLower = userMsg.text.toLowerCase();

            if (inputLower.includes('hire') || inputLower.includes('worker')) {
                replyText = "We offer complete general contracting and engineering services directly. Please visit our Services page or Contact page to submit a project inquiry.";
            } else if (inputLower.includes('job') || inputLower.includes('career') || inputLower.includes('intern')) {
                replyText = "Interested in joining our team? Check out our Careers page! You can browse current openings, submit your CV, and track your application status online.";
            } else if (inputLower.includes('project') || inputLower.includes('portfolio')) {
                replyText = "We have completed many luxury projects like Skyline Residences and Green Valley Complex. View details, budget, and images on our Projects page!";
            } else if (inputLower.includes('price') || inputLower.includes('cost') || inputLower.includes('budget') || inputLower.includes('estimate') || inputLower.includes('quote')) {
                replyText = "For project cost estimates, please use the contact form on our Contact Page, or call our office at +94788788208 to speak with our estimation desk.";
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: replyText,
                isBot: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-gold hover:bg-gold-dark text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    aria-label="Open Live Chat"
                >
                    <MessageSquare size={24} />
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white border border-gray-150 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-luxury-text text-white p-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/25 border border-gold flex items-center justify-center">
                                <User size={20} className="text-gold" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm tracking-wide text-white">TitanCore Assistant</h4>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] text-gray-300 font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${msg.isBot
                                            ? 'bg-white text-luxury-text border border-gray-100 rounded-tl-none'
                                            : 'bg-gold text-white rounded-tr-none'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">{msg.time}</span>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-luxury-textMuted text-xs px-2">
                                <span className="font-semibold">Assistant is typing</span>
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Form Input Footer */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-150 flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 bg-gray-50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-luxury-text"
                        />
                        <button
                            type="submit"
                            className="bg-gold hover:bg-gold-dark text-white p-3 rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default LiveChat;
