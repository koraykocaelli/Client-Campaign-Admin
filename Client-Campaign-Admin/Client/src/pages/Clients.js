import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../style/Clients.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/clients')
      .then(response => {
        setClients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
        setError('Could not fetch client data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="clients-container">
      <h1>Clients</h1>
      <table className="clients-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Contact Name</th>
            <th>Contact Email</th>
            <th>Added Campaigns</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.companyname}</td>
              <td>{client.contactname}</td>
              <td>{client.contactemail}</td>
              <td>
                {client.campaigns && client.campaigns.length > 0
                  ? client.campaigns.map(campaign => campaign.title).join(', ')
                  : 'No Campaigns Added'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;