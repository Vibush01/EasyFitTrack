import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PageViewTracker = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const logPageView = async () => {
            if (user) {
                try {
                    await axios.post(`${API_URL}/analytics/log`, {
                        event: 'Page View',
                        page: location.pathname,
                        details: `${user.role} visited ${location.pathname}`,
                    }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                } catch (error) {
                    console.error('Failed to log page view:', error);
                }
            }
        };

        logPageView();
    }, [location, user]);

    return null;
};

export default PageViewTracker;
