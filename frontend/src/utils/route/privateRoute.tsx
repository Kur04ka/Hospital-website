import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    var auth = false

    const jwt = localStorage.getItem('jwt')
    if (jwt != null) {
        auth = true
    }

    return (
        auth ? <Outlet /> : <Navigate to="/login" />
    );
}

export default PrivateRoute;
