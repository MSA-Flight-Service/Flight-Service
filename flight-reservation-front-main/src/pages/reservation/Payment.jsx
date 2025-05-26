import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";


function Payment() {
  const [params] = useSearchParams();
  const rId = Number(params.get('rId'));
  const uId = Number(params.get('uId'));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAlreadyPaid, setIsAlreadyPaid] = useState(false);

  // ✅ 창 진입 시 유효성 검사 및 결제 여부 확인
  useEffect(() => {
    window.opener?.focus();

    if (isNaN(rId) || isNaN(uId)) {
      alert("잘못된 요청입니다. (rId 또는 uId가 숫자가 아닙니다)");
      window.close();
      return;
    }

    // ✅ 결제 여부 확인
    const checkPaid = async () => {
        try {
          const params = new URLSearchParams();
          params.append("rIds", rId); // 대괄호 없이 rIds=38
      
          const { data } = await apiClient.get(
            `/api/reservations/payments/check-paid?${params.toString()}`
          );
      
          if (data[rId]) {
            alert("이미 결제된 예약입니다.");
            setIsAlreadyPaid(true);
            window.close();
          }
        } catch (err) {
          console.error("결제 상태 확인 실패", err);
          setError("❌ 결제 상태 확인 중 오류");
        }
      };
      

    checkPaid();
  }, []);

  const handleComplete = async () => {
    try {
      setLoading(true);
      await apiClient.post(`/api/reservations/payments/virtual/${rId}`, null, {
        params: { uId }
      });

      alert("✅ 결제가 완료되었습니다.");
      window.opener?.postMessage('payment-complete', '*');
      window.close();
    } catch (e) {
      console.error("결제 실패", e);
      setError("❌ 결제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>가상 결제창</h2>
      {isNaN(rId) || isNaN(uId) ? (
        <p style={{ color: 'red' }}>잘못된 접근입니다. rId/uId 파라미터가 올바르지 않습니다.</p>
      ) : isAlreadyPaid ? (
        <p>이미 결제된 예약입니다.</p>
      ) : (
        <>
          <p>여기서 결제를 완료해주세요.</p>
          <button onClick={handleComplete} disabled={loading}>
            {loading ? "결제 중..." : "결제 완료"}
          </button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Payment;
