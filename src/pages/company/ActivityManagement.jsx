import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function CompanyActivityManagement() {
  const { id } = useParams(); // URL에서 공고 ID 가져오기
  const [activity, setActivity] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 공고 상세 조회
        const activityRes = await fetch(`${API_BASE_URL}/posting/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!activityRes.ok) throw new Error("공고 정보를 불러올 수 없습니다.");
        const activityData = await activityRes.json();
        setActivity(activityData);

        // 지원자 목록 조회
        const applicantRes = await fetch(
          `${API_BASE_URL}/posting/${id}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!applicantRes.ok) throw new Error("지원자 목록을 불러올 수 없습.");
        const applicantData = await applicantRes.json();
        setApplicants(applicantData);
      } catch (err) {
        console.error(err);
        alert("정보를 불러오는 중 오류가 발생했.");
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchData();
  }, [id, token]);

  // 체크박스 토글
  const toggleSelect = (applicantId) => {
    setSelectedIds((prev) =>
      prev.includes(applicantId) ? prev.filter((i) => i !== applicantId) : [...prev, applicantId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applicants.map((a) => a.id));
    }
  };

  // 지원자 상태 변경 함수 (승인/거절) - 응답 콘솔 출력 추가
  const updateApplicantStatus = async (applicationId, approve) => {
    const status = approve ? "APPROVED" : "REJECTED";
    const res = await fetch(
      `${API_BASE_URL}/posting/applications/${applicationId}/status?status=${status}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const text = await res.text();
    console.log(`지원자 ${applicationId} 응답:`, text);
    if (!res.ok) throw new Error(text);
  };

  // 선택한 지원자 선발 확정 (approve=true)
  const handleConfirmSelection = async () => {
    if (selectedIds.length === 0) return alert("선택된 지원자가 없습니다.");
    if (!window.confirm(`${selectedIds.length}명의 지원자를 선발하시겠습니까?`)) return;

    try {
      await Promise.all(
        selectedIds.map((applicationId) => updateApplicantStatus(applicationId, true))
      );
      setApplicants((prev) =>
        prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "APPROVED" } : a))
      );
      setSelectedIds([]);
      alert("선발 처리가 완료되었습니다.");
    } catch (err) {
      console.error(err);
      alert("선발 처리 중 오류가 발생했습니다. " + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );

  if (!activity)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-gray-500">활동 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Link
                to="/company/activity"
                className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-flex items-center"
              >
                ← 목록으로
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
            </div>
          </div>
        </div>

        {/* 활동 상세 정보 */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">활동 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">보상 금액</p>
              <p className="text-lg font-semibold text-gray-900">
                {activity.compensation ? `${activity.compensation.toLocaleString()}원` : "협의"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">지원 마감일</p>
              <p className="text-lg font-semibold text-gray-900">
                {activity.applyDueDate || "상시모집"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">활동 시작일</p>
              <p className="text-lg font-semibold text-gray-900">
                {activity.activityStartDate || "-"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">활동 종료일</p>
              <p className="text-lg font-semibold text-gray-900">
                {activity.activityEndDate || "-"}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">활동 내용</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
              {activity.body}
            </p>
          </div>

          {activity.tags && activity.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">태그</p>
              <div className="flex flex-wrap gap-1.5">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-campus-50 text-xs font-medium text-campus-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 지원자 목록 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">지원자 목록</h2>
              <p className="text-sm text-gray-600 mt-1">총 {applicants.length}명</p>
            </div>
            {selectedIds.length > 0 && (
              <button
                onClick={handleConfirmSelection}
                className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
              >
                선발 확정 ({selectedIds.length}명)
              </button>
            )}
          </div>

          {applicants.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <p className="text-gray-500">아직 지원자가 없습니다</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === applicants.length && applicants.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">이름</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">이메일</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">학교</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">전공</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">인증파일</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">지원일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicants.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(a.id)}
                          onChange={() => toggleSelect(a.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{a.applicantName}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{a.applicantEmail}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{a.applicantUniversity || "-"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{a.applicantMajor || "-"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            a.status === "APPROVED"
                              ? "bg-green-50 text-green-700"
                              : a.status === "REJECTED"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {a.status === "APPROVED" ? "✓ 선발" : a.status === "REJECTED" ? "✗ 탈락" : "⏳ 검토중"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {a.verificationFile ? (
                          <a
                            href={
                              a.verificationFile.startsWith("data:") || a.verificationFile.startsWith("http")
                                ? a.verificationFile
                                : `data:image/jpeg;base64,${a.verificationFile}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 rounded hover:bg-slate-100 border border-slate-200 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            다운로드
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {a.status === "APPROVED" ? "대기중" : "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(a.createdAt).toLocaleDateString("ko-KR")}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
