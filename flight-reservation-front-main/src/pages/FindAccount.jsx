import { useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "../apiClient.jsx";

import "../styles/FindAccount.css"

function FindAccount() {
    const navigate = useNavigate();
    // 모드는 "findId" (아이디 찾기) 또는 "resetPassword" (비밀번호 재설정) 중 하나
    const [mode, setMode] = useState("findId");

    // 아이디 찾기 상태 (핸드폰 번호 기반)
    const [phone, setPhone] = useState("");

    // 비밀번호 재설정 상태
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 공통적으로 사용하는 메시지 및 에러 상태
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // 핸드폰 번호로 아이디 찾기 처리 함수
    const handleFindId = async (e) => {
        e.preventDefault();
        try {
            // 백엔드 API: 핸드폰 번호로 아이디 조회
            const res = await apiClient.post("api/users/find-id", { phone });
            // 응답 데이터에 foundId가 있다고 가정합니다.
            setMessage(`회원님의 아이디는 ${res.data.foundId} 입니다.`);
            setError("");
        } catch (err) {
            console.error("아이디 찾기 오류", err);
            setError("아이디를 찾을 수 없습니다. 입력 정보를 확인해 주세요.");
            setMessage("");
        }
    };

    // 이메일로 인증번호 전송 처리 함수
    const handleSendVerification = async (e) => {
        e.preventDefault();
        try {
            const res = await apiClient.post("api/users/mail/send-verification", { email });
            setMessage(res.data.message || "인증번호가 이메일로 전송되었습니다.");
            setError("");
            setIsCodeSent(true);
        } catch (err) {
            console.error("인증번호 전송 오류", err);
            setError("인증번호 전송에 실패했습니다. 이메일을 확인해 주세요.");
            setMessage("");
        }
    };

    // 인증번호 확인 처리 함수
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const res = await apiClient.post("api/users/mail/verify-code", { email, verificationCode });
            if (res.data.success === true) {
                setMessage("이메일 인증에 성공했습니다.");
                setError("");
                setIsVerified(true);
            } else {
                setError("인증번호가 일치하지 않습니다.");
                setMessage("");
            }
        } catch (err) {
            console.error("인증번호 확인 오류", err);
            setError("인증번호 확인 중 오류가 발생했습니다.");
            setMessage("");
        }
    };

    // 새 비밀번호로 재설정 처리 함수
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            setMessage("");
            return;
        }
        try {
            await apiClient.post("api/users/reset-password", { email, newPassword });
            setMessage("비밀번호가 성공적으로 재설정되었습니다.");
            setError("");
            navigate("/login");
        } catch (err) {
            console.error("비밀번호 재설정 오류", err);
            setError("비밀번호 재설정에 실패했습니다.");
            setMessage("");
        }
    };

    // 모드 전환 시 상태 초기화 함수들
    const resetResetPasswordState = () => {
        setEmail("");
        setVerificationCode("");
        setIsCodeSent(false);
        setIsVerified(false);
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
        setError("");
    };

    const resetFindIdState = () => {
        setPhone("");
        setMessage("");
        setError("");
    };

    const handleModeSwitch = (selectedMode) => {
        setMode(selectedMode);
        setMessage("");
        setError("");
        if (selectedMode === "findId") {
            resetResetPasswordState();
            resetFindIdState();
        } else if (selectedMode === "resetPassword") {
            resetResetPasswordState();
        }
    };

    return (
        <div className="find-account-page">


            <div className="find-container">
                <div className="img-panel"></div>

                <div className="form-panel">
                    <h2>아이디/비밀번호 찾기</h2>
                    <div className="mode-toggle">
                        <button
                            className={mode === "findId" ? "active" : ""}
                            onClick={() => handleModeSwitch("findId")}
                        >
                            아이디 찾기
                        </button>
                        <button
                            className={mode === "resetPassword" ? "active" : ""}
                            onClick={() => handleModeSwitch("resetPassword")}
                        >
                            비밀번호 찾기
                        </button>
                    </div>
                    {mode === "findId" && (
                        <form onSubmit={handleFindId} className="find-id-form">
                            <div>
                                <label htmlFor="phone">핸드폰 번호</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">아이디 찾기</button>
                        </form>
                    )}

                    {mode === "resetPassword" && (
                        <div className="reset-password-container">
                            {/* 1단계: 등록 이메일 입력 후 인증번호 전송 */}
                            <form onSubmit={handleSendVerification} className="reset-password-form">
                                <div>
                                    <label htmlFor="email">등록 이메일</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isCodeSent}
                                    />
                                </div>
                                {!isCodeSent && <button type="submit">인증번호 전송</button>}
                            </form>

                            {/* 2단계: 인증번호 입력 및 확인 */}
                            {isCodeSent && !isVerified && (
                                <form onSubmit={handleVerifyCode} className="reset-password-form">
                                    <div>
                                        <label htmlFor="verificationCode">인증번호</label>
                                        <input
                                            type="text"
                                            id="verificationCode"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit">인증번호 확인</button>
                                </form>
                            )}

                            {/* 3단계: 인증 성공 후 비밀번호 재설정 */}
                            {isVerified && (
                                <form onSubmit={handleResetPassword} className="reset-password-form">
                                    <div>
                                        <label htmlFor="newPassword">새 비밀번호</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword">비밀번호 확인</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit">비밀번호 재설정</button>
                                </form>
                            )}
                        </div>
                    )}
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}

                    <p className="back-to-login" onClick={() => navigate("/login")}>
                        로그인 페이지로 돌아가기
                    </p>
                </div>

            </div>


        </div>
    );
}

export default FindAccount;
