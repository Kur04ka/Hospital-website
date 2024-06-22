import { Navigate, Outlet } from "react-router-dom";
import { instance } from "../axios";
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

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
        return (
            <Box display={'flex'} flexDirection={'column'} height={'100vh'} textAlign={'center'} alignItems={'center'} justifyContent={'center'} gap={'3rem'}>
                <CircularProgress size={100}></CircularProgress>
            </Box>
        )
    }

    return (
        auth ? <Outlet /> : <Navigate to="/login" />
    );
}

export default PrivateRoute;