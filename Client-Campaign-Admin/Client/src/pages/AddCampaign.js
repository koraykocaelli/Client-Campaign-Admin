import React, { useState, useEffect } from "react";
import api from "../api/api";
import "../style/AddCampaign.css";

const AddCampaign = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch client data and campaigns on component mount
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await api.get("/auth/me"); // Fetch logged-in client info
        setClientName(response.data.contactname);
        setClientEmail(response.data.contactemail);

        // Fetch campaigns filtered by client email
        const campaignsResponse = await api.get(`/campaigns?email=${response.data.contactemail}`);
        setCampaigns(campaignsResponse.data);
      } catch (error) {
        console.error("Error fetching client data or campaigns:", error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  // Submit new campaign
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/campaigns", {
        title,
        campaignStartDate: startDate,
        campaignFinishDate: endDate,
        estimatedCost,
        clientEmail, // Use clientEmail to link the campaign
      });

      alert("Campaign added successfully");
      setTitle("");
      setStartDate("");
      setEndDate("");
      setEstimatedCost("");

      // Refresh campaigns
      const campaignsResponse = await api.get(`/campaigns?email=${clientEmail}`);
      setCampaigns(campaignsResponse.data);
    } catch (error) {
      console.error("Error adding campaign:", error);
      alert("Error adding campaign");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-campaign-container">
      <h1>Welcome, {clientName}</h1>
      <form onSubmit={handleSubmit} className="add-campaign-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <div className="estimated-cost-field">
          <span>$</span>
          <input
            type="number"
            placeholder="Estimated Cost"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <h2>Your Previous Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>You have no previous campaigns.</p>
      ) : (
        <ul className="campaign-list">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              {campaign.title} (Start: {new Date(campaign.campaignstartdate).toLocaleDateString()}, 
              End: {new Date(campaign.campaignfinishdate).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddCampaign;
