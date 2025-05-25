import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Dashboard.css";

const Dashboard = () => {
  const [clientsCount, setClientsCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsResponse = await axios.get("http://localhost:5000/clients");
        const staffResponse = await axios.get("http://localhost:5000/staff");
        const campaignsResponse = await axios.get("http://localhost:5000/campaigns");

        setClientsCount(clientsResponse.data.length || 0);
        setStaffCount(staffResponse.data.length || 0);
        setCampaignsCount(campaignsResponse.data.length || 0);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Could not fetch data. Please check the server.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Company Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>{clientsCount}</h2>
          <p>Total Clients</p>
        </div>
        <div className="stat-card">
          <h2>{staffCount}</h2>
          <p>Total Staff</p>
        </div>
        <div className="stat-card">
          <h2>{campaignsCount}</h2>
          <p>Total Campaigns</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
