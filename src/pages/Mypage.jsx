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
  useEffect(() => {
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
          phone: meData.phone || "",
          university: meData.university || "",
          major: meData.major || "",
          bio: meData.bio || "",
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

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("file", uploadFile);

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
      console.log("저장 요청:", studentInfo);
      setOriginalInfo(studentInfo);
      setIsEditing(false);
      alert("프로필이 수정되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setStudentInfo(originalInfo);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* 학생 인증 상태 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">학생 인증 상태</h2>

        {studentInfo.verified ? (
          // 인증 완료
          <div>
            <p className="text-green-600 font-medium mb-4">인증 완료</p>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">대학교</label>
              <p className="p-3 bg-gray-50 rounded-md text-gray-900 border">
                {studentInfo.university || ""}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">전공</label>
              <p className="p-3 bg-gray-50 rounded-md text-gray-900 border">
                {studentInfo.major || ""}
              </p>
            </div>
          </div>
        ) : statusText === "PENDING" ? (
          // 승인 대기
          <div>
            <p className="text-blue-600 font-medium mb-4">승인 대기 중입니다.</p>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">대학교</label>
              <p className="p-3 bg-gray-50 rounded-md text-gray-900 border">
                {studentInfo.university || ""}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">전공</label>
              <p className="p-3 bg-gray-50 rounded-md text-gray-900 border">
                {studentInfo.major || ""}
              </p>
            </div>
          </div>
        ) : statusText === "REJECTED" ? (
          // 인증 거절
          <div>
            <p className="text-red-600 font-medium mb-4">인증이 거절되었습니다. 다시 제출해주세요.</p>
            {/* 대학교 */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">대학교</label>
              <input
                type="text"
                value={studentInfo.university}
                onChange={(e) => handleInputChange("university", e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 전공 */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">전공</label>
              <input
                type="text"
                value={studentInfo.major}
                onChange={(e) => handleInputChange("major", e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 파일 업로드 */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">인증 파일 업로드</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-700"
              />
              {uploadFile && (
                <p className="text-sm text-gray-500 mt-2">업로드된 파일: {uploadFile.name}</p>
              )}
            </div>

            {/* 인증 요청 버튼 */}
            <button
              onClick={handleSubmitAuthorization}
              disabled={submitting}
              className={`w-full mt-4 py-3 rounded-md text-white font-medium ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? "요청 중..." : "다시 인증 요청"}
            </button>
          </div>
        ) : (
          // 최초 미인증 상태
          <div>
            <p className="text-gray-700 mb-3">현재 인증되지 않았습니다.</p>
            {/* 대학교 */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">대학교</label>
              <input
                type="text"
                value={studentInfo.university}
                onChange={(e) => handleInputChange("university", e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 전공 */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">전공</label>
              <input
                type="text"
                value={studentInfo.major}
                onChange={(e) => handleInputChange("major", e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 파일 업로드 */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">인증 파일 업로드</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-700"
              />
              {uploadFile && (
                <p className="text-sm text-gray-500 mt-2">업로드된 파일: {uploadFile.name}</p>
              )}
            </div>

            {/* 인증 요청 버튼 */}
            <button
              onClick={handleSubmitAuthorization}
              disabled={submitting}
              className={`w-full mt-4 py-3 rounded-md text-white font-medium ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? "요청 중..." : "인증 요청"}
            </button>
          </div>
        )}
      </div>


        {/* 프로필 정보 섹션 (그대로 유지) */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">내 프로필</h2>

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
                  onClick={handleCancel}
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

          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={studentInfo.profileImage || defaultProfile}
              alt="프로필 이미지"
              className="w-28 h-28 rounded-full object-cover border"
            />
            {isEditing && (
              <label className="mt-3 bg-gray-100 px-3 py-1 rounded-md cursor-pointer text-sm text-gray-700 hover:bg-gray-200">
                이미지 변경
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* 나머지 정보 */}
          <div className="space-y-6">
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                {studentInfo.email}
              </p>
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                  {studentInfo.name}
                </p>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={studentInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                  {studentInfo.phone}
                </p>
              )}
            </div>

            {/* 자기소개 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자기소개
              </label>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={studentInfo.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                  {studentInfo.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
