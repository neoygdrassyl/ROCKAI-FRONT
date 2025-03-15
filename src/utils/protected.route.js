import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./context/auth.context.ts";
import { useContext } from "react";

export default function Protected() {
    const userContext = useContext(AuthContext);
    return userContext.user
        ? <Outlet /> : <Navigate to="/login" />

};