import { useState , useEffect } from "react";
import '../Profile/Profile.css'
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { RiGroup2Fill } from "react-icons/ri";

function Profile({
  receiver, 
  setReceiver, 
  channel, 
  setChannel, 
  messages, 
  userList, 
  channelDetails, 
  channelMembers, 
  setChannelMembers}) {
 const [searchWindow, setSearchWindow] = useState(false);
 const [searchKeyword, setSearchKeyword] = useState(""); // State for search keyword
 const [filteredMessages, setFilteredMessages] = useState([]); // State for filtered messages
 const [isTyping, setIsTyping] = useState(false);
 const [memberEmail, setMemberEmail] = useState('');
 console.log('Profile Props, channelDetails:', channelDetails)
 console.log('Profile Props, receiver:', receiver)

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
        setChannelMembers([]);
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

    

     // Function to get the email of a member based on the user_id match
const getMemberEmail = () => {
  // Iterate over the channelMembers array
  for (let member of channelMembers) {
    // Find the user in userList where the IDs match
    const user = userList.find((user) => user.id === member.user_id);
    if (user) {
      setMemberEmail(user.email); // Set the member email if a match is found
      return; // Exit the function once the match is found
    }
  }
  // If no match is found, set memberEmail to an empty string or handle as needed
  setMemberEmail('');
};

const handleChannelMemberClick = (user) => {
  setReceiver(user) // Update the receiver for direct messaging
  setChannel(null)
  console.log('Receiver set to:', user); // Debug log
};

useEffect(() => {
  getMemberEmail();
}, [userList, channelMembers]);

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
           <BsSearch
           className="magnifying-glass" />
          <input
                  type = "text"
                  className="search-conversation-bar"
                  placeholder="Search in conversation" 
                  value={searchKeyword}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                          if (e.key === "Enter") {
                          handleSearch();
                          setIsTyping(false)
                          }
                  }}
                  />
        </div>
       
        </>
    )}
{isTyping && (<p className="press-enter-caption">Press "Enter" to search.</p>)}
{(searchWindow) && (

            <div className="filtered-messages">
             
              {searchWindow &&
                (filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`filtered-message ${
                        
                        ( msg.sender.email === receiver?.email)
                          ? "sender"
                          : "receiver"
                      }`}
                    >
                      <p>
                        {receiver?.id && <strong>{msg.sender.uid.split("@")[0]}: </strong>}
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
                  <p className="no-msg-match">No messages match your search.</p>
                  
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
                <div className="group-icon" >
                <RiGroup2Fill />
                </div>
                <div className="group-name-profile">
                {channel?.name
                        ? `${channel.name}`
                        : receiver?.id
                        ? receiver.id
                        : "Select a user or channel"}
                </div>
               
       </p>
       
       
{channel && channelMembers?.length > 0 ? (
  <>
    <p 
      className="chat-members-header"
      data-testid ="chatWord">
      Chat members:
    </p>
    
    <div className="memberList-container">
        {channelMembers.map((channelIndividual) => {
          const { user_id } = channelIndividual; // Extract user_id
          // Find the corresponding user in userList
          const user = userList.find((u) => u.id === user_id);
          return (  
              <div key={channelIndividual.id} className="memberList-individual">
                <div 
                className="memberList-email-id-container"
                onClick= {() => handleChannelMemberClick(user)}
                >
                <p><MdEmail/> {user ? `${user.email}` : "Email not found"}</p>
                <p><FaPhoneAlt />{`${user_id}`} </p>
                </div> 
              </div>
          );
        })}
    </div>
  </>
) : (
  null
)}
      
</>)}
        
    </div>
        
    </>)
}

export default Profile;