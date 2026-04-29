// AUTOMATICALLY GENERATED
import React from "react";
import DesignSystem from "./pages/DesignSystem";
import DashboardIndex from "./pages/dashboard/index";
import Contact, { getServerSide as ContactLoader } from "./pages/Contact";
import Login from "./pages/Login";
import UsersIndex from "./pages/users/index";
import About from "./pages/About";
import Home from "./pages/Home";
import DashboardIdIndex from "./pages/dashboard/[id]/index";

export const generatedRoutesRaw = [
  { path: "designsystem", element: <DesignSystem />, loader: undefined, layout: "admin", meta: {
  activeMenu: "design-system",
  title: "Design System",
} },
  { path: "dashboard", element: <DashboardIndex />, loader: undefined, layout: "admin", meta: {
  activeMenu: "dashboard",
  permission: ["admin", "user"],
  title: "Analytics Overview",
} },
  { path: "contact", element: <Contact />, loader: ContactLoader, layout: "Main", meta: undefined },
  { path: "login", element: <Login />, loader: undefined, layout: false, meta: undefined },
  { path: "users", element: <UsersIndex />, loader: undefined, layout: "admin", meta: {
  activeMenu: "users",
  title: "User Management",
} },
  { path: "about", element: <About />, loader: undefined, layout: "Main", meta: undefined },
  { path: "", element: <Home />, loader: undefined, layout: false, meta: {
  title: "Dashboard Admin",
} },
  { path: "dashboard/:id", element: <DashboardIdIndex />, loader: undefined, layout: "Main", meta: undefined }
];
