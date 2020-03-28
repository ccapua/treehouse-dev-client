import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const AppContext = createContext();

const AppContextProvider = (props) => {

  //==== SOCKET ==========================================
  const [loggedIn, setLoggedIn] = useState(null);
  const [socket, setSocket] = useState(null);

  //creating socket connection:
  useEffect(() => {
    loggedIn && setSocket(io('localhost:3000/'));
  }, [loggedIn]);

  // handling socket events:
  useEffect(() => {
    const listenForEvents = function() {
      socket.emit('add_id', user);

      socket.on('friend-request', () => {
        getNotifications();
      });

      socket.on('friend-accept', () => {
        getNotifications();
      });

      socket.on('chat-message', data => {
        console.log(data);
      });

      socket.on('get users', function(data) {
        console.log(data);
      });
    }

    if (loggedIn && socket && user) listenForEvents();
  });

  //socket cleanup:
  window.addEventListener("beforeunload", () => {
    socket.disconnect();
  });

  //==== LOG IN / LOG OUT =========================================

  const [user, setUser]= useState(null);

  const login = function(user) {
    setUser(user);
    setLoggedIn(true);
  };

  const logout = function() {
    fetch("proxy/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    setLoggedIn(false);
    let keys = Object.keys({user});
    for (let i = 0; i < keys.length; i++) {
      delete {user}[keys[i]];
    }
    socket.disconnect();
  };

  //==== NOTIFICATIONS ==================================
  
  const [addResult, setAddResult] = useState();
  const [notifications, setNotifications] = useState(null);
  const [noOfNotifications, setNoOfNotifications] = useState(null);

  // keeping track of no of notifications:
  useEffect(() => {
    if (notifications) setNoOfNotifications(notifications.length);   
    else setNoOfNotifications(0);
  }, [notifications]);

  const addFriend = async function(friend) {
    let result;

    await fetch('/proxy/add-friend',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        user: user.username,
        friend: friend
      })
    })
    .then(res => {
      if (res) result = res;
    })
    .catch(err => console.error(err));

    setAddResult(result);
    sendNotification("friend-accept", friend);
  }

  const getNotifications = async function () {
    var result;

    await fetch('/proxy/get-notifications-update', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        },
        body: JSON.stringify({ username: user.username })
      }
    )
    .then(res => res.json())
    .then(data => result = data)
    .catch(err => console.error(err));

    await setNotifications(result);
  }

  const removeNotification = async function(notification) {
    let result; 

    await fetch('/proxy/remove-notification',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          user: user.username,
          notification: notification
        })
      }
    )
    .then(res => {
      if (res.ok)  result = true;
    })
    .catch(err => console.error(err));

    return result;
  }

  const sendNotification = function(type, recipient) {
    if (recipient.socketId) {
      socket.to(recipient.socketId).emit(type);
    }
  }
  // ==== FRIENDS LIST ===========================

  const [friends, setFriends] = useState();

  const getFriends = async function(username) {
    let result;

    await fetch('/proxy/get-friends/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify({username: username})
    })
    .then(res => res.json())
    .then(data => {
      if (data) {
        result = data;
      } else {
        result = false;
      }
    })
    .catch(err => console.error(err));

    await setFriends(result);
  }

  //==== FRIEND CARD BUTTONS ===============================

  const [friendToRemove, setFriendToRemove] = useState();
  const [popup, setPopup] = useState();
  const [chatName, setChatName] = useState();
  const [dashboardDisplay, setDashboardDisplay] = useState("home");

  const changePopup = function(type, friend) {
    var popupEl = document.getElementById("popup");
    setPopup(type);
    popupEl.dataset.state = "show";
    if (friend) setFriendToRemove(friend);
  }

  const removeFriend = async function() {
    let result;

    await fetch('/proxy/remove-friend/',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(
        {
          friend: friendToRemove,
          user: user.username
        }
      )
    })
    .then(res => result = res)
    .catch(err => console.error(err));

    await getFriends(user.username);
    return result;
  }

  //==== CHAT PAGE =====================================

  const [chatInfo, setChatInfo] = useState();

  useEffect(() => {
    getChatInfo();
  }, [chatName])

  const getChatInfo = async function() {
    let result; 

    if (user) {
      await fetch('/proxy/get-chats',  {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(
        {
          username: user.username,
          chat_name: chatName
        }
      )
    })
    .then(results => results.json())
    .then(data => result = data)
    .catch(err => console.error(err));

    setChatInfo(result);
  }
  }

  const getMessages = async function(chatName) {
    let result;

    await fetch('proxy/get-messages/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify({chat_name: chatName})
    })
    .then(results => result = results)
    .catch(err => console.error(err));

    return result;
    
  }

  const sendMessage = async function(message, recipient) {
    let result;

    await fetch('proxy/send-message', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(
        {
          sender: user.username,
          recipient: recipient,
          message: message
        }
      )
    })
    .then(results => result = results)
    .catch(err => console.error(err));
  }

  //===== UNUSED =====================================

  // get user update for whatever reason: 
  const getUserUpdate = async function() {
    let result;

    await fetch('./proxy/get-user-update', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json'
      },
      body: JSON.stringify({username: user.username})
    })
    .then(results => result = results)
    .catch(err => console.error(err));

    return result;
  }

  //====================================================

  //render:
  return ( 
    < AppContext.Provider value={{ 
      setNoOfNotifications, noOfNotifications, getNotifications, notifications,
      sendNotification, removeFriend, removeNotification, addFriend,
      friends, getFriends,
      user, loggedIn, login, logout, socket,
      getMessages, sendMessage, chatName, setChatName, chatInfo, getChatInfo, setChatInfo,
      popup, dashboardDisplay, setDashboardDisplay, changePopup, 
    }}>
      {props.children}
    </AppContext.Provider>
   );
}
 
export default AppContextProvider;