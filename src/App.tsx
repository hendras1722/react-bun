import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import { generatedRoutesRaw } from "./routes.generated";
import { layouts } from "./layouts.generated";
import "./index.css";

function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);
  return (
    <div style={{ padding: 20 }}>
      <h1>Something broke 💥</h1>
      <p>{error?.message || "Unknown error"}</p>
    </div>
  );
}

// Group routes by layout dynamically
const groupedRoutes: Record<string, any[]> = {};
const noLayoutRoutes: any[] = [];

generatedRoutesRaw.forEach((route: any) => {
  const { layout, ...routeConfig } = route;
  
  if (layout === false) {
    noLayoutRoutes.push(routeConfig);
  } else {
    // If layout is a string (e.g. 'Admin'), use it. If not found, fallback to 'Main'.
    // We normalize layout name to match the exported layout components (e.g. 'admin' -> 'Admin')
    const layoutName = typeof layout === 'string' 
      ? layout.charAt(0).toUpperCase() + layout.slice(1).toLowerCase()
      : 'Main';

    if (!groupedRoutes[layoutName]) {
      groupedRoutes[layoutName] = [];
    }
    groupedRoutes[layoutName].push(routeConfig);
  }
});

// Build the final router configuration
const routerConfig = [
  // Layout-wrapped routes
  ...Object.entries(groupedRoutes).map(([name, children]) => {
    const LayoutComponent = (layouts as any)[name] || layouts.Main;
    return {
      path: "/",
      element: <LayoutComponent />,
      errorElement: <ErrorPage />,
      children,
    };
  }),
  // Bare routes (no layout)
  ...noLayoutRoutes.map(r => ({ ...r, errorElement: <ErrorPage /> }))
];

const router = createBrowserRouter(routerConfig);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
