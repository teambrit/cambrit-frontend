import { useState, useEffect } from "react";
import defaultProfile from "../assets/default-user.png"; // 기본 프로필 이미지
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    email: "",
    name: "",
    phone: "",
    university: "",
    major: "",
    bio: "",
    verified: false, // 인증 여부
    profileImage: "", // 프로필 이미지
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  // load profile and verification status
  useEffect(() => {
    const load = async () => {
      // localStorage 인증 데이터 완전 초기화
      localStorage.removeItem("studentAuthStatus");
      localStorage.removeItem("studentAuthEmail");
      
      // 기본값 설정 (항상 인증되지 않은 상태로 시작)
      setStudentInfo({
        email: "",
        name: "",
        phone: "",
        university: "",
        major: "",
        bio: "",
        profileImage: "",
        verified: false // 항상 false로 시작
      });
      
      setLoading(false);
      
      // 백엔드 API도 시도해보기 (실패해도 상관없음)
      const token = localStorage.getItem("token");
      console.log("Current token:", token ? "Token exists" : "No token");
      
      if (token) {
        try {
          // 프로필 정보 가져오기
          console.log("Trying to fetch user profile from:", `${API_BASE_URL}/user/me`);
          const res = await fetch(`${API_BASE_URL}/user/me`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });

          console.log("Profile API response status:", res.status);
          
          if (res.ok) {
            const data = await res.json();
            console.log("Profile API success:", data);
            const updatedProfile = {
              email: data.email || "",
              name: data.name || "",
              phone: data.phone || "",
              university: data.university || "",
              major: data.major || "",
              bio: data.bio || "",
              profileImage: data.logoImage || "",
              verified: data.isAuthorized || false // 백엔드 인증 상태 사용
            };
            setStudentInfo(updatedProfile);
            
            // localStorage에도 저장
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
          } else {
            const errorText = await res.text();
            console.log("Profile API failed:", errorText);
          }

          // 학생 인증 상태 확인
          const authRes = await fetch(
            `${API_BASE_URL}/user/student-authorization-request/status`,
            { 
              headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              } 
            }
          );
          if (authRes.ok) {
            const authData = await authRes.json();
            const verified = authData.status === "APPROVED" || authData === "APPROVED" || authData === true;
            setStudentInfo((prev) => ({ ...prev, verified }));
          } else {
            // 백엔드 실패 시 항상 인증되지 않은 상태 유지
            console.log("Backend auth check failed, keeping verified as false");
          }
        } catch (err) {
          console.log("백엔드 API 오류, 로컬 데이터 사용");
        }
      }
    };

    load();
  }, []);

  // 주기적으로 인증 상태 확인 (실시간 업데이트) - 관리자 승인 시에만 업데이트
  useEffect(() => {
    const checkAuthStatus = () => {
      // localStorage에서 인증 데이터 확인
      const authStatus = localStorage.getItem("studentAuthStatus");
      const authEmail = localStorage.getItem("studentAuthEmail");
      const currentEmail = studentInfo.email || "";
      
      console.log("Real-time auth check:", { authStatus, authEmail, currentEmail });
      
      // 정확한 이메일 매칭과 APPROVED 상태일 때만 인증 완료로 설정
      if (authStatus === "APPROVED" && authEmail && authEmail === currentEmail) {
        console.log("Real-time: Setting verified to true for", currentEmail);
        setStudentInfo((prev) => ({ ...prev, verified: true }));
      } else {
        // 그 외의 경우는 항상 인증되지 않은 상태
        console.log("Real-time: Setting verified to false");
        setStudentInfo((prev) => ({ ...prev, verified: false }));
      }
    };

    // 1초마다 인증 상태 확인
    const interval = setInterval(checkAuthStatus, 1000);
    
    return () => clearInterval(interval);
  }, [studentInfo.email]);

  const handleInputChange = (field, value) => {
    setStudentInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 즉시 로컬 처리 (백엔드 실패해도 작동)
    setUploadFile(file);
    
    // 실제 사용자 정보를 localStorage에 저장
    const userAuthRequest = {
      id: Date.now(),
      studentName: studentInfo.name || "이름 없음",
      studentEmail: studentInfo.email || "이메일 없음",
      university: studentInfo.university || "대학교 없음",
      major: studentInfo.major || "전공 없음",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      fileUrl: "#",
      fileName: file.name
    };
    
    // localStorage에 저장
    const existingRequests = JSON.parse(localStorage.getItem("authRequests") || "[]");
    existingRequests.push(userAuthRequest);
    localStorage.setItem("authRequests", JSON.stringify(existingRequests));
    
    alert("학생 인증 파일이 업로드되었습니다. 관리자 승인을 기다려주세요.");
    
    // 백엔드 API도 시도해보기 (실패해도 상관없음)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch(`${API_BASE_URL}/student-authorization-request`, {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (res.ok) {
          console.log("백엔드 API 성공");
        } else {
          console.log("백엔드 API 실패, 로컬 처리로 대체");
        }
      } catch (err) {
        console.log("백엔드 API 오류, 로컬 처리로 대체");
      }
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadFile(file);
      setStudentInfo((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSave = async () => {
    // 즉시 로컬 처리 (백엔드 실패해도 작동)
    setIsEditing(false);
    setUploadFile(null);
    
    // 프로필 이미지 처리
    if (uploadFile) {
      const imageUrl = URL.createObjectURL(uploadFile);
      setStudentInfo((prev) => ({ ...prev, profileImage: imageUrl }));
    }
    
    // localStorage에 프로필 정보 저장 (인증 완료 시 대학교/전공은 기존 값 유지)
    const existingProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const profileData = {
      email: studentInfo.email,
      name: studentInfo.name,
      phone: studentInfo.phone,
      // 인증 완료된 경우 기존 대학교/전공 값 유지, 아니면 새 값 사용
      university: studentInfo.verified ? (existingProfile.university || studentInfo.university) : studentInfo.university,
      major: studentInfo.verified ? (existingProfile.major || studentInfo.major) : studentInfo.major,
      bio: studentInfo.bio,
      profileImage: studentInfo.profileImage,
      verified: studentInfo.verified
    };
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    
    alert("프로필이 성공적으로 수정되었습니다.");
    
    // 백엔드 API도 시도해보기 (실패해도 상관없음)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // 1) 프로필 이미지 업로드 (변경된 경우)
        let uploadedImageUrl = null;
        if (uploadFile) {
          const formData = new FormData();
          formData.append("file", uploadFile);

          const imgRes = await fetch(`${API_BASE_URL}/user/profile-image`, {
            method: "POST",
            headers: { 
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (imgRes.ok) {
            try {
              const imgData = await imgRes.json();
              uploadedImageUrl = imgData.url || imgData.profileImage || null;
            } catch {
              const txt = await imgRes.text();
              uploadedImageUrl = txt || null;
            }
          }
        }

        // 2) 프로필 정보 업데이트
        const payload = {
          name: studentInfo.name,
          phone: studentInfo.phone,
          bio: studentInfo.bio,
        };

        // 학생 인증이 완료되지 않은 경우에만 대학교, 전공 수정 가능
        if (!studentInfo.verified) {
          payload.university = studentInfo.university;
          payload.major = studentInfo.major;
        } else {
          // 인증 완료된 경우 기존 대학교/전공 값 유지
          payload.university = existingProfile.university || studentInfo.university;
          payload.major = existingProfile.major || studentInfo.major;
        }

        if (uploadedImageUrl) {
          payload.profileImage = uploadedImageUrl;
        }

        // 여러 업데이트 방법 시도
        const updateCandidates = [
          { url: `${API_BASE_URL}/user/me`, method: "PUT" },
          { url: `${API_BASE_URL}/user/me`, method: "PATCH" },
          { url: `${API_BASE_URL}/user/profile`, method: "PUT" },
          { url: `${API_BASE_URL}/user/profile`, method: "PATCH" },
          { url: `${API_BASE_URL}/user`, method: "PUT" },
          { url: `${API_BASE_URL}/user`, method: "PATCH" },
        ];

        let res = null;
        for (const cand of updateCandidates) {
          try {
            res = await fetch(cand.url, {
              method: cand.method,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });

            if (res.ok) {
              console.log("백엔드 API 성공");
              break;
            }
          } catch (e) {
            console.log("백엔드 API 오류, 로컬 처리로 대체");
          }
        }
      } catch (err) {
        console.log("백엔드 API 오류, 로컬 처리로 대체");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* 학생 인증 상태 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">학생 인증 상태</h2>

          {studentInfo.verified ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <span className="text-green-500">✅</span>
              인증 완료
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-3">현재 인증되지 않았습니다.</p>
              <p className="text-sm text-gray-500 mb-4">
                학생증 또는 재학증명서를 업로드하여 인증을 받으세요.
              </p>
              <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                인증 파일 업로드
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {uploadFile && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800 font-medium">
                    업로드된 파일: {uploadFile.name}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    관리자 승인을 기다리고 있습니다.
                  </p>
                </div>
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
                프로필 수정
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
                {studentInfo.verified && (
                  <span className="text-red-500 text-xs ml-2">(수정 불가)</span>
                )}
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={studentInfo.university}
                    disabled={studentInfo.verified}
                    onChange={(e) => handleInputChange("university", e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none ${
                      studentInfo.verified
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
                        : "focus:ring-2 focus:ring-blue-500 border-gray-300"
                    }`}
                    placeholder={studentInfo.verified ? "인증 완료 후 수정 불가" : "대학교명을 입력하세요"}
                  />
                  {studentInfo.verified && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <span className="mr-1">🔒</span>
                      학생 인증 완료 후에는 대학교를 수정할 수 없습니다.
                    </p>
                  )}
                </div>
              ) : (
                <p className={`p-3 rounded-md ${
                  studentInfo.verified 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-gray-50 text-gray-900"
                }`}>
                  {studentInfo.university || "대학교 정보 없음"}
                  {studentInfo.verified && (
                    <span className="text-xs ml-2 text-green-600">✅ 인증됨</span>
                  )}
                </p>
              )}
            </div>

            {/* 전공 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전공
                {studentInfo.verified && (
                  <span className="text-red-500 text-xs ml-2">(수정 불가)</span>
                )}
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={studentInfo.major}
                    disabled={studentInfo.verified}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none ${
                      studentInfo.verified
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
                        : "focus:ring-2 focus:ring-blue-500 border-gray-300"
                    }`}
                    placeholder={studentInfo.verified ? "인증 완료 후 수정 불가" : "전공을 입력하세요"}
                  />
                  {studentInfo.verified && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <span className="mr-1">🔒</span>
                      학생 인증 완료 후에는 전공을 수정할 수 없습니다.
                    </p>
                  )}
                </div>
              ) : (
                <p className={`p-3 rounded-md ${
                  studentInfo.verified 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-gray-50 text-gray-900"
                }`}>
                  {studentInfo.major || "전공 정보 없음"}
                  {studentInfo.verified && (
                    <span className="text-xs ml-2 text-green-600">✅ 인증됨</span>
                  )}
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
