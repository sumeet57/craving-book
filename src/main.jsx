import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom/dist/index.js";
import App from "./App.jsx";
import "./index.css";
import Home from "./components/Home.jsx";
import Fav from "./components/Fav.jsx";
import Recipes from "./components/Recipes.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "fav",
        element: <Fav />,
      },
      {
        path: "recipes",
        element: <Recipes />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
