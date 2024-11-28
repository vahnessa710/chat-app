import React, { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import Chat from '../Chat/Chat.jsx';
import '../Channel/Channel.css';
import { IoMdSend } from "react-icons/io";

function Channel() {
  const { userHeaders } = useData();
  const [userList, setUserList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(["Batch 37"]); // Track selected group
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState({}); // Messages for each group
  const [newMessage, setNewMessage] = useState(""); // New message input

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
    { name: "General" },
    { name: "Batch 37" },
  ]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const payload = {
          group: selectedGroup, // Assuming the API requires a group/channel name
          content: newMessage, // Message text
          sender: "You", // Replace with the actual sender information if needed
        };
  
        // Send the message to the API
        const response = await axios.post(`${API_URL}/messages`, payload, { headers: userHeaders });
        
        const { data } = response; // Assuming the API returns the message details
        const { sender, content, timestamp } = data; // Adjust these fields based on your API response
  
        // Update local state with the new message
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedGroup]: [
            ...(prevMessages[selectedGroup] || []),
            { sender, content, time: new Date(timestamp).toLocaleTimeString() },
          ],
        }));
        setNewMessage(""); // Clear the input field
      } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        alert("Failed to send message. Please try again.");
      }
    }
  };

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
                  <li key={index} className='group-list'>
                    <a 
                    className='group-name'
                    href="#"
                    onClick={() => setSelectedGroup(group.name)}>
                    {`# ${group.name}`}</a>
                  </li>
                ))}
                
              </ul>
            

        <button className="create-group-button" onClick={() => setIsModalOpen(true)}>
          + Create Channel
        </button>

        <h2 className="dm-header">Direct messages</h2>
        <nav>
          <ul className="userList-container">


            {
                    userList &&
                    userList.map((individual) => {
                        const { id, email } = individual;
                        return (
                          <div
                          className="userList-individual" >
                            <div
                             key={id}>
                              {/* <p>ID: {id}</p> */}
                              <p>{email}</p>
                            </div>
                          </div>
                          
                        )
                    })
                  }
                  { !userList && <div>No users available</div> }
          </ul>
        </nav>

        <button className="create-group-button" onClick={() => setIsModalOpen(true)}>
          + Create Channel
        </button>
        
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
      
        {/* Conditionally Render Based on Selected Group */}

        {selectedGroup ? (
                        <div className="group-window">

                            <h3>Welcome to {`#${selectedGroup}`}</h3>

                              {/* <button 
                                onClick={() => setSelectedGroup(null)} 
                                className="back-button">
                                Back to Channels
                              </button> */}
            
                                {/* Display Messages */}
                               <div className="message-list">

                                    {(messages[selectedGroup] || []).map((message, index) => (
                                      <div key={index} className="message-item">
                                        {message.sender}: {message.content} ({message.time})
                                      </div>
                                    ))}

                                    {/* Send Message */}
                                    <div className="message-input">
                                        <input
                                          type="text"
                                          value={newMessage}
                                          placeholder="Type your message..."
                                          onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button 
                                          onClick={sendMessage}>
                                          <IoMdSend />
                                        </button>
                                    </div>

                                </div>
                        </div>
      ) : (
        <div className="chat-list">
        <h4>Your Recent Channels</h4>
        <p>Select a group to start chatting</p>
      </div>
    )}
      
   </div>
  );
}

export default Channel;
