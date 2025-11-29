import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { API_BASE_URL } from "../../config";

export default function CompanyActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 20;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // /user/me로 회사 ID 가져오기
        const meRes = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error("내 정보 불러오기 실패");
        const meData = await meRes.json();

        // /posting/page로 회사 등록 공고 조회 (최신순 정렬)
        const postingsRes = await fetch(
          `${API_BASE_URL}/posting/page?page=${page}&size=${size}&posterId=${meData.id}&sort=createdAt,desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!postingsRes.ok) throw new Error("공고 조회 실패");
        const postingsData = await postingsRes.json();

        setActivities(postingsData.content || []);
        setTotalPages(postingsData.totalPages || 0);
      } catch (error) {
        console.error(error);
        alert("공고 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">활동 관리</h1>
              <p className="text-sm text-gray-600 mt-1">등록한 활동을 관리하고 지원자를 확인하세요</p>
            </div>
            <Link
              to="/company/activity/new"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              + 새 활동 등록
            </Link>
          </div>
        </div>

        {/* 활동 목록 */}
        {activities.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <p className="text-gray-500 mb-4">등록된 활동이 없습니다</p>
              <Link
                to="/company/activity/new"
                className="inline-block px-5 py-2.5 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
              >
                첫 활동 등록하기
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((item) => (
              <Link
                key={item.id}
                to={`/company/activity/management/${item.id}`}
                className="card p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-slate-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {item.body}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">보상 금액</span>
                      <span className="font-semibold text-gray-900">
                        {item.compensation ? `${item.compensation.toLocaleString()}원` : "협의"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">지원 마감일</span>
                      <span className="font-semibold text-gray-900">
                        {item.applyDueDate || "상시모집"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
                      관리하기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              <span className="font-semibold text-slate-700">{page + 1}</span>
              {" / "}
              {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
              disabled={page + 1 >= totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
