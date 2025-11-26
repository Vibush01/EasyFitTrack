import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const GymList = () => {
    const { user } = useContext(AuthContext);
    const [gyms, setGyms] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const res = await axios.get(`${API_URL}/gym`);
                setGyms(res.data);
            } catch (err) {
                setError('Failed to fetch gyms');
                toast.error('Failed to fetch gyms' + err, { position: 'top-right' });
            }
        };
        fetchGyms();
    }, []);

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
        hover: { scale: 1.05, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', transition: { duration: 0.3 } },
    };

    if (user?.role !== 'member' && user?.role !== 'trainer') {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 transition-colors duration-300">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Members and Trainers.
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="container mx-auto">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[var(--text-primary)] tracking-tight"
                >
                    Available Gyms
                </motion.h1>
                {error && (
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="text-red-500 mb-6 text-center text-sm sm:text-base"
                    >
                        {error}
                    </motion.p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gyms.map((gym) => (
                        <motion.div
                            key={gym._id}
                            className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[var(--border-color)]"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={zoomIn}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]">{gym.gymName}</h2>
                            <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-4">{gym.address}</p>
                            <motion.div whileHover="hover" variants={buttonHover}>
                                <Link
                                    to={`/gym/${gym._id}`}
                                    className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-center text-sm sm:text-base font-semibold"
                                    aria-label={`View details of ${gym.gymName}`}
                                >
                                    View Details
                                </Link>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GymList;