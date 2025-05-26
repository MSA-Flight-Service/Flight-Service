import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ReservationPage() {
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리
    const navigate = useNavigate(); // React Router 네비게이션 훅

    // const handleFindUser = async () => {
    //     const { user } = res.data;
    // };

    const handlePostRequest = async () => {
        setError(null); // 에러 초기화

        try {
            const response = await axios.post("http://localhost:9091/api/reservations/", {
                rId: 1,
                fId: 2,
                uId: 3,
                fDeparture: "인천",
                fArrival: "제주",
                fDepartureTime: "2025-05-08T05:30",
                fArrivalTime: "2025-05-08T15:30",
                cId: 4,
                fSeatCount: 250,
                fAircraftType: "아시아나항공",
                uName: "첫길동"
            });
            
            const receivedKey = response.data; // 서버로부터 받은 키
            console.log("Received Key:", receivedKey);

            // 요청 성공 후 /select/{key}로 네비게이트
            navigate(`/select/${receivedKey}`);
        } catch (err) {
            console.error("Error occurred during POST request:", err);
            setError("POST 요청 중 오류가 발생했습니다."); // 사용자에게 표시할 에러 메시지 설정
        } finally {
            setLoading(false); // 로딩 상태 해제
        }
    };

    // 페이지가 열릴 때 handlePostRequest 실행
    useEffect(() => {
        handlePostRequest();
    }, []);

    return (
        <div>
            <h1>예약 요청 페이지</h1>

            {loading && <p>로딩 중...</p>}

            {error && (
                <div style={{ color: "red" }}>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default ReservationPage;
