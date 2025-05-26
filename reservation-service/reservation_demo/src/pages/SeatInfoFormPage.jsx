import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../../../flight-reservation-front-main/src/style/SeatInfoFormPage.module.css';

function SeatInfoFormPage() {
    const { key } = useParams();
    const [reservation, setReservation] = useState(null);
    const [seats, setSeats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:9091/api/reservations/search', { params: { key } })
            .then(res => {
                setReservation(res.data.reservation);
                setSeats(res.data.seats || []);
            })
            .catch(err => console.error(err));
    }, [key]);

    const handleChange = (index, field, value) => {
        const updated = [...seats];
        updated[index][field] = value;
        setSeats(updated);
    };

    const handleNext = async () => {
        try {
            await axios.post(
                'http://localhost:9091/api/reservations/seats',
                seats, // 리스트 형태로 seats 전송
                { params: { key } } // key는 쿼리 파라미터로 전달
            );
            navigate(`/confirm/${key}`);
        } catch (err) {
            console.error("좌석 정보 저장 실패:", err);
            alert("좌석 정보 저장 중 오류가 발생했습니다.");
        }
    };
    
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

    return (
        <div className={styles.container}>
            {/* 왼쪽 - 예약 정보 */}
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

            {/* 오른쪽 - 좌석 정보 입력 */}
            <div className={styles.rightPanel}>
                <h3>좌석 정보 입력</h3>
                {seats.map((seat, index) => (
                    <div key={index} className={styles.seatCard}>
                        <div><strong>좌석번호:</strong> {seat.sSpot}</div>
                        <div><strong>좌석등급:</strong> {seat.sClass}</div>
                        <div><strong>좌석가격:</strong> {seat.sPrice}</div>
                        <label>이름:
                            <input
                                type="text"
                                value={seat.sName || ''}
                                onChange={(e) => handleChange(index, 'sName', e.target.value)}
                            />
                        </label>
                        <label>여권번호:
                            <input
                                type="text"
                                value={seat.sPassPortNum || ''}
                                onChange={(e) => handleChange(index, 'sPassPortNum', e.target.value)}
                            />
                        </label>
                    </div>
                ))}
                <button onClick={handleNext} className={styles.nextButton}>다음</button>
            </div>
        </div>
    );
}

export default SeatInfoFormPage;
