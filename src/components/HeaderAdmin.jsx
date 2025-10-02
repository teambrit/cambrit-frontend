import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";

export default function HeaderAdmin() {
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 shadow-md bg-white">
      {/* 로고 */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        캠브릿 어드민
      </Link>

      {/* 메뉴 */}
      <nav className="flex gap-4">
        {isLoggedIn() ? (
          <button
            onClick={() => logout(navigate)}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            로그아웃
          </button>
        ) : (
          <Link to="/signin" className="hover:text-blue-500">
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
}
