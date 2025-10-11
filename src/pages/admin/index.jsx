import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

export default function AdminStudentAuthorization() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/student/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("학생 목록 조회 실패");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
        alert("학생 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [token]);

  // 파일 보기
  const handleViewFile = async (userId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/user/student-authorization-request/${userId}/file`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("파일 조회에 실패했습니다.");
      const blob = await res.blob();
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error(error);
      alert(error.message || "파일을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 승인 / 거절 처리 (로컬 상태만 변경)
  const handleApproval = async (userId, approve) => {
    if (
      !window.confirm(
        approve ? "이 학생을 승인하시겠습니까?" : "이 학생의 요청을 거절하시겠습니까?"
      )
    )
      return;

    try {
      setProcessingId(userId);
      const res = await fetch(
        `${API_BASE_URL}/user/student-authorization-request/${userId}?approve=${approve}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(await res.text());
      // alert(approve ? "승인 완료되었습니다." : "거절 처리되었습니다.");

      // 로컬 상태 업데이트만 수행
      setStudents((prev) =>
        prev.map((s) =>
          s.id === userId
            ? {
                ...s,
                studentAuthorizationStatus: approve ? "APPROVED" : "REJECTED",
                isAuthorized: approve,
              }
            : s
        )
      );
    } catch (error) {
      console.error(error);
      alert("요청 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  // 상태 표시
  const renderStatus = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="text-green-600 font-medium">승인됨</span>;
      case "PENDING":
        return <span className="text-blue-600 font-medium">대기 중</span>;
      case "REJECTED":
        return <span className="text-red-600 font-medium">거절됨</span>;
      default:
        return <span className="text-gray-400">미제출</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-10">불러오는 중...</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">학생 인증 관리</h2>

      {students.length === 0 ? (
        <p className="text-gray-500 text-center py-10">등록된 학생이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg bg-white">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">이름</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">이메일</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">인증 상태</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">파일</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">조치</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2 text-center">
                    {renderStatus(s.studentAuthorizationStatus)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {s.studentAuthorizationStatus === "NONE" ? (
                      "-"
                    ) : (
                      <button
                        onClick={() => handleViewFile(s.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        보기
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    {s.studentAuthorizationStatus === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleApproval(s.id, true)}
                          className="text-sm text-green-600 hover:text-green-800 disabled:opacity-50"
                          disabled={
                            processingId === s.id ||
                            s.studentAuthorizationStatus === "APPROVED"
                          }
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleApproval(s.id, false)}
                          className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                          disabled={processingId === s.id}
                        >
                          거절
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
