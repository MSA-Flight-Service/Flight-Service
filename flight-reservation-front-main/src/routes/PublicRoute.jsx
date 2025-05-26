import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    // 로그인되어 있다면 홈 페이지로 리다이렉트합니다.
    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
