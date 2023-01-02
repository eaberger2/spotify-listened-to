import axios from "axios";
import React, { useState, useEffect, Component } from "react";
import "./Dashboard.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
//import TableCell from '@mui/material/TableCell';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.common.white,
      border: theme.palette.grey[900],
      fontWeight: theme.typography.fontWeightBold,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      border: theme.palette.grey[900],
      fontWeight: theme.typography.fontWeightBold,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


export default function Dashboard({ songs }) {
    const [photos, setPhotos] = useState();
    const [songNames, setSongNames] = useState();

    var heading = ['Album Cover', 'Song']
    var body = songs;
    //console.log({body});
    const column = Object.keys(body[0]);
    //console.log({column});

    /*const thData = () =>{
        return heading.map((data)=>{
            return <th key={data}>{data}</th>
        })
    }*/
    const thData = () => {
        return heading.map((data) => {
            return <StyledTableCell key={data}>{data}</StyledTableCell>
        })
    }

    const tdData = () => {
        return body.map((data)=>{
            return(
                <StyledTableRow key={data.index} sx={{ '&:last-child td, &:last-child th': {border: 0} }}>
                    <StyledTableCell><img src={data.albumCover} width="90" height="90"></img></StyledTableCell>
                    <StyledTableCell>{data.trackName}</StyledTableCell>
                </StyledTableRow>
            )
        })
    }


    /*const tdData = () => {
        return body.map((data)=>{
            return(
                <tr key={data.index}>
                    <td className="dash-cell-left"><img src={data.albumCover} width="90" height="90"></img></td>
                    <td className="dash-cell-right">{data.trackName}</td>
                </tr>
            )
        })
    }*/

    //useEffect(() => {
        //getPhoto(token);
    //}, [])

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {thData()}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tdData()}
                </TableBody>
            </Table>
        </TableContainer>
    )

    {/*return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {thData()}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tdData()}
                </TableBody>
            </Table>
        </TableContainer>
    )*/}
};


{/*<table className="dashboard">
            <thead className="dash-heading">
                <tr>{thData()}</tr>
            </thead>
            <tbody>
                {tdData()}
            </tbody>
        </table>*/}