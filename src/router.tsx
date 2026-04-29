import React from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { generatedRoutesRaw } from "./routes.generated";
import { layouts } from "./layouts.generated";

export function getRouterConfig(): RouteObject[] {
  const groupedRoutes: Record<string, any[]> = {};
  const noLayoutRoutes: any[] = [];

  // Inline empty layout for fallback
  const EmptyLayout = () => <Outlet />;

  generatedRoutesRaw.forEach((route: any) => {
    const { layout, meta, ...routeConfig } = route;
    
    const finalRoute = {
      ...routeConfig,
      handle: meta
    };

    if (layout === false || layout === "false") {
      noLayoutRoutes.push(finalRoute);
    } else {
      // Normalize layout name (e.g. 'main' -> 'Main')
      const layoutName = typeof layout === 'string'
        ? layout.charAt(0).toUpperCase() + layout.slice(1).toLowerCase()
        : 'Default';

      if (!groupedRoutes[layoutName]) {
        groupedRoutes[layoutName] = [];
      }
      groupedRoutes[layoutName].push(finalRoute);
    }
  });

  return [
    // Layout Routes (without path, they act as wrappers for their children)
    ...Object.entries(groupedRoutes).map(([name, children]) => {
      // Use the layout from folder if exists, otherwise fallback to EmptyLayout
      const LayoutComponent = (layouts as any)[name] || EmptyLayout;
      return {
        element: <LayoutComponent />,
        children,
      };
    }),
    // Routes without layouts
    ...noLayoutRoutes
  ];
}
