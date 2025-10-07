import { useState } from "react";
import defaultProfile from "../assets/default-user.png"; // 기본 프로필 이미지

export default function MyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    email: "student@university.ac.kr",
    name: "김학생",
    phone: "010-1234-5678",
    university: "서울대학교",
    major: "컴퓨터공학과",
    bio: "프론트엔드 개발에 관심이 많은 학생입니다.",
    verified: false, // 인증 여부
    profileImage: "", // 프로필 이미지
  });
  const [uploadFile, setUploadFile] = useState(null);

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
      setIsEditing(false);
      alert("프로필이 수정되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* 학생 인증 상태 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900text-gray-900 mb-4 ">학생 인증 상태</h2>

          {studentInfo.verified ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              인증 완료
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-3">현재 인증되지 않았습니다.</p>
              <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                파일 업로드
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {uploadFile && (
                <p className="text-sm text-gray-500 mt-2">
                  업로드된 파일: {uploadFile.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 프로필 정보 섹션 */}
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

            {/* 대학교 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대학교
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentInfo.university}
                  disabled={studentInfo.verified}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                  className={`w-full p-3 border rounded-md focus:outline-none ${
                    studentInfo.verified
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                  {studentInfo.university}
                </p>
              )}
            </div>

            {/* 전공 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전공
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentInfo.major}
                  disabled={studentInfo.verified}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  className={`w-full p-3 border rounded-md focus:outline-none ${
                    studentInfo.verified
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                  {studentInfo.major}
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
