import React,{useContext} from "react";
import { Navigate } from "react-router-dom";
import AuthContext  from "../context/AuthContext";

const Userroute = ({ children }) => {
  const { user} = useContext(AuthContext);

  if (user){
    return <Navigate to="/" />;
  }
  // If the user is not authenticated, render the children (the login/register page)
  
  return children;
  
}
export default Userroute;