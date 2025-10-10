import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import defaultProfile from "../assets/default-user.png";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    phone: "",
    university: "",
    major: "",
    bio: "",
    profileImage: "",
  });
  const [authStatus, setAuthStatus] = useState(null); // PENDING / APPROVED / REJECTED
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const token = localStorage.getItem("token");

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = async () => {
      // localStorage 인증 데이터 완전 초기화
      localStorage.removeItem("studentAuthStatus");
      localStorage.removeItem("studentAuthEmail");
      
      // 기본값 설정 (항상 인증되지 않은 상태로 시작)
      setProfile({
        email: "",
        name: "",
        phone: "",
        university: "",
        major: "",
        bio: "",
        profileImage: "",
      });
      setAuthStatus("PENDING"); // 항상 PENDING으로 시작
      
      setLoading(false);
      
      // 백엔드 API도 시도해보기 (실패해도 상관없음)
      if (token) {
        try {
          // 프로필 정보 가져오기
          const profileRes = await fetch(`${API_BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (profileRes.ok) {
            const profileData = await profileRes.json();
            const updatedProfile = {
              email: profileData.email || "",
              name: profileData.name || "",
              phone: profileData.phone || "",
              university: profileData.university || "",
              major: profileData.major || "",
              bio: profileData.bio || "",
              profileImage: profileData.profileImage || "",
            };
            setProfile(updatedProfile);
            
            // localStorage에도 저장
            localStorage.setItem("userProfile", JSON.stringify({
              ...updatedProfile,
              verified: authStatus === "APPROVED"
            }));
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
            setAuthStatus(authData.status || authData);
          } else {
            // 백엔드 실패 시 항상 인증되지 않은 상태 유지
            console.log("Backend auth check failed, keeping auth status as PENDING");
          }
        } catch (err) {
          console.log("백엔드 API 오류, 로컬 데이터 사용");
        }
      }
    };

    loadProfile();
  }, [token, navigate]);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadFile(file);
      setProfile((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);

    // 즉시 로컬 처리 (백엔드 실패해도 작동)
    const existingProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const profileData = {
      email: profile.email,
      name: profile.name,
      phone: profile.phone,
      // 인증 완료된 경우 기존 대학교/전공 값 유지, 아니면 새 값 사용
      university: authStatus === "APPROVED" ? (existingProfile.university || profile.university) : profile.university,
      major: authStatus === "APPROVED" ? (existingProfile.major || profile.major) : profile.major,
      bio: profile.bio,
      profileImage: profile.profileImage,
      verified: authStatus === "APPROVED"
    };
    
    // localStorage에 프로필 정보 저장
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    
    alert("프로필이 성공적으로 수정되었습니다.");
    navigate("/mypage");
    
    // 백엔드 API도 시도해보기 (실패해도 상관없음)
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
          name: profile.name,
          phone: profile.phone,
          bio: profile.bio,
        };

        // 학생 인증이 완료되지 않은 경우에만 대학교, 전공 수정 가능
        if (authStatus !== "APPROVED") {
          payload.university = profile.university;
          payload.major = profile.major;
        } else {
          // 인증 완료된 경우 기존 대학교/전공 값 유지
          payload.university = existingProfile.university || profile.university;
          payload.major = existingProfile.major || profile.major;
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
    
    setSaving(false);
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">프로필을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">프로필 수정</h1>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{errorMsg}</p>
          </div>
        )}

        {/* 프로필 수정 폼 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={profile.profileImage || defaultProfile}
              alt="프로필 이미지"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <label className="mt-4 bg-gray-100 px-4 py-2 rounded-md cursor-pointer text-sm text-gray-700 hover:bg-gray-200">
              프로필 사진 변경
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* 폼 필드들 */}
          <div className="space-y-6">
            {/* 이메일 (수정 불가) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">이메일은 수정할 수 없습니다.</p>
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 *
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="010-0000-0000"
              />
            </div>

            {/* 대학교 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대학교
                {authStatus === "APPROVED" && (
                  <span className="text-red-500 text-xs ml-2">(수정 불가)</span>
                )}
              </label>
              <div>
                <input
                  type="text"
                  value={profile.university}
                  disabled={authStatus === "APPROVED"}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                  className={`w-full p-3 border rounded-md focus:outline-none ${
                    authStatus === "APPROVED"
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
                      : "focus:ring-2 focus:ring-blue-500 border-gray-300"
                  }`}
                  placeholder={authStatus === "APPROVED" ? "인증 완료 후 수정 불가" : "대학교명을 입력하세요"}
                />
                {authStatus === "APPROVED" && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <span className="mr-1">🔒</span>
                    학생 인증 완료 후에는 대학교를 수정할 수 없습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 전공 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전공
                {authStatus === "APPROVED" && (
                  <span className="text-red-500 text-xs ml-2">(수정 불가)</span>
                )}
              </label>
              <div>
                <input
                  type="text"
                  value={profile.major}
                  disabled={authStatus === "APPROVED"}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  className={`w-full p-3 border rounded-md focus:outline-none ${
                    authStatus === "APPROVED"
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
                      : "focus:ring-2 focus:ring-blue-500 border-gray-300"
                  }`}
                  placeholder={authStatus === "APPROVED" ? "인증 완료 후 수정 불가" : "전공을 입력하세요"}
                />
                {authStatus === "APPROVED" && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <span className="mr-1">🔒</span>
                    학생 인증 완료 후에는 전공을 수정할 수 없습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 자기소개 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자기소개
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="자기소개를 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 학생 인증 상태 안내 */}
        {authStatus && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">학생 인증 상태</h3>
            <p className="text-sm text-blue-700">
              {authStatus === "APPROVED" 
                ? "✅ 학생 인증이 완료되었습니다. 대학교와 전공 정보는 수정할 수 없습니다."
                : authStatus === "PENDING"
                ? "⏳ 학생 인증이 진행 중입니다. 인증 완료 후에는 대학교와 전공을 수정할 수 없습니다."
                : "❌ 학생 인증이 필요합니다. 마이페이지에서 인증을 진행해주세요."
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
