import React from "react";
import { Outlet, useLoaderData, useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { generatedRoutesRaw } from "./routes.generated";
import { layouts } from "./layouts.generated";
import { Button } from "./components/ui/Button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

// Wrapper to inject loader data (from getServerSide) and global data into page props
function PageWrapper({ element, globalData }: any) {
  const serverData = useLoaderData();
  return React.cloneElement(element, { data: globalData, serverData });
}

export function ErrorPage() {
  const error = useRouteError();
  const is404 = (isRouteErrorResponse(error) && error.status === 404) || !error;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative bg-card border border-border h-24 w-24 rounded-2xl flex items-center justify-center shadow-2xl">
          {is404 ? (
            <span className="text-4xl font-black text-primary">404</span>
          ) : (
            <AlertCircle className="h-12 w-12 text-destructive" />
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
        {is404 ? "Page not found" : "Unexpected error"}
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
        {is404 
          ? "The page you are looking for doesn't exist or has been moved to another location."
          : "An error occurred while trying to process your request. Our team has been notified."
        }
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button 
          variant="outline" 
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Link to="/dashboard" className="w-full sm:w-auto">
          <Button className="w-full">
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </Link>
      </div>

      {!is404 && (
        <div className="mt-12 p-4 bg-muted/50 border border-border rounded-xl max-w-lg overflow-hidden">
          <p className="text-[10px] font-mono text-muted-foreground break-all text-left">
            {error instanceof Error ? error.stack : JSON.stringify(error)}
          </p>
        </div>
      )}
    </div>
  );
}

export function getRouterConfig(): RouteObject[] {
  // fetching middleware in here
  const data = {
    id: 1,
    name: 'hello'
  };

  const groupedRoutes: Record<string, any[]> = {};
  const noLayoutRoutes: any[] = [];

  // Inline empty layout for fallback
  const EmptyLayout = ({ data }: any) => <Outlet context={data} />;

  generatedRoutesRaw.forEach((route: any) => {
    const { layout, meta, element, loader, ...routeConfig } = route;

    // Use PageWrapper to inject both global data and server-side data
    const elementWithData = <PageWrapper element={element} globalData={data} />;

    const finalRoute = {
      ...routeConfig,
      element: elementWithData,
      loader, // Pass the loader from the page
      handle: meta,
      errorElement: <ErrorPage />
    };

    if (layout === false || layout === "false") {
      noLayoutRoutes.push(finalRoute);
    } else {
      // Normalize layout name (e.g. 'main' -> 'Main')
      const layoutName = typeof layout === 'string'
        ? layout.charAt(0).toUpperCase() + layout.slice(1)
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
        element: <LayoutComponent data={data} />,
        errorElement: <ErrorPage />,
        children,
      };
    }),
    // Routes without layouts
    ...noLayoutRoutes.map(r => ({ ...r, errorElement: <ErrorPage /> })),
    // Catch-all 404
    {
      path: "*",
      element: <ErrorPage />,
    }
  ];
}
