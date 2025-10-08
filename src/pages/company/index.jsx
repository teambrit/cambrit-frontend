import { useState } from "react";
import defaultLogo from "../../assets/default-company-logo.png";
import defaultThumbnail from "../../assets/default-company-thumbnail.png";

export default function CompanyHome() {
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState({
    name: "캠브릿 주식회사",
    businessNumber: "123-45-67890",
    profileImage: "",
    thumbnailImage: "",
    url: "https://www.cambrit.co.kr",
    description:
      "AI 및 클라우드 기술을 활용한 대학-기업 연계형 인재 매칭 플랫폼을 운영하는 기업입니다.",
  });

  const [stats] = useState({
    jobCount: 5,
    applicantCount: 42,
  });

  const handleInputChange = (field, value) => {
    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCompany((prev) => ({
        ...prev,
        [field]: imageUrl,
      }));
    }
  };

  const handleSave = () => {
    // TODO: API 연동
    setIsEditing(false);
    alert("회사 정보가 수정되었습니다.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-blue-900 text-sm font-medium mb-2">등록된 공고 수</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.jobCount}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-green-900 text-sm font-medium mb-2">누적 지원자 수</h3>
          <p className="text-3xl font-bold text-green-600">{stats.applicantCount}</p>
        </div>
      </div>

      {/* 회사 정보 섹션 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">회사 정보</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              수정하기
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          )}
        </div>

         {/* 회사 썸네일 영역 */}
        <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden bg-gray-100 shadow-sm mb-10">
          <img
            src={company.thumbnailImage || defaultThumbnail}
            alt="회사 썸네일"
            className="h-full w-full object-cover"
          />
          {isEditing && (
            <div className="absolute bottom-3 right-3">
              <label className="bg-white/80 backdrop-blur px-3 py-1 rounded-md text-sm text-gray-700 cursor-pointer shadow hover:bg-white">
                썸네일 변경
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("thumbnailImage", e)}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex items-start gap-8">
          {/* 회사 프로필 이미지 */}
          <div className="flex flex-col items-center">
            <img
              src={company.profileImage || defaultLogo}
              alt="회사 프로필"
              className="w-28 h-28 rounded-full object-cover border"
            />
            {isEditing && (
              <label className="mt-3 bg-gray-100 px-3 py-1 rounded-md cursor-pointer text-sm text-gray-700 hover:bg-gray-200">
                로고 변경
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("profileImage", e)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* 회사 정보 폼 */}
          <div className="flex-1 space-y-5">
            {/* 회사명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">회사명</label>
              {isEditing ? (
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{company.name}</p>
              )}
            </div>

            {/* 사업자등록번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사업자등록번호</label>
              {isEditing ? (
                <input
                  type="text"
                  value={company.businessNumber}
                  onChange={(e) => handleInputChange("businessNumber", e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                  {company.businessNumber}
                </p>
              )}
            </div>

            {/* 회사 URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">회사 URL</label>
              {isEditing ? (
                <input
                  type="text"
                  value={company.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 p-3 bg-blue-50 rounded-md block hover:underline"
                >
                  {company.url}
                </a>
              )}
            </div>

            {/* 회사 소개 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">회사 소개</label>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={company.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                  {company.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
