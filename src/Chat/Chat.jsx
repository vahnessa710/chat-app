import { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import '../Chat/Chat.css';
function Chat({receiver}) {
    const { userHeaders } = useData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('')

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
          {loading && <p>Loading messages...</p>}
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

export default Chat;
