import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import Home from "../pages";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Activity from "../pages/Activity";
import CompanyHome from "../pages/company";
import AdminHome from "../pages/admin"; // 새로 추가

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      // { path: "activity", element: <Activity /> },
      { path: "company", element: <CompanyHome /> },
      // { path: "admin", element: <AdminHome /> },
    ],
  },
]);
