import { useState , useEffect } from "react";
import { useData } from "../context/DataProvider";
import '../Profile/Profile.css'
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { RiGroup2Fill } from "react-icons/ri";

function Profile({receiver, channel, userList, messages, setMessages}) {
 const { userHeaders } = useData();
 const [searchWindow, setSearchWindow] = useState(false);
 const [searchKeyword, setSearchKeyword] = useState(""); // State for search keyword
 const [filteredMessages, setFilteredMessages] = useState([]); // State for filtered messages
 const [isTyping, setIsTyping] = useState(false);

 const [displayChannelUsers, setDisplayChannelUsers] = useState([]);
   // Generate initials for receiver
   const initials = receiver?.email
   ? receiver.email
       .split("@")[0] // Get part before @
       .split(".") // Split by dots if multiple parts (e.g., john.doe)
       .map((part) => part.charAt(0).toUpperCase()) // Get the first letter of each part
       .join("") // Join them together (e.g., JD)
   : null;
 
   useEffect(() => {
        setSearchKeyword(""); // Clear the search input
        setFilteredMessages([]); // Clear filtered messages
        setSearchWindow(false); // Hide the search window
        setIsTyping(false);
      }, [receiver, channel]); // Runs when the receiver or channel changes

        useEffect(() => {
        if (searchKeyword.trim() === "") {
        setFilteredMessages([]); // Clear filtered messages
        setSearchWindow(false); // Hide the search window
        }
        }, [searchKeyword]);

  // Function to handle search
  const handleSearch = () => {
        if (searchKeyword.trim() === "") {
          setFilteredMessages([]);
          setSearchWindow(false);
        } else {
          const lowercasedKeyword = searchKeyword.toLowerCase();
          const results = messages.filter((msg) =>
            msg.body.toLowerCase().includes(lowercasedKeyword)
          );
          setFilteredMessages(results);
          setSearchWindow(true);
        }
        setIsTyping(false); // User has pressed Enter
      };
      

      const handleInputChange = (e) => {
        setSearchKeyword(e.target.value);
        setIsTyping(true); // User is typing
      };


    return(
    <>  
    <div className="profile-container">
    
    {receiver && (
        <>
        <div className="profile-initials">
                {/* Display initials in a styled circle */}
                {initials ? (
                <div className="initials-circle">{initials}</div>
                ) : (
                <p>No Receiver Selected</p>
                )}
        </div>

       <p className="profile-name">
               {channel?.name
               ? `#${channel.name}`
               : receiver?.email
               ? receiver.email.split("@")[0]
               : "Select a user or channel"}
       </p>
                
       <p className="email-name">
                <span className="email-icon" >
                <MdEmail/> 
                </span>
               {channel?.name
                        ? `#${channel.name}`
                        : receiver?.email
                        ? receiver.email
                        : "Select a user or channel"}
       </p>

       <p className="phone-name">
                <span className="phone-icon" >
                <FaPhoneAlt />
                </span>
               {channel?.name
                        ? `#${channel.name}`
                        : receiver?.id
                        ? receiver.id
                        : "Select a user or channel"}
       </p>
       
        <div className="search-bar-with-icon">
        <span className="magnifying-glass"><BsSearch /></span>
        <input
                type = "text"
                className="search-conversation-bar"
                placeholder="Search in conversation" 
                value={searchKeyword}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                        if (e.key === "Enter") {
                        handleSearch();
                        }
                }}
                />
        </div>
       
        </>
    )}
   
   {(isTyping || searchWindow) && (
  <div className="messages">
    {isTyping && <p className="press-enter-caption">Press "Enter" to search.</p>}
    {searchWindow &&
      (filteredMessages.length > 0 ? (
        filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              
              ( msg.sender.email === receiver?.email)
                ? "sender"
                : "receiver"
            }`}
          >
            <p>
              {channel && <strong>{msg.sender.uid.split("@")[0]}: </strong>}
              {msg.body}
              <br />
              <span className="timestamp">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p>No messages match your search.</p>
      ))}
  </div>
)}

{channel && (<>
        <div className="profile-initials">
                {/* Display initials in a styled circle */}
                {initials ? (
                <div className="initials-circle">{initials}</div>
                ) : (
                null
                )}
        </div>
 

       <p className="phone-name">
                <span className="phone-icon" >
                <RiGroup2Fill />
                </span>
               {channel?.name
                        ? `${channel.name}`
                        : receiver?.id
                        ? receiver.id
                        : "Select a user or channel"}
       </p>
       
        <div className="search-bar-with-icon">
        <span className="magnifying-glass"><BsSearch /></span>
        <input
                type = "text"
                className="search-conversation-bar"
                placeholder="DISPLAY USER BELOW" 
                value={searchKeyword}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                        if (e.key === "Enter") {
                        handleSearch();
                        }
                }}
                />
        </div>
</>)}
        
    </div>
        
    </>)
}

export default Profile;