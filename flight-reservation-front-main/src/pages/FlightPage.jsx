import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import SearchFlight from "../components/flight/SearchFlight.jsx";
import FlightList from "../components/flight/FlightList.jsx";

import "../styles/FlightPage.css"

function FlightPage() {
    const location = useLocation(); // ✅ 전달받은 state 읽기
    const searchData = location.state; // ✅ navigate로 전달된 데이터
    const navi = useNavigate();

    const [filters, setFilters] = useState(null);
    const [selectedFlights, setSelectedFlights] = useState([]);

    const isLoggedIn = () => {
        const token = localStorage.getItem("accessToken");
        return !!token;
    }

    useEffect(() => {
        if (searchData) {
            setFilters(searchData); // ✅ 검색 조건 반영
        } else {
            setFilters(null); // 새로고침 시 초기화
        }
    }, [searchData]);

    const handleSearch = (searchData) => {
        setFilters(searchData);
    };

    const sendTokafka = async () =>{
        if (!isLoggedIn()) {
            alert("로그인이 필요합니다.");
            navi("/login"); // 또는 로그인 페이지로 이동
            return;
        }
        if (selectedFlights.length === 0) {
            alert("선택된 항공편이 없습니다.");
            return;
        }

        if (selectedFlights.length === 2) {
            const departureId = selectedFlights[0].id;
            const arrivalId = selectedFlights[1].id;
            navi(`/flight/detail?departureId=${departureId}&arrivalId=${arrivalId}`);
        } else {
            const departureId = selectedFlights[0].id;
            navi(`/flight/detail?departureId=${departureId}`);
        }
    }


    return (
        <div className="flight-page-container">
            <SearchFlight onSearch={handleSearch} />

            <div className="flight-page-selection-wrapper">
                <div className="flight-page-selected-box">
                    <h3 className="flight-page-title">선택된 항공편</h3>

                    <div className="flight-page-selected-list">
                        {selectedFlights.length === 2 ? (
                            <>
                                <div className="flight-page-flight-card">
                                    <p className="flight-page-route">
                                        ✈ {selectedFlights[0].departureName} → {selectedFlights[0].arrivalName}
                                    </p>
                                    <p className="flight-page-date">
                                        🗓 {selectedFlights[0].departureTime?.split("T")[0]}
                                    </p>
                                </div>

                                <div className="flight-page-flight-card">
                                    <p className="flight-page-route">
                                        ✈ {selectedFlights[1].departureName} → {selectedFlights[1].arrivalName}
                                    </p>
                                    <p className="flight-page-date">
                                        🗓 {selectedFlights[1].departureTime?.split("T")[0]}
                                    </p>
                                </div>
                            </>
                        ) : (
                            selectedFlights.map((flight, idx) => (
                                <div className="flight-page-flight-card" key={idx}>
                                    <p className="flight-page-route">
                                        ✈ {flight.departureName} → {flight.arrivalName}
                                    </p>
                                    <p className="flight-page-date">
                                        🗓 {flight.departureTime?.split("T")[0]}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="flight-page-reserve-btn" onClick={sendTokafka}>
                        예약하기
                    </button>
                </div>
            </div>

            <FlightList
                filters={filters}
                onSelectedFlights={setSelectedFlights}
                selectedFlights={selectedFlights}
            />
        </div>
    );

}

export default FlightPage;
