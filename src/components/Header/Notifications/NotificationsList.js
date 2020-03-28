import React, { useContext, useState, useEffect, useRef } from 'react';
import FriendRequestNote from './FriendRequestNote';
import FriendAcceptNote from './FriendAcceptNote';
import { AppContext } from '../../../contexts/AppContext.js';

const NotificationsList = () => {
  // context:
  const { notifications, socket, getNotifications } = useContext(AppContext);

  // state:
    // gets set in display notifications:
  const [notificationsList, setNotificationsList] = useState(<p>Loading</p>); 

  // ref:
  const notificationsListEl = useRef(null);

  // socket:
  

  // effect:
  useEffect(() => {
    getNotifications();
  }, [])

    // calls display notifications:
  useEffect(() => {
    notifications && displayNotifications();
  }, [notifications])

  // maps notifications and returns to notificationsList:
  const displayNotifications = async function() {
    
    const mapNoteList = function() {

      const renderFriendAccept = function(i, notification) {
        return <FriendAcceptNote 
            key={i} index={i} 
            notification={notification} 
            notificationsListEl={notificationsListEl}
          />;
      }

      const renderFriendRequest = function(i, notification) {
        return <FriendRequestNote 
            key={i} index={i} 
            notification={notification} 
            notificationsListEl={notificationsListEl}
          />;
      }

      return notifications.map((notification, i) => 
      {
        switch (notification.note_type) {
          case "friend-request":
            return renderFriendRequest(i, notification);
          case "friend-accept":
            return renderFriendAccept(i, notification);
          default:
            break;
        }
      }); 
    }

    const noNotes = function() {
      return (
        <div key="0">
          You have no notifications at this time.
        </div>
      );
    };

    await setNotificationsList(() => {
      if (notifications) return mapNoteList();
      else return noNotes();
    });
  };

  // render:
  return ( 
    <div className="notifications-list" data-show="no" ref={notificationsListEl}>
      {notificationsList}
    </div>
  );
}
 
export default NotificationsList;
