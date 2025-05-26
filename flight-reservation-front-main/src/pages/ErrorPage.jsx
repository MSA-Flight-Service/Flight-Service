import React from 'react';
import '../styles/ErrorPage.css';
import { useNavigate } from "react-router-dom";

function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="error-container">
            <div className="error-card">
                <img src="/images/error.png" alt="Error" className="error-image" />
                <p className="error-message">죄송합니다, 페이지를 찾을 수 없습니다.</p>
                <p className="error-submessage">입력하신 주소가 올바른지 다시 한 번 확인해 주세요.</p>
                <button className="error-button" onClick={() => navigate('/')}>
                    메인으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
