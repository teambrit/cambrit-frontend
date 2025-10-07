import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import Home from "../pages";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Activity from "../pages/Activity";
import Mypage from "../pages/Mypage";
import CompanyActivity from "../pages/company/Activity";
import CompanyHome from "../pages/company";
import AdminHome from "../pages/admin";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },

      { path: "activity", element: <Activity /> },
      { path: "mypage", element: <Mypage /> },

      { path: "company", element: <CompanyHome /> },
      { path: "company/activity", element: <CompanyActivity /> },

      { path: "admin", element: <AdminHome /> },
    ],
  },
]);
