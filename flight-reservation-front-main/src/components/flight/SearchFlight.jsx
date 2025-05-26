import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AirportSelectModal from "./AirportSelectModal.jsx";
import "./SearchFlight.css";

const SearchFlight = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [tripType, setTripType] = useState("round");
  const [departure, setDeparture] = useState({ name: "인천", code: "ICN" });
  const [arrival, setArrival] = useState({ name: "김포", code: "GMP" });
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const searchRef = useRef(null);
  const departureBoxRef = useRef(null);  // 출발지 선택 박스의 ref
  const arrivalBoxRef = useRef(null);   // 도착지 선택 박스의 ref

  const [isDepartureModalOpen, setIsDepartureModalOpen] = useState(false);
  const [isArrivalModalOpen, setIsArrivalModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({
    departureTop: 0, departureLeft: 0, arrivalTop: 0, arrivalLeft: 0
  });

  // 모달 위치 계산 함수
  const calculateModalPosition = () => {
    if (departureBoxRef.current) {
      const departureRect = departureBoxRef.current.getBoundingClientRect();
      setModalPosition((prev) => ({
        ...prev,
        departureTop: ((departureRect.bottom + window.scrollY) / window.innerHeight) * 100,
        departureLeft: ((departureRect.left + window.scrollX) / window.innerWidth) * 100
      }));
    }

    if (arrivalBoxRef.current) {
      const arrivalRect = arrivalBoxRef.current.getBoundingClientRect();
      setModalPosition((prev) => ({
        ...prev,
        arrivalTop: ((arrivalRect.bottom + window.scrollY) / window.innerHeight) * 100,
        arrivalLeft: ((arrivalRect.left + window.scrollX) / window.innerWidth) * 100
      }));
    }
  };

  const toggleDepartureModal = () => {
  if (isDepartureModalOpen) {
    setIsDepartureModalOpen(false); // 이미 열려 있으면 닫기
  } else {
    setIsArrivalModalOpen(false);   // 다른 모달 닫고
    setIsDepartureModalOpen(true);  // 이 모달 열기
  }
};

const toggleArrivalModal = () => {
  if (isArrivalModalOpen) {
    setIsArrivalModalOpen(false); // 이미 열려 있으면 닫기
  } else {
    setIsDepartureModalOpen(false); // 다른 모달 닫고
    setIsArrivalModalOpen(true);    // 이 모달 열기
  }
};

  // 스크롤 시 모달 위치 업데이트
  useEffect(() => {
    calculateModalPosition(); // 처음 렌더링 시 위치 계산
    window.addEventListener("scroll", calculateModalPosition);  // 스크롤 시 위치 갱신

    return () => {
      window.removeEventListener("scroll", calculateModalPosition);  // 컴포넌트 언마운트 시 이벤트 해제
    };
  }, [isDepartureModalOpen, isArrivalModalOpen]);  // 모달이 열릴 때마다 위치 갱신

  const handleSearch = () => {
    if (!departure || !arrival) {
      alert("출발지와 도착지를 선택하세요.");
      return;
    }

    const searchData = {
      tripType,
      departure: departure.name,
      arrival: arrival.name,
      departureCode: departure.code,
      arrivalCode: arrival.code,
      date,
      returnDate
    };

    navigate("/flight", { state: searchData });
  };

  const handleSwap = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const handleReset = () => {
    setTripType("round");
    setDeparture({ name: "인천", code: "ICN" });
    setArrival({ name: "김포", code: "GMP" });
    setDate("");
    setReturnDate("");
  };

  return (
    <div className="flight-search-box">
      <h2>항공권 검색</h2>
      {/* 왕복/편도 탭 */}
      <div className="trip-tabs">
        <button
          className={tripType === "round" ? "active" : ""}
          onClick={() => setTripType("round")}
        >
          왕복
        </button>
        <button
          className={tripType === "oneway" ? "active" : ""}
          onClick={() => setTripType("oneway")}
        >
          편도
        </button>
      </div>

      {/* 출발지, 도착지 선택 */}
      <div className="airport-row">
        <div
          className="airport-box"
          onClick={toggleDepartureModal}
          ref={departureBoxRef} // 출발지 박스의 ref 설정
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="airport-label">{departure.name}</div>
          <div className="airport-code">
            {departure.code} <span>▼</span>
          </div>
        </div>

        <button type="button" className="swap-btn" onClick={handleSwap}>
          ⇄
        </button>

        <div
          className="airport-box"
          onClick={toggleArrivalModal}
          ref={arrivalBoxRef} // 도착지 박스의 ref 설정
        >
          <div className="airport-label">{arrival.name}</div>
          <div className="airport-code">
            {arrival.code} <span>▼</span>
          </div>
        </div>
      </div>

      {/* 공항 모달 */}
      {isDepartureModalOpen && (
        <AirportSelectModal
          onClose={() => setIsDepartureModalOpen(false)}
          triggerRef={searchRef}
          onSelect={(airport) => setDeparture(airport)}
          style={{
            top: `${modalPosition.departureTop- (isHomePage ? 37.5 : 0)}vh`,
            left: `${modalPosition.departureLeft- (isHomePage ? 9.5 : 0)}vw`,
          }}
        />
      )}

      {isArrivalModalOpen && (
        <AirportSelectModal
          onClose={() => setIsArrivalModalOpen(false)}
          triggerRef={searchRef}
          onSelect={(airport) => setArrival(airport)}
          style={{
            top: `${modalPosition.arrivalTop - (isHomePage ? 37.5 : 0)}vh`, 
            left: `${modalPosition.arrivalLeft- (isHomePage ? 9.5 : 0)}vw`,
          }}
        />
      )}

      {/* 날짜 선택 */}
      <div className="date-row">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {tripType === "round" && (
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        )}
      </div>

      {/* 버튼 */}
      <div className="action-row">
        <button className="reset-btn" onClick={handleReset}>
          ↻ 초기화
        </button>
        <button className="search-btn" onClick={handleSearch}>
          검색
        </button>
      </div>
    </div>
  );
};

export default SearchFlight;
