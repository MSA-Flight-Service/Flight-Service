import {useEffect, useState} from "react";
import apiClient from "../../apiClient.jsx";

import "./FlightManagement.css"

const FlightManagement = () => {
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [aircraftModels, setAircraftModels] = useState([]);
    const [flightForm, setFlightForm] = useState(null);

    // 검색 필터 상태 (항공권 검색)
    const [searchFlightId, setSearchFlightId] = useState("");
    const [searchDeparture, setSearchDeparture] = useState("");
    const [searchArrival, setSearchArrival] = useState("");
    const [searchAircraft, setSearchAircraft] = useState("");

    const clearSearchFields = () => {
        setSearchFlightId("");
        setSearchDeparture("");
        setSearchArrival("");
        setSearchAircraft("");
    };

    // 기본 폼 데이터
    const defaultFlight = {
        departureName: "",
        arrivalName: "",
        departureTime: "",
        arrivalTime: "",
        aircraftType: "",
        seatCount: "",
        flightClass: "",
    };

    // 모든 항공권 목록 가져오기
    useEffect(() => {
        apiClient
            .get("api/admin/flights")
            .then((response) => {
                setFlights(response.data);
            })
            .catch((error) => {
                console.error("Error fetching flights:", error);
            });
    }, []);

    // 공항 리스트 가져오기
    useEffect(() => {
        apiClient
            .get("api/admin/flights/airports")
            .then((response) => {
                setAirports(response.data);
            })
            .catch((error) => {
                console.error("Error fetching airports:", error);
            });
    }, []);

    // 항공기 모델 리스트 가져오기
    useEffect(() => {
        apiClient
            .get("api/admin/flights/aircraft")
            .then((response) => {
                console.log(response.data);
                setAircraftModels(response.data);
            })
            .catch((error) => {
                console.error("Error fetching aircraft models:", error);
            });
    }, []);

    // 항공기 모델 배열(aircraftModels)에서 flight.aircraftType과 일치하는 모델 객체의 'cline' 값을 반환하는 함수
    const getAirlineName = (aircraftType) => {
        const model = aircraftModels.find((m) => m.cmodel === aircraftType);
        return model ? model.cline : "N/A";
    };

    // 날짜 포맷 변환 (YYYY-MM-DD HH:mm)
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
        ).padStart(2, "0")}`;
    };

    // 항공권 생성 버튼 클릭 시 폼 표시
    const handleCreateClick = () => {
        setFlightForm({ ...defaultFlight });
    };

    // 항공권 수정 버튼 클릭 시 폼에 데이터 채우기
    const handleEditClick = (flight) => {
        setFlightForm({
            ...flight,
            departureTime: flight.departureTime
                ? new Date(flight.departureTime).toISOString().slice(0, 16)
                : "",
            arrivalTime: flight.arrivalTime
                ? new Date(flight.arrivalTime).toISOString().slice(0, 16)
                : "",
            departureId: flight.departureName,
            arrivalId: flight.arrivalName,
            aircraftId: flight.aircraftType,
        });
    };

    // 항공권 삭제 버튼 클릭 시 삭제 후 목록 갱신
    const handleDeleteClick = (id) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            apiClient
                .delete(`api/admin/flights/${id}`)
                .then(() => {
                    setFlights((prevFlights) => prevFlights.filter((f) => f.id !== id));
                })
                .catch((error) => {
                    console.error("Error deleting flight:", error);
                });
        }
    };

    // 폼 입력값 변경 처리
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFlightForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    // 항공권 생성 및 수정
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const apiUrl = flightForm.id ? `api/admin/flights/${flightForm.id}` : `api/admin/flights`;

        apiClient[flightForm.id ? "put" : "post"](apiUrl, flightForm)
            .then((response) => {
                setFlights(
                    flightForm.id
                        ? flights.map((f) => (f.id === flightForm.id ? response.data : f))
                        : [...flights, response.data]
                );
                setFlightForm(null);
            })
            .catch((error) => {
                console.error(`Error ${flightForm.id ? "updating" : "creating"} flight:`, error);
                alert(`항공권 ${flightForm.id ? "수정" : "생성"} 중 오류가 발생했습니다.`);
            });
    };

    // 검색 필터링 로직: 각 검색 필드에 입력된 값에 따라 flights 배열을 필터링
    const filteredFlights = flights.filter((flight) => {
        const matchId = flight.id.toString().includes(searchFlightId);
        const matchDeparture = flight.departureName
            .toLowerCase()
            .includes(searchDeparture.toLowerCase());
        const matchArrival = flight.arrivalName
            .toLowerCase()
            .includes(searchArrival.toLowerCase());
        const matchAircraft = flight.aircraftType
            .toLowerCase()
            .includes(searchAircraft.toLowerCase());
        return matchId && matchDeparture && matchArrival && matchAircraft;
    });

    return (
        <div className="flight-management">
            <h1 className="flight-management__title">항공권 관리</h1>
            <button onClick={handleCreateClick} className="flight-management__clear-btn">
                항공권 생성
            </button>

            {/* 검색 필터 영역 (user-management 참고 디자인) */}
            <div className="flight-management__search">
                <h2 className="flight-management__search-title">검색</h2>
                <div className="flight-management__search-inputs">
                    <input
                        className="flight-management__input"
                        type="text"
                        placeholder="항공권 ID 검색"
                        value={searchFlightId}
                        onChange={(e) => setSearchFlightId(e.target.value)}
                    />
                    <input
                        className="flight-management__input"
                        type="text"
                        placeholder="출발 공항 검색"
                        value={searchDeparture}
                        onChange={(e) => setSearchDeparture(e.target.value)}
                    />
                    <input
                        className="flight-management__input"
                        type="text"
                        placeholder="도착 공항 검색"
                        value={searchArrival}
                        onChange={(e) => setSearchArrival(e.target.value)}
                    />
                    <input
                        className="flight-management__input"
                        type="text"
                        placeholder="항공기 모델 검색"
                        value={searchAircraft}
                        onChange={(e) => setSearchAircraft(e.target.value)}
                    />
                </div>
                <button className="flight-management__clear-btn" onClick={clearSearchFields}>
                    초기화
                </button>
            </div>

            {/* 항공권 수정 폼 (편집 창) */}
            {flightForm && (
                <form className="flight-management__edit-form" onSubmit={handleFormSubmit}>
                    <h2>{flightForm.id ? "항공권 수정" : "항공권 생성"}</h2>

                    <div className="flight-management__form-group">
                        <label>출발 공항</label>
                        <select
                            name="departureName"
                            value={flightForm.departureName}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">선택하세요</option>
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.anameKor}>
                                    {airport.anameKor} ({airport.acode})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flight-management__form-group">
                        <label>도착 공항</label>
                        <select
                            name="arrivalName"
                            value={flightForm.arrivalName}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">선택하세요</option>
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.anameKor}>
                                    {airport.anameKor} ({airport.acode})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flight-management__form-group">
                        <label>출발 시간</label>
                        <input
                            type="datetime-local"
                            name="departureTime"
                            value={flightForm.departureTime}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="flight-management__form-group">
                        <label>도착 시간</label>
                        <input
                            type="datetime-local"
                            name="arrivalTime"
                            value={flightForm.arrivalTime}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="flight-management__form-group">
                        <label>항공기 모델</label>
                        <select
                            name="aircraftType"
                            value={flightForm.aircraftType}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">선택하세요</option>
                            {aircraftModels.map((aircraft) => (
                                <option key={aircraft.id} value={aircraft.cmodel}>
                                    {aircraft.cmodel} ({aircraft.cname})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flight-management__form-group">
                        <label>좌석 수</label>
                        <input
                            type="number"
                            name="seatCount"
                            value={flightForm.seatCount}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="flight-management__form-group">
                        <label>항공사</label>
                        <input
                            type="text"
                            name="flightClass"
                            value={flightForm.flightClass}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="flight-management__form-buttons">
                        <button type="submit" className="flight-management__update-btn">
                            {flightForm.id ? "수정" : "생성"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFlightForm(null)}
                            className="flight-management__cancel-btn"
                        >
                            취소
                        </button>
                    </div>
                </form>
            )}

            {/* 항공권 목록 테이블 (필터링 적용) */}
            {filteredFlights.length > 0 ? (
                <table className="flight-management__table">
                    <thead>
                    <tr className="flight-management__table-header-row">
                        <th className="flight-management__table-header">ID</th>
                        <th className="flight-management__table-header">출발 공항</th>
                        <th className="flight-management__table-header">도착 공항</th>
                        <th className="flight-management__table-header">출발 시간</th>
                        <th className="flight-management__table-header">도착 시간</th>
                        <th className="flight-management__table-header">항공기 모델</th>
                        <th className="flight-management__table-header">좌석 수</th>
                        <th className="flight-management__table-header">항공사</th>
                        <th className="flight-management__table-header">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredFlights.map((flight) => (
                        <tr key={flight.id}>
                            <td className="flight-management__table-cell">{flight.id}</td>
                            <td className="flight-management__table-cell">{flight.departureName}</td>
                            <td className="flight-management__table-cell">{flight.arrivalName}</td>
                            <td className="flight-management__table-cell">{formatDateTime(flight.departureTime)}</td>
                            <td className="flight-management__table-cell">{formatDateTime(flight.arrivalTime)}</td>
                            <td className="flight-management__table-cell">{flight.aircraftType}</td>
                            <td className="flight-management__table-cell">{flight.seatCount}</td>
                            <td className="flight-management__table-cell">
                                {getAirlineName(flight.aircraftType)}
                            </td>
                            <td className="flight-management__table-cell">
                                <button onClick={() => handleEditClick(flight)} className="flight-management__edit-btn">
                                    수정
                                </button>
                                <button onClick={() => handleDeleteClick(flight.id)} className="flight-management__delete-btn">
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="flight-management__no-flights">No Flights Found</div>
            )}
        </div>
    );
};

export default FlightManagement;
