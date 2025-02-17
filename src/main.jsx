import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="668683657432-3t1bmeg9gafj551es5occ6vh8v7te6i2.apps.googleusercontent.com">
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
    ,
  </GoogleOAuthProvider>
);
