import React, { useContext } from 'react';
import LandingPage from './components/LandingPage/LandingPage.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import Header from './components/Header/Header.js';
import { AppContext } from './contexts/AppContext.js';

export default function App() {
  const { loggedIn } = useContext(AppContext);

  //page display:
  const displayPage = function() {
    if (loggedIn) {
      return <Dashboard/>
    } else {
      return <LandingPage/>
    }
  };

  //render:
  return (
      <div className="app">
        <Header />
        {displayPage()}
      </div>
  );
}
