import React, { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import Chat from '../Chat/Chat.jsx';
import '../Channel/Channel.css';
import { useNavigate } from "react-router-dom";

function Channel() {
  const { userHeaders } = useData();
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // toggle window for creating new channel
  const [groups, setGroups] = useState([
    { name: "General" },
    { name: "Batch 37" },
  ]);
  const [selectedGroup, setSelectedGroup] = useState(["Batch 37"]); // Track selected channel
  const [newGroupName, setNewGroupName] = useState(""); // new channel name
  const [receiver, setReceiver] = useState(null);
 

  const handleReceiver = ({ id, email }) => {
    setReceiver({ id, email }); // Store both id and email
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, { headers: userHeaders });
      const users = response.data.data;
      setUserList(users);
    } catch (error) {
      if(error.response.data.errors) {
        return alert("Cannot get users");
      }
    }
  }

  useEffect(() => {
    if(userList.length === 0) {
      getUsers();
    }
  })


  const createGroup = () => {
    if (newGroupName.trim()) {
      setGroups([...groups, { name: newGroupName, members: selectedUsers }]);
      setNewGroupName("");
      setSelectedUsers([]);
      setIsModalOpen(false);
    }
  };

  return (
    
    <div className="dashboard-container">

      <div className="channel-bar">

        <h2 className="channel-header">Channel</h2>
            
              <ul className="channel-list-container">

                {groups.map((group, index) => (
                  <li 
                    key={index} 
                    className='group-list'>
                    <a 
                      className='group-name'
                      href="#"
                      onClick={() => setSelectedGroup(group.name)}>
                      {`# ${group.name}`}
                    </a>
                  </li>
                ))}
                
              </ul>
            

        <button className="create-group-button" onClick={() => setIsModalOpen(true)}>
          + Create Channel
        </button>

        <h2 className="dm-header">Direct messages</h2>
        <nav>
          <ul className="userList-container">

                    {userList &&
                    userList.map((individual) => {
                        const { id, email } = individual;
                        return (
                          <div
                          className="userList-individual" >
                            <div
                             key={id}
                             onClick={()=>handleReceiver({ id, email })}>
                              <p>{email}</p>       
                            </div>
                          </div>
                          
                        )
                    })
                  }
                  { !userList && <div>No users available</div> }
          </ul>
        </nav>
        
      </div>


      {/* Modal for Group Creation */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Channel</h3>
            <input
              className="enter-channel-name"
              type="text"
              placeholder="Enter #channel name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <h4 className="invite-users">Invite Users</h4>

            <div className="user-list">
                {userList.map((user) => (
                <label key={user.uid}>
                  <input
                    className="checkbox"
                    type="checkbox"
                    value={user.uid} // Use UID as the value
                    checked={selectedUsers.includes(user.uid)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedUsers((prev) =>
                        e.target.checked ? [...prev, value] : prev.filter((u) => u !== value)
                      );
                    }}
                  />
                    {user.name || user.email} {/* Display user's name or email */}
                </label>
                  ))}
            </div>

            <button 
             className="create-button"
             onClick={createGroup}>
              Create
            </button>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
    
      )}
      <Chat receiver={receiver}  />
   </div>
   );
  
}

export default Channel;
