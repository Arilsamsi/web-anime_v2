import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import AppRoutes from "./routes/router";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <AppRoutes />
      <Footer />
    </Router>
  );
}

export default App;
