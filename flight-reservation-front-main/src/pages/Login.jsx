import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import apiClient from "../apiClient.jsx";
import { login } from "../store/authSlice.js";

import "../styles/Login.css"

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 로그인 API 호출: 백엔드가 accessToken만 반환합니다.
            const loginResponse = await apiClient.post("/api/users/login", {
                email,
                password
            });
            const { accessToken } = loginResponse.data;

            // 백엔드의 /api/token-info 엔드포인트 호출하여 토큰에 담긴 사용자 정보를 받아옵니다.
            const tokenInfoResponse = await apiClient.get("/api/users/token-info", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(tokenInfoResponse.data);
            // 백엔드에서 받은 토큰 정보에는 email, userid, admin 값이 포함됩니다.
            const { email: userEmail, userId, admin } = tokenInfoResponse.data;
            // Redux에 로그인 정보(토큰, 사용자 정보)를 저장합니다.
            dispatch(
                login({
                    email: userEmail,
                    accessToken,
                    userId,
                    admin
                })
            );

            alert("로그인 성공");
            navigate("/");
        } catch (err) {
            console.error("로그인 오류", err);

            // 백엔드에서 삭제 요청된 사용자에 대해 403 상태와 지정된 메시지 반환한 경우
            if (
                err.response &&
                err.response.status === 403 &&
                err.response.data === "삭제 요청된 사용자입니다."
            ) {
                alert("삭제 요청된 사용자입니다. 관리자에게 문의해 주세요.");
                return;
            }
            // 그 외 인증 실패 시 에러 메시지 출력
            setError("이메일 또는 비밀번호를 확인해 주세요");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="img-panel"></div>
                <div className="form-panel">
                    <div className="login-form">
                        <h1 onClick={() => navigate("/")} className="login-logo">
                            Airplanit
                        </h1>
                        <form onSubmit={handleLogin}>
                            <label htmlFor="email">이메일</label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일을 입력하세요"
                                required
                            />
                            <label htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                            <button type="submit">로그인</button>
                            {error && <p className="error">{error}</p>}
                        </form>
                        <p className="link" onClick={() => navigate("/findAccount")}>
                            아이디/비밀번호 찾기
                        </p>
                        <p className="link" onClick={() => navigate("/signup")}>
                            계정이 없으신가요? 회원가입
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;