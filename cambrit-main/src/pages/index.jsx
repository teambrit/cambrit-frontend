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
    <div className="container mx-auto py-3 sm:py-4">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-10">
        <div className="mx-auto">
          <h2 className="text-pretty text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            지금 등록된 활동
          </h2>
        </div>

        {/* 활동 카드 리스트 */}
        <div className="mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <a
                key={post.id}
                href={`/activity/${post.id}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition hover:shadow-md"
              >
                {/* 회사 로고 */}
                <div className="flex justify-center mb-3">
                  <img
                    src={post.logoImage || defaultCompanyLogo}
                    alt={`${post.posterName} Logo`}
                    className="h-12 w-auto object-contain"
                  />
                </div>

                {/* 제목 */}
                <h5 className="mb-2 text-base font-semibold tracking-tight text-gray-900">
                  {post.title}
                </h5>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(post.tags || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20"
                    >
                      {t}
                    </span>
                  ))}

                  {/* 보상 금액 */}
                  <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    💰 {post.compensation ? `${post.compensation}원` : "미정"}
                  </span>

                  {/* 마감일 */}
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-400/30">
                    📅 {post.applyDueDate || "-"}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p className="text-gray-500 col-span-4 text-center mt-10">등록된 활동이 없습니다.</p>
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-10">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{page + 1}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              >
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-40"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon aria-hidden="true" className="size-5" />
                </button>
                <button
                  onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                  disabled={page + 1 >= totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-40"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon aria-hidden="true" className="size-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
