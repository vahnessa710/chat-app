import { useState, useEffect, useRef } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import { IoMdSend } from "react-icons/io";
import '../Chat/Chat.css';
import { IoIosMore } from "react-icons/io";


function Chat({receiver, channel, userList, messages, setMessages}) {
    const { userHeaders } = useData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [reply, setReply] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To manage edit modal
    const messagesEndRef = useRef(null); // Reference to the end of the messages list
    const [channelUser, setChannelUser] = useState([]);

    console.log('receiver', receiver)
    console.log('channel', channel)

    const fetchMessages = async () => {
      if (!receiver && !channel ) return; // Don't fetch if no receiver is selected
      setLoading(true);
      setError(null);
      const receiverClass = channel ? "Channel" : "User";
      const receiverId = channel ? channel.id : receiver?.id;

      try {
        const response = await axios.get(`${API_URL}/messages?receiver_id=${receiverId}&receiver_class=${receiverClass}`,
          { headers: userHeaders });
          setMessages(response.data.data); // Assuming messages are in `data` field
          
      } catch (err) {
          setError("Failed to fetch messages. Please try again.");
      } finally {
          setLoading(false);
      }
      
    };
      useEffect(() => {     
        setMessages([]);
        fetchMessages();        
      }, [channel, receiver, userHeaders]); // Re-fetch messages when receiver changes

      useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
      }, [messages]);

      const handleReply = (e) => {
        setReply(e.target.value); // Update state with input value
      };

  // function to send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const receiverClass = channel ? "Channel" : "User";
    const receiverId = channel ? channel.id : receiver?.id;
    try{
        const messageInfo = {
            receiver_id: receiverId,
            receiver_class: receiverClass,
            body: reply
        }
        
        const response = await axios.post(`${API_URL}/messages`, messageInfo, { headers: userHeaders});
        const { data } = response;
        if(data.data){
             alert("Message sent!");
            setReply(""); // Clear the input
            fetchMessages(); // Refresh messages
        }
          } catch(error){
              console.log(error);
          } 
          
      };

 // function to Add User to existing channel
  const addUserToChannel = async (e) => {
    e.preventDefault();
    try {
      const newUserData = { 
        id: channel.id,
        member_id: Number(channelUser)
      };
      console.log('newUserData:', newUserData)
      const response = await axios.post(`${API_URL}/channel/add_member`, newUserData, {headers: userHeaders});

      if (response.data) {
        alert("User added successfully!");
        setIsEditModalOpen(false);
        setChannelUser("");
      }
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.errors || "user is already in the channel.");
    }
    
  }
  
  const handleCancelAddUser = () => {
    setIsEditModalOpen(false);
    setChannelUser("");
  }

  return (
    <div className="group-window">
        {receiver || channel ? (
        <>
          <div className="receiver-header-container">
          <h3>
            {channel?.name
              ? `# ${channel.name}`
              : receiver?.email
              ? receiver.email.split("@")[0]
              : "Select a user or channel"}
          </h3>

          <button 
            className="edit-channel-button"
            onClick = {()=>setIsEditModalOpen(true)}
          >
           <IoIosMore />
          </button>

{/* modal to ADD USERS inside the current channel */}
{isEditModalOpen && (
                      <div className="modal">
                        <div className="modal-content">
                          <h3>#{channel.name}</h3>
                          <h4>Add Users</h4>

                          <div className="user-list">
                              {userList.map((user) => (
                              <label key={user.uid}>
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  value={String(user.id)}
                                  checked={channelUser.includes(String(user.id))}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setChannelUser((prev) =>
                                      e.target.checked ? [...prev, value] : prev.filter((u) => u !== value)
                                    );
                                  }}
                                  />
                                {user.email}
                              </label>
                                ))}
                          </div>
                        
                        <div className="edit-channel-btn-container">
                          <button
                              className="save-button"
                              onClick={addUserToChannel}>
                              Save
                          </button>
                          <button
                              onClick={handleCancelAddUser}
                              className="cancel-button-editChannel">
                              Cancel
                          </button> 
                        </div>
                        
                        
                      </div>
                    </div>
)}

</div> 

{loading && <p>Loading messages...</p>}
{error && <p className="error">{error}</p>}
<div className="messages">

  {messages.length > 0 ? (
    messages.map((msg) => (
      <div 
        key={msg.id} 
        className={`message 
          ${
            (channel && msg.sender.uid === userHeaders.uid) || // Check if it's a channel message and the current user is the sender
            (!channel && msg.sender.email === receiver?.email) // Check if it's a direct message and the sender matches the receiver's email
              ? 'sender' 
              : 'receiver'
          }`}
          >
          <p>
            {channel && <strong>{msg.sender.uid.split("@")[0]}: </strong>}
            {msg.body}
            <br />
            <span className="timestamp">
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </p>
      </div>
    ))
  ) : (
    <p>No messages to display.</p>
  )}

  {/* Invisible div to scroll to */}
  <div ref={messagesEndRef} />

</div>
        
   <div className = "chat-bar">
        <input
        className="chat-input"
        type="text"
        value={reply} // Controlled input
        onChange={handleReply} // Update state on input change
        />

        <button
            onClick = {handleSubmit}
            className = 'send-btn'>
            <IoMdSend />
        </button>    
     </div>
     </>       
      ) : (
        <p>Select a user or channel to view messages.</p>
      )}

</div> 


)};

export default Chat;