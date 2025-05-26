import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import { logout } from "../store/authSlice";
import apiClient from "../apiClient.jsx";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!confirmed) return;
    try {
      // 로컬 스토리지나 Redux에서 accessToken 가져오기 (예시)
      const accessToken = localStorage.getItem("accessToken");
      // 또는 Redux 상태에서 가져온다면: const { accessToken } = useSelector((state) => state.auth);

      // 백엔드 로그아웃 엔드포인트 호출시 올바른 Authorization 헤더 추가
      await apiClient.post(
        "/api/users/logout", // 백엔드 매핑 경로에 맞춰주세요.
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // 클라이언트 측 Redux 로그아웃 처리
      dispatch(logout());
      // 홈페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("로그아웃에 실패했습니다:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };



  return (
    <div className="header">
      <h1 onClick={() => navigate("/")} className="logo">
        Airplanit
      </h1>

      <nav className="nav-menu">
        <span onClick={() => navigate("/flight")}>항공권</span>
        <div className="nav-item">
          <span>관광지</span>
          <div className="dropdown">
            <div
              className="dropdown-item"
              onClick={() => navigate("/rplace")}
            >
              지역별 추천 관광지
            </div>
            <div
              className="dropdown-item"
              onClick={() => navigate("/splace")}
            >
              관광지 검색
            </div>
          </div>
        </div>
        <span onClick={() => navigate("/help")}>고객센터</span>
      </nav>

      <div className="header-buttons">
        {isLoggedIn ? (
          <>
            {isAdmin && (
              <button className="mypage-btn" onClick={() => navigate("/admin")}>
                관리자
              </button>
            )}
            <button
              className="mypage-btn"
              onClick={() => navigate("/mypage")}
            >
              마이 페이지
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              회원가입
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
