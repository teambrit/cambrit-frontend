import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { API_BASE_URL } from "../config";
import defaultCompanyLogo from "../assets/default-company-logo.png";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 20; // 한 페이지에 표시할 게시물 수

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posting/page?page=${page}&size=${size}`);
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await res.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <div className="bg-gradient-to-b from-campus-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 mb-6">
              <span className="text-sm font-medium text-gray-600">💡 학생과 기업을 연결하는</span>
              <span className="text-sm font-semibold text-primary-600">학생-기업 매칭 플랫폼</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              캠퍼스 생활하면서<br />
              <span className="text-primary-500">용돈</span>도 함께 벌어요
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              학과, 동아리, 학생회 등 내가 활동하는 커뮤니티에서<br />
              활동하고 수익을 만들어보세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#activities" className="btn-primary inline-flex items-center justify-center gap-2">
                <span>활동 보기</span>
                <span>→</span>
              </a>
              <a href="/signin" className="btn-secondary inline-flex items-center justify-center gap-2">
                <span>시작하기</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 활동 리스트 섹션 */}
      <div id="activities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              지금 모집중인 활동
            </h2>
            <p className="text-gray-600 mt-2">
              총 <span className="font-semibold text-primary-600">{posts.length}개</span>의 활동이 대기중이에요
            </p>
          </div>
        </div>

        {/* 활동 카드 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {posts.length > 0 ? (
            posts.map((post) => (
              <a
                key={post.id}
                href={`/activity/${post.id}`}
                className="card p-5 group cursor-pointer"
              >
                {/* 회사 로고 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={post.logoImage || defaultCompanyLogo}
                      alt={`${post.posterName} Logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{post.posterName}</p>
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </p>
                  </div>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(post.tags || []).slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-campus-50 text-xs font-medium text-campus-700"
                    >
                      {t}
                    </span>
                  ))}
                  {post.tags && post.tags.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* 정보 */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">보상</span>
                    <span className="font-semibold text-primary-600">
                      {post.compensation ? `${post.compensation.toLocaleString()}원` : "협의"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">마감</span>
                    <span className="font-medium text-gray-900">
                      {post.applyDueDate || "상시모집"}
                    </span>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <span className="text-3xl">📭</span>
              </div>
              <p className="text-gray-500">등록된 활동이 없습니다.</p>
            </div>
          )}
        </div>

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
              <span className="font-semibold text-primary-600">{page + 1}</span>
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
