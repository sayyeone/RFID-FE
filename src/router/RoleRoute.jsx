import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({ children, allowedRoles }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />
    }

    return children;
}