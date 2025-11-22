import { Link } from "react-router-dom";

export default function ApplicantCard({ applicant }) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-700 bg-green-50 border-green-200";
      case "REJECTED":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
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

  const getAuthStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "REJECTED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {applicant.applicantName}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{applicant.applicantEmail}</p>
          <p className="text-xs text-gray-500">지원자 ID: {applicant.applicantId}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            applicant.status
          )}`}
        >
          {getStatusText(applicant.status)}
        </span>
      </div>

      {/* 학교 정보 */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">학교</p>
            <p className="font-medium text-gray-900">
              {applicant.applicantUniversity || "미등록"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">전공</p>
            <p className="font-medium text-gray-900">
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
          <p className="text-xs text-gray-500 mb-1">소개</p>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">
            {applicant.applicantDescription}
          </p>
        </div>
      )}

      {/* 학생 인증 상태 */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">학생 인증 상태</p>
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${getAuthStatusColor(
            applicant.applicantAuthorizationStatus
          )}`}
        >
          {getAuthStatusText(applicant.applicantAuthorizationStatus)}
        </span>
      </div>

      {/* 지원일 */}
      <div className="border-t pt-4">
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
