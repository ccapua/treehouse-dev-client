import React, { useState, useEffect } from 'react';

export default function SignUp(props) {
  //state:
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [response, setResponse] = useState(false);

  //data fetching:
  const fetchData = async function(req) {
    let parsedData;

    await fetch(req)
    .then(res => {
      if (res.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
        res.status);
        throw Error(res.statusText);
      }

      return res.json()
    })
    .then(data => {parsedData = data})
    .catch(err => {console.error(err)});

    setResponse(parsedData);
  }

  //handling signup submit:
  const handleSubmit = async function(e) {
    e.preventDefault();

    let x = new Request('./proxy/signup',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type':'application/json'
        },
        body: JSON.stringify(
          {
            name: name,
            username: username,
            email: email,
            password: password,
            password2: password2
          })
      }
    );

    fetchData(x);
  }

  //error rendering:
  useEffect(() => {
    if (response) {
      console.log(response);
      if (!response.errorFree) {
        let labels = document.getElementsByTagName('label');

        if (response.nameErr) {
          labels[0].className="red-text";
          labels[0].innerHTML=response.nameErr;
          setName("");
        }
        if (response.usernameErr) {
          labels[1].className="red-text";
          labels[1].innerHTML=response.usernameErr;
          setUsername("");
        }
        if (response.emailErr) {
          labels[2].className="red-text";
          labels[2].innerHTML=response.emailErr;
          setEmail("");
        }
        if (response.passwordErr) {
          labels[3].className="red-text";
          labels[3].innerHTML=response.passwordErr;
          setPassword("");
        }
        if (response.password2Err) {
          labels[4].className="red-text";
          labels[4].innerHTML=response.password2Err;
          setPassword2("");
        }
      }

      if (response.insertSuccess) {
        console.log('yip');
        props.signup();
      } else if (response.insertSuccess === false) {
        document.getElementsByTagName('form')[0].innerHTML = `<p>There was an
        error accessing the database. Please contact support or signup again
        later.</p>`;
      }
    }
  }, [response]);

  //render:
  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="input-field">
        <input type="text" name="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label htmlFor="name">Enter your name *</label>
      </div>
      <div className="input-field">
        <input type="text" name="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <label htmlFor="username">Enter your desired username *</label>
      </div>
      <div className="input-field">
        <input type="email" name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="email">Enter your email *</label>
      </div>
      <div className="input-field">
        <input type="password" name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label htmlFor="password">Enter your password *</label>
      </div>
      <div className="input-field">
        <input type="password" name="password2"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
        />
        <label htmlFor="password2">Retype your password *</label>
      </div>
      <input className="btn-small cyan"
          type="submit" name="submit" value="Submit"/>
    </form>
  );
}
