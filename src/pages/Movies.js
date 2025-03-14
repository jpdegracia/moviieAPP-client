import React, { useEffect, useState } from 'react';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';

const MoviePage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("https://movieapp-api-lms1.onrender.com/users/details", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user role");
                }

                const data = await response.json();
                console.log("User Data:", data); // Debugging to check API response

                // Ensure `isAdmin` is boolean and access correct structure
                setIsAdmin(data.user?.isAdmin === true);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return isAdmin ? <AdminView /> : <UserView />;
};

export default MoviePage;