import { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import '../Chat/Chat.css';
function Chat({receiver, channel}) {
    const { userHeaders } = useData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('')
    const [channelMessages, setChannelMessages] = useState([]);
    
    const fetchMessages = async () => {
        if (!receiver || !receiver.id) return; // Don't fetch if no receiver is selected
        setLoading(true);
        setError(null);

        const receiverClass = "User"; // Determine receiver type

        try {
          const response = await axios.get(`${API_URL}/messages?receiver_id=${receiver.id}&receiver_class=${receiverClass}`,
            { headers: userHeaders });
            setMessages(response.data.data); // Assuming messages are in `data` field
            
        } catch (err) {
            setError("Failed to fetch messages. Please try again.");
        } finally {
            setLoading(false);
        }
        console.log("Fetching messages with parameters:", {
            receiver_id: receiver,
            receiver_class: "User",           
          });
          console.log("Headers:", userHeaders);
      };
    
      useEffect(() => {
        fetchMessages();
      }, [receiver]); // Re-fetch messages when receiver changes

      const handleReply = (e) => {
        setReply(e.target.value); // Update state with input value
      };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const messageInfo = {
            receiver_id: receiver.id,
            receiver_class: "User",
            body: reply
        }
        
        const response = await axios.post(`${API_URL}/messages`, messageInfo, { headers: userHeaders});
        const { data } = response;
        if(data.data){
            return alert("message sent!")
        }
          } catch(error){
              console.log(error);
          } 
          
      };
   
  return (
    <div className="group-window">
        {receiver ? (
        <>
          <div className="receiver-header-container">
            <h3>
              {receiver?.email|| "wrong move"}
            </h3>
          </div> 
          {/* {loading && <p>Loading messages...</p>} */}
          {error && <p className="error">{error}</p>}
          <div className="messages">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender.email === receiver?.email ? 'receiver' : 'sender'}`}>
                  <p>
                    <strong>{msg.sender.email}</strong>: {msg.body}
                  </p>
            </div>
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
        </>
      ) : (
        <p>Select a user or channel to view messages.</p>
      )}

      <div>
        {channel ?(<div><p>!!!!!!!!!!!!!!!!Display {channel} Number here!!!!!!!!!!!!!</p></div>): null}
        

            
      </div>

     
     
     <div className = "chat-bar">
        <input
        type="text"
        value={reply} // Controlled input
        onChange={handleReply} // Update state on input change
        />

        <button
            onClick = {handleSubmit}>
            <IoMdSend />
        </button>    
     </div>
       
          
        </div>
                

  
  );
}

// export default Chat;

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
  const [channel, setChannel] = useState(null);
  const [channelList, setChannelList] = useState ([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // toggle window for creating new channel
  const [newGroupName, setNewGroupName] = useState(""); // new channel name
  const [receiver, setReceiver] = useState(null);
  

  const handleReceiver = ({ id, email }) => {
    setReceiver({ id, email }); // Store both id and email
    console.log(receiver)
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

  const getChannelList = async () => {
    try {
      const response = await axios.get(`${API_URL}/channels`, { headers: userHeaders });
      const channels = response.data.data;
      setChannelList(channels);
    } catch (error) {
      if(error.response.data.errors) {
        return alert("Cannot get channels");
      }
    }
  }
  useEffect(() => {
    if(channelList.length === 0) {
      getChannelList();
    }
  })

  const handleChannel = ( id) => {
    setChannel( id ); // Store both id and name
 
  };
  




  const createGroup = () => {
    if (newGroupName.trim()) {
      
    }
  };

  return (
    
    <div className="dashboard-container">

      <div className="channel-bar">

        <h2 className="channel-header">Channel</h2>
            
              <ul className="channel-list-container">

                {channelList.map((channel, index) => (
                  <li 
                    key={index} 
                    className='group-list'
                   >
                    <a 
                      className='group-name'
                      href="#"
                      onClick={() => handleChannel(channel.id)}>
                      {`# ${channel.name}`}
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
      <Chat receiver={receiver} channel={channel} />
   </div>
   );
  
}

// export default Channel;

value={String(user.id)}
                    checked={selectedUsers.includes(String(user.id))}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedUsers((prev) =>
                        e.target.checked ? [...prev, value] : prev.filter((u) => u !== value)
                      );
                    }}