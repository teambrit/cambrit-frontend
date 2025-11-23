import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import Logo from "./Logo";

export default function HeaderUser() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="w-9 h-9" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">CamBrit</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded">
                학생-기업 매칭 플랫폼
              </span>
            </div>
          </Link>

          {/* 메뉴 */}
          <nav className="flex gap-2 items-center">
            {isLoggedIn() ? (
              <>
                <Link
                  to="/applications"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  내 지원
                </Link>
                <Link
                  to="/mypage"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  마이페이지
                </Link>
                <Link
                  to="/chatbot"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  💬 챗봇
                </Link>
                <button
                  onClick={() => logout(navigate)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors shadow-sm"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
