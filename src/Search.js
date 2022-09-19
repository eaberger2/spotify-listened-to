import { render } from "@testing-library/react";
import axios from "axios";
import React, { useState, useEffect, Component } from "react";
import App from "./App.js";
import Dashboard from './Dashboard.js';
import './Search.css';

export default function Search({ token }) {

    const [submit, setSubmit] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [playlistsLength, setPlaylistsLength] = useState();
    const [triggerUseEffect, setTriggerUseEffect] = useState(0);
    const [artist, setArtist] = useState("");
    const [songList, setSongList] = useState();


    let displayName = "";

    const getUsername = async (token) => {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).catch(err => {
            if(err.message.includes('401')){
                logout()
            }
        });
        displayName = data.display_name;
    }

    const changeHandler = async (event) => {
        const inputArtist = event.target.value;
        setArtist(inputArtist);
    }

    function submitHandler(e) {
        e.preventDefault();
        setSubmit(true);
        if (artist.length > 0)
            fetchSongs(token);
    }

    const logout = () => {
        App.setToken("")
        window.localStorage.removeItem("token")
        window.history.replace()
      }

    const fetchSongs = async (token) => {
        if(artist==""){
            return;
        }
        var songArr = [];
        var songIds = [];
        var songArrIndex = 0;
        var set = 0;
        for (let t = 0; t < playlists.length; t++) {
            const { data: songs } = await axios.get(playlists[t], {
                headers: {
                    Authorization: 'Bearer ' + token
                },
                params: {
                    limit: 50,
                    offset: 0
                }
            }).catch(err => {
                if(err.message.includes('401')){
                    logout()
                }
            });
            for (let i = 0; i < songs.items.length; i++) {
                if (songs.items[i].track != null) {
                    for (let j = 0; j < songs.items[i].track.artists.length; j++) {
                        if (artist == songs.items[i].track.artists[j].name && !songIds.includes(songs.items[i].track.external_ids.isrc)) {
                            const song = {id: songs.items[i].track.external_ids.isrc,
                                trackName: songs.items[i].track.name,
                                albumCover: songs.items[i].track.album.images[1].url,
                                albumName: songs.items[i].track.album.name};
                            console.log(songs.items[i].track.name);
                            songArr.push(song);
                            songIds.push(songs.items[i].track.external_ids.isrc);
                        }
                    }
                }
            }
            let repeat = false;
            if (songs.items.length === 50) {
                repeat = true;
            }
            while (repeat) {
                set += 50;
                const { data: songs } = await axios.get(playlists[t], {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        limit: 50,
                        offset: set
                    }
                }).catch(err => {
                    if(err.message.includes('401')){
                        logout()
                    }
                });
                for (let i = 0; i < songs.items.length; i++) {
                    if (songs.items[i].track != null) {
                        for (let j = 0; j < songs.items[i].track.artists.length; j++) {
                            if (artist == songs.items[i].track.artists[j].name && !songIds.includes(songs.items[i].track.external_ids.isrc)) {
                                const song = {id: songs.items[i].track.external_ids.isrc,
                                    trackName: songs.items[i].track.name,
                                    albumCover: songs.items[i].track.album.images[1],
                                    albumName: songs.items[i].track.album.name};
                                console.log(songs.items[i].track.name);
                                songArr.push(song);
                                songIds.push(songs.items[i].track.external_ids.isrc);
                            }
                        }
                    }
                }
                if (songs.items.length < 50) {
                    repeat = false;
                }
            }
        }
        setSongList(songArr);
    }

    const fetchSaved = async (token) => {
        const { data: saved } = await axios.get("https://api.spotify.com/v1/me/tracks", {
            headers: {
                Authorization: 'Bearer ' + token
            },
            params: {
                limit: 50,
                offset: 0
            }
        })
        console.log(saved);
    } 

    useEffect(() => {

        const getPlaylists = async (token) => {
            var playlistsArr = [];
            //var playlistIndex = 0;
            var set = 0;

            const { data } = await axios.get("https://api.spotify.com/v1/me/playlists", {
                headers: {
                    Authorization: 'Bearer ' + token
                },
                params: {
                    limit: 50,
                    offset: set
                }
            }).catch(err => {
                if(err.message.includes('401')){
                    logout()
                }
            });

            for (let i = 0; i < data.items.length; i++) {
                if (data.items[i].owner.display_name == displayName) {
                    playlistsArr.push(data.items[i].tracks.href);
                }
            }

            let repeat = false;
            if (data.items.length === 50) {
                repeat = true;
            }

            while (repeat) {
                set += 50;
                const { data: newData } = await axios.get("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        limit: 50,
                        offset: set
                    }
                }).catch(err => {
                    if(err.message.includes('401')){
                        logout()
                    }
                });
                for (let i = 0; i < newData.items.length; i++) {
                    if (newData.items[i].owner.display_name == displayName) {
                        playlistsArr.push(newData.items[i].tracks.href);
                    }
                }
                if (newData.items.length < 50) {
                    repeat = false;
                }
            }

            setPlaylists(playlistsArr);
            setPlaylistsLength(playlists.length)
            if (playlists.length >= 0 && playlistsArr.length != playlistsLength)
                setTriggerUseEffect(p => p + 1);
        }

        getUsername(token);
        if (displayName != null)
            getPlaylists(token);
        console.log(triggerUseEffect);
        console.log(playlists);
    }, [triggerUseEffect])


    return (
        <div className="search">
            <form onSubmit={submitHandler}>
                <div className="search-wrap">
                    <input
                    value={artist}
                    placeholder={"Search Artist"}
                    className="input-element"
                    onChange={changeHandler}
                    />
                    <button type={"submit"} className="search-button">Submit</button>
                </div>
            </form>
            {!songList && submit && (
                <h2 className="retrieve">Retrieving data...</h2>
            )}
            {songList && songList.length != 0 &&(
                <Dashboard token={token} songs={songList} />
            )}
            {songList && songList.length == 0 &&(
                <h2 className="retrieve">No songs found by this artist</h2>
            )}
        </div>
    );
};
