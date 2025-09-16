import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [memberType, setMemberType] = useState("personal"); // 기본값: 개인회원

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto dark:hidden"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          회원가입
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  id="personal"
                  type="radio"
                  value="personal"
                  name="member-type"
                  checked={memberType === "personal"}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label htmlFor="personal" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  개인회원
                </label>
              </div>
            </li>
            <li className="w-full dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  id="business"
                  type="radio"
                  value="business"
                  name="member-type"
                  checked={memberType === "business"}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label htmlFor="business" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  기업회원
                </label>
              </div>
            </li>
          </ul>

          {/* 공통 입력 (이메일/비번) */}
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* 개인회원 전용 필드 */}
          {memberType === "personal" && (
            <div>
              <label htmlFor="nickname" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                이름
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white"
              />
            </div>
          )}

          {/* 기업회원 전용 필드 */}
          {memberType === "business" && (
            <div>
              <label htmlFor="company" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                회사명
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white"
              />
            </div>
          )}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            회원가입
          </button>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
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
