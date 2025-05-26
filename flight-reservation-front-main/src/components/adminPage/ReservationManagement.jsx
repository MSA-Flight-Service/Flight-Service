import {useState} from "react";
import apiClient from "../../apiClient.jsx";

import "./ReservationManagement.css"

const ReservationManagement = ({ reservations, setReservations }) => {
    // 검색 관련 상태: 예약 ID, 사용자 ID, 출발지, 그룹 ID
    const [searchReservationId, setSearchReservationId] = useState("");
    const [searchUserId, setSearchUserId] = useState("");
    const [searchFlightDeparture, setSearchFlightDeparture] = useState("");
    const [searchGroupId, setSearchGroupId] = useState("");

    // 수정할 예약 상태
    const [editingReservation, setEditingReservation] = useState(null);
    const [loading, setLoading] = useState(false);

    // 검색 조건에 따라 예약 필터링
    const filteredReservations = reservations.filter((res) => {
        if (
            searchReservationId.trim() &&
            !res.rid.toString().includes(searchReservationId.trim())
        ) {
            return false;
        }
        if (
            searchUserId.trim() &&
            !res.uid.toString().includes(searchUserId.trim())
        ) {
            return false;
        }
        if (
            searchFlightDeparture.trim() &&
            !res.fDeparture.toLowerCase().includes(
                searchFlightDeparture.trim().toLowerCase()
            )
        ) {
            return false;
        }
        if (
            searchGroupId.trim() &&
            !res.groupId.toLowerCase().includes(searchGroupId.trim().toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    // 일반 텍스트 필드 변경 핸들러
    const handleFieldChange = (field) => (e) => {
        setEditingReservation({ ...editingReservation, [field]: e.target.value });
    };

    // 예약 수정 폼 제출 시 API 호출
    const handleUpdateReservation = (e) => {
        e.preventDefault();
        setLoading(true);
        apiClient
            .put(`/api/admin/reservations/${editingReservation.rid}`, editingReservation)
            .then(() => {
                alert("예약 수정 성공!");
                // 상태 내 수정된 예약 정보를 반영
                setReservations((prevReservations) =>
                    prevReservations.map((res) =>
                        res.rid === editingReservation.rid ? editingReservation : res
                    )
                );
                setEditingReservation(null);
            })
            .catch((error) => {
                console.error("Error updating reservation:", error);
                alert("예약 수정 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    function formatDateTime(dateTimeStr) {
        const date = new Date(dateTimeStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줍니다.
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
    }

    // 예약 삭제 핸들러
    const deleteReservation = (rId) => {
        if (window.confirm("정말 이 예약을 삭제하시겠습니까?")) {
            apiClient
                .delete(`/api/admin/reservations/${rId}`)
                .then(() => {
                    setReservations((prevReservations) =>
                        prevReservations.filter((res) => res.rid !== rId)
                    );
                })
                .catch((error) => {
                    console.error("Error deleting reservation:", error);
                    alert("예약 삭제 중 오류가 발생했습니다.");
                });
        }
    };

    // 검색 필드 초기화 핸들러
    const clearSearchFields = () => {
        setSearchReservationId("");
        setSearchUserId("");
        setSearchFlightDeparture("");
        setSearchGroupId("");
    };

    return (
        <div className="reservation-management">
            <h1 className="reservation-management__title">예약 관리</h1>

            {/* 검색 필터 영역 */}
            <div className="reservation-management__search">
                <h2 className="reservation-management__search-title">검색</h2>
                <div className="reservation-management__search-inputs">
                    <input
                        className="reservation-management__input"
                        type="text"
                        placeholder="예약 ID 검색"
                        value={searchReservationId}
                        onChange={(e) => setSearchReservationId(e.target.value)}
                    />
                    <input
                        className="reservation-management__input"
                        type="text"
                        placeholder="사용자 ID 검색"
                        value={searchUserId}
                        onChange={(e) => setSearchUserId(e.target.value)}
                    />
                    <input
                        className="reservation-management__input"
                        type="text"
                        placeholder="출발지 검색"
                        value={searchFlightDeparture}
                        onChange={(e) => setSearchFlightDeparture(e.target.value)}
                    />
                    <input
                        className="reservation-management__input"
                        type="text"
                        placeholder="그룹 ID 검색"
                        value={searchGroupId}
                        onChange={(e) => setSearchGroupId(e.target.value)}
                    />
                </div>
                <button
                    className="reservation-management__clear-btn"
                    onClick={clearSearchFields}
                >
                    초기화
                </button>
            </div>

            {/* 예약 수정 폼 (편집 창) */}
            {editingReservation && (
                <form
                    className="reservation-management__edit-form"
                    onSubmit={handleUpdateReservation}
                >
                    <h2>예약 수정</h2>
                    <div className="reservation-management__form-group">
                        <label>출발지</label>
                        <input
                            type="text"
                            value={editingReservation.fDeparture}
                            onChange={handleFieldChange("fDeparture")}
                            placeholder="출발지"
                        />
                    </div>
                    <div className="reservation-management__form-group">
                        <label>도착지</label>
                        <input
                            type="text"
                            value={editingReservation.fArrival}
                            onChange={handleFieldChange("fArrival")}
                            placeholder="도착지"
                        />
                    </div>
                    <div className="reservation-management__form-group">
                        <label>예약 날짜</label>
                        <input
                            type="datetime-local"
                            value={editingReservation.rDate}
                            onChange={handleFieldChange("rDate")}
                        />
                    </div>
                    <div className="reservation-management__form-group">
                        <label>비행기 종류</label>
                        <input
                            type="text"
                            value={editingReservation.fAircraftType}
                            onChange={handleFieldChange("fAircraftType")}
                            placeholder="비행기 종류"
                        />
                    </div>
                    <div className="reservation-management__form-group">
                        <label>티켓 가격</label>
                        <input
                            type="number"
                            value={editingReservation.ticketPrice}
                            onChange={handleFieldChange("ticketPrice")}
                            placeholder="티켓 가격"
                        />
                    </div>
                    <div className="reservation-management__form-group">
                        <label>그룹 ID</label>
                        <input
                            type="text"
                            value={editingReservation.groupId}
                            onChange={handleFieldChange("groupId")}
                            placeholder="그룹 ID"
                        />
                    </div>
                    <div className="reservation-management__form-buttons">
                        <button
                            type="submit"
                            className="reservation-management__update-btn"
                            disabled={loading}
                        >
                            {loading ? "수정 중..." : "수정"}
                        </button>
                        <button
                            type="button"
                            className="reservation-management__cancel-btn"
                            onClick={() => setEditingReservation(null)}
                        >
                            취소
                        </button>
                    </div>
                </form>
            )}

            {/* 예약 목록 테이블 */}
            {filteredReservations.length > 0 ? (
                <table className="reservation-management__table">
                    <thead>
                    <tr className="reservation-management__table-header-row">
                        <th className="reservation-management__table-header">예약 ID</th>
                        <th className="reservation-management__table-header">사용자 ID</th>
                        <th className="reservation-management__table-header">항공편 ID</th>
                        <th className="reservation-management__table-header">예약 날짜</th>
                        <th className="reservation-management__table-header">출발지</th>
                        <th className="reservation-management__table-header">출발 시간</th>
                        <th className="reservation-management__table-header">도착지</th>
                        <th className="reservation-management__table-header">도착 시간</th>
                        <th className="reservation-management__table-header">그룹 ID</th>
                        <th className="reservation-management__table-header">수정/삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredReservations.map((res) => (
                        <tr key={res.rId}>
                            <td className="reservation-management__table-cell">{res.rid}</td>
                            <td className="reservation-management__table-cell">{res.uid}</td>
                            <td className="reservation-management__table-cell">{res.fid}</td>
                            <td className="reservation-management__table-cell">{formatDateTime(res.rdate)}</td>
                            <td className="reservation-management__table-cell">{res.fdeparture}</td>
                            <td className="reservation-management__table-cell">{formatDateTime(res.fdepartureTime)}</td>
                            <td className="reservation-management__table-cell">{res.farrival}</td>
                            <td className="reservation-management__table-cell">{formatDateTime(res.farrivalTime)}</td>
                            <td className="reservation-management__table-cell">{res.groupId}</td>
                            <td className="reservation-management__table-cell">
                                <button
                                    className="reservation-management__edit-btn"
                                    onClick={() => setEditingReservation(res)}
                                >
                                    수정
                                </button>
                                <button
                                    className="reservation-management__delete-btn"
                                    onClick={() => deleteReservation(res.rId)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="reservation-management__no-data">
                    예약이 존재하지 않습니다.
                </div>
            )}
        </div>
    );
};

export default ReservationManagement;
