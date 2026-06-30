import React from "react";

import { Navigate } from "react-router-dom";
 

const Protected=({ children,auth })=>{

 

    const token =localStorage.getItem('token');

 

    if(!auth){

        return <Navigate to="/" replace />

    }

    return children;

}

export default Protected;