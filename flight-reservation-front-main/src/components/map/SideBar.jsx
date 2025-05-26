
import styles from "./Sidebar.module.css";
import {useEffect, useState} from "react";
import AirportSelectModal from "../flight/AirportSelectModal.jsx";
import GeminiSummary from "./GeminiSummary.jsx";
import apiClient from "../../apiClient.jsx";
import {allAirports} from "../../data/allAirports.js";


const Sidebar = ({ departure, arrival, setDeparture, setArrival, setFlights, flights }) => {
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        if (!departure || !arrival) return;

        apiClient
            .get(`/api/flights/search?departure=${departure.name}&arrival=${arrival.name}`)
            .then((res) => {
                setFlights(res.data);
                console.log(res.data.content);
            })
            .catch((err) => console.error("추천 항공편 로딩 실패", err));
    }, [departure, arrival]);

    return (
        <div className={styles.sidebarWrapper}>
            <div className={styles.banner}>
                <h3>✈ 인기 항공편</h3>
                <p>지금 가장 많이 검색된 인기 항공편을 확인해보세요!</p>
            </div>
            <ul className={styles.popularList}>
                {[
                    { from: "인천", to: "도쿄", price: 145000 },
                    { from: "부산", to: "타이페이", price: 129000 },
                    { from: "서울", to: "싱가포르", price: 218000 },
                ].map((item, index) => (
                    <li key={index} className={styles.popularItem}>
                        <div>✈ {item.from} → {item.to}</div>
                        <div>₩{item.price.toLocaleString()}</div>
                    </li>
                ))}
            </ul>

            <div className={styles.sectionTitle}>선택된 항공편</div>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem", alignItems: "center" }}>
                <div className={styles.locationBox} onClick={() => setActiveModal("departure")}>
                    <p style={{ fontSize: "0.9rem", color: "#888", margin: 0 }}>출발지</p>
                    <p style={{ fontSize: "1.1rem", margin: "2px 0 0 0", fontWeight: "bold" }}>{departure?.name || "미정"}</p>
                    <p style={{ fontSize: "1.1rem", margin: 0, color: "blue", fontWeight: "bold" }}>{departure?.code || ""}</p>
                </div>
                <span style={{ fontSize: "1.5rem", color: "#999" }}>➝</span>
                <div className={styles.locationBox} onClick={() => setActiveModal("arrival")}>
                    <p style={{ fontSize: "0.9rem", color: "#888", margin: 0 }}>도착지</p>
                    <p style={{ fontSize: "1.1rem", margin: "2px 0 0 0", fontWeight: "bold" }}>{arrival?.name || "미정"}</p>
                    <p style={{ fontSize: "1.1rem", margin: 0, color: "blue", fontWeight: "bold" }}>{arrival?.code || ""}</p>
                </div>
            </div>

            {arrival && (
                <div className={styles.aiBox}>
                    <h3 style={{ marginBottom: "0.8rem" }}> AI 추천 요약</h3>
                    <p style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>
                        제미나이(Gemini)가 제공하는 {arrival.name} 여행 요약 정보입니다.
                    </p>
                    <GeminiSummary city={arrival.name} />
                </div>
            )}

            {arrival && Array.isArray(flights?.content) && flights.content.length > 0 && (
                <div className={styles.recommendContainer}>
                    <h3 className={styles.recommendTitle}>🛫 추천 항공편</h3>
                    <ul className={styles.recommendList}>
                        {flights.content.slice(0, 3).map((flight, idx) => (
                            <li key={idx} className={styles.recommendItem}>
                                <div className={styles.recommendItemTitle}>
                                    {flight.departureName} → {flight.arrivalName}
                                </div>
                                <div className={styles.recommendTime}>🕑 출발: {new Date(flight.departureTime).toLocaleString()}</div>
                                <div className={styles.recommendTime}>🛬 도착: {new Date(flight.arrivalTime).toLocaleString()}</div>
                                <div className={styles.recommendPrice}>₩{flight.price?.toLocaleString() || "N/A"}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {activeModal && (
                <AirportSelectModal
                    onClose={() => setActiveModal(null)}
                    onSelect={(selected) => {
                        const fullAirports = allAirports.find(a => a.code === selected.code);
                        if (activeModal === "departure") setDeparture(fullAirports);
                        else setArrival(fullAirports);
                        setActiveModal(null);
                    }}
                />
            )}

        </div>
    );
};

export default Sidebar;
