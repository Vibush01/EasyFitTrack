import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const BookSession = () => {
    const { user } = useContext(AuthContext);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [bookedSessions, setBookedSessions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchAvailableSchedules = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/trainer/member/available-schedules`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAvailableSchedules(res.data);
            } catch (err) {
                setError('Failed to fetch available schedules');
                toast.error('Failed to fetch available schedules' + err, { position: 'top-right' });
            }
        };

        const fetchBookedSessions = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/trainer/member/booked-sessions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookedSessions(res.data);
            } catch (err) {
                setError('Failed to fetch booked sessions');
                toast.error('Failed to fetch booked sessions' + err, { position: 'top-right' });
            }
        };

        if (user?.role === 'member') {
            fetchAvailableSchedules();
            fetchBookedSessions();
        }
    }, [user]);

    const handleBookSession = async (scheduleId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/trainer/book-session/${scheduleId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailableSchedules(availableSchedules.filter((schedule) => schedule._id !== scheduleId));
            setBookedSessions([res.data.schedule, ...bookedSessions]);
            setSuccess('Session booked successfully');
            toast.success('Session booked successfully', { position: 'top-right' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book session');
            toast.error(err.response?.data?.message || 'Failed to book session', { position: 'top-right' });
        }
    };

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const zoomIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const buttonHover = {
        hover: { scale: 1.05, boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', transition: { duration: 0.3 } },
    };

    if (user?.role !== 'member') {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 transition-colors duration-300">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Members.
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-5 fixed"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/95 to-[var(--bg-primary)] fixed"></div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[var(--text-primary)] tracking-tight"
                >
                    Book a Session
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
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl mb-8 text-center backdrop-blur-sm"
                    >
                        {success}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Available Schedules */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-[var(--bg-card)]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-color)]"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] flex items-center">
                            <span className="bg-blue-600 w-1.5 h-8 rounded-full mr-3"></span>
                            Available Schedules
                        </h2>
                        {availableSchedules.length > 0 ? (
                            <div className="space-y-4">
                                {availableSchedules.map((schedule) => (
                                    <motion.div
                                        key={schedule._id}
                                        className="bg-[var(--bg-secondary)]/50 p-5 rounded-xl border border-[var(--border-color)] hover:border-blue-500/50 transition-all duration-300"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-[var(--text-primary)] font-semibold text-lg">{schedule.trainer.name}</p>
                                                <p className="text-[var(--text-secondary)] text-sm">{schedule.trainer.email}</p>
                                            </div>
                                            <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                                                {schedule.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-[var(--text-secondary)] text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Start: {new Date(schedule.startTime).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center text-[var(--text-secondary)] text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>End: {new Date(schedule.endTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => handleBookSession(schedule._id)}
                                            whileHover="hover"
                                            variants={buttonHover}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300"
                                        >
                                            Book Session
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-secondary)]/50 p-8 rounded-xl text-center text-[var(--text-secondary)] italic border border-[var(--border-color)] border-dashed">
                                No available schedules at the moment
                            </div>
                        )}
                    </motion.div>

                    {/* Booked Sessions */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-[var(--bg-card)]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-color)]"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] flex items-center">
                            <span className="bg-purple-600 w-1.5 h-8 rounded-full mr-3"></span>
                            Your Booked Sessions
                        </h2>
                        {bookedSessions.length > 0 ? (
                            <div className="space-y-4">
                                {bookedSessions.map((session) => (
                                    <motion.div
                                        key={session._id}
                                        className="bg-[var(--bg-secondary)]/50 p-5 rounded-xl border border-[var(--border-color)] hover:border-purple-500/50 transition-all duration-300"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={zoomIn}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-[var(--text-primary)] font-semibold text-lg">{session.trainer.name}</p>
                                                <p className="text-[var(--text-secondary)] text-sm">{session.trainer.email}</p>
                                            </div>
                                            <span className="bg-purple-500/10 text-purple-500 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                                                {session.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-3">
                                            <div className="flex items-center text-[var(--text-secondary)] text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{new Date(session.startTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center text-[var(--text-secondary)] text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-[var(--text-secondary)] text-xs text-right">
                                            Booked on: {new Date(session.createdAt).toLocaleDateString()}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-secondary)]/50 p-8 rounded-xl text-center text-[var(--text-secondary)] italic border border-[var(--border-color)] border-dashed">
                                No booked sessions yet
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BookSession;