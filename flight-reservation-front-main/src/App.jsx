import {useDispatch} from "react-redux";
import {useEffect} from "react";
import ScrollTop from "./components/ScrollTop.jsx";
import RouteSetup from "./routes/RouteSetup.jsx";
import {login, logout} from "./store/authSlice.js";
import apiClient from "./apiClient.jsx";
import "./App.css"


function App() {
  const dispatch = useDispatch();

  
  // 인증 및 자동 로그인 처리
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        // 백엔드에 토큰 정보 요청: 응답에는 email, userId, isAdmin 등의 정보가 포함됩니다.
        const tokenInfoResponse = await apiClient.get("/api/users/token-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { email, userId, admin } = tokenInfoResponse.data;

        // Redux에 로그인 정보 저장
        dispatch(
            login({
              email,
              accessToken: token,
              userId,
              admin
            })
        );
      } catch (error) {
        // 토큰 정보 요청 실패 시 (예: 401 Unauthorized) 토큰 만료 등의 이유로 refresh 요청 실행
        if (error.response && error.response.status === 401) {
          try {
            // refresh 엔드포인트 호출하여 새로운 토큰 발급 요청
            const refreshResponse = await apiClient.post(
                "/api/users/refresh",
                {},
                { withCredentials: true }
            );

            const newAccessToken = refreshResponse.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);

            // 새로운 토큰으로 다시 토큰 정보 요청
            const newTokenInfoResponse = await apiClient.get("/api/users/token-info", {
              headers: { Authorization: `Bearer ${newAccessToken}` },
            });
            const { email, userId, admin } = newTokenInfoResponse.data;

            // Redux에 갱신된 로그인 정보 저장
            dispatch(
                login({
                  email,
                  accessToken: newAccessToken,
                  userId,
                  admin
                })
            );
          } catch (refreshError) {
            console.error("토큰 재발급 또는 토큰 정보 가져오기 실패", refreshError);
            dispatch(logout());
          }
        } else {
          console.error("토큰 정보 호출 오류", error);
          dispatch(logout());
        }
      }
    };

    verifyToken();
  }, [dispatch]);

  return (
    <div>
      <div>
        <ScrollTop />
        <RouteSetup />
      </div>
    </div>
  );
}

export default App;
