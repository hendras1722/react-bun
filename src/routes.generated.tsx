// AUTOMATICALLY GENERATED
import React from "react";
import DesignSystem from "./pages/DesignSystem";
import DashboardIndex, { getServerSide as DashboardIndexLoader } from "./pages/dashboard/index";
import Contact, { getServerSide as ContactLoader } from "./pages/Contact";
import Login from "./pages/Login";
import UsersIndex from "./pages/users/index";
import About from "./pages/About";
import Home from "./pages/Home";
import DashboardIdIndex from "./pages/dashboard/[id]/index";

export const generatedRoutesRaw = [
  { path: "designsystem", component: DesignSystem, loader: undefined, layout: "admin", meta: {
  activeMenu: "design-system",
  title: "Design System",
} },
  { path: "dashboard", component: DashboardIndex, loader: DashboardIndexLoader, layout: "admin", meta: {
  activeMenu: "dashboard",
  permission: ["admin", "user"],
  title: "Analytics Overview",
} },
  { path: "contact", component: Contact, loader: ContactLoader, layout: "Main", meta: undefined },
  { path: "login", component: Login, loader: undefined, layout: false, meta: undefined },
  { path: "users", component: UsersIndex, loader: undefined, layout: "admin", meta: {
  activeMenu: "users",
  title: "User Management",
} },
  { path: "about", component: About, loader: undefined, layout: "Main", meta: undefined },
  { path: "", component: Home, loader: undefined, layout: "main", meta: {
  title: "Dashboard Admin",
} },
  { path: "dashboard/:id", component: DashboardIdIndex, loader: undefined, layout: "Main", meta: undefined }
];
