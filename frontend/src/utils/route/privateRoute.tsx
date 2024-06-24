import { Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from "react";
import { checkAuth } from "../../utils/auth";

const PrivateRoute = ({ roleRoute }: any) => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const { auth: isAuthenticated, role: userRole } = await checkAuth();
                setAuth(isAuthenticated);
                setRole(userRole);
            } catch (error) {
                console.error('Error checking authentication:', error);
                setAuth(false);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthStatus();
    }, []);

    if (loading) {
        return (
            <Box display={'flex'} flexDirection={'column'} height={'100vh'} textAlign={'center'} alignItems={'center'} justifyContent={'center'} gap={'3rem'}>
                <CircularProgress size={100} />
            </Box>
        );
    }

    if (!auth) {
        return <Navigate to="/login" />;
    }

    if (role === roleRoute) {
        return <Outlet />;
    } else {
        return <Navigate to="/unauthorized" />;
    }
};

export default PrivateRoute;