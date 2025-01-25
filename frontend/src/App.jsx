import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./screens/home/Home"
import Login from "./screens/login/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
