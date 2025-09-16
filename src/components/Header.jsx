// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center px-6 py-3 shadow-md bg-white">
      {/* 로고 */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        CamBrit
      </Link>

      {/* 메뉴 */}
      <nav className="flex gap-4">
        <Link to="/signin" className="hover:text-blue-500">로그인</Link>
      </nav>
    </header>
  );
}
