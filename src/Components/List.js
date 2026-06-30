import React from 'react';
import { List, ListItem, ListItemText, Badge } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";

const AttractiveList = (props) => {
      const navigate = useNavigate()

      let { data, onPress, route } = props

      // console.log(data)

      return (
            <>
                  <div >
                        {data && data.map((item, index) => (
                              <div className='listDiv' onClick={() => navigate(route, { state: item })}>
                                    <p className='reportHead' style={{ colour: "black" }}>Gate Pass Number : {item.GATE_ENTRY_NO}</p>
                                    <p className='reportHead1'>Vendor Name : {item.VENDOR_NAME}</p>
                                    <p className='reportHead1'>Entry Date : {new Date(item.INWARD_DATETIME).toDateString()}</p>
                                    {item.FLAG && <p className='reportHead1'>Status : {item.FLAG == 2 ? "Updated" : item.FLAG == 3 ? "Cancelled" : "Created"}</p>}
                              </div>
                        ))}
                  </div>
            </>
      );
};

export default AttractiveList;
