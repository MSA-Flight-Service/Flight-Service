import { v4 as uuidv4 } from 'uuid';
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import apiClient from "../../apiClient.jsx"; // ✅ UUID 생성

const FlightDetailCard = ({ fId }) => {
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!fId) return;

        apiClient.get(`/api/flights/${fId}`)
            .then(res => {
                setFlight(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(`비행편 ${fId} 가져오기 실패:`, err);
                setLoading(false);
            });
    }, [fId]);

    const sendFlightToKafka = async () => {
        if (!flight) {
            alert("항공편 정보를 불러오지 못했습니다.");
            return;
        }

        try {
            const reservationId = uuidv4(); //랜덤 uuid
            await apiClient.post("/api/kafka/publish", {
                reservationId,
                flight
            });

            // 현재 위치 기억해서 /loading으로 이동할 때 전달
            const currentUrl = location.pathname + location.search;
             navigate("/loading", { state: { from: currentUrl, reservationId } });
        } catch (error) {
            console.error("Kafka 전송 실패:", error);
            alert("Kafka 전송 실패");
        }
    };


    if (loading) return <div>🚀 fId: {fId} 로딩 중...</div>;
    if (!flight) return <div>❌ fId: {fId} 비행편 정보 없음</div>;

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <h3>✈️ 항공편 상세 (ID: {fId})</h3>
            <p><strong>출발 공항:</strong> {flight.departureName}</p>
            <p><strong>도착 공항:</strong> {flight.arrivalName}</p>
            <p><strong>출발 시간:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
            <p><strong>도착 시간:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
            <p><strong>항공기 기종:</strong> {flight.aircraftType}</p>
            <p><strong>총 좌석 수:</strong> {flight.seatCount}석</p>

            <button
                style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
                onClick={sendFlightToKafka}
            >
                예매하기
            </button>

        </div>
    );
};

export default FlightDetailCard;
