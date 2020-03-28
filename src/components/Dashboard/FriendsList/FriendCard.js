import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';

export default function FriendCard(props) {
  // context: 
  const { setChatName, changePopup, setDashboardDisplay, user } = useContext(AppContext);

  // state:
  const [friendship] = useState(props.friendship)
  const [friendInfo] = useState(props.friendInfo);

  // render:
  return (
    <div className="friends" onClick={() => {setChatName([user.username, friendInfo.username].sort().join('-')); setDashboardDisplay('message')}}>
      
      <div className="friends-top">
        <span className="friends-name">{friendInfo.name}</span>
        <span className="friends-username">({friendInfo.username})</span>
        <span className="online-indicator"></span>
      </div>
      
      <hr/>

      <div className="friends-middle">
        <div className="friends-options">
          <span>
            Friends since: {new Date(friendship.friend_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="friends-bottom">
        <div className="friend-card-buttons">
            <a onClick={() => {props.closeSidenav(); setChatName([user.username, friendInfo.username].sort().join('-')); setDashboardDisplay("message")}}>
              <i className="material-icons">message</i>
            </a>
            <a onClick={() => {changePopup("block")}}>
              <i className="material-icons">block</i>
            </a>
            <a onClick={() => {changePopup("remove", friendInfo.username)}}>
              <i className="material-icons">remove_circle</i>
            </a>
            <a onClick={() => {changePopup("report")}}>
              <i className="material-icons">feedback</i>
            </a>
          </div>
      </div>
    </div>
  );
}
