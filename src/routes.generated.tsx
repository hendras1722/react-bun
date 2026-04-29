// AUTOMATICALLY GENERATED
import React from "react";
import DashboardIndex from "./pages/dashboard/index";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Home from "./pages/Home";
import DashboardIdIndex from "./pages/dashboard/[id]/index";
import IdIndex from "./pages/[id]/index";
import SlugPage from "./pages/[...slug]/page";

export const generatedRoutesRaw = [
  { path: "dashboard", element: <DashboardIndex />, layout: "admin", meta: {
  activeMenu: 'dashboard',
  permission: ['admin', 'user'],
  title: 'Dashboard Admin'
} },
  { path: "contact", element: <Contact />, layout: "Main", meta: undefined },
  { path: "about", element: <About />, layout: "Main", meta: undefined },
  { path: "", element: <Home />, layout: false, meta: {
  title: "Dashboard Admin",
} },
  { path: "dashboard/:id", element: <DashboardIdIndex />, layout: "Main", meta: undefined },
  { path: ":id", element: <IdIndex />, layout: "Main", meta: undefined },
  { path: "*", element: <SlugPage />, layout: "Main", meta: undefined }
];
