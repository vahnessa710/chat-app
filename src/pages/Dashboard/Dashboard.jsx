import React, { useState } from 'react';
import { FaHome, FaEnvelope, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa'; 
import './Dashboard.css'; 
import Channel from '../../Channel/Channel.jsx';
import slacking from '../../assets/logo_landscape.png';
import Chat from '../../Chat/Chat.jsx';

function Dashboard({setReceiver, onLogout}) {
  return (
    <div className="dashboard-container">

      <div className="main-content">
        
        <header className="header">
          <img 
          src={slacking} 
          alt="logo" />
              <div className='icon-container'>
                <a
                ><FaHome className="icon" /></a>
              </div>
              
              <div className='icon-container' >
                <a><FaEnvelope className="icon" /></a>
              </div>
              
              <div className='icon-container'>
                <a><FaCog className="icon" /></a>
              </div>
              
              <div className='icon-container'>
                <a><FaUser className="icon" /></a>
              </div>
              <div className="user-info">
                <span>Vahnessa</span>
                <button 
                  className="logout-button"
                  onClick={onLogout}
                > 
                  <FaSignOutAlt /> 
                  Logout
                </button>
             </div>
        </header>

        <Channel setReceiver={setReceiver} />

      </div>
      
    </div>
  );
}

export default Dashboard;
