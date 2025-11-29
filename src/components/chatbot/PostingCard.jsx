import { Link } from "react-router-dom";
import defaultCompanyLogo from "../../assets/default-company-logo.png";
import { formatImageUrl } from "../../utils/imageUtils";

export default function PostingCard({ posting }) {
  return (
    <Link to={`/activity/${posting.id}`} target="_blank" rel="noopener noreferrer" className="block">
      <div className="card p-5 hover:shadow-md transition-shadow h-full">
        {/* 회사 로고 + 제목 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={formatImageUrl(posting.logoImage) || defaultCompanyLogo}
              alt={`${posting.posterName} Logo`}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 flex-1">
            {posting.title}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{posting.posterName}</span>
            <span className="text-base font-semibold text-primary-600">
              {posting.compensation?.toLocaleString()}원
            </span>
          </div>
          {posting.tags && posting.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {posting.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-campus-50 text-xs font-medium text-campus-700"
                >
                  {tag}
                </span>
              ))}
              {posting.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                  +{posting.tags.length - 3}
                </span>
              )}
            </div>
          )}
          {posting.applyDueDate && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                마감: {new Date(posting.applyDueDate).toLocaleDateString("ko-KR")}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
