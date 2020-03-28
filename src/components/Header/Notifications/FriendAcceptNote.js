import React, { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';

export default function FriendAcceptNote(props) {

  // context:
  const { removeNotification } = useContext(AppContext);

  return (
    <li>
      <button onClick={removeNotification(props.notification)}>
        <i className="material-icons">close</i>
      </button>
      <p>You and {props.notification.sender} are now friends.
        Send them a message!</p>
      <button onClick={()=> true}>
        Send message
        <i className="material-icons">comment</i>
      </button>
    </li>
  )

}
