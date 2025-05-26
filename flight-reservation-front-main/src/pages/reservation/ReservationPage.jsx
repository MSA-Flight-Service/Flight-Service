import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";

import apiClient from "../../apiClient.jsx";


function ReservationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { reservationId, from } = location.state || {};
    const { accessToken } = useSelector((state) => state.auth);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!reservationId) {
            setError("❌ 예약 ID가 전달되지 않았습니다.");
            return;
        }

        const maxWaitTime = 5000;
        const intervalTime = 1000;
        const startTime = Date.now();

        const poll = setInterval(async () => {
            try {
                const res = await apiClient.get("/api/reservations/wait", {
                    params: { reservationId },
                });

                if (res.status === 200) {
                    clearInterval(poll);

                    // ✅ Kafka 수신 완료 → 예약 생성
                    try {
                        const decoded = jwtDecode(accessToken);
                        const userId = decoded.userid;

                        const { data: userDataRaw } = await apiClient.get(`/api/users/id/${userId}`);
                        const user = Array.isArray(userDataRaw) ? userDataRaw[0] : userDataRaw;

                        const response = await apiClient.post("/api/reservations/", null, {
                            params: {
                                uId: user.id,
                                uName: user.userFirstName + user.userLastName,
                                reservationId
                            }
                        });

                        const receivedKey = response.data;
                        if (!receivedKey) {
                            setError("❌ 예약 생성 실패: 키를 받아오지 못했습니다.");
                            return;
                        }

                        // ✅ 예약 생성 성공 → 이동
                        navigate(`/select/${receivedKey}`, { state: { from } });

                    } catch (e) {
                        console.error("예약 생성 중 오류", e);
                        setError("❌ 사용자 인증 또는 예약 요청 중 오류가 발생했습니다.");
                    }
                }
            } catch (err) {
                // Redis에 아직 없을 수 있으니 조용히 대기
            }

            if (Date.now() - startTime > maxWaitTime) {
                clearInterval(poll);
                setError("⏱ 예약 데이터 수신 지연. 다시 시도해주세요.");
            }
        }, intervalTime);

        return () => clearInterval(poll);
    }, [reservationId]);

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>예약 정보를 준비 중입니다...</h2>
            <p>잠시만 기다려 주세요 ✈️</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default ReservationPage;