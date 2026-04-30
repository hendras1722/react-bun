// AUTOMATICALLY GENERATED
import React from "react";
import DesignSystem from "./pages/Design-System";
import DashboardIndex, { getServerSide as DashboardIndexLoader } from "./pages/dashboard/index";
import Contact, { getServerSide as ContactLoader } from "./pages/Contact";
import Login from "./pages/login";
import UsersIndex from "./pages/users/index";
import About, { getServerSide as AboutLoader } from "./pages/about";
import Index from "./pages/index";
import DashboardIdIndex from "./pages/dashboard/[id]/index";

export const generatedRoutesRaw = [
  { path: "design-system", component: DesignSystem, loader: undefined, layout: "admin", meta: {
  activeMenu: "design-system",
  title: "Design System",
} },
  { path: "dashboard", component: DashboardIndex, loader: DashboardIndexLoader, layout: "admin", meta: {
  activeMenu: "dashboard",
  permission: ["admin", "user"],
  title: "Aasdasdnalytics Overview",
} },
  { path: "contact", component: Contact, loader: ContactLoader, layout: "Main", meta: undefined },
  { path: "login", component: Login, loader: undefined, layout: false, meta: undefined },
  { path: "users", component: UsersIndex, loader: undefined, layout: "admin", meta: {
  activeMenu: "users",
  title: "User Management",
} },
  { path: "about", component: About, loader: AboutLoader, layout: "Main", meta: {
  title: "About",
  description: "About This Project",
  keywords: ["About", "This", "Project"],
} },
  { path: "", component: Index, loader: undefined, layout: "main", meta: {
  title: "Dashboard Admin",
} },
  { path: "dashboard/:id", component: DashboardIdIndex, loader: undefined, layout: "Main", meta: undefined }
];
