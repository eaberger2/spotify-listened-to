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
import { Compare } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.common.white,
      border: theme.palette.grey[900],
      fontWeight: theme.typography.fontWeightBold,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      //backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      border: theme.palette.grey[900],
      fontWeight: theme.typography.fontWeightBold,
      padding: 10,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.grey[700],
    },
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.grey[600],
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


export default function Dashboard({ songs }) {
    const [photos, setPhotos] = useState();
    const [songNames, setSongNames] = useState();

    var heading = ['Album Cover', 'Song', 'Frequency']
    var body = sortFreq(songs);
    //const column = Object.keys(body[0]);

    function compareFreq( a, b ){
        if(a.frequency < b.frequency){
            return -1;
        }
        if(a.frequency > b.freqeuncy){
            return 1;
        }
        return 0;
    }

    function sortFreq( songs ){
        songs.sort((a,b) => b.frequency - a.frequency);
        return songs;
    }

    const thData = () => {
        return heading.map((data) => {
            return <StyledTableCell key={data}>{data}</StyledTableCell>
        })
    }

    const tdData = () => {
        return body.map((data)=>{
            return(
                <StyledTableRow key={data.index} sx={{ '&:last-child td, &:last-child th': {border: 0} }}>
                    <StyledTableCell><img src={data.albumCover} width="60" height="60"></img></StyledTableCell>
                    <StyledTableCell>{data.trackName}</StyledTableCell>
                    <StyledTableCell>{data.frequency}</StyledTableCell>
                </StyledTableRow>
            )
        })
    }

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
    );
};
