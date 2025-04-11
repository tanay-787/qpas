import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/toaster"
import { Toaster as ToasterS } from "sonner";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <App />
        <ToasterS richColors closeButton />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
