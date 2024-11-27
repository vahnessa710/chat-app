import React, { useState, useEffect } from 'react';
import axios from "axios";
import { API_URL } from "../../constants/Constants";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataProvider";
import './Login.css';  
import logoLandscape from "../../assets/logo_landscape.png";
import rose from '../../assets/rose.png';
function Login(props) {
  const { onLogin } = props;
  const { handleHeaders } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your authentication logic here
    try {
      const loginCredentials = {
        email,
        password
      }

      const response = await axios.post(`${API_URL}/auth/sign_in`, loginCredentials);
      const { data, headers } = response;
      if(data && headers) {
        // headers as values in our context
        handleHeaders(headers);
        console.log('Response:', response); // Inspect the full response object
        console.log(response.data); 
        onLogin();
        navigate('/dashboard');
      }
    } catch(error) {
      if(error.response.data.errors) {
        return alert("Invalid credentials");
      }
    }
  };

  const handleAutoLogin = async () => {
    try {
      // Predefined credentials or token for the "Add Account" box
      const predefinedCredentials = {
        email: "vahnessa.gonzales@gmail.com",
        password: "password"
      };
  
      const response = await axios.post(`${API_URL}/auth/sign_in`, predefinedCredentials);
      const { data, headers } = response;
  
      if (data && headers) {
        // Use handleHeaders to save headers to context
        handleHeaders(headers);
        onLogin();
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response.data.errors) {
        alert("Failed to auto-login. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
          <img 
          src= {logoLandscape}
          id = "logo-landscape"
          />
       
        <h3 id = "recent-logins">Recent Logins</h3>
          <p id = "recent-logins-p">Click your picture or add an account.</p>
          <div className='add-something-container'>
            <div 
            className="add-account-box"
            id = "primary-profile"
            onClick={handleAutoLogin}
            >
              <div className='dp-container'>
                <img
                  src={rose}
                  />
              </div>
            <p id = "user-name">Vahnessa</p>
            </div>
            <div className="add-account-box">
          <span>+ Add something</span>
          </div>
          </div>
      </div>
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email address"
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>

          <button type="submit" className="btn">Login</button>
        </form>

        <div className="signup-link">
          <a>Forgot Password?</a>
          <hr/>
          <button type="submit" className="new-account-btn">Create new account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
