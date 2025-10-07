export default function Activity() {
  return (
    <div className="min-h-screen bg-white pb-20"> {/* 버튼 높이만큼 padding-bottom 추가 */}
      {/* 상단 기업 썸네일 */}
      <div className="relative h-48 sm:h-64 bg-gray-200">
        <img
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80"
          alt="기업 썸네일"
          className="h-full w-full object-cover"
        />

        {/* 기업 로고 + 이름 */}
        <div className="absolute bottom-4 left-0 w-full">
          <div className="container mx-auto px-4">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
                alt="기업 로고"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Cambridge Co.</h2>
                <p className="text-sm text-gray-600">공식 캠브릿 홍보 담당 기업</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 활동 정보 */}
      <div className="container mx-auto py-8 px-4">
        {/* 제목 */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          캠브릿 대학생 홍보 캠페인
        </h1>

        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {/* 활동 종류 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">활동 종류</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex flex-wrap gap-2">
                  {["단톡방 홍보", "포스터 부착"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </dd>
            </div>

            {/* 상세 내용 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">상세 내용</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                각 학교 단톡방에 캠브릿 홍보글을 게시하고, 지정된 장소에 포스터를 부착합니다.
                활동 완료 후 인증 스크린샷을 제출해야 보상이 지급됩니다.
              </dd>
            </div>

            {/* 보상 금액 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">보상 금액</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                10,000원
              </dd>
            </div>

            {/* 활동 기간 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">활동 기간</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                2025.10.08 ~ 2025.10.20
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 하단 고정 지원 버튼 */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
        <div className="container mx-auto flex justify-end">
          <button
            onClick={() => alert("지원이 완료되었습니다!")}
            className="w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            지원하기
          </button>
        </div> 
      </nav>
    </div>
  );
}
