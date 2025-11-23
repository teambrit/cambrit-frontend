import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../config";
import Logo from "../components/Logo";

export default function SignIn() {
  const navigate = useNavigate();
  const [memberType, setMemberType] = useState("student"); // 내부는 소문자 유지
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email,
        password,
        role: memberType.toUpperCase(), // 요청 시 대문자로 변환
      };

      const res = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) {
        setErrorMsg(text || "로그인 실패");
        return;
      }

      const token = text;
      localStorage.setItem("token", token);
      localStorage.setItem("role", memberType);

      // 로그인 후 페이지 이동
      if (memberType === "company") navigate("/company");
      else if (memberType === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error("네트워크 오류:", err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
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
            다시 오신 것을 환영해요!
          </h2>
          <p className="mt-2 text-gray-600">
            {memberType === "student"
              ? "내 커뮤니티에서 활동하고 용돈 벌 준비 되셨나요?"
              : memberType === "company"
              ? "학생 커뮤니티에 효과적으로 홍보할 준비 되셨나요?"
              : "관리자 페이지에 접속합니다"}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 space-y-6">
          {/* 회원 유형 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              회원 유형
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "student", label: "학생", icon: "🎓" },
                { id: "company", label: "기업", icon: "🏢" },
                { id: "admin", label: "관리자", icon: "⚙️" },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    memberType === item.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="memberType"
                    value={item.id}
                    checked={memberType === item.id}
                    onChange={(e) => setMemberType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className={`text-xs font-medium ${
                    memberType === item.id ? "text-primary-700" : "text-gray-700"
                  }`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

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
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900"
              >
                비밀번호
              </label>
              <a
                href="#"
                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                비밀번호 찾기
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

          {/* 로그인 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            회원가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}
