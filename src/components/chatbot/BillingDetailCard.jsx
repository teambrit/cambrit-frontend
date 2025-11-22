export default function BillingDetailCard({ billing }) {
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "PAID":
        return "결제완료";
      case "CANCELLED":
        return "취소됨";
      case "OVERDUE":
        return "기한초과";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "PAID":
        return "text-green-700 bg-green-50 border-green-200";
      case "CANCELLED":
        return "text-gray-700 bg-gray-50 border-gray-200";
      case "OVERDUE":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            청구서 #{billing.id}
          </h2>
          <p className="text-sm text-gray-500">Company ID: {billing.companyId}</p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
            billing.status
          )}`}
        >
          {getStatusText(billing.status)}
        </span>
      </div>

      {/* 청구 기간 */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">청구 기간</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">시작일</p>
            <p className="font-medium text-gray-900">
              {new Date(billing.startedAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">종료일</p>
            <p className="font-medium text-gray-900">
              {new Date(billing.endedAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 청구 항목 목록 */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          청구 항목 ({billing.items?.length || 0}건)
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {billing.items && billing.items.length > 0 ? (
            billing.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {item.postingTitle}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>공고 ID: {item.postingId}</span>
                      <span>•</span>
                      <span>학생: {item.studentName} (ID: {item.studentId})</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  청구일:{" "}
                  {new Date(item.chargedDate).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              청구 항목이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 총 청구 금액 */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-lg font-semibold text-gray-900">
            총 청구 금액
          </span>
          <span className="text-3xl font-bold text-blue-600">
            {billing.totalAmount?.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
