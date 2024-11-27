import React, { useState } from 'react';
import './Chat.css'; 
function Chat() {
    const chats = [
        { id: 1, name: "Alice", message: "Hey, how are you?", time: "2:30 PM" },
        { id: 2, name: "Bob", message: "Let's catch up tomorrow!", time: "1:45 PM" },
        { id: 3, name: "Charlie", message: "Don't forget the meeting.", time: "12:00 PM" },
      ];
    
    return(
        <>
   
    <section className="chat-list">
      <h4>Your Recent Chats</h4>
      {chats.map((chat) => (
        <div key={chat.id} className="chat-item">
          <div className="chat-avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${chat.name}`}
              alt={`${chat.name} avatar`}
            />
          </div>
          <div className="chat-details">
            <div className="chat-header">
              <span className="chat-name">{chat.name}</span>
              <span className="chat-time">{chat.time}</span>
            </div>
            <p className="chat-message">{chat.message}</p>
          </div>
        </div>
      ))}
    </section>

    </>
    
    )
}

export default Chat;