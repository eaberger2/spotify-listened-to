
import React from 'react';

const SearchBar = ({setSearchKey}) => {
  const BarStyling = {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};
  return (
    <input 
     style={BarStyling}
     key="random1"
     placeholder={"search artist"}
     onChange={(e) => setSearchKey(e.target.value)}
    />
  );
}
export default SearchBar