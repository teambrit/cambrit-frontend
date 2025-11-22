import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import Home from "../pages";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Activity from "../pages/Activity";
import Mypage from "../pages/Mypage";
import Applications from "../pages/Applications";
import Chatbot from "../pages/Chatbot";
import CompanyActivity from "../pages/company/Activity";
import CompanyActivityCreate from "../pages/company/ActivityCreate";
import CompanyActivityManagement from "../pages/company/ActivityManagement";
import CompanyBill from "../pages/company/Bill";
import CompanyHome from "../pages/company";
import AdminHome from "../pages/admin";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },

      { path: "activity/:id", element: <Activity /> },
      { path: "mypage", element: <Mypage /> },
      { path: "applications", element: <Applications /> },
      { path: "chatbot", element: <Chatbot /> },

      { path: "company", element: <CompanyHome /> },
      { path: "company/activity", element: <CompanyActivity /> },
      { path: "company/activity/new", element: <CompanyActivityCreate /> },
      { path: "company/activity/management/:id", element: <CompanyActivityManagement /> },
      { path: "company/bill", element: <CompanyBill /> },
      { path: "company/chatbot", element: <Chatbot /> },

      { path: "admin", element: <AdminHome /> },
    ],
  },
]);
