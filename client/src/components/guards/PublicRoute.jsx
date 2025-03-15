import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
    const { isAuthenticated } = useContext(AuthContext);

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />
}