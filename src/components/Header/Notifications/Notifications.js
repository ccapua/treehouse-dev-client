import React, {  } from 'react';
import Badge from './Badge.js';

export default function Notifications() {  
  // shows or hides notifications menu: 
  const toggleShow = function() {
    const el = document.getElementsByClassName('notifications-list')[0];
    switch(el.dataset.show) {
      case 'yes':
        el.dataset.show = "no";
        break;
      case 'no':
        el.dataset.show = "yes";
        break;
      default:
        break;
    }
  }

  return (
    <li className="nav-buttons">
      <button onClick={toggleShow} id="notifications-button">
        <i className="material-icons">notifications</i>
        <Badge />
      </button>
    </li>
  );
}
