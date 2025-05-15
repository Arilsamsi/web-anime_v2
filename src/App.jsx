import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import AppRoutes from "./routes/router";
import Footer from "./components/Footer";
// import SplashCursor from "./components/SplashCursor";
// import Ribbons from "./components/Ribbons";

function App() {
  return (
    <Router>
      <Header />
      <AppRoutes />
      {/* <SplashCursor /> */}
      <Footer />
    </Router>
  );
}

export default App;
