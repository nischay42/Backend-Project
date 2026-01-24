import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
    const { isAuthenticated, loading } = useAppSelector(
        (state) => state.auth
    );
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <>{children}</>;
}

export default ProtectedRoute