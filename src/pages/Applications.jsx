import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import defaultCompanyLogo from "../assets/default-company-logo.png";
import { formatImageUrl } from "../utils/imageUtils";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!token) {
          alert("로그인이 필요합니다.");
          navigate("/signin");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/posting/applications/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("지원 내역을 불러오지 못했습니다.");

        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Error:", err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token, navigate]);

  // 파일 업로드 핸들러
  const handleFileUpload = async (applicationId, file) => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    try {
      setUploadingId(applicationId);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API_BASE_URL}/posting/applications/${applicationId}/verification-file`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error(await res.text());

      alert("인증 파일이 업로드되었습니다.");

      // 업로드 후 목록 새로고침
      const refreshRes = await fetch(`${API_BASE_URL}/posting/applications/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setApplications(data);
      }
    } catch (error) {
      console.error(error);
      alert("파일 업로드 중 오류가 발생했습니다.\n" + error.message);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 상단 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">내 지원 내역</h1>
          <p className="text-gray-600">
            내가 지원한 활동의 진행 상태를 확인할 수 있습니다.
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {errorMsg && !loading && (
          <div className="card p-4 bg-red-50 border-red-200">
            <p className="text-red-600 flex items-center gap-2">
              <span>⚠️</span>
              {errorMsg}
            </p>
          </div>
        )}

        {/* 지원 내역 리스트 */}
        {!loading && !errorMsg && (
          <div className="space-y-5">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="card p-6 hover:shadow-md transition-shadow"
                >
                  {/* 활동 제목 + 회사명 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={formatImageUrl(app.logoImage || app.posterLogoImage) || defaultCompanyLogo}
                        alt="기업 로고"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/activity/${app.postingId}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {app.postingTitle}
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5">{app.posterName}</p>
                    </div>
                  </div>

                  {/* 태그 */}
                  {app.postingTags && app.postingTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {app.postingTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-campus-50 text-xs font-medium text-campus-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 지원 상태 및 날짜 */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">지원 상태</span>
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-xs ${
                          app.status === "APPROVED"
                            ? "bg-green-50 text-green-700"
                            : app.status === "REJECTED"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {app.status === "APPROVED"
                          ? "✓ 선발됨"
                          : app.status === "REJECTED"
                          ? "✗ 탈락"
                          : "· 지원 완료"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">지원일</span>
                      <span className="font-medium text-gray-900">
                        {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>

                  {/* 파일 업로드 버튼 (선발된 경우에만 표시) */}
                  {app.status === "APPROVED" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block">
                        <span className="text-sm font-semibold text-gray-900 mb-2 block">
                          📎 인증 파일 업로드
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                handleFileUpload(app.id, file);
                              }
                            }}
                            disabled={uploadingId === app.id}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50 transition-colors"
                          />
                          {uploadingId === app.id && (
                            <span className="text-sm text-primary-600 font-medium">업로드 중...</span>
                          )}
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <span className="text-3xl">📭</span>
                </div>
                <p className="text-gray-500">아직 지원한 활동이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
