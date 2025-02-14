import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import AppRoutes from "./routes/router";

function App() {
  return (
    <Router>
      <Header />
      <AppRoutes />
    </Router>
  );
}

export default App;
