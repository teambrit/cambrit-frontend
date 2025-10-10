import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";

export default function HeaderAdmin() {
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 shadow bg-red-600">
      {/* 로고 */}
      <Link to="/admin" className="text-xl font-bold text-white">
        CamBrit 관리자
      </Link>

      {/* 메뉴 */}
      <nav className="flex gap-4">
        <Link to="/admin" className="text-white hover:text-gray-200">
          대시보드
        </Link>
        {isLoggedIn() ? (
          <button
            onClick={() => logout(navigate)}
            className="text-white hover:text-gray-200"
          >
            로그아웃
          </button>
        ) : (
          <Link to="/signin" className="text-white hover:text-gray-200">
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
}
