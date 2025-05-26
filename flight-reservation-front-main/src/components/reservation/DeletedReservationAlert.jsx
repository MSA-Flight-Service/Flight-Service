import {useEffect, useState} from "react";
import apiClient from "../../apiClient.jsx";

function DeletedReservationAlert({ userId }) {
  const [deletedCount, setDeletedCount] = useState(0);

  useEffect(() => {
    const checkDeleted = async () => {
      try {
        const { data } = await apiClient.get(`/api/deleted-reservations?uId=${userId}`);
        const unseen = data.filter(item => !item.isChecked);

        if (unseen.length > 0) {
          setDeletedCount(unseen.length);
          await apiClient.put(`/api/deleted-reservations/mark-checked?uId=${userId}`);
        }
      } catch (e) {
        console.error("❌ 삭제된 예약 조회 실패", e);
      }
    };
    checkDeleted();
  }, [userId]);

  if (deletedCount === 0) return null;

  return (
    <div style={{
      backgroundColor: "#ffe0e0",
      color: "#b00020",
      padding: "12px 16px",
      marginBottom: "16px",
      borderRadius: "6px",
      fontWeight: "bold"
    }}>
      ❗ 자동 삭제된 미결제 예약이 {deletedCount}건 있습니다.
    </div>
  );
}

export default DeletedReservationAlert;
