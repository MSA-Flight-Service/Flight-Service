import {useEffect, useState} from "react";
import UserManagement from "../components/adminPage/UserManagement.jsx";
import FlightManagement from "../components/adminPage/FlightManagement.jsx";
import ReservationManagement from "../components/adminPage/ReservationManagement.jsx";
import apiClient from "../apiClient.jsx";

const AdminPage = () => {
    const [selectedService, setSelectedService] = useState("users");
    const [users, setUsers] = useState([]);
    const [reservations, setReservations] = useState([]);
    // 필요한 경우 flight 상태도 추가할 수 있습니다.
    // const [flights, setFlights] = useState([]);

    useEffect(() => {
        if (selectedService === "users") {
            apiClient
                .get("/api/admin/users")
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                });
        } else if (selectedService === "reservation") {
            apiClient
                .get("/api/admin/reservations")
                .then((response) => {
                    console.log(response.data)
                    setReservations(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching reservations:", error);
                });
        }
        // 항공 관리를 위한 API 호출도 필요하다면 여기에 else if 조건을 추가합니다.
    }, [selectedService]);

    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
            {/* 왼쪽 메뉴 영역 */}
            <div style={{ width: "250px", backgroundColor: "#f4f4f4", padding: "20px" }}>
                <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>서비스</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li
                        onClick={() => handleServiceClick("users")}
                        style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor: selectedService === "users" ? "#ddd" : "transparent",
                            cursor: "pointer",
                        }}
                    >
                        유저 관리
                    </li>
                    <li
                        onClick={() => handleServiceClick("flight")}
                        style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor: selectedService === "flight" ? "#ddd" : "transparent",
                            cursor: "pointer",
                        }}
                    >
                        항공 관리
                    </li>
                    <li
                        onClick={() => handleServiceClick("reservation")}
                        style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor: selectedService === "reservation" ? "#ddd" : "transparent",
                            cursor: "pointer",
                        }}
                    >
                        예매 관리
                    </li>
                    {/* 추가 서비스 항목 */}
                </ul>
            </div>

            {/* 오른쪽 콘텐츠 영역 */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                {selectedService === "users" && (
                    <UserManagement users={users} setUsers={setUsers} />
                )}
                {selectedService === "flight" && <FlightManagement />}
                {selectedService === "reservation" && (
                    <ReservationManagement
                        reservations={reservations}
                        setReservations={setReservations}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminPage;
