import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getRouterConfig } from "./router";
import "./index.css";

const router = createBrowserRouter(getRouterConfig());

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
