import { RouterProvider, type AnyRouter } from "@tanstack/react-router";

export function App({ router }: { router: AnyRouter }) {
  return <RouterProvider router={router} />;
}

export default App;
