import React, { useState, useContext, useEffect } from 'react';
import FriendsSearch from './FriendsSearch.js';
import FriendCard from './FriendCard.js';
import { AppContext } from '../../../contexts/AppContext.js';

export default function FriendsList(props) {
  // context:
  const { user, friends, getFriends } = useContext(AppContext);

  // state:
  const [friendsList, setFriendsList] = useState(<p>Loading. . . </p>)

  useEffect(() => {
    getFriends(user.username);
  }, [])

  // setting updates for friends:
  useEffect(() => {
    async function doStuff() {
      await getFriends(user.username);
      await displayFriends();
    }

    if (props.isOpen) doStuff(); 
  }, [props.isOpen]);

  useEffect(() => {
    
  }, [friends]);

  // displaying friends list:
  const displayFriends = async function() {
    const mapFriendsList = function() {
      if (friends) setFriendsList(friendsInfo.map(
        (obj, i) => {  
          return <FriendCard 
                  key={i} i={i} 
                  friendship={obj.friends} 
                  friendInfo={obj.friendInfo}
                  closeSidenav={props.closeSidenav}
                  />;
      }));

      if (!friends) setFriendsList(
        (
          <div>
            You have no friends to display! Try searching above to find friends.
          </div>
        )
      ); 
    }

    // get all of the friends' info:
    let friendsInfo = [];
    for (let i = 0; i < friends.length; i++) {
      let friendInfo;

      function getName() {
        if (friends[i].user_1 === user.username) {
          return friends[i].user_2
        } else {
          return friends[i].user_1;
        }
      }

      await fetch('/proxy/get-user-update', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        },
        body: JSON.stringify({username: getName()})
      })
      .then(results => {return results.json()})
      .then(data => friendInfo = data)
      .catch(err => console.error(err));

      friendsInfo.push({friendInfo, friends});
    }

    // map that into an array of JSX expressions to display
    mapFriendsList();
  }

  // render:
  return (
    <div
      id="friends-container"
      className="cyan darken-1"
      data-state="hide"
    >
      <div id="friends-list-control">
        <i
          className="material-icons sidenav-close white-text"
          onClick={props.closeSidenav}
        >
          close
        </i>
      </div>
      <h3 className="white-text">FRIENDS</h3>
      <FriendsSearch />
      <div id="friends-list">
        {friendsList}
      </div>
    </div>
  );
}
