import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';

const AddUserBox = (props) => {

  // context:
  const { friends, getFriends, user, chatName, chatInfo, getChatInfo } = useContext(AppContext);

  // state:
  const [friendsDisplay, setFriendsDisplay] = useState();
  const [selected, setSelected] = useState();

  // effect:

  useEffect(() => {
    getFriendsDisplay();
  }, [])

  const addUsers = async function() {
    if (selected) {
      let result;
      await fetch('/proxy/add-users-to-chat/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          chat_name: chatName,
          users: selected
        })
      })
      .then(results => results.json())
      .then(data => result = data)
      .catch(err => console.error(err));
    }
  }

  const getFriendsDisplay = async function() {
    if (!friends) await getFriends(user.username);
    if (!chatInfo) await getChatInfo();

    if (friends) {
      let currentFriend;
      let result;
      let friendsInfo = [];
      friends.sort();

      for (let i = 0; i < friends.length; i++) {
        if (friends[i].user_1 === user.username) {
          currentFriend = friends[i].user_2;
        } else {
          currentFriend = friends[i].user_1;
        }

        if (chatInfo.users.includes(currentFriend)) {
          friendsInfo.push('');
          continue;
        } else {
          await fetch('/proxy/get-user-update', {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({username: currentFriend})
          })
          .then(results => results.json())
          .then(data => result = data)
          .catch(err => console.error(err));
  
          friendsInfo.push(result);
        }
      }

      setFriendsDisplay(friends.map((friend, i) => {
        if (friend !== '') {
          return <div 
            className="add-user-friends-button" 
            key={i}
            i={i}
            onClick={(e) => {selectUser(e, friend)}}
          >
            {friendsInfo[i].name}
          </div>
        } else {
          return
        }})
      );
    }
  }

  const selectUser = function(e, friend) {
    let currentFriend;
    let newArr = [];

    if (friend.user_1 === user.username) {
      currentFriend = friend.user_2;
    } else {
      currentFriend = friend.user_1;
    }

    if (selected && selected.includes(currentFriend)) {
      e.target.style.backgroundColor = "";
      newArr = [...selected];
      newArr.splice(newArr.indexOf(currentFriend), 1);
    } else {
      if (selected && selected.length > 0) newArr = [...selected];
      newArr.push(currentFriend);
      newArr.sort();
      e.target.style.backgroundColor = "#E6FCFF";
    }

    setSelected(newArr);
  }

  return ( 
    <div className="add-user">
      <span>Add users to chat:</span>
      <div className="add-user-friends">
        {friendsDisplay}
      </div>
      <button onClick={() => props.close()}>Close</button>
      <button onClick={() => addUsers()}>Add users</button>
    </div>
   );
}
 
export default AddUserBox;