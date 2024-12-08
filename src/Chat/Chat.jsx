import { useState, useEffect, useRef } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import { IoMdSend } from "react-icons/io";
import '../Chat/Chat.css';
import { IoIosMore } from "react-icons/io";


function Chat({receiver, setReceiver, channel, userList, messages, setMessages, editButton}) {
    const { userHeaders } = useData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reply, setReply] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To manage edit modal
    const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false); 
    const messagesRef = useRef(null); // Reference to the end of the messages list
    const [channelUser, setChannelUser] = useState([]);
    
    const fetchMessages = async () => {
      if (!receiver && !channel ) return; // Don't fetch if no receiver is selected
      setLoading(true);
      setError(null);
      const receiverClass = channel ? "Channel" : "User";
      const receiverId = channel ? channel.id : receiver?.id;

      try {
        const response = await axios.get(
          `${API_URL}/messages?receiver_id=${receiverId}&receiver_class=${receiverClass}`,
          { headers: userHeaders });
          setMessages(response.data.data);
          
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
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight; // Scroll to the bottom of the messages container
        }
      }, [messages]);

      const handleReply = (e) => {
        setReply(e.target.value); // Update state with input value
      };

  // function to send message
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const receiverClass = channel ? "Channel" : "User";
    const receiverId = channel ? channel.id : receiver?.id;
  
    try {
      const messageInfo = {
        receiver_id: receiverId,
        receiver_class: receiverClass,
        body: reply
      };
  
      const response = await axios.post(`${API_URL}/messages`, messageInfo, { headers: userHeaders });
      const { data } = response;
      if (data.data) {
        alert("Message sent!");
        setReply(""); // Clear the input
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleSubmit(e); // Call the submit handler manually
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

  const toggleEmojiModal = () => {
    setIsEmojiModalOpen(!isEmojiModalOpen);
  };

  const addEmojiToInput = (emoji) => {
    setReply((prevReply) => prevReply + emoji);
    setIsEmojiModalOpen(false);
  };


    return (
      
    <div className={`group-window ${loading ? "no-scroll" : ""}`}>
      {receiver || channel ? (
        <>
          <div className="receiver-header-container">
            <h3>
              {channel?.name
                ? `# ${channel.name}`
                : receiver?.email
                ? receiver.email.split("@")[0]
                : "Welcome to Slacking!"}
            </h3>

            {editButton && (
                  <button
                  className="edit-channel-button"
                  onClick={() => setIsEditModalOpen(true)}>
                  <IoIosMore />
                </button>
          )}

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
                              e.target.checked
                                ? [...prev, value]
                                : prev.filter((u) => u !== value)
                            );
                          }}
                        />
                        {user.email}
                      </label>
                    ))}
                  </div>

                  <button className="save-button" onClick={addUserToChannel}>
                    Save
                  </button>
                  <button
                    onClick={handleCancelAddUser}
                    className="cancel-button-editChannel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <div className="messages" ref={messagesRef} >
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    (channel && msg.sender.uid === userHeaders.uid) ||
                    (!channel && msg.sender.email === receiver?.email)
                      ? "sender"
                      : "receiver"
                  }`}
                >
                  <p>
                    {channel && (
                      <strong>{msg.sender.uid.split("@")[0]}: </strong>
                    )}
                    {msg.body}
                    <br />
                    <span className="timestamp">
                      
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",                       
                      })}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p>No messages to display.</p>
            )}

          </div>

          <form className="chat-bar"  onSubmit={handleSubmit}>
            <input
              className="chat-input"
              type="text"
              value={reply}
              onChange={handleReply}
              onKeyDown={handleKeyDown}
            />
              <button onClick={toggleEmojiModal} className="emoji-btn">
              😊
            </button>

            {isEmojiModalOpen && (
              <div className="emoji-modal">
                <div className="emoji-picker">
                  {['😊', '😂', '😍', '😢', '😎', '👍', '🙏', '❤️', '💔'].map((emoji) => (
                    <button
                      key={emoji}
                      className="emoji"
                      onClick={() => addEmojiToInput(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="send-btn">
              <IoMdSend />
            </button>
          </form>
        </>
      ) : (
        null
      )}

      
    </div>
  );
}

export default Chat;