import { useData } from "../../context/DataProvider.jsx"
import { FaHome, FaEnvelope, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa'; 
import './Dashboard.css'; 
import Channel from '../../Channel/Channel.jsx';
import slacking from '../../assets/logo_landscape.png';


function Dashboard({onLogout}) {
  const { userHeaders } = useData();

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

        <Channel />

      </div>
      
    </div>
  );
}

export default Dashboard;
