import { useState, useEffect } from "react";
import defaultProfile from "../assets/default-user.png";
import { API_BASE_URL } from "../config";

export default function MyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    email: "",
    name: "",
    phone: "",
    university: "",
    major: "",
    bio: "",
    verified: false,
    profileImage: "",
  });
  const [originalInfo, setOriginalInfo] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("NONE");

  const token = localStorage.getItem("token");

  // 내 정보 & 인증 상태 가져오기
  const fetchData = async () => {
    try {
      const meRes = await fetch(`${API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) throw new Error("내 정보 불러오기 실패");
      const meData = await meRes.json();

      const statusRes = await fetch(
        `${API_BASE_URL}/user/student-authorization-request/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const status = statusRes.ok ? await statusRes.text() : "NONE";
      setStatusText(status.replace(/['"\n\r]/g, "").trim().toUpperCase());

      const verified =
        meData.isAuthorized === true || status === "APPROVED";

      const info = {
        email: meData.email || "",
        name: meData.name || "",
        phone: meData.phoneNumber || meData.phone || "",
        university: meData.university || "",
        major: meData.major || "",
        bio: meData.description || meData.bio || "",
        verified,
        profileImage: meData.logoImage || "",
      };

      setStudentInfo(info);
      setOriginalInfo(info);
    } catch (error) {
      console.error(error);
      alert("정보 불러오기 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleInputChange = (field, value) => {
    setStudentInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      alert(`"${file.name}" 파일이 업로드되었습니다.`);
    }
  };

  // 인증 요청
  const handleSubmitAuthorization = async () => {
    if (!uploadFile) {
      alert("인증 파일을 선택해주세요.");
      return;
    }

    if (!studentInfo.university || !studentInfo.major) {
      alert("대학교와 전공을 모두 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("university", studentInfo.university);
      formData.append("major", studentInfo.major);

      const res = await fetch(`${API_BASE_URL}/user/student-authorization-request`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      alert("학생 인증 요청이 제출되었습니다. 승인 대기 중입니다.");
      setStatusText("PENDING");
      setUploadFile(null);
    } catch (error) {
      console.error(error);
      alert("인증 요청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setStudentInfo((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", studentInfo.name);
      formData.append("phoneNumber", studentInfo.phone);
      formData.append("description", studentInfo.bio);

      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      // 저장 후 최신 정보 다시 불러오기
      await fetchData();
      setIsEditing(false);
      alert("프로필이 수정되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.\n" + error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setStudentInfo(originalInfo);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 학생 인증 상태 섹션 */}
        <div className="card p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">학생 인증 상태</h2>

        {studentInfo.verified ? (
          // 인증 완료
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-semibold mb-6">
              <span>✓</span>
              <span>인증 완료</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">대학교</label>
                <p className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">
                  {studentInfo.university || ""}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">전공</label>
                <p className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">
                  {studentInfo.major || ""}
                </p>
              </div>
            </div>
          </div>
        ) : statusText === "PENDING" ? (
          // 승인 대기
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold mb-6">
              <span>⏳</span>
              <span>승인 대기 중</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">대학교</label>
                <p className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">
                  {studentInfo.university || ""}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">전공</label>
                <p className="p-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">
                  {studentInfo.major || ""}
                </p>
              </div>
            </div>
          </div>
        ) : statusText === "REJECTED" ? (
          // 인증 거절
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 font-semibold mb-2">
              <span>✗</span>
              <span>인증 거절</span>
            </div>
            <p className="text-gray-600 mb-6 text-sm">인증이 거절되었습니다. 다시 제출해주세요.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">대학교</label>
                <input
                  type="text"
                  value={studentInfo.university}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">전공</label>
                <input
                  type="text"
                  value={studentInfo.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">인증 파일 업로드</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-500 mt-2">✓ {uploadFile.name}</p>
                )}
              </div>

              <button
                onClick={handleSubmitAuthorization}
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "요청 중..." : "다시 인증 요청"}
              </button>
            </div>
          </div>
        ) : (
          // 최초 미인증 상태
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold mb-6">
              <span>·</span>
              <span>미인증</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">대학교</label>
                <input
                  type="text"
                  value={studentInfo.university}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                  placeholder="예: 서울대학교"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">전공</label>
                <input
                  type="text"
                  value={studentInfo.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  placeholder="예: 컴퓨터공학과"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">인증 파일 업로드</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-500 mt-2">✓ {uploadFile.name}</p>
                )}
              </div>

              <button
                onClick={handleSubmitAuthorization}
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "요청 중..." : "인증 요청"}
              </button>
            </div>
          </div>
        )}
      </div>


        {/* 프로필 정보 섹션 */}
        <div className="card p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">내 프로필</h2>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                수정하기
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                >
                  저장
                </button>
              </div>
            )}
          </div>

          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <img
                src={studentInfo.profileImage || defaultProfile}
                alt="프로필 이미지"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* 나머지 정보 */}
          <div className="space-y-6">
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                이메일
              </label>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {studentInfo.email}
              </p>
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                이름
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {studentInfo.name}
                </p>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                전화번호
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={studentInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {studentInfo.phone || "미입력"}
                </p>
              )}
            </div>

            {/* 자기소개 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                자기소개
              </label>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={studentInfo.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="자신을 소개해주세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px] whitespace-pre-wrap">
                  {studentInfo.bio || "자기소개가 없습니다"}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
