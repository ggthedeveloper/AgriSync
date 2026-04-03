import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AgriSync from "./main.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AgriSync />
  </StrictMode>
);
