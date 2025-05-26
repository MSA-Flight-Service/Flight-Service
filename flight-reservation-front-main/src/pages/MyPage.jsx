import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EditProfileForm from "../components/myPage/EditProfileForm.jsx";
import DeleteAccountForm from "../components/myPage/DeleteAccountForm.jsx";
import UserSummary from "../components/myPage/UserSummary.jsx";
import ReservationList from "../components/myPage/ReservationList.jsx";
import apiClient from "../apiClient.jsx";
import { logout } from "../store/authSlice.js";

import "../styles/Mypage.css"

function MyPage() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const currentUserEmail = useSelector((state) => state.auth.email);
  const [user, setUser] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("summary");
  const navigate = useNavigate();

  // Redux의 auth slice에서 user 정보를 가져옵니다.
  const userId = useSelector((state) => state.auth.user);

  if (!userId) {
    console.error("사용자 정보가 없습니다.");
    navigate("/login");
    return null;
  }

  useEffect(() => {
    // accessToken이 없으면 로그인 페이지로 이동합니다.
    if (!accessToken) {
      navigate("/login");
      return;
    }

    // 즉시 실행하는 async 함수를 사용하여 사용자 및 예약 정보를 가져옵니다.
    (async () => {
      try {
        // 사용자 정보를 userid 기준으로 API 호출
        const { data: userDataRaw } = await apiClient.get(`api/users/id/${userId}`);
        const userData = Array.isArray(userDataRaw) ? userDataRaw[0] : userDataRaw;
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("사용자 정보 또는 예약을 불러오는 데 실패했습니다.", error);
      }
    })();
  }, [accessToken, navigate]);

  const handleSaveProfile = async (updatedUser) => {
    try {
      await apiClient.put(`api/users/${updatedUser.id}`, updatedUser);
      setUser(updatedUser);
      alert("내정보가 성공적으로 업데이트되었습니다.");
      // setIsEditing(false);
      window.location.reload();
    } catch (error) {
      alert("내정보 업데이트 중 문제가 발생했습니다." + error);
    }
  };

  const handleConfirmDelete = async (inputEmail) => {
    if (inputEmail.trim().toLowerCase() !== currentUserEmail.toLowerCase()) {
      alert("이메일 확인 실패");
      return;
    }

    try {
      // 회원 탈퇴 API 호출 (소프트 딜리트 또는 실제 삭제)
      await apiClient.delete(`/api/users/${user.id}`);
      alert("회원 탈퇴 처리가 완료되었습니다.");

      // 탈퇴 후 백엔드 로그아웃 엔드포인트 호출 (HttpOnly refresh token 만료)
      await apiClient.post("/api/users/logout");

      // 클라이언트 측 Redux 로그아웃 처리 (accessToken 등 제거)
      dispatch(logout());

      // 탈퇴 후 로그인 페이지로 이동 (또는 원하는 다른 페이지로 이동)
      navigate("/login");
    } catch (error) {
      console.error("회원 탈퇴에 실패했습니다.", error);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleMenuChange = (menu) => {
    setSelectedMenu(menu);
    // setIsEditing(false);
    // setIsDeleting(false);
  };

  const renderContent = () => {
    if (!user) return <p>Loading...</p>;

    switch (selectedMenu) {
      case "summary":
        return <UserSummary user={user} userId={user.id} />;
      case "user":
        return (
          <EditProfileForm
            user={user}
            onCancel={() => setSelectedMenu("summary")}
            onSave={handleSaveProfile}
          />
        );
      case "delete":
        return (
          <DeleteAccountForm
            userEmail={currentUserEmail}
            onCancel={() => setSelectedMenu("summary")}
            onConfirm={handleConfirmDelete}
          />
        );
      case "reservations":
        return <ReservationList userId={user.id} />;
      default:
        return null;
    }
  };

  return (
    <div className={`my-page-container ${selectedMenu}`}>
      <div className="sidebar">
        <ul>
          <li className={`menu-item-wrapper ${selectedMenu === "summary" ? "active summary" : ""}`}>
            <button onClick={() => handleMenuChange("summary")} className={`summary-border ${selectedMenu === "summary" ? "active" : ""}`}>
              마이페이지
            </button>
          </li>
          <li className={`menu-item-wrapper ${selectedMenu === "reservations" ? "active reservations" : ""}`}>
            <button onClick={() => handleMenuChange("reservations")} className={`reservations-border ${selectedMenu === "reservations" ? "active" : ""}`}>
              예매 내역
            </button>
          </li>
          <li className={`menu-item-wrapper ${selectedMenu === "user" ? "active user" : ""}`}>
            <button onClick={() => handleMenuChange("user")} className={`user-border ${selectedMenu === "user" ? "active" : ""}`}>
              회원 정보 수정
            </button>
          </li>
        </ul>
        <ul className="bottom-menu-list">
          <li className={`menu-item-wrapper ${selectedMenu === "delete" ? "active delete" : ""}`}>
            <button onClick={() => handleMenuChange("delete")} className={`delete-border ${selectedMenu === "delete" ? "active" : ""}`}>
              회원 탈퇴
            </button>
          </li>
        </ul>
      </div>

      <div className={`content-wrapper ${selectedMenu}`}>
        <div className={`content ${selectedMenu}-border`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
