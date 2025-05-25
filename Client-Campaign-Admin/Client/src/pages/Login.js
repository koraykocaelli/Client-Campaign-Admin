import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login = ({ setRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
    
      if (!email || !password) {
        alert('Please fill in all fields!');
        return;
      }
    
      try {
        const response = await axios.post('http://localhost:5000/auth/login', { email, password }, {
          withCredentials: true,
        });
    
        const { role } = response.data;
    
        if (!role) {
          alert('Invalid role. Contact admin.');
          return;
        }
    
        localStorage.setItem('role', role);
        setRole(role);
    
        alert(`Login successful! Welcome, ${role === 'admin' ? 'Admin' : 'Client'}!`);
    
        if (role === 'admin') {
          navigate('/dashboard');
        } else if (role === 'client') {
          navigate('/add-campaign');
        }
      } catch (error) {
        if (error.response?.status === 401) {
          alert('Invalid email or password!');
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    };
  
    return (
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };
  
  export default Login;
  
