import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage"; // Your main page content
import Objective2025 from "./Objective2025"; // The Objective 2025 content
import Privacy from "./Privacy";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the main page */}
        <Route path="/" element={<MainPage />} />
        
        {/* Route for Objective 2025 */}
        <Route path="/objective2025" element={<Objective2025 />} />

        {/* Route for Privacy Policy */}
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
}

export default App;
