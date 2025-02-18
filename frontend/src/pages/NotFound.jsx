import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
const NotFound = () => {
  return (
    <>
    <Navigation/>
    <div className="fullImageContainer">
      <img src="../../PageNotFound.jpg" alt="" />
      <Link to="/">Go to Home</Link>
    </div>
    </>
  );
};

export default NotFound;