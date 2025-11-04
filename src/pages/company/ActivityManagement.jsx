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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center">
        불러오는 중...
      </div>
    );

  if (!activity)
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-500">
        공고 정보를 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 상단 헤더: 제목 + 뒤로가기 */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          공고 관리: {activity.title}
        </h2>
        <Link
          to="/company/activity"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          목록으로 돌아가기
        </Link>
      </div>

      {/* 공고 상세정보 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          공고 상세 정보
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>제목:</strong> {activity.title}
          </div>
          <div>
            <strong>상태:</strong> {activity.status}
          </div>
          <div>
            <strong>작성자:</strong> {activity.posterName} (
            {activity.posterEmail})
          </div>
          <div>
            <strong>보상금:</strong> {activity.compensation}원
          </div>
          <div>
            <strong>지원 마감일:</strong> {activity.applyDueDate}
          </div>
          <div>
            <strong>활동 기간:</strong>{" "}
            {activity.activityStartDate} ~ {activity.activityEndDate}
          </div>
          <div className="col-span-2">
            <strong>활동 내용:</strong>
            <p className="mt-1 text-gray-800">{activity.body}</p>
          </div>
          <div className="col-span-2">
            <strong>활동 태그:</strong>{" "}
            {activity.tags && activity.tags.length > 0
              ? activity.tags.join(", ")
              : "-"}
          </div>
        </div>
      </div>

      {/* 지원자 목록 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">지원자 목록</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleConfirmSelection}
              className={`bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50`}
              disabled={selectedIds.length === 0}
            >
              선발 확정 ({selectedIds.length})
            </button>
          </div>
        </div>

        {applicants.length === 0 ? (
          <p className="text-gray-500 text-sm">지원자가 없습니다.</p>
        ) : (
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === applicants.length && applicants.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">이름</th>
                <th className="border px-4 py-2 text-left">이메일</th>
                <th className="border px-4 py-2 text-left">상태</th>
                <th className="border px-4 py-2 text-left">지원일</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(a.id)}
                      onChange={() => toggleSelect(a.id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{a.id}</td>
                  <td className="border px-4 py-2">{a.applicantName}</td>
                  <td className="border px-4 py-2">{a.applicantEmail}</td>
                  <td className="border px-4 py-2">
                    {a.status === "PENDING"
                      ? "대기"
                      : a.status === "APPROVED"
                      ? "선발"
                      : "탈락"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(a.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
