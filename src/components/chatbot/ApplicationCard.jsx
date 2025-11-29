import { Link } from "react-router-dom";
import defaultCompanyLogo from "../../assets/default-company-logo.png";
import { formatImageUrl } from "../../utils/imageUtils";

export default function ApplicationCard({ application }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700";
      case "REJECTED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "✓ 선발됨";
      case "REJECTED":
        return "✗ 탈락";
      default:
        return "· 지원 완료";
    }
  };

  return (
    <Link to={`/activity/${application.postingId}`} target="_blank" rel="noopener noreferrer" className="block">
      <div className="card p-5 hover:shadow-md transition-shadow h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={formatImageUrl(application.logoImage || application.posterLogoImage) || defaultCompanyLogo}
                alt={`${application.posterName} Logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 flex-1 min-w-0">
              {application.postingTitle}
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(
              application.status
            )}`}
          >
            {getStatusText(application.status)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-3 ml-13">{application.posterName}</p>
        {application.postingTags && application.postingTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {application.postingTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded-md bg-campus-50 text-xs font-medium text-campus-700"
              >
                {tag}
              </span>
            ))}
            {application.postingTags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                +{application.postingTags.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            지원일: {new Date(application.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </div>
    </Link>
  );
}
