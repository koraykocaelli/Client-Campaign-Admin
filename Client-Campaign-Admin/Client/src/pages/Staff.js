import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../style/Staff.css';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/staff')
      .then(response => {
        setStaff(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching staff:', error);
        setError('Could not fetch staff data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="staff-container">
      <h1>Staff List</h1>
      <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Assigned Campaigns</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(member => (
            <tr key={member.staffid}>
              <td>{member.staffname}</td>
              <td>{member.staffemailaddress}</td>
              <td>
                {member.assignedcampaigns && member.assignedcampaigns.length > 0
                  ? member.assignedcampaigns.map(campaign => campaign.title).join(', ')
                  : 'No Campaigns Assigned'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Staff;