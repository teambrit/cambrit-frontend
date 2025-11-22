export default function BillingCard({ billing }) {
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
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            청구서 #{billing.id}
          </h3>
          <p className="text-xs text-gray-500">Company ID: {billing.companyId}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            billing.status
          )}`}
        >
          {getStatusText(billing.status)}
        </span>
      </div>

      {/* 기간 */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">시작일</p>
            <p className="font-medium text-gray-900">
              {new Date(billing.startedAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">종료일</p>
            <p className="font-medium text-gray-900">
              {new Date(billing.endedAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>
      </div>

      {/* 금액 */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">총 청구 금액</span>
          <span className="text-2xl font-bold text-blue-600">
            {billing.totalAmount?.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
