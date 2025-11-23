import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";
import Logo from "./Logo";

export default function HeaderCompany() {
  const navigate = useNavigate();
  const location = useLocation();

  // 네비게이션 메뉴 정의
  const navigation = [
    { name: "대시보드", href: "/company" },
    { name: "활동 관리", href: "/company/activity" },
    { name: "청구서", href: "/company/bill" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link to="/company" className="flex items-center gap-2.5">
            <Logo className="w-9 h-9" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">CamBrit</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium bg-slate-700 text-slate-300 rounded">
                학생-기업 매칭 플랫폼
              </span>
            </div>
          </Link>

          {/* 메뉴 */}
          <nav className="flex gap-2 items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/70"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/company/chatbot"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/70 rounded-lg transition-colors"
            >
              💬 챗봇
            </Link>
            <button
              onClick={() => logout(navigate)}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/70 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
