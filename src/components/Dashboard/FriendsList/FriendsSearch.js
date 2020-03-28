import React, { useState, useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';

export default function FriendsSearch(props) {
  const [searchResults, setSearchResults] = useState();
  const { user, sendNotification, changePopup, changeUser, socket } = useContext(AppContext);

  const addFriendNotification = async function(friend) {
    let result;

    await fetch(
      '/proxy/add-friend-notification/',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          friend: friend.username,
          user: user.username
        })
      }
    )
    .then(res => {
      if (res.ok) result = true;
      result =  false;
    })
    .then(data => {result = data;})
    .catch(err => {console.error(err)});

    if (result) sendNotification("friend-request", friend);
    if (friend.socket_id) socket.to(friend.socket_id).emit('friend-request');
    return result;
  }

  const handleAdd = async function(friend) {
    let result;

    await addFriendNotification(friend)
    .then(data => result = data)
    .catch(err => console.error(err));


  }

  const displaySearchResults = function() {
    if (searchResults) {
      return (
        <div id="search-results">
          <h1>Search Results:</h1>
          <ul>
            {searchResults.map(
              (friend, i) => {
                return (
                  <li key={i} className="search-user">
                    <img src="http://placehold.it/70x70" alt="pic"/>
                    <div className="search-user-content">
                      <div className="search-user-info">
                        <h3>{friend.name}</h3>
                        <span> - </span>
                        <h4>{friend.username}</h4>
                      </div>
                      <div>
                      <ul className="search-result-buttons">
                        <li>
                          <i className="material-icons" onClick={() => {changeUser(friend); props.closeSidenav();}}>message</i>
                        </li>
                        <li>
                          <i className="material-icons" onClick={() => {handleAdd(friend)}}>add</i>
                        </li>
                        <li>
                          <i className="material-icons" onClick={() => {changePopup("block")}}>not_interested</i>
                        </li>
                        <li>
                          <i className="material-icons" onClick={() => {changePopup("report")}}>feedback</i>
                        </li>
                      </ul>
                      </div>
                    </div>
                  </li>
                )
              }
            )}
          </ul>
        </div>
      )
    }
  }

  const search = async function(e) {
    e.preventDefault();
    let query = e.target.firstElementChild.value;
    let results = [];

    await fetch('/proxy/users-search/?name=' + query)
    .then(res => {return res.json()})
    .then(data => {
      if (data[0] === "[" || data[0] === "{") results = JSON.parse(data);
      else results = data;
    });

    setSearchResults(results);
  }

  return (
    <div id="search-input">
      <form onSubmit={search}>
        <input
          name="users-search"
          type="text"
        />
        <label htmlFor="users-search">Search by name / username</label>
        <input
          className="btn light-blue darken-3"
          type="submit"
          value="Search"
        />
      </form>
      {displaySearchResults()}
    </div>
  )
}
