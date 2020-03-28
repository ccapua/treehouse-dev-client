import React, { Component } from 'react';

const ChatMessage = (props) => {
  return ( 
    <div className="chat-message">
      <div className="profile-picture">
        <img src="https://placehold.it/25x25"/>
        <span>{props.username}</span>
      </div>
      <div className="message-content">
        {props.message_content}
      </div>
    </div>
  );
}
 
export default ChatMessage;