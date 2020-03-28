import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext.js';

export default function Login(props) {
  // context:
  const { login, socket } = useContext(AppContext);

  // state:
  const [unameEmail, setUnameEmail] = useState(false);
  const [password, setPassword] = useState(false);
  const [response, setResponse] = useState(false);

  // form submit:
  const handleSubmit = async function(e) {
    e.preventDefault();

    let x = new Request('./proxy/login',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          unameEmail: unameEmail,
          password: password
        })
      }
    );

    await fetchData(x);
  };

  // data fetching:
  const fetchData = async function(request) {
    let result;
    request && await fetch(request)
      .then(res => res.json())
      .then(data => result = data)
      .catch(err => console.error(err));
    
    setResponse(result);
    socket && socket.emit('new user', result);
  };

  // error display:
  useEffect(() => {
    if (response) {
      if (response.error) {
        console.error(response.error);
      } else if (response.unameEmailErr || response.passwordErr) {

        let inputs = document.getElementsByTagName('input');
        let labels = document.getElementsByTagName('label');

        if (response.unameEmailErr) {
          labels[0].className="red-text";
          labels[0].innerHTML=response.unameEmailErr;
          inputs[0].value="";
          setUnameEmail("");
        }
        if (response.passwordErr) {
          labels[1].className="red-text";
          labels[1].innerHTML=response.passwordErr;
          inputs[1].value="";
          setPassword("");
        }
        if (response === "Error inserting into database") {
          document.getElementsByTagName('form')[0].innerHTML =
          `<p>There was an error accessing the database. Please contact
            support or try logging in again later.</p>`;
        }
      } else if (response.username) {
        login(response);
      }
    }
  }, [login, response]);

  // render:
  return (
    <form className="container" onSubmit={handleSubmit.bind(this)}>
      <div className="input-field">
        <input type="text"
          name="username"
          onChange={e => setUnameEmail(e.target.value)}
        />
        <label htmlFor="username">
          Enter your username
        </label>
      </div>
      <div className="input-field">
        <input type="password"
          name="password"
          onChange={e => setPassword(e.target.value)}
        />
        <label htmlFor="password">Password</label>
      </div>
      <input className="btn-small cyan"
        type="submit"
        name="submit"
        value="Submit"
      />
    </form>
  );
}
