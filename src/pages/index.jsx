import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const posts = [
  {
    id: 1,
    title: "고려대학교 컴퓨터학과 학생 모집",
    href: "/activity",
    tag: ["단톡방 홍보", "포스터 부착"],
    pay: "10만원",
    deadline: "2025-03-16",
    company: {
      name: "캠브릿",
      href: "#",
      imageUrl:
        "https://img.albamon.kr/trans/200x80/2016-03-30/1011dud814nvyb1h.gif.png",
    },
  },
];

export default function Home() {
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
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.href}
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition hover:shadow-md"
            >
              {/* 회사 로고 */}
              <div className="flex justify-center mb-3">
                <img
                  src={post.company.imageUrl}
                  alt={`${post.company.name} Logo`}
                  className="h-12 w-auto object-contain"
                />
              </div>

              {/* 제목 */}
              <h5 className="mb-2 text-base font-semibold tracking-tight text-gray-900">
                {post.title}
              </h5>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-3">
  {/* 활동 종류 태그 */}
  {post.tag.map((t) => (
    <span
      key={t}
      className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20"
    >
      {t}
    </span>
  ))}

  {/* 보상 금액 */}
  <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
    💰 {post.pay}
  </span>

  {/* 마감일 */}
  <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-400/30">
    📅 {post.deadline}
  </span>
</div>

            </a>
          ))}
        </div>

        {/* 페이지네이션 (기존 유지) */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-10">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">97</span> results
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon aria-hidden="true" className="size-5" />
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon aria-hidden="true" className="size-5" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
