import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function CompanyBill() {
  const [billings, setBillings] = useState([]);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 빌링 목록 조회
  useEffect(() => {
    const fetchBillings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/billing/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("빌링 내역을 불러올 수 없습니다.");
        const data = await res.json();
        setBillings(data);
      } catch (error) {
        console.error(error);
        alert("빌링 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBillings();
  }, [token]);

  // 빌링 상세 조회
  const fetchBillingDetail = async (billingId) => {
    try {
      setDetailLoading(true);
      const res = await fetch(`${API_BASE_URL}/billing/${billingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("빌링 상세 내역을 불러올 수 없습니다.");
      const data = await res.json();
      setSelectedBilling(data);
    } catch (error) {
      console.error(error);
      alert("빌링 상세 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    });
  };

  const formatDetailDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  // 상태 한글 변환
  const getStatusText = (status) => {
    return status === "PENDING" ? "결제 X" : "결제 O";
  };

  const getStatusColor = (status) => {
    return status === "PENDING" ? "text-red-600" : "text-green-600";
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">빌링 내역</h2>

      {/* 빌링 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {billings.length === 0 ? (
          <p className="text-gray-500 text-sm">빌링 내역이 없습니다.</p>
        ) : (
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">기간</th>
                <th className="border px-4 py-2 text-left">이용 금액</th>
                <th className="border px-4 py-2 text-left">상태</th>
                <th className="border px-4 py-2 text-center">상세 조회</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((billing) => (
                <tr key={billing.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {formatDate(billing.startedAt)} ~ {formatDate(billing.endedAt)}
                  </td>
                  <td className="border px-4 py-2 font-medium">
                    {billing.totalAmount.toLocaleString()}원
                  </td>
                  <td className={`border px-4 py-2 font-medium ${getStatusColor(billing.status)}`}>
                    {getStatusText(billing.status)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => fetchBillingDetail(billing.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      상세 조회
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 빌링 상세 내역 */}
      {selectedBilling && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {formatDate(selectedBilling.startedAt)} 상세 내역
            </h3>
            <button
              onClick={() => setSelectedBilling(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕ 닫기
            </button>
          </div>

          {detailLoading ? (
            <p className="text-gray-500 text-sm">불러오는 중...</p>
          ) : selectedBilling.items && selectedBilling.items.length > 0 ? (
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">공고명</th>
                  <th className="border px-4 py-2 text-left">학생명</th>
                  <th className="border px-4 py-2 text-left">날짜</th>
                </tr>
              </thead>
              <tbody>
                {selectedBilling.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.postingTitle}</td>
                    <td className="border px-4 py-2">{item.studentName}</td>
                    <td className="border px-4 py-2">
                      {formatDetailDate(item.chargedDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">해당 기간에 고용한 학생이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
