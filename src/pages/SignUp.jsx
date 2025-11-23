import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Logo from "../components/Logo";

export default function SignUp() {
  const [memberType, setMemberType] = useState("student"); // 내부 상태는 소문자
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErrorMsg(null);

    const name =
      memberType === "student" ? studentName.trim() : companyName.trim();

    if (!email || !password || !name) {
      setErrorMsg("필수 항목을 모두 입력해주세요.");
      return;
    }

    const payload = {
      name,
      email,
      password,
      role: memberType.toUpperCase(), // 요청 시에만 대문자로 변환
    };

    try {
      setLoading(true);
      console.log("👉 API_BASE_URL:", API_BASE_URL);

      const res = await fetch(`${API_BASE_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMsg(data?.message || "회원가입 중 오류가 발생했습니다.");
        return;
      }

      alert("회원가입이 완료되었습니다. 로그인 후 서비스를 이용해주세요.");
      navigate("/signin");
    } catch (err) {
      console.error("네트워크 오류:", err);
      alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-b from-campus-50 to-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-bold text-gray-900">CamBrit</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {memberType === "student" ? "내 커뮤니티로" : "학생 커뮤니티에"}
            <br />
            {memberType === "student" ? "용돈 벌기 시작!" : "효과적으로 홍보하기!"}
          </h2>
          <p className="mt-2 text-gray-600">
            {memberType === "student"
              ? "단톡방, 동아리, 학생회 등 어디서든 활동하고 수익 창출"
              : "학생들이 직접 자신의 커뮤니티에 전달해요"}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 space-y-6">
          {/* 회원 유형 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              가입 유형
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "student", label: "학생으로 시작", icon: "🎓", desc: "활동하고 용돈 벌기" },
                { id: "company", label: "기업으로 시작", icon: "🏢", desc: "학생들에게 홍보하기" },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`relative flex flex-col items-start justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    memberType === item.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={item.id}
                    name="member-type"
                    checked={memberType === item.id}
                    onChange={(e) => setMemberType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2">{item.icon}</span>
                  <span className={`text-sm font-semibold mb-1 ${
                    memberType === item.id ? "text-primary-700" : "text-gray-900"
                  }`}>
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-500">{item.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 학생/기업별 이름 입력 */}
          {memberType === "student" && (
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                이름
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="홍길동"
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
              />
            </div>
          )}

          {memberType === "company" && (
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                회사명
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="캠브릿"
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
              />
            </div>
          )}

          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상 입력해주세요"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
            />
          </div>

          {/* 에러 메시지 */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span>⚠️</span>
                {errorMsg}
              </p>
            </div>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "가입 중..." : "회원가입 완료"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/signin"
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}
