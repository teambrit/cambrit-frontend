import { Outlet, useLocation, Navigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import HeaderCompany from "../components/HeaderCompany";
import HeaderAdmin from "../components/HeaderAdmin";

export default function AppLayout() {
  const location = useLocation();
  const role = localStorage.getItem("role") || "student";

  const isCompanyPage = location.pathname.startsWith("/company");
  const isAdminPage = location.pathname.startsWith("/admin");

  // 권한 체크
  if (isCompanyPage && role !== "company") {
    alert("기업회원만 접근할 수 있습니다.");
    return <Navigate to="/" replace />;
  }

  // 관리자 페이지는 직접 접근 허용 (개발/테스트용)
  // if (isAdminPage && role !== "admin") {
  //   alert("관리자만 접근할 수 있습니다.");
  //   return <Navigate to="/" replace />;
  // }

  // 헤더 분기
  let header;
  if (isAdminPage) {
    header = <HeaderAdmin />;
  } else if (isCompanyPage) {
    header = <HeaderCompany />;
  } else {
    header = <HeaderUser />;
  }

  return (
    <div className="min-h-screen">
      {header}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
