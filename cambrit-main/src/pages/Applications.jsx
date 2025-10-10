import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import defaultCompanyLogo from "../assets/default-company-logo.png";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* 상단 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">내 지원 내역</h2>
          <p className="text-gray-600 text-sm">
            내가 지원한 공고의 진행 상태를 확인할 수 있습니다.
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">불러오는 중...</p>
          </div>
        )}

        {/* 에러 메시지 */}
        {errorMsg && !loading && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-center">
            {errorMsg}
          </div>
        )}

        {/* 지원 내역 리스트 */}
        {!loading && !errorMsg && (
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition"
                >
                  {/* 공고 제목 + 회사명 */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={defaultCompanyLogo}
                      alt="기업 로고"
                      className="w-12 h-12 rounded-md object-contain border"
                    />
                    <div>
                      <Link
                        to={`/activity/${app.postingId}`}
                        className="text-lg font-semibold text-gray-900 hover:underline"
                      >
                        {app.postingTitle}
                      </Link>
                      <p className="text-sm text-gray-600">{app.posterName}</p>
                    </div>
                  </div>

                  {/* 태그 */}
                  {app.postingTags && app.postingTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {app.postingTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 지원 상태 및 날짜 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium text-gray-900">
                        지원 상태:
                      </span>{" "}
                      <span
                        className={`font-semibold ${
                          app.status === "APPROVED"
                            ? "text-green-600"
                            : app.status === "REJECTED"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {app.status === "APPROVED"
                          ? "선발됨"
                          : app.status === "REJECTED"
                          ? "탈락"
                          : "지원 완료"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        지원일:
                      </span>{" "}
                      {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500">
                아직 지원한 공고가 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
