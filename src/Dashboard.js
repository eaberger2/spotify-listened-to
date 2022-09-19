import axios from "axios";
import React, { useState, useEffect, Component } from "react";
import "./Dashboard.css";

export default function Dashboard({ songs }) {
    const [photos, setPhotos] = useState();
    const [songNames, setSongNames] = useState();

    var heading = ['Album Cover', 'Song']
    var body = songs;
    console.log({body});
    const column = Object.keys(body[0]);
    console.log({column});

    const ThData = () =>{
        return heading.map((data)=>{
            return <th key={data}>{data}</th>
        })
    }

    const tdData = () => {
        return body.map((data)=>{
            return(
                <tr key={data.index}>
                    <td className="dash-cell-left"><img src={data.albumCover} width="90" height="90"></img></td>
                    <td className="dash-cell-right">{data.trackName}</td>
                </tr>
            )
        })
    }

    //useEffect(() => {
        //getPhoto(token);
    //}, [])

    return (
        <table className="dashboard">
            <thead className="dash-heading">
                <tr>{ThData()}</tr>
            </thead>
            <tbody>
                {tdData()}
            </tbody>
        </table>
    )
};


