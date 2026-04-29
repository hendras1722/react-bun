import { createRouter, createRootRoute } from '@tanstack/react-router';
const rootRoute = createRootRoute();
const router = createRouter({ routeTree: rootRoute });
console.log('All Router keys:', Object.keys(router).sort());
