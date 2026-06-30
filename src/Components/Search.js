import React, { useState } from 'react';
import '../Stylesheet/Componentstyle.scss'
import { BsFillCalendarWeekFill } from "react-icons/bs";
import { IconContext } from "react-icons";

const SearchBar = (props) => {
      // const [isFocused, setIsFocused] = useState(false);

      // const handleInputChange = event => {
      //       onChange(event.target.value);
      // };

      // const handleFocus = () => {
      //       setIsFocused(true);
      // };

      // const handleBlur = () => {
      //       setIsFocused(false);
      // };

      return (
            <>
            <div className='searchBar'>
                  <input
                        type="text"
                        placeholder="Search Gate entry"
                        {...props}
                        // onChange={handleInputChange}
                        // onFocus={handleFocus}
                        // onBlur={handleBlur}
                  />
                  
                  {/* <div className='searchIcon'>
                        <IconContext.Provider value={{ color: "#000000", size: "20px", type:"bold" }}>
                              <BsFillCalendarWeekFill
                                    type="button"
                              />
                        </IconContext.Provider>
                  </div> */}
            </div>
            </>
      );
};

export default SearchBar;
