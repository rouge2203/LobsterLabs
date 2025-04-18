import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./assets/fonts/stylesheet.css";
import Home from "./pages/Home.jsx";
import Error404 from "./pages/Error404.jsx";
import StickyDivs from "./pages/StickyDivs.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpikeBall from "./pages/SpikeBall.jsx";
import NewTournament from "./pages/NewTournament.jsx";
import SortTeams from "./pages/SortTeams.jsx";
import Tournaments from "./pages/Tournaments.jsx";
import TournamentPage from "./pages/TournamentPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      { index: true, element: <Home /> },
      { path: "sticky", element: <StickyDivs /> },
      { path: "spikeball", element: <SpikeBall /> },
      { path: "spikeball/new-tournament", element: <NewTournament /> },
      { path: "spikeball/sort-teams", element: <SortTeams /> },
      { path: "spikeball/tournaments", element: <Tournaments /> },
      { path: "spikeball/tournaments/:id", element: <TournamentPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
