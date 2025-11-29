import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import defaultCompanyThumb from "../assets/default-company-thumbnail.png";
import defaultCompanyLogo from "../assets/default-company-logo.png";
import { formatImageUrl } from "../utils/imageUtils";

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
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );

  // 데이터 없음
  if (!activity)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-gray-500">활동 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 기업 썸네일 */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-b from-campus-50 to-white">
        <img
          src={defaultCompanyThumb}
          alt="기업 썸네일"
          className="h-full w-full object-cover opacity-30"
        />

        {/* 기업 로고 + 이름 */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="inline-flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={formatImageUrl(activity.logoImage) || defaultCompanyLogo}
                  alt="기업 로고"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">제공</p>
                <h2 className="text-base font-semibold text-gray-900">
                  {activity.posterName}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 활동 정보 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {activity.title}
        </h1>

        {/* 태그 */}
        {(activity.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md bg-campus-50 text-xs font-medium text-campus-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 정보 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div>
            <p className="text-xs text-gray-500 mb-1">보상 금액</p>
            <p className="text-lg font-semibold text-primary-600">
              {activity.compensation
                ? `${activity.compensation.toLocaleString()}원`
                : "협의"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">모집 마감일</p>
            <p className="font-semibold text-gray-900">
              {activity.applyDueDate || "상시모집"}
            </p>
          </div>

          {activity.activityStartDate && (
            <div>
              <p className="text-xs text-gray-500 mb-1">활동 시작일</p>
              <p className="font-semibold text-gray-900">
                {activity.activityStartDate}
              </p>
            </div>
          )}

          {activity.activityEndDate && (
            <div>
              <p className="text-xs text-gray-500 mb-1">활동 종료일</p>
              <p className="font-semibold text-gray-900">
                {activity.activityEndDate}
              </p>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* 상세 내용 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 내용</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {activity.body || "상세 내용이 없습니다."}
          </p>
        </div>
      </div>

      {/* 하단 지원 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-end">
          <button
            onClick={handleApply}
            disabled={applying}
            className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applying ? "지원 중..." : "지원하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
