// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap, Calendar, Users, Mail, Phone, MapPin,
    Menu, X, Star, BookOpen, TrendingUp, Sparkles,
    ChevronRight, Award, Globe, Heart, Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import { useRef } from "react";

export const LandingPage = ({ onEnter, data }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        phone: "",
        type: "inquiry",
        subject: "",
        message: ""
    });
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contactLoading, setContactLoading] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);
    const [contactError, setContactError] = useState("");
    const navigate = useNavigate();

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch events
                const eventsResponse = await axiosInstance.get('/events');
                setEvents(eventsResponse.data || []);

                // Fetch announcements
                const announcementsResponse = await axiosInstance.get('/announcements');
                setAnnouncements(announcementsResponse.data || []);

                // Fetch testimonials
                const testimonialsResponse = await axiosInstance.get('/testimonials');
                setTestimonials(testimonialsResponse.data || []);

            } catch (error) {
                console.error('Error fetching data:', error);
                // Set empty arrays on error
                setEvents([]);
                setAnnouncements([]);
                setTestimonials([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setShowLogin(false);
        setShowRegister(false);
        setFormData({ name: "", email: "", password: "", role: "student" });
    };

    const successRef = useRef(null);
    const errorRef = useRef(null);

    // Auto-scroll to success
    useEffect(() => {
        if (contactSuccess) {
            successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [contactSuccess]);
    useEffect(() => {
        if (contactError) {
            errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [contactError]);

    const handleContactSubmit = async (e) => {
        e.preventDefault(); // ← CRITICAL

        if (contactLoading) return;

        setContactLoading(true);
        setContactSuccess(false);
        setContactError("");

        try {
            const contactData = {
                senderName: contactForm.name,
                senderEmail: contactForm.email,
                senderPhone: contactForm.phone || undefined,
                type: contactForm.type,
                subject: contactForm.subject,
                message: contactForm.message,
            };

            await axiosInstance.post('/contactMessage', contactData);

            // SUCCESS
            setContactSuccess(true);
            setContactForm({
                name: "", email: "", phone: "", type: "inquiry", subject: "", message: ""
            });

            // Hide after 5s
            setTimeout(() => setContactSuccess(false), 5000);

        } catch (error) {
            const msg = error.response?.data?.message || "Failed to send message.";
            setContactError(msg);
            setTimeout(() => setContactError(""), 5000);
        } finally {
            setContactLoading(false);
        }
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            {/* GLOBAL WRAPPER – NO HORIZONTAL SCROLL */}
            <div className="overflow-x-hidden">

                {/* NAVIGATION */}
                <motion.nav
                    initial={{ y: -120 }}
                    animate={{ y: 0 }}
                    className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 shadow-lg border-b border-white/20"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 blur-xl opacity-70"></div>
                                    <div className="relative bg-gradient-to-r from-violet-600 to-pink-600 p-2 rounded-2xl shadow-xl">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h1 className="font-black text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    BrightPath
                                </h1>
                            </motion.div>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center gap-10">
                                {["About", "Events", "Testimonials", "Contact"].map((item) => (
                                    <motion.a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        className="text-gray-700 hover:text-violet-600 font-semibold transition-all duration-300 relative group"
                                    >
                                        {item}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                                    </motion.a>
                                ))}
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 30px rgba(139, 92, 246, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/login")}
                                    className="px-7 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-full shadow-xl font-bold text-sm tracking-wide relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Login</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </motion.button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                {isMenuOpen ? <X className="w-6 h-6 text-violet-600" /> : <Menu className="w-6 h-6 text-violet-600" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
                            >
                                <div className="px-6 py-5 space-y-4">
                                    {["About", "Events", "Testimonials", "Contact"].map((item) => (
                                        <a
                                            key={item}
                                            href={`#${item.toLowerCase()}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-lg font-semibold text-gray-700 hover:text-violet-600 transition-colors"
                                        >
                                            {item}
                                        </a>
                                    ))}
                                    <button
                                        onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                                        className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl font-bold shadow-lg"
                                    >
                                        Login
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>

                {/* HERO SECTION */}
                <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>
                    <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>

                    <div className="relative max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-lg rounded-full border border-white/50 shadow-lg mb-6"
                        >
                            <Sparkles className="w-5 h-5 text-violet-600" />
                            <span className="text-sm font-semibold text-violet-700">Excellence in Education Since 2000</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9 }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-violet-700 via-purple-700 to-pink-700 bg-clip-text text-transparent leading-tight"
                        >
                            BrightPath
                            <br />
                            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                                School
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 text-lg md:text-xl text-gray-700 max-w-4xl mx-auto font-medium"
                        >
                            Where every child <span className="text-violet-600 font-bold">shines</span>,
                            <span className="text-pink-600 font-bold"> grows</span>, and
                            <span className="text-purple-600 font-bold"> leads</span>.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 25px 40px rgba(139, 92, 246, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/login")}
                                className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl shadow-2xl font-bold text-lg flex items-center justify-center gap-2 relative overflow-hidden"
                            >
                                <span className="relative z-10">Login</span>
                                <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 25px 40px rgba(236, 72, 153, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const contactSection = document.getElementById('contact');
                                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 bg-white/80 backdrop-blur-lg text-violet-700 border-2 border-violet-300 rounded-2xl shadow-xl font-bold text-lg"
                            >
                                Contact Us
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
                        >
                            {[
                                { number: "1500+", label: "Happy Students", icon: Users },
                                { number: "50+", label: "Expert Faculty", icon: Award },
                                { number: "98%", label: "Success Rate", icon: TrendingUp },
                                { number: "20+", label: "Years of Legacy", icon: Globe }
                            ].map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 60 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                        whileHover={{ y: -10, scale: 1.05 }}
                                        className="relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                                        <div className="relative bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
                                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl">
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">
                                                {stat.number}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-600 mt-1">{stat.label}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* ABOUT US */}
                <section id="about" className="py-20 px-4 bg-gradient-to-b from-purple-50/50 to-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-800">
                                        Shaping <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Tomorrow's Leaders</span>
                                    </h2>
                                    <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                                        Founded in 2000, BrightPath School blends academic rigor with character building,
                                        creativity, and digital fluency to prepare students for a dynamic future.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {[
                                        { icon: BookOpen, title: "Academic Excellence", desc: "CBSE curriculum with 98% success rate" },
                                        { icon: Heart, title: "Holistic Growth", desc: "Sports, arts, leadership & emotional intelligence" },
                                        { icon: Globe, title: "Global Readiness", desc: "Digital LMS, coding, AI & global exposure" }
                                    ].map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -40 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.2 }}
                                                className="flex gap-4 group"
                                            >
                                                <div className="w-14 h-14 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <Icon className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xl text-gray-800">{item.title}</h4>
                                                    <p className="text-gray-600">{item.desc}</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
                                    <h3 className="text-3xl font-black mb-4 flex items-center gap-3">
                                        <Sparkles className="w-8 h-8" /> Our Vision
                                    </h3>
                                    <p className="text-lg leading-relaxed opacity-95">
                                        To nurture confident, compassionate, and innovative leaders who will shape a better world.
                                    </p>
                                </div>
                                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full blur-3xl opacity-40"></div>
                                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full blur-3xl opacity-30"></div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* EVENTS */}
                <section id="events" className="py-20 px-4 bg-gradient-to-b from-white to-violet-50/30">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-violet-700 to-pink-700 bg-clip-text text-transparent mb-16 pb-2"
                        >
                            Upcoming Events
                        </motion.h2>
                        {loading ? (
                            <div className="text-center">
                                <div className="inline-block w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-600">Loading events...</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="text-center text-gray-600">
                                <p className="text-lg">No upcoming events at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-8">
                                {events.slice(0, 6).map((event, i) => (
                                    <motion.div
                                        key={event.id || event._id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                        whileHover={{ y: -12, scale: 1.03 }}
                                        className="group relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
                                        <div className="relative bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl">
                                                    <Calendar className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xl text-gray-800">{event.title}</h4>
                                                    <p className="text-sm text-violet-600 font-semibold">
                                                        {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'Date TBA'}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">{event.description || event.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-violet-700 to-pink-700 bg-clip-text text-transparent mb-16 pb-2"
                        >
                            Loved by Parents
                        </motion.h2>
                        {loading ? (
                            <div className="text-center">
                                <div className="inline-block w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-600">Loading testimonials...</p>
                            </div>
                        ) : testimonials.length === 0 ? (
                            <div className="text-center text-gray-600">
                                <p className="text-lg">No testimonials available yet.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-8">
                                {testimonials.slice(0, 6).map((t, i) => (
                                    <motion.div
                                        key={t.id || t._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.15 }}
                                        whileHover={{ y: -8 }}
                                        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50"
                                    >
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <p className="italic text-gray-700 text-lg mb-6 leading-relaxed">"{t.message || t.content}"</p>
                                        <p className="font-bold text-xl bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                                            — {t.parent || t.name}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ANNOUNCEMENTS */}
                <section id="announcements" className="py-20 px-4 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-violet-700 to-pink-700 bg-clip-text text-transparent mb-16"
                        >
                            Latest Updates
                        </motion.h2>
                        {loading ? (
                            <div className="text-center">
                                <div className="inline-block w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-600">Loading announcements...</p>
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="text-center text-gray-600">
                                <p className="text-lg">No announcements at this time.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {announcements.slice(0, 5).map((a, i) => (
                                    <motion.div
                                        key={a.id || a._id}
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group bg-gradient-to-r from-violet-500 to-pink-500 p-1 rounded-3xl shadow-lg hover:shadow-2xl transition-all"
                                    >
                                        <div className="bg-white p-6 rounded-3xl h-full">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                <h3 className="font-bold text-xl text-violet-700 group-hover:text-violet-800 transition-colors">
                                                    {a.title}
                                                </h3>
                                                <span className="text-sm font-semibold text-pink-600">
                                                    {a.date ? new Date(a.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : ''}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-gray-600">{a.content || a.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CONTACT */}
                <section id="contact" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-6xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-violet-700 to-pink-700 bg-clip-text text-transparent mb-16"
                        >
                            Get in Touch
                        </motion.h2>
                        <div className="grid lg:grid-cols-2 gap-12">
                            <motion.form

                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                onSubmit={handleContactSubmit}
                                className="space-y-6"
                            >

                                {/* Gradient Border Wrapper */}
                                <div className="bg-gradient-to-br from-violet-600 to-pink-600 p-1 rounded-3xl">
                                    <div className="bg-white p-6 sm:p-8 rounded-3xl space-y-6">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name *"
                                            value={contactForm.name}
                                            onChange={handleContactChange}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 text-lg transition-all"
                                            required
                                            disabled={contactLoading}
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address *"
                                            value={contactForm.email}
                                            onChange={handleContactChange}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 text-lg transition-all"
                                            required
                                            disabled={contactLoading}
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number (Optional)"
                                            value={contactForm.phone}
                                            onChange={handleContactChange}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 text-lg transition-all"
                                            disabled={contactLoading}
                                        />

                                        <select
                                            name="type"
                                            value={contactForm.type}
                                            onChange={handleContactChange}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 text-lg transition-all text-gray-700"
                                            required
                                            disabled={contactLoading}
                                        >
                                            <option value="inquiry">General Inquiry</option>
                                            <option value="complaint">Complaint</option>
                                            <option value="feedback">Feedback</option>
                                        </select>

                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Subject *"
                                            value={contactForm.subject}
                                            onChange={handleContactChange}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 text-lg transition-all"
                                            required
                                            disabled={contactLoading}
                                        />

                                        <textarea
                                            name="message"
                                            rows={6}
                                            placeholder="Your Message *"
                                            value={contactForm.message}
                                            onChange={handleContactChange}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500 resize-none text-lg transition-all"
                                            required
                                            disabled={contactLoading}
                                        />

                                        <motion.button
                                            whileHover={{ scale: contactLoading ? 1 : 1.02 }}
                                            whileTap={{ scale: contactLoading ? 1 : 0.98 }}
                                            type="submit"
                                            disabled={contactLoading}
                                            className="w-full py-5 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {contactLoading ? (
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">Send Message</span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                                </>
                                            )}
                                        </motion.button>
                                        {/* Success Message */}
                                        <AnimatePresence>
                                            {contactSuccess && (
                                                <motion.div
                                                    ref={successRef}
                                                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                                    className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl p-6 flex items-start gap-4 shadow-lg"
                                                >
                                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-xl text-green-800 mb-1">Message Sent Successfully! 🎉</p>
                                                        <p className="text-green-700 leading-relaxed">
                                                            Thank you for reaching out! We've received your message and our team will get back to you within 24-48 hours.
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Error Message */}
                                        <AnimatePresence>
                                            {contactError && (
                                                <motion.div
                                                    ref={errorRef}
                                                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                                    className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-500 rounded-2xl p-6 shadow-lg"
                                                >
                                                    <p className="font-bold text-xl text-red-800 mb-1">Oops! Something went wrong</p>
                                                    <p className="text-red-700">{contactError}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.form>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="bg-gradient-to-br from-violet-600 to-pink-600 p-1 rounded-3xl">
                                    <div className="bg-white p-8 rounded-3xl">
                                        <h3 className="text-2xl font-black text-gray-800 mb-6">Visit Us</h3>
                                        <div className="space-y-5 text-gray-700">
                                            <p className="flex items-start gap-4">
                                                <MapPin className="w-6 h-6 text-violet-600 mt-1 flex-shrink-0" />
                                                <span>123 Learning Street, Education City, State 123456</span>
                                            </p>
                                            <p className="flex items-center gap-4">
                                                <Mail className="w-6 h-6 text-violet-600 flex-shrink-0" />
                                                <span>info@brightpath.school</span>
                                            </p>
                                            <p className="flex items-center gap-4">
                                                <Phone className="w-6 h-6 text-violet-600 flex-shrink-0" />
                                                <span>+91 99999 99999</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl border border-white/50">
                                    <h4 className="font-bold text-xl text-gray-800 mb-3">Office Hours</h4>
                                    <div className="space-y-1 text-gray-600">
                                        <p>Monday - Friday: 8:00 AM - 3:00 PM</p>
                                        <p>Saturday: 8:00 AM - 12:00 PM</p>
                                        <p>Sunday: Closed</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            <div>
                                <h4 className="text-2xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                    BrightPath
                                </h4>
                                <p className="text-gray-400">Shaping futures with love, learning, and leadership.</p>
                            </div>
                            <div>
                                <h5 className="font-bold mb-4">Quick Links</h5>
                                <ul className="space-y-2 text-gray-400">
                                    {["About Us", "Events", "Admissions", "Contact"].map((link) => (
                                        <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-bold mb-4">Admissions</h5>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Apply Online</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Fee Structure</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Scholarships</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-bold mb-4">Connect</h5>
                                <div className="flex gap-4">
                                    {["Facebook", "Twitter", "Instagram"].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-600 transition-all"
                                        >
                                            <span className="sr-only">{social}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                            <p>© {new Date().getFullYear()} BrightPath School. Crafted with <Heart className="inline w-4 h-4 text-pink-500" /> in India.</p>
                        </div>
                    </div>
                </footer>

                {/* LOGIN MODAL */}
                <AnimatePresence>
                    {showLogin && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
                            onClick={() => setShowLogin(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/50"
                            >
                                <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                                    Welcome Back
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <input type="email" placeholder="Email" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500" required />
                                    <input type="password" placeholder="Password" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-300 focus:border-violet-500" required />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl"
                                    >
                                        Login
                                    </motion.button>
                                </form>
                                <p className="text-center mt-6 text-gray-600">
                                    New here?{" "}
                                    <button onClick={() => { setShowLogin(false); setShowRegister(true); }} className="text-violet-600 font-bold hover:underline">
                                        Create Account
                                    </button>
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* REGISTER MODAL */}
                <AnimatePresence>
                    {showRegister && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
                            onClick={() => setShowRegister(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/50 max-h-[90vh] overflow-y-auto"
                            >
                                <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                                    Join BrightPath
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-300" required />
                                    <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-300" required />
                                    <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-300" required />
                                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700">
                                        <option value="student">Student</option>
                                        <option value="parent">Parent</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl"
                                    >
                                        Create Account
                                    </motion.button>
                                </form>
                                <p className="text-center mt-6 text-gray-600">
                                    Already registered?{" "}
                                    <button onClick={() => { setShowRegister(false); setShowLogin(true); }} className="text-violet-600 font-bold hover:underline">
                                        Login
                                    </button>
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div> {/* END OF overflow-x-hidden */}
        </>
    );
};

export default LandingPage;