import React, { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import Chat from '../Chat/Chat.jsx';
import '../Channel/Channel.css';

function Channel() {
  const { userHeaders } = useData();
  const [userList, setUserList] = useState([]);

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
  const [groups, setGroups] = useState([
    { name: "# General", members: ["Shaggy Tiny"] },
    { name: "# Batch 37", members: ["Shaggy Tiny", "Alice"] },
  ]);

  const [newGroupName, setNewGroupName] = useState("");
  const [users] = useState(["Alice", "Bob", "Charlie"]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <nav>
          <ul>
            {groups.map((group, index) => (
              <li key={index} className='group-list'>
                <a 
                className='group-name'
                href={`/group/${group.name}`}>{group.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        <button className="create-group-button" onClick={() => setIsModalOpen(true)}>
          + Create Group
        </button>
        
      </div>


      {/* Modal for Group Creation */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Group</h3>
            <input
              
              type="text"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <h4>Invite Users</h4>
            <div className="user-list">
              {users.map((user, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={user}
                    checked={selectedUsers.includes(user)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedUsers((prev) =>
                        e.target.checked ? [...prev, value] : prev.filter((u) => u !== value)
                      );
                    }}
                  />
                  {user}
                </label>
              ))}
            </div>
            <button onClick={createGroup}>Create Channel</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
    
      )}
      
      <Chat />
   </div>
  );
}

export default Channel;
