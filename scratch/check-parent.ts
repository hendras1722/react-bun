import { createRootRoute, createRoute } from '@tanstack/react-router';
const rootRoute = createRootRoute();
const layoutRoute = createRoute({ getParentRoute: () => rootRoute, id: 'layout' });
const pageRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/page' });
console.log('Page Parent Route ID:', (pageRoute as any).parentRoute?.id);
