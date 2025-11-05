// src/utils/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem("role");

    // If user not logged in
    if (!role) {
        return <Navigate to="/login" replace />;
    }

    // If not authorized for this route
    if (!allowedRoles.includes(role)) {
        // Redirect to respective dashboard
        switch (role) {
            case "headmaster":
                return <Navigate to="/headmaster" replace />;
            case "class_teacher":
                return <Navigate to="/class-teacher" replace />;
            case "teacher":
                return <Navigate to="/teacher" replace />;
            case "student":
                return <Navigate to="/student" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    // If authorized, render the children
    return children;
};

export default ProtectedRoute;
