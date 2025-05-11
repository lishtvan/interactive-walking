import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import "./index.css";
import App from "./App";
import ExplorePage from "./routes/Explore";
import WalkPage from "./routes/Walk";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <div className="text-2xl font-bold flex items-center justify-center h-screen">
        404 Page not found
      </div>
    ),
  },
  {
    path: "/explore",
    element: <ExplorePage />,
  },
  {
    path: "/walk/:walkId",
    element: <WalkPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
