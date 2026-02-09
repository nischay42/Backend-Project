import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const AuthLayout = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth)

    if (isAuthenticated) return <Navigate to="/" />

    return <Outlet />
}

export default AuthLayout