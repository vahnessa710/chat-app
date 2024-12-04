import { useData } from "../../context/DataProvider.jsx"
import { FaHome, FaEnvelope, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa'; 
import { useState } from "react";
import './Dashboard.css'; 
import Channel from '../../Channel/Channel.jsx';
import slacking from '../../assets/logo_landscape.png';
import logo_only from '../../assets/logo_only.png';

function Dashboard({onLogout}) {
  const { userHeaders } = useData();
  const [messages, setMessages] = useState([]);
  return (
    <div className="dashboard-container">

      <div className="main-content">
        
        <header className="header">
          <img 
          src={logo_only} 
          alt="logo"
          className="logo-only" />


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
            <span>{userHeaders.uid.split("@")[0]}</span>
            <button 
              className="logout-button"
              onClick={onLogout}
            > 
              <FaSignOutAlt /> 
              Logout
            </button>
          </div>
        </header>

        <Channel messages ={messages} setMessages={setMessages} />

      </div>
      
    </div>
  );
}

export default Dashboard;
