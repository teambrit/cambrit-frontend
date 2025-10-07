import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { API_BASE_URL } from "../config";

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
      if (memberType === "student") navigate("/");
      else navigate("/company");
    } catch (err) {
      console.error("네트워크 오류:", err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Cambrit" src={logo} className="mx-auto h-10 w-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          로그인
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          {/* 회원 유형 선택 */}
          <ul className="flex w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {[
              { id: "student", label: "개인회원" },
              { id: "company", label: "기업회원" },
            ].map((item) => (
              <li
                key={item.id}
                className="w-full border-r last:border-r-0 dark:border-gray-600"
              >
                <div className="flex items-center ps-3">
                  <input
                    id={`radio-${item.id}`}
                    type="radio"
                    name="memberType"
                    value={item.id}
                    checked={memberType === item.id}
                    onChange={(e) => setMemberType(e.target.value)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`radio-${item.id}`}
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {item.label}
                  </label>
                </div>
              </li>
            ))}
          </ul>

          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                비밀번호
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                비밀번호를 잊으셨나요?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* 로그인 버튼 */}
          <div>
            <button
              type="button" // form 기본 제출 방지
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "처리 중..." : "로그인"}
            </button>
          </div>

          {/* 에러 메시지 */}
          {errorMsg && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {errorMsg}
            </p>
          )}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
