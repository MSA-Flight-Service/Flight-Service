import {useCallback, useEffect, useState} from "react";
import apiClient from "../../apiClient.jsx";
import "./UserSummary.css"

function UserSummary({ user, userId }) {
    const [reservations, setReservations] = useState([]);
    const now = Date.now();


    const formatPhone = (phone) => {
        if (!phone || phone.length < 10) return phone;
        return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
    };

    const formatBirthday = (birthday) => {
        const date = new Date(birthday);
        if (isNaN(date)) return birthday;
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const grouped = reservations.reduce((acc, res) => {
        if (!acc[res.groupId]) acc[res.groupId] = [];
        acc[res.groupId].push(res);
        return acc;
    }, {});

    const sortedGroups = Object.entries(grouped).sort((a, b) => {
        const nearestA = Math.min(
            ...a[1]
                .map(r => new Date(r.fdepartureTime).getTime())
                .filter(time => time >= now) // 오늘 이후만
        );

        const nearestB = Math.min(
            ...b[1]
                .map(r => new Date(r.fdepartureTime).getTime())
                .filter(time => time >= now)
        );

        // 예외 처리: 둘 중 하나라도 유효한 예약이 없을 경우
        if (isNaN(nearestA)) return 1; // A는 유효 예약 없음 → B를 우선
        if (isNaN(nearestB)) return -1; // B는 유효 예약 없음 → A를 우선

        return nearestA - nearestB; // 오름차순: 가까운 시간이 먼저
    });

    const fetchReservations = useCallback(async () => {
        try {
            const res = await apiClient.get(`api/reservations/search/payment/${userId}`);
            const data = res.data;

            if (!data || data.length === 0) {
                console.log("ℹ️ 예약 없음");
                setReservations([]);
                return;
            }

            setReservations(data);
        } catch (e) {
            if (e.response?.status === 404) {
                console.log("ℹ️ 예약 없음 (404)");
                setReservations([]);
            } else {
                console.error("❌ 상태 조회 실패", e);
            }
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        fetchReservations();

        const handleMessage = (event) => {
            if (event.data === 'payment-complete') {
                console.log("✅ 메시지 수신 → 상태 재조회");
                fetchReservations();
            }
        };

        const fallbackTimer = setTimeout(() => {
            console.log("⏱️ fallback 재조회 실행");
            fetchReservations();
        }, 10000);

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
            clearTimeout(fallbackTimer);
        };
    }, [userId, fetchReservations]);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');

        return `${year}년 ${month}월 ${day}일 ${hour}:${minute}`;
    };

    return (
        <div>
            <h2>내 정보</h2>

            <div className="user-info-table">
                <div className="info-row">
                    <span className="info-label">이메일</span>
                    <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">이름</span>
                    <span className="info-value">{user.userFirstName} {user.userLastName}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">전화번호</span>
                    <span className="info-value">{formatPhone(user.phone)}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">생년월일</span>
                    <span className="info-value">
                        {user.birthday ? formatBirthday(user.birthday) : <span className="placeholder">생년월일을 설정해주세요</span>}
                    </span>
                </div>
                <div className="info-row">
                    <span className="info-label">주소</span>
                    <span className="info-value">
                        {user.address ? user.address : <span className="placeholder">주소를 설정해주세요</span>}
                    </span>
                </div>
            </div>

            <h3>최근 예약</h3>
            {sortedGroups.length > 0 ? (
                sortedGroups.slice(0, 1).map(([groupId, group]) => {
                    return (
                        <div className="reservation-group" key={groupId}>
                            <div className="reservation-group-header">
                                <strong>예약 그룹:</strong> {groupId} ({group.length}건)
                            </div>

                            <div className="reservation-list.expanded">
                                {group.map((reservation) => {
                                    return (
                                        <div className="reservation-card" key={reservation.rid}>
                                            <p><strong>출발지 / 도착지:</strong> {reservation.fdeparture} / {reservation.farrival}</p>
                                            <p><strong>출발 날짜:</strong> {formatDate(reservation.fdepartureTime)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>예약이 없습니다.</p>
            )}
        </div>
    );
}

export default UserSummary;
