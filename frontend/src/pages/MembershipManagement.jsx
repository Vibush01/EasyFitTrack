import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const MembershipManagement = () => {
    const { user, userDetails } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [membershipRequests, setMembershipRequests] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/gym/members`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMembers(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch members', { position: "top-right" });
            }
        };

        const fetchTrainers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/gym/trainers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTrainers(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch trainers', { position: "top-right" });
            }
        };

        const fetchMembershipRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/gym/membership-requests`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMembershipRequests(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch membership requests', { position: "top-right" });
            }
        };

        if (user?.role === 'gym' || (user?.role === 'trainer' && userDetails?.gym)) {
            fetchMembers();
            fetchMembershipRequests();
            if (user?.role === 'gym') {
                fetchTrainers();
            }
        }
    }, [user, userDetails]);

    const handleUpdateMembership = async () => {
        if (!selectedMember || !duration) {
            toast.error('Please select a member and duration', { position: "top-right" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/gym/members/${selectedMember}/membership`, { duration }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(members.map((member) =>
                member._id === selectedMember
                    ? { ...member, membership: { ...member.membership, duration, endDate: calculateEndDate(duration) } }
                    : member
            ));
            setSelectedMember('');
            setDuration('');
            toast.success('Membership updated successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update membership', { position: "top-right" });
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/gym/members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(members.filter((member) => member._id !== memberId));
            setMembershipRequests(membershipRequests.filter((req) => req.member._id !== memberId));
            toast.success('Member removed successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member', { position: "top-right" });
        }
    };

    const handleRemoveTrainer = async (trainerId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/gym/trainers/${trainerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrainers(trainers.filter((trainer) => trainer._id !== trainerId));
            toast.success('Trainer removed successfully', { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove trainer', { position: "top-right" });
        }
    };

    const handleRequestAction = async (requestId, action) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/gym/membership-requests/${requestId}/action`, { action }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembershipRequests(membershipRequests.map((req) =>
                req._id === requestId ? res.data.membershipRequest : req
            ));
            if (action === 'approve') {
                const memberId = res.data.membershipRequest.member._id;
                const duration = res.data.membershipRequest.requestedDuration;
                setMembers(members.map((member) =>
                    member._id === memberId
                        ? { ...member, membership: { ...member.membership, duration, endDate: calculateEndDate(duration) } }
                        : member
                ));
            }
            toast.success(`Membership request ${action}d`, { position: "top-right" });
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action} request`, { position: "top-right" });
        }
    };

    const calculateEndDate = (duration) => {
        const startDate = new Date();
        let endDate;
        switch (duration) {
            case '1 week':
                endDate = new Date(startDate.setDate(startDate.getDate() + 7));
                break;
            case '1 month':
                endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
                break;
            case '3 months':
                endDate = new Date(startDate.setMonth(startDate.getMonth() + 3));
                break;
            case '6 months':
                endDate = new Date(startDate.setMonth(startDate.getMonth() + 6));
                break;
            case '1 year':
                endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
                break;
            default:
                endDate = new Date();
        }
        return endDate;
    };

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const buttonHover = {
        hover: { scale: 1.05, boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', transition: { duration: 0.3 } },
    };

    if (user?.role !== 'gym' && user?.role !== 'trainer') {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 transition-colors duration-300">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    Access denied. This page is only for Gym Profiles and Trainers.
                </motion.p>
            </div>
        );
    }

    if (user?.role === 'trainer' && !userDetails?.gym) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 transition-colors duration-300">
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-red-500 text-lg sm:text-xl font-semibold text-center"
                >
                    You must be associated with a gym to manage memberships.
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="container mx-auto max-w-6xl">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[var(--text-primary)] tracking-tight"
                >
                    Membership Management
                </motion.h1>

                {/* Update Membership Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-color)] mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] flex items-center">
                        <span className="bg-blue-600 w-1 h-8 rounded-full mr-3"></span>
                        Update Membership
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-[var(--text-secondary)] font-medium mb-2 text-sm">Select Member</label>
                            <select
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                                className="w-full p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a member</option>
                                {members.map((member) => (
                                    <option key={member._id} value={member._id}>
                                        {member.name} ({member.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-[var(--text-secondary)] font-medium mb-2 text-sm">New Duration</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select duration</option>
                                <option value="1 week">1 Week</option>
                                <option value="1 month">1 Month</option>
                                <option value="3 months">3 Months</option>
                                <option value="6 months">6 Months</option>
                                <option value="1 year">1 Year</option>
                            </select>
                        </div>
                        <motion.button
                            onClick={handleUpdateMembership}
                            whileHover="hover"
                            variants={buttonHover}
                            className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300"
                        >
                            Update
                        </motion.button>
                    </div>
                </motion.div>

                {/* Membership Requests Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-color)] mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] flex items-center">
                        <span className="bg-purple-600 w-1 h-8 rounded-full mr-3"></span>
                        Membership Requests
                    </h2>
                    {membershipRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Member</th>
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Gym</th>
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Duration</th>
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Status</th>
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Requested On</th>
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {membershipRequests.map((request) => (
                                        <tr key={request._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                            <td className="p-4 text-[var(--text-primary)]">
                                                <div className="font-medium">{request.member.name}</div>
                                                <div className="text-xs text-[var(--text-secondary)]">{request.member.email}</div>
                                            </td>
                                            <td className="p-4 text-[var(--text-secondary)]">{request.gym.gymName}</td>
                                            <td className="p-4 text-[var(--text-secondary)]">{request.requestedDuration}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    request.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[var(--text-secondary)] text-sm">{new Date(request.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                {request.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            onClick={() => handleRequestAction(request._id, 'approve')}
                                                            className="bg-green-600/20 text-green-500 px-3 py-1 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium"
                                                        >
                                                            Approve
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            onClick={() => handleRequestAction(request._id, 'deny')}
                                                            className="bg-red-600/20 text-red-500 px-3 py-1 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                                                        >
                                                            Deny
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-[var(--bg-secondary)] p-8 rounded-xl text-center text-[var(--text-secondary)] italic">
                            No membership requests found
                        </div>
                    )}
                </motion.div>

                {/* Members List */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-color)] mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] flex items-center">
                        <span className="bg-green-600 w-1 h-8 rounded-full mr-3"></span>
                        Current Members
                    </h2>
                    {members.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Name</th>
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Email</th>
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Membership</th>
                                        <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">End Date</th>
                                        {user?.role === 'gym' && <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {members.map((member) => (
                                        <tr key={member._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                            <td className="p-4 text-[var(--text-primary)] font-medium">{member.name}</td>
                                            <td className="p-4 text-[var(--text-secondary)]">{member.email}</td>
                                            <td className="p-4 text-[var(--text-secondary)]">{member.membership?.duration || 'N/A'}</td>
                                            <td className="p-4 text-[var(--text-secondary)]">
                                                {member.membership?.endDate
                                                    ? new Date(member.membership.endDate).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                            {user?.role === 'gym' && (
                                                <td className="p-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        onClick={() => handleRemoveMember(member._id)}
                                                        className="bg-red-600/20 text-red-500 px-3 py-1 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                                                    >
                                                        Remove
                                                    </motion.button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-[var(--bg-secondary)] p-8 rounded-xl text-center text-[var(--text-secondary)] italic">
                            No members found
                        </div>
                    )}
                </motion.div>

                {/* Trainers List (Gym Only) */}
                {user?.role === 'gym' && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-color)]"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)] flex items-center">
                            <span className="bg-orange-600 w-1 h-8 rounded-full mr-3"></span>
                            Current Trainers
                        </h2>
                        {trainers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[var(--border-color)]">
                                            <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Name</th>
                                            <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Email</th>
                                            <th className="p-4 text-[var(--text-secondary)] font-medium text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {trainers.map((trainer) => (
                                            <tr key={trainer._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                                <td className="p-4 text-[var(--text-primary)] font-medium">{trainer.name}</td>
                                                <td className="p-4 text-[var(--text-secondary)]">{trainer.email}</td>
                                                <td className="p-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        onClick={() => handleRemoveTrainer(trainer._id)}
                                                        className="bg-red-600/20 text-red-500 px-3 py-1 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                                                    >
                                                        Remove
                                                    </motion.button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-secondary)] p-8 rounded-xl text-center text-[var(--text-secondary)] italic">
                                No trainers found
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MembershipManagement;