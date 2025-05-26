import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../apiClient.jsx";

import "../styles/Signup.css"

function Signup() {
    const navigate = useNavigate();
    const [isAgreed, setIsAgreed] = useState(false); // 동의 여부
    const [agreeChecked, setAgreeChecked] = useState(false); // 체크박스 상태
    const [agreeAll, setAgreeAll] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);


    // 상태 변수 선언 (이메일, 이름, 전화번호, 비밀번호 등)
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 이메일 인증 관련 상태 변수
    const [verificationCode, setVerificationCode] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");

    const [error, setError] = useState(null);

    useEffect(() => {
        setAgreeAll(agreePrivacy && agreeTerms);
    }, [agreePrivacy, agreeTerms]);

    // 이메일 인증번호 발송 요청
    const handleSendVerificationCode = async () => {
        setError(null);
        if (!email) {
            setError("먼저 이메일을 입력해주세요.");
            return;
        }

        try {
            // 백엔드에서 이메일로 인증번호를 발송하는 API 호출
            await apiClient.post("/api/users/mail/send-verification", { email });
            setVerificationSent(true);
            setVerificationMessage("인증번호가 이메일로 전송되었습니다. 이메일을 확인해주세요.");
        } catch (err) {
            console.error("인증번호 전송 오류", err);
            setError("인증번호 전송에 실패했습니다. 이메일을 다시 확인해주세요.");
        }
    };

    // 입력한 인증번호 검증
    const handleVerifyCode = async () => {
        setError(null);
        if (!verificationCode) {
            setError("인증번호를 입력해주세요.");
            return;
        }

        try {
            // 백엔드에 이메일과 인증번호를 보내 검증하는 API 호출
            const response = await apiClient.post("/api/users/mail/verify-code", {
                email,
                verificationCode,
            });
            // 예를 들어, response.data.success가 true면 인증 성공으로 처리
            if (response.data.success) {
                setIsEmailVerified(true);
                setVerificationMessage("이메일 인증이 완료되었습니다.");
            } else {
                setError("인증번호가 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("인증 확인 에러", err);
            setError("이메일 인증 확인에 실패했습니다.");
        }
    };

    // 회원가입 처리 (모든 입력 값과 이메일 인증, 비밀번호 확인 체크)
    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (!isEmailVerified) {
            setError("이메일 인증이 필요합니다.");
            return;
        }
        if (password !== confirmPassword) {
            setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        try {
            // 백엔드 UserEntity에 맞춰서 데이터를 전송합니다.
            const response = await apiClient.post("/api/users", {
                email,
                password,
                userFirstName: firstName,
                userLastName: lastName,
                phone,
            });
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/");
            }
        } catch (err) {
            console.error("회원가입 오류", err);
            setError("회원가입 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    };

    return (
        <div className="signup-page">
            <div className="img-panel"></div>
            <div className="form-panel">
                {!isAgreed ? (
                    <div className="agreement-box">
                        <h3 className="form-title">이용 약관 및 정보 제공 동의</h3>

                        {/* 개인정보 수집 및 이용 동의 */}
                        <div className="agreement-section">
                            <h4>[필수] 개인정보 수집 및 이용 동의</h4>
                            <div className="agreement-box-scrollable">
                                <p>
                                    본인은 Airplanit 에서 제공하는 회원 서비스와 관련하여, 아래와 같이 본인의 개인정보를 수집 및 이용하는 것에 동의합니다.
                                    <br /><br />
                                    1. 수집 항목: 이름, 이메일, 전화번호, 비밀번호<br />
                                    2. 목적: 회원가입, 본인확인, 고객지원, 서비스 제공<br />
                                    3. 보유기간: 회원 탈퇴 시까지 또는 법령에 의한 보관 기간<br />
                                    4. 위 정보를 제공하지 않을 권리가 있으며, 미동의 시 서비스 이용이 제한될 수 있습니다.
                                    <br /><br />
                                    본인은 위 내용을 충분히 숙지하였으며 이에 동의합니다.
                                </p>
                            </div>
                            <div className="agree-checkbox">
                                <input
                                    type="checkbox"
                                    id="agreePrivacy"
                                    checked={agreePrivacy}
                                    onChange={() => setAgreePrivacy(!agreePrivacy)}
                                />
                                <label htmlFor="agreePrivacy">개인정보 수집 및 이용에 동의합니다.</label>
                            </div>
                        </div>

                        {/* 서비스 이용약관 동의 */}
                        <div className="agreement-section">
                            <h4>[필수] 서비스 이용약관 동의</h4>
                            <div className="agreement-box-scrollable">
                                <p>
                                    본 약관은 귀하가 Airplanit 서비스를 이용함에 있어 필요한 조건 및 책임에 대해 규정합니다.
                                    <br /><br />
                                    - 본 서비스는 만 14세 이상만 가입이 가능합니다.<br />
                                    - 회원은 본인의 계정 정보를 안전하게 관리할 책임이 있습니다.<br />
                                    - 회사는 사전 공지 없이 서비스를 일시 또는 영구 중단할 수 있으며, 이에 대한 책임은 제한됩니다.<br />
                                    - 기타 자세한 내용은 전체 이용약관을 참고해 주세요.
                                    <br /><br />
                                    귀하는 위 약관에 동의하며, 회원 가입을 계속 진행합니다.
                                </p>
                            </div>
                            <div className="agree-checkbox">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    checked={agreeTerms}
                                    onChange={() => setAgreeTerms(!agreeTerms)}
                                />
                                <label htmlFor="agreeTerms">서비스 이용약관에 동의합니다.</label>
                            </div>
                            {/* ✅ 전체 동의 체크박스 */}
                            <div className="all-agree">
                                <input
                                    type="checkbox"
                                    id="agreeAll"
                                    checked={agreeAll}
                                    onChange={() => {
                                        const newValue = !agreeAll;
                                        setAgreeAll(newValue);
                                        setAgreePrivacy(newValue);
                                        setAgreeTerms(newValue);
                                    }}
                                />
                                <label htmlFor="agreeAll"><strong>모든 약관에 동의합니다.</strong></label>
                            </div>
                        </div>

                        {/* 가입 진행 버튼 */}
                        <button
                            className="agree-btn"
                            onClick={() => {
                                if (agreePrivacy && agreeTerms) {
                                    setIsAgreed(true);
                                } else {
                                    alert("모든 필수 항목에 동의해야 회원가입을 진행할 수 있습니다.");
                                }
                            }}
                        >
                            동의하고 가입 진행
                        </button>
                        <p className="login-link" onClick={() => navigate('/login')}>
                            이미 계정이 있으신가요? 로그인
                        </p>
                    </div>
                ) : (
                    <form className="signup-form" onSubmit={handleSignup}>
                        <h2 className="form-title">회원가입</h2>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">이메일</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example123@email.com"
                                required
                                className="form-input"
                            />
                            <button
                                type="button"
                                className="verification-btn"
                                onClick={handleSendVerificationCode}
                            >
                                인증번호 발송
                            </button>
                        </div>

                        {verificationSent && !isEmailVerified && (
                            <div className="form-group">
                                <label htmlFor="verificationCode" className="form-label">인증번호 입력</label>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    className="verification-btn"
                                    onClick={handleVerifyCode}
                                >
                                    인증번호 확인
                                </button>
                            </div>
                        )}

                        {verificationMessage && <p className="verification-message">{verificationMessage}</p>}

                        <div className="form-group-name">
                            <div className="input-group">
                                <label htmlFor="firstName" className="form-label">이름</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="이름을 입력하세요"
                                    required
                                    className="form-input-fistname"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="lastName" className="form-label">성</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="성을 입력하세요"
                                    required
                                    className="form-input-lastname"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">전화번호</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="010-1234-5678"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*********"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">비밀번호 확인</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="*********"
                                required
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className="signup-btn">회원가입</button>
                        {error && <p className="error-message">{error}</p>}

                        <p className="login-link" onClick={() => navigate('/login')}>
                            이미 계정이 있으신가요? 로그인
                        </p>
                    </form>
                )}
            </div>
        </div >
    );
}

export default Signup;