import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';

const Badge = () => {
  // context:
  const { notifications, noOfNotifications } = useContext(AppContext);

  // state: 
  const [displayBadge, setDisplayBadge] = useState();
  const [display, setDisplay] = useState("hide");

  // conditionally render:
  useEffect(() => {
    const showBadge = function() {
      setDisplay("show");
      setDisplayBadge((
        <span id="notification-badge" data-state={display}>
          {noOfNotifications}
        </span>
      ));
    }

    const hideBadge = function() {
      setDisplay("hide");
      setDisplayBadge(null);
    }

    if (noOfNotifications > 0) showBadge();
    hideBadge();
  }, [notifications, noOfNotifications])

  // render:
  return ( 
    <span>
      {displayBadge}
    </span>
   );
}
 
export default Badge;