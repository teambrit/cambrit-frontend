export default function CompanyActivity() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">구직공고 관리</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          새 공고 등록
        </button>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  프론트엔드 개발자 모집
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  React, TypeScript 경험자 우대
                </p>
                <span className="text-sm text-gray-500">지원자 12명</span>
              </div>
              <button className="text-blue-600 text-sm hover:text-blue-800">
                상세보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
