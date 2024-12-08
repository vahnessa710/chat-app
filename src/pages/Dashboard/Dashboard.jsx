import { FaHome, FaEnvelope, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa'; 
import { useState } from "react";
import './Dashboard.css'; 
import Channel from '../../Channel/Channel.jsx';
import logo_only from '../../assets/logo_only.png';
import { useData } from '../../context/DataProvider.jsx';

function Dashboard({onLogout}) {
  const { userHeaders } = useData();
  const [ primary, setPrimary ] = useState(false);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [userList, setUserList] = useState([]);
  const [channelDetails, setChannelDetails] = useState([]);
  const [channelMembers, setChannelMembers] = useState([]);
  const [channel, setChannel] = useState([]);
  const loggedUser = ({uid: userHeaders.uid, id: 14})
  const [ editButton, setEditButton ] = useState(false);
     // Function to toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    console.log(loggedUser);
  };

  const handlePrimary = () => {
    setPrimary((prevPrimary) => !prevPrimary);
  };
  
  return (
    <div className="dashboard-container">

      <div className="main-content">
        
        <header className="header">
          <img 
          src={logo_only} 
          alt="logo"
          className="logo-only"
          data-testid = "logo" />


          <div className='icon-container'>
            <a
            ><FaHome className="icon" /></a>
          </div>
              
          <div className='icon-container' >
            <a><FaEnvelope className="icon" /></a>
          </div>

          <div className='icon-container'
          onClick={toggleDarkMode}>
            <a><FaCog className="icon" /></a>
          </div>
          
          <div className='icon-container'
          onClick={handlePrimary} >
            <a><FaUser className="icon"
            /></a>
          </div>
          <div className="user-info">
            <span>{loggedUser.uid.split("@")[0]}</span>
            <button 
              className="logout-button"
              onClick={onLogout}
            > 
              <FaSignOutAlt /> 
              Logout
            </button>
          </div>
        </header>

        <Channel 
        userList= {userList} 
        setUserList = {setUserList}
        messages ={messages} 
        setMessages={setMessages} 
        receiver = {receiver} 
        setReceiver = {setReceiver}
        channelDetails ={channelDetails} 
        setChannelDetails = {setChannelDetails} 
        channelMembers = {channelMembers} 
        setChannelMembers = {setChannelMembers}
        channel = {channel}
        setChannel ={setChannel} 
        primary = {primary} 
        setPrimary = {setPrimary} 
        loggedUser = {loggedUser}
        editButton = {editButton}
        setEditButton = {setEditButton}
        />
       
      </div>
      
    </div>
  );
}

export default Dashboard;
