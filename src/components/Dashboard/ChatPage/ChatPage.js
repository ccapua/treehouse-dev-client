import React, { useState, useContext, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { AppContext } from '../../../contexts/AppContext';
import AddUserBox from './AddUserBox.js';

const ChatPage = (props) => {

  // state:
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState();
  const [messagesList, setMessagesList] = useState();
  const [addUserDisplay, setAddUserDisplay] = useState();

  // context: 
  const { socket, user, chatName, chatInfo, getChatInfo} = useContext(AppContext);

  socket.on('new message', function() {
    console.log('y');
    getMessages();
  })

  // effect:
  // get messages and chatinfo on first load:
  useEffect(() => {
    if (chatName) {
      socket.emit('join', chatName);
      getMessages();
    }
    if (!chatInfo) {
      getChatInfo();
    }    
  }, []);

  useEffect(() => {
    getMessagesList();
  }, [messages]);

  // getting messages:
  const getMessages = async function() {
    let result;

    await fetch('/proxy/get-messages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify({chat_name: chatName})
    })
    .then(results => results.json())
    .then(data => result = data)
    .catch(err => console.error(err));

    setMessages(result);
  }

  // sending messages:
  const sendMessage = async function(e) {
    e.preventDefault();
    let users, result;
    if (!chatInfo) {
      users = chatName.split('-')
    } else {
      users = chatInfo.users;
    }

    if (message) {
      let newArr;

      await fetch('/proxy/send-message',  {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        },
        body: JSON.stringify(
          {
            chat_name: chatName,
            username: user.username,
            message_content: message,
            users: users
        })
      })
      .then(results => result = results)
      .catch(err => console.error(err));

      socket.emit('chat-message', {
        username: user.username,
        chat_name: chatName,
        message_content: message
      });
  
      setMessage('');
      getMessages();
    }
  }

  // formatting messages for display
  const getMessagesList = function() {
    if (messages) {
      setMessagesList(messages.map((message, i) => {
        return <ChatMessage
          key={i}
          id={i} 
          username={message.username}
          message_content={message.message_content}
        />
      }));
    }
  }

  const closeAddUser = function() {
    setAddUserDisplay();
  }

  return ( 
    <div className="chat-page">
      <div className="chat-buttons">
        <i className="material-icons" onClick={e => {setAddUserDisplay(<AddUserBox close={closeAddUser}/>)}}>add</i>
        <i className="material-icons" onClick={e => {return;}}>info</i>
      </div>
      {addUserDisplay}
      <div className="chat-area">
        
        {messagesList}
      </div>
      <form autoComplete="off" id="myForm" onSubmit={e => {sendMessage(e); document.getElementById('myForm').reset()}}>
        <input
          type="text" 
          name="message" 
          onChange={e => setMessage(e.target.value)}
        />
        <input 
          type="submit" 
          value="Send"
        />
      </form>
    </div>
   );
}
 
export default ChatPage;