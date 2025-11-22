import { Link } from "react-router-dom";

export default function ApplicationCard({ application }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-50";
      case "REJECTED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "선발됨";
      case "REJECTED":
        return "탈락";
      default:
        return "지원 완료";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <Link to={`/activity/${application.postingId}`} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 flex-1">
            {application.postingTitle}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              application.status
            )}`}
          >
            {getStatusText(application.status)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{application.posterName}</p>
        {application.postingTags && application.postingTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {application.postingTags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500">
          지원일: {new Date(application.createdAt).toLocaleDateString("ko-KR")}
        </p>
      </Link>
    </div>
  );
}
