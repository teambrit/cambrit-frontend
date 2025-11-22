import { Link } from "react-router-dom";

export default function PostingCard({ posting }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <Link to={`/activity/${posting.id}`} target="_blank" rel="noopener noreferrer" className="block">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
          {posting.title}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">{posting.posterName}</span>
          <span className="text-lg font-bold text-blue-600">
            {posting.compensation?.toLocaleString()}원
          </span>
        </div>
        {posting.tags && posting.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {posting.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {posting.applyDueDate && (
          <p className="text-xs text-gray-500 mt-2">
            마감일: {new Date(posting.applyDueDate).toLocaleDateString("ko-KR")}
          </p>
        )}
      </Link>
    </div>
  );
}
