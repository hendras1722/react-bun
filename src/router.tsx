import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useLoaderData,
  Link,
} from "@tanstack/react-router";
import { generatedRoutesRaw } from "./routes.generated";
import { layouts } from "./layouts.generated";
import { Button } from "./components/ui/Button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

const globalData = {
  id: 1,
  name: 'hello'
};

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  errorComponent: ({ error, reset }: any) => {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 shadow-xl text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">
              {error?.message || "An unexpected error occurred while loading this page."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => reset()} className="w-full">Try Again</Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  },
  notFoundComponent: () => {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-9xl font-black text-primary/10">404</h1>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="px-8 shadow-lg shadow-primary/20">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }
});

const PageWrapper = ({ component: Component, serverData, globalData }: any) => {
  return <Component data={serverData} serverData={serverData} globalData={globalData} />;
};

const layoutNames = Array.from(new Set(generatedRoutesRaw.map(r => {
  const l = r.layout;
  if (l === false || l === "false") return null;
  return typeof l === 'string' ? l.charAt(0).toUpperCase() + l.slice(1) : 'Default';
}).filter(Boolean))) as string[];

const layoutRoutesMap: Record<string, any> = {};

layoutNames.forEach(name => {
  const LayoutComponent = layouts[name as keyof typeof layouts] || (() => <Outlet />);
  layoutRoutesMap[name] = createRoute({
    getParentRoute: () => rootRoute,
    id: `layout-${name}`,
    component: LayoutComponent,
  });
});

const pageRoutes: any[] = [];
const pageParentMap = new Map<number, any>();

generatedRoutesRaw.forEach((routeRaw, index) => {
  const origLayout = routeRaw.layout;
  const isLayoutDisabled = origLayout === false || origLayout === "false";

  const layoutName = isLayoutDisabled ? null : (typeof origLayout === 'string'
    ? origLayout.charAt(0).toUpperCase() + origLayout.slice(1)
    : 'Default');

  const parentRoute = layoutName ? layoutRoutesMap[layoutName] : rootRoute;
  pageParentMap.set(index, parentRoute);

  const route = createRoute({
    getParentRoute: () => parentRoute,
    path: routeRaw.path === "" ? "/" : routeRaw.path,
    component: function PageRoute() {
      const loaderData = useLoaderData({ from: route.id });
      const serverData = (loaderData as any)?.serverData;
      return <PageWrapper component={routeRaw.component} serverData={serverData} globalData={globalData} />;
    },
    loader: async (args) => {
      let serverData = null;
      if (routeRaw.loader) {
        serverData = await (routeRaw.loader as any)(args);
      }
      return { serverData };
    },
    beforeLoad: () => ({ routeMeta: routeRaw.meta })
  });

  pageRoutes.push(route);
});

// Build Route Tree correctly
const routeTree = rootRoute.addChildren([
  ...Object.entries(layoutRoutesMap).map(([name, layoutRoute]) => {
    const children = pageRoutes.filter((_, i) => pageParentMap.get(i) === layoutRoute);
    return layoutRoute.addChildren(children);
  }),
  ...pageRoutes.filter((_, i) => pageParentMap.get(i) === rootRoute)
]);

// Create Router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  trailingSlash: 'never',
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
