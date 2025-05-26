import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import apiClient from "../../apiClient.jsx";

import styles from '../../styles/SeatConfirmationPage.module.css';

function SeatConfirmationPage() {
    const { key } = useParams();
    const [reservation, setReservation] = useState(null);
    const [seats, setSeats] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    useEffect(() => {
        apiClient.get('/api/reservations/search', { params: { key } })
            .then(res => {
                setReservation(res.data.reservation);
                setSeats(res.data.seats)
            })
            .catch(err => console.error(err));


    }, [key]);

    const formatDate = (localDateTimeStr) => {
        const date = new Date(localDateTimeStr);
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short'
        });
        const formattedTime = date.toLocaleTimeString('ko-KR', {
            hour: '2-digit', minute: '2-digit'
        });
        return `${formattedDate} ${formattedTime}`;
    };

    const handleNext = async () => {
        try {
            await apiClient.post('/api/reservations/confirm', seats, { params: { key } });

            // 팝업 없이 페이지 이동
            navigate(`/complete`, { state: { from } });

        } catch (err) {
            console.error("좌석 정보 저장 실패:", err);
            alert("좌석 정보 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <h2>예약 정보</h2>
                {reservation && (
                    <div>
                        <div>예약 ID: {reservation.rId}</div>
                        <div>출발지: {reservation.fDeparture}</div>
                        <div>도착지: {reservation.fArrival}</div>
                        <div>항공사: {reservation.aName}</div>
                        <div>출발 시간: {formatDate(reservation.fDepartureTime)}</div>
                        <div>도착 시간: {formatDate(reservation.fArrivalTime)}</div>
                    </div>
                )}
            </div>

            <div className={styles.rightPanel}>
                <h3>좌석 정보</h3>
                {seats.map((seat, index) => (
                    <div key={index} className={styles.seatInfo}>
                        <div>좌석번호: {seat.sSpot}</div>
                        <div>이름: {seat.sName}</div>
                        <div>좌석등급: {seat.sClass}</div>
                        <div>좌석가격: {seat.sPrice}</div>
                    </div>
                ))}
                <button onClick={handleNext} className={styles.nextButton}>다음</button>
            </div>
        </div>
    );
}

export default SeatConfirmationPage;
