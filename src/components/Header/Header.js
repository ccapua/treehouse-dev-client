import React, { useContext } from 'react';
import Notifications from './Notifications/Notifications.js';
import { AppContext } from '../../contexts/AppContext';

export default function Header() {
  //context:
  const { logout, login, loggedIn, socket, setDashboardDisplay } = useContext(AppContext);

  //login/logout button:
  const log = function() {
    function loggedInHeader() {
      return (
        <li className="nav-buttons">
          <button
            className="cyan darken-1 white-text"
            onClick={() => { socket.close(); logout(); }}
          >
            Log Out
          </button>
        </li>
      );
    }

    function loggedOutHeader() {
      return (
        <li className="nav-buttons">
          <button
            className="cyan darken-1 white-text"
            onClick={() => login()}
          >
            Log In
          </button>
        </li>
      );
    }

    if (loggedIn) return loggedInHeader();
    return loggedOutHeader();
  }

  //notifications display:
  const displayNotifications = function() {
    if (loggedIn) return <Notifications />;
  };

  //render:
  return (
    <nav>
      <div className="nav-wrapper cyan darken-1">
        <div className="row">
          <div className="home nav-buttons flow-text col cyan darken-1" onClick={() => {setDashboardDisplay("home")}}>HOME</div>
          <ul className="col right" >
            {displayNotifications()}
            {log()}
          </ul>
        </div>
      </div>
    </nav>
  )
}
