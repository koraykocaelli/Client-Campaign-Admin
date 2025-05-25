import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import '../style/ClientDetail.css';

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    api.get(`/clients/${id}`)
      .then(response => {
        setClient(response.data);
      })
      .catch(error => {
        console.error('Error fetching client details:', error);
      });
  }, [id]);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="client-detail-container">
      <h1>Client Detail</h1>
      <div className="client-detail-card">
        <h2>{client.companyName}</h2>
        <p><strong>Address:</strong> {client.companyAddress}</p>
        <p><strong>Contact:</strong> {client.contactName}</p>
        <p><strong>Email:</strong> {client.contactEmail}</p>
        <button className="edit-btn">Edit</button>
      </div>
    </div>
  );
};

export default ClientDetail;
