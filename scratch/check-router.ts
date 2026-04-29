import { createRouter, createRootRoute } from '@tanstack/react-router';
const rootRoute = createRootRoute();
const router = createRouter({ routeTree: rootRoute });
console.log('Router properties:', Object.keys(router).filter(k => k.toLowerCase().includes('hydrate') || k.toLowerCase().includes('dehydrate')));
