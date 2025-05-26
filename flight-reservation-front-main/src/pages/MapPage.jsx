import GoogleMapInternational from "../components/map/GoogleMap.jsx";
import Sidebar from "../components/map/SideBar.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
    const [flights, setFlights] = useState([]);
    const [departure, setDeparture] = useState({ name: "인천", code: "ICN", lat: 37.46, lng: 126.44 });
    const [arrival, setArrival] = useState(null);

    const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수

    return (
        <div style={{ overflow: "hidden" }}>
            <div style={{
                display: "flex",
                height: "100vh",
                overflow: "hidden"
            }}>
                <div style={{ flex: 3 }}>
                    <GoogleMapInternational departure={departure}
                        arrival={arrival}
                        setDeparture={setDeparture}
                        setArrival={setArrival} />
                </div>
                <div style={{ flex: 1, overflowY: "auto", maxHeight: "100%" }}>
                    <Sidebar departure={departure}
                        arrival={arrival}
                        setDeparture={setDeparture}
                        setArrival={setArrival}
                        flights={flights}
                        setFlights={setFlights} />
                </div>
            </div>

            {/* 버튼 컨테이너 추가 */}
            <div style={{
                position: 'fixed',
                top: '1vh',
                left: '30vw',
                zIndex: 1000,
                display: 'flex',
                gap: '10px',
            }}>
                <button
                    onClick={() => navigate("/flight")}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3db2ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    예약하러 가기
                </button>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: '#3db2ff',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                        cursor: 'pointer'   
                    }}
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );
};

export default MapPage;
