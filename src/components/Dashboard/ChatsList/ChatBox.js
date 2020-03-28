import React, { useState, useEffect, useContext } from 'react';
import { Socket } from 'dgram';
import { AppContext } from '../../../contexts/AppContext';

const ChatBox = (props) => {
  // context:
  const { setDashboardDisplay, setChatName, chatInfo, getChatInfo, setChatInfo } = useContext(AppContext);
  
  // state
  const [chat] = useState(props.chat);
  const [recentMessage, setRecentMessage] = useState('');
  const [recentMessageDisplay, setRecentMessageDisplay] = useState();

  // effect:
  useEffect(() => {
    mostRecentMessage();
    if (!chatInfo) getChatInfo();
  }, [])

  useEffect(() => {
    getRecentMessageDisplay();
  }, [recentMessage])

  // gets most recent message and displays it
  const mostRecentMessage = async function() {
    let result;

    await fetch('/proxy/get-messages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify({chat_name: chat.chat_name})
    })
    .then(results => results.json())
    .then(data => result = data)
    .catch(err => console.error(err));

    if (result) {
      setRecentMessage(result[result.length - 1]);
    }
  }

  const getRecentMessageDisplay = function() {
    if (recentMessage) {
      setRecentMessageDisplay(
        <div className="recent">
          <div>Most recent message</div><br/>
          <div className="recent-message">{recentMessage.username}: {recentMessage.message_content}</div>
          <div className="recent-timestamp">{new Date(recentMessage.message_timestamp).toLocaleString({hour12: true})}</div>
        </div>
      )
    } else {
      setRecentMessageDisplay(<div>No messages to display</div>);
    }
  }

  return ( 
    <div className="chat-box" onClick={() => {setChatName(chat.chat_name); setChatInfo(chat); setDashboardDisplay('message'); }}>
      <div className="chat-name">{chat.chat_name}</div>
      <div className="chat-users">{chat.users.join(', ')}</div>
      <hr/>
      {recentMessageDisplay}
      
    </div>
   );
}
 
export default ChatBox;