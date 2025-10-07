import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";

export default function HeaderUser() {
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 shadow bg-white">
      {/* 로고 */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        CamBrit
      </Link>

      {/* 메뉴 */}
      <nav className="flex gap-4 items-center">
        {isLoggedIn() ? (
          <>
            <Link to="/mypage" className="hover:text-blue-500">
              마이페이지
            </Link>
            <button
              onClick={() => logout(navigate)}
              className="hover:text-blue-500"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/signin" className="hover:text-blue-500">
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
}
