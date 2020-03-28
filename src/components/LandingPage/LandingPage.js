import React, { useState } from 'react';
import LogIn from './Forms/LogIn.js';
import SignUp from './Forms/SignUp.js';


export default function LandingPage(props) {
  //state:
  const [form, setForm] = useState('');

  //form display:
  function displayForm() {

    switch(form) {
      case 'signup':
        return <SignUp signup={signup}/>
      case 'login':
        return <LogIn />
      case 'login-signedup':
        return (
          <div>
            <p className="flow-text">Signed up successfully. Log in, log in!</p>
            <LogIn
            />
            </div>
        );
      default:
        return true;
    }
  }

  //login-signedup form (for after signup):
  function signup() {
    setForm('login-signedup')
  }

  return (
    <div className="landing-page center-align">
      <div className="container blurb">
        <h2>Welcome to Treehouse Chat!</h2>
        <p>This app is a work in progress</p>
        <p>Here is what you can do with this app so far:</p>
        <ol>
          <li>Sign up</li>
          <li>Log in</li>
          <li>Search for users</li>
          <li>Add users as friends</li>
          <li>Send messages to friends</li>
        </ol>
      </div>
      <div className="container form-buttons">
        <div
          className="btn cyan darken-1"
          onClick={() => setForm('signup')}
        >
          Sign Up
        </div>
        <div
          className="btn cyan darken-1"
          onClick={() => setForm('login')}
        >
          Log In
        </div>
        {displayForm()}
      </div>
    </div>
  );
}
