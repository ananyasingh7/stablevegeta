import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage"; // Your main page content
import Objective2025 from "./Objective2025"; // The Objective 2025 content

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the main page */}
        <Route path="/" element={<MainPage />} />
        
        {/* Route for Objective 2025 */}
        <Route path="/objective2025" element={<Objective2025 />} />
      </Routes>
    </Router>
  );
}

export default App;