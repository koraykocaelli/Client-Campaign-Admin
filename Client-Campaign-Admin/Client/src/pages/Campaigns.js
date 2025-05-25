import React, { useEffect, useState } from "react";
import api from "../api/api"; // Importing your custom Axios instance
import "../style/Campaigns.css";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data function
  const fetchData = async () => {
    try {
      const campaignsResponse = await api.get("/campaigns"); // Use 'api' here
      setCampaigns(campaignsResponse.data);

      const staffResponse = await api.get("/staff"); // Use 'api' here
      console.log("Loaded staff data:", staffResponse.data); // Log added
      setStaff(staffResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (campaignId, staffId) => {
    console.log("Assigning Campaign ID:", campaignId, "Staff ID:", staffId);

    if (!campaignId || !staffId) {
      alert("Both Campaign ID and Staff ID are required.");
      return;
    }

    try {
      const response = await api.post("/campaigns/assign", { campaignId, staffId });
      alert("Campaign assigned successfully");
      setCampaigns(response.data); // Update campaigns
    } catch (error) {
      console.error("Error assigning campaign:", error.response?.data || error.message);
      alert(`Error assigning campaign: ${error.response?.data?.error || "Unknown error occurred"}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="campaigns-container">
      <h1>Campaigns</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Client</th>
            <th>Assigned Staffs</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={`campaign-${campaign.id}`}>
              <td>{campaign.title}</td>
              <td>
                {campaign.clientname} ({campaign.clientemail})
              </td>
              <td>
                {campaign.assignedstaff
                  ? campaign.assignedstaff.map((staff, index) => (
                      <div key={`staff-${staff.id || index}`}>
                        {staff.staffname}
                      </div>
                    ))
                  : "Unassigned"}
              </td>
              <td>
                <select
                  onChange={(e) =>
                    handleAssign(campaign.id, parseInt(e.target.value, 10))
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Assign to Staff
                  </option>
                  {staff.map((member) => (
                    <option
                      key={`staff-${member.staffid}`}
                      value={member.staffid}
                    >
                      {member.staffname}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Campaigns;
