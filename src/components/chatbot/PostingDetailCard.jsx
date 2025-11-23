import { Link } from "react-router-dom";

export default function PostingDetailCard({ posting }) {
  return (
    <div className="card p-6">
      {/* 헤더 */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {posting.title}
        </h2>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {posting.logoImage && (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={posting.logoImage}
                  alt="기업 로고"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{posting.posterName}</p>
              <p className="text-sm text-gray-500">{posting.posterEmail}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600 mb-1">
              {posting.compensation?.toLocaleString()}원
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                posting.status === "ACTIVE"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {posting.status === "ACTIVE" ? "✓ 모집중" : "· 마감"}
            </span>
          </div>
        </div>
      </div>

      {/* 태그 */}
      {posting.tags && posting.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {posting.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 rounded-md bg-campus-50 text-xs font-medium text-campus-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 본문 */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">활동 내용</h3>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {posting.body}
        </p>
      </div>

      {/* 날짜 정보 */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {posting.applyDueDate && (
          <div>
            <p className="text-xs text-gray-500 mb-1">지원 마감일</p>
            <p className="font-semibold text-gray-900">
              {new Date(posting.applyDueDate).toLocaleDateString("ko-KR")}
            </p>
          </div>
        )}
        {posting.activityStartDate && (
          <div>
            <p className="text-xs text-gray-500 mb-1">활동 시작일</p>
            <p className="font-semibold text-gray-900">
              {new Date(posting.activityStartDate).toLocaleDateString("ko-KR")}
            </p>
          </div>
        )}
        {posting.activityEndDate && (
          <div>
            <p className="text-xs text-gray-500 mb-1">활동 종료일</p>
            <p className="font-semibold text-gray-900">
              {new Date(posting.activityEndDate).toLocaleDateString("ko-KR")}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 mb-1">게시일</p>
          <p className="font-semibold text-gray-900">
            {new Date(posting.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </div>

      {/* 상세보기 버튼 */}
      <Link
        to={`/activity/${posting.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full text-center block"
      >
        상세 페이지 열기
      </Link>
    </div>
  );
}
