import './Login.css';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Logo from './components/Logo.js';
import BackBtn from './components/BackBtn.js';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrongCredentials, setWrongCredentials] = useState(false);

  useEffect( () => {
    isLoggedIn();
  }, []);

  async function isLoggedIn() {
    const response = await fetch('http://localhost:3000/api/staff/loggedin',
    {
        method: 'GET',
        credentials: "include"
    });
    const data = await response.json();

    if(data.loggedIn) {
      navigate('/staff/verify');
    }
  }

  const login = async (e, user, pass) => {
    e.preventDefault();
    const obj = {
      username: user,
      password: pass
    }

    const response = await fetch('http://localhost:3000/api/staff/login', {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const loggedIn = await response.json();

    if(loggedIn.success) {
      navigate('/staff/verify');
    } else {
      setWrongCredentials(true);
    }
  }

  function goBack() {
    navigate('/');
  }

  return (
    <div className="Login">
      <div onClick={() => goBack()}>
        <BackBtn />
      </div>
      <Logo></Logo>
      <form className="loginForm">
        <input 
          type="text"
          placeholder="Username"
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          id="username"
        />
        <input 
          className="marginTopBottom"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          id="password"
        />
        <p className="errorMsg">{ wrongCredentials ? "Wrong user credentials." : "" }</p>
        <button className="marginBottom" id="login" onClick={(e) => login(e, username, password)}>Log in</button>
      </form>
    </div>
  );
}

export default Login;
