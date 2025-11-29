import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

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
        console.log("지원 내역 데이터:", data);
        if (data.length > 0) {
          console.log("첫 번째 지원 내역 상세:", data[0]);
        }
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
                  onClick={() => navigate(`/activity/${app.postingId}`)}
                  className="card p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* 헤더: 제목 + 상태 */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-1">
                        {app.postingTitle}
                      </h3>
                      <p className="text-sm text-gray-600">{app.posterName}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === "APPROVED"
                          ? "bg-green-50 text-green-700"
                          : app.status === "REJECTED"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {app.status === "APPROVED"
                        ? "선발됨"
                        : app.status === "REJECTED"
                        ? "탈락"
                        : "지원 완료"}
                    </span>
                  </div>

                  {/* 태그 */}
                  {app.postingTags && app.postingTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {app.postingTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 지원일 */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <span>지원일:</span>
                    <span>{new Date(app.createdAt).toLocaleDateString("ko-KR")}</span>
                  </div>

                  {/* 파일 업로드 버튼 (선발된 경우에만 표시) */}
                  {app.status === "APPROVED" && (
                    <div
                      className="mt-4 pt-4 border-t border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="block">
                        <span className="text-sm font-semibold text-gray-900 mb-1 block">
                          📎 인증 파일 업로드
                        </span>
                        <p className="text-xs text-gray-500 mb-3">
                          활동 수행 후 인증 사진을 업로드하면 기업에서 확인 후 보상금을 입금합니다.
                        </p>
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
              <div className="card p-12 sm:p-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 mb-6">
                  <span className="text-5xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  아직 지원한 활동이 없어요
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  다양한 대외활동을 탐색하고 지원해보세요!
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  <span>활동 둘러보기</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
