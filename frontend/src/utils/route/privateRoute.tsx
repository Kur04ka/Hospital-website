import { Navigate, Outlet } from "react-router-dom";
import { instance } from "../axios";
import React, { useEffect, useState } from "react";

const PrivateRoute = () => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await instance.get('/user/ping-token', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("jwt");
                    setAuth(false);
                } else {
                    setAuth(true);
                }
            } catch (error) {
                localStorage.removeItem("jwt");
                setAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        auth ? <Outlet /> : <Navigate to="/login" />
    );
}

export default PrivateRoute;