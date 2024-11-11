import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";
import Solution from "./tictactoeSolution";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Solution />
  </StrictMode>
);
