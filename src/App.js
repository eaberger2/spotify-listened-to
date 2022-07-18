import logo from './logo.svg';
import {useEffect, useId, useState} from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './Dashboard.js'

function App() {
  const CLIENT_ID = "00c7cd96ee6940879762750970dc5863"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState("")
  const [userId, setUserId] = useState("")
  const [playlist_id, setPlaylistId] = useState("")
  //const [playlists, setPlayLists] = useState("") 

  useEffect(()=> {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if(!token && hash){
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("token",token)
    }
    setToken(token)

  },[])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  /*const getPlaylists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/users/user_id/playlists", {
      headers: {
        Authorization: 'Bearer '+token,
      }
    })
  }*/

  /*const getUserId = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: 'Bearer '+token,
      }
    })
    setUserId(data.id)
  }*/

  /*const getUserId = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: 'Bearer '+token
      }
    })
    setUserId(data.id)
  }*/

  const getPlaylists = async (e) => {
  e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: 'Bearer '+token
      },
      params: {
        limit: 50,
        offset: 0
      }
    })
    console.log({data})
    setPlaylistId(data.items[0].id)
    getTracks()
    /*e.preventDefault()
    const {newData} = await axios.get("https://api.spotify.com/v1/playlists/1pSFzybscOUcx4YDTtVzHq/tracks", {
      headers: {
        Authorization: 'Bearer '+token
      },
      params: {
        additional_types: "track",
        fields: "items(track(name,href,album(name,href)))",
        limit: 50,
        market: "US",
        offset: 0
      }
    })
    console.log({newData})
    */
  }

  const getTracks = () => {
    const {newData} = axios.get("https://api.spotify.com/v1/playlists/${playlist_id}/tracks", {
      headers: {
        Authorization: 'Bearer '+token
      },
      params: {
        additional_types: "track",
        fields: "items(track(name,href,album(name,href)))",
        limit: 50,
        market: "US",
        offset: 0
      }
    })
    console.log({newData})
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search",{
      headers: {
        Authorization: 'Bearer '+token
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })
    setArtists(data.artists.items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
        {artist.name}
      </div>
    ))
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>What You've Listened To</h1>
        {!token ?
        
        <a href= { AUTH_ENDPOINT + "?client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI + "&response_type=" + RESPONSE_TYPE }>Login to Spotify</a>
          
        : <button onClick={logout}>Logout</button>}

          {token && (
            <Dashboard token={token}/>
          )}

      </header>
    </div>
  );
}

export default App;
