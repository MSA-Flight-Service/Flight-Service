import { useCallback, useEffect, useState } from "react";
import apiClient from "../../apiClient.jsx";
import GroupPaymentButton from "../reservation/GroupPaymentButton.jsx";
import DeletedReservationAlert from "../reservation/DeletedReservationAlert.jsx";

import "./ReservationList.css"

function ReservationList({ userId }) {
    const [reservations, setReservations] = useState([]);
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [paidStatus, setPaidStatus] = useState({});

    const fetchStatus = useCallback(async () => {
        try {
            const res = await apiClient.get(`api/reservations/search/payment/${userId}`);
            const data = res.data;

            if (!data || data.length === 0) {
                console.log("ℹ️ 예약 없음");
                setReservations([]);
                setPaidStatus({});
                return;
            }

            setReservations(data);

            const rIds = data.map(res => res.rid);
            if (rIds.length > 0) {
                const params = new URLSearchParams();
                rIds.forEach(id => params.append("rIds", id));
                const statusRes = await apiClient.get(`/api/reservations/payments/check-paid?${params.toString()}`);
                setPaidStatus(statusRes.data);
            }
        } catch (e) {
            if (e.response?.status === 404) {
                console.log("ℹ️ 예약 없음 (404)");
                setReservations([]);
                setPaidStatus({});
            } else {
                console.error("❌ 상태 조회 실패", e);
            }
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        fetchStatus();

        const handleMessage = (event) => {
            if (event.data === 'payment-complete') {
                console.log("✅ 메시지 수신 → 상태 재조회");
                fetchStatus();
            }
        };

        const fallbackTimer = setTimeout(() => {
            console.log("⏱️ fallback 재조회 실행");
            fetchStatus();
        }, 10000);

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
            clearTimeout(fallbackTimer);
        };
    }, [userId, fetchStatus]);

    const handleSinglePayment = (rid) => {
        const popup = window.open(`/payment?rId=${rid}&uId=${userId}`, "결제창", "width=500,height=600");
        if (popup) popup.focus();
    };

    const cancelSingleReservation = async (rid) => {
        const confirm = window.confirm("정말로 이 예약을 취소하시겠습니까?");
        if (!confirm) return;

        try {
            await apiClient.delete(`/api/reservations/delete/${rid}`);
            alert("✅ 예약이 취소되었습니다.");
            fetchStatus();
        } catch (err) {
            alert("❌ 취소 실패: 결제된 예약은 삭제할 수 없습니다.");
        }
    };

    const toggleGroup = (groupId) => {
        setExpandedGroup((prev) => (prev === groupId ? null : groupId));
    };

    const grouped = reservations.reduce((acc, res) => {
        if (!acc[res.groupId]) acc[res.groupId] = [];
        acc[res.groupId].push(res);
        return acc;
    }, {});

    // 그룹 정렬: 먼저 생성된 예약이 포함된 그룹이 위로 오도록
    const sortedGroups = Object.entries(grouped).sort((a, b) => {
        const aFirst = a[1][0]?.rDate || "";
        const bFirst = b[1][0]?.rDate || "";
        return new Date(aFirst) - new Date(bFirst);
    });

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
        <>
            <DeletedReservationAlert userId={userId} />
            <h3>예매 내역</h3>
            {sortedGroups.length > 0 ? (
                sortedGroups.map(([groupId, group]) => {
                    const isGroupPaid = group.every(res => paidStatus[res.rid]);

                    return (
                        <div
                            className={`reservation-group ${expandedGroup === groupId ? "expanded" : ""}`}
                            key={groupId}
                        >
                            <div
                                className="reservation-group-header"
                                onClick={() => toggleGroup(groupId)}
                            >
                                <strong>예약 그룹:</strong> {groupId} ({group.length}건)
                                <span style={{ float: "right" }}>
                                    {expandedGroup === groupId ? "▲" : "▼"}
                                </span>
                            </div>

                            <div
                                className={`reservation-list ${expandedGroup === groupId ? "expanded" : ""}`}
                            >
                                {group.map((reservation, index) => {
                                    const isPaid = paidStatus[reservation.rid];

                                    return (
                                        <div
                                            className="reservation-card"
                                            key={reservation.rid}
                                            style={{ zIndex: group.length - index }}
                                        >
                                            <p><strong>예약 번호:</strong> {reservation.rid}</p>
                                            <p><strong>항공편:</strong> {reservation.faircraftType}</p>
                                            <p><strong>출발지 / 도착지:</strong> {reservation.fdeparture} / {reservation.farrival}</p>
                                            <p><strong>출발 날짜:</strong> {formatDate(reservation.fdepartureTime)}</p>
                                            <p><strong>좌석 번호:</strong> {reservation.sspot} ({reservation.sclass})</p>
                                            <p><strong>가격:</strong> {reservation.ticketPrice}원</p>

                                            <div className="button-group">
                                                <button
                                                    onClick={() => handleSinglePayment(reservation.rid)}
                                                    disabled={isPaid}
                                                >
                                                    {isPaid ? "✅ 결제 완료" : "💳 결제하기"}
                                                </button>
                                                <button
                                                    onClick={() => cancelSingleReservation(reservation.rid)}
                                                    disabled={isPaid}
                                                >
                                                    ❌ 예매 취소
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="button-group group-buttons">
                                    {/* 단체 결제,취소 버튼 */}
                                    <GroupPaymentButton
                                        groupList={group}
                                        userId={userId}
                                        paidStatus={paidStatus}
                                        refresh={fetchStatus}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>결제할 예약이 없습니다.</p>
            )}
        </>
    );
}

export default ReservationList;
