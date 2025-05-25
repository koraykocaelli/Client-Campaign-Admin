import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddCampaign from "./pages/AddCampaign";
import Clients from "./pages/Clients";
import Staff from "./pages/Staff";
import Campaigns from "./pages/Campaigns";
import Login from "./pages/Login";

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <Router>
      {role && <Navbar role={role} />}
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />
        <Route
          path="/dashboard"
          element={role === "admin" ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/add-campaign"
          element={role === "client" ? <AddCampaign /> : <Navigate to="/" />}
        />
        <Route
          path="/clients"
          element={role === "admin" ? <Clients /> : <Navigate to="/" />}
        />
        <Route
          path="/staff"
          element={role === "admin" ? <Staff /> : <Navigate to="/" />}
        />
        <Route
          path="/campaigns"
          element={role === "admin" ? <Campaigns /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
