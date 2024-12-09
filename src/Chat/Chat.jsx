import { useState, useEffect, useRef } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import { IoMdSend } from "react-icons/io";
import '../Chat/Chat.css';
import { IoIosMore } from "react-icons/io";

function Chat({ receiver, setReceiver, channel, userList, messages, setMessages, editButton }) {
  const { userHeaders } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [filteredUsers, setFilteredUsers] = useState(userList); // Filtered user list
  const [channelUser, setChannelUser] = useState([]);
  const messagesRef = useRef(null);

  useEffect(() => {
    // Filter users when searchTerm changes
    setFilteredUsers(
      userList.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, userList]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  const fetchMessages = async () => {
    if (!receiver && !channel) return;
    setLoading(true);
    setError(null);
    const receiverClass = channel ? "Channel" : "User";
    const receiverId = channel ? channel.id : receiver?.id;

    try {
      const response = await axios.get(
        `${API_URL}/messages?receiver_id=${receiverId}&receiver_class=${receiverClass}`,
        { headers: userHeaders }
      );
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
  }, [channel, receiver, userHeaders]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleReply = (e) => {
    setReply(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const receiverClass = channel ? "Channel" : "User";
    const receiverId = channel ? channel.id : receiver?.id;

    try {
      const messageInfo = {
        receiver_id: receiverId,
        receiver_class: receiverClass,
        body: reply,
      };

      const response = await axios.post(`${API_URL}/messages`, messageInfo, { headers: userHeaders });
      if (response.data.data) {
        alert("Message sent!");
        setReply("");
        fetchMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addUserToChannel = async (e) => {
    e.preventDefault();
    try {
      const newUserData = {
        id: channel.id,
        member_id: Number(channelUser),
      };
      const response = await axios.post(`${API_URL}/channel/add_member`, newUserData, { headers: userHeaders });

      if (response.data) {
        alert("User added successfully!");
        setIsEditModalOpen(false);
        setChannelUser("");
      }
    } catch (error) {
      alert(error.response?.data?.errors || "User is already in the channel.");
    }
  };

  const handleCancelAddUser = () => {
    setIsEditModalOpen(false);
    setChannelUser("");
  };

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
                onClick={() => setIsEditModalOpen(true)}
              >
                <IoIosMore />
              </button>
            )}

            {isEditModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3>#{channel.name}</h3>
                  <h4>Add Users</h4>

                  {/* Search Bar */}
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  <div className="user-list">
                    {filteredUsers.map((user) => (
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

                  <button className="save-button" onClick={addUserToChannel} disabled={channelUser.length === 0}>
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

          <div className="messages" ref={messagesRef}>
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

          <div className="chat-bar">
            <input
              className="chat-input"
              type="text"
              value={reply}
              onChange={handleReply}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent the default form submission behavior
                  handleSubmit(e);
                }
              }}
            />
            <button onClick={toggleEmojiModal} className="emoji-btn">
              😊
            </button>

            {isEmojiModalOpen && (
              <div className="emoji-modal">
                <div className="emoji-picker">
                  {["😊", "😂", "😍", "😢", "😎", "👍", "🙏", "❤️", "💔"].map(
                    (emoji) => (
                      <button
                        key={emoji}
                        className="emoji"
                        onClick={() => addEmojiToInput(emoji)}
                        type="button"
                      >
                        {emoji}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <button 
            className="send-btn"
            onClick={handleSubmit} 
            >
              <IoMdSend />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Chat;
