import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./providers/ThemeProvider.js"

import IndexPage from "./pages/IndexPage.js";
import ViewPage from "./pages/ViewPage.js";
import Layout from "./layout/Layout";
import { ToastProvider } from "./providers/ToastProvider.js";


const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path="/" element={<IndexPage />} />
        <Route path="/view/:slug" element={<ViewPage />} />
        {/* NotFound */}
        <Route path="*" />
      </Route>
    </Routes>
  )
}

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

export default App
