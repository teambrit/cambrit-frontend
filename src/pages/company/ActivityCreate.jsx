import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function CompanyActivityCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    body: "",
    compensation: "",
    tags: "",
    applyDueDate: "",
    activityStartDate: "",
    activityEndDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.title || !form.body || !form.applyDueDate) {
      setErrorMsg("필수 항목을 모두 입력해주세요.");
      return;
    }

    // ✅ 백엔드 요청 스펙에 맞는 payload 구성
    const payload = {
      title: form.title,
      body: form.body,
      compensation: Number(form.compensation) || 0,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      applyDueDate: form.applyDueDate, // ✅ 필드명 변경 (dueDate → applyDueDate)
      activityStartDate: form.activityStartDate || null,
      activityEndDate: form.activityEndDate || null,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/posting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "등록 실패");
      }

      alert("공고가 성공적으로 등록되었습니다.");
      navigate("/company/activity");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">새 활동 등록</h2>
        <Link
          to="/company/activity"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          목록으로 돌아가기
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-5"
      >
        {/* 제목 */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            활동 제목 *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="예: 컴퓨터학과 학생 모집"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            활동 내용 *
          </label>
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 h-32"
            placeholder="활동 내용과 자격 요건을 자세히 입력해주세요."
          />
        </div>

        {/* 보상금 */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            보상금 (원)
          </label>
          <input
            type="number"
            name="compensation"
            value={form.compensation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="예: 500000"
          />
        </div>

        {/* 태그 */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            활동 내용 (쉼표로 구분)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="예: 단톡방 홍보, 포스터 부착"
          />
        </div>

        {/* 날짜 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              모집 마감일 *
            </label>
            <input
              type="date"
              name="applyDueDate"
              value={form.applyDueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              활동 시작일
            </label>
            <input
              type="date"
              name="activityStartDate"
              value={form.activityStartDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              활동 종료일
            </label>
            <input
              type="date"
              name="activityEndDate"
              value={form.activityEndDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

        {/* 제출 버튼 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "등록 중..." : "공고 등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
