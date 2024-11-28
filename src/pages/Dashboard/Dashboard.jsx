import React, { useState } from 'react';
import { FaHome, FaEnvelope, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Importing icons
import './Dashboard.css'; 
import Channel from '../../Channel/Channel.jsx';
import slacking from '../../assets/logo_landscape.png';

function Dashboard(props) {
  const { onLogout } = props;
 

  // const handleMessages() => {

  // }

  return (
    <div className="dashboard-container">

      {/* Main Content */}
      <div className="main-content">
        
        <header className="header">

          <img 
          src={slacking} 
          alt="logo" />
              <div className='icon-container'>
              <a 
              href="/home"
              
              ><FaHome className="icon" /></a>
              </div>
              
              <div className='icon-container'>
                <a href="/dashboard"><FaEnvelope className="icon" /></a>
              </div>
              
              <div className='icon-container'>
              <a href="/settings"><FaCog className="icon" /></a>
              </div>
              
              <div className='icon-container'>
                <a href="/profile"><FaUser className="icon" /></a>
              </div>
              

          <div className="user-info">
            <span>Vahnessa</span>
            <button 
            className="logout-button"
            onClick={onLogout}
            > <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>
        <Channel />
      </div>
    </div>
  );
}

export default Dashboard;
