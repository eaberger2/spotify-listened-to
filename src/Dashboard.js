import axios from "axios";
import React, {useState, useEffect} from "react";
export default function Dashboard({token}) {
    
    const [playlist_id, setPlaylistId] = useState([]);
    const [href, setHref] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const getTracks = async (token) =>{
        const {tracks} = await axios.get("https://api.spotify.com/v1/playlists/4FteCV6SQS8yKc6pzFlZnv/tracks", {
            headers: {
                Authorization: 'Bearer '+token
            },
            params: {
                market: "US",
                limit: 50,
                offset: 0
            }
            })
            console.log({tracks})
        }
       
        setIsMounted(true);
        //getPlaylists(token);
        getTracks(token);
    }, [])

    if(isMounted)
    return(
        <div className="Dashboard">
            <h1>Hello</h1>
        </div>
    )
};