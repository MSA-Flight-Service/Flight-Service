import { useEffect, useState } from "react";
import axios from "axios";
import './FlightList.css';

function FlightList({ filters, onSelectedFlights, selectedFlights = [] }) {
    const [oneWayFlights, setOneWayFlights] = useState([]);
    const [roundTripFlights, setRoundTripFlights] = useState({ goList: [], backList: [] });
    const [selectedRoundTrip, setSelectedRoundTrip] = useState({ go: null, back: null });
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                if (filters) {
                    const cleanParams = { ...filters };
                    Object.keys(cleanParams).forEach((key) => {
                        if (key !== "tripType" && cleanParams[key] === "") {
                            delete cleanParams[key];
                        }
                    });

                    const isRound = filters.tripType === "round";
                    const uri = isRound
                        ? "http://localhost:8443/api/flights/search/split"
                        : "http://localhost:8443/api/flights/search";

                    const res = await axios.get(uri, {
                        params: {
                            ...cleanParams,
                            page,
                            size: 10,
                        },
                    });

                    if (isRound) {
                        const { goList = [], backList = [] } = res.data;
                        setRoundTripFlights({ goList, backList });
                        setOneWayFlights([]);
                    } else {
                        const content = Array.isArray(res.data?.content)
                            ? res.data.content
                            : Array.isArray(res.data)
                                ? res.data
                                : [];

                        setOneWayFlights(content);
                        setRoundTripFlights({ goList: [], backList: [] });
                    }

                    setSelectedRoundTrip({ go: null, back: null });
                } else {
                    // ❗ filters가 없으면 아무것도 보여주지 않음
                    setOneWayFlights([]);
                    setRoundTripFlights({ goList: [], backList: [] });
                    setSelectedRoundTrip({ go: null, back: null });
                }
            } catch (error) {
                console.error("❌ 항공편 데이터 로딩 실패:", error);
            }
        };

        fetchFlights();
    }, [filters, page]);

    const formatTime = (str) =>
        new Date(str).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

    const getFlightDuration = (start, end) => {
        const diff = new Date(end) - new Date(start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}시간 ${minutes}분`;
    };

    const handleSelectedFlight = (flight, type) => {
        if (filters?.tripType === "round") {
            const selected = selectedRoundTrip[type];
            const isSame = selected?.id === flight.id;

            if (type === "back" && selectedRoundTrip.go && !isSame) {
                const goDate = new Date(selectedRoundTrip.go.departureTime);
                const backDate = new Date(flight.departureTime);
                if (backDate <= goDate) {
                    alert("돌아오는 항공편은 출발 이후 날짜여야 합니다.");
                    return;
                }
            }

            const newState = {
                ...selectedRoundTrip,
                [type]: isSame ? null : flight
            };

            setSelectedRoundTrip(newState);

            const selectedList = [newState.go, newState.back].filter(Boolean);
            onSelectedFlights(selectedList);
        } else {
            onSelectedFlights((prev) =>
                prev.length && prev[0].id === flight.id ? [] : [flight]
            );
        }
    };

    const isSelected = (flight) => {
        if (filters?.tripType === "round") {
            return flight.id === selectedRoundTrip.go?.id || flight.id === selectedRoundTrip.back?.id;
        } else {
            return selectedFlights.length > 0 && selectedFlights[0].id === flight.id;
        }
    };

    const isDisabledBackFlight = (flight) => {
        if (filters?.tripType === "round" && selectedRoundTrip.go) {
            return new Date(flight.departureTime) <= new Date(selectedRoundTrip.go.departureTime);
        }
        return false;
    };

    const renderFlightCard = (flight, idx, type) => {
        const isDisabled = type === "back" && isDisabledBackFlight(flight);

        return (
            <div
                key={`${type}-${flight.id}-${idx}`}
                className={`flight-card ${isSelected(flight) ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => {
                    if (!isDisabled) handleSelectedFlight(flight, type);
                }}
            >
                <div className="section section-left">
                    <h3>{flight.aircraftType}</h3>
                    <p>{flight.departureTime?.split("T")[0]}</p>
                </div>

                <div className="section section-center">
                    <div className="center-twin">
                        <div className="time-info">
                            <p className="time">{formatTime(flight.departureTime)}</p>
                            <p className="location">{flight.departureName}</p>
                        </div>
                        <div className="duration-info">
                            ✈️ {getFlightDuration(flight.departureTime, flight.arrivalTime)}
                        </div>
                        <div className="time-info">
                            <p className="time">{formatTime(flight.arrivalTime)}</p>
                            <p className="location">{flight.arrivalName}</p>
                        </div>
                    </div>
                </div>

                <div className="section section-right">
                    <p className="price">₩ {flight.price}</p>
                    <p className="seats">좌석 {flight.seatCount}석</p>
                </div>
            </div>
        );
    };

    const renderOneWay = () =>
        oneWayFlights.map((flight, idx) => renderFlightCard(flight, idx, "oneway"));

    const renderRoundTrip = () => (
        <div className="round-trip-columns">
            <div className="column">
                <h3>✈️ 출발 항공편</h3>
                {roundTripFlights.goList.length > 0 ? (
                    roundTripFlights.goList.map((flight, idx) => renderFlightCard(flight, idx, "go"))
                ) : (
                    <p>😢 출발 항공편이 없습니다.</p>
                )}
            </div>

            <div className="column">
                <h3>🛬 돌아오는 항공편</h3>
                {roundTripFlights.backList.length > 0 ? (
                    roundTripFlights.backList.map((flight, idx) => renderFlightCard(flight, idx, "back"))
                ) : (
                    <p>😢 돌아오는 항공편이 없습니다.</p>
                )}
            </div>
        </div>
    );

    // ✅ filters 없을 경우 안내 메시지 렌더링
    if (!filters) {
        return (
            <div className="no-search-message">
                🔍 항공편을 검색해주세요.
            </div>
        );
    }

    return (
        <div className={`flight-list ${filters?.tripType === "round" ? "wide-mode" : ""}`}>
            {filters?.tripType === "round" ? renderRoundTrip() : renderOneWay()}
        </div>
    );
}

export default FlightList;
