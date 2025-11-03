import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function CompanyActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // /user/me로 회사 ID 가져오기
        const meRes = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error("내 정보 불러오기 실패");
        const meData = await meRes.json();

        // /posting/page로 회사 등록 공고 조회
        const postingsRes = await fetch(
          `${API_BASE_URL}/posting/page?page=0&size=20&posterId=${meData.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!postingsRes.ok) throw new Error("공고 조회 실패");
        const postingsData = await postingsRes.json();

        setActivities(postingsData.content || []);
      } catch (error) {
        console.error(error);
        alert("공고 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">활동 목록</h2>
        <Link
          to="/company/activity/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          새 활동 등록
        </Link>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          등록된 공고가 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.body.length > 60
                      ? item.body.slice(0, 60) + "..."
                      : item.body}
                  </p>
                  <div className="text-sm text-gray-500">
                    지원 마감일: {item.applyDueDate || "-"}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-right">
                  <Link
                    to={`/company/activity/management/${item.id}`}
                    className="text-green-600 text-sm hover:text-green-800"
                  >
                    관리
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
