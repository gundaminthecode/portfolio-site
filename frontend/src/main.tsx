// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import ProjectInfoPage from "./pages/ProjectInfoPage";
import PortfolioProject from "./pages/PortfolioProject";
import AboutMe from "./pages/AboutMe";
import "./styles/index.css";

import { CONFIG } from "./config";

const username = CONFIG.GITHUB_USERNAME;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App is the layout (header/footer), pages render inside it */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects username={username} />} />
          <Route path="project/:id" element={<ProjectInfoPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="portfolio-project" element={<PortfolioProject />} />
          <Route path="about-me" element={<AboutMe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
