import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../../contexts/AppContext';

export default function FriendRequestNote(props) {
  
  // context:
  const { sendNotification, addFriend, removeNotification, getNotifications } = useContext(AppContext);
  
  // state:
  const [friend] = useState(props.notification.sender);

  // ref:
  const thisElem = useRef(null);

  return (
    <div id={"note-" + props.index} className="notification-card" ref={thisElem}>
      {props.notification.viewed = true}
      <i
        onClick={async () => {
          await removeNotification(props.notification);
          props.notificationsListEl.current.removeChild(thisElem.current);
        }} 
        className="notification-close material-icons"
      >close</i>
      <p>{props.notification.sender} would like to add you to their friends list. Accepting will add them to your friends list, too.</p>
      <button 
        onClick={async () => {
          await addFriend(friend); 
          removeNotification(props.notification); 
          props.notificationsListEl.current.removeChild(thisElem.current);
        }} 
        className="notification-accept"
      ><i className="material-icons">check</i>Accept</button>
      <button 
        onClick={async () => {
          await removeNotification(props.notification);
          props.notificationsListEl.current.removeChild(thisElem.current);
        }} 
        className="notification-ignore"
      ><i className="material-icons">close</i>Ignore</button>
    </div>
  );

}
