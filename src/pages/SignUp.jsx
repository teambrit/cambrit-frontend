import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Cambrit"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          회원가입
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          {/* 회원 유형 선택 */}
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  id="student"
                  type="radio"
                  value="student"
                  name="member-type"
                  checked={memberType === "student"}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="student"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  학생회원
                </label>
              </div>
            </li>
            <li className="w-full dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  id="company"
                  type="radio"
                  value="company"
                  name="member-type"
                  checked={memberType === "company"}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="company"
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* 학생/기업별 이름 입력 */}
          {memberType === "student" && (
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                이름
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}

          {memberType === "company" && (
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                회사명
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="button" // 🔥 form submit 방지
            onClick={handleSubmit}
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>

          {errorMsg && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {errorMsg}
            </p>
          )}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/signin"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
