import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./assets/fonts/stylesheet.css";
import Home from "./pages/Home.jsx";
import Error404 from "./pages/Error404.jsx";
import StickyDivs from "./pages/StickyDivs.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LaTica from "./pages/LaTica.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      { index: true, element: <Home /> },
      { path: "sticky", element: <StickyDivs /> },
      { path: "tica", element: <LaTica /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
