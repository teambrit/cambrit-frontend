export default function ApplicantCard({ applicant }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700";
      case "REJECTED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "선발됨";
      case "REJECTED":
        return "탈락";
      default:
        return "검토중";
    }
  };

  const getAuthStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-blue-50 text-blue-700";
      case "REJECTED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAuthStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "인증됨";
      case "PENDING":
        return "인증대기";
      case "REJECTED":
        return "인증거절";
      case "NONE":
        return "미인증";
      default:
        return status;
    }
  };

  return (
    <div className="card p-5 hover:shadow-md transition-shadow h-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {applicant.applicantName}
          </h3>
          <p className="text-sm text-gray-600 mb-1 truncate">{applicant.applicantEmail}</p>
          <p className="text-xs text-gray-500">지원자 ID: {applicant.applicantId}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(
            applicant.status
          )}`}
        >
          {getStatusText(applicant.status)}
        </span>
      </div>

      {/* 학교 정보 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">학교</p>
            <p className="font-semibold text-gray-900">
              {applicant.applicantUniversity || "미등록"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">전공</p>
            <p className="font-semibold text-gray-900">
              {applicant.applicantMajor || "미등록"}
            </p>
          </div>
        </div>
      </div>

      {/* 연락처 */}
      {applicant.applicantPhoneNumber && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">연락처</p>
          <p className="text-sm font-medium text-gray-900">
            {applicant.applicantPhoneNumber}
          </p>
        </div>
      )}

      {/* 소개 */}
      {applicant.applicantDescription && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">소개</p>
          <p className="text-sm text-gray-900 whitespace-pre-wrap p-3 bg-gray-50 rounded-lg border border-gray-200 line-clamp-3">
            {applicant.applicantDescription}
          </p>
        </div>
      )}

      {/* 학생 인증 상태 */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">학생 인증 상태</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getAuthStatusBadge(
            applicant.applicantAuthorizationStatus
          )}`}
        >
          {getAuthStatusText(applicant.applicantAuthorizationStatus)}
        </span>
      </div>

      {/* 지원일 */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">
          지원일: {new Date(applicant.createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
