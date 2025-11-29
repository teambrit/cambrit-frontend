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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">청구서</h1>
          <p className="text-sm text-gray-600 mt-1">월별 청구 내역을 확인하세요</p>
        </div>

        {/* 빌링 목록 테이블 */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">청구 내역</h2>
          {billings.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <p className="text-gray-500">청구 내역이 없습니다</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">기간</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">이용 금액</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">상태</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">상세</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billings.map((billing) => (
                    <tr key={billing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">
                          {formatDate(billing.startedAt)} ~ {formatDate(billing.endedAt)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {billing.totalAmount.toLocaleString()}원
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            billing.status === "PENDING"
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {billing.status === "PENDING" ? "미결제" : "결제완료"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => fetchBillingDetail(billing.id)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 rounded hover:bg-slate-100 border border-slate-200 transition-colors"
                        >
                          상세 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 빌링 상세 내역 */}
        {selectedBilling && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedBilling.startedAt)} 상세 내역
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  총 {selectedBilling.items?.length || 0}건
                </p>
              </div>
              <button
                onClick={() => setSelectedBilling(null)}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                ✕ 닫기
              </button>
            </div>

            {detailLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">불러오는 중...</p>
              </div>
            ) : selectedBilling.items && selectedBilling.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">활동명</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">학생명</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">청구일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedBilling.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-900">{item.postingTitle}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-900">{item.studentName}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-600">
                            {formatDetailDate(item.chargedDate)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <span className="text-3xl">📭</span>
                </div>
                <p className="text-gray-500">해당 기간에 고용한 학생이 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
