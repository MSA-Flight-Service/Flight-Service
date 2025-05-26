import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/ReservationComplete.css";

function ReservationComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  return (
    <div className="reservation-complete-container">
      <h2 className="reservation-complete-title">예매가 완료되었습니다!</h2>
      <p className="reservation-complete-message">
        감사합니다! <br />
        <strong>결제는 마이페이지</strong>에서 진행하실 수 있어요.
      </p>
      <div className="reservation-complete-buttons">
        <button
          className="reservation-complete-button reservation-complete-button-primary"
          onClick={() => navigate("/mypage")}
        >
          마이페이지로 이동
        </button>
        <button
          className="reservation-complete-button reservation-complete-button-secondary"
          onClick={() => navigate("/")}
        >
          홈으로 돌아가기
        </button>
        <button
          className="reservation-complete-button reservation-complete-button-outline"
          onClick={() => navigate(from)}
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default ReservationComplete;
