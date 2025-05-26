import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, isAdmin, children }) => {
  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 인증은 되었으나 관리자가 아닌 경우 홈 페이지로 리디렉션
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // 인증과 관리자가 모두 확인되면 자식 컴포넌트를 렌더링
  return children;
};

export default ProtectedRoute;
