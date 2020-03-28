import React, { useContext, useState, useRef, useEffect } from 'react';
import FriendsList from './FriendsList/FriendsList.js';
import ChatsList from './ChatsList/ChatsList.js';
import NotificationsList from '../Header/Notifications/NotificationsList.js';
import { AppContext } from '../../contexts/AppContext.js';
import ChatPage from './ChatPage/ChatPage.js';

export default function Dashboard() {
  //context:
  const { removeFriend, socket, user, failToAdd, popup, userToMsg, dashboardDisplay, changePopup } = useContext(AppContext);

  // state:
  const [isOpen, setIsOpen] = useState(false);
  
  //opening sidenav:
  const openSidenav = function() {
    const el = document.getElementById("friends-container");
    el.dataset.state="show";
    setIsOpen(true);
  }

  //closing sidenav:
  const closeSidenav = function() {
    const el = document.getElementById("friends-container");
    el.dataset.state="hide";
    setIsOpen(false);
  }

  const handleBlock = function() {

  }

  const handleRemove = function() {

  }

  // dashboard body:
  const dashboardBody = function() {
    switch (dashboardDisplay) {
      case "home":
        return(
          <div className="container dashboard-body">
            {failToAdd}
            <NotificationsList />
            <ChatsList/>
            <FriendsList isOpen={isOpen} closeSidenav={closeSidenav.bind(this)}/>
          </div>
        );
      case "message":
        return(
          <div className="container dashboard-body">
            <ChatPage/>
            <FriendsList isOpen={isOpen} closeSidenav={closeSidenav.bind(this)}/>
          </div>
        );
      default:
        break;
    }
  }

  // popup contents:
  const popupContents = function() {
    var popupEl = document.getElementById("popup");

    const displayPopup = function() {
      switch(popup) {
        case "block":
          return (
            <div id="block-message">
              <i onClick={() => {changePopup('')}} className="material-icons">close</i>
              <div>
                This will block the user. You will no longer receive messages or notifications from them. <br/><br/>
                Continue?
                <button>Yes, block them</button>
                <button onClick={() => {changePopup('')}}>No</button>
              </div>
            </div>
          )
        case "report":
          return (
            <div id="report-message">
              <div>
                <i onClick={() => {changePopup('')}} className="material-icons">close</i>
                <div>
                  Report message will go here one day.
                </div>
              </div>
            </div>
          );
        case "remove":
          return(
            <div id="remove-message">
              <i onClick={() => {changePopup('')}} className="material-icons">close</i>
              <div>
                This will remove the user from your friends list.<br/><br/>
                Continue?
                <button onClick={() => {removeFriend()}}>Yes, remove them.</button>
                <button onClick={() => {changePopup('')}}>No</button>
              </div>
            </div>
          );
        case "friend":
          return(
            <div id="friend-message">
              <i onClick={() => {changePopup('')}} className="material-icons">close</i>
              <div>
                Friend request has been sent.
              </div>
            </div>
          )
        case "":
          popupEl.dataset.state="hide";
        default:
            popupEl.dataset.state="hide";
          return;
      }
    }

    if (popupEl) return displayPopup();
  }

  //render:
  return (
    <div className="dashboard row">
      <div id="popup" data-state="hide" onClick={() => {changePopup('')}}>
        {popupContents()}
      </div>
      <div
        id="sidenav-show"
        className="cyan darken-2 white-text"
        onClick={openSidenav}
      >
        <i className="material-icons">chevron_right</i>
        <div>F</div>
        <div>R</div>
        <div>I</div>
        <div>E</div>
        <div>N</div>
        <div>D</div>
        <div>S</div>
        <i className="material-icons">chevron_right</i>
      </div>
      {dashboardBody()}
    </div>
  );
}
