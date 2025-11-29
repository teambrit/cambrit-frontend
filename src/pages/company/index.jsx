import { useState, useEffect } from "react";
import defaultLogo from "../../assets/default-company-logo.png";
import defaultThumbnail from "../../assets/default-company-thumbnail.png";
import { API_BASE_URL } from "../../config";

export default function CompanyHome() {
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState({
    name: "",
    businessNumber: "",
    profileImage: "",
    thumbnailImage: "",
    url: "",
    description: "",
  });
  const [originalCompany, setOriginalCompany] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);

  const [stats] = useState({
    jobCount: 5,
    applicantCount: 42,
  });

  const token = localStorage.getItem("token");

  // BLOB 데이터를 data URI로 변환하는 함수
  const formatImageUrl = (imageData) => {
    if (!imageData) return "";
    // 이미 data URI 형식이거나 URL인 경우 그대로 반환
    if (imageData.startsWith("data:") || imageData.startsWith("http")) {
      return imageData;
    }
    // Base64 문자열인 경우 data URI로 변환
    // SVG 여부 확인 (base64 디코딩 후 <svg 태그 확인)
    try {
      const decoded = atob(imageData.substring(0, Math.min(100, imageData.length)));
      if (decoded.trim().startsWith("<svg") || decoded.includes("<svg")) {
        return `data:image/svg+xml;base64,${imageData}`;
      }
    } catch (e) {
      // base64 디코딩 실패 시 무시
    }
    // 기본적으로 JPEG로 처리
    return `data:image/jpeg;base64,${imageData}`;
  };

  // 기업 정보 불러오기
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("기업 정보를 불러올 수 없습니다.");
        const data = await res.json();

        const companyInfo = {
          name: data.name || "",
          businessNumber: data.companyCode || "",
          profileImage: formatImageUrl(data.logoImage),
          thumbnailImage: formatImageUrl(data.backgroundImage),
          url: data.companyUrl || "",
          description: data.description || "",
        };

        setCompany(companyInfo);
        setOriginalCompany(companyInfo);
      } catch (error) {
        console.error(error);
        alert("기업 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    if (token) fetchCompanyInfo();
  }, [token]);

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

      // 파일 객체 저장
      if (field === "profileImage") {
        setLogoFile(file);
      } else if (field === "thumbnailImage") {
        setBackgroundFile(file);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", company.name);
      formData.append("companyCode", company.businessNumber);
      formData.append("companyUrl", company.url);
      formData.append("description", company.description);

      // 이미지 파일이 선택되었으면 추가
      if (logoFile) {
        formData.append("logoImage", logoFile);
      }
      if (backgroundFile) {
        formData.append("backgroundImage", backgroundFile);
      }

      const res = await fetch(`${API_BASE_URL}/user/company/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      alert("회사 정보가 수정되었습니다.");
      setOriginalCompany(company);
      setLogoFile(null);
      setBackgroundFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("회사 정보 수정 중 오류가 발생했습니다.\n" + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCompany(originalCompany);
    setLogoFile(null);
    setBackgroundFile(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-slate-600 text-sm font-medium mb-2">등록된 활동 수</h3>
            <p className="text-4xl font-bold text-slate-900">{stats.jobCount}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-slate-600 text-sm font-medium mb-2">누적 지원자 수</h3>
            <p className="text-4xl font-bold text-slate-900">{stats.applicantCount}</p>
          </div>
        </div>

        {/* 회사 정보 섹션 */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">회사 정보</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
              >
                수정하기
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-slate-700 hover:bg-slate-800 shadow-sm"
                  }`}
                  disabled={submitting}
                >
                  {submitting ? "저장 중..." : "저장"}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{company.name}</p>
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              ) : (
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 p-3 bg-slate-50 rounded-lg block hover:underline"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {company.description}
                </p>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
