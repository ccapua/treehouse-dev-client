import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import ChatBox from './ChatBox';

export default function ChatsList(props) {
  // context:
  const { user, getFriends, friends, socket } = useContext(AppContext);

  // state:
  const [chats, setChats] = useState([]);
  const [chatsList, setChatsList] = useState(<p>Loading . . .</p>);

  if (socket) {
    socket.on('new message', async function () {
      await getChats();
    })
  }

  useEffect(() => {
    async function doStuff () {
      await getChats();
    }

    doStuff();
  }, [friends])

  useEffect(() => {
    for (let i = 0; i < chats.length; i++) {
      socket.join(chats[i].chat_name);
    }
    getChatsList();
  }, [chats]);

  const getChats = async function() {
    let result;

    await fetch('/proxy/get-chats',  {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(
        {
          username: user.username
        }
      )
    })
    .then(results => results.json())
    .then(data => result = data)
    .catch(err => console.error(err));

    setChats(result);
  }

  const getChatsList = async function() {
    if (chats) {
      setChatsList(chats.map((chat, i) => {return <ChatBox id={i} key={i} chat={chat}/>}));
    } else {
      setChatsList(<div>No chats to display!</div>);
    }
  }

  return (
    <div className="chats-list">
      <h3>Chats</h3>
      {chatsList}
    </div>
  );
}
