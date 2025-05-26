import apiClient from "../../apiClient.jsx";


const GroupPaymentButton = ({ groupList, userId, paidStatus, refresh }) => {
  if (!groupList || groupList.length === 0) return null;

  const groupId = groupList[0].groupId;
  const isAllPaid = groupList.every(r => paidStatus[r.rid]);
  const isAnyPaid = groupList.some(r => paidStatus[r.rid]);

  const handleGroupPay = async () => {
    if (isAnyPaid && !isAllPaid) {
      alert("⚠️ 일부 결제된 예매가 있습니다.");
    }

    try {
      await apiClient.post(`/api/reservations/payments/virtual/by-group`, null, {
        params: { groupId, uId: userId }
      });
      alert("✅ 단체 결제가 완료되었습니다.");
      refresh?.();
    } catch (e) {
      alert("❌ 단체 결제 실패");
      console.error(e);
    }
  };

  const handleGroupCancel = async () => {
    if (isAnyPaid && !isAllPaid) {
      alert("⚠️ 일부 결제된 예매가 있습니다.");
    }

    const confirmed = window.confirm("정말로 이 예약 그룹 전체를 취소하시겠습니까?");
    if (!confirmed) return;

    try {
      await apiClient.delete("/api/reservations/payments/reservations/by-group", {
        params: { groupId, uId: userId }
      });
      alert("✅ 전체 예약이 취소되었습니다.");
      refresh?.();
    } catch (e) {
      alert("❌ 전체 예약 취소에 실패했습니다.");
      console.error(e);
    }
  };

  const disableButtons = isAllPaid;

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button
        onClick={handleGroupPay}
        disabled={disableButtons}
        style={{
          backgroundColor: disableButtons ? "#9e9e9e" : "#4caf50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: disableButtons ? "not-allowed" : "pointer"
        }}
      >
        💳 단체 결제
      </button>

      <button
        onClick={handleGroupCancel}
        disabled={disableButtons}
        style={{
          backgroundColor: disableButtons ? "#9e9e9e" : "#f44336",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: disableButtons ? "not-allowed" : "pointer"
        }}
      >
        ❌ 전체 취소
      </button>
    </div>
  );
};

export default GroupPaymentButton;
