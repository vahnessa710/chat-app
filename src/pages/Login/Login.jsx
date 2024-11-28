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
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const [profileName, setProfileName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your authentication logic here
    try {
      const loginCredentials = {
        email,
        password
      }

      setProfileName(loginCredentials.email);

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

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const signupData = { email, password };
      const response = await axios.post(`${API_URL}/api/v1/auth/`, signupData);
      if (response.data) {
        alert("Account created successfully! You can now log in.");
        setIsSignup(false); // Switch back to login
      }
    } catch (error) {
      alert(error.response?.data?.errors || "Error creating account");
    }
  }

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
                  <div className="add-account-box"id = "primary-profile" onClick={handleAutoLogin}>
                      <div className='dp-container'>
                          <img
                            src={rose}
                            alt = 'profile'
                            />
                      </div>
                      <div class = "user-name">{`${profileName}` || "null"}</div>
                  </div>
                  <div className="add-account-box">
                    <p className='add-account-caption'>+ Add Account</p>
                  </div>
            </div>
      </div>


      <div className="login-box">
      {isSignup ? (
    <form onSubmit={handleSignup}>
      <h2 className='create-an-account'>Create an Account</h2>
      

      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
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
          placeholder="Create a password"
          required
        />
      </div>

      <button type="submit" className="btn">Sign Up</button>
      
      <span>
        Already have an account?
          <span className="toggle-link" onClick={() => setIsSignup(false)}>
          Login here.
          </span>
      </span>
      
    </form>
  ) : (
    <form onSubmit={handleSubmit}>
      
      <div className="input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <button 
        type="submit" 
        className="btn">
          Log In
      </button>

      <p className='forgot-pw toggle-link'>
        Forgot password? 
      </p>

      <hr/>

      <div className='new-account-container'>
        <p
          className="new-account-btn" 
          onClick={() => setIsSignup(true)}>
          Create new account
        </p>
      </div>
      
      
      

    </form>
  )}
</div>
</div>
);
}

export default Login;