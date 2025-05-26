// src/pages/SeatSelectionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../../../flight-reservation-front-main/src/style/SelectSeat.module.css';

export default function SeatSelectionPage() {
  const { key } = useParams();
  const [reservation, setReservation] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  // 1) 예약 정보, 2) 예매 완료 좌석, 3) 락된 좌석 함께 불러오기
  useEffect(() => {
    async function fetchData() {
      try {
        // 1) 예약 정보
        const res1 = await axios.get('http://localhost:9091/api/reservations/search', { params: { key } });
        setReservation(res1.data.reservation);

        const fId = res1.data.reservation.fId;

        // 2) 예매 완료 좌석
        const res2 = await axios.get('http://localhost:9091/api/reservations/seats/status', { params: { fId } });
        setBookedSeats(res2.data);

        // 3) 락된 좌석
        const res3 = await axios.get('http://localhost:9091/api/reservations/seats/lock', { params: { key } });
        setLockedSeats(res3.data);
      } catch (err) {
        console.error(err);
        alert('데이터 로드 중 오류가 발생했습니다.');
      }
    }
    fetchData();

    // 폴링: 5초마다 락 상태 갱신
    const interval = setInterval(async () => {
      if (!reservation) return;
      try {
        const res = await axios.get('http://localhost:9091/api/reservations/seats/lock', { params: { key } });
        setLockedSeats(res.data);
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [key, reservation]);

  const getSeatClass = (row) => (row <= 1 ? 'first' : row <= 3 ? 'business' : 'economy');
  const getSeatPrice = (cls) => ({ first:300000, business:200000 }[cls] || 100000);

  const handleSeatClick = (spot, cls) => {
    if (bookedSeats.includes(spot) || lockedSeats.includes(spot)) {
      alert('이미 예매 혹은 락된 좌석입니다.');
      return;
    }
    setSelectedSeats(sel =>
      sel.some(s => s.sSpot===spot)
        ? sel.filter(s=>s.sSpot!==spot)
        : [...sel, { sSpot:spot, sClass:cls, sName:'', sPassPortNum:'', sPrice:0 }]
    );
  };

  const handleCancel = async () => {
    if (!window.confirm('정말 예매를 취소하시겠습니까?')) return;
    try {
      // // 바디로 보낼 데이터가 없으므로 두 번째 인자는 null
      // // 세 번째 인자에 params: { key }를 넣어야 ?key=… 형태로 전달됩니다.
      // const res = await axios.post(
      //   'http://localhost:8077/api/reservation/cancel',
      //   null,
      //   { params: { key } }
      // );
      // console.log(res.data);
      alert('예약이 취소되었습니다.');
      navigate('/'); // 홈으로 이동
    } catch (err) {
      console.error(err);
      alert('예매 취소 중 오류가 발생했습니다.');
    }
  };
  
  const handleNext = async () => {
    const seatsWithPrice = selectedSeats.map(s=>({ ...s, sPrice:getSeatPrice(s.sClass) }));
    try {
      const res = await axios.post('http://localhost:9091/api/reservations/seats/lock', seatsWithPrice, { params:{ key } });
      const { locked, failed } = res.data;
      if (failed.length) {
        alert(`락 실패: ${failed.join(', ')}`);
        setSelectedSeats(s=>s.filter(x=>!failed.includes(x.sSpot)));
        setLockedSeats(locked);
        return;
      }
      await axios.post('http://localhost:9091/api/reservations/seats', locked.map(spot=>seatsWithPrice.find(s=>s.sSpot===spot)), { params:{ key } });
      navigate(`/form/${key}`);
    } catch {
      alert('다음 단계로 이동 중 오류 발생');
    }
  };

  const calculateTotal = ()=> selectedSeats.reduce((t,s)=>t+getSeatPrice(s.sClass),0);

  const rows = reservation ? Math.ceil(reservation.fSeatCount/6) : 0;
  const columns = ['A','B','C','D','E','F'];

  return (
    <div className={styles.container}>
      {/* 예매 정보 */}
      <div className={styles.reservationInfo}>
        <h2>예매 정보</h2>
        {reservation ? (
          <>
            <p>예약 ID: {reservation.rId}</p>
            <p>출발지: {reservation.fDeparture}</p>
            <p>도착지: {reservation.fArrival}</p>
            <p>항공사: {reservation.aName}</p>
            <p>출발: {new Date(reservation.fDepartureTime).toLocaleString('ko-KR')}</p>
            <p>도착: {new Date(reservation.fArrivalTime).toLocaleString('ko-KR')}</p>
          </>
        ) : <p>로딩 중…</p>}
      </div>

      {/* 좌석 선택 */}
      <div className={styles.seatSelection}>
        <div className={styles.seatArea} style={{
          backgroundImage:"url('/images/airplane.png')",
          backgroundSize:'340% 82%', backgroundPosition:'50% top',
          backgroundRepeat:'no-repeat', height:'1000px'
        }}>
          <div className={styles.seatGridLayout}>
            {[...Array(rows)].map((_,ri)=>{
              const r=ri+1;
              return <div key={r} className={styles.seatRow}>
                {columns.map(col=>{
                  const spot=`${col}${r}`;
                  const cls=getSeatClass(r);
                  const isBooked=bookedSeats.includes(spot);
                  const isLocked=lockedSeats.includes(spot);
                  const isSelected=selectedSeats.some(s=>s.sSpot===spot);
                  return <React.Fragment key={spot}>
                    <button
                      disabled={isBooked||isLocked}
                      onClick={()=>handleSeatClick(spot,cls)}
                      className={[
                        styles.seatButton,
                        styles[cls],
                        isSelected&&styles.selected,
                        isBooked&&styles.booked,
                        isLocked&&styles.locked
                      ].filter(Boolean).join(' ')}
                    >{spot}</button>
                    {col==='C'&&<div className={styles.aisle}/>}
                  </React.Fragment>;
                })}
              </div>;
            })}
          </div>
        </div>
      </div>

      {/* 상태 정보 */}
      <div className={styles.seatStatus}>
          <h2>좌석 상태 정보</h2>
          <p><span className={styles.box} style={{ backgroundColor: '#4caf50', borderRadius: '5px' }} />선택됨</p>
          <p><span className={styles.box} style={{ backgroundColor: '#eee', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }} />일반석</p>
          <p><span className={styles.box} style={{ backgroundColor: '#9c27b0', borderRadius: '5px' }} />비즈니스석</p>
          <p><span className={styles.box} style={{ backgroundColor: '#f44336', borderRadius: '5px' }} />퍼스트석</p>
          <p><span className={styles.box} style={{ backgroundColor: '#333', color: '#fff', borderRadius: '5px' }} />예매 완료</p>
          <p><span className={styles.box} style={{ backgroundColor: '#aaa', borderRadius: '5px' }} />잠금 중</p>
      </div>

      {/* 선택 좌석 */}
      <div className={styles.selectedSeats}>
        <h2>선택한 좌석</h2>
        {selectedSeats.length>0 ? (
          <>
            <ul>
              {selectedSeats.map(s=>(
                <li key={s.sSpot}>{s.sSpot} ({s.sClass})</li>
              ))}
            </ul>
            <div className={styles.totalPrice}>총합: {calculateTotal().toLocaleString()}원</div>
          </>
        ) : <p>선택된 좌석이 없습니다.</p>}
      </div>

      {/* 버튼 그룹: absolute는 container-relative 기준으로 */}
      <div className={styles.buttonGroup}>
        <button onClick={handleNext} className={styles.nextButton}>
          다음
        </button>
        <button onClick={handleCancel} className={styles.cancelButton}>
          예매 취소
        </button>
      </div>
    </div>
  );
}
