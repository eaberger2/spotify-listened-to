import logo from './logo.svg';
import { useEffect, useId, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Route, Routes, Link, Outlet } from 'react-router-dom';
import Search from './Search.js';
import Top from './Top.js';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  const CLIENT_ID = "00c7cd96ee6940879762750970dc5863"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "playlist-read-private user-library-read"

  const [token, setToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    setToken(token)
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
    //window.history.replace()
  }

  return (
    <div className='Header'>
        <h1 className="header">What You've Listened To</h1>
        <div>
        {!token ?
        
          <a href={AUTH_ENDPOINT + "?client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI + "&scope=" + SCOPE + "&response_type=" + RESPONSE_TYPE}>Login to Spotify</a>
          
          : <button className="button" onClick={logout}>Logout</button>}
      </div>
      {window.localStorage.getItem("token") && (
        <Search token={token}/>
      )}

    </div>
  );
}

export default App;

