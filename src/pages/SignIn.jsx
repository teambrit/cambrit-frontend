import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { API_BASE_URL } from "../config";

export default function SignIn() {
  const navigate = useNavigate();
  const [memberType, setMemberType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // 응답 body는 한 번만 소비 가능 → 여기서 바로 읽음
      const text = await res.text();

      if (!res.ok) {
        setErrorMsg(text || "로그인 실패");
        return;
      }

      // 로그인 성공 시 text = JWT 토큰
      const token = text;
      localStorage.setItem("token", token);
      // TODO: 서버에서 내려준 값으로 set
      // localStorage.setItem("role", );
      

      // 로그인 후 페이지 이동
      if (memberType === "student") {
        localStorage.setItem("role", "student"); // TODO: 추후 삭제
        navigate("/");
      } else if (memberType === "company") {
        localStorage.setItem("role", "company"); // TODO: 추후 삭제
        navigate("/company");
      }

    } catch (err) {
      console.error("네트워크 오류:", err);
      setErrorMsg("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Cambrit" src={logo} className="mx-auto h-10 w-auto dark:hidden" />
        <img alt="Cambrit" src={logo} className="mx-auto hidden h-10 w-auto dark:block" />
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          로그인
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 학생/기업 선택 */}
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  id="radio-student"
                  type="radio"
                  name="list-radio"
                  value="student"
                  checked={memberType === "student"}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="radio-student"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  개인회원
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  id="radio-company"
                  type="radio"
                  name="list-radio"
                  value="company"
                  checked={memberType === "company"}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="radio-company"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  기업회원
                </label>
              </div>
            </li>
          </ul>

          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >
              이메일
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >
                비밀번호
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  비밀번호를 잊으셨나요?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
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
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
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
