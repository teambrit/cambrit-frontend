import { Link } from "react-router-dom";

export default function UserProfileCard({ user }) {
  const getRoleText = (role) => {
    switch (role) {
      case "STUDENT":
        return "학생";
      case "COMPANY":
        return "기업";
      case "ADMIN":
        return "관리자";
      default:
        return role;
    }
  };

  const getAuthStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "승인됨";
      case "PENDING":
        return "대기중";
      case "REJECTED":
        return "거절됨";
      case "NONE":
        return "미신청";
      default:
        return status;
    }
  };

  const getAuthStatusColor = (status) => {
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

  return (
    <div className="card p-6">
      <div className="flex items-start gap-4 mb-6">
        {user.profileImage && (
          <img
            src={user.profileImage}
            alt="프로필"
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <span className="px-3 py-1 bg-campus-50 text-campus-700 text-xs font-semibold rounded-full">
              {getRoleText(user.role)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{user.email}</p>
          <p className="text-xs text-gray-500">ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-gray-500 text-xs mb-2">계정 상태</p>
          <p className="font-semibold">
            {user.isAuthorized ? (
              <span className="text-green-600">✓ 인증됨</span>
            ) : (
              <span className="text-gray-600">· 미인증</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-2">학생 인증 상태</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getAuthStatusColor(
              user.studentAuthorizationStatus
            )}`}
          >
            {getAuthStatusText(user.studentAuthorizationStatus)}
          </span>
        </div>
      </div>

      {/* 학생 정보 */}
      {user.role === "STUDENT" && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">학생 정보</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">학교</span>
              <span className="text-gray-900 font-medium">
                {user.university || "미등록"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">전공</span>
              <span className="text-gray-900 font-medium">{user.major || "미등록"}</span>
            </div>
          </div>
        </div>
      )}

      {/* 기업 정보 */}
      {user.role === "COMPANY" && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">기업 정보</h4>
          <div className="space-y-2 text-sm">
            {user.companyCode && (
              <div className="flex justify-between">
                <span className="text-gray-500">사업자번호</span>
                <span className="text-gray-900 font-medium">{user.companyCode}</span>
              </div>
            )}
            {user.companyUrl && (
              <div className="flex justify-between">
                <span className="text-gray-500">홈페이지</span>
                <a
                  href={user.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
                >
                  링크
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 연락처 및 소개 */}
      <div className="border-t border-gray-100 pt-4 mb-6">
        <div className="space-y-3 text-sm">
          {user.phoneNumber && (
            <div className="flex justify-between">
              <span className="text-gray-500">전화번호</span>
              <span className="text-gray-900 font-medium">{user.phoneNumber}</span>
            </div>
          )}
          {user.description && (
            <div>
              <p className="text-gray-500 mb-2">소개</p>
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap p-3 bg-gray-50 rounded-lg border border-gray-200">
                {user.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 마이페이지 버튼 */}
      <Link
        to="/mypage"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full text-center block"
      >
        마이페이지에서 확인하기
      </Link>
    </div>
  );
}
