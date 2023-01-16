import { render } from "@testing-library/react";
import axios from "axios";
import React, { useState, useEffect, Component } from "react";
import App from "./App.js";
import Dashboard from './Dashboard.js';
import './Search.css';
import {Input, Space} from 'antd';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Search({ token }) {

    const [submit, setSubmit] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [playlistsLength, setPlaylistsLength] = useState();
    const [triggerUseEffect, setTriggerUseEffect] = useState(0);
    const [artist, setArtist] = useState("");
    const [songList, setSongList] = useState();
    const [logoutRequest, setLogoutRequest] = useState(false);

    let displayName = "";

    const getUsername = async (token) => {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).catch(err => {
            if(err.message.includes('401') || err.message.includes('400')){
                logout()
            }
        });
        displayName = data.display_name;
    }

    const changeHandler = async (event) => {
        const inputArtist = event.target.value;
        setTriggerUseEffect(p => p + 1);
        setArtist(inputArtist);
    }

    function submitHandler(e) {
        e.preventDefault();
        setSongList(null);
        setSubmit(true);
        if (artist.length > 0){
            fetchSongs(token);
            //fetchSongsImproved(token);
        }
    }

    const logout = () => {
        //window.localStorage.setItem("logout",true);
        window.localStorage.removeItem("token");
        setLogoutRequest(true);
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
                        
                        if (artist.toLowerCase() == songs.items[i].track.artists[j].name.toLowerCase() && !songIds.includes(songs.items[i].track.external_ids.isrc)) {
                            const song = {id: songs.items[i].track.external_ids.isrc,
                                trackName: songs.items[i].track.name,
                                albumCover: songs.items[i].track.album.images[1].url,
                                albumName: songs.items[i].track.album.name,
                                frequency: 1};
                            //console.log(songs.items[i].track.name);
                            songArr.push(song);
                            songIds.push(songs.items[i].track.external_ids.isrc);
                        }
                        else{
                        if(artist.toLowerCase() == songs.items[i].track.artists[j].name.toLowerCase() && songIds.includes(songs.items[i].track.external_ids.isrc)){
                            const oldSong = songArr.find(element => element.id == songs.items[i].track.external_ids.isrc)
                            oldSong.frequency = oldSong.frequency + 1
                        }
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
                            if (artist.toLowerCase() == songs.items[i].track.artists[j].name.toLowerCase() && !songIds.includes(songs.items[i].track.external_ids.isrc)) {
                                const song = {id: songs.items[i].track.external_ids.isrc,
                                    trackName: songs.items[i].track.name,
                                    albumCover: songs.items[i].track.album.images[1],
                                    albumName: songs.items[i].track.album.name};
                                //console.log(songs.items[i].track.name);
                                songArr.push(song);
                                songIds.push(songs.items[i].track.external_ids.isrc);
                            }
                            else{
                            if(artist.toLowerCase() == songs.items[i].track.artists[j].name.toLowerCase() && songIds.includes(songs.items[i].track.external_ids.isrc)){
                                const oldSong = songArr.find(element => element.id == songs.items[i].track.external_ids.isrc)
                                oldSong.frequency = oldSong.frequency + 1
                            }
                        }
                        }
                    }
                }
                if (songs.items.length < 50) {
                    repeat = false;
                }
            }
        }
        //Add saved songs
        const { data: saved } = await axios.get("https://api.spotify.com/v1/me/tracks", {
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
        for (let i = 0; i < saved.items.length; i++) {
            if (saved.items[i].track != null) {
                for (let j = 0; j < saved.items[i].track.artists.length; j++) {
                    if (artist.toLowerCase() == saved.items[i].track.artists[j].name.toLowerCase() && !songIds.includes(saved.items[i].track.external_ids.isrc)) {
                        const save = {id: saved.items[i].track.external_ids.isrc,
                            trackName: saved.items[i].track.name,
                            albumCover: saved.items[i].track.album.images[1],
                            albumName: saved.items[i].track.album.name};
                        //console.log(songs.items[i].track.name);
                        songArr.push(save);
                        songIds.push(saved.items[i].track.external_ids.isrc);
                    }
                    else{
                    if(artist.toLowerCase() == saved.items[i].track.artists[j].name.toLowerCase() && songIds.includes(saved.items[i].track.external_ids.isrc)){
                        const oldSong = songArr.find(element => element.id == saved.items[i].track.external_ids.isrc)
                        oldSong.frequency = oldSong.frequency + 1
                    }
                }
                }
            }
        }
        let repeat = false;
        if (saved.items.length === 50) {
            repeat= true;
        }
        while (repeat) {
            set += 50;
                const { data: saved } = await axios.get("https://api.spotify.com/v1/me/tracks", {
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
                for (let i = 0; i < saved.items.length; i++) {
                    if (saved.items[i].track != null) {
                        for (let j = 0; j < saved.items[i].track.artists.length; j++) {
                            if (artist.toLowerCase() == saved.items[i].track.artists[j].name.toLowerCase() && !songIds.includes(saved.items[i].track.external_ids.isrc)) {
                                const save = {id: saved.items[i].track.external_ids.isrc,
                                    trackName: saved.items[i].track.name,
                                    albumCover: saved.items[i].track.album.images[1],
                                    albumName: saved.items[i].track.album.name};
                                //console.log(songs.items[i].track.name);
                                songArr.push(save);
                                songIds.push(saved.items[i].track.external_ids.isrc);
                            }
                            else{
                            if(artist.toLowerCase() == saved.items[i].track.artists[j].name.toLowerCase() && songIds.includes(saved.items[i].track.external_ids.isrc)){
                                const oldSong = songArr.find(element => element.id == saved.items[i].track.external_ids.isrc)
                                oldSong.frequency = oldSong.frequency + 1
                            }
                        }
                        }
                    }
                }
                if (saved.items.length < 50) {
                    repeat = false;
                }
        }

        setSongList(songArr);
    }

    useEffect(() => {

        const getPlaylists = async (token) => {
            var playlistsArr = [];
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
                if(err.message.includes('401') || err.message.includes('400')){
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
                    if(err.message.includes('401') || err.message.includes('400')){
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
    }, [triggerUseEffect])

    return (
        <div>
            {logoutRequest && (
                <h2 className="logout">Your token has expired, please logout and re-login.</h2>
            )}
            <Row>
                <Col>
                <form onSubmit={submitHandler} className="search">
                    <input
                    value={artist}
                    placeholder={"Search Artist"}
                    onChange={changeHandler}
                    className="input-element"
                    />
                    <button type={"submit"} className="search-button">Submit</button>    
                </form>
                </Col>
            </Row>
            {!songList && submit && !logoutRequest && (
                <h2 className="retrieve">Retrieving data...</h2>
            )}
            {songList && songList.length != 0 &&(
                <Dashboard token={token} songs={songList} />
            )}
            {songList && songList.length == 0 &&(
                <h2 className="logout">No songs found by this artist.</h2>
            )}
        </div>
    );
};
