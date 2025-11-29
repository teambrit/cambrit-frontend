export default function BillingCard({ billing }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-50 text-blue-700";
      case "PAID":
        return "bg-green-50 text-green-700";
      case "CANCELLED":
        return "bg-gray-100 text-gray-700";
      case "OVERDUE":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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

  return (
    <div className="card p-5 hover:shadow-md transition-shadow h-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            청구서 #{billing.id}
          </h3>
          <p className="text-xs text-gray-500">Company ID: {billing.companyId}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(
            billing.status
          )}`}
        >
          {getStatusText(billing.status)}
        </span>
      </div>

      {/* 기간 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">시작일</p>
            <p className="font-semibold text-gray-900">
              {new Date(billing.startedAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">종료일</p>
            <p className="font-semibold text-gray-900">
              {new Date(billing.endedAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>
      </div>

      {/* 금액 */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">총 청구 금액</span>
          <span className="text-2xl font-bold text-primary-600">
            {billing.totalAmount?.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
