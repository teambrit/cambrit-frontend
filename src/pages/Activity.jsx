import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import defaultCompanyThumb from "../assets/default-company-thumbnail.png";
import defaultCompanyLogo from "../assets/default-company-logo.png";

export default function Activity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState(null); // PENDING / APPROVED / REJECTED
  const [applying, setApplying] = useState(false);

  const token = localStorage.getItem("token");

  // 공고 상세 조회
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posting/${id}`);
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await res.json();
        setActivity(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  // 학생 인증 상태 조회
  useEffect(() => {
    const fetchAuthStatus = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/user/student-authorization-request/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setAuthStatus(data.status || data);
        } else {
          console.warn("인증 상태 불러오기 실패");
        }
      } catch (err) {
        console.error("인증 상태 요청 오류:", err);
      }
    };
    fetchAuthStatus();
  }, [token]);

  // 지원하기 버튼 클릭
  const handleApply = async () => {
    // 로그인 안 한 경우
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
      return;
    }

    // 학생 인증 미완료
    // if (authStatus !== "APPROVED") {
    //   alert("학생 인증이 필요합니다. 마이페이지로 이동합니다.");
    //   navigate("/mypage");
    //   return;
    // }

    // 인증 완료 → 지원 요청
    try {
      setApplying(true);
      const res = await fetch(`${API_BASE_URL}/posting/apply/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "지원 실패");
      }

      alert("지원이 완료되었습니다!");
    } catch (err) {
      alert(err.message);
    } finally {
      setApplying(false);
    }
  };

  // 로딩 중
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );

  // 데이터 없음
  if (!activity)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">공고 정보를 찾을 수 없습니다.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 상단 기업 썸네일 */}
      <div className="relative h-48 sm:h-64 bg-gray-200">
        <img
          src={defaultCompanyThumb}
          alt="기업 썸네일"
          className="h-full w-full object-cover"
        />

        {/* 기업 로고 + 이름 */}
        <div className="absolute bottom-4 left-0 w-full">
          <div className="container mx-auto px-4">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
              <img
                src={activity.logoImage || defaultCompanyLogo}
                alt="기업 로고"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {activity.posterName}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 활동 정보 */}
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {activity.title}
        </h1>

        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {/* 활동 종류 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">활동 종류</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex flex-wrap gap-2">
                  {(activity.tags || []).length > 0 ? (
                    activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">태그 없음</span>
                  )}
                </div>
              </dd>
            </div>

            {/* 상세 내용 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">상세 내용</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {activity.body || "상세 내용이 없습니다."}
              </dd>
            </div>

            {/* 보상 금액 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">보상 금액</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {activity.compensation
                  ? `${activity.compensation.toLocaleString()}원`
                  : "미정"}
              </dd>
            </div>

            {/* 활동 기간 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">활동 기간</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {activity.activityStartDate} ~ {activity.activityEndDate}
              </dd>
            </div>

            {/* 모집 마감일 */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900">모집 마감일</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {activity.applyDueDate}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 하단 지원 버튼 */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
        <div className="container mx-auto flex justify-end">
          <button
            onClick={handleApply}
            disabled={applying}
            className="w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {applying ? "지원 중..." : "지원하기"}
          </button>
        </div>
      </nav>
    </div>
  );
}
