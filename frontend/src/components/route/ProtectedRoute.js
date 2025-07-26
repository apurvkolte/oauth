import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

const ProtectedRoute = ({ children, isAdmin = false }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
    const toastShown = useRef(false);

    useEffect(() => {
        if (!loading && !toastShown.current) {
            if (!isAuthenticated) {
                toast.error("Login first to access this resource.");
            } else if (isAdmin && user?.role !== "admin") {
                toast.error("You are not authorized to access this resource.");
            }
            toastShown.current = true;
        }
    }, [loading, isAuthenticated, user, isAdmin]);

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated || (isAdmin && user?.role !== "admin")) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
