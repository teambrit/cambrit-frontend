import { Outlet, useLocation, Navigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import HeaderCompany from "../components/HeaderCompany";
import HeaderAdmin from "../components/HeaderAdmin";

export default function AppLayout() {
  const location = useLocation();
  let role = localStorage.getItem("role");

  // 기본 role 없으면 student
  if (!role) role = "student";

  const isCompanyPage = location.pathname.startsWith("/company");
  const isAdminPage = location.pathname.startsWith("/admin");

  // 권한 체크
  if (isCompanyPage && role !== "company") {
    alert("기업회원만 접근할 수 있습니다.");
    return <Navigate to="/" replace />;
  }

  if (isAdminPage && role !== "admin") {
    alert("관리자만 접근할 수 있습니다.");
    return <Navigate to="/" replace />;
  }

  // 헤더 선택
  let header = <HeaderUser />;
  if (role === "company") header = <HeaderCompany />;
  if (role === "admin") header = <HeaderAdmin />;

  return (
    <div className="min-h-screen">
      {header}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
