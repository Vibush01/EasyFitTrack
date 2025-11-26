import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ViewBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/trainer/bookings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(res.data);
            } catch (err) {
                setError('Failed to fetch bookings');
                toast.error('Failed to fetch bookings' + err, { position: 'top-right' });
            }
        };

        if (user?.role === 'trainer') {
            fetchBookings();
        }
    }, [user]);

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const zoomIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    if (user?.role !== 'trainer') {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 transition-colors duration-300">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Trainers.
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-5 fixed"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/95 to-[var(--bg-primary)] fixed"></div>

            <div className="container mx-auto max-w-4xl relative z-10">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[var(--text-primary)] tracking-tight"
                >
                    View Bookings
                </motion.h1>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-8 text-center backdrop-blur-sm"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Bookings List */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-[var(--bg-card)]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-color)]"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] flex items-center">
                        <span className="bg-blue-600 w-1.5 h-8 rounded-full mr-3"></span>
                        Your Bookings
                    </h2>
                    {bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <motion.div
                                    key={booking._id}
                                    className="bg-[var(--bg-secondary)]/50 p-5 rounded-xl border border-[var(--border-color)] hover:border-blue-500/50 transition-all duration-300"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={zoomIn}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                                {booking.bookedBy.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[var(--text-primary)] font-semibold">{booking.bookedBy.name}</p>
                                                <p className="text-[var(--text-secondary)] text-xs">{booking.bookedBy.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'booked' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-[var(--bg-primary)]/50 p-3 rounded-lg">
                                            <p className="text-[var(--text-secondary)] text-xs uppercase mb-1">Start Time</p>
                                            <p className="text-[var(--text-primary)] text-sm font-medium">
                                                {new Date(booking.startTime).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-[var(--bg-primary)]/50 p-3 rounded-lg">
                                            <p className="text-[var(--text-secondary)] text-xs uppercase mb-1">End Time</p>
                                            <p className="text-[var(--text-primary)] text-sm font-medium">
                                                {new Date(booking.endTime).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-3 border-t border-[var(--border-color)]">
                                        <p className="text-[var(--text-secondary)] text-xs">
                                            Booked on: {new Date(booking.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[var(--bg-secondary)]/50 p-12 rounded-xl text-center border border-[var(--border-color)] border-dashed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--text-secondary)] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-[var(--text-secondary)] text-lg font-medium">No bookings yet</p>
                            <p className="text-[var(--text-secondary)] text-sm mt-2">Your upcoming sessions will appear here.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ViewBookings;